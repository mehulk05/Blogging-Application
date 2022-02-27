import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/shared/services/auth.service';
import { CrudService } from '@app/shared/services/crud.service';
import { ToastrService } from 'ngx-toastr';

import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent implements OnInit {
  passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  isLoading:boolean
  firestoreKey = "users"
  userForm: FormGroup;
  constructor(
    private authService:AuthService,
    private fb: FormBuilder,
    private angularFireAuth: AngularFireAuth,
    private crudService:CrudService,
    private router:Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

      this.userForm = this.fb.group({
        name: ["", Validators.required],
        dob: [new Date(), Validators.required],
        email: ["", Validators.required],
        password: ["", [Validators.minLength(8),Validators.pattern(this.passwordPattern),Validators.required]],
        role: ["user"],
        uuid: [uuidv4()]
      });
  }

  submitForm(){
    let userData = {

      name: this.userForm.value.name,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      dob: this.userForm.value.dob,
      role: this.userForm.value.role,
      uid: this.userForm.value.uuid
    }
    this.crudService.startLoader();
    this.angularFireAuth.createUserWithEmailAndPassword(userData.email,userData.password).then(data=>{
      userData.uid = data.user.uid
      this.createUserInDb(userData)
    })
    .catch((e)=>{
      this.crudService.stopLoader()
      this.toastr.error(e.message, 'Error');
    })
  }

  createUserInDb(userData:any){

    this.crudService.createById(userData, this.firestoreKey).then(result => {
      this.toastr.success('User Registered!', 'Success');
      this.angularFireAuth.signOut();
      this.router.navigateByUrl("/user/login")
      this.crudService.stopLoader()

    }, e => {
      this.crudService.stopLoader();
      this.toastr.error(e.message, 'Error');
    })
  }

  get f() {
    return this.userForm.controls;
  }
}
