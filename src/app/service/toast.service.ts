import { Injectable } from '@angular/core';
import { ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private toastController: ToastController) { }

    async present(options: ToastOptions) {
        return await this.toastController.create(options).then(a => a.present());
    }
}