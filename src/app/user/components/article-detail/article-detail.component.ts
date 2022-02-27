
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  likedBy = []
  actionCount = 0
  likeCount:any = 0
  showModal: boolean;
  slideConfig = {"slidesToShow": 1, "slidesToScroll": 1, infinite: false,arrows:true};
  author:any
  articleData: any
  article_id = null;
  url = encodeURIComponent(window.location.href)
  isLikeStatus: any;
  constructor(private activatedRoute: ActivatedRoute,private toastService:ToastrService,
     private crudService: CrudService, private router: Router,private localStorgaeService:LocalStorageService) { }

  async ngOnInit(): Promise<void> {
    this.author = await this.localStorgaeService.getDataFromIndexedDB("userData")
    this.activatedRoute.params.subscribe(data => {
      if (data && data.id) {
        this.article_id = data.id
        this.getArticle(this.article_id)
      }
    })
  }

  getArticle(article_id) {
    this.crudService.startLoader()
    this.crudService.getSingle(article_id,"article").then(data=>{
      this.articleData =  data.data()
      this.articleData.id =  data.id
      this.setPostLikeData()
      this.crudService.stopLoader()
    },e=>{
      this.toastService.error("Error Fetching Article", "Error")
      this.crudService.stopLoader()
    })
  }
  setPostLikeData(){
    this.likedBy = this.articleData?.likedBy?this.articleData.likedBy : []
    this.likeCount = this.likedBy.length
    const userExists = this.likedBy.some(item => item.uid === this.author.uid);
    if(userExists){
      this.isLikeStatus = true
    }
    else{
      this.isLikeStatus =  false
    }
  }
  shareLink() {
    let title = this.articleData.title
    let text = this.articleData.title
    let url = this.url
    if (navigator.share !== undefined) {
      navigator
        .share({
          title,
          text,
          url
        })
        .then(() => console.log(""))
        .catch(err => console.error(err));
    }
  }
  goBack() {
    this.router.navigateByUrl("/user/article")
  }

  slickInit(e) {
  }

  hideModal() {

    this.showModal = false
  }

  deleteArticle(){
    this.crudService.startLoader()
    this.crudService.delete(this.articleData.id,"article").then(data=>{
      this.router.navigateByUrl("/user/article").then(data=>{
        this.crudService.delete(this.articleData.id,"comment")
        this.toastService.success("Article Deleted Successfully","Success");
      })
    }).catch(e=>{
      this.toastService.error(e.message,"Error")
      this.crudService.stopLoader()
    })
  }

  showDeleteModal(){
    this.showModal = true
  }

  onLike(){
    if(this.actionCount >=10){
      this.toastService.warning("Too many actions frequently","Please wait")
      return
    }
    this.actionCount++

    this.isLikeStatus =  !this.isLikeStatus
    if(this.isLikeStatus){
      const userObj = {
        uid:this.author.uid,
        name:this.author.name
      }
      this.likeCount++
      this.likedBy.push(userObj)
    }
    else{
      this.likeCount --
      this.likedBy = this.likedBy.filter(item=>{

       return  item.uid !=  this.author.uid
      })


    }

    this.updateArticle()
  }

  updateArticle(){
    let bookObject = {
      title: this.articleData?.title,
      category: this.articleData?.category,
      date: this.articleData?.date,
      url: this.articleData?.url,
      thumbnail: this.articleData.thumbnail,
      description: this.articleData?.description,
      uid: this.articleData?.uid,
      author: this.author.name,
    }
    const likeBy = {
      likedBy : this.likedBy
    }
    this.crudService.createCommentById("article",likeBy,this.articleData.id).then(data=>{
    }).catch(e=>{
      this.toastService.error(e.message,"Error")
    })
  }

}
