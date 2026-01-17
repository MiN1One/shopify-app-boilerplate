export type SchemaType<T> = {
  id?: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
} & T;
