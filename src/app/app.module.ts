import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { fakeBackendProvider } from './_helpers/index';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { InfrastructuresComponent } from './infrastructures/infrastructures.component';
import { InfrastructureDetailComponent } from './infrastructure-detail/infrastructure-detail.component';
import { AppRoutingModule } from './/app-routing.module';
import { HostgroupsComponent } from './hostgroups/hostgroups.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './auth.service';

import { AuthGuard } from './_guards/index';
import { JwtInterceptor } from './_helpers/index';

import { AlertComponent } from './_directives/index';
import { LoginComponent } from './login/login.component';
import { AlertService, AuthenticationService, UserService, InfrastructureService } from './_services/index';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    InfrastructuresComponent,
    InfrastructureDetailComponent,
    HostgroupsComponent,
    HomeComponent,
    AlertComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    HttpModule
  ],
  providers: [
    AuthGuard,
    InfrastructureService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    AuthService,
    AlertService,
    AuthenticationService,
    UserService
    //fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
