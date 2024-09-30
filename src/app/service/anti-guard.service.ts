import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AccountService } from './account.service';

@Injectable({
    providedIn: 'root'
})
export class AntiGuardService implements CanActivate {

    constructor(private router: Router, private account: AccountService) {
    }

    canActivate() {
        if (this.account.isRegistered()) {
            this.router.navigateByUrl("/page/stats");
        }

        return !this.account.isRegistered();
    }
}