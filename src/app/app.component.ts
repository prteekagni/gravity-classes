import { Component } from "@angular/core";

import { Platform, AlertController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";

import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";

declare var window: any;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private imagePicker: ImagePicker,
    private fcm: FCM,
    private alertController: AlertController,
    private screenOrientation: ScreenOrientation
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#3b5998");
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.imagePicker.hasReadPermission().then((res: any) => {
        if (res) {
          console.log(res);
        } else {
          this.imagePicker.requestReadPermission();
        }
      });
      this.fcm.onNotification().subscribe(async (data) => {
        if (data.wasTapped) {
        } else {
          //Notification was received in foreground. Maybe the user needs to be notified.
          this.presentInAppNotificationAlert(data);
        }
      });

      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    });

    var successCallback = function () {
      console.log("The screenshots are not allowed now.");
    };

    var errorCallback = function (err) {
      console.error("An error ocurred : " + err);
    };

    // window.OurCodeWorldpreventscreenshots.disable(
    //   successCallback,
    //   errorCallback
    // );
  }
  successCallback(a) {
    console.log(a);
  }
  errorCallback(a) {
    console.log(a);
  }
  initializeNotification() {
    this.fcm.getInitialPushPayload().then(async (data: any) => {
      if (data !== null) {
        if (data.page == "content-description") {
          if (data.isactive == "true") {
            // this.analyticService.recordEventsWithData("Notification", "Opened");
            // this.router.navigate([data.page, data.id]);
          } else {
            // this.router.navigate(["winners-detail", data.id], {
            //   queryParams: { entryType: "push" },
            // });
          }
        } else {
          // this.router.navigate([data.page]);
        }
      }
    });
  }
  async presentInAppNotificationAlert(data) {
    const alert = await this.alertController.create({
      header: data.title,
      message: data.body,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Okay",
          handler: async () => {},
        },
      ],
    });

    await alert.present();
  }
}
