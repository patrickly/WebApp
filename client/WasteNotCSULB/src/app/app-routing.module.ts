import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { QuizComponent } from './quiz/quiz.component';
import { NewsComponent } from './news/news.component';
import { ItemComponent } from './item/item.component';
import { ItemsComponent } from './items/items.component';
import { CategoriesComponent } from './categories/categories.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { PostItemComponent } from './post-item/post-item.component';
import { CategoryComponent } from './category/category.component';
import { SummaryComponent } from './summary/summary.component';
import { SearchComponent } from './search/search.component';


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
  {
    path: 'profile/settings',
    component: SettingsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'profile/postitem',
    component: PostItemComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'quiz',
    component: QuizComponent
  },
  {
    path: 'summary',
    component: SummaryComponent
  },
  { path: 'news',
    component: NewsComponent
  },
  { path: 'items',
    component: ItemsComponent
  },
  { path: 'item/:id',
    component: ItemComponent
  },
  { path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'categories/:id',
    component: CategoryComponent,
  },
  {
    path: 'search',
    component: SearchComponent
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
