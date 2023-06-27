import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AudioService } from './audio.service';
import { ButtonPlayComponent } from './button-play.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  playing = false;
  @ViewChild('audio') audio: ElementRef;

  @ViewChild(ButtonPlayComponent)
  private buttonPlay: ButtonPlayComponent;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private audioService: AudioService
  ) {}

  public triggerButtonPlay: 'start' | 'stop';
  onStartButtonPlay() {
    console.log('onStart');
    this.playing = true;
    // this.audio.nativeElement.play();
    this.audioService.playMusic(this.audio.nativeElement);
  }
  onPauseButtonPlay() {
    console.log('onPause');
    this.playing = false;
    // this.audio.nativeElement.pause();
    this.audioService.pauseMusic(this.audio.nativeElement);
  }
  onDoneButtonPlay() {
    // this.buttonPlay.play();
  }
}
