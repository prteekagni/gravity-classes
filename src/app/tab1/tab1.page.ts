import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { Platform } from "@ionic/angular";
import { SharedService } from "../services/shared.service";
import { AppMinimize } from "@ionic-native/app-minimize/ngx";
import { DataService } from "../services/data.service";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  lastTimeBackPress;
  timePeriodToExit = 2000;
  public unsubscribeBackEvent: Subscription;
  facts: any = [];
  announce: any = [];
  promotionalVideos: any = [];
  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  constructor(
    private platform: Platform,
    private sharedService: SharedService,
    private appMinimize: AppMinimize,
    private dataService: DataService
  ) {}

  ionViewWillEnter() {
    this.initializeBackButtonCustomHandler();
  }
  initializeBackButtonCustomHandler(): void {
    this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(
      999999,
      async () => {
        this.sharedService.removeTopElements().then((res: any) => {
          if (res) {
            this.appMinimize.minimize();
          } else {
            if (
              new Date().getTime() - this.lastTimeBackPress <
              this.timePeriodToExit
            ) {
            } else {
              this.sharedService.showToast("Press again to exit.");
              this.lastTimeBackPress = new Date().getTime();
            }
          }
        });
      }
    );
  }
  ionViewWillLeave() {
    this.unsubscribeBackEvent.unsubscribe();
  }

  ngOnInit(): void {
    this.dataService.getFacts().then(
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          let i: any = {};
          querySnapshot.forEach((element) => {
            i = element.data();
            i.id = element.id;
            this.facts.push(i);
          });
        } else {
          this.sharedService.errorToast("No Lecture available");
        }
      },
      (err) => {
        this.sharedService.errorToast("Error, please try again.");
      }
    );

    this.dataService.getAnnounements().then(
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          let i: any = {};
          querySnapshot.forEach((element) => {
            i = element.data();
            i.id = element.id;
            this.announce.push(i);
          });
        } else {
          this.sharedService.errorToast("No Lecture available");
        }
      },
      (err) => {
        this.sharedService.errorToast("Error, please try again.");
      }
    );

    this.dataService.getPromotionVideos().then(
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          let i: any = {};
          querySnapshot.forEach((element) => {
            i = element.data();
            i.id = element.id;
            this.promotionalVideos.push(i);
          });
        } else {
          // this.sharedService.errorToast("No Lecture available");
        }
      },
      (err) => {
        this.sharedService.errorToast("Error, please try again.");
      }
    );
  }
}
