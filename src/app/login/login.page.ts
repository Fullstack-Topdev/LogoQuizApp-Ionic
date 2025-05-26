import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { TranslateService } from '@ngx-translate/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import swal from 'sweetalert2';

import * as  moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: [
    './login.page.scss'
  ]
})
export class LoginPage implements OnInit {
  isLogin: boolean = false;
  isgoogleLogin: boolean = false;
  isfacebookLogin: boolean = false;
  userinit;

  constructor( public router: Router,    public menu: MenuController,    private fb: Facebook,
    public api: ApiService   , private translate: TranslateService,    private googlePlus: GooglePlus
  ) {

  }

  ngOnInit(): void {
    this.menu.enable(false);  
    
  
      const id = this.api.makeid(20);

      this.userinit = {
        id: id.toString(),
        email:"",
        nickname: "Anonymous-"+Date.now(),
        username:"Anonymous User",           
        login_type:'',
        lang:'en',
        sound:true,
        vibrate:true,     
        award_date: "2020/11/01",
        tip_date: "2020/11/01",
        medals: 0,
        lights: 0,
        timers: 0,
        bombs: 0,
        refreshs: 0,
        hangmans: 0
      }

      console.log(this.userinit);
  }



  check_dailyaward() {

    if (moment().format(this.api.user_info.award_date)<moment().format("YYYY/MM/DD")){
      console.log("Possible award");
      this.router.navigate(['award']);
    }else if(moment().format(this.api.user_info.award_date)>moment().format("YYYY/MM/DD")){
      console.log('Possible impossible');
      this.router.navigate(['home']);

    }else{
      console.log('Both date are same');
      this.router.navigate(['home']);
   }
   
  }



  register_user(){
    
    console.log('ok', this.userinit, this.userinit.id);
   
    this.api.registerUser(this.userinit.id, this.userinit).then(data => {
      this.isfacebookLogin= false;
      this.isgoogleLogin= false;
      this.isLogin=false;

      this.api.user_info = this.userinit;
      localStorage.setItem('logo_userinfo', JSON.stringify(this.userinit));
      this.check_dailyaward();

      console.log(data);
    }).catch(error => {
      this.isfacebookLogin= false;
      this.isgoogleLogin= false;
      this.isLogin=false;
      this.api.showToast(this.api.translate_str("Something Error"),"danger","bottom");

      console.log(error);
    });

  }
    
  doGeneralLogin(){
    console.log("login with anonymouse now");
    this.isLogin=true;
    this.register_user();

  }

  doGoogleLogin() {    

    console.log("login with google now");
    this.isgoogleLogin= true;
    // this.signinwithsocial("james@gmail.com","jamems rober test",'google');
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
                

         this.userinit.email=email;
         this.userinit.login_type=regtype;
         this.userinit.username=username;
         this.userinit.nickname=username+"-"+Date.now();
         this.register_user();

     }else{
         console.log("login with social"+regtype);
         this.isfacebookLogin= false;
         this.isgoogleLogin= false;          
         
         this.api.user_info = userinfo[0];
         this.api.user_info.login_type=regtype;

         localStorage.setItem('logo_userinfo', JSON.stringify(this.api.user_info));
         this.check_dailyaward();
     }

  }).catch(error => {
    console.log(error);
    this.api.showToast(this.api.translate_str("Something Error"),"danger","bottom");

  });
 }

}
