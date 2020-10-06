import { stripSummaryForJitNameSuffix } from '@angular/compiler/src/aot/util';
import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController, RouterLinkDelegate } from '@ionic/angular';
import { stringify } from 'querystring';
import { Program } from '../Model/Program';
import { ProgramServService } from '../program-serv.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  private theProgram: Array<Program>;
  private totalSeconds: number = 0;
  private totalSecondsWork: number = 0;
  private totalSecondsPause: number = 0;
  private currentTimeMsgStr: string;
  private totalMin: number;
  private totalSec: number;
  private totalMinWork: number;
  private totalSecWork: number;
  private totalMinPause: number;
  private totalSecPause: number;

  private state: number = 0;
  private lineState: number = 0;
  private lineNumber: number = 0;
  private currentLine: Program;
  private btStatus: number = 0;
  private timerHandle;

  private dispBluetooth;
  
  
  constructor(private aProgram: ProgramServService, private alertStart: AlertController, private aBluetooh: BluetoothSerial) {

    this.currentLine = new Program();

  }
  

  public ngOnInit() {
    this.theProgram = this.aProgram.ReadProgram(); 
  }

  onClickRound() {
    let line = new Program();

    line.type = "ROUND";
    line.timeRoundMin = 0;
    line.timeRoundSec = 10;
    line.timeRounds = 10;
    line.roundsCount = 5;
    line.timePauseMin = 0;
    line.timePauseSec = 5;
    line.timePause = 5;

    this.aProgram.AddLine(line);

    this.calcSeconds();

    this.ngOnInit();
  }

  onClickTimer() {
    let line = new Program();

    line.type = "TIMER";
    line.timeRoundMin = 0;
    line.timeRoundSec = 10;
    line.timeRounds = 10;
    line.roundsCount = 0;
    line.timePauseMin = 0;
    line.timePauseSec = 0;
    line.timeMacroPauseMin = 0;
    line.timeMacroPauseSec = 0;
    line.tabataRoundsCount = 0;

    this.aProgram.AddLine(line);

    this.calcSeconds();

    this.ngOnInit();
  }

  onClickPause() {
    let line = new Program();

    line.type = "PAUSE";
    line.timeRoundMin = 0;
    line.timeRoundSec = 0;
    line.roundsCount = 0;
    line.timePauseMin = 0;
    line.timePauseSec = 10;
    line.timePause = 10;
    line.timeMacroPauseMin = 0;
    line.timeMacroPauseSec = 0;
    line.tabataRoundsCount = 0;

    this.aProgram.AddLine(line);

    this.calcSeconds();

    this.ngOnInit();
  }


  onClickTabata() {
    let line = new Program();

    line.roundsCount = 5;
    line.type = "TABATA";
    line.timeRoundMin = 0;
    line.timeRoundSec = 50;
    line.timeRounds = 50;
    line.timePauseMin = 0;
    line.timePauseSec = 10;
    line.timePause = 10;
    line.timeMacroPauseMin = 0;
    line.timeMacroPauseSec = 10;
    line.timeMacroPause = 10;
    line.tabataRoundsCount = 2;

    this.aProgram.AddLine(line);

    this.calcSeconds();

    this.ngOnInit();
  }

  onClickDelete(line: Program) {
    if (this.state != 0)
      return;

    this.aProgram.DeleteLine(line);

    this.calcSeconds();

    this.ngOnInit();
    
  }

  onClickUp(line: Program) {
    if (this.state != 0)
      return;
    
    this.aProgram.MoveUp(line);

    this.ngOnInit();
  }

  onClickDown(line: Program) {
    if (this.state != 0)
      return;
    this.aProgram.MoveDown(line);

    this.ngOnInit();
  }

  onChangeTime(line: Program) {
    line.timeRoundMin += Math.floor(line.timeRoundSec / 60);
    if (line.timeRoundMin > 99)
      line.timeRoundMin = 99;
    line.timeRoundSec = line.timeRoundSec % 60;
    line.timeRounds = line.timeRoundMin * 60 + line.timeRoundSec;
    if (line.roundsCount > 99)
      line.roundsCount = 99;
    line.timePauseMin += Math.floor(line.timePauseSec / 60);
    if (line.timePauseMin > 99)
      line.timePauseMin = 99;
    line.timePauseSec = line.timePauseSec % 60;
    line.timePause = line.timePauseMin * 60 + line.timePauseSec;
    line.timeMacroPauseMin += Math.floor(line.timeMacroPauseSec / 60);
    if (line.timeMacroPauseMin > 99)
      line.timeRoundMin = 99;
    line.timeMacroPauseSec = line.timeMacroPauseSec % 60;
    line.timeMacroPause = line.timeMacroPauseMin * 60 + line.timeMacroPauseSec;
    if (line.tabataRoundsCount > 99)
      line.tabataRoundsCount = 99;
    
    this.calcSeconds();

    //this.ngOnInit();
  }

  onClickStart() {
    if (this.totalSecondsWork == 0) {
      this.presentAlert();
      return;
    }

    if (this.state == 0) {
      this.currentLine.timeRounds = this.theProgram[this.lineNumber].timeRounds;
      this.currentLine.roundsCount = this.theProgram[this.lineNumber].roundsCount;
      this.currentLine.timePause = this.theProgram[this.lineNumber].timePause;
      this.currentLine.timeMacroPause = this.theProgram[this.lineNumber].timeMacroPause;
      this.currentLine.tabataRoundsCount = this.theProgram[this.lineNumber].tabataRoundsCount;

      this.currentTimeMsgStr = this.TimeMsgToString(this.theProgram[this.lineNumber].timeRounds, this.theProgram[this.lineNumber].roundsCount);
      if(this.theProgram[this.lineNumber].type == "TABATA")
        this.currentTimeMsgStr = "w" + this.currentTimeMsgStr;
      else
        this.currentTimeMsgStr = "W" + this.currentTimeMsgStr;
      
      if (this.btStatus == 2)
        this.WriteMessage(this.currentTimeMsgStr);
    }


    this.state = 1;
    this.timerHandle = setInterval(() => {
      if (this.theProgram[this.lineNumber].type == "ROUND") {
        if (this.lineState == 0) {
          this.totalSecondsWork--;
          this.theProgram[this.lineNumber].timeRounds--;
          if (this.theProgram[this.lineNumber].timeRounds == 0) {
            this.theProgram[this.lineNumber].roundsCount--;
            if (this.theProgram[this.lineNumber].roundsCount == 0) {
              this.lineState = 2;
            }
            else {
              this.lineState = 1;
              this.theProgram[this.lineNumber].timeRounds = this.currentLine.timeRounds;
              if (this.theProgram[this.lineNumber].timePause == 0) {
                this.lineState = 0;
              }
            }
          }
        }
        else {
          this.totalSecondsPause--;
          this.theProgram[this.lineNumber].timePause--;
          if (this.theProgram[this.lineNumber].timePause == 0) {
            this.lineState = 0;
            this.theProgram[this.lineNumber].timePause = this.currentLine.timePause;
          }
        }
      }  
      if (this.theProgram[this.lineNumber].type == "TIMER") {
        this.totalSecondsWork--;
        this.theProgram[this.lineNumber].timeRounds--;
        if (this.theProgram[this.lineNumber].timeRounds == 0) {
          this.lineState = 2;
        }
      }

      if (this.theProgram[this.lineNumber].type == "PAUSE") {
        this.totalSecondsPause--;
        this.theProgram[this.lineNumber].timePause--;
        if (this.theProgram[this.lineNumber].timePause == 0) {
          this.lineState = 2;
        }
      }
      if (this.theProgram[this.lineNumber].type == "TABATA") {
        if (this.lineState == 0) {
          this.totalSecondsWork--;
          this.theProgram[this.lineNumber].timeRounds--;
          if (this.theProgram[this.lineNumber].timeRounds == 0) {
            this.theProgram[this.lineNumber].roundsCount--;
            if (this.theProgram[this.lineNumber].roundsCount == 0) {
              this.theProgram[this.lineNumber].tabataRoundsCount--;
              if(this.theProgram[this.lineNumber].tabataRoundsCount == 0)
                this.lineState = 2;
              else {
                this.lineState = 3;
                this.theProgram[this.lineNumber].timeRounds = this.currentLine.timeRounds;
                this.theProgram[this.lineNumber].roundsCount = this.currentLine.roundsCount;
                this.theProgram[this.lineNumber].timeMacroPause = this.currentLine.timeMacroPause;
                if (this.theProgram[this.lineNumber].timeMacroPause == 0)
                  this.lineState = 0;
              }
            }
            else {
              this.lineState = 1;
              this.theProgram[this.lineNumber].timeRounds = this.currentLine.timeRounds;
              if (this.theProgram[this.lineNumber].timePause == 0) {
                this.lineState = 0;
              }
            }
          }
        }
        else {
          this.totalSecondsPause--;
          if (this.lineState == 1) {
            this.theProgram[this.lineNumber].timePause--;
              if (this.theProgram[this.lineNumber].timePause == 0) {
              this.lineState = 0;
              this.theProgram[this.lineNumber].timePause = this.currentLine.timePause;
            }
          }
          else {
            this.theProgram[this.lineNumber].timeMacroPause--;
            if (this.theProgram[this.lineNumber].timeMacroPause == 0) {
              this.lineState = 0;
              this.theProgram[this.lineNumber].timeMacroPause = this.currentLine.timeMacroPause;
            }
          }
        }
      }  

      this.totalSeconds--;
      if (this.totalSeconds == 0) {
        this.state = 0;
        this.theProgram[this.lineNumber].timeRounds = this.currentLine.timeRounds;
        this.theProgram[this.lineNumber].roundsCount = this.currentLine.roundsCount;
        this.theProgram[this.lineNumber].timePause = this.currentLine.timePause;
        this.theProgram[this.lineNumber].timeMacroPause = this.currentLine.timeMacroPause;
        this.theProgram[this.lineNumber].tabataRoundsCount = this.currentLine.tabataRoundsCount;
        this.theProgram[this.lineNumber].timeRoundMin = Math.floor(this.theProgram[this.lineNumber].timeRounds / 60); 
        this.theProgram[this.lineNumber].timeRoundSec = this.theProgram[this.lineNumber].timeRounds % 60; 
        this.theProgram[this.lineNumber].timePauseMin = Math.floor(this.theProgram[this.lineNumber].timePause / 60); 
        this.theProgram[this.lineNumber].timePauseSec = this.theProgram[this.lineNumber].timePause % 60; 
        this.theProgram[this.lineNumber].timeMacroPauseMin = Math.floor(this.theProgram[this.lineNumber].timeMacroPause / 60); 
        this.theProgram[this.lineNumber].timeMacroPauseSec = this.theProgram[this.lineNumber].timeMacroPause % 60; 
        this.calcSeconds();
        this.lineState = 0;
        this.lineNumber = 0;

        if(this.btStatus == 2)
          this.WriteMessage("STOP");

        clearInterval(this.timerHandle);
      }

      while (this.lineState == 2) {
        this.theProgram[this.lineNumber].timeRounds = this.currentLine.timeRounds;
        this.theProgram[this.lineNumber].roundsCount = this.currentLine.roundsCount;
        this.theProgram[this.lineNumber].timePause = this.currentLine.timePause;
        this.theProgram[this.lineNumber].timeMacroPause = this.currentLine.timeMacroPause;
        this.theProgram[this.lineNumber].tabataRoundsCount = this.currentLine.tabataRoundsCount;
        this.theProgram[this.lineNumber].timeRoundMin = Math.floor(this.theProgram[this.lineNumber].timeRounds / 60); 
        this.theProgram[this.lineNumber].timeRoundSec = this.theProgram[this.lineNumber].timeRounds % 60; 
        this.theProgram[this.lineNumber].timePauseMin = Math.floor(this.theProgram[this.lineNumber].timePause / 60); 
        this.theProgram[this.lineNumber].timePauseSec = this.theProgram[this.lineNumber].timePause % 60; 
        this.theProgram[this.lineNumber].timeMacroPauseMin = Math.floor(this.theProgram[this.lineNumber].timeMacroPause / 60); 
        this.theProgram[this.lineNumber].timeMacroPauseSec = this.theProgram[this.lineNumber].timeMacroPause % 60; 
        this.lineNumber++;
        if (this.lineNumber == this.theProgram.length) {
          this.lineState = 0;
          this.state = 0;
          this.lineNumber = 0;
          this.calcSeconds();

          if(this.btStatus == 2)
            this.WriteMessage("STOP");

          clearInterval(this.timerHandle);
        }
        else {
          this.currentLine.timeRounds = this.theProgram[this.lineNumber].timeRounds;
          this.currentLine.roundsCount = this.theProgram[this.lineNumber].roundsCount;
          this.currentLine.timePause = this.theProgram[this.lineNumber].timePause;
          this.currentLine.timeMacroPause = this.theProgram[this.lineNumber].timeMacroPause;
          this.currentLine.tabataRoundsCount = this.theProgram[this.lineNumber].tabataRoundsCount;
          if (this.theProgram[this.lineNumber].type == "PAUSE") {
            if (this.theProgram[this.lineNumber].timePause != 0)
              this.lineState = 1;
          }
          else {
            if (this.theProgram[this.lineNumber].timeRounds != 0)
              this.lineState = 0;
          }
        }
      }

      this.theProgram[this.lineNumber].timeRoundMin = Math.floor(this.theProgram[this.lineNumber].timeRounds / 60); 
      this.theProgram[this.lineNumber].timeRoundSec = this.theProgram[this.lineNumber].timeRounds % 60; 
      this.theProgram[this.lineNumber].timePauseMin = Math.floor(this.theProgram[this.lineNumber].timePause / 60); 
      this.theProgram[this.lineNumber].timePauseSec = this.theProgram[this.lineNumber].timePause % 60; 
      this.theProgram[this.lineNumber].timeMacroPauseMin = Math.floor(this.theProgram[this.lineNumber].timeMacroPause / 60); 
      this.theProgram[this.lineNumber].timeMacroPauseSec = this.theProgram[this.lineNumber].timeMacroPause % 60; 

      this.totalMin = Math.floor(this.totalSeconds / 60);
      this.totalSec = this.totalSeconds % 60;
      this.totalMinWork = Math.floor(this.totalSecondsWork / 60);
      this.totalSecWork = this.totalSecondsWork % 60;
      this.totalMinPause = Math.floor(this.totalSecondsPause / 60);
      this.totalSecPause = this.totalSecondsPause % 60;

      if (this.lineState == 0) {
        this.currentTimeMsgStr = this.TimeMsgToString(this.theProgram[this.lineNumber].timeRounds, this.theProgram[this.lineNumber].roundsCount);
        if (this.theProgram[this.lineNumber].type == "TABATA")
          this.currentTimeMsgStr = "w" + this.currentTimeMsgStr;
        if (this.theProgram[this.lineNumber].type == "ROUND")  
          this.currentTimeMsgStr = "R" + this.currentTimeMsgStr;
        if (this.theProgram[this.lineNumber].type == "TIMER")  
          this.currentTimeMsgStr = "T" + this.currentTimeMsgStr;
      }
      if (this.lineState == 1) {
        this.currentTimeMsgStr = this.TimeMsgToString(this.theProgram[this.lineNumber].timePause, this.theProgram[this.lineNumber].roundsCount);
        if (this.theProgram[this.lineNumber].type == "TABATA")
          this.currentTimeMsgStr = "p" + this.currentTimeMsgStr;
        if (this.theProgram[this.lineNumber].type == "ROUND")  
          this.currentTimeMsgStr = "r" + this.currentTimeMsgStr;
        if (this.theProgram[this.lineNumber].type == "PAUSE")  
          this.currentTimeMsgStr = "P" + this.currentTimeMsgStr;
      }
      if (this.lineState == 3) {
        this.currentTimeMsgStr = this.TimeMsgToString(this.theProgram[this.lineNumber].timeMacroPause, this.theProgram[this.lineNumber].tabataRoundsCount);
        this.currentTimeMsgStr = "m" + this.currentTimeMsgStr;
      }

      if (this.btStatus==2 && this.state!=0) 
        this.WriteMessage(this.currentTimeMsgStr);

    }, 1000);
  }

  async presentAlert() {
    const alert = await this.alertStart.create({
      header: 'ERROR',
      message: 'NOT WORKING TIME.',
      buttons: ['OK']
    });
  
    await alert.present();
  }

  onClickStop() {
    if (this.state == 0)
      return;
    
    clearInterval(this.timerHandle);
    this.state = 2;
  }

  onClickReset() {
    if (this.state != 2)
      return;
    this.state = 0;
    this.theProgram[this.lineNumber].timeRounds = this.currentLine.timeRounds;
    this.theProgram[this.lineNumber].roundsCount = this.currentLine.roundsCount;
    this.theProgram[this.lineNumber].timePause = this.currentLine.timePause;
    this.theProgram[this.lineNumber].timeMacroPause = this.currentLine.timeMacroPause;
    this.theProgram[this.lineNumber].tabataRoundsCount = this.currentLine.tabataRoundsCount;
    this.theProgram[this.lineNumber].timeRoundMin = Math.floor(this.theProgram[this.lineNumber].timeRounds / 60); 
    this.theProgram[this.lineNumber].timeRoundSec = this.theProgram[this.lineNumber].timeRounds % 60; 
    this.theProgram[this.lineNumber].timePauseMin = Math.floor(this.theProgram[this.lineNumber].timePause / 60); 
    this.theProgram[this.lineNumber].timePauseSec = this.theProgram[this.lineNumber].timePause % 60; 
    this.theProgram[this.lineNumber].timeMacroPauseMin = Math.floor(this.theProgram[this.lineNumber].timeMacroPause / 60); 
    this.theProgram[this.lineNumber].timeMacroPauseSec = this.theProgram[this.lineNumber].timeMacroPause % 60; 
    this.lineNumber = 0;
    this.calcSeconds();
  }


  calcSeconds() {
    this.totalSeconds = this.aProgram.GetTotalSeconds();
    this.totalMin = Math.floor(this.totalSeconds / 60);
    this.totalSec = this.totalSeconds % 60;
    this.totalSecondsWork = this.aProgram.GetTotalSecondsWork();
    this.totalMinWork = Math.floor(this.totalSecondsWork / 60);
    this.totalSecWork = this.totalSecondsWork % 60;
    this.totalSecondsPause = this.aProgram.GetTotalSecondsPause();
    this.totalMinPause = Math.floor(this.totalSecondsPause / 60);
    this.totalSecPause = this.totalSecondsPause % 60;
  }

  async onClickDiscover() {
    if (this.btStatus == 0) {
      this.btStatus = 1;
      try {
        let respuesta = await this.aBluetooh.isEnabled();
        this.dispBluetooth = await this.aBluetooh.list();
      } catch (e) {
        this.btStatus = 0;
        alert(e);
      }
    }
    else {
      this.aBluetooh.disconnect();
      alert("Device DISCONNECTED");
      this.btStatus = 0;
    }


  }

  onClickConnect(address) {
    this.btStatus = 0;
    this.aBluetooh.connect(address).subscribe(res => {
      alert("Device CONNECTED");
      this.btStatus = 2;
      this.ngOnInit();
    }, error => {
        alert(error);
    });
  }

  onClickWrite() {
    this.WriteMessage("TEST");
  }

  WriteMessage(amsg: string) {
    let msg: string;
    
    if (this.btStatus == 2) {
      msg = "+&DBG" + amsg + "\n";
      this.aBluetooh.write(msg);
    }
    else
      alert("NO Device Connected");
  }

  TimeMsgToString(time: number, round: number) {
    let strTime: string;
    let strValue: string;

    strValue = Math.floor(time / 60).toString(10);
    if (strValue.length == 1)
      strValue = "0" + strValue;
    strTime = strValue;
      strValue = (time % 60).toString(10);
    if (strValue.length == 1)
      strValue = "0" + strValue;
    strTime = strTime + strValue;
    strValue = round.toString(10);
    if (strValue.length == 1)
      strValue = "0" + strValue;
    strTime = strTime + strValue;

    return strTime; 
  }

}
