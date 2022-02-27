import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { debounceTime } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})

export class CrudService {


constructor(private firestore: AngularFirestore, private ngxLoader: NgxSpinnerService,) { }

    getAll(key) {
        return this.firestore.collection(key).snapshotChanges().pipe(
            debounceTime(1000)
            //distinctUntilChanged() // or try this, ignores equal data
        );
    }

    getMyArticles(key,uid){
        return this.firestore.collection(key,ref=> ref.where('uid', '==', uid)).snapshotChanges().pipe(
            debounceTime(1000)
            //distinctUntilChanged() // or try this, ignores equal data
        );
    }

    create(dateObject: any, key) {
        return this.firestore.collection(key).add(dateObject);
    }

    createById(userData: any, key){
        const userRef: AngularFirestoreDocument<any> =   this.firestore.doc(`users/${userData.uid}`);
        return  userRef.set(userData, { merge: true })
    }

    createCommentById(key,data,firestoreId){
      const objectRef: AngularFirestoreDocument<any> =   this.firestore.doc(`${key}/${firestoreId}`);
        return  objectRef.set(data, { merge: true })
    }
    getSingle(id, key) {
        return this.firestore.collection(key).doc(id).ref.get()
    }
    update(dateObject: any, key, id) {
        delete dateObject.id;
        return this.firestore.doc(key + "/" + id).update(dateObject);
    }
    delete(objId: string, key) {
        return this.firestore.doc(key + "/" + objId).delete();
    }

    startLoader() {
        this.ngxLoader.show();
    }

    stopLoader() {
        this.ngxLoader.hide();
    }
    updateComment(dateObject: any, key, id) {
      return this.firestore.doc(key + "/" + id).update(dateObject);
  }

}

