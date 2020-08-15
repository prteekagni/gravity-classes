import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from "@angular/fire/auth-guard";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["login"]);

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./tabs/tabs.module").then((m) => m.TabsPageModule),
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: "notification/:id",
    loadChildren: () =>
      import("./notification/notification.module").then(
        (m) => m.NotificationPageModule
      ),
  },
  {
    path: "doubts",
    loadChildren: () =>
      import("./doubts/doubts.module").then((m) => m.DoubtsPageModule),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginPageModule),
  },
  {
    path: "profile",
    loadChildren: () =>
      import("./profile/profile.module").then((m) => m.ProfilePageModule),
  },
  {
    path: "doubt-detail/:id",
    loadChildren: () =>
      import("./doubt-detail/doubt-detail.module").then(
        (m) => m.DoubtDetailPageModule
      ),
  },
  {
    path: "lecture-detail",
    loadChildren: () =>
      import("./lecture-detail/lecture-detail.module").then(
        (m) => m.LectureDetailPageModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
