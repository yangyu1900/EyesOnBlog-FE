import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    constructor(private data: DataService) {
    }

    async getAADUserSet() {
        return await this.data.get('/.auth/me', { headers: { 'Content-Type': 'application/json' } });
    }

    async initializeUser() {
        const aadUserSet = await this.getAADUserSet() as any;
        if (aadUserSet.length > 0) {
            const userSet = await this.data.get(`/api/user/get?filterBy=email&filterByValue='${aadUserSet[0]['user_id']}'`, { headers: { 'Content-Type': 'application/json' } }) as any;
            if (userSet.length > 0) {
                sessionStorage.setItem("currentUser", JSON.stringify(userSet[0]));
            }
        }
    }

    isRegistered() {
        return sessionStorage.getItem("currentUser") ? true : false;
    }
}