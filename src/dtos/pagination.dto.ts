import { IsInt, IsOptional, Min } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit: number = 5;
}

export class PaginationResultDto<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;

  constructor(
    data: T[],
    totalItems: number,
    currentPage: number,
    itemsPerPage: number
  ) {
    this.data = data;
    this.totalItems = totalItems;
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
    this.totalPages = Math.ceil(totalItems / itemsPerPage);
  }
}
