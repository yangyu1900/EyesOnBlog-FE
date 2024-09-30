import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AccountService } from './account.service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class GuardService implements CanActivate {

    constructor(private router: Router, private account: AccountService, private toast: ToastService) {
    }

    async canActivate() {
        if (!this.account.isRegistered()) {
            this.router.navigateByUrl("/page/register");
            await this.toast.present({
                message: 'You need to join EyesOnBlog membership to access this feature.',
                cssClass: 'toast-fail',
                duration: 10000
            });
        }

        return this.account.isRegistered();
    }
}