import { Component } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { DataService } from "../services/data.service";
import { Router } from "@angular/router";
import { SharedService } from "../services/shared.service";
import { Platform, AlertController } from "@ionic/angular";

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
    private alertController: AlertController
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
      this.authService
        .getUserDetail(user.providerData[0].uid)
        .then((res: any) => {
          if (res.exists) {
            this.user = res.data();
            this.firstcharacter = this.user.displayName.substring(0, 1);
            this.isloaded = true;
          }
        });
    });
  }

  shareApp() {}

  openTermsAndConditions() {}

  openPrivacyPage() {}

  logOut() {
    // this.sharedService.displayLC();
    this.authService.logOut().then(() => {
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
      message: `Gravity Classes by Parshant Kumar. 
        <br>Email : prashant.it2012@gmail.com.
        <br> Phone Number : 8851610111.`,
      buttons: ["OK"],
    });

    await alert.present();
  }
}
