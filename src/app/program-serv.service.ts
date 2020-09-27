import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Program } from './Model/Program';

@Injectable({
  providedIn: 'root'
})
export class ProgramServService {

  private aProgram: Array<Program> = []; 

  constructor() { }

  public AddLine(line: Program) {
    if (this.aProgram.length == 0)
      line.id = 0;
    else
      line.id =  this.aProgram[this.aProgram.length - 1].id + 1;
    this.aProgram.push(line);
  }

  public ReadProgram() {
    return this.aProgram;
  }

  public DeleteLine(line: Program) {
    this.aProgram.splice(this.aProgram.indexOf(line), 1);
    for (let i = 0; i < this.aProgram.length; i++) {
      this.aProgram[i].id = i;
    }
  }

  public MoveUp(line: Program) {
    let aux: Program;
    let i = this.aProgram.indexOf(line);

    if ( i > 0) {
      aux = this.aProgram[i];
      this.aProgram[i] = this.aProgram[i - 1];
      this.aProgram[i - 1] = aux;
    }
  }

  public MoveDown(line: Program){
    let aux: Program;
    let i = this.aProgram.indexOf(line);

    if ( i < (this.aProgram.length-1)) {
      aux = this.aProgram[i];
      this.aProgram[i] = this.aProgram[i + 1];
      this.aProgram[i + 1] = aux;
    }
  }

  public GetTotalSecondsWork() {
    let totalSeconds;

    totalSeconds = 0;
    for (let i = 0; i < this.aProgram.length; i++){
      if (this.aProgram[i].type=="ROUND") {
        totalSeconds += ((this.aProgram[i].timeRoundSec + this.aProgram[i].timeRoundMin * 60) *
                          this.aProgram[i].roundsCount);    
      }
      if (this.aProgram[i].type == "TIMER") {
        totalSeconds += (this.aProgram[i].timeRoundSec + this.aProgram[i].timeRoundMin*60);    
      }
      if (this.aProgram[i].type == "TABATA") {
        totalSeconds += (((this.aProgram[i].timeRoundSec + this.aProgram[i].timeRoundMin * 60) *
                           this.aProgram[i].roundsCount) * this.aProgram[i].tabataRoundsCount);    
      }
    }

    return totalSeconds;
  }

  public GetTotalSecondsPause() {
    let totalSeconds;

    totalSeconds = 0;
    for (let i = 0; i < this.aProgram.length; i++){
      if (this.aProgram[i].type=="ROUND") {
        totalSeconds += ((this.aProgram[i].timePauseSec + this.aProgram[i].timePauseMin * 60) *
                         (this.aProgram[i].roundsCount-1));    
      }
      if (this.aProgram[i].type == "TABATA") {
        totalSeconds += (((this.aProgram[i].timePauseSec + this.aProgram[i].timePauseMin * 60) *
                          (this.aProgram[i].roundsCount-1)) * this.aProgram[i].tabataRoundsCount);    
        totalSeconds += ((this.aProgram[i].timeMacroPauseSec + this.aProgram[i].timeMacroPauseMin * 60) *
                         (this.aProgram[i].tabataRoundsCount-1));    
      }
      if (this.aProgram[i].type == "PAUSE")
        totalSeconds += (this.aProgram[i].timePauseSec + this.aProgram[i].timePauseMin * 60);
    }

    return totalSeconds;
  }

  public GetTotalSeconds() {
    let totalSeconds;

    totalSeconds = 0;
    for (let i = 0; i < this.aProgram.length; i++){
      if (this.aProgram[i].type == "ROUND") {
        totalSeconds += ((this.aProgram[i].timeRoundSec + this.aProgram[i].timeRoundMin * 60) *
                          this.aProgram[i].roundsCount);    
        totalSeconds += ((this.aProgram[i].timePauseSec + this.aProgram[i].timePauseMin * 60) *
                         (this.aProgram[i].roundsCount-1));    
      }
      if (this.aProgram[i].type == "TIMER") {
        totalSeconds += (this.aProgram[i].timeRoundSec + this.aProgram[i].timeRoundMin*60);    
      }
      if (this.aProgram[i].type == "TABATA") {
        totalSeconds += (((this.aProgram[i].timeRoundSec + this.aProgram[i].timeRoundMin * 60) *
                           this.aProgram[i].roundsCount) * this.aProgram[i].tabataRoundsCount);    
        totalSeconds += (((this.aProgram[i].timePauseSec + this.aProgram[i].timePauseMin * 60) *
                           (this.aProgram[i].roundsCount-1)) * this.aProgram[i].tabataRoundsCount);    
        totalSeconds += ((this.aProgram[i].timeMacroPauseSec + this.aProgram[i].timeMacroPauseMin * 60) *
                         (this.aProgram[i].tabataRoundsCount-1));    
      }
      if (this.aProgram[i].type == "PAUSE")
        totalSeconds += (this.aProgram[i].timePauseSec + this.aProgram[i].timePauseMin * 60);
    }

    return totalSeconds;
  }


}
