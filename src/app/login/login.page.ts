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
    private appMinimize: AppMinimize
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
        const tempObject = response.user.providerData[0];
        userObject = {
          role: "user",
          ...tempObject,
          accessToken: accessToken,
          accessSecret: accessSecret,
          token: "",
          isProfileCompleted: false,
        };
        this.dataService.checkIfUserExists(tempObject.uid).then(
          (res: any) => {
            if (res.exists) {
              let user = res.data();
              console.log(user);
              if (user.isProfileCompleted) {
                localStorage.setItem("isCompleted", "true");
                localStorage.setItem("Class", user.class);
              }
              this.dataService
                .checkIfUserValid(tempObject.uid)
                .then((valid: any) => {
                  if (valid) {
                    this.sharedService.dismissLC();
                    this.router.navigate(["/tabs/tab1"]);
                  } else {
                    this.sharedService.dismissLC();
                    this.sharedService.errorToast(
                      "User account not activated."
                    );
                  }
                });

              this.dataService
                .checkIfUserValid(tempObject.uid)
                .then((res: any) => {
                  if (res) {
                    this.sharedService.dismissLC();
                    this.router.navigate(["/tabs/tab1"]);
                  } else {
                    this.sharedService.dismissLC();
                    this.sharedService.errorToast(
                      "User account not activated."
                    );
                  }
                });
            } else {
              this.dataService.addUserToDatabase(userObject).then(
                (res: any) => {
                  localStorage.setItem("isCompleted", "false");
                  this.dataService.updateUserCount(1);
                  this.router.navigate(["/tabs/tab1"], {
                    queryParams: { data: "first" },
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

        this.authService.disconnectFromGoogle().then(() => {});
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
