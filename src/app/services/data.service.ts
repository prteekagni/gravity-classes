import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";

import * as firebase from "firebase";
import { AuthService } from "./auth.service";
import { FCM } from "cordova-plugin-fcm-with-dependecy-updated/ionic/ngx";

@Injectable({
  providedIn: "root",
})
export class DataService {
  countDocumentID;
  constructor(
    private angularFireStore: AngularFirestore,
    private angularFireStorage: AngularFireStorage,
    private authService: AuthService,
    private fcm: FCM
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
    return this.angularFireStore.firestore
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();
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
  async addUserToDatabase(data) {
    return this.angularFireStore
      .collection("users")
      .doc(data.uid)
      .set(Object.assign({}, data));
  }

  async getUserInformation(uid) {
    return this.angularFireStore.firestore
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get();
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

  async getDoubtsByUserID(subject) {
    return this.angularFireStore.firestore
      .collection("doubts")
      .where("uid", "==", firebase.auth().currentUser.uid)
      .where("subject", "==", subject)
      .orderBy("createdAt", "desc")
      .get();
  }

  async getAllDoubts(subject) {
    return this.angularFireStore.firestore
      .collection("doubts")
      .where("class", "==", localStorage.getItem("Class"))
      .where("subject", "==", subject)
      .orderBy("createdAt", "desc")
      .get();
  }

  async getAllNotes(subject) {
    return this.angularFireStore.firestore
      .collection("notes")
      .where("class", "==", localStorage.getItem("Class"))
      .where("subject", "==", subject)
      .orderBy("createdAt", "desc")
      .get();
  }

  async getNoteDetail(id) {
    return this.angularFireStore.firestore.collection("notes").doc(id).get();
  }

  getAssigments(subject) {
    return this.angularFireStore.firestore
      .collection("assigments")
      .where("class", "==", localStorage.getItem("Class"))
      .where("subject", "==", subject)
      .orderBy("createdAt", "desc")
      .get();
  }

  getFacts() {
    return this.angularFireStore.firestore.collection("facts").get();
  }

  getAnnounements() {
    return this.angularFireStore.firestore.collection("annoucements").get();
  }

  updateToken(uid, updateValue) {
    return this.angularFireStore
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        token: updateValue,
      });
  }

  subscribeToTopic(topic) {
    return this.fcm.subscribeToTopic(topic);
  }

  setLoginStatus(uid, status) {
    return this.angularFireStore
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        isLoggedIn: status,
      });
  }

  async addLoginLogs(data) {
    return this.angularFireStore.firestore.collection("logs").add(data);
  }

  addDataToMap(data) {
    return this.angularFireStore.firestore
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({ scores: {} });
  }

  getUserScores() {
    return this.angularFireStore.firestore
      .collection("usersQuiz")
      .where("uid", "==", firebase.auth().currentUser.uid)
      .get();
  }

  getQuizzes() {
    return this.angularFireStore.firestore
      .collection("quiz")
      .where("class", "==", localStorage.getItem("Class"))
      .get();
  }
}
