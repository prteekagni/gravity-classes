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
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.dataService.getFacts().then((querySnapshot) => {
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
    });

    this.dataService.getAnnounements().then((querySnapshot) => {
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
    });
  }

  // joinMeeting() {
  //   let options = {
  //     custom_meeting_id: "Test",
  //     no_share: true,
  //     no_audio: false,
  //     no_video: false,
  //     no_driving_mode: true,
  //     no_invite: true,
  //     no_meeting_end_message: true,
  //     no_dial_in_via_phone: false,
  //     no_dial_out_to_phone: false,
  //     no_disconnect_audio: true,
  //     no_meeting_error_message: true,
  //     no_unmute_confirm_dialog: true, // Android only
  //     no_webinar_register_dialog: false, // Android only
  //     no_titlebar: false,
  //     no_bottom_toolbar: false,
  //     no_button_video: false,
  //     no_button_audio: false,
  //     no_button_share: true,
  //     no_button_participants: false,
  //     no_button_more: false,
  //     no_text_password: true,
  //     no_text_meeting_id: false,
  //     no_button_leave: false,
  //   };
  //   this.zoomService
  //     .joinMeeting("73301874673", "uV03KK", "Test", options)
  //     .then((success: any) => console.log(success))
  //     .catch((error: any) => console.log(error));
  // }
}
