import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';
// import { NgxMatMomentModule } from "@angular-material-components/moment-adapter";

const modules = [
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatButtonModule,
  MatSelectModule,
  MatDatepickerModule,
  MatIconModule,
  MatMenuModule,
  MatTreeModule,
  MatExpansionModule,
  MatDividerModule,
  MatCheckboxModule,
  FormsModule,
  MatProgressSpinnerModule,
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule,
  // NgxMatMomentModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class MaterialModule {}
