import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';


export class FileUpload {
  key: string;
  name: string;
  url: string;
  file: File;

  constructor(file: File) {
    this.file = file;
  }

}


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  firestoreKey = "users"
  userForm: FormGroup;
  @ViewChild('myFileInput') myFileInput;
  selectedFiles: FileList;
  percentage: number = 50;
  downloadURL: any;
  isUploading = false
  currentFileUpload: any;

  imgUrl
  userData: any;
  userId: any;
  constructor(
    private fb: FormBuilder,
    private activatedRoute:ActivatedRoute,
    private crudService:CrudService,
    private router:Router,
    private storage: AngularFireStorage,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.userForm = this.fb.group({
      name: ["", Validators.required],
      dob: [new Date(), Validators.required],
      email: ["", Validators.required],
      bio: ["", [Validators.maxLength(100)]],
      img:[""]
    });

    this.activatedRoute.params.subscribe(data=>{
      console.log(data)
      this.userId =  data.id
      this.loadUserProfile(data.id)
    })
  }

  submitForm(){
    let userFormData ={
      name:this.userForm.value.name,
      email:this.userForm.value.email,
      dob:this.userForm.value.dob,
      bio:this.userForm.value.bio,
      img:this.userForm.value.img,
    }
    this.crudService.createCommentById(this.firestoreKey,userFormData,this.userId).then(data=>{
      console.log(data)
      this.toastr.success("Profile Updated Successfully !",  "Success")
      this.router.navigateByUrl("/user/about")

    }).catch(e=>{
      console.log(e)
      this.toastr.error(e.message,"Error")
    })
  }

  loadUserProfile(id){
    this.crudService.startLoader()
    this.crudService.getSingle(id, this.firestoreKey).then(data => {
      this.crudService.stopLoader()
      if (data.data()) {
        console.log(data.data())
        this.userData = data.data()
        this.setUserFormValue()
      }}, e => {
        this.crudService.stopLoader()
        this.toastr.error(e.message, "Error")
      })
  }

  setUserFormValue(){
    this.imgUrl = this.userData?.img ? this.userData?.img : 'https://helprr-2.vercel.app/assets/images/noimg.png',
    this.userForm.patchValue({
      name:this.userData?.name,
      email:this.userData?.email,
      bio:this.userData?.bio,
      dob:this.userData?.dob ? this.userData?.dob.toDate() : new Date(),
      img:this.userData?.img ? this.userData?.img  : ""
    })

    console.log(this.userData.dob, this.userData.dob.toDate())
  }
  onFileChange(event) {
    this.myFileInput.nativeElement.value = '';
  }


  selectFile(event): void {
    this.isUploading = true
    this.percentage = 0
    console.log(event)
    const file = event.target.files[0];
    console.log(file, file.size)
    if (file) {

      if (!file.type.toLowerCase().includes("image")) {
        this.toastr.error("Please select Image File", "Error")
        this.myFileInput.nativeElement.value = '';
        return
      }

      if (file.size >= 5242880) {
        this.toastr.warning("File size is greater than 5MB, Please upload file smaller than 5MB", "Warning");
        return
      }

      this.currentFileUpload = new FileUpload(file);
      const filePath = `/profileImage/${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              if (url) {
                this.isUploading = false
                this.userForm.patchValue({
                  img:url
                })
                this.imgUrl = url
                console.log(url)
              }
              //this.addUrlToEditor(url)

              task.percentageChanges().subscribe(percentage => {
                this.percentage = Math.round(percentage);
                this.percentage = percentage
              })
            });
          })
        )
        .subscribe(url => {
          if (url) {
            this.selectedFiles = null;
          }
        });

    }
    else {
      this.toastr.error("Error Uploading File", "Error")
    }
  }

  get f() {
    return this.userForm.controls;
  }

  goBack(){
    this.router.navigateByUrl("/user/about")
  }
}
