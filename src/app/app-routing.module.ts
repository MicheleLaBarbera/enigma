import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuard, AdminGuard } from './_guards/index';
import { LoginComponent } from './login/login.component';
import { HostgroupComponent } from './hostgroup/hostgroup.component';
import { AcpComponent } from './acp/acp.component';
import { RecoverComponent } from './recover/recover.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
	{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
	{ path: 'hostgroup/:id', component: HostgroupComponent, canActivate: [AuthGuard] },
	{ path: 'reset/:token', component: RecoverComponent },
	{ path: 'site/:id/hostgroup/:id2', component: HostgroupComponent, canActivate: [AuthGuard] },
	{ path: 'admin', component: AcpComponent, canActivate: [AuthGuard, AdminGuard]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule {}
