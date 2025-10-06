import { Routes } from '@angular/router';
import {VideoComponent} from "./pages/video/video.component";
import {SignComponent} from "./pages/sign/sign.component";
import {MainLayoutComponent} from "./pages/main-layout/main-layout.component";
import {ShahkarComponent} from "./pages/shahkar/shahkar.component";
import {userResolver} from "./resolver/user.resolver";
import {LinkCreatorComponent} from "./pages/link-creator/link-creator.component";
import {CompletedComponent} from "./pages/completed/completed.component";

export const routes: Routes = [
  { path: '', component: MainLayoutComponent,
    resolve: { user: userResolver },
    children: [
      { path: 'video', component: VideoComponent },
      { path: 'sign', component: SignComponent },
      { path: 'shahkar', component: ShahkarComponent },
      { path: 'completed', component: CompletedComponent },
    ]
  },
  { path: 'link-creator', component: LinkCreatorComponent },
];
