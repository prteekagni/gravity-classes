import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from "../services/data.service";
import { ModalController, Platform } from "@ionic/angular";
import { SharedService } from "../services/shared.service";
import { GenericModalPage } from "../generic-modal/generic-modal.page";

@Component({
  selector: "app-doubt-detail",
  templateUrl: "./doubt-detail.page.html",
  styleUrls: ["./doubt-detail.page.scss"],
})
export class DoubtDetailPage implements OnInit {
  doubt;
  doubtID;
  isloaded: boolean = false;
  unsubscribeBackEvent;
  notanswered: boolean = false;
  constructor(
    private activatedRouter: ActivatedRoute,
    private dataService: DataService,
    private platform: Platform,
    private sharedService: SharedService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.activatedRouter.params.subscribe((res) => {
      console.log(res);
      this.doubtID = res.id;
      this.dataService.getDoubtDetail(this.doubtID).then((res: any) => {
        if (res) {
          this.doubt = res.data();
          this.isloaded = true;
          if (this.doubt.solution == "") {
            this.notanswered = true;
          } else {
            this.notanswered = false;
          }
        }
      });
    });
  }

  initializeBackButtonCustomHandler(): void {
    this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(
      999999,
      async () => {
        this.sharedService.removeTopElements().then((res) => {
          if (!res) {
            this.router.navigate(["tabs/doubts"]);
          }
        });
      }
    );
  }
  ionViewWillLeave() {
    // clearInterval(this.categoryTimeOut);

    this.unsubscribeBackEvent.unsubscribe();
  }

  ionViewWillEnter() {
    this.initializeBackButtonCustomHandler();
  }

  async openFullImage() {
    const modal = await this.modalController.create({
      component: GenericModalPage,
      backdropDismiss: true,
      cssClass: "generic-modal",
      componentProps: { type: "image", imageLink: this.doubt.solutionimage },
    });
    modal.present();
  }
}
