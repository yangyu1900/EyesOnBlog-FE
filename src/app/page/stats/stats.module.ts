import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatsPageRoutingModule } from './stats-routing.module';
import { StatsPage } from './stats.page';

import { CoreModule } from "../../core/core.module";

import {MatTableModule} from '@angular/material/table'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    StatsPageRoutingModule,
    CoreModule,
    MatTableModule,
  ],
  declarations: [StatsPage]
})
export class StatsPageModule { }
