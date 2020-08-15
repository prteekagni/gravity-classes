import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoubtDetailPage } from './doubt-detail.page';

const routes: Routes = [
  {
    path: '',
    component: DoubtDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoubtDetailPageRoutingModule {}
