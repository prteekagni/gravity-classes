import {
  NgModule,
  Directive,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  Input,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

// import { SortDirective } from "./sort-directive";
import { ScrollHideDirective } from "./vanishing-header.directive";

@NgModule({
  imports: [CommonModule],
  declarations: [ScrollHideDirective],
  exports: [ScrollHideDirective],
})
export class SharedModule {}
