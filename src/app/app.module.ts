import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UiModule } from './ui/ui.module';
import { JwtModule } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    AppComponent  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AdminModule,
    ToastrModule.forRoot(),
    UiModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    HttpClientModule,
    JwtModule.forRoot({
      config:{
        tokenGetter: () => localStorage.getItem("accessToken"),
        allowedDomains: ["localhost:7033"]
        // disallowedRoutes gönderilmemesi gereken url ler için
      }
    })
  ],
  providers: [
    {provide: "baseUrl", useValue: "https://localhost:7033/api", multi:true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
