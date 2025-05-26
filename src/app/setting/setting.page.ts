import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import swal from 'sweetalert2';

import * as  moment from 'moment';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: [
    './setting.page.scss'
  ]
})
export class SettingPage implements OnInit {

  vibrate_flag=true;
  sound_flag=true;
  langauge='en';
  username="Anonymous";
  edit_nameflag=false;
  isgoogleLogin: boolean = false;
  isfacebookLogin: boolean = false;

  constructor(public router: Router, public menu: MenuController,   private navCtrl: NavController,   private fb: Facebook,  private googlePlus: GooglePlus,  private translate: TranslateService, public api: ApiService) {

  }

  ngOnInit(): void {
    this.menu.enable(false);

  }

  ionViewWillEnter() {
    this.username=this.api.user_info.nickname;
      this.sound_flag=this.api.user_info.sound;
      this.vibrate_flag=this.api.user_info.vibrate;
      this.langauge=this.api.user_info.lang;
    
    // if (localStorage.getItem('logo_userinfo')) {
    //   console.log("load---------")

    //   this.api.user_info = JSON.parse(localStorage.getItem('logo_userinfo'));
    //   this.username=this.api.user_info.nickname;
    //   this.sound_flag=this.api.user_info.sound;
    //   this.vibrate_flag=this.api.user_info.vibrate;
    //   this.langauge=this.api.user_info.lang;

    // } else {
    //   console.log("reset---------")
    //   var userinit = {
    //     username: "Anonymous",
    //     sound:true,
    //     vibrate:true,
    //     lang:'en',
    //     login_method:'guest',
    //     award_date: "2020/11/01",
    //     medals: 0,
    //     lights: 0,
    //     timers: 0,
    //     bombs: 0,
    //     refreshs: 0,
    //     hangmans: 0
    //   }
      
    //   this.api.user_info = userinit;
    //   localStorage.setItem('logo_userinfo', JSON.stringify(userinit));
    // }

    // console.log(this.api.user_info);

  }

  open_statistics(){
    this.router.navigate(['stats']);

  } 
  
  open_ranking(){
    this.router.navigate(['ranking']);

  }

 change_setting(){ 
  console.log("----------save settings");
  //  this.api.user_info.username=this.username;
   this.api.user_info.sound=this.sound_flag;
   this.api.user_info.vibrate=this.vibrate_flag;
   this.api.user_info.lang=this.langauge;
   localStorage.setItem('logo_userinfo', JSON.stringify(this.api.user_info ));
   this.api.save_userdata();
 }

 change_language(){
  this.translate.use(this.langauge);
 }

  back() {
    this.navCtrl.back();
  }

  change_editflag(){
    
    this.edit_nameflag=!this.edit_nameflag;
  }

  save_username(){

    if (this.edit_nameflag==true && this.username==''){
      this.api.showToast(this.api.translate_str('Enter username'),'warning','bottom');
      return;
    }else{
      this.api.show();

      this.api.getUserwithNickname(this.username).then((data) => {      
        var userinfo=data;
        this.api.hide();
        if (userinfo.length==0){
          console.log("-----valide user name");
          this.api.user_info.nickname=this.username;
          this.api.save_userdata();
          this.edit_nameflag=!this.edit_nameflag;

        }else{
          
          console.log("-----invalide user name");
          if (this.username!=this.api.user_info.nickname){
            this.api.showToast(this.api.translate_str("This Username already exist.Try other name!"),"warning","middle");
          }
            this.username=this.api.user_info.nickname;
            this.edit_nameflag=!this.edit_nameflag;      
        }

      }).catch(error => {
        console.log(error);
        this.api.showToast(this.api.translate_str("Something Error"),"danger","bottom");

      });
        // console.log("------valid user name-----");

    }
  }

  goto_login(){
    this.router.navigate(['login']);
  }


  doGoogleLogin() {    

    console.log("login with google now");
    this.isgoogleLogin= true;
    // this.signinwithsocial("andres@gmail.com","andres",'google');
    // return;
    
     this.googlePlus.login({})
      .then(res => {
        console.log("Google userdata",res);
        this.signinwithsocial(res.email,res.displayName,'google');
      })
      .catch(err => {
        console.log("Google login error",err)
        this.api.showToast(this.api.translate_str("Something Error"),"danger","bottom");
        this.isgoogleLogin= false;  
      });
  }

  // Facebook signin
   doFacebookLogin() {
    console.log("do Facebook Signin");
    this.isfacebookLogin= true;
    // this.signinwithsocial("maria@gmail.com","marinakay",'facebook');
    // return;

    let permissions = new Array<string>();

    // Facebook App User Permissions
    permissions = ["public_profile", "email"];
    this.fb.login(permissions)
    .then(res => {
      console.log(res);
      let userId = res.authResponse.userID;
      this.fb.api("/me?fields=name,email", permissions)
      .then(user => {
        console.log("-------facebook data--------");
        console.log(user);
        this.signinwithsocial(user.email,user.name,'facebook');

        // user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        // user.name, user.email and user.picture

      }).catch(err => {        
        console.log("facebook error occured====>", err);
        this.isfacebookLogin= false;
        this.api.showToast(this.api.translate_str("Something Error"),"danger","bottom");
      });
    }).catch(err => {
      console.log("facebook error occured====>", err);
      this.isfacebookLogin= false;
      this.api.showToast(this.api.translate_str("Something Error"),"danger","bottom");
    });
    
  }



  signinwithsocial(email,username,regtype){
    var userinfo;
   // this.util.
   this.api.getUserwithemail(email).then((data) => {      
     console.log(data);
     userinfo=data;

     if (userinfo.length==0){
        console.log("new user with social"+regtype);          

        this.api.user_info.username=username;
        this.api.user_info.login_type=regtype;
        this.api.user_info.email=email;
        this.api.save_userdata();
        this.isfacebookLogin= false;
        this.isgoogleLogin= false;  
        this.api.showToast(this.api.translate_str("Your social signup have successed."),"success","middle");

     }else{
         this.isfacebookLogin= false;
         this.isgoogleLogin= false;          
         this.api.showToast(this.api.translate_str("This Email already exist.Try other email!"),"warning","middle");
     }

  }).catch(error => {
    console.log(error);
    this.api.showToast(this.api.translate_str("Something Error"),"danger","bottom");
  });


 }





  reset_all(){

    swal.fire({
      title: this.api.translate_str("Reset All"),
      text:   this.api.translate_str("Do you want reset all level history?"),
      icon: 'question',
      backdrop: false,
      showCancelButton: true,
      confirmButtonText: this.api.translate_str('Continue'),
      cancelButtonText: this.api.translate_str('Cancel'),
      confirmButtonColor:'#f4344f'
    }).then((result) => {
      if (result.value) {
        this.clear_data();
        
      } else if (result.dismiss === swal.DismissReason.cancel) {
        console.log("Cancel button action");
      }
    })   
  }


  clear_data(){
    var tmp = new Array();
    for (let level=0;level<3;level++){
      var level_item=new Array();
      for (let i = 0; i < this.api.level1_data.length; i++) {
        level_item.push({ id: this.api.level1_data[i].id, status: -1 });
      }
      tmp.push(level_item);
    }

    this.api.level_history = tmp;
    this.api.play_mode="Normal";
    this.api.save_leveldata();
    this.api.play_mode="Extra";
    this.api.save_leveldata();
    this.api.save_burstscore(0);
    //localStorage.setItem('logo_level_history', JSON.stringify(tmp));

    swal.fire({
      title: this.api.translate_str('Success'),
      text: this.api.translate_str('Your level data reseted all!'),
      icon: 'success',
      backdrop: false,
    });

  }

}
