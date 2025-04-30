import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ColorCoordinateComponent} from './color-coordinate/color-coordinate.component';
import { EditorComponent } from './editor/editor.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'color-coordinate', component: ColorCoordinateComponent},
  { path: 'editor', component: EditorComponent},
  { path: '**', redirectTo: '' }
];