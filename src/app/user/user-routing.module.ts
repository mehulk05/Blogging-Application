import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/shared/services/auth.gaurd';
import { AddEditArticleComponent } from './components/add-edit-article/add-edit-article.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';
import { ArticleListingComponent } from './components/article-listing/article-listing.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { MyArticlesComponent } from './components/my-articles/my-articles.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserAuthComponent } from './components/user-auth/user-auth.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { UserWrapperComponent } from './components/user-wrapper/user-wrapper.component';

const routes: Routes = [

  {
    path: '',
    component: UserWrapperComponent,
    children: [

      {
        path: 'register',
        component: UserRegisterComponent
      },

      {
        path: 'login',
        component: UserAuthComponent
      },
      {
        path: 'add-article',
        component: AddEditArticleComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'edit-profile/:id',
        component: EditProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'edit/:id',
        component: AddEditArticleComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'article',
        component: ArticleListingComponent,
      },
      {
        path: 'about',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'myarticles',
        component: MyArticlesComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'forget-password',
        component: ForgetPasswordComponent,

      },

      {
        path: 'article-detail/:id',
        component: ArticleDetailComponent,
         canActivate:[AuthGuard]
      },
        { path: '', redirectTo: 'article', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
