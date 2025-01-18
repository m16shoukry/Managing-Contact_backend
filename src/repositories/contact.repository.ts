import { Types } from "mongoose";
import { Contact, IContact } from "../models/contact.model";
import { BaseRepository } from "./base.repository";
import { ListContactsFilterDto } from "../dtos/contact.dto";

export class ContactRepository extends BaseRepository<IContact> {
  constructor() {
    super(Contact);
  }

  async findByUserId(
    userId: Types.ObjectId,
    skip: number,
    limit: number
  ): Promise<IContact[]> {
    return this.model.find({ userId }).skip(skip).limit(limit).exec();
  }

  find(
    filter: ListContactsFilterDto,
    skip = 0,
    limit = 0
  ): Promise<IContact[]> {
    const query: any = { deleted: false };

    if (filter.name) query.name = { $regex: filter.name, $options: "i" };
    if (filter.phone) query.phone = { $regex: filter.phone, $options: "i" };
    if (filter.address)
      query.address = { $regex: filter.address, $options: "i" };

    return this.model.find(query).skip(skip).limit(limit).exec();
  }

  async count(filter: ListContactsFilterDto = {}): Promise<number> {
    const query: any = { deleted: false };

    if (filter.name) query.name = { $regex: filter.name, $options: "i" };
    if (filter.phone) query.phone = { $regex: filter.phone, $options: "i" };
    if (filter.address)
      query.address = { $regex: filter.address, $options: "i" };

    return this.model.countDocuments(query);
  }
  async softDelete(id: string): Promise<IContact | null> {
    const contact = await this.model.findById(id).exec();
    if (!contact) {
      return null;
    }

    contact.deletedAt = new Date();
    contact.deleted = true;
    await contact.save();
    return contact;
  }
}
