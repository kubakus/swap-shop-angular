import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

import { HomeRoutingModule } from './home-routing.module';
import { AddOffersWantedComponent } from './components/add-offers-wanted/add-offers-wanted.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddEventsComponent } from './components/add-events/add-events.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReviewPanelComponent } from './components/review-panel/review-panel.component';
import { CreateSubscriptionComponent } from './components/create-subscription/create-subscription.component';

@NgModule({
  declarations: [
    AddOffersWantedComponent,
    AddEventsComponent,
    ReviewPanelComponent,
    CreateSubscriptionComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    SharedModule,
  ],
})
export class HomeModule {}
