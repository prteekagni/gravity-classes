import { Component, OnInit, ViewChild } from "@angular/core";
import { File } from "@ionic-native/file/ngx";
import {
  FileTransfer,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { Subscription } from "rxjs";
import { Platform, ModalController, LoadingController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from "../services/data.service";
import { LectureDetailPage } from "../lecture-detail/lecture-detail.page";
import { SharedService } from "../services/shared.service";
import { FileEncryption } from "@ionic-native/file-encryption/ngx";

declare var cordova;
@Component({
  selector: "app-notification",
  templateUrl: "./notification.page.html",
  styleUrls: ["./notification.page.scss"],
})
export class NotificationPage implements OnInit {
  imageUrl =
    "https://firebasestorage.googleapis.com/v0/b/gravityclasses-1498f.appspot.com/o/IeDWLAZCrVhFcGsv2ENhX1IEMWp2%5BobjectObject%5D77.png?alt=media&token=3814ec18-f367-4442-9c56-ceb501c19809";
  private fileTransfer: FileTransferObject;
  public unsubscribeBackEvent: Subscription;
  note;
  isloaded: boolean = false;
  dvStatus;
  hasVideo: boolean = false;
  encryptKey = "gravityClassesKey";
  constructor(
    private platform: Platform,
    private activatedRouter: ActivatedRoute,
    private dataService: DataService,
    private sharedService: SharedService,
    private router: Router,
    private modalController: ModalController,
    private transfer: FileTransfer,
    private file: File,
    private fileEncrption: FileEncryption,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.activatedRouter.queryParams.subscribe((res) => {
      console.log(res);
      this.activatedRouter.params.subscribe((id) => {
        console.log(id);
        this.dataService.getNoteDetail(id.id).then((res: any) => {
          if (res.exists) {
            this.note = res.data();
            this.note.id = res.id;
            if (this.note.videoLink !== "") {
              this.hasVideo = true;
            }
            this.isloaded = true;
          } else {
            console.log("Note");
          }
        });
      });
    });
  }

  playVideoLocal() {
    // this.sharedService.displayLC();
    // this.VideoPlayer.play(this.note.videoLink, {
    //   scalingMode: 1,
    // }).then((res: any) => {
    //   console.log(res);
    //   this.sharedService.dismissLC();
    // });
  }

  async onClick() {
    let url: any = [];
    let length = this.note.notesImage.length;
    console.log(length);

    this.file
      .checkDir(this.file.applicationStorageDirectory, this.note.title)
      .then(
        async () => {
          console.log("directory already present");
          let items = JSON.parse(localStorage.getItem("Keys"));
          const modal = await this.modalController.create({
            component: LectureDetailPage,
            componentProps: { items: items, title: "Notes" },
          });
          await modal.present();
        },
        async (err) => {
          // this.sharedService.displayLC();
          const loading = await this.loadingController.create({
            cssClass: "my-custom-class",
            message: "Downloading Notes.",
            
          });
          await loading.present();
          const fileTransfer: FileTransferObject = this.transfer.create();
          for (var i = 0; i < this.note.notesImage.length; i++) {
            await this.uploadImageAsPromise(this.note.notesImage[i]).then(
              async (res: any) => {
                console.log(res);
                console.log("download complete: " + res);
                url.push(
                  (<any>window).Ionic.WebView.convertFileSrc(res.toURL())
                );
                console.log(url);
                if (length == url.length) {
                  // this.sharedService.dismissLC();
                  loading.dismiss();
                  localStorage.setItem("Keys", JSON.stringify(url));
                  let items = JSON.parse(localStorage.getItem("Keys"));
                  const modal = await this.modalController.create({
                    component: LectureDetailPage,
                    componentProps: { items: items, title: "Notes" },
                  });
                  await modal.present();
                }
              }
            );
          }
        }
      );
  }

  async uploadImageAsPromise(imageFile) {
    const fileTransfer: FileTransferObject = this.transfer.create();

    return new Promise((resolve, reject) => {
      fileTransfer
        .download(
          imageFile,
          this.file.applicationStorageDirectory +
            "/" +
            this.note.title +
            "/" +
            this.note.id +
            new Date().getTime() +
            ".png"
        )
        .then(
          (entry) => {
            // this.fileEncrption
            //   .encrypt(entry.toURL(), this.encryptKey)
            //   .then((res) => {
            //     resolve(entry);
            //   });

            // cordova.plugins.disusered.safe.encrypt(
            //   entry.toURL(),
            //   this.encryptKey,
            //   success,
            //   error
            // );
            resolve(entry);

            function success(encryptedFile) {
              console.log("Encrypted file: " + encryptedFile);
            }
            function error() {
              console.log("Error with cryptographic operation");
            }
          },
          (error) => {
            // handle error
          }
        );
    });
  }

  initializeBackButtonCustomHandler(): void {
    this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(
      999999,
      async () => {
        this.sharedService.removeTopElements().then((res) => {
          if (!res) {
            this.router.navigate(["tabs/tab2"]);
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

  downloadVideo() {
    this.dvStatus = false;
    const fileTransfer: FileTransferObject = this.transfer.create();
    const url = encodeURI(
      "https://videobucketgrvity.s3.ap-south-1.amazonaws.com/fluidPressure_04+00_00_00-00_05_03.mp4"
    );
    let imagePath = this.note.title;
    const targetPath =
      this.file.externalDataDirectory + "images/" + imagePath + ".mp4";
    fileTransfer.download(url, targetPath, true).then((res) => {
      console.log(res);
      this.dvStatus = true;
    });
  }
}
