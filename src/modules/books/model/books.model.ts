import { z } from 'zod';

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
 }

 export type Author = {
  id: number;
  lastname: string;
  firstname: string;
  image: string;
  email: string;
  birthDate: string;
 }

 export type Subject = {
  id: number,
  label: string
 }

 export type AddBookForm = z.infer<typeof addBookFormSchema>;

 const imageSchema =
     z.instanceof(File).optional()
     .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
     }, 'File size must be less than 3MB')
     .refine((file) => {
      return file && ACCEPTED_FILE_TYPES.includes(file.type);
     }, 'File must be a PNG');


 export const addBookFormSchema = z.object({
  isbn: z.string().min(1, { message: 'ISBN is required' }),
  title: z.string().min(1, { message: 'Title is required' }),
  author: z.string().min(1, { message: 'Author is required' }),
  date: z.date({
   required_error: 'Release date is required',
   invalid_type_error: 'Invalid date format',
  }),
  editor: z.string().min(1, { message: 'Editor is required' }),
  translator: z.string().optional(),
  nbPage: z.number().min(1, { message: 'Number of pages is required' }),
  language: z.string().optional(),
  format: z.enum(['paper', 'ebook', 'audio']),
  cover: imageSchema,
 });

 const MAX_UPLOAD_SIZE = 2000000
 const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
 ]
}
