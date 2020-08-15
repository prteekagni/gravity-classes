import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { ModalController, IonSlides } from "@ionic/angular";

@Component({
  selector: "app-lecture-detail",
  templateUrl: "./lecture-detail.page.html",
  styleUrls: ["./lecture-detail.page.scss"],
})
export class LectureDetailPage implements OnInit {
  @Input() items;
  index;
  @ViewChild("slides", { read: IonSlides, static: false }) slides: IonSlides;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }
}
