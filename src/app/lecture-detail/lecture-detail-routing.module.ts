import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LectureDetailPage } from './lecture-detail.page';

const routes: Routes = [
  {
    path: '',
    component: LectureDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LectureDetailPageRoutingModule {}
