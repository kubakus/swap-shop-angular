import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';

const accountModule = () => import('./components/account/account.module').then(x => x.AccountModule)
const homeModule = () => import('./components/home/home.module').then(x => x.HomeModule);

const routes: Routes = [
  { path: '', loadChildren: homeModule, canActivate: [AuthGuard]},
  { path: 'account', loadChildren: 
  accountModule
 }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
