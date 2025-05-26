import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { Router, NavigationExtras } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'sub-level-page',
  templateUrl: './sub-level.page.html',
  styleUrls: [
    './sub-level.page.scss'
  ]
})
export class SubLevelPage implements OnInit {

  sub_levels: any = new Array(30);
  select_sublevel: any;
  select_questions: any = new Array();

  constructor(public api: ApiService, private navCtrl: NavController, public router: Router) {
  //  this.init_levels();
      console.log(this.api.level_history);
      this.sub_levels=this.api.level_history[this.api.selected_mainlevel-1];

  }

  ngOnInit(): void {

  }
  // status -1:new  ,0:tried,fail,  1: success with muitiple try , 10: success at once

  init_levels() {

    for (let i = 0; i < 30; i++) {
      this.sub_levels[i] = { id: i + 1, status: -1 };
    }
    //   console.log(this.sub_levels);
  }

  ionViewWillEnter() {
    this.sub_levels=this.api.level_history[this.api.selected_mainlevel-1];
    console.log('SubLevelPage view');
    this.api.round_adflag=true;
    // console.log(this.sub_levels);
  }

  

  back() {
    //this.navCtrl.back();
    this.router.navigate(['main-level']);
  }

  

  go_quiz(item) {
    console.log(item);

    for (let i = 0; i < this.api.level1_data.length; i++) {
      if (this.api.level1_data[i].id == item.id) {
        this.select_sublevel = this.api.level1_data[i];
        break;
      }
    }
    console.log(this.select_sublevel)

    swal.fire({
      title: this.api.translate_str("Level")+item.id,
      text:   this.api.translate_str(this.select_sublevel.level_type),
      icon: 'question',
      backdrop: false,
      showCancelButton: true,
      confirmButtonText: this.api.translate_str('Start'),
      cancelButtonText: this.api.translate_str('Close')
    }).then((result) => {
      if (result.value) {
        console.log("Start button action");
        this.start_quiz(item);
        
      } else if (result.dismiss === swal.DismissReason.cancel) {
        console.log("Cancel button action");
      }
    })    
  }


  // Make quiz questions by selected sub-level information from json data, after making quesionts, start quiz page with that.
   start_quiz(item){

    var tmp_questions_list = [];

    if (this.select_sublevel.question_type == 'muliplechoice') {
      for (let i = 0; i < this.api.multiplechoice_data.length; i++) {
        if (this.select_sublevel.question_start_difficult <= this.api.multiplechoice_data[i].difficult &&
          this.select_sublevel.question_end_difficult >= this.api.multiplechoice_data[i].difficult &&
          (this.select_sublevel.question_country == 'all' || this.select_sublevel.question_country != 'all' && this.select_sublevel.question_country == this.api.multiplechoice_data[i].country) &&
          (this.select_sublevel.question_fields == 'all' || this.select_sublevel.question_fields != 'all' && this.select_sublevel.question_fields == this.api.multiplechoice_data[i].type)) {

          tmp_questions_list.push(this.api.multiplechoice_data[i]);
        }
      }
    } else if (this.select_sublevel.question_type == 'hangman') {
      for (let i = 0; i < this.api.hangman_data.length; i++) {
        if (this.select_sublevel.question_start_difficult <= this.api.hangman_data[i].difficult &&
          this.select_sublevel.question_end_difficult >= this.api.hangman_data[i].difficult &&
          (this.select_sublevel.question_country == 'all' || this.select_sublevel.question_country != 'all' && this.select_sublevel.question_country == this.api.hangman_data[i].country) &&
          (this.select_sublevel.question_fields == 'all' || this.select_sublevel.question_fields != 'all' && this.select_sublevel.question_fields == this.api.hangman_data[i].type)) {

          tmp_questions_list.push(this.api.hangman_data[i]);
        }
      }

    }

    tmp_questions_list = this.shuffle(this.shuffle(tmp_questions_list));

    this.api.possible_quiz_questions=tmp_questions_list;

    var final_questions = [];
    for (let i = 0; i < this.select_sublevel.question_count; i++) {
      final_questions.push(tmp_questions_list[i]);
    }

    this.api.quiz_questions = [];
    this.api.quiz_questions = final_questions;


    const navData: NavigationExtras = {
      queryParams: {
        level_info: JSON.stringify(this.select_sublevel),
        level_status: item.status,
        type:"new"
      }
    };
    this.router.navigate(['quiz'], navData);
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



}