import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import * as firebase from "firebase";
import { FileUpload } from "../classes/file-upload";

@Injectable()
export class UploadFileService {
  private basePath = "/uploads";

  constructor(private db: AngularFireDatabase) {}

  pushFileToStorage(fileUpload: FileUpload, progress: { percentage: number }) {
    let fileName = new Date().getTime() + "_" + fileUpload.file.name;
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef
      .child(`${this.basePath}/${fileName}`)
      .put(fileUpload.file);

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      snapshot => {
        // in progress
        const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        progress.percentage = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100
        );
      },
      error => {
        // fail
        console.log(error);
      },
      () => {
        // success
        fileUpload.url = uploadTask.snapshot.downloadURL;
        fileUpload.name = fileName;
        this.saveFileData(fileUpload);
        progress.percentage = 100;
      }
    );
  }

  private saveFileData(fileUpload: FileUpload) {
    // this.db.list(`${this.basePath}/`).push(fileUpload);
    // console.log("=+++++++++++++++++++;", this.basePath);
    // console.log("-------------------------: ", fileUpload);
  }

  getFileUploads(numberItems): AngularFireList<FileUpload> {
    return this.db.list(this.basePath, ref => ref.limitToLast(numberItems));
  }

  deleteFileUpload(fileName) {
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${this.basePath}/${fileName}`).delete();
  }

  private deleteFileStorage(name: string) {
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${this.basePath}/${name}`).delete();
  }
}
