import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { SpinnerService } from "../../service/spinner.service";
import { ToastService } from "../../service/toast.service";
import { DataService } from '../../service/data.service';
import { AccountService } from '../../../app/service/account.service';
import { Draft } from '../../../app/model/draft';
import { User } from '../../../app/model/user';
import { Pod } from '../../../app/model/pod';

//import * as ConstantsHelper from '../../util/constantshelper.util';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {

  reviewRequestForm: FormGroup;
  isSubmitted: Boolean;
  pods: Pod[];
  verticals: string[];
  draft: Draft;
  currentUser: User;

  constructor(private formBuilder: FormBuilder, private spinner: SpinnerService, private toast: ToastService, private data: DataService, private account: AccountService) { 
    this.reviewRequestForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      url: ['', [Validators.required, Validators.pattern('^https://.*')]],
      podId: [, [Validators.required]],
      vertical: ['', [Validators.required]],
    });
  }

  async ngOnInit() {
    if (!sessionStorage.getItem("pods")) await this.data.initializeData();
    this.pods = JSON.parse(sessionStorage.getItem("pods"));

    this.isSubmitted = false;

    if (!sessionStorage.getItem("currentUser")) await this.account.initializeUser();
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    // this.currentUser = ConstantsHelper.TEST_USER;
  
  }

  selectPod(podId) {
    this.setVerticals(podId);
  }

  private setVerticals(podId) {
    this.verticals = this.pods.filter((pod) => pod.podId === podId)[0].verticals.split(',');
  }

  getErrorControl() {
    return this.reviewRequestForm.controls;
  }

  private setDraft(formValue) {
    this.draft = new Draft();
    this.draft.draftId = Date.now();
    this.draft.title = formValue['title'];
    this.draft.url = formValue['url'];
    this.draft.podId = Number.parseInt(formValue['podId']);
    this.draft.vertical = formValue['vertical'];
    this.draft.authorId = this.currentUser.userId;
    this.draft.reviewerId = -1;
  }

  async onSubmitReviewRequest() {
    this.isSubmitted = true;
    if (!this.reviewRequestForm.valid) {
      return false;
    } else {
      await this.spinner.present({ message: 'Please wait ...' });
      this.setDraft(this.reviewRequestForm.value);
      const res = await this.data.post('/api/review/request', JSON.stringify(this.draft), { headers: { 'Content-Type': 'application/json' }, observe: 'response' }).catch(
        async (err) => {
          console.log(err)
          await this.spinner.dismiss();
          await this.toast.present({
            message: 'Request failed. Please contact EyesOnBlog support.',
            cssClass: 'toast-fail',
            duration: 10000
          });
        }) as any;
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
          message: 'Review request has been submitted successfully.',
          cssClass: 'toast-success',
          duration: 10000
        });
        this.isSubmitted = false;
        this.reviewRequestForm.reset();
      }
    }
  }
}
