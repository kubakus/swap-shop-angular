import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEventsComponent } from './add-events/add-events.component';
import { AddOffersWantedComponent } from './add-offers-wanted/add-offers-wanted.component';

const routes: Routes = [
  { path: '', component: AddOffersWantedComponent },
  { path: 'add-event', component: AddEventsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersPagesRoutingModule {}
