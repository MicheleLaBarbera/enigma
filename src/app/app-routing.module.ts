import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InfrastructuresComponent }      from './infrastructures/infrastructures.component';
import { InfrastructureDetailComponent } from './infrastructure-detail/infrastructure-detail.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_guards/index';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
	{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'infrastructures', component: InfrastructuresComponent, canActivate: [AuthGuard] },
  { path: 'infrastructure/:id', component: InfrastructureDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes) ]
})
export class AppRoutingModule {}