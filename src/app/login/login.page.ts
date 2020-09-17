import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { AlertController, Platform } from "@ionic/angular";
import * as firebase from "firebase";
import { AuthService } from "../services/auth.service";
import { SharedService } from "../services/shared.service";
import { Router } from "@angular/router";
import { DataService } from "../services/data.service";
import { AppMinimize } from "@ionic-native/app-minimize/ngx";
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  ispageLoaded;
  lastTimeBackPress;
  timePeriodToExit = 2000;
  public unsubscribeBackEvent: Subscription;

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private dataService: DataService,
    private router: Router,
    private platform: Platform,
    private appMinimize: AppMinimize,
    private fcm: FCM
  ) {}

  ngOnInit() {}

  loginWithGoogle() {
    this.authService.loginWithGoogle().then(
      (response) => {
        const { idToken, accessToken } = response;
        this.onLoginSuccess(idToken, accessToken);
      },
      (err) => {
        this.sharedService.dismissLC();
        alert(JSON.stringify(err));
        this.sharedService.errorToast(err);
      }
    );
  }

  onLoginSuccess(accessToken, accessSecret) {
    this.sharedService.displayLC();
    this.authService
      .signInWithCredential(accessToken, accessSecret)
      .then((response) => {
        let userObject: any;
        let tempObject = {
          email: response.user.email,
          uid: response.user.uid,
          displayName: response.user.displayName,
          photoURL: response.user.photoURL,
          providerId: response.user.providerId,
        };
        userObject = {
          role: "user",
          ...tempObject,
          accessToken: accessToken,
          accessSecret: accessSecret,
          token: "",
          isProfileCompleted: false,
          active: false,
          subjects: "",
        };
        this.dataService.checkIfUserExists(tempObject.uid).then(
          (res: any) => {
            if (res.exists) {
              let user = res.data();
              if (!user.isLoggedIn) {
                this.sharedService.dismissLC();
                this.dataService.subscribeToTopic(user.class);
                user.subjects.forEach((element) => {
                  console.log(element);
                  this.sharedService.subscribeToTopic(element + user.class);
                });
                this.dataService
                  .setLoginStatus(tempObject.uid, true)
                  .then(() => {});
                this.authService.disconnectFromGoogle().then(() => {});
                if (user.isProfileCompleted) {
                  localStorage.setItem("isCompleted", "true");
                  localStorage.setItem("Class", user.class);
                  this.router.navigate(["/tabs/tab1"]);
                } else {
                  this.router.navigate(["/profile"], {
                    queryParams: { uid: tempObject.uid, root: "tabs/tab1" },
                  });
                }
                this.fcm.getToken().then((res: any) => {
                  this.dataService
                    .updateToken(tempObject.uid, res)
                    .then((res: any) => {
                      localStorage.setItem("Token", "true");
                      console.log("Device Token Updated");
                    });
                });
              } else {
                this.sharedService.dismissLC();
                this.dataService.addLoginLogs(userObject).then(
                  () => {
                    this.sharedService.errorToast(
                      "Already Logged In Other Device"
                    );
                  },
                  (err) => {
                    this.sharedService.errorToast(
                      "Already Logged In Other Device"
                    );
                  }
                );
              }
            } else {
              this.dataService.addUserToDatabase(userObject).then(
                (res: any) => {
                  localStorage.setItem("isCompleted", "false");
                  this.dataService.updateUserCount(1);
                  // this.router.navigate(["/tabs/tab1"], {
                  //   queryParams: { data: "first" },
                  // });
                  this.fcm.getToken().then((res: any) => {
                    this.dataService
                      .updateToken(tempObject.uid, res)
                      .then((res: any) => {
                        localStorage.setItem("Token", "true");
                        console.log("Device Token Updated");
                      });
                  });
                  this.authService.disconnectFromGoogle().then(() => {});
                  this.router.navigate(["/profile"], {
                    queryParams: { uid: tempObject.uid, root: "tabs/tab1" },
                  });
                  this.sharedService.dismissLC();
                },
                (err) => {
                  this.sharedService.dismissLC();
                }
              );
            }
          },
          (err) => {
            this.sharedService.dismissLC();
          }
        );
      });
  }

  ionViewDidEnter() {}

  ionViewWillEnter() {
    this.ispageLoaded = true;
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
}
