import { Component, OnInit } from "@angular/core";
import { ActionSheetController, Platform } from "@ionic/angular";
import { DataService } from "../services/data.service";
import { AuthService } from "../services/auth.service";
import { finalize } from "rxjs/operators";
import * as firebase from "firebase";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { SharedService } from "../services/shared.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

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
  doubtfrom;
  doubtform: NgForm;
  user;
  imgBlob;
  isProfileCompleted;
  unsubscribeBackEvent;
  constructor(
    private authService: AuthService,
    private actionSheetController: ActionSheetController,
    private dataService: DataService,
    private imagePicker: ImagePicker,
    private camera: Camera,
    private sharedService: SharedService,
    private router: Router,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.isProfileCompleted =
      localStorage.getItem("isCompleted") == "true" ? true : false;
    if (this.isProfileCompleted) {
      this.getDoubts();
    }
  }

  getDoubts() {
    this.sharedService.displayLC();
    this.dataService.getDoubtsByUserID().then((querySnapshot) => {
      this.doubts = [];
      if (!querySnapshot.empty) {
        let i: any = {};
        querySnapshot.forEach((element) => {
          i = element.data();
          i.id = element.id;
          this.doubts.push(i);
        });
        this.sharedService.dismissLC();
      }
    });
  }

  sendDoubt() {}

  addFiles() {}

  submitButton() {}

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
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
    };

    this.camera.getPicture(options).then((imageData) => {
      plugins.crop
        .promise(imageData, {
          quality: 100,
          targetWidth: 1080,
          targetHeight: 1080,
          heightRatio: 1,
          widthRatio: 1,
        })
        .then(
          (newImage) => {
            console.log("new image path is: " + newImage);
            this.imageUrl = (<any>window).Ionic.WebView.convertFileSrc(
              newImage
            );
            console.log(plugins.crop);
            this.hasImage = true;
            this.readFile(newImage);
          },
          (error) => console.error("Error cropping image", error)
        );
    });
  }

  openGallery() {
    // this.imagePicker
    //   .getPictures({
    //     maximumImagesCount: 1,
    //     quality: 100,
    //     outputType: 0,
    //     width: 1080,
    //     height: 1080,
    //   })
    //   .then((results) => {
    //     for (var i = 0; i < results.length; i++) {
    //       this.tempImageUrl = results[i];
    //     }
    //     plugins.crop
    //       .promise(this.tempImageUrl, {
    //         quality: 100,
    //         targetWidth: 1080,
    //         heightRatio: 1,
    //         widthRatio: 1,
    //       })
    //       .then(
    //         (newImage) => {
    //           this.imageUrl = (<any>window).Ionic.WebView.convertFileSrc(
    //             newImage
    //           );
    //           this.readFile(newImage);
    //           this.hasImage = true;
    //         },
    //         (error) => console.error("Error cropping image", error)
    //       );
    //   });
    // (err) => {
    //   console.log(err);
    // };

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    };

    this.camera.getPicture(options).then((imageData) => {
      plugins.crop
        .promise(imageData, {
          quality: 100,
          targetWidth: 1080,
          targetHeight: 1080,
          heightRatio: 1,
          widthRatio: 1,
        })
        .then(
          (newImage) => {
            console.log("new image path is: " + newImage);
            this.imageUrl = (<any>window).Ionic.WebView.convertFileSrc(
              newImage
            );
            console.log(plugins.crop);
            this.hasImage = true;
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
  async submitDoubts(doubt) {
    this.sharedService.displayLC();
    let user = await this.authService.currentUserDetail();

    if (this.hasImage) {
      console.log(doubt);
      this.dataService
        .getUserInformation(user.providerData[0].uid)
        .then((res: any) => {
          let fileExtension = "png";
          let time = new Date().getMilliseconds();
          let pathName = user.uid + user + time;
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
                  uid: user.providerData[0].uid,
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                  updatedAt: "",
                  displayName: user.providerData[0].displayName,
                  status: 0,
                  description: doubt.description,
                  solution: "",
                };
                this.dataService.submitDoubt(this.doubt).then(
                  (res: any) => {
                    console.log(res);
                    this.sharedService.showToast("Doubt Submitted").then(() => {
                      this.hasImage = false;
                      this.doubt = "";
                      this.doubtform.reset();

                      this.sharedService.dismissLC();
                      this.getDoubts();
                    });
                  },
                  (err) => {
                    this.sharedService.errorToast("Error Submitted");
                    this.sharedService.dismissLC();
                  }
                );
              })
            )
            .subscribe((res: any) => {
              console.log(res);
            });
        });
    } else {
      this.doubt = {
        image: "",
        uid: user.providerData[0].uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: "",
        displayName: user.providerData[0].displayName,
        status: 0,
        description: doubt.description,
        solution: "",
      };
      this.dataService.submitDoubt(this.doubt).then(
        (res: any) => {
          console.log(res);
          this.sharedService.showToast("Doubt Submitted").then(() => {
            this.hasImage = false;
            this.doubt = "";
            this.sharedService.dismissLC();
            this.doubtform.reset();
            this.getDoubts();
          });
        },
        (err) => {
          this.sharedService.errorToast("Error Submitted");
          this.sharedService.dismissLC();
        }
      );
    }
  }

  doubtDetail(data) {
    this.router.navigate(["/doubt-detail", data.id]);
  }

  doubtToggleChanged(event) {
    console.log(event);
    console.log(this.doubtfrom);
    if (this.doubtfrom == true) {
      this.doubts = [];
      this.dataService.getAllDoubts().then((querySnapshot: any) => {
        if (!querySnapshot.empty) {
          let i: any = {};
          querySnapshot.forEach((element) => {
            i = element.data();
            i.id = element.id;
            this.doubts.push(i);
          });
        }
      });
    } else {
      this.doubts = [];

      this.dataService.getDoubtsByUserID().then((querySnapshot) => {
        if (!querySnapshot.empty) {
          let i: any = {};
          querySnapshot.forEach((element) => {
            i = element.data();
            i.id = element.id;
            this.doubts.push(i);
          });
        }
      });
    }
  }

  completeProfile() {
    this.authService.getUserInformation().then((user) => {
      this.authService
        .getUserDetail(user.providerData[0].uid)
        .then((res: any) => {
          if (res.exists) {
            this.user = res.data();
            this.router.navigate(["/profile"], {
              queryParams: { uid: this.user.uid, root: "tabs/doubts" },
            });
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
            this.router.navigate(["tabs/tab1"]);
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
}
