import { Component, OnInit, NgZone } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationExtras } from '@angular/router';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'quiz-page',
  templateUrl: './quiz.page.html',
  styleUrls: [
    './quiz.page.scss'
  ]
})
export class QuizPage implements OnInit {

  level_info: any;
  level_status: any;
  

  keyboard_list=[
    [{char:'Q',flag:true},{char:'W',flag:true},{char:'E',flag:true},{char:'R',flag:true},{char:'T',flag:true},{char:'Y',flag:true},{char:'U',flag:true},{char:'I',flag:true},{char:'O',flag:true},{char:'P',flag:true}],
    [{char:'A',flag:true},{char:'S',flag:true},{char:'D',flag:true},{char:'F',flag:true},{char:'G',flag:true},{char:'H',flag:true},{char:'J',flag:true},{char:'K',flag:true},{char:'L',flag:true}],
    [{char:'Z',flag:true},{char:'X',flag:true},{char:'C',flag:true},{char:'V',flag:true},{char:'B',flag:true},{char:'N',flag:true},{char:'M',flag:true}]
  ]
  mytimer_interval;
  current_sec;

  hint_flag = false;
 

  current_questionid=0;
  sel_question: any;
  answer_list: any;

  firstword_list:any=new Array();
  secondword_list:any=new Array();
  worditem_width:any;

  wrong_keycounts;

  constructor(
    public api: ApiService,
    private navCtrl: NavController, 
    private route: ActivatedRoute, 
    public router: Router,
    private vibration: Vibration,
    private zone: NgZone) {

    this.route.queryParams.subscribe(data => {
      if (data && data.level_info) {
        this.level_info = JSON.parse(data.level_info);
        this.level_status = data.level_status;
        if (data.type=="new")
            this.current_questionid=0;
        else
            this.current_questionid= parseInt(data.current_questionid);

        console.log(data);   

      }
    });
  }

  ngOnInit(): void {

  }


  ionViewWillEnter() {
    console.log('Question Page view');
  
    this.start_Quiz();
  }
  
  ionViewWillLeave(){
    console.log('Question Page Leave');

    //save userinfo data to db.


  }
  

  start_Quiz(){

    this.sel_question=this.api.quiz_questions[this.current_questionid];
  
    if (this.level_info.question_type=='muliplechoice'){
        this.answer_list= this.sel_question.answers;
    }else if (this.level_info.question_type=='hangman'){
        this.answer_list=[];
    }

    this.shuffle();
    this.init_data();
    this.current_sec = 60;
    this.run_timer();

  }


  init_data() {
    this.hint_flag = false;
    this.wrong_keycounts=4;
    this.firstword_list=[];
    this.secondword_list=[];

    if (this.level_info.question_type=='hangman'){
      for (let i=0;i<this.sel_question.firstword.length;i++){
        this.firstword_list.push({char:this.sel_question.firstword.charAt(i),sel_flag:0} );
      }
  
      for (let i=0;i<this.sel_question.secondword.length;i++){
        this.secondword_list.push({char:this.sel_question.secondword.charAt(i),sel_flag:0} );
      }

      this.worditem_width=100/(this.firstword_list.length+this.secondword_list.length+6)+"vw";
    } 


    for (let i=0;i<3;i++){
      for (let j=0;j<this.keyboard_list[i].length;j++){
            this.keyboard_list[i][j].flag=true;
      }
    }
    
    clearInterval(this.mytimer_interval);
  }

  back() {
    console.log('Question Page backbutton');
    clearInterval(this.mytimer_interval);

    if (this.level_status==-1){
      for (let i=0;i<this.api.level_history[this.api.selected_mainlevel-1].length;i++){
        if (this.api.level_history[this.api.selected_mainlevel-1][i].id==this.level_info.id){
          this.api.level_history[this.api.selected_mainlevel-1][i].status=0;
         // localStorage.setItem('logo_level_history', JSON.stringify(this.api.level_history));
          break;
        }
      }
    }
    
    this.navCtrl.back();
  }

  shuffle() {

    if (this.level_info.question_type == 'muliplechoice') {
      var j, x, i;

      var tmp_array = this.answer_list;

      for (i = tmp_array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = tmp_array[i];
        tmp_array[i] = tmp_array[j];
        tmp_array[j] = x;
      }
      this.answer_list = tmp_array;

   //   console.log('rearrange answer_list', this.answer_list);
    }

  }

  run_timer() {
    this.mytimer_interval = setInterval(() => {
      this.current_sec = this.current_sec - 1;

      if (this.current_sec < 1) {
        this.finish_level(0);
      }

    }, 1000);

  }



  show_hint() {

    if (this.api.user_info.lights > 0) {
      this.hint_flag = true;
      this.api.user_info.lights = this.api.user_info.lights - 1;
     // localStorage.setItem('logo_userinfo', JSON.stringify(this.api.user_info));
    } else {
      this.api.showToast(this.api.translate_str('There is no this tip!'), "warning", 'bottom');
    }
  }

  stop_timer() {
    if (this.api.user_info.timers > 0) {
      clearInterval(this.mytimer_interval);
      this.api.user_info.timers = this.api.user_info.timers - 1;
     // localStorage.setItem('logo_userinfo', JSON.stringify(this.api.user_info));
    } else {
      this.api.showToast(this.api.translate_str('There is no this tip!'), "warning", 'bottom');
    }
  }

  click_bomb() {

    
    if (this.api.user_info.bombs > 0) {
      this.api.user_info.bombs = this.api.user_info.bombs - 1;
    //  localStorage.setItem('logo_userinfo', JSON.stringify(this.api.user_info));

      console.log("-----bomb action---------")
      var tmp_answer = new Array();
      var incorrect_answer = new Array();
      for (let i = 0; i < this.sel_question.answers.length; i++) {
        if (this.sel_question.answers[i].correct == 1)
          tmp_answer.push(this.sel_question.answers[i]);
        else
          incorrect_answer.push(this.sel_question.answers[i]);
      }

      tmp_answer.push(incorrect_answer[Math.floor(Math.random() * 2) + 1]);
      console.log("bomb result-", tmp_answer);

      this.zone.run(() => {
        this.answer_list = tmp_answer;
        this.shuffle();
      });
    } else {
      this.api.showToast(this.api.translate_str('There is no this tip!'), "warning", 'bottom');
    }

  }


  
  click_refresh(){

    if (this.api.user_info.refreshs > 0) {
      this.api.user_info.refreshs = this.api.user_info.refreshs - 1;
    //  localStorage.setItem('logo_userinfo', JSON.stringify(this.api.user_info));

      // console.log(this.api.possible_quiz_questions);
      // console.log(this.level_info);

       var sel_id=this.level_info.question_count+ Math.floor(Math.random() * (this.api.possible_quiz_questions.length - this.level_info.question_count));
      //  console.log(sel_id);
       
       if (this.api.possible_quiz_questions.length>2){
        console.log(this.api.possible_quiz_questions[sel_id]);

        this.zone.run(() => {
          this.sel_question= this.api.possible_quiz_questions[sel_id];
  
          if (this.level_info.question_type=='muliplechoice'){
              this.answer_list= this.sel_question.answers;
          }else if (this.level_info.question_type=='hangman'){
              this.answer_list=[];
          }
      
          this.shuffle();
          this.init_data();
          this.run_timer();
          console.log(this.sel_question);       
  
         });
       }else{
         console.log("There is only one question in same type.");
       }
       
     
    } else {
      this.api.showToast(this.api.translate_str('There is no this tip!'), "warning", 'bottom');
    }


  }



  keybtn_click(key_item){
    console.log(key_item);
    key_item.flag=false;

    var keychar=key_item.char;
    var keymatch_flag=false;
    for (let i=0;i<this.firstword_list.length;i++){
      if (keychar==this.firstword_list[i].char.toUpperCase()){
        this.firstword_list[i].sel_flag=1;
        keymatch_flag=true;
      }      
    }

    for (let i=0;i<this.secondword_list.length;i++){
      if (keychar==this.secondword_list[i].char.toUpperCase()){
        this.secondword_list[i].sel_flag=1;
        keymatch_flag=true;
      }      
    }

    if (keymatch_flag==false) {
        this.wrong_keycounts=this.wrong_keycounts-1;
        if (this.api.user_info.vibrate) this.vibration.vibrate(1000);
        console.log("wrong count",this.wrong_keycounts);
    } 
    
    if (this.wrong_keycounts==0){
      this.finish_level(0); 
    }

    if (this.check_completehangman()==true){
      if (this.current_questionid<this.api.quiz_questions.length-1){
        this.current_questionid=this.current_questionid+1;
        this.start_Quiz();
      }else{
        this.finish_level(1);
      }
    }
  }

  check_completehangman(){
    for (let i=0;i<this.firstword_list.length;i++){
      if (this.firstword_list[i].sel_flag==0){
        return false;
      }      
    }

    for (let i=0;i<this.secondword_list.length;i++){
      if (this.secondword_list[i].sel_flag==0){
        return false;
      }      
    }

    return true;    
  }


  click_hangman(){
  
    if (this.api.user_info.hangmans > 0) {
      for (let i=0;i<this.firstword_list.length;i++){
        this.firstword_list[i].sel_flag=1;
      }
      this.api.user_info.hangmans = this.api.user_info.hangmans - 1;
     // localStorage.setItem('logo_userinfo', JSON.stringify(this.api.user_info));
    } else {
      this.api.showToast(this.api.translate_str('There is no this tip!'), "warning", 'bottom');
    }
  }

  click_answer(answer) {

    var success_flag;

    if (answer.correct == 1)
      success_flag = 1;
    else
      success_flag = 0;

    if (success_flag==0)   {
      this.finish_level(success_flag);
    }else{

      if (this.current_questionid<this.api.quiz_questions.length-1){
        this.current_questionid=this.current_questionid+1;
        this.start_Quiz();
      }else{
        this.finish_level(success_flag);
      }
    } 
  }



  finish_level(success_flag){
    const navData: NavigationExtras = {
      queryParams: {
        level_info: JSON.stringify(this.level_info),
        level_status: this.level_status,
        success_flag: success_flag,
        current_questionid:this.current_questionid
      }
    };
    this.router.navigate(['quiz-result'], navData);

    this.init_data();
  }

}
