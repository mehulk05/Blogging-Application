import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { switchMap, take } from 'rxjs/operators'
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user$: any;
  user = new BehaviorSubject<any>(null);
  key = environment.firebaseConfig.apiKey
  userdata: User;
  isAuthenticated: any;
  authChange = new Subject<boolean>();


  constructor(
    private afs: AngularFirestore,
    private ngxLoader: NgxSpinnerService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private localStorageService: LocalStorageService,
    private toastrService:ToastrService) {

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return of(null)
        }
      })
    )
  }

  initAuthListener() {
    this.afAuth.authState.subscribe(async user => {
        const userData = await this.localStorageService.getDataFromIndexedDB("userData")
        this.user.next(userData)
        if (user) {
            this.isAuthenticated = true;
            this.authChange.next(true);

        } else {

            this.authChange.next(false);
          //  this.router.navigate(['/user/article']);
            this.isAuthenticated = false;
        }
    });
}

  login(authData: any) {
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        console.log(result)
        this.updateUserData(result.user).then(data => {
          this.toastrService.success('Authentication Success!', 'Success');
          this.router.navigateByUrl("/user/article")
          this.stopLoader()
        }, e => {
          this.stopLoader()
          this.toastrService.error(e, "Error")
        })

      })
      .catch(e => {
        this.stopLoader()
        console.log(e)
        this.toastrService.error(e.message, 'Error');
      })
}

  async updateUserData(user) {
  const userData = await this.getUserData(user)
  if (userData && userData.email) {
    await this.localStorageService.setDataInIndexedDB("userData", userData)
    this.user.next(userData)
    return userData
  }

}

  async getUserData(user){
  const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
  return userRef.valueChanges().pipe(take(1)).toPromise();
}

 async logout() {
   console.log("here")
  this.afAuth.signOut();
  this.user.next(null);
  await this.localStorageService.clearDataFromIndexedDB()
  this.router.navigate(['/user/login']);
}

isAuth() {
  return this.isAuthenticated;
}

  sendPasswordResetEmail(passwordResetEmail: string) {
  return  this.afAuth.sendPasswordResetEmail(passwordResetEmail)

}

async  sendEmailVerification() {
  (await this.afAuth.currentUser).sendEmailVerification().then(() => {
    console.log('email sent');
    if (this.isAuthenticated) {
      this.logout()
    }
    this.router.navigate(['login']);
});
}


startLoader() {
  this.ngxLoader.show();
}

stopLoader() {
  this.ngxLoader.hide();
}

}

