import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";
import { AuthService } from "../services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SharedService } from "../services/shared.service";
import { Platform } from "@ionic/angular";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  user;
  loginForm;
  isloaded: boolean = false;
  rootNav: string;
  unsubscribeBackEvent;
  physics = false;
  maths = false;
  subjects: any = [];
  subjectChanged;
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private router: Router,
    private platform: Platform
  ) {
    this.activatedRoute.queryParams.subscribe((res) => {
      this.rootNav = res.root;
      this.authService.getUserDetail(res.uid).then((res: any) => {
        if (res.exists) {
          this.user = res.data();
          this.isloaded = true;
          console.log(this.user);
          if (this.user.subjects.length > 0) {
            this.user.subjects.forEach((element) => {
              this.subjects.push(element);
              console.log(this.subjects);
              if (element == "physics") {
                this.physics = true;
              } else if (element == "mathematics") {
                this.maths = true;
              }
            });
          }
        }
      });
    });
  }

  ngOnInit() {}

  onSubmit(loginForm) {
    console.log(loginForm);

    if (loginForm.dirty || this.subjectChanged) {
      let data = loginForm.value;
      data.isProfileCompleted = true;
      localStorage.setItem("isCompleted", "true");
      localStorage.setItem("Class", data.class);
      this.sharedService.subscribeToTopic(data.class);
      this.dataService.subscribeToTopic(data.class);
      data.uid = this.user.uid;
      data.subjects = this.subjects;
      this.subjects.forEach((element) => {
        console.log(element);
        this.sharedService.subscribeToTopic(element + data.class);
      });
      this.sharedService.displayLC();
      this.dataService.updateUserProfile(data).then(
        () => {
          this.sharedService.dismissLC();
          this.sharedService.showToast("Profile Updated");
          this.subjects = [];
          this.router.navigate(["tabs/tab3"]);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.sharedService.showToast("No changes.");
    }
  }
  initializeBackButtonCustomHandler(): void {
    this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(
      999999,
      async () => {
        this.sharedService.removeTopElements().then((res) => {
          if (!res) {
            this.router.navigate(["tabs/tab3"]);
          }
        });
      }
    );
  }
  ionViewWillLeave() {
    this.subjects = [];

    // clearInterval(this.categoryTimeOut);
    this.unsubscribeBackEvent.unsubscribe();
  }

  ionViewWillEnter() {
    this.initializeBackButtonCustomHandler();
  }

  checkboxChanged(event) {
    if (event.detail.checked) {
      this.subjects.push(event.detail.value);
    } else {
      var index = this.subjects.indexOf(event.detail.value);
      if (index > -1) {
        this.subjects.splice(index, 1);
      }
      this.subjectChanged = true;
    }
  }
}
