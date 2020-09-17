import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenericModalPageRoutingModule } from './generic-modal-routing.module';

import { GenericModalPage } from './generic-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenericModalPageRoutingModule
  ],
  declarations: [GenericModalPage]
})
export class GenericModalPageModule {}
