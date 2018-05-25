import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_guards/index';
import { LoginComponent } from './login/login.component';
import { HostgroupComponent } from './hostgroup/hostgroup.component';
import { AcpComponent } from './acp/acp.component';

const routes: Routes = [
	{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
	{ path: 'hostgroup/:id', component: HostgroupComponent },
	{ path: 'hostgroup/:id/:id2', component: HostgroupComponent },
	{ path: 'admin', component: AcpComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule {}
