import mongoose from 'mongoose';

export const isMongoError = (error: unknown) =>
  error instanceof mongoose.mongo.MongoServerError;

export const isDuplicateKeyError = (error: unknown) =>
  isMongoError(error) && error.code === 11000;

export const isCastError = (error: unknown) =>
  error instanceof mongoose.Error.CastError;

export const isValidationError = (error: unknown) =>
  error instanceof mongoose.Error.ValidationError;

export const isDocumentNotFoundError = (error: unknown) =>
  error instanceof mongoose.Error.DocumentNotFoundError;
