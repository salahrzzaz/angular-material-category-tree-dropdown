import { Routes } from '@angular/router';
import { ParentComponent } from './parent/parent-component.component';

export const routes: Routes = [
  { path: 'example', component: ParentComponent },
  { path: '', redirectTo: '/example', pathMatch: 'full' } // Redirect root to /example
];
