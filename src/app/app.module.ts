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

import { AppMinimize } from "@ionic-native/app-minimize/ngx";

import { File } from "@ionic-native/file/ngx";

import { FileTransfer } from "@ionic-native/file-transfer/ngx";

import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";
import { AuthGuard } from "./services/can-activate-route.guard";

import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";

import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { FileEncryption } from "@ionic-native/file-encryption/ngx";
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
      rippleEffect: true,
      mode: "md",
    }),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: AuthGuard },
    GooglePlus,
    ImagePicker,
    Camera,
    AppMinimize,
    FileTransfer,
    File,
    InAppBrowser,
    FCM,
    ScreenOrientation,
    SocialSharing,
    FileEncryption,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
