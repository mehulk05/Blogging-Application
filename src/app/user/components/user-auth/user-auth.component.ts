import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/shared/services/auth.service';
import { CrudService } from '@app/shared/services/crud.service';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit {
  passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  isLoading:boolean
  firestoreKey = "users"
  userForm: FormGroup;
  userData: any;
  constructor(

    private authService:AuthService,
    private fb: FormBuilder,
    private angularFireAuth: AngularFireAuth,
    private crudService:CrudService,
    private router:Router,

    private localStorgaeService:LocalStorageService
  ) { }

  async ngOnInit(): Promise<void> {
    // Validators.minLength(8)
    // Validators.pattern(this.passwordPattern)
      this.userForm = this.fb.group({
        email: ["", Validators.required],
        password: ["", [Validators.required]],
      });
      this.userData = await this.localStorgaeService.getDataFromIndexedDB("userData")
      console.log(this.userData)
      if(this.userData){
        this.router.navigateByUrl("/user/article")
      }
  }

  submitForm(){
    let userData = {
      email: this.userForm.value.email,
      password: this.userForm.value.password,
    }
    this.crudService.startLoader();
    this.authService.login(userData)
  }

  get f() {
    return this.userForm.controls;
  }
}
