import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//import { fakeBackendProvider } from './_helpers/index';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './/app-routing.module';
import { HomeComponent } from './home/home.component';

import { AuthGuard, AdminGuard } from './_guards/index';
import { JwtInterceptor } from './_helpers/index';
import { EqualValidator } from './_helpers/equal-validator.directive';

import { AlertComponent } from './_directives/index';
import { LoginComponent } from './login/login.component';
import { AlertService, AuthenticationService, UserService, HostgroupService } from './_services/index';
import { HostgroupComponent } from './hostgroup/hostgroup.component';

import { SanitizerPipe } from './sanitizer.pipe';
import { FooterComponent } from './footer/footer.component';
import { AcpComponent } from './acp/acp.component';
import { ProfileComponent } from './profile/profile.component';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { MyDatePickerModule } from 'mydatepicker';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { jqxChartComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxchart';
                                              
import { RecoverComponent } from './recover/recover.component';

import { HttpErrorHandler } from'./http-error-handler.service';

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
    ProfileComponent,
    EqualValidator,
    jqxChartComponent,
    RecoverComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    NgxPaginationModule,
    MyDatePickerModule,
    NgxChartsModule
  ],
  providers: [
    AuthGuard,
    AdminGuard,
    HostgroupService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    AlertService,
    AuthenticationService,
    UserService,
    HttpErrorHandler
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
