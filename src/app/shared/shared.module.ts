import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { ItemPanelComponent } from './components/item-panel/item-panel.component';
import { LoadingComponent } from './components/loading/loading.component';

const components = [LoadingComponent, ItemPanelComponent];

const declarations = [...components];

@NgModule({
  declarations: declarations,
  imports: [MaterialModule, CommonModule],
  exports: declarations,
})
export class SharedModule {}
