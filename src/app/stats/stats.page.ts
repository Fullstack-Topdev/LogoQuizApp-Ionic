import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute} from '@angular/router';
import swal from 'sweetalert2';

import * as  moment from 'moment';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: [
    './stats.page.scss'
  ]
})
export class StatsPage implements OnInit {

  level_history;
  user_info;

  perfect_logos=0;
  difficult_logos=0;
  argentina_logos=0;
  completed_levels=0;


  constructor(public router: Router, public menu: MenuController,   private navCtrl: NavController,private route: ActivatedRoute,
    public api: ApiService) {

      this.user_info = this.api.user_info;
      this.level_history=this.api.level_history;
  
      console.log(this.user_info);
      console.log(this.level_history);
  }

  ngOnInit(): void {
    this.menu.enable(false);

  }

  ionViewWillEnter() {
  
     this.perfect_logos=0;
     this.difficult_logos=0;
     this.argentina_logos=0;
     this.completed_levels=0;
  
    if (this.level_history!='' && this.level_history){
      for (let l=0;l<3;l++){
        for (let i = 0; i < this.level_history[l].length; i++) {

            if (this.level_history[l][i].status>0) this.completed_levels=this.completed_levels+1;
            if (this.level_history[l][i].status==10) this.perfect_logos=this.perfect_logos+1;

            for (let j = 0; j < this.api.level1_data.length; j++) {
              if (this.api.level1_data[j].id == this.level_history[l][i].id && this.level_history[l][i].status>0) {
                  if (this.api.level1_data[j].level_type=='Hard') this.difficult_logos=this.difficult_logos+1;
                  if (this.api.level1_data[j].question_country=='Argentina') this.argentina_logos=this.argentina_logos+1;

                break;
              }
            }

        }
      }
    }    
  }

    
  back() {
    this.navCtrl.back();
  }





}
