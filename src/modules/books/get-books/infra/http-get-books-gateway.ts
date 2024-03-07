import axios from "axios";

export class HttpGetBooksGateway implements GetBooksAdapter {
    async getBooks(): Promise<Book[]> {
        const apiUrl = 'myBackend'
        return await axios.get(apiUrl) as Book[];
    }

    async getBooksLastRelease(): Promise<Book[]> {
        const apiUrl = 'myBackend'
        return await axios.get(apiUrl) as Book[];
    }
}
