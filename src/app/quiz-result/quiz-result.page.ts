import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute} from '@angular/router';
import { Router ,NavigationExtras} from '@angular/router';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'quiz-result-page',
  templateUrl: './quiz-result.page.html',
  styleUrls: [
    './quiz-result.page.scss'
  ]
})
export class QuizResultPage implements OnInit {

  level_info:any;
  level_status:any;
  success_flag:any;
  final_status:any;
  current_questionid:any;


  constructor(public api: ApiService , private route: ActivatedRoute,public router: Router,  private vibration: Vibration, ) { 

    // this.api.level_history = JSON.parse(localStorage.getItem('logo_level_history'));
    console.log(this.api.level_history);

    this.route.queryParams.subscribe(data => {   
      if (data && data.level_info ) {
        console.log(data);

        this.level_info = JSON.parse(data.level_info);
        this.level_status = data.level_status;
        this.current_questionid=data.current_questionid;
        this.success_flag=data.success_flag;
    

        if (this.success_flag==1){
          this.api.user_info.medals = this.api.user_info.medals + 1;
        }
        this.api.save_userdata();
        // localStorage.setItem('logo_userinfo',JSON.stringify(this.api.user_info));  
        
      }       
    });
    
  }



  save_levelstatus(id,success_flag){
    var  status_val;

    for (let i=0;i<this.api.level_history[this.api.selected_mainlevel-1].length;i++){
      if (this.api.level_history[this.api.selected_mainlevel-1][i].id==id){
        
          if(success_flag==0){
            if (this.api.level_history[this.api.selected_mainlevel-1][i].status==-1 || this.api.level_history[this.api.selected_mainlevel-1][i].status==0 ){
              this.api.level_history[this.api.selected_mainlevel-1][i].status=0;
              this.final_status=0;
            }else{
              this.api.level_history[this.api.selected_mainlevel-1][i].status= this.api.level_history[this.api.selected_mainlevel-1][i].status;
              this.final_status=this.api.level_history[this.api.selected_mainlevel-1][i].status;
            }
          }else if (success_flag==1){
                switch (this.api.level_history[this.api.selected_mainlevel-1][i].status) {
                  // console.log(this.level_status);

                  // switch (this.level_status) {
                  case -1:
                    this.api.level_history[this.api.selected_mainlevel-1][i].status=10;
                    this.final_status=10;
                    break;
                  case 0:
                    this.api.level_history[this.api.selected_mainlevel-1][i].status=1;
                    this.final_status=1;
                    break;          
                  case 1:
                    this.api.level_history[this.api.selected_mainlevel-1][i].status=1;
                    this.final_status=1;
                    break;
                  case 10:
                    this.api.level_history[this.api.selected_mainlevel-1][i].status=10;
                    this.final_status=10;
                    break;
                  default:
                    console.log("There is no status change");
                };
            }
          break;
      }     
    }   

    console.log(this.api.level_history);
    //localStorage.setItem('logo_level_history', JSON.stringify(this.api.level_history));
  }

  ngOnInit(): void {
    if (this.success_flag==1 ){
      if (this.api.user_info.vibrate)  this.vibration.vibrate(1000);
      if (this.api.user_info.sound)  this.api.play('success_sound');
    }else{
      if (this.api.user_info.vibrate) this.vibration.vibrate(1000);
      if (this.api.user_info.sound) this.api.play('fail_sound');
    }
  }

 
  ionViewDidEnter() {
    console.log('quiz result view');   
    
  }
  
  go_home(){
    this.save_levelstatus(this.level_info.id,this.success_flag);
    this.api.save_leveldata();
    this.router.navigate(['home']);
  }

  restart_quiz(){
    this.save_levelstatus(this.level_info.id,this.success_flag);
    this.api.save_leveldata();
 

    const navData: NavigationExtras = {
      queryParams: {
        level_info: JSON.stringify(this.level_info),
        level_status: this.final_status,
        type:"new"
      }
    };
   this.router.navigate(['quiz'], navData);


  }

  keep_play(){

    this.api.round_adflag=false;

    
    const navData: NavigationExtras = {
      queryParams: {
        level_info: JSON.stringify(this.level_info),
        level_status: this.level_status,
        current_questionid:this.current_questionid,
        type:"keep"
      }
    };
   this.router.navigate(['quiz'], navData);
  }

  go_sublevel(){
    this.save_levelstatus(this.level_info.id,this.success_flag);
    this.api.save_leveldata();
    this.router.navigate(['sub-level']);
  }


}
