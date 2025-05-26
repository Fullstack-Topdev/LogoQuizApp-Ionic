import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';


import { AwardPage } from './award.page';

const routes: Routes = [
  {
    path: '',
    component: AwardPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes),
  ],
  exports:[
    TranslateModule
  ],
  declarations: [AwardPage]
})
export class AwardPageModule {}
