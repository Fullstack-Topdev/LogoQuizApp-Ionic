import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';

import * as  moment from 'moment';

@Component({
  selector: 'app-buy-tip',
  templateUrl: './buy-tip.page.html',
  styleUrls: [
    './buy-tip.page.scss'
  ]
})
export class BuyTipPage implements OnInit {

  price:any;
  type:any;

  package_tips=[
    {id:1,type:"light",name:"Light", count:3,icon_url:"assets/icon/lamp.svg" },
    {id:2,type:"watch",name:"Watch",count:3,icon_url:"assets/icon/clock.svg" },
    {id:3,type:"swap",name:"Swap",count:3,icon_url:"assets/icon/refresh.svg" },
    {id:4,type:"bomb",name:"Bomb",count:3,icon_url:"assets/icon/bomb.svg" },
    {id:5,type:"hangman",name:"Hangman",count:3,icon_url:"assets/icon/user.svg" }
  ];

  constructor(public router: Router, public menu: MenuController,   private navCtrl: NavController,private route: ActivatedRoute,
    public api: ApiService) {


      this.route.queryParams.subscribe(data => {   
        if (data && data.price ) {
          this.price=data.price;  
          this.type=data.type;
          console.log(this.price,this.type);
        }       
      });
  }

  ngOnInit(): void {
    this.menu.enable(false);

  }

  ionViewWillEnter() {
  }

    
  back() {
    this.navCtrl.back();
  }



  buy(){

    this.api.user_info.lights = this.api.user_info.lights + this.package_tips[0].count*this.type;
    this.api.user_info.timers = this.api.user_info.timers + this.package_tips[1].count*this.type;
    this.api.user_info.refreshs = this.api.user_info.refreshs + this.package_tips[2].count*this.type;
    this.api.user_info.bombs = this.api.user_info.bombs + this.package_tips[3].count*this.type;
    this.api.user_info.hangmans = this.api.user_info.hangmans + this.package_tips[4].count*this.type;

    this.api.save_userdata();

    swal.fire({
      title: this.api.translate_str('Success'),
      text: this.api.translate_str('buysuccess_str'),
      icon: 'success',
      backdrop: false,
    });

    this.navCtrl.back();


  }



}
