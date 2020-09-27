import { Component, OnInit } from '@angular/core';
import { RouterLinkDelegate } from '@ionic/angular';
import { Program } from '../Model/Program';
import { ProgramServService } from '../program-serv.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  private theProgram;
  private totalSeconds: number;
  private totalSecondsWork: number;
  private totalSecondsPause: number;
  private totalMin: number;
  private totalSec: number;
  private totalMinWork: number;
  private totalSecWork: number;
  private totalMinPause: number;
  private totalSecPause: number;
  
  
  constructor(private aProgram: ProgramServService) {
    this.totalSeconds = 0;

  }
  

  public ngOnInit() {
    this.theProgram = this.aProgram.ReadProgram(); 
  }

  onClickRound() {
    let line = new Program();

    line.roundsCount = 5;
    line.type = "ROUND";
    line.timeRoundMin = 0;
    line.timeRoundSec = 50;
    line.timePauseMin = 0;
    line.timePauseSec = 10;

    this.aProgram.AddLine(line);

    this.totalSeconds = this.aProgram.GetTotalSeconds();
    this.totalMin = Math.floor(this.totalSeconds / 60);
    this.totalSec = this.totalSeconds % 60;
    this.totalSecondsWork = this.aProgram.GetTotalSecondsWork();
    this.totalMinWork = Math.floor(this.totalSecondsWork / 60);
    this.totalSecWork = this.totalSecondsWork % 60;
    this.totalSecondsPause = this.aProgram.GetTotalSecondsPause();
    this.totalMinPause = Math.floor(this.totalSecondsPause / 60);
    this.totalSecPause = this.totalSecondsPause % 60;

    this.ngOnInit();
  }

  onClickTimer() {
    let line = new Program();

    line.type = "TIMER";
    line.timeRoundMin = 0;
    line.timeRoundSec = 10;

    this.aProgram.AddLine(line);

    this.totalSeconds = this.aProgram.GetTotalSeconds();
    this.totalMin = Math.floor(this.totalSeconds / 60);
    this.totalSec = this.totalSeconds % 60;
    this.totalSecondsWork = this.aProgram.GetTotalSecondsWork();
    this.totalMinWork = Math.floor(this.totalSecondsWork / 60);
    this.totalSecWork = this.totalSecondsWork % 60;
    this.totalSecondsPause = this.aProgram.GetTotalSecondsPause();
    this.totalMinPause = Math.floor(this.totalSecondsPause / 60);
    this.totalSecPause = this.totalSecondsPause % 60;

    this.ngOnInit();
  }

  onClickPause() {
    let line = new Program();

    line.type = "PAUSE";
    line.timePauseMin = 0;
    line.timePauseSec = 10;

    this.aProgram.AddLine(line);

    this.totalSeconds = this.aProgram.GetTotalSeconds();
    this.totalMin = Math.floor(this.totalSeconds / 60);
    this.totalSec = this.totalSeconds % 60;
    this.totalSecondsWork = this.aProgram.GetTotalSecondsWork();
    this.totalMinWork = Math.floor(this.totalSecondsWork / 60);
    this.totalSecWork = this.totalSecondsWork % 60;
    this.totalSecondsPause = this.aProgram.GetTotalSecondsPause();
    this.totalMinPause = Math.floor(this.totalSecondsPause / 60);
    this.totalSecPause = this.totalSecondsPause % 60;

    this.ngOnInit();
  }


  onClickTabata() {
    let line = new Program();

    line.roundsCount = 5;
    line.type = "TABATA";
    line.timeRoundMin = 0;
    line.timeRoundSec = 50;
    line.timePauseMin = 0;
    line.timePauseSec = 10;
    line.timeMacroPauseMin = 0;
    line.timeMacroPauseSec = 10;
    line.tabataRoundsCount = 2;

    this.aProgram.AddLine(line);

    this.totalSeconds = this.aProgram.GetTotalSeconds();
    this.totalMin = Math.floor(this.totalSeconds / 60);
    this.totalSec = this.totalSeconds % 60;

    this.ngOnInit();
  }

  onClickDelete(line: Program) {

    this.aProgram.DeleteLine(line);

    this.totalSeconds = this.aProgram.GetTotalSeconds();
    this.totalMin = Math.floor(this.totalSeconds / 60);
    this.totalSec = this.totalSeconds % 60;
    this.totalSecondsWork = this.aProgram.GetTotalSecondsWork();
    this.totalMinWork = Math.floor(this.totalSecondsWork / 60);
    this.totalSecWork = this.totalSecondsWork % 60;
    this.totalSecondsPause = this.aProgram.GetTotalSecondsPause();
    this.totalMinPause = Math.floor(this.totalSecondsPause / 60);
    this.totalSecPause = this.totalSecondsPause % 60;

    this.ngOnInit();
    
  }

  onClickUp(line: Program) {
    this.aProgram.MoveUp(line);

    this.ngOnInit();
  }

  onClickDown(line: Program) {
    this.aProgram.MoveDown(line);

    this.ngOnInit();
  }

  onChangeTime(line: Program) {
    if (line.type == "PAUSE") {
      line.timePauseMin += Math.floor(line.timePauseSec / 60);
      line.timePauseSec = line.timePauseSec % 60;
    }
    else {
      line.timeRoundMin += Math.floor(line.timeRoundSec / 60);
      line.timeRoundSec = line.timeRoundSec % 60;
    }
  
    this.totalSeconds = this.aProgram.GetTotalSeconds();
    this.totalMin = Math.floor(this.totalSeconds / 60);
    this.totalSec = this.totalSeconds % 60;
    this.totalSecondsWork = this.aProgram.GetTotalSecondsWork();
    this.totalMinWork = Math.floor(this.totalSecondsWork / 60);
    this.totalSecWork = this.totalSecondsWork % 60;
    this.totalSecondsPause = this.aProgram.GetTotalSecondsPause();
    this.totalMinPause = Math.floor(this.totalSecondsPause / 60);
    this.totalSecPause = this.totalSecondsPause % 60;

    this.ngOnInit();
  }

}
