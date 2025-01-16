import { Router } from "express";
import { ContactRepository } from "../repositories/contact.repository";
import { ContactService } from "../services/contact.service";
import { ContactController } from "../controllers/contact.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateDto } from "../middlewares/validate-dto.middleware";
import {
  CreateContactDto,
  ListContactsFilterDto,
  UpdateContactDto,
} from "../dtos/contact.dto";
import { SSEService } from "../services/SSE.service";

const contactRoutes = Router();

const contactRepository = new ContactRepository();
const sseService = new SSEService();
const contactService = new ContactService(contactRepository, sseService);
const contactController = new ContactController(contactService);

contactRoutes.post(
  "/",
  authMiddleware,
  validateDto(CreateContactDto),
  contactController.addContact
);

contactRoutes.get(
  "/",
  authMiddleware,
  validateDto(ListContactsFilterDto),
  contactController.listContacts
);

contactRoutes.put(
  "/:contactId",
  authMiddleware,
  validateDto(UpdateContactDto),
  contactController.updateContact
);

contactRoutes.delete("/:id", authMiddleware, contactController.deleteContact);

export default contactRoutes;
