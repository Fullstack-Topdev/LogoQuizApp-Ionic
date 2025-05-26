import { Component, OnInit } from '@angular/core';
import { Router,NavigationExtras } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { NavController } from '@ionic/angular';
import swal from 'sweetalert2';

import * as  moment from 'moment';

@Component({
  selector: 'app-get-tip',
  templateUrl: './get-tip.page.html',
  styleUrls: [
    './get-tip.page.scss'
  ]
})
export class GetTipPage implements OnInit {

  package_array=[0.99,1.99,2.99];

  select_tip: any;

  tip_flag=true;

  constructor(public router: Router, public menu: MenuController,   private navCtrl: NavController,
    public api: ApiService) {

      if (moment().format(this.api.user_info.tip_date)<moment().format("YYYY/MM/DD")){
        console.log("Possible award");
        this.tip_flag=true;
      }else if(moment().format(this.api.user_info.tip_date)>moment().format("YYYY/MM/DD")){
        console.log('Possible impossible');
        this.tip_flag=false;  
      }else{
        console.log('Both date are same');
        this.tip_flag=false;  
     }
  }

  ngOnInit(): void {
    this.menu.enable(false);

  }

  ionViewWillEnter() {
  }

    
  back() {
    this.navCtrl.back();
  }

  click_freetip(){
    var rand_id = Math.floor(Math.random() * 5);
    console.log(this.api.tip_array[rand_id]);
    var rand_tip=this.api.tip_array[rand_id];
   
    switch (rand_tip.type) {
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

    this.api.user_info.tip_date=moment().format("YYYY/MM/DD");
    this.api.save_userdata();

    swal.fire({
      title: this.api.translate_str('Success'),
      text: this.api.translate_str('You got one tip!'),
      icon: 'success',
      backdrop: false,
    });


    this.tip_flag=false;
  }

  buy_tips(price,i){
    console.log(price);
    const navData: NavigationExtras = {
      queryParams: {
        price: price,
        type:i
      }
    };
    this.router.navigate(['buy-tip'],navData);

  }

  buywithmedal(tip){
    console.log(tip);
    if (this.api.user_info.medals<tip.medals){

      swal.fire({
        title: this.api.translate_str('Warning'),
        text: this.api.translate_str('Your medals is small to get this tip.'),
        icon: 'warning',
        backdrop: false,
      });
  
    }else{

   
      switch (tip.type) {
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

      this.api.user_info.medals=this.api.user_info.medals-tip.medals;
      this.api.save_userdata();

      swal.fire({
        title: this.api.translate_str('Success'),
        text: this.api.translate_str('You got this tip with medals'),
        icon: 'success',
        backdrop: false,
      });
      


    }


  }


}
