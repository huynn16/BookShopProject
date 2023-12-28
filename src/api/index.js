import apiClient from "./http-common";

export const BASE_URL = 'http://192.168.142.137:5000/';

export const createAPIEndpoint = endpoint => {
    const url = endpoint;
    console.log(url);
    return {
        fetch: () => apiClient.get(url),
        fetchById: id => apiClient.get(url + "/" + id),
        post: newRecord => apiClient.post(url, newRecord),
        put: (id, updatedRecord) => apiClient.put(url + id, updatedRecord),
        delete: id => apiClient.delete(url +"/"+ id),
    }
}