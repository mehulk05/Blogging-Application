import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/shared/services/auth.service';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated:boolean = false
  private userSub: Subscription;
  isAdmin  = false
  userData: any;
  isMenuOpen: boolean = false
  constructor(
    private router: Router,
    private authService: AuthService,
    private localStorgaeService: LocalStorageService
  ) { }

  async ngOnInit(): Promise<void> {
    this.authService.initAuthListener();
    this.userData = await this.localStorgaeService.getDataFromIndexedDB("userData")
    if (this.userData) {

      // this.isUser = this.userData.role == "user"
      // this.isAdmin = this.userData.role !== "user"

    }

    this.userSub = this.authService.user.subscribe(user => {
      if(user){
        // if (user && user.role == "user") {
        //   this.isAdmin = false
        // }
        // else {
        //   this.isAdmin = user?.role == "admin"
        // }

        this.isAuthenticated = !!user;
      }
      else{
        this.isAuthenticated = false
      }

    });
  }


  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  openMenu() {
    this.isMenuOpen = !this.isMenuOpen

    if(this.isMenuOpen){
      window.scrollTo(0, 0);
    }
    $("body").toggleClass("no-scroll")
  }

  async onLogout() {
    console.log("ehrw")
    this.authService.logout()

   }

}
