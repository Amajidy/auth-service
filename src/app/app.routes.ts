import { Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {VideoComponent} from "./pages/video/video.component";
import {SignComponent} from "./pages/sign/sign.component";

export const routes: Routes = [
  {path: '', component: AppComponent, children: [
      {
        path: 'video', component: VideoComponent
      },
      { path: 'sign', component: SignComponent },
    ]},
];
