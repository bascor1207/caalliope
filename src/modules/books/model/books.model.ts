import { z } from 'zod';

import i18n from '@/i18n';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace BooksModel {
 export type Book = {
  id: number;
  title: string;
  author: Author;
  type: string;
  subjects: Subject[];
  dateOfPublication: string;
  image: string;
  editions: Edition[];
  rating?: number;
  summary?: string;
  reviews: Review[];
 };

 export type GetBooksReturn = {
  id: number;
  title: string;
  author: AuthorFromBack;
  type: string;
  genre: GenreFromBack[];
  publicationDate: Date;
  cover: { filename: string };
  publishing: EditionFromBack[];
  rating?: number;
  summary?: string;
  comment: ReviewFromBack[];
 };

 type GenreFromBack = {
  id: number;
  genre: string;
 }

 type EditionFromBack = Omit<Edition, 'dateOfPublication'> & { publicationDate: string }

 type ReviewFromBack = Omit<Review, 'comment' | 'date'> & { content: string; createdAt: string }

 type AuthorFromBack = Pick<Author, 'id' | 'birthDate' | 'email' | 'image'> & { lastName: string; firstName: string }

 export type Author = {
  id?: number;
  lastname: string;
  firstname: string;
  image: string;
  email: string;
  birthDate: string;
 };

 export type Subject = {
  id?: number;
  label: string;
 };

 export type Edition = {
  id?: number;
  label: string;
  language: string;
  numberOfPages: number;
  dateOfPublication: string;
 };

 export type Review = {
  id?: number;
  reviewer: UserReview;
  comment: string;
  date: string;
 };

 type UserReview = {
  id?: string;
  username: string;
  avatar: string;
 };

 export type BookCreation = {
  status: 'displayed';
  message: string;
  type: 'success' | 'error';
 };

 export type EditionCreation = {
  status: 'displayed';
  message: string;
  type: 'success' | 'error';
 }

 const isbnSchema = z
     .string()
     .min(10, { message: i18n.t('form.errors.isbnInvalid') })
     .max(13, { message: i18n.t('form.errors.isbnInvalid') })
     .regex(/^\d{10}(\d{3})?$/, { message: i18n.t('form.errors.isbnInvalid') });

 const titleSchema = z.string().min(1, { message: i18n.t('form.errors.required') });
 const authorSchema = z.string().min(1, { message: i18n.t('form.errors.required') });

 const dateSchema = z.date({
  required_error: i18n.t('form.errors.required'),
  invalid_type_error: i18n.t('form.errors.invalidDate'),
 });

 const editorSchema = z.string().min(1, { message: i18n.t('form.errors.required') });
 const translatorSchema = z.string().optional();

 const nbPageSchema = z
     .number()
     .min(1, { message: i18n.t('form.errors.minValue', { count: 1 }) })
     .positive({ message: i18n.t('form.errors.minValue', { count: 1 }) })
     .int({ message: i18n.t('form.errors.invalidNumber') });

 const languageSchema = z.string().optional();
 const formatSchema = z.enum(['paper', 'ebook', 'audio'], { message: i18n.t('form.errors.required') });

 const MAX_UPLOAD_SIZE = 2000000;
 const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

 const coverSchema = z
     .instanceof(File)
     .optional()
     .refine((file) => !file || file.size <= MAX_UPLOAD_SIZE, {
      message: i18n.t('form.errors.fileTooLarge'),
     })
     .refine((file) => !file || ACCEPTED_FILE_TYPES.includes(file.type), {
      message: i18n.t('form.errors.fileTypeInvalid'),
     });

 const reviewSchema = z.string().min(1, { message: i18n.t('form.errors.required') });

 export const addBookFormSchema = z.object({
  isbn: isbnSchema,
  title: titleSchema,
  author: authorSchema,
  date: dateSchema,
  editor: editorSchema,
  translator: translatorSchema,
  nbPage: nbPageSchema,
  language: languageSchema,
  format: formatSchema,
  cover: coverSchema.optional(),
 });

 export type AddBookFormSchemaType = z.infer<typeof addBookFormSchema>;

 export const editBookFormSchema = z.object({
  isbn: isbnSchema,
  title: titleSchema,
  author: authorSchema,
  date: dateSchema,
  editor: editorSchema,
  translator: translatorSchema,
  nbPage: nbPageSchema,
  language: languageSchema,
  format: formatSchema,
  cover: coverSchema,
 });

 export type EditBookForm = z.infer<typeof editBookFormSchema>;

 export const addBookEditionFormSchema = z.object({
  isbn: isbnSchema,
  date: dateSchema,
  editor: editorSchema,
  translator: translatorSchema,
  nbPage: nbPageSchema,
  language: languageSchema,
  format: formatSchema,
  cover: coverSchema,
 });

 export type AddBookEditionForm = z.infer<typeof addBookEditionFormSchema>;

 export const editEditionFormSchema = z.object({
  isbn: isbnSchema,
  date: dateSchema,
  editor: editorSchema,
  translator: translatorSchema,
  nbPage: nbPageSchema,
  language: languageSchema,
  format: formatSchema,
  cover: coverSchema,
 });

 export type EditBookEditionForm = z.infer<typeof editEditionFormSchema>;

 export const addReviewFormSchema = z.object({
  review: reviewSchema,
 });

 export type AddReviewForm = z.infer<typeof addReviewFormSchema>;
}
