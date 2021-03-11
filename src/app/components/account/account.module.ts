import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { RegisterComponent } from './components/register/register.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [RegisterComponent, LayoutComponent, LoginComponent],
  imports: [CommonModule, ReactiveFormsModule, AccountRoutingModule, MaterialModule],
})
export class AccountModule {}
