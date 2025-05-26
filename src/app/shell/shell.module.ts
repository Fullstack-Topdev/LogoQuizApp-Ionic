import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { AspectRatioComponent } from './aspect-ratio/aspect-ratio.component';
import { ImageShellComponent } from './image-shell/image-shell.component';
import { TextShellComponent } from './text-shell/text-shell.component';
import { AppShellConfig } from './config/app-shell.config';

@NgModule({
  declarations: [
    AspectRatioComponent,
    ImageShellComponent,
    TextShellComponent
  ],
  providers: [
    // Inspired in: https://devblogs.microsoft.com/premier-developer/angular-how-to-editable-config-files/
    {
      provide: APP_INITIALIZER,
      useFactory: (appShellConfig: AppShellConfig) => {
        return () => appShellConfig.load();
      },
      deps: [AppShellConfig],
      multi: true
    }
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    IonicModule
  ],
  exports: [
    AspectRatioComponent,
    ImageShellComponent,
    TextShellComponent
  ]
})
export class ShellModule { }
