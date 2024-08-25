import axios from 'axios';

export const queryBack = (baseModule: string) => (endpointModule: string) =>  async (axiosMethod: 'post' | 'get', options?: any) => {
    const url = new URL(baseModule, endpointModule);
    return await axios[axiosMethod](url.toString(), options)
}
