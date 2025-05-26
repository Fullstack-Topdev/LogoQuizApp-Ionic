import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ActivatedRoute} from '@angular/router';
import { Router ,NavigationExtras} from '@angular/router';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'burst-quizresult-page',
  templateUrl: './burst-quizresult.page.html',
  styleUrls: [
    './burst-quizresult.page.scss'
  ]
})
export class BurstQuizresultPage implements OnInit {


  success_flag:any;
  final_status:any;
  current_questionid:any;


  constructor(public api: ApiService , private route: ActivatedRoute,public router: Router,  private vibration: Vibration, ) { 

    this.route.queryParams.subscribe(data => {   
      if (data && data.current_questionid ) {
        console.log(data);
    
        this.current_questionid=parseInt(data.current_questionid);
        this.success_flag=data.success_flag;    

        if (this.success_flag==1){
          this.api.user_info.medals = this.api.user_info.medals + 1;
        }
          this.api.save_userdata();
          // localStorage.setItem('logo_userinfo',JSON.stringify(this.api.user_info));  
        
      }       
    });
    
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
    this.api.save_burstscore( this.current_questionid);
    this.router.navigate(['home']);
  }

  restart_quiz(){
    this.api.save_burstscore( this.current_questionid);
    const navData: NavigationExtras = {
      queryParams: {
        type:"new"
      }
    };
    this.router.navigate(['burst-quiz'], navData);
  }

  keep_play(){

    this.api.round_adflag=false;    
    const navData: NavigationExtras = {
      queryParams: {
        current_questionid:this.current_questionid,
        type:"keep"
      }
    };
    this.router.navigate(['burst-quiz'], navData);
  }




}
