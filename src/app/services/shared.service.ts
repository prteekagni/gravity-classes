import { Injectable } from "@angular/core";
import {
  ToastController,
  LoadingController,
  PopoverController,
  ModalController,
  AlertController,
  ActionSheetController,
} from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  loading;
  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) {}
  async showToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1800,
      position: "middle",
      cssClass: "toastStyle",
    });
    toast.present();
  }

  async errorToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: "middle",
      cssClass: "errorToastStyle",
    });
    toast.present();
  }

  async displayLC() {
    this.loading = await this.loadingController.create({
      message: "Please wait...",
      // duration: 2000,
    });
    await this.loading.present();
  }

  async dismissLC() {
    if (this.loading) this.loadingController.dismiss();
  }

  async removeTopElements() {
    try {
      const element = await this.toastController.getTop();
      if (element) {
        element.dismiss();
        return true;
      }
    } catch (error) {}
    try {
      const element = await this.loadingController.getTop();
      if (element) {
        element.dismiss();
        return true;
      }
    } catch (error) {}
    try {
      const element = await this.popoverController.getTop();
      if (element) {
        element.dismiss();
        return true;
      }
    } catch (error) {}

    try {
      const element = await this.alertController.getTop();
      if (element) {
        element.dismiss();
        return true;
      }
    } catch (err) {}
    try {
      const element = await this.actionSheetController.getTop();
      if (element) {
        element.dismiss();
        return true;
      }
    } catch (err) {}
    try {
      const element = await this.modalController.getTop();
      if (element) {
        element.dismiss();
        return true;
      }
    } catch (err) {}
  }
}
