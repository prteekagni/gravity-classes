import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DoubtsPageRoutingModule } from "./doubts-routing.module";

import { DoubtsPage } from "./doubts.page";

import { SharedModule } from "../directive/shared-directive.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DoubtsPageRoutingModule,
    SharedModule,
  ],
  declarations: [DoubtsPage],
})
export class DoubtsPageModule {}
