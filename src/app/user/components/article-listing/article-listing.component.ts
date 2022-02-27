import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import * as moment from 'moment';

@Component({
  selector: 'app-article-listing',
  templateUrl: './article-listing.component.html',
  styleUrls: ['./article-listing.component.css']
})
export class ArticleListingComponent implements OnInit {


  isFilter = false
  searchText
  articleList = []
  config: any;
  articleListByDate: any
  selectedDate: any;
  constructor(private crudService: CrudService, private router: Router,private localStorageService:LocalStorageService) {
    this.config = {
      itemsPerPage: 9,
      currentPage: 1,
      totalItems: this.articleList.length
    };
  }

  ngOnInit(): void {
    this.loadArticles()
    }


  async loadArticles() {
    const token:any = await this.localStorageService.getDataFromIndexedDB("userData")
    this.crudService.startLoader()
    this.crudService.getAll("article").subscribe(async data => {
      this.articleList = await data.map(e => {
        let desc
        desc = this.extractContent(e.payload.doc.data()['description'])
        let imgUrl = e.payload.doc.data()['thumbnail'] ? e.payload.doc.data()['thumbnail'] : 'https://g99plus.b-cdn.net/AEMR/assets/images/nopreview.jpeg'

        return {
          key: e.payload.doc.id,
          title: e.payload.doc.data()['title'],
          body: e.payload.doc.data()['description'],
          category: e.payload.doc.data()['category'],
          date: e.payload.doc.data()['date'],
          shortDesc: desc,
          imgUrl: imgUrl[0]?.img ? imgUrl[0]?.img : 'https://g99plus.b-cdn.net/AEMR/assets/images/nopreview.jpeg',
          author: e.payload.doc.data()['author'],
          isPublic: e.payload.doc.data()["isPublic"],
          thumbnail:e.payload.doc.data()["thumbnail"]
        };
      })
      this.articleList.sort(function(a,b){
        var dateA = new Date(a.date.toDate()).getTime();
        var dateB = new Date(b.date.toDate()).getTime();
        return dateB > dateA ? 1 : -1;

      });
      this.crudService.stopLoader()
    }, e => {
      this.crudService.stopLoader()
    });
  }



  getArticleByDate(item, date) {

    this.selectedDate = date
    this.isFilter = true
    this.articleList = item.value
    let data = this.articleList.filter(data => {
      return moment(data.date.toDate()).startOf('month').format('YYYY/MM') == date
    })
  }


  clearFilter() {
    this.loadArticles()
    this.selectedDate = ""
    this.isFilter = false

  }
  extractContent(s) {
    var span = document.createElement('span');
    span.innerHTML = s;
    return span.textContent || span.innerText;
  };

  formatData(data) {
    let returnData = []
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        returnData.push({ ...data[key], key });
      }
    }
    return returnData
  }

  editArticle(article) {
    this.router.navigateByUrl("/user/article-detail/" + article.key)
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

  keyDescOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  }

}


