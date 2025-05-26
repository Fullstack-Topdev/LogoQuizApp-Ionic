import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ApiService } from '../api.service';
import * as  moment from 'moment';

@Component({
  selector: 'app-award',
  templateUrl: './award.page.html',
  styleUrls: [
    './award.page.scss'
  ]
})
export class AwardPage implements OnInit {


  award_array = [0, 0, 0, 0, 0, 1, 2, 3, 4]; //1,2 medals,   3,4 random tips
  get_awardflag = 0;
  select_tip: any;
  retry_flag:boolean=true;

  constructor(public router: Router, public menu: MenuController,
    public api: ApiService) {
    console.log(this.api.user_info);
    console.log(this.api.tip_array);

  }

  ngOnInit(): void {
    this.menu.enable(false);

  }

  ionViewWillEnter() {
    this.shuffle();
  }

  shuffle() {
    
    var j, x, i;
    this.get_awardflag = 0;
    for (i = this.award_array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = this.award_array[i];
      this.award_array[i] = this.award_array[j];
      this.award_array[j] = x;
    }
    console.log('init award', this.award_array);
  
  }

  go_home(){
    
    this.router.navigate(['home']);
  }

  retry(){  
    this.retry_flag=false;
    this.shuffle();
  }

  click_award(val) {

    if (val == 0) {
      this.get_awardflag = -1;

    } else {
      this.get_awardflag = val;
      var rand_id = Math.floor(Math.random() * 5);

      switch (this.get_awardflag) {
        case 1:
          this.api.user_info.medals = this.api.user_info.medals + 1;
          break;
        case 2:
          this.api.user_info.medals = this.api.user_info.medals + 2;
          break;

        case 3:
          this.select_tip = this.api.tip_array[rand_id];
          break;
        case 4:
          this.select_tip = this.api.tip_array[rand_id];
          break;
        default:
          console.log("There is no award");
      };


      if (this.get_awardflag == 3 || this.get_awardflag == 4) {
        switch (this.select_tip.type) {
          case "light":
            this.api.user_info.lights = this.api.user_info.lights + 1;
            break;
  
          case "watch":
            this.api.user_info.timers = this.api.user_info.timers + 1;
            break;
  
          case "swap":
            this.api.user_info.refreshs = this.api.user_info.refreshs + 1;
            break;
  
          case "bomb":
       
            this.api.user_info.bombs = this.api.user_info.bombs + 1;
            break;
          case "hangman":
            this.api.user_info.hangmans = this.api.user_info.hangmans + 1;
            break;
  
          default:
            console.log("There is no tip");
        }
      }

    }

    this.api.user_info.award_date=moment().format("YYYY/MM/DD");
    // localStorage.setItem('logo_userinfo',JSON.stringify(this.api.user_info));  

    console.log("award_result:", this.get_awardflag);
    console.log(this.api.user_info);

    this.api.save_userdata();    

    if (val!=0){
      setTimeout(() => {        
        this.go_home() ;
      }, 3000);
    }

  }





}
