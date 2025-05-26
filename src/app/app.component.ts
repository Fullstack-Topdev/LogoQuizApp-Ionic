import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Platform } from '@ionic/angular';
import * as  moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  // styleUrls: [
  //   './side-menu/styles/side-menu.scss',
  //   './side-menu/styles/side-menu.shell.scss',
  //   './side-menu/styles/side-menu.responsive.scss'
  // ]
})
export class AppComponent {


  textDir = 'ltr';

  constructor(public translate: TranslateService, private platform: Platform, public router: Router, public api: ApiService) {
    this.initializeApp();
    this.api.setInitialAppLanguage();




    //console.log()
  }

  async initializeApp() {
    try {
      await SplashScreen.hide();

      //load music for game
      this.api.preload('success_sound', 'assets/sound/correct.mp3');
      this.api.preload('fail_sound', 'assets/sound/wrong.mp3');

      
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
          console.log('backbutton disable');
        }, false);
      });

        // load saved login info
      if (localStorage.getItem('logo_userinfo')) {
        this.api.user_info = JSON.parse(localStorage.getItem('logo_userinfo'));
        this.check_dailyaward();        

      } else {
        this.router.navigate(['login']);      
      }

      
    } catch (err) {
      console.log('This is normal in a browser', err);
    }
  }

  check_dailyaward() {
    // this.router.navigate(['award']);
    // return;

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

  logout() {
    console.log('logout');
    localStorage.clear();
    this.router.navigate(['auth/login']);

  }

}
