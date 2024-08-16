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
  cover: z.instanceof(File).optional(),
 });
}


