import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
     private router: Router,private localStorageService:LocalStorageService
  ) { }

  async canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean>{

    const token:any = await this.localStorageService.getDataFromIndexedDB("userData")
    console.log(token)
    if (token) {
      return true
    }

      this.router.navigateByUrl("/user/login")
      return false


    // if (this.authService.isAuth()) {
    //   return true;
    // } else {
    //   this.router.navigate(['/user/login']);
    // }
  }
}
