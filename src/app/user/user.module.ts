import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserAuthComponent } from './components/user-auth/user-auth.component';
import { ArticleListingComponent } from './components/article-listing/article-listing.component';
import { UserRegisterComponent } from './components/user-register/user-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AuthGuard } from '@app/shared/services/auth.gaurd';
import { ProfileComponent } from './components/profile/profile.component';
import { AddEditArticleComponent } from './components/add-edit-article/add-edit-article.component';
import { MyArticlesComponent } from './components/my-articles/my-articles.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserWrapperComponent } from './components/user-wrapper/user-wrapper.component';
import { ArticleDetailComponent } from './components/article-detail/article-detail.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { UserCommentComponent } from './components/user-comment/user-comment.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    UserAuthComponent,
    ArticleListingComponent,
    UserRegisterComponent,
    ProfileComponent,
    AddEditArticleComponent,
    MyArticlesComponent,
    UserWrapperComponent,
    ArticleDetailComponent,
    UserCommentComponent,
    ForgetPasswordComponent,
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    Ng2SearchPipeModule,
    NgxPaginationModule,
    SlickCarouselModule
  ],
  providers:[AuthGuard]
})
export class UserModule { }
