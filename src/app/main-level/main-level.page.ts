import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { Router ,NavigationExtras} from '@angular/router';

@Component({
  selector: 'main-level-page',
  templateUrl: './main-level.page.html',
  styleUrls: [
    './main-level.page.scss'
  ]
})
export class MainLevelPage implements OnInit {

  main_levels=[
    {id:1,name:"logos",total_counts:30,complete_counts:0,complete_flag:false },
    {id:2,name:"logos",total_counts:30,complete_counts:0,complete_flag:false },
    {id:3,name:"logos",total_counts:30,complete_counts:0,complete_flag:false },
  ];
  
  
  constructor(public api: ApiService , 
    public router: Router,
    private navCtrl: NavController  ) { 

  }

  ngOnInit(): void {

  }
 
  ionViewDidEnter() {
    console.log('MainLevelPage view');  
    console.log(this.api.level_history);


    var complete_count=0;
    for (let i = 0; i < this.api.level_history[0].length; i++) {
      if (this.api.level_history[0][i].status>0){
        complete_count=complete_count+1;
      }
    }
    this.main_levels[0].complete_counts=complete_count;

  }
  
  back() {
    //this.navCtrl.back();
    this.router.navigate(['home']);

  }

  go_sublevel(level){
    this.api.selected_mainlevel=level;
    this.router.navigate(['sub-level']);

  }

      
}
