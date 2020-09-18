import { Component, OnInit } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { DataService } from "../services/data.service";
import { SharedService } from "../services/shared.service";

@Component({
  selector: "app-quiz",
  templateUrl: "./quiz.page.html",
  styleUrls: ["./quiz.page.scss"],
})
export class QuizPage implements OnInit {
  quizzes = [];
  constructor(
    private appBrowser: InAppBrowser,
    private dataService: DataService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.sharedService.displayLC();
    this.dataService.getQuizzes().then(
      (querySnapshot: any) => {
        if (!querySnapshot.empty) {
          let i: any = {};
          querySnapshot.forEach((element) => {
            i = element.data();
            i.id = element.id;
            this.quizzes.push(i);
          });
          this.sharedService.dismissLC();
        } else {
          this.sharedService.dismissLC();
        }
      },
      (err) => {
        this.sharedService.dismissLC();
      }
    );
  }

  onClick(item) {
    if (item.status) {
      this.sharedService.displayLC();
      const browser = this.appBrowser.create(item.link, "_self", {
        fullscreen: "yes",
        toolbar: "no",
        location: "no",
        zoom: "no",
      });

      browser.show();

      browser.on("loadstop").subscribe((event) => {
        this.sharedService.dismissLC();
      });
    } else {
      this.sharedService.errorToast("Submission is closed for this quiz.");
    }
  }
  doRefresh(event) {
    this.dataService.getQuizzes().then(
      (querySnapshot: any) => {
        this.quizzes = [];
        if (!querySnapshot.empty) {
          let i: any = {};
          querySnapshot.forEach((element) => {
            i = element.data();
            i.id = element.id;
            this.quizzes.push(i);
          });
          this.sharedService.dismissLC();
          event.target.complete();
        } else {
          this.sharedService.dismissLC();
          event.target.complete();
        }
      },
      (err) => {
        event.target.complete();

        this.sharedService.dismissLC();
      }
    );
  }
}
