import { Component, ViewChild } from "@angular/core";
import {
  IonSlides,
  IonSegment,
  IonInfiniteScroll,
  Platform,
  ModalController,
} from "@ionic/angular";
import { PreviewAnyFile } from "@ionic-native/preview-any-file/ngx";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { DataService } from "../services/data.service";
import { SharedService } from "../services/shared.service";
import { LectureDetailPage } from "../lecture-detail/lecture-detail.page";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
  @ViewChild("slides", { read: IonSlides, static: false }) slides: IonSlides;
  @ViewChild("segment") segment: IonSegment;
  @ViewChild("infinitescroll") infinitescroll: IonInfiniteScroll;
  index: number = 0;
  assigments: any = [];
  notes: any = [];
  isProfileCompleted;
  user;
  unsubscribeBackEvent;
  hasLesson;
  isloaded;
  constructor(
    private previewAnyFile: PreviewAnyFile,
    private authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private sharedService: SharedService,
    private platform: Platform,
    private modalController: ModalController
  ) {}
  onSegmentChange(ev) {
    this.slideTo(ev.detail.value);
  }

  slideTo(index) {
    this.slides.slideTo(index);
  }

  // On Slide change update segment to the matching value
  async onSlideDidChange(ev) {
    var index = await this.slides.getActiveIndex();
    this.clickSegment(index);
  }

  async clickSegment(index) {
    this.index = index;
    this.segment.value = index;
    if (index == 1) {
      this.dataService.getAssigments().then((querySnapshot) => {
        if (!querySnapshot.empty) {
          let i: any = {};
          querySnapshot.forEach((element) => {
            i = element.data();
            i.id = element.id;
            this.assigments.push(i);
          });
          this.isloaded = true;
        } else {
          this.sharedService.errorToast("No Assigment available");
        }
      });
    }
  }

  async openAssignment(item) {
    // this.previewAnyFile
    //   .preview(item.url)
    //   .then((res: any) => console.log(res))
    //   .catch((error: any) => console.error(error));
    const modal = await this.modalController.create({
      component: LectureDetailPage,
      componentProps: { items: item.assigmentLink },
    });
    await modal.present();
  }

  ionViewWillEnter() {
    this.initializeBackButtonCustomHandler();
    this.isProfileCompleted =
      localStorage.getItem("isCompleted") == "true" ? true : false;
    if (this.isProfileCompleted) {
      this.notes = [];
      this.dataService.getAllNotes().then((querySnapshot) => {
        if (!querySnapshot.empty) {
          let i: any = {};
          querySnapshot.forEach((element) => {
            i = element.data();
            i.id = element.id;
            this.notes.push(i);
          });
          this.isloaded = true;
        } else {
          this.sharedService.errorToast("No Lecture available");
        }
      });
    }
  }

  completeProfile() {
    this.authService.getUserInformation().then((user) => {
      this.authService
        .getUserDetail(user.providerData[0].uid)
        .then((res: any) => {
          if (res.exists) {
            this.user = res.data();
            this.router.navigate(["/profile"], {
              queryParams: { uid: this.user.uid, root: "tabs/tab2" },
            });
          }
        });
    });
  }

  ionViewWillLeave() {
    this.notes = [];
    this.assigments = [];
    this.unsubscribeBackEvent.unsubscribe();
  }
  initializeBackButtonCustomHandler(): void {
    this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(
      999999,
      async () => {
        this.sharedService.removeTopElements().then((res) => {
          if (!res) {
            this.router.navigate(["tabs/tab1"]);
          }
        });
      }
    );
  }
}
