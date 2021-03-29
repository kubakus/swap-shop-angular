import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminActionsRoutingModule } from './admin-actions-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItemPanelComponent } from './components/item-panel/item-panel.component';

@NgModule({
  declarations: [LayoutComponent, ItemPanelComponent],
  imports: [CommonModule, AdminActionsRoutingModule, MaterialModule, SharedModule],
})
export class AdminActionsModule {}
