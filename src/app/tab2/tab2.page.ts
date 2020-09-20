import { Component, ViewChild } from "@angular/core";
import {
  IonSlides,
  IonSegment,
  IonInfiniteScroll,
  Platform,
  ModalController,
  IonRadioGroup,
} from "@ionic/angular";

import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { DataService } from "../services/data.service";
import { SharedService } from "../services/shared.service";
import { LectureDetailPage } from "../lecture-detail/lecture-detail.page";
import { ScrollHideConfig } from "../directive/vanishing-header.directive";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
  @ViewChild("slides", { read: IonSlides, static: false }) slides: IonSlides;
  @ViewChild("segment") segment: IonSegment;
  @ViewChild("infinitescroll") infinitescroll: IonInfiniteScroll;
  @ViewChild("radioGroup") radioGroup: IonRadioGroup;

  index: number = 0;
  assigments: any = [];
  notes: any = [];
  isActive;
  user;
  unsubscribeBackEvent;
  hasLesson;
  isloaded;
  subjects: any = [];
  subject = "";
  headerScrollConfig: ScrollHideConfig = {
    cssProperty: "margin-top",
    maxValue: 212,
  };
  constructor(
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
      this.getAssigments();
    } else {
      this.getNotes();
    }
  }

  getAssigments() {
    this.assigments = [];
    this.sharedService.displayLC();

    this.dataService.getAssigments(this.subject).then(
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          let i: any = {};
          querySnapshot.forEach((element) => {
            i = element.data();
            i.id = element.id;
            this.assigments.push(i);
          });
          this.isloaded = true;
          this.sharedService.dismissLC();
        } else {
          this.isloaded = true;
          this.sharedService.dismissLC();
          this.sharedService.errorToast("No Assigment available");
        }
      },
      (err) => {
        this.sharedService.dismissLC();
        this.sharedService.errorToast("Error Please Try Again");
      }
    );
  }

  async openAssignment(item) {
    // this.previewAnyFile
    //   .preview(item.url)
    //   .then((res: any) => console.log(res))
    //   .catch((error: any) => console.error(error));
    const modal = await this.modalController.create({
      component: LectureDetailPage,
      componentProps: { items: item.assigmentLink, title: "Assigments" },
    });
    await modal.present();
  }

  ionViewWillEnter() {
    this.initializeBackButtonCustomHandler();
  }

  ngOnInit(): void {
    this.isActive = true;
    this.notes = [];
    this.subjects = [];
    this.authService.currentUserDetail().then((res: any) => {
      this.dataService.getUserInformation(res.uid).then((res) => {
        this.subjects = res.data().subjects;
        console.log(this.subjects);
        this.radioGroup.value = this.subjects[0];
        this.subject = this.radioGroup.value;
        console.log(this.subjects);
        this.getNotes();
      });
    });
  }

  getNotes() {
    this.notes = [];
    this.sharedService.displayLC();
    this.dataService.getAllNotes(this.subject).then(
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          let i: any = {};
          querySnapshot.forEach((element) => {
            i = element.data();
            i.id = element.id;
            this.notes.push(i);
          });
          this.isloaded = true;
          this.sharedService.dismissLC();
        } else {
          this.isloaded = true;
          this.sharedService.dismissLC();

          this.sharedService.errorToast("No Lecture available");
        }
        // });
      },
      (err) => {
        this.sharedService.errorToast("Error Please Try Again");

        this.sharedService.dismissLC();
      }
    );
  }

  ionViewWillLeave() {
    // this.notes = [];
    // this.assigments = [];
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

  selectedSubject(event) {
    console.log(event);
    this.subject = event;
    if (this.index == 0) {
      this.notes = [];
      this.getNotes();
    } else {
      this.assigments = [];
      this.getAssigments();
    }
  }
  openDoubtModal() {}

  doRefresh(event) {
    this.authService.currentUserDetail().then((res: any) => {
      this.dataService.getUserInformation(res.uid).then(
        (res) => {
          if (this.index == 1) {
            this.getAssigments();
          } else {
            this.getNotes();
          }
          event.target.complete();
        },
        (err) => {
          console.log(err);
          event.target.complete();
          this.sharedService.errorToast("Error, please try again.");
        }
      );
    });
  }
}
