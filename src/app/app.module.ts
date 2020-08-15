import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { environment } from "src/environments/environment";

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";

import { AngularFireStorageModule } from "@angular/fire/storage";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { GooglePlus } from "@ionic-native/google-plus/ngx";

import { ImagePicker } from "@ionic-native/image-picker/ngx";

import { Camera } from "@ionic-native/camera/ngx";

import { StreamingMedia } from "@ionic-native/streaming-media/ngx";

import { AppMinimize } from "@ionic-native/app-minimize/ngx";

import { DocumentViewer } from "@ionic-native/document-viewer/ngx";

import { File } from "@ionic-native/file/ngx";

import { FileTransfer } from "@ionic-native/file-transfer/ngx";

import { PreviewAnyFile } from "@ionic-native/preview-any-file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";

import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

import { FullScreenImage } from "@ionic-native/full-screen-image/ngx";
import { VideoPlayer } from "@ionic-native/video-player/ngx";

import { BackgroundMode } from "@ionic-native/background-mode/ngx";
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot({
      rippleEffect: false,
      mode: "md",
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    GooglePlus,
    ImagePicker,
    Camera,
    StreamingMedia,
    AppMinimize,
    DocumentViewer,
    FileTransfer,
    File,
    PreviewAnyFile,
    FileOpener,
    InAppBrowser,
    VideoPlayer,
    BackgroundMode,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
