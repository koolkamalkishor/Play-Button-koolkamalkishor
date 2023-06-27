import { Injectable } from '@angular/core';

@Injectable()
export class AudioService {
  constructor() {}

  playMusic(audioElement: HTMLAudioElement) {
    audioElement.play();
  }

  pauseMusic(audioElement: HTMLAudioElement) {
    audioElement.pause();
  }
}
