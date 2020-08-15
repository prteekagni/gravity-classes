import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoubtDetailPageRoutingModule } from './doubt-detail-routing.module';

import { DoubtDetailPage } from './doubt-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoubtDetailPageRoutingModule
  ],
  declarations: [DoubtDetailPage]
})
export class DoubtDetailPageModule {}
