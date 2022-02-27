import { Component, Input, OnInit } from '@angular/core';
import { CrudService } from '@app/shared/services/crud.service';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-comment',
  templateUrl: './user-comment.component.html',
  styleUrls: ['./user-comment.component.css']
})
export class UserCommentComponent implements OnInit {
  AllPostComments = []
  comment:any
  userId :any
  @Input() articleData
  commentData: any;
  constructor(private localStorageService : LocalStorageService,
    private toastService:ToastrService,
    private crudService: CrudService) { }

  async ngOnInit(): Promise<void> {
    this.userId =  await this.localStorageService.getDataFromIndexedDB("userData")
    this.getComment()
    console.log(this.articleData)
  }

  getComment(){
    this.crudService.startLoader()
    this.crudService.getSingle(this.articleData.id,"comment").then(data=>{
      this.crudService.stopLoader()
      console.log(data.data())
      this.commentData =  data.data()
      if(this.commentData){
        this.AllPostComments = this.commentData.commentData
      }
    })
    .catch(e=>{
      this.crudService.stopLoader()
      console.log(e)
      this.toastService.error(e?.message,"Error")
    })
  }

  submitComment(){
    let comments:any = this.commentData?.commentData.length>0 ? this.commentData?.commentData : []

    let commentForm = {
      postId : this.articleData.id,
      date: new Date(),
      userId : this.userId.uid,
      comment : this.comment,
      username : this.userId.name
    }

    if(comments.length == 0 ){
      comments.push(commentForm)

    }

    else{
      comments.push((commentForm))
    }

    let commentData = {
      commentData : comments
    }
    this.crudService.startLoader()
    this.crudService.createCommentById("comment",commentData,commentForm.postId).then(data=>{

      console.log(data)
      this.getComment()
    })
    .catch(e=>{
      this.crudService.stopLoader()
      console.log(e)
      this.toastService.error(e?.message,"Error")
    })

  }
}
