import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminAuthComponent } from './components/admin-auth/admin-auth.component';
import { AddEditUserComponent } from './components/add-edit-user/add-edit-user.component';
import { AddEditArticleComponent } from './components/add-edit-article/add-edit-article.component';


@NgModule({
  declarations: [
    AdminAuthComponent,
    AddEditUserComponent,
    AddEditArticleComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
