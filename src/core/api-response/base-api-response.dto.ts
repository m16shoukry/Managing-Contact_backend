export abstract class BaseApiResponse<T> {
  isSuccess!: boolean;
  message?: string;
  data?: T;
}
