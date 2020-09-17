import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { ModalController, IonSlides } from "@ionic/angular";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

declare var cordova;
@Component({
  selector: "app-lecture-detail",
  templateUrl: "./lecture-detail.page.html",
  styleUrls: ["./lecture-detail.page.scss"],
})
export class LectureDetailPage implements OnInit {
  @Input() items;
  @Input() title;
  decryptedItems: any = [];
  index;
  @ViewChild("slides", { read: IonSlides, static: false }) slides: IonSlides;
  @ViewChild("header", { read: ElementRef }) header;
  encryptKey = "gravityClassesKey";

  constructor(
    private modalController: ModalController,
    private screenOrientation: ScreenOrientation,
    private statusBar: StatusBar
  ) {}

  ngOnInit() {
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  ionViewWillEnter() {
    this.statusBar.hide();
    this.screenOrientation.unlock();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    // detect orientation changes
    this.screenOrientation.onChange().subscribe((res) => {
      console.log(this.header);
      console.log(res);
      if (screen.orientation.type == "landscape-primary") {
        this.header.nativeElement.style.display = "none";
      } else {
        this.header.nativeElement.style.display = "block";
      }
      console.log("Orientation Changed");
    });
    // this.items.forEach((element) => {
    //   console.log("Element" + element);
    //   cordova.plugins.disusered.safe.decrypt(
    //     element,
    //     this.encryptKey,
    //     function (decryptedFile) {
    //       console.log("Decrypted file: " + decryptedFile);
    //     },
    //     error
    //   );
    //   // this.decryptedItems.push(element);
    //   function success() {
    //     console.log("success");
    //   }
    //   function error() {}
    // });
    // for (var i = 0; i < this.items; i++) {
    //   this.decrpytion(this.items[i]);
    // }
  }

  decrpytion(item) {
    return new Promise((resolve, reject) => {
      cordova.plugins.disusered.safe.decrypt(
        item,
        this.encryptKey,
        function (decryptedFile) {
          console.log("Decrypted file: " + decryptedFile);
          resolve(decryptedFile);
        },
        error
      );
      // this.decryptedItems.push(element);
      function success() {
        console.log("success");
      }
      function error() {}
    });
  }

  ionViewWillLeave() {
    this.statusBar.show();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }
}
