import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { finalize } from "rxjs/operators";

import {
  ActionSheetController,
  Platform,
  ModalController,
} from "@ionic/angular";
import { DataService } from "../services/data.service";

import { SharedService } from "../services/shared.service";
import { Router } from "@angular/router";
import * as firebase from "firebase";
import { NgForm } from "@angular/forms";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";

declare var plugins;

@Component({
  selector: "app-generic-modal",
  templateUrl: "./generic-modal.page.html",
  styleUrls: ["./generic-modal.page.scss"],
})
export class GenericModalPage implements OnInit {
  @Input() type;
  @ViewChild("doubtImage", { read: ElementRef }) doubtImg;
  doubts: any = [];
  tempImageUrl;
  imageUrl;
  hasImage: boolean = false;
  imageRefrence;
  doubt;
  doubtfrom;
  doubtform: NgForm;
  user;
  imgBlob;
  isProfileCompleted;
  unsubscribeBackEvent;
  subjects: any = [];
  subject;
  spinner;
  scores = [];
  constructor(
    private actionSheetController: ActionSheetController,
    private dataService: DataService,
    private camera: Camera,
    private sharedService: SharedService,
    private router: Router,
    private platform: Platform,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    if (this.type == "scores") {
      this.sharedService.displayLC();
      this.dataService.getUserScores().then(
        (querySnapshot: any) => {
          if (!querySnapshot.empty) {
            let i: any = {};
            querySnapshot.forEach((element) => {
              i = element.data();
              i.id = element.id;
              this.scores.push(i);
            });
            this.sharedService.dismissLC();
          } else {
            this.sharedService.dismissLC();
          }
        },
        (err) => {
          console.log(err);

          this.sharedService.errorToast("Error, please try again.");
          this.sharedService.dismissLC();
        }
      );
    } else {
      this.dataService
        .getUserInformation(firebase.auth().currentUser.uid)
        .then((res: any) => {
          this.user = res.data();
        });
    }

    this.initializeBackButtonCustomHandler();
  }
  async uploadPhoto() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image",
      buttons: [
        {
          text: "Gallery",
          icon: "images-outline",
          cssClass: "actionSheetColorIcon",
          handler: () => {
            this.openGallery();
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          cssClass: "actionSheetCloseColorIcon",
          handler: () => {
            console.log("Cancel clicked");
          },
        },
        {
          text: "Camera",
          icon: "camera",
          cssClass: "actionSheetColorIcon",

          handler: () => {
            this.openCamera();
          },
        },
      ],
    });
    await actionSheet.present();
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
    };

    this.camera.getPicture(options).then((imageData) => {
      // this.imageUrl = (<any>window).Ionic.WebView.convertFileSrc(imageData);
      // this.hasImage = true;
      plugins.crop
        .promise(imageData, {
          quality: 75,
          targetWidth: 720,
          targetHeight: 480,
          widthRatio: 2,
          heightRatio: 3,
        })
        .then(
          (newImage) => {
            this.imageUrl = (<any>window).Ionic.WebView.convertFileSrc(
              newImage
            );
            this.hasImage = true;
            this.checkImageIsRendered();
            this.readFile(newImage);
          },
          (error) => console.error("Error cropping image", error)
        );
    });
  }

  openGallery() {
    // this.sharedService.displayLC();
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    };

    this.camera.getPicture(options).then((imageData) => {
      plugins.crop
        .promise(imageData, {
          quality: 75,
          targetWidth: 720,
          targetHeight: 480,
          widthRatio: 2,
          heightRatio: 3,
        })
        .then(
          (newImage) => {
            this.imageUrl = (<any>window).Ionic.WebView.convertFileSrc(
              newImage
            );

            this.hasImage = true;
            this.checkImageIsRendered();
            this.readFile(newImage);
          },
          (error) => console.error("Error cropping image", error)
        );
    });
  }
  async readFile(file: any) {
    (<any>window).resolveLocalFileSystemURL(file, (res) => {
      res.file((resFile) => {
        var reader = new FileReader();
        reader.readAsArrayBuffer(resFile);
        reader.onloadend = (evt: any) => {
          this.imgBlob = new Blob([evt.target.result], { type: "image/jpeg" });
        };
      });
    });
  }
  async submitDoubts(doubtForm) {
    let doubt = doubtForm.value;
    console.log(doubt);
    this.sharedService.displayLC();
    if (this.hasImage) {
      console.log(doubt);
      let fileExtension = "png";
      let time = new Date().getMilliseconds();
      let pathName = this.user.uid + this.user.displayName + time;
      pathName = pathName.replace(/\s/g, "");
      this.imageRefrence = this.dataService.setRefrence(
        pathName + "." + fileExtension
      );
      const task = this.dataService.uploadImage(
        pathName + "." + fileExtension,
        this.imgBlob
      );
      task
        .snapshotChanges()
        .pipe(
          finalize(async () => {
            let downloadURL = await this.imageRefrence
              .getDownloadURL()
              .toPromise();
            this.doubt = {
              image: downloadURL,
              uid: this.user.uid,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              updatedAt: "",
              displayName: this.user.displayName,
              status: 0,
              description: doubt.description,
              solution: "",
              class: this.user.class,
              title: doubt.title,
              subject: doubt.subject,
            };
            this.dataService.submitDoubt(this.doubt).then(
              (res: any) => {
                console.log(res);
                this.sharedService.showToast("Doubt Submitted").then(() => {
                  this.hasImage = false;
                  this.doubt = "";
                  doubtForm.reset();
                  this.sharedService.dismissLC();
                  this.modalController.dismiss(true);
                });
              },
              (err) => {
                this.sharedService.errorToast("Error Submitted");
                this.sharedService.dismissLC();
                this.modalController.dismiss(false);
              }
            );
          })
        )
        .subscribe((res: any) => {
          console.log(res);
        });
      // });
    } else {
      this.doubt = {
        image: "",
        uid: this.user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: "",
        displayName: this.user.displayName,
        status: 0,
        description: doubt.description,
        solution: "",
        class: this.user.class,
        title: doubt.title,
        subject: doubt.subject,
        token: this.user.token,
      };
      this.dataService.submitDoubt(this.doubt).then(
        (res: any) => {
          console.log(res);
          this.sharedService.showToast("Doubt Submitted").then(() => {
            this.hasImage = false;
            this.doubt = "";
            this.sharedService.dismissLC();
            doubtForm.reset();
            this.modalController.dismiss(true);
          });
        },
        (err) => {
          this.sharedService.errorToast("Error Submitted");
          this.sharedService.dismissLC();
          this.modalController.dismiss(false);
        }
      );
    }
  }

  dismiss() {
    this.modalController.dismiss(false);
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
    this.sharedService.dismissLC();

    // clearInterval(this.categoryTimeOut);
    this.unsubscribeBackEvent.unsubscribe();
  }

  checkImageIsRendered() {
    // this.sharedService.displayLC();
    this.doubtImg.nativeElement.onload = (event) => {
      console.log("Loaded: ", Date.now());
      const interval = setInterval(() => {
        if (
          this.doubtImg.nativeElement.naturalWidth > 0 &&
          this.doubtImg.nativeElement.naturalHeight > 0
        ) {
          clearInterval(interval);
          this.rendered();
        }
      }, 20);
    };
  }
  rendered() {
    console.log("Rendered: ", Date.now());
    // this.sharedService.dismissLC();
  }

  doRefresh(event) {
    if (this.type == "scores") {
      this.sharedService.displayLC();

      this.dataService.getUserScores().then(
        (querySnapshot: any) => {
          this.scores = [];

          if (!querySnapshot.empty) {
            let i: any = {};
            querySnapshot.forEach((element) => {
              i = element.data();
              i.id = element.id;
              this.scores.push(i);
            });
            this.sharedService.dismissLC();
            event.target.complete();
          } else {
            event.target.complete();
            this.sharedService.dismissLC();
          }
        },
        (err) => {
          event.target.complete();
          this.sharedService.errorToast("Error, please try again.");
          this.sharedService.dismissLC();
        }
      );
    } else {
      event.target.complete();
    }
  }
}
