import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEventsComponent } from './components/add-events/add-events.component';
import { AddOffersWantedComponent } from './components/add-offers-wanted/add-offers-wanted.component';
import { ReviewPanelComponent } from './components/review-panel/review-panel.component';
import { AdminGuard } from '../../guards/admin.guard'


const routes: Routes = [
  { path: '', redirectTo: 'add-offer' },
  { path: 'add-offer', component: AddOffersWantedComponent },
  { path: 'add-event', component: AddEventsComponent },
  { path: 'review', component: ReviewPanelComponent, canActivate: [AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
