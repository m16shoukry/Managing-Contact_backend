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
      throw new Error("Contact not found");
    }

    if (contact.lockedBy && contact.lockedBy !== userId) {
      throw new Error("This contact is being edited by another user");
    }

    contact.lockedBy = userId;
    contact.lockedUntil = new Date(Date.now() + 30 * 1000);

    Object.assign(contact, updateContactDto);
    await contact.save();

    this.sseService.broadcast(`contact-locks/${id}`, {
      lockedBy: userId,
      contactId: id,
    });

    return contact;
  }

  async unlockContact(id: string, userId: Types.ObjectId): Promise<void> {
    const contact = await this.contactRepository.findById(id);

    if (!contact) {
      throw new Error("Contact not found");
    }

    if (contact.lockedBy !== userId) {
      throw new Error("You cannot unlock this contact.");
    }

    contact.lockedBy = undefined;
    contact.lockedUntil = undefined;
    await contact.save();

    this.sseService.broadcast(`contact-locks/${id}`, {
      lockedBy: null,
      contactId: id,
    });
  }

  async deleteContact(id: string, userId: string): Promise<void> {
    const contact = await this.contactRepository.findById(id);
    if (!contact) {
      throw new Error("Contact not found");
    }

    if (contact.userId.toString() !== userId) {
      throw new Error("You can only delete your own contacts");
    }

    await this.contactRepository.softDelete(id);
  }
}
