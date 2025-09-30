import { Routes } from '@angular/router';
import {VideoComponent} from "./pages/video/video.component";
import {SignComponent} from "./pages/sign/sign.component";
import {MainLayoutComponent} from "./pages/main-layout/main-layout.component";
import {ShahkarComponent} from "./pages/shahkar/shahkar.component";

export const routes: Routes = [
  {path: '', component: MainLayoutComponent, children: [
      {
        path: 'video', component: VideoComponent
      },
      { path: 'sign', component: SignComponent },
      { path: 'shahkar', component: ShahkarComponent },
    ]
  },
];
