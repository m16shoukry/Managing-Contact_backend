import {
  CreateContactDto,
  ListContactsFilterDto,
  UpdateContactDto,
} from "../dtos/contact.dto";
import { ContactRepository } from "../repositories/contact.repository";
import { IContact } from "../models/contact.model";
import { PaginationResultDto } from "../dtos/pagination.dto";
import { Types } from "mongoose";
import { SSEService } from "./SSE.service";
import { ErrorApiResponse } from "../core/api-response/Error-api-response.dto";

export class ContactService {
  private contactRepository: ContactRepository;
  private sseService: SSEService;

  constructor(contactRepository: ContactRepository, sseService: SSEService) {
    this.contactRepository = contactRepository;
    this.sseService = sseService;
  }

  async addContact(
    contactData: CreateContactDto,
    userId: Types.ObjectId
  ): Promise<IContact> {
    return this.contactRepository.create({ ...contactData, userId });
  }

  async listContacts(
    page: number,
    limit: number,
    userId: string,
    filters: ListContactsFilterDto
  ): Promise<PaginationResultDto<IContact>> {
    const skip = (page - 1) * limit;

    const extendedFilter = { ...filters, userId, deleted: false };

    const [contacts, totalItems] = await Promise.all([
      this.contactRepository.find(extendedFilter, skip, limit),
      this.contactRepository.count(extendedFilter),
    ]);

    return new PaginationResultDto(contacts, totalItems, page, limit);
  }

  async updateContact(
    id: string,
    updateContactDto: UpdateContactDto,
    userId: Types.ObjectId
  ): Promise<IContact> {
    const contact = await this.contactRepository.findById(id);
    if (!contact) {
      throw new ErrorApiResponse("Contact not found");
    }

    if (contact.lockedBy && contact.lockedBy.toString() !== userId.toString()) {
      throw new ErrorApiResponse("Contact is updating...");
    }

    Object.assign(contact, updateContactDto, {
      lockedBy: null,
      lockedUntil: null,
    });
    await contact.save();

    this.sseService.broadcast("contact-locks", {
      lockedBy: null,
      contactId: id,
      lockedUntil: null,
    });

    return contact;
  }

  async lockContact(id: string, userId: Types.ObjectId): Promise<IContact> {
    const contact = await this.contactRepository.findById(id);
    if (!contact) {
      throw new ErrorApiResponse("Contact not found");
    }

    if (contact.lockedBy && contact.lockedBy !== userId) {
      throw new ErrorApiResponse(
        "This contact is already locked by another user"
      );
    }

    contact.lockedBy = userId;
    contact.lockedUntil = new Date(Date.now() + 30 * 1000); // 30 seconds lock
    await contact.save();

    this.sseService.broadcast("contact-locks", {
      lockedBy: userId,
      contactId: id,
      lockedUntil: new Date(Date.now() + 60 * 1000),
    });

    return contact;
  }

  async deleteContact(id: string, userId: string): Promise<void> {
    const contact = await this.contactRepository.findById(id);
    if (!contact) {
      throw new ErrorApiResponse("Contact not found");
    }

    if (contact.userId.toString() !== userId) {
      throw new ErrorApiResponse("You can only delete your own contacts");
    }

    if (contact.lockedUntil && new Date(contact.lockedUntil) > new Date()) {
      throw new ErrorApiResponse(
        "This contact is locked by another user and cannot be deleted."
      );
    }

    await this.contactRepository.softDelete(id);
  }
}
