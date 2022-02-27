import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  author: any;
  userData: any;

  constructor(private crudService: CrudService,
    private toastService:ToastrService,
    private router: Router,private localStorgaeService:LocalStorageService) { }

  async ngOnInit(): Promise<void> {
    this.author = await this.localStorgaeService.getDataFromIndexedDB("userData")
    this.loadUserProfile()
  }

  loadUserProfile(){
    this.crudService.startLoader()
    this.crudService.getSingle(this.author.uid,"users").then(data=>{
      this.crudService.stopLoader()
      this.userData =  data.data()
    })
    .catch(e=>{
      this.toastService.error("Error Fetching Article", "Error")
      this.crudService.stopLoader()
    })
  }

  goBack(){

  }
}
