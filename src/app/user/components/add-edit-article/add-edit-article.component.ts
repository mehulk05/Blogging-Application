import { LocationStrategy } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from '@app/shared/services/crud.service';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { AudioRecordingService } from '@app/shared/services/audiorecording.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  selector: 'app-add-edit-article',
  templateUrl: './add-edit-article.component.html',
  styleUrls: ['./add-edit-article.component.css']
})


export class AddEditArticleComponent implements OnInit {
  @ViewChild('myFileInput') myFileInput;
  @ViewChild('myAudioFile') myAudioFile;
  isaddAnotherEnable = false
  galleryUrls: any = []
  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  percentage: number;
  downloadURL: any;

  urlPattern = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)
  author: any
  bookForm: FormGroup;
  book_id: any;
  firestoreKey = "article"
  bookData: any;
  isLoading = false
  showModal: boolean;
  isUploading: boolean;
  optionFlagForImage: any;
  recordOptions: any;

  //Audo recording variables
  firebaseAudioUrl
  isPlaying = false;
  displayControls = true;
  isAudioRecording = false;
  audioRecordedTime;
  audioBlobUrl;

  audioBlob;
  audioName;
  audioStream;
  audioConf = { audio: true }
  percentage2: number;
  currentAudioFile: FileUpload;

  isDataPushedToDb = false
  constructor(
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private crudService: CrudService,
    private toastService: ToastrService,
    private localStorgaeService: LocalStorageService,
    private storage: AngularFireStorage,
    private location: LocationStrategy,
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer
  ) {
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      this.goBack()
    });

    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isAudioRecording = false;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.audioRecordedTime = time;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.audioBlob = data.blob;
      this.audioName = data.title;
      this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.blob));
      this.ref.detectChanges();
    });
  }

  async ngOnInit(): Promise<void> {
    this.createBookForm()
    this.author = await this.localStorgaeService.getDataFromIndexedDB("userData")
    this.bookForm.patchValue({
      uid: this.author.uid,
      author: this.author.name
    })
    this.activatedRoute.params.subscribe(data => {
      if (data && data.id) {
        this.book_id = data.id
        this.getBook(this.book_id)
      }
    })
  }

  createBookForm() {
    this.bookForm = this.fb.group({

      title: ["", Validators.required],
      description: [""],
      url: ["", [Validators.pattern(this.urlPattern)]],
      thumbnail: [null],
      date: [new Date()],
      category: [""],
      uid: [this.author?.uid],
      author: [""],
    });
  }

  getBook(book_id) {
    this.isLoading = true
    this.crudService.startLoader()
    this.crudService.getSingle(book_id, this.firestoreKey).then(data => {
      this.crudService.stopLoader()
      if (data.data()) {
        console.log(data.data())
        this.bookData = data.data()
        this.bookData.key = data.id
        this.isLoading = false
        this.setBookFormValues(this.bookData)
      }
      else {
        this.isLoading = false
        this.toastService.error("Error Fetching Book", "Error")
      }
    }, e => {
      this.crudService.stopLoader()
      this.isLoading = false
      this.toastService.error("Error Fetching Book", "Error")
    })
  }

  setBookFormValues(bookData) {
    if (this.author.uid == bookData.uid) {
      this.galleryUrls = bookData?.thumbnail
      this.bookForm.patchValue({
        title: bookData?.title,
        description: bookData?.description,
        url: bookData?.url,
        thumbnail: "",
        date: bookData?.date,
        category: bookData.category,
        uid: bookData?.uid
      })
    }
    else {
      this.toastService.error("You dont have permission to access the document", "Permission Error")
    }
  }

  selectFile(event): void {
    this.isaddAnotherEnable = true
    this.isUploading = true
    this.percentage = 0
    console.log(event)
    const file = event.target.files[0];
    console.log(file, file.size)
    if (file) {

      if (!file.type.toLowerCase().includes("image")) {
        this.toastService.error("Please select Image File", "Error")
        this.myFileInput.nativeElement.value = '';
        return
      }

      if (file.size >= 5242880) {
        this.toastService.warning("File size is greater than 5MB, Please upload file smaller than 5MB", "Warning");
        return
      }

      this.currentFileUpload = new FileUpload(file);
      const filePath = `/ArticleImage/${file.name}`;
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
                this.fb = url;
              }
              this.addUrlToEditor(url)

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
      this.toastService.error("Error Uploading File", "Error")
    }
  }

  addUrlToEditor(url) {

    this.bookForm.patchValue({
      thumbnail: url
    })
  }

  onFileChange(event) {
    this.myFileInput.nativeElement.value = '';
  }

  submitForm() {
    let bookObject = {
      title: this.bookForm.value.title,
      category: this.bookForm.value.category,
      date: this.bookForm.value.date,
      url: this.bookForm.value.url,
      thumbnail: this.galleryUrls,
      description: this.bookForm.value.description,
      uid: this.bookForm.value.uid,
      author: this.author.name,
    }

    console.log(bookObject)

    if (this.book_id) {
      this.updateBook(bookObject)
    }
    else {
      this.createBook(bookObject)
    }
  }

  async createBook(bookObject) {
    try {
      this.crudService.startLoader();
      this.crudService.create(bookObject, this.firestoreKey).then(result => {
        this.router.navigateByUrl("/user/article-list")
        this.crudService.stopLoader()
      }, e => {
        this.crudService.stopLoader()
        console.log(e)
        this.toastService.error("Error Creating Article", "Error")
      })
    }
    catch (e) {
      console.log(e, e.message)
      this.toastService.error(e.message, "Error")
      this.crudService.stopLoader()
    }
  }

  updateBook(bookObject) {
    try {
      this.crudService.startLoader()
      this.crudService.update(bookObject, this.firestoreKey, this.book_id).then(data => {
        this.router.navigateByUrl("/user/article-list")
        this.crudService.stopLoader()
      }, e => {
        this.crudService.stopLoader()
        this.toastService.error("Error Creating Article", "Error")
      })
    }
    catch (e) {
      console.log(e, e.message)
      this.toastService.error(e.message, "Error")
      this.crudService.stopLoader()
    }
  }

  get f() {
    return this.bookForm.controls;
  }

  goBack() {
    history.pushState(null, null, window.location.href);
    if (this.isUploading) {
      history.pushState(null, null, location.href);
      this.showModal = true
    }
    else {
      this.router.navigateByUrl("/user/article-list")
    }
  }

  goToBook() {
    this.router.navigateByUrl("/user/article-list")
  }

  hideModal() {
    this.isUploading = false
    this.showModal = false
  }

  ShowOption(optionflag) {
    this.optionFlagForImage = optionflag
  }

  showOptionForRecord(flag) {
    this.recordOptions = flag

  }



  startAudioRecording() {
    if (!this.isAudioRecording) {
      this.isAudioRecording = true;
      this.audioRecordingService.startRecording();
      this.isaddAnotherEnable = false
    }
  }

  abortAudioRecording() {
    if (this.isAudioRecording) {
      this.isAudioRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopAudioRecording() {
    if (this.isAudioRecording) {
      this.audioRecordingService.stopRecording();
      this.isAudioRecording = false;
    }
  }

  clearAudioRecordedData() {
    this.audioBlobUrl = null;
    this.isaddAnotherEnable = true
  }

  downloadAudioRecordedData() {
    this._downloadFile(this.audioBlob, 'audio/mp3', this.audioName);

  }

  ngOnDestroy(): void {
    this.abortAudioRecording();
  }

  _downloadFile(data: any, type: string, filename: string): any {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    //this.video.srcObject = stream;
    //const url = data;
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  uploadAudio(file) {
    this.percentage2 = 0
    this.currentAudioFile = new FileUpload(file);
    const filePath = `/Audio/${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            this.firebaseAudioUrl = url

            if (url) {
              this.isUploading = false
              this.fb = url;
            }
            this.addImageAndVoiceNote(url)

            task.percentageChanges().subscribe(percentage => {
              this.percentage2 = Math.round(percentage);
              this.percentage2 = percentage
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
  addImageAndVoiceNote(audiourl) {
    this.isaddAnotherEnable = true
    this.isDataPushedToDb = true
    const ImageAndAudio = {
      audio: audiourl,
      img: this.bookForm.value.thumbnail
    }
    this.galleryUrls.push(ImageAndAudio)
    console.log(this.galleryUrls)

  }

  AddAnother() {
    if (!this.isDataPushedToDb) {
      const ImageAndAudio = {
        audio: this.firebaseAudioUrl ? this.firebaseAudioUrl : '',
        img: this.bookForm.value.thumbnail
      }
      this.galleryUrls.push(ImageAndAudio)
      console.log(this.galleryUrls)

    }
    this.bookForm.patchValue({
      thumbnail: ""
    })
    this.myFileInput.nativeElement.value = '';
    this.percentage = 0
    this.currentFileUpload = null
    if( this.myAudioFile){
      this.myAudioFile.nativeElement.value = '';
    }
    this.firebaseAudioUrl = ""
    this.resetImageAndVoiceNote()
  }

  resetImageAndVoiceNote() {
    this.isPlaying = false;
    this.displayControls = true;
    this.isAudioRecording = false;
    this.audioRecordedTime = null;
    this.audioBlobUrl = null;

    this.audioBlob = null;
    this.audioName = null;
    this.audioStream = null;
    this.audioConf = { audio: true }

    this.recordOptions = null
    this.isDataPushedToDb = false
    this.currentAudioFile = null
    this.isaddAnotherEnable = false
  }
  resetAll() {
    this.resetImageAndVoiceNote()
    this.percentage = 0
    this.percentage2 = 0
    this.bookForm.patchValue({
      thumbnail: ""
    })
    this.myFileInput.nativeElement.value = '';
    this.currentFileUpload = null

  }
  uploadImageAndVoice() {
    const blob = new Blob([this.audioBlob], { type: 'audio/mp3' });
    console.log(this.audioName)
    blob["name"] = this.audioName
    this.uploadAudio(blob)
  }

  selectAudioFile(e) {
    const file = e.target.files[0];
    console.log(file)
    if (!file.type.toLowerCase().includes("audio")) {
      this.toastService.error("Please select Audio File", "Error")
      this.myAudioFile.nativeElement.value = '';
      return
    }
    this.uploadAudio(file)
  }

  deleteImg(index) {
    this.galleryUrls.splice(index, 1)
  }
}

