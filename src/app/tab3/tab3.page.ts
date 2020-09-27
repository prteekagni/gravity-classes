import { Component } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { DataService } from "../services/data.service";
import { Router } from "@angular/router";
import { SharedService } from "../services/shared.service";
import { Platform, AlertController, ModalController } from "@ionic/angular";
import * as firebase from "firebase";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { GenericModalPage } from "../generic-modal/generic-modal.page";
@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
})
export class Tab3Page {
  firstcharacter;
  user;
  isloaded: boolean = false;
  unsubscribeBackEvent;
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private sharedService: SharedService,
    private platform: Platform,
    private alertController: AlertController,
    private socialSharing: SocialSharing,
    private modalController: ModalController
  ) {}

  // ngOnInit(): void {
  //   //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //   //Add 'implements OnInit' to the class.
  //   this.getUserInformation();
  // }

  ionViewWillEnter() {
    this.getUserInformation();
    this.initializeBackButtonCustomHandler();
  }
  getUserInformation() {
    this.authService.getUserInformation().then((user) => {
      this.authService.getUserDetail(user.uid).then((res: any) => {
        if (res.exists) {
          this.user = res.data();
          this.firstcharacter = this.user.displayName.substring(0, 1);
          this.isloaded = true;
        }
      });
    });
  }

  shareApp() {
    this.socialSharing.share(
      "Gravity Classes By Er Prashant Kumar for Physics and Mathematics(ISC , NEET , JEE).",
      "",
      "https://firebasestorage.googleapis.com/v0/b/gravityclasses-1498f.appspot.com/o/Untitled-1.png?alt=media&token=31d15bdc-2b3f-4eb3-912b-10a7b7dd44c6",
      "https://play.google.com/store/apps/details?id=io.gravityclass.app"
    );
  }

  openTermsAndConditions() {}

  openPrivacyPage() {}

  async logOut() {
    let user = firebase.auth().currentUser;
    this.dataService.setLoginStatus(user.uid, false).then(() => {
      this.authService.logOut().then(() => {});
      // this.sharedService.dismissLC();
      setTimeout(() => {
        this.router.navigate(["login"]);
      }, 500);
    });
  }

  editProfile() {
    console.log(this.user.uid);
    this.router.navigate(["/profile"], {
      queryParams: { uid: this.user.uid, root: "tabs/tab3" },
    });
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

  ionViewWillLeave() {
    this.unsubscribeBackEvent.unsubscribe();
  }

  async contactUs() {
    const alert = await this.alertController.create({
      header: "Contact Us",
      message: `Gravity Classes by Prashant Kumar. 
        <br>Email : prashant.it2012@gmail.com.
        <br> Phone Number : 6387056155.`,
      buttons: ["OK"],
    });

    await alert.present();
  }

  async openScoreModal() {
    const modal = await this.modalController.create({
      component: GenericModalPage,
      backdropDismiss: true,
      cssClass: "generic-modal",
      componentProps: { type: "scores" },
    });
    modal.onDidDismiss().then((data: any) => {
      console.log(data);
    });
    modal.present();
  }
}
