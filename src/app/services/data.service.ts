import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";

import * as firebase from "firebase";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class DataService {
  countDocumentID;
  constructor(
    private angularFireStore: AngularFirestore,
    private angularFireStorage: AngularFireStorage,
    private authService: AuthService
  ) {
    this.getCountDocument().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((element) => {
          this.countDocumentID = element.id;
        });
      }
    });
  }

  async checkIfUserExists(uid) {
    return this.angularFireStore.firestore.collection("users").doc(uid).get();
  }

  async checkIfUserValid(uid) {
    return this.angularFireStore.firestore
      .collection("users")
      .doc(uid)
      .get()
      .then((res: any) => {
        if (res.exists) {
          let user = res.data();
          if (user.active == true) return true;
          else return false;
        }
      });
  }
  async addUserToDatabase(data) {
    return this.angularFireStore
      .collection("users")
      .doc(data.uid)
      .set(Object.assign({}, data));
  }

  async getUserInformation(uid) {
    return this.angularFireStore.firestore.collection("users").doc(uid).get();
  }

  async updateUserCount(count) {
    return this.angularFireStore.firestore
      .collection("counts")
      .doc(this.countDocumentID)
      .update({
        users: firebase.firestore.FieldValue.increment(count),
      });
  }

  async getCountDocument() {
    return this.angularFireStore.firestore.collection("counts").get();
  }
  uploadImage(randomId, uploadUrl) {
    return this.angularFireStorage.upload(randomId, uploadUrl);
  }
  setRefrence(uploadpath) {
    return this.angularFireStorage.ref(uploadpath);
  }

  submitDoubt(doubt) {
    return this.angularFireStore.firestore.collection("doubts").add(doubt);
  }

  updateUserProfile(data) {
    return this.angularFireStore.firestore
      .collection("users")
      .doc(data.uid)
      .update(data);
  }

  getDoubts() {
    return this.angularFireStore.firestore.collection("doubts").get();
  }

  getDoubtDetail(ID) {
    return this.angularFireStore.firestore.collection("doubts").doc(ID).get();
  }

  async getDoubtsByUserID() {
    let uid = await (await this.authService.currentUserDetail()).providerData[0]
      .uid;
    return this.angularFireStore.firestore
      .collection("doubts")
      .where("uid", "==", uid)
      .get();
  }

  async getAllDoubts() {
    return this.angularFireStore.firestore
      .collection("doubts")
      .where("class", "==", localStorage.getItem("Class"))
      .get();
  }

  async getAllNotes() {
    return this.angularFireStore.firestore
      .collection("notes")
      .where("class", "==", localStorage.getItem("Class"))
      .get();
  }

  async getNoteDetail(id) {
    return this.angularFireStore.firestore.collection("notes").doc(id).get();
  }

  getAssigments() {
    return this.angularFireStore.firestore
      .collection("assigments")
      .where("class", "==", localStorage.getItem("Class"))
      .get();
  }

  getFacts() {
    return this.angularFireStore.firestore.collection("facts").get();
  }

  getAnnounements() {
    return this.angularFireStore.firestore.collection("annoucements").get();
  }
}
