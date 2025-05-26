import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { TranslateService} from '@ngx-translate/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import * as  moment from 'moment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};

interface Sound {
  key: string;
  asset: string;
  isNative: boolean
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  // static UNKNOWN_USER = new AuthInfo(null);
  // db = firebase.firestore();
  // public authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(ApiService.UNKNOWN_USER);
  
  selected_language='';
  loader: any;
  isLoading = false;

  tip_array=[
    {id:1,type:"light",name:"Light", medals:20,icon_url:"assets/icon/lamp.svg" },
    {id:2,type:"watch",name:"Watch",medals:30,icon_url:"assets/icon/clock.svg" },
    {id:3,type:"swap",name:"Swap",medals:40,icon_url:"assets/icon/refresh.svg" },
    {id:4,type:"bomb",name:"Bomb",medals:60,icon_url:"assets/icon/bomb.svg" },
    {id:5,type:"hangman",name:"Hangman",medals:60,icon_url:"assets/icon/user.svg" }
  ];

  user_info:any;
  level_history:any;

  level1_data:any;
  hangman_data:any;
  multiplechoice_data:any;

  selected_mainlevel=1;
  quiz_questions:any;
  possible_quiz_questions:any;

  round_adflag:any;
  play_mode="Normal";
  burstmode_count=1000;
  burst_score=0;
  burst_data:any;
  
  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  private forceWebAudio: boolean = true;


  private level1_url: string = "assets/json/levels/level1.json";
  private hangman_url: string = "assets/json/questions/hangman.json";
  private choice_url: string = "assets/json/questions/multiplechoice.json";


  constructor(private platform: Platform, 
          private adb: AngularFirestore,
          public http: HttpClient, 
          private nativeAudio: NativeAudio ,  
          public alertController: AlertController,
          public loadingctrl: LoadingController, 
          public toastController: ToastController,
          public translate: TranslateService) {

    this.get_level1();
    this.get_hangmandata();
    this.get_multipledata();


  }

  get_level1() {
    fetch(this.level1_url).then(res => res.json())
    .then(json => {
      this.level1_data= json;
 //     console.log(this.level1_data);

    });
  }


  get_hangmandata() {
    fetch(this.hangman_url).then(res => res.json())
    .then(json => {
      this.hangman_data= json;
  //    console.log(this.hangman_data);

    });
  }

  get_multipledata() {
    fetch(this.choice_url).then(res => res.json())
    .then(json => {
      this.multiplechoice_data= json;
   //   console.log(this.multiplechoice_data);

    });
  }



  setInitialAppLanguage(){
    var val=JSON.parse(localStorage.getItem('logo_userinfo'));

      if (val && val.lang){
        this.setLanguage(val.lang);
      }else{
        this.setLanguage('en');
      }    

  }

  preload(key: string, asset: string): void {

    if(this.platform.is('cordova') && !this.forceWebAudio){

      this.nativeAudio.preloadSimple(key, asset);

      this.sounds.push({
        key: key,
        asset: asset,
        isNative: true
      });

    } else {

      let audio = new Audio();
      audio.src = asset;

      this.sounds.push({
        key: key,
        asset: asset,
        isNative: false
      });

    }

  }

  play(key: string): void {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if(soundToPlay.isNative){

      this.nativeAudio.play(soundToPlay.asset).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });

    } else {
      this.audioPlayer.src = soundToPlay.asset;
      this.audioPlayer.play();
    }
  }



  setLanguage(lng){
    this.translate.setDefaultLang(lng);
    this.translate.use(lng);
    this.selected_language=lng;
  }

  translate_str(str) {
    const currentLang = this.translate.currentLang;
    const returnValue = this.translate.translations[currentLang][str];
    if (returnValue === undefined) {
      return this.translate.translations.en_merch[str];
    } else {
      return returnValue;
    }
  }



  async showSimpleAlert(msg) {
    const alert = await this.alertController.create({
      header: '',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  async showWarningAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  async showErrorAlert(msg) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }


  async errorToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      color:"danger",
      duration: 3000,
    });
    toast.present();
  }

  async showToast(msg, colors, positon) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: colors,
      position: positon
    });
    toast.present();
  }


  async show(msg?) {
    this.isLoading = true;
    return await this.loadingctrl.create({
      message: msg,
      spinner: 'bubbles',
      
    }).then(a => {
      a.present().then(() => {
        //console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async hide() {
    this.isLoading = false;
    return await this.loadingctrl.dismiss().then(() => console.log('dismissed'));
  }

   save_userdata()  {
    this.updateUserInfo(this.user_info.id, this.user_info).then(data => {
      console.log("--------save api user data to db--------- ");
      localStorage.setItem('logo_userinfo',JSON.stringify(this.user_info));  

      console.log(data);
    }).catch(error => {
      this.showToast(this.translate_str("Something Error"),"danger","bottom");
      console.log("--------Fail api user data to db--------- ");
      console.log(error);    
    });
  }

  save_leveldata()  {
    var levelinfo={
      id:this.user_info.id,
      update_time: moment().format("YYYY/MM/DD hh:mm"),
      level_history:JSON.stringify(this.level_history)
    }

    if (this.play_mode=='Normal'){
      this.update_LevelHistory(this.user_info.id, levelinfo).then(data => {
        console.log("--------save api level data to db--------- ");
        console.log(data);
      }).catch(error => {
        this.showToast(this.translate_str("Something Error"),"danger","bottom");
        console.log("--------Fail api level data to db--------- ");
        console.log(error);    
      });  
    }else{
      this.update_extraLevelHistory(this.user_info.id, levelinfo).then(data => {
        console.log("--------save api level data to db--------- ");
        console.log(data);
      }).catch(error => {
        this.showToast(this.translate_str("Something Error"),"danger","bottom");
        console.log("--------Fail api level data to db--------- ");
        console.log(error);    
      });  
    }
  }

  save_burstscore(score){
    console.log(score);
    console.log(this.burst_score);
    if (score>this.burst_score){
      var burstinfo={
        id:this.user_info.id,
        update_time: moment().format("YYYY/MM/DD hh:mm"),
        nickname:this.user_info.nickname,
        score:score
      }
      this.update_burstScore(this.user_info.id, burstinfo).then(data => {
        console.log("--------save burst score to db--------- ");
        console.log(data);
        this.burst_score=score;
      }).catch(error => {
        this.showToast(this.translate_str("Something Error"),"danger","bottom");
        console.log("--------Fail  burst score to db--------- ");
        console.log(error);    
      });  
    }
  

  }




 public getUserwithemail(email): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('users', ref => ref.where('email', '==', email)).get().subscribe(async (response) => {

        let userdata = response.docs.map((element) => {
          let item = element.data();
          item.id = element.id;
          return item;
        });

       console.log("--------------",userdata);

        resolve(userdata);
      }, error => {
        reject(error);
      });
    });
  }


  public getUserwithNickname(nickname): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('users', ref => ref.where('nickname', '==', nickname)).get().subscribe(async (response) => {

        let userdata = response.docs.map((element) => {
          let item = element.data();
          item.id = element.id;
          return item;
        });

       console.log("--------------",userdata);

        resolve(userdata);
      }, error => {
        reject(error);
      });
    });
  }


  public registerUser(id, param): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('users').doc(id).set(param).then((data) => {
        resolve(data);
      }, error => {
        reject(error);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public updateUserInfo(id, param): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('users').doc(id).update(param).then((data) => {
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  }


  
  public getLevelHistory(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('levels').doc(id).get().subscribe((level: any) => {
        resolve(level.data());
      }, error => {
        reject(error);
      });
    });
  }

  public create_LevelHistory(id, param): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('levels').doc(id).set(param).then((data) => {
        resolve(data);
      }, error => {
        reject(error);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public update_LevelHistory(id, param): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('levels').doc(id).update(param).then((data) => {
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  }


  public get_extraLevelHistory(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('extra-levels').doc(id).get().subscribe((level: any) => {
        resolve(level.data());
      }, error => {
        reject(error);
      });
    });
  }

  public create_extraLevelHistory(id, param): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('extra-levels').doc(id).set(param).then((data) => {
        resolve(data);
      }, error => {
        reject(error);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public update_extraLevelHistory(id, param): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('extra-levels').doc(id).update(param).then((data) => {
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  }


  public get_burstScore(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('bursts').doc(id).get().subscribe((level: any) => {
        resolve(level.data());
      }, error => {
        reject(error);
      });
    });
  }

  public create_burstScore(id, param): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('bursts').doc(id).set(param).then((data) => {
        resolve(data);
      }, error => {
        reject(error);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public update_burstScore(id, param): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('bursts').doc(id).update(param).then((data) => {
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  }


  
  public get_allburst(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('bursts').get().subscribe((venue: any) => {
        let data = venue.docs.map(element => {
          let item = element.data();
          item.id = element.id; 
          return item;
        });

        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  // public deleteProfessor(informations: any): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     this.adb.collection('professor').doc(informations.id).delete().then((data) => {
  //       resolve(data);
  //     }, error => {
  //       reject(error);
  //     }).catch(error => {
  //       reject(error);
  //     });
  //   });
  // }




  makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  makeidwithnumber(length) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

} 
