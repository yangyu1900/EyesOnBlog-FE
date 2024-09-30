import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private httpClient: HttpClient) { }

    async initializeData() {
        const podSet = await this.get('/api/pod/get', { headers: { 'Content-Type': 'application/json' } }) as any;
        if (podSet.length > 0) sessionStorage.setItem('pods', JSON.stringify(podSet));
    }

    public get(url, options) {
        return this.httpClient.get(url, options).toPromise().catch(
            (err) => {
                console.log(err);
                throw err;
            });
    }

    public post(url, body, options) {
        return this.httpClient.post(url, body, options).toPromise().catch(
            (err) => {
                console.log(err);
                throw err;
            });
    }
}