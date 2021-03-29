import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';

const accountModule = () =>
  import('./components/account/account.module').then((x) => x.AccountModule);
const homeModule = () =>
  import('./components/users-pages/users-pages.module').then((x) => x.HomeModule);
const adminModule = () =>
  import('./components/admin-actions/admin-actions.module').then((x) => x.AdminActionsModule);

const routes: Routes = [
  { path: '', loadChildren: homeModule, canActivate: [AuthGuard] },
  { path: 'account', loadChildren: accountModule },
  { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard, AdminGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
