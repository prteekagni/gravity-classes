import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoubtsPageRoutingModule } from './doubts-routing.module';

import { DoubtsPage } from './doubts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoubtsPageRoutingModule
  ],
  declarations: [DoubtsPage]
})
export class DoubtsPageModule {}
