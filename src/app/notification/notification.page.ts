import { Component, OnInit, ViewChild } from "@angular/core";

import {
  StreamingMedia,
  StreamingVideoOptions,
} from "@ionic-native/streaming-media/ngx";

import {
  DocumentViewer,
  DocumentViewerOptions,
} from "@ionic-native/document-viewer/ngx";

import { File } from "@ionic-native/file/ngx";
import {
  FileTransfer,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { Subscription } from "rxjs";
import { Platform, ModalController } from "@ionic/angular";
import { PreviewAnyFile } from "@ionic-native/preview-any-file/ngx";
import { ActivatedRoute, Router } from "@angular/router";
import { DataService } from "../services/data.service";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { VideoPlayer } from "@ionic-native/video-player/ngx";

import { LectureDetailPage } from "../lecture-detail/lecture-detail.page";
import { SharedService } from "../services/shared.service";

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
  constructor(
    private streamingMedia: StreamingMedia,
    private platform: Platform,
    private activatedRouter: ActivatedRoute,
    private dataService: DataService,
    private sharedService: SharedService,
    private router: Router,
    private modalController: ModalController,
    private transfer: FileTransfer,
    private file: File,
    private VideoPlayer: VideoPlayer
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
            this.isloaded = true;
          } else {
            console.log("Note");
          }
        });
      });
    });
  }

  playVideoLocal() {
    let options: StreamingVideoOptions = {
      successCallback: () => {
        console.log("Video played");
      },
      errorCallback: (e) => {
        console.log("Error streaming");
      },
      orientation: "landscape",
      shouldAutoClose: true,
      controls: true,
    };
    this.streamingMedia.playVideo(this.note.videoLink, options);
    // this.sharedService.displayLC();
    // this.VideoPlayer.play(this.note.videoLink, {
    //   scalingMode: 1,
    // }).then((res: any) => {
    //   console.log(res);
    //   this.sharedService.dismissLC();
    // });
  }

  async onClick() {
    const modal = await this.modalController.create({
      component: LectureDetailPage,
      componentProps: { items: this.note.notesImage },
    });
    await modal.present();
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
