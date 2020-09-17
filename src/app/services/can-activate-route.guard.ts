import { Injectable } from "@angular/core";
import { CanActivate, CanActivateChild, Router } from "@angular/router";
import { DataService } from "./data.service";
import { AuthService } from "./auth.service";
import { SharedService } from "./shared.service";
import * as firebase from "firebase";
@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private dataService: DataService,
    private authService: AuthService,
    private sharedService: SharedService
  ) {}
  async canActivate(router, data) {
    let user = await this.authService.currentUserDetail();
    this.dataService
      .checkIfUserValid(firebase.auth().currentUser.uid)
      .then((res) => {
        if (res) {
          return true;
        } else {
          this.sharedService.errorToast("User not active.");
          console.log(this.router);
          this.router.navigate(["/tabs/tab1"]);
          return false;
        }
      });
    return true;
  }

  canActivateChild() {
    console.log("checking child route access");
    return true;
  }
}
