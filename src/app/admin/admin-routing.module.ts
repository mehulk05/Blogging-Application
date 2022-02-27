import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditArticleComponent } from './components/add-edit-article/add-edit-article.component';
import { AddEditUserComponent } from './components/add-edit-user/add-edit-user.component';
import { AdminAuthComponent } from './components/admin-auth/admin-auth.component';

const routes: Routes = [
  {
    path: '',
    component: AdminAuthComponent
  },
  {
    path: 'add-user',
    component: AddEditUserComponent
  },
  {
    path: 'edit-user/:id',
    component: AddEditUserComponent
  },
  {
    path: 'add-article',
    component: AddEditArticleComponent
  },
  {
    path: 'edit-article/:id',
    component: AddEditArticleComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
