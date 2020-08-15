import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LectureDetailPageRoutingModule } from './lecture-detail-routing.module';

import { LectureDetailPage } from './lecture-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LectureDetailPageRoutingModule
  ],
  declarations: [LectureDetailPage]
})
export class LectureDetailPageModule {}
