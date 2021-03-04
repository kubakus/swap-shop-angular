import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

import { UsersPagesRoutingModule } from './users-pages-routing.module';
import { AddOffersWantedComponent } from './add-offers-wanted/add-offers-wanted.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddEventsComponent } from './add-events/add-events.component';

@NgModule({
  declarations: [AddOffersWantedComponent, AddEventsComponent],
  imports: [
    CommonModule,
    UsersPagesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class HomeModule {}
