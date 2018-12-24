import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { QuizComponent } from './quiz/quiz.component';
import { ItemsComponent } from './items/items.component';
import { RestApiService } from './rest-api.service';
import { DataService } from './data.service';
import { MessageComponent } from './message/message.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth-guard.service';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { PostItemComponent } from './post-item/post-item.component';
import { BinComponent } from './bin/bin.component';
import { ItemComponent } from './item/item.component';
import { AboutComponent } from './about/about.component';
import { SearchComponent } from './search/search.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { TypeComponent } from './type/type.component';
import { TypesComponent } from './types/types.component';
import { MapComponent } from './map/map.component';
import { UserManualComponent } from './user-manual/user-manual.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuizComponent,
    ItemsComponent,
    MessageComponent,
    RegistrationComponent,
    LoginComponent,
    RegistrationComponent,
    ProfileComponent,
    RegistrationComponent,
    SettingsComponent,
    PostItemComponent,
    BinComponent,
    ItemComponent,
    AboutComponent,
    SearchComponent,
    EditItemComponent,
    TypeComponent,
    TypesComponent,
    MapComponent,
    UserManualComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    BrowserAnimationsModule,


  ],
  providers: [RestApiService, DataService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
