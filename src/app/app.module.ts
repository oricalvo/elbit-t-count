import {perfCounters} from "./profiling";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {ProfilingModule} from '../profiling/profiling.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ProfilingModule.forRoot(perfCounters, "profiler"),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
