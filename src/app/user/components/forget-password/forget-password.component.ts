import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  isLoading: Boolean = false
  error: string = ""
  constructor(private auth: AuthService,private router:Router,
    private toastService:ToastrService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    this.isLoading = true
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    this.auth.startLoader()
    this.auth.sendPasswordResetEmail(email).then(() => {
      this.auth.logout()
      this.router.navigate(['user/login']);
      //  this.success("Reset Password Mail sent");
      this.toastService.success("Password reset mail sent","Success")
      this.auth.stopLoader()

    })
      .catch(e => {
        this.isLoading = false
        this.error = e.message
        this.toastService.error(e.message,"Error")
        this.auth.stopLoader()
      })

  }
}
