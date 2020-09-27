import { Component, OnInit, ViewChild } from "@angular/core";
import { Platform, ModalController, IonRadioGroup } from "@ionic/angular";
import { DataService } from "../services/data.service";
import { AuthService } from "../services/auth.service";
import { SharedService } from "../services/shared.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { GenericModalPage } from "../generic-modal/generic-modal.page";
import { ScrollHideConfig } from "../directive/vanishing-header.directive";

declare var plugins;

@Component({
  selector: "app-doubts",
  templateUrl: "./doubts.page.html",
  styleUrls: ["./doubts.page.scss"],
})
export class DoubtsPage implements OnInit {
  doubts: any = [];
  tempImageUrl;
  imageUrl;
  hasImage: boolean = false;
  imageRefrence;
  doubt;
  doubtfrom: boolean = false;
  doubtform: NgForm;
  user;
  imgBlob;
  isProfileCompleted;
  unsubscribeBackEvent;
  subjects: any = [];
  subject = "";
  isloaded: boolean = true;
  @ViewChild("radioGroup") radioGroup: IonRadioGroup;

  headerScrollConfig: ScrollHideConfig = {
    cssProperty: "margin-top",
    maxValue: 168,
  };

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private sharedService: SharedService,
    private router: Router,
    private platform: Platform,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.authService.currentUserDetail().then((res: any) => {
      this.dataService.getUserInformation(res.providerData[0].uid).then(
        (res) => {
          this.user = res.data();
          this.subjects = res.data().subjects;
          this.radioGroup.value = this.subjects[0];
          this.subject = this.radioGroup.value;
          this.getAllDoubts();
        },
        (err) => {}
      );
    });
  }

  doubtDetail(data) {
    this.router.navigate(["/doubt-detail", data.id]);
  }

  getAllDoubts() {
    this.doubts = [];
    this.sharedService.displayLC();
    this.dataService.getAllDoubts(this.subject).then(
      (querySnapshot: any) => {
        if (!querySnapshot.empty) {
          let i: any = {};
          querySnapshot.forEach((element) => {
            i = element.data();
            i.id = element.id;
            if (i.uid == this.user.uid) {
              i.userDoubt = true;
            }
            this.doubts.push(i);
          });
          this.sharedService.dismissLC();
        } else {
          this.sharedService.errorToast("No doubt to show.");
          this.sharedService.dismissLC();
        }
      },
      (err) => {
        this.sharedService.dismissLC();
        console.log(err);
      }
    );
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
    this.sharedService.dismissLC();
    this.unsubscribeBackEvent.unsubscribe();
  }

  ionViewWillEnter() {
    this.initializeBackButtonCustomHandler();
  }

  selectedSubject(event) {
    console.log(event);
    this.subject = event;
    this.getAllDoubts();
  }

  async openDoubtModal() {
    const modal = await this.modalController.create({
      component: GenericModalPage,
      backdropDismiss: true,
      cssClass: "generic-modal",
      componentProps: { type: "doubt" },
    });
    modal.onDidDismiss().then((data: any) => {
      console.log(data);
      if (data.data == true) {
        this.getAllDoubts();
      }
    });
    modal.present();
  }

  doRefresh(event) {
    this.doubts = [];
    this.sharedService.displayLC();
    this.dataService.getAllDoubts(this.subject).then(
      (querySnapshot: any) => {
        if (!querySnapshot.empty) {
          let i: any = {};
          querySnapshot.forEach((element) => {
            i = element.data();
            i.id = element.id;
            if (i.uid == this.user.uid) {
              i.userDoubt = true;
            }
            this.doubts.push(i);
          });
          this.sharedService.dismissLC();
          event.target.complete();
        } else {
          this.sharedService.errorToast("No doubt to show.");
          this.sharedService.dismissLC();
          event.target.complete();
        }
      },
      (err) => {
        this.sharedService.dismissLC();
        event.target.complete();
        console.log(err);
      }
    );
  }

  showStatusToast(status) {
    this.sharedService.showToast("Your Doubt is " + status);
  }
}

// this.authService.currentUserDetail().then((res: any) => {
//   this.dataService
//     .getUserInformation(res.providerData[0].uid)
//     .then((res) => {
//       this.subjects = res.data().subjects;
//       this.radioGroup.value = this.subjects[0];
//       this.subject = this.radioGroup.value;
//       this.dataService
//         .getDoubtsByUserID(this.subject)
//         .then((querySnapshot) => {
//           if (!querySnapshot.empty) {
//             let i: any = {};
//             querySnapshot.forEach((element) => {
//               i = element.data();
//               i.id = element.id;
//               this.doubts.push(i);
//             });
//           }
//         });
//     });
// });

// doubtToggleChanged(event) {
//   if (this.subject == "") {
//     this.sharedService.showToast("Select Subject First");
//   } else {
//     if (this.doubtfrom == true) {
//       this.doubts = [];
//       this.getAllDoubts();
//     } else {
//       this.doubts = [];
//       this.dataService
//         .getDoubtsByUserID(this.subject)
//         .then((querySnapshot) => {
//           if (!querySnapshot.empty) {
//             let i: any = {};
//             querySnapshot.forEach((element) => {
//               i = element.data();
//               i.id = element.id;
//               this.doubts.push(i);
//             });
//           }
//         });
//     }
//   }
// }
// this.getDoubts();
// this.authService.currentUserDetail().then((res: any) => {
//   this.dataService
//     .getUserInformation(res.providerData[0].uid)
//     .then((res) => {
//       this.subjects = res.data().subjects;
//       this.radioGroup.value = this.subjects[0];
//       this.subject = this.radioGroup.value;
//       this.dataService
//         .getDoubtsByUserID(this.subject)
//         .then((querySnapshot) => {
//           if (!querySnapshot.empty) {
//             let i: any = {};
//             querySnapshot.forEach((element) => {
//               i = element.data();
//               i.id = element.id;
//               this.doubts.push(i);
//             });
//           }
//         });
//     });
// });
