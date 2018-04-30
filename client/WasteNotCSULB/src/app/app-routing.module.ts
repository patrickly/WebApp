import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { QuizComponent } from './quiz/quiz.component';
import { NewsComponent } from './news/news.component';
import { ItemsComponent } from './items/items.component';
import { CategoriesComponent } from './categories/categories.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

import { AuthGuardService } from './auth-guard.service';

import { AuthGuardService } from './auth-guard.service';



const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'register',
    component: RegistrationComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService],
  },
  /*
  {
    path: 'profile/postitem',
    component: PostItemComponent,
    canActivate: [AuthGuardService],
  },
  */
  {
    path: 'quiz',
    component: QuizComponent
  },
  { path: 'news',
    component: NewsComponent
  },
  { path: 'items',
    component: ItemsComponent
  },
  { path: 'categories',
    component: CategoriesComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
