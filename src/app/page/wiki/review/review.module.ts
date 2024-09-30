import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ReviewPageRoutingModule } from './review-routing.module';
import { ReviewPage } from './review.page';

import { CoreModule } from "../../../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewPageRoutingModule,
    CoreModule
  ],
  declarations: [ReviewPage]
})
export class ReviewPageModule { }
