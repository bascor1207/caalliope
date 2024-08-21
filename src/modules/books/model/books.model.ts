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
  publishers: Publisher[];
  rating?: number;
  summary?: string;
  reviews: Review[];
 };

 export type Author = {
  id: number;
  lastname: string;
  firstname: string;
  image: string;
  email: string;
  birthDate: string;
 };

 export type Subject = {
  id: number;
  label: string;
 };

 type Publisher = {
   id: number,
   label: string,
   language: string,
   numberOfPages: number
   dateOfPublication: string
  }

  type Review = {
   id: number,
   userId: number,
   comment: string,
   date: string
 }

 const MAX_UPLOAD_SIZE = 2000000;
 const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
 ];

 const isbnSchema = z.string()
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

 const nbPageSchema = z.number()
     .min(1, { message: i18n.t('form.errors.minValue', { count: 1 }) })
     .positive({ message: i18n.t('form.errors.minValue', { count: 1 }) })
     .int({ message: i18n.t('form.errors.invalidNumber') });

 const languageSchema = z.string().optional();

 const formatSchema = z.enum(['paper', 'ebook', 'audio'], { message: i18n.t('form.errors.required') });

 const coverSchema = z.instanceof(File).optional()
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

 export type AddBookFormSchemaType = z.infer<typeof addBookFormSchema>

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

 export type EditBookForm = z.infer<typeof editBookFormSchema>

 export const addBookPublisherFormSchema = z.object({
  isbn: isbnSchema,
  date: dateSchema,
  editor: editorSchema,
  translator: translatorSchema,
  nbPage: nbPageSchema,
  language: languageSchema,
  format: formatSchema,
  cover: coverSchema,
 });

 export type AddBookPublisherForm = z.infer<typeof addBookPublisherFormSchema>

 export const addReviewFormSchema = z.object({
  review: reviewSchema,
 });

 export type AddReviewForm = z.infer<typeof addReviewFormSchema>
}
