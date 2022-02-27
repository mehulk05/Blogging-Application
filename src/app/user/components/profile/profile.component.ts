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
      console.log(data)
      this.crudService.stopLoader()
      this.userData =  data.data()
      console.log(this.userData)
     // this.userData["img"]  = this.userData?.img  ? this.userData?.img  : 'https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?k=20&m=1300845620&s=612x612&w=0&h=f4XTZDAv7NPuZbG0habSpU0sNgECM0X7nbKzTUta3n8='
    })
    .catch(e=>{
      console.log(e)
      this.toastService.error("Error Fetching Article", "Error")
      this.crudService.stopLoader()
    })
  }

  goBack(){

  }
}
