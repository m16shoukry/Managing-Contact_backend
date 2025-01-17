import { Request, Response } from "express";
import { ContactService } from "../services/contact.service";
import { SuccessApiResponse } from "../core/api-response/success-api-response.dto";
import { ErrorApiResponse } from "../core/api-response/Error-api-response.dto";
import { ListContactsFilterDto } from "../dtos/contact.dto";

export class ContactController {
  private contactService: ContactService;

  constructor(contactService: ContactService) {
    this.contactService = contactService;
  }

  addContact = async (req: Request, res: Response): Promise<void> => {
    try {
      const newContact = await this.contactService.addContact(
        req.body,
        req["userId"]
      );
      res.status(201).json(new SuccessApiResponse(newContact));
    } catch (error: any) {
      res.status(500).json(new ErrorApiResponse(error.message));
    }
  };

  listContacts = async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 5, name, phone, address } = req.query;
    const filters: ListContactsFilterDto = {
      name,
      phone,
      address,
    } as ListContactsFilterDto;

    try {
      const contacts = await this.contactService.listContacts(
        parseInt(page as string),
        parseInt(limit as string),
        req["userId"],
        filters
      );
      res.status(200).json(contacts);
    } catch (error: any) {
      res.status(500).json(new ErrorApiResponse(error.message));
    }
  };

  updateContact = async (req: Request, res: Response): Promise<void> => {
    const { contactId } = req.params;
    const updateContactDto = req.body;

    try {
      const updatedContact = await this.contactService.updateContact(
        contactId,
        updateContactDto,
        req["userId"]
      );
      res.status(200).json(updatedContact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  unlockContact = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      await this.contactService.unlockContact(id, req["userId"]);
      res.status(200).json({ message: "Contact unlocked" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteContact = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await this.contactService.deleteContact(id, req["userId"]);
      res
        .status(200)
        .json(new SuccessApiResponse(null, "Contact deleted successfully"));
    } catch (error: any) {
      res.status(500).json(new ErrorApiResponse(error.message));
    }
  };
}
