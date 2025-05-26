import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router ,NavigationExtras} from '@angular/router';
import { Vibration } from '@ionic-native/vibration/ngx';
import * as  moment from 'moment';
import swal from 'sweetalert2';

@Component({
  selector: 'home-page',
  templateUrl: './home.page.html',
  styleUrls: [
    './home.page.scss'
  ]
})
export class HomePage implements OnInit {


  constructor(public api: ApiService ,  
     public router: Router,
     private vibration: Vibration
   ) { 


  }

  ngOnInit(): void {

  }
 
  ionViewDidEnter() {
    console.log('HomePage view');   
    console.log(this.api.user_info);
    this.api.round_adflag=true;
  }

  /// when amin level play,  set mode='Normal', load main-levelhistory from db,start game 

  play(){
    this.api.play_mode="Normal";

    this.api.show(this.api.translate_str("Loading..."));

    this.api.getLevelHistory(this.api.user_info.id).then((data) => {      
      console.log(data);
 
      if (data && data.level_history){
        
        console.log("loadhistory from db");
        this.api.hide()
        this.api.level_history=JSON.parse(data.level_history);
        this.router.navigate(['main-level']);

      }else{
        console.log("create new  history");
        var tmp = new Array();
        for (let level=0;level<3;level++){
          var level_item=new Array();
          for (let i = 0; i < this.api.level1_data.length; i++) {
            level_item.push({ id: this.api.level1_data[i].id, status: -1 });
          }
          tmp.push(level_item);
        }

        var levelinfo={
          id:this.api.user_info.id,
          update_time: moment().format("YYYY/MM/DD hh:mm"),
          level_history:JSON.stringify(tmp)
        }

        this.api.create_LevelHistory(this.api.user_info.id, levelinfo).then(data => {        
          this.api.hide()
          console.log(data);
          this.api.level_history = tmp;
          this.router.navigate(['main-level']);

        }).catch(error => {
          this.api.hide()
          this.api.showToast(this.api.translate_str("Something Error"),"danger","bottom");    
          console.log(error);
        });       
      }
 
   }).catch(error => {
     console.log(error);
     this.api.hide()
     this.api.showToast(this.api.translate_str("Something Error"),"danger","bottom"); 
   });

  }



  click_extra(){

    swal.fire({
      title: this.api.translate_str("EXTRA LEVELS"),
      text:   this.api.translate_str("These are extra levels!"),
      icon: 'info',
      backdrop: false,
      showCancelButton: true,
      confirmButtonText: this.api.translate_str('Continue'),
      cancelButtonText: this.api.translate_str('Cancel')
      
    }).then((result) => {
      if (result.value) {
        console.log("Start button action");
        this.start_extraplay();
        
      } else if (result.dismiss === swal.DismissReason.cancel) {
        console.log("Cancel button action");
      }
    })   
  }

  /// when extra pay,  set mode='extra', load extra-levelhistory from db,start game 
  start_extraplay(){
    this.api.play_mode="Extra";
    
    this.api.show(this.api.translate_str("Loading..."));
    this.api.get_extraLevelHistory(this.api.user_info.id).then((data) => {      
      console.log(data);
 
      if (data && data.level_history){
        
        console.log("loadhistory from db");
        this.api.hide()
        this.api.level_history=JSON.parse(data.level_history);
        this.router.navigate(['main-level']);

      }else{
        console.log("create new  history");
        var tmp = new Array();
        for (let level=0;level<3;level++){
          var level_item=new Array();
          for (let i = 0; i < this.api.level1_data.length; i++) {
            level_item.push({ id: this.api.level1_data[i].id, status: -1 });
          }
          tmp.push(level_item);
        }

        var levelinfo={
          id:this.api.user_info.id,
          update_time: moment().format("YYYY/MM/DD hh:mm"),
          level_history:JSON.stringify(tmp)
        }

        this.api.create_extraLevelHistory(this.api.user_info.id, levelinfo).then(data => {        
          this.api.hide()
          console.log(data);
          this.api.level_history = tmp;
          this.router.navigate(['main-level']);

        }).catch(error => {
          this.api.hide()
          this.api.showToast(this.api.translate_str("Something Error"),"danger","bottom");    
          console.log(error);
        });       
      }
 
   }).catch(error => {
     console.log(error);
     this.api.hide()
     this.api.showToast(this.api.translate_str("Something Error"),"danger","bottom"); 
   });
   
  }

  click_burst(){
    swal.fire({
      title: this.api.translate_str("BURST MODE"),
      text:   this.api.translate_str("Start Burst mode!"),
      icon: 'info',
      backdrop: false,
      showCancelButton: true,
      confirmButtonText: this.api.translate_str('Continue'),
      cancelButtonText: this.api.translate_str('Cancel')
      
    }).then((result) => {
      if (result.value) {
        console.log("Start button action");
        this.start_burstplay();

      } else if (result.dismiss === swal.DismissReason.cancel) {
        console.log("Cancel button action");
      }
    })   
  }

  /// when burst mode, load burstmode-score from db,start game 

  start_burstplay(){

    var tmp_questions_list = [];
    for (let i = 0; i < this.api.burstmode_count/2; i++) {
          var multiple_tmp=this.api.multiplechoice_data[i%(this.api.multiplechoice_data.length)];
          multiple_tmp.question_type="muliplechoice"
          tmp_questions_list.push(multiple_tmp);
          var hangman_tmp=this.api.hangman_data[i%(this.api.hangman_data.length)];
          hangman_tmp.question_type="hangman"
          tmp_questions_list.push(hangman_tmp);        
    }
   

     tmp_questions_list = this.shuffle(this.shuffle(tmp_questions_list));
     this.api.quiz_questions=tmp_questions_list;

     const navData: NavigationExtras = {
      queryParams: {   
        type:"new"
      }
    };
     

    this.api.show(this.api.translate_str("Loading..."));
    this.api.get_burstScore(this.api.user_info.id).then((data) => {      
      console.log(data);
 
      if (data && data.score){
        this.api.hide();
        //console.log(data.score);
        this.api.burst_score=data.score;
        this.router.navigate(['burst-quiz'], navData);

      }else{
        var burstinfo={
          id:this.api.user_info.id,
          update_time: moment().format("YYYY/MM/DD hh:mm"),
          nickname:this.api.user_info.nickname,
          score:0
        }

        this.api.create_burstScore(this.api.user_info.id, burstinfo).then(data => {        
          this.api.hide()
          this.api.burst_score=0;
          this.router.navigate(['burst-quiz'], navData);
        }).catch(error => {
          this.api.hide()
          this.api.showToast(this.api.translate_str("Something Error"),"danger","bottom");    
          console.log(error);
        });       
      }
 
   }).catch(error => {
     console.log(error);
     this.api.hide()
     this.api.showToast(this.api.translate_str("Something Error"),"danger","bottom"); 
   });
  }

// array random rearrage function

  shuffle(array_list) {

    var j, x, i;
    var tmp_array = array_list;

    for (i = tmp_array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = tmp_array[i];
      tmp_array[i] = tmp_array[j];
      tmp_array[j] = x;
    }
    return tmp_array;
  }

  get_tip(){
    this.router.navigate(['get-tip']);
  } 

  go_stats(){
    this.api.show();

    this.api.getLevelHistory(this.api.user_info.id).then((data) => {      
      console.log(data);
      this.api.hide()

      if (data && data.level_history){        
        console.log("loadhistory from db");
        this.api.level_history=JSON.parse(data.level_history);
      }else{
        this.api.level_history="";
      }
      this.router.navigate(['stats']);

   }).catch(error => {
     console.log(error);
     this.api.hide()
     this.api.showToast(this.api.translate_str("Something Error"),"danger","bottom"); 
   });

  }

  go_ranking(){
    this.api.show();

    this.api.get_allburst().then((data) => {      
      console.log(data);

      if (data){        
        this.api.burst_data=data;
      }else{
        this.api.burst_data=[];
      }

      this.api.getLevelHistory(this.api.user_info.id).then((data) => {      
        console.log(data);
        this.api.hide()
  
        if (data && data.level_history){        
          this.api.level_history=JSON.parse(data.level_history);
        }else{
          this.api.level_history="";
        }
        this.router.navigate(['ranking']);
  
      }).catch(error => {
        console.log(error);
        this.api.hide()
        this.api.showToast(this.api.translate_str("Something Error"),"danger","bottom"); 
      });


   }).catch(error => {
     console.log(error);
     this.api.hide()
     this.api.showToast(this.api.translate_str("Something Error"),"danger","bottom"); 
   });



   // this.router.navigate(['ranking']);


  }


  go_setting(){
    this.router.navigate(['setting']);
  }


}
