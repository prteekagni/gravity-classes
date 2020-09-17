import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenericModalPage } from './generic-modal.page';

const routes: Routes = [
  {
    path: '',
    component: GenericModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenericModalPageRoutingModule {}
