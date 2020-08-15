import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DoubtsPage } from './doubts.page';

const routes: Routes = [
  {
    path: '',
    component: DoubtsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoubtsPageRoutingModule {}
