import { Injectable } from '@angular/core';
import { LoadingController, LoadingOptions } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class SpinnerService {

    isLoading = false;

    constructor(private loadingController: LoadingController) { }

    async present(options: LoadingOptions) {
        this.isLoading = true;
        return await this.loadingController.create(options).then(a => {
            a.present().then(() => {
                if (!this.isLoading) {
                    a.dismiss();
                }
            });
        });
    }

    async dismiss() {
        this.isLoading = false;
        return await this.loadingController.dismiss();
    }
}