import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { GooglePlus } from "@ionic-native/google-plus/ngx";
import * as firebase from "firebase";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private angularFireStore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private googlePlus: GooglePlus
  ) {}

  updateUserDataAfterLogin(data) {
    return this.angularFireStore
      .collection("users")
      .doc(data.uid)
      .set(Object.assign({}, data));
  }

  checkIfUserExists() {}

  getUserInformation() {
    return this.angularFireAuth.currentUser;
  }

  getUserDetail(id) {
    return this.angularFireStore.firestore
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();
  }

  updateDisplayName(id, displayName) {
    return this.angularFireStore.firestore
      .collection("users")
      .doc(id)
      .update({ displayName: displayName });
  }

  async loginWithGoogle() {
    return this.googlePlus.login({
      webClientId:
        "583144632509-2oppimvqbngk0trokkebg14st8v4ra5i.apps.googleusercontent.com",
      offline: true,
    });
  }

  async signInWithCredential(accessToken, accessSecret) {
    const credential = accessSecret
      ? firebase.auth.GoogleAuthProvider.credential(accessToken, accessSecret)
      : firebase.auth.GoogleAuthProvider.credential(accessToken);
    return this.angularFireAuth.signInWithCredential(credential);
  }

  async disconnectFromGoogle() {
    this.googlePlus.disconnect();
  }

  currentUserDetail() {
    return this.angularFireAuth.currentUser;
  }

  async logOut() {
    return this.angularFireAuth.signOut();
  }

  async checkIfUserValid(uid) {
    return this.angularFireStore.firestore
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((res: any) => {
        if (res.exists) {
          let user = res.data();
          if (user.active == true) return true;
          else return false;
        }
      });
  }
}
