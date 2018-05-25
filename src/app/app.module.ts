import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { fakeBackendProvider } from './_helpers/index';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './/app-routing.module';
import { HomeComponent } from './home/home.component';

import { AuthGuard } from './_guards/index';
import { JwtInterceptor } from './_helpers/index';

import { AlertComponent } from './_directives/index';
import { LoginComponent } from './login/login.component';
import { AlertService, AuthenticationService, UserService, HostgroupService } from './_services/index';
import { HostgroupComponent } from './hostgroup/hostgroup.component';

import { SanitizerPipe } from './sanitizer.pipe';
import { FooterComponent } from './footer/footer.component';
import { AcpComponent } from './acp/acp.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AlertComponent,
    LoginComponent,
    HostgroupComponent,
    SanitizerPipe,
    FooterComponent,
    AcpComponent,
    ProfileComponent
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
    HostgroupService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    AlertService,
    AuthenticationService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
