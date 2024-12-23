import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { SpinnerService } from "../../service/spinner.service";
import { ToastService } from "../../service/toast.service";
import { DataService } from '../../service/data.service';
import { AccountService } from '../../service/account.service';
import { User } from '../../../app/model/user';
import { Pod } from '../../../app/model/pod';
import { Router } from '@angular/router';

//import * as ConstantsHelper from '../../util/constantshelper.util';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerRequestForm: FormGroup;
  pods: Pod[];
  verticals: string[];
  roles: string[];
  isSubmitted: Boolean;
  user: User;

  constructor(private formBuilder: FormBuilder, private spinner: SpinnerService, private toast: ToastService, private data: DataService, private account: AccountService, private router: Router) {
    this.registerRequestForm = this.formBuilder.group({
      userId: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      userName: ['', [Validators.required]],
      roles: [[], [Validators.required]],
      podId: [, [Validators.required]],
      verticals: [[], [Validators.required]],
    });
  }

  async ngOnInit() {
    if (!sessionStorage.getItem("pods")) await this.data.initializeData();
    this.pods = JSON.parse(sessionStorage.getItem("pods"));
    this.roles = this.pods[0].roles.split(',');
    this.isSubmitted = false;
  }

  getErrorControl() {
    return this.registerRequestForm.controls;
  }

  selectPod(podId) {
    this.setVerticals(Number(podId));
  }

  private setVerticals(podId) {
    this.verticals = this.pods.filter((pod) => pod.podId === podId)[0].verticals.split(',');
  }

  private setUser(aadUserSet: Object) {
    this.user = new User();
    this.user.userId = Number(this.registerRequestForm.value['userId']);
    this.user.userName = this.registerRequestForm.value['userName'];
    this.user.engineerName = aadUserSet[0]['user_claims'].filter(x => x['typ'] === 'name')[0]['val'];
    this.user.email = aadUserSet[0]['user_id'];
    this.user.roles = this.registerRequestForm.value['roles'].join();
    this.user.podId = Number(this.registerRequestForm.value['podId']);
    this.user.podName = this.pods[this.user.podId].podName;
    this.user.verticals = this.registerRequestForm.value['verticals'].join();
    this.user.reviewCount = 0;
  }

  async onSubmitRegisterRequest() {
    this.isSubmitted = true;
    if (!this.registerRequestForm.valid) {
      return;
    } else {
      await this.spinner.present({
        message: 'Please wait ...'
      });
      const aadUserSet = await this.account.getAADUserSet() as any;
      if (aadUserSet.length > 0) {
        this.setUser(aadUserSet);
        const res = await this.data.post('/api/user/register', JSON.stringify(this.user), { headers: { 'Content-Type': 'application/json' }, observe: 'response' }) as any;
        await this.spinner.dismiss();
        if (res.status !== 200) {
          await this.toast.present({
            message: 'Request failed. Please contact EyesOnBlog support.',
            cssClass: 'toast-fail',
            duration: 10000
          });
          console.log('Request complete! response:', res);
        } else {
          await this.toast.present({
            message: 'Register request has been submitted successfully.',
            cssClass: 'toast-success',
            duration: 10000
          });
          this.isSubmitted = false;
          this.registerRequestForm.reset();
          await this.account.initializeUser();
          this.router.navigate(['/']);
        }
      }
      this.isSubmitted = false;
    }
  }
}