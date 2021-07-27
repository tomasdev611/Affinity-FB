import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallcenterRoutes } from './callcenter.routing';
import { ListComponent } from './list/list.component';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CallcenterRoutes)
    
  ],
  declarations: [ListComponent]
})
export class CallcenterModule { }
