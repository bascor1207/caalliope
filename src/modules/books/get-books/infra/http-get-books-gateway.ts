import axios from "axios";

export class HttpGetBooksGateway implements ConnectorToGetBooks {
    async getBooks(): Promise<Book[]> {
        const apiUrl = 'myBackend'
        return await axios.get(apiUrl) as Book[];
    }
}
