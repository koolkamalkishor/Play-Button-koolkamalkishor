import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { AnimationBuilder, AnimationMetadata, AnimationPlayer, style, animate, keyframes } from '@angular/animations';

const template = `
  <div class="yt_button_play"
    [style.width]="size + 'px'"
    [style.height]="size + 'px'"
    (click)="toggleState()"
  >
    <svg class="yt_button_play_circle_container"
      viewBox="0 0 50 50"
      [attr.width]="size + 'px'"
      [attr.height]="size + 'px'"
    >
      <circle class="progress"
        [attr.fill]="backgroundColor"
        [attr.stroke]="highlight"
      >
      </circle>

      <path class="indicator path1"
        [class]="indicatorMode"
        d="M 28 35 L 28 15 A 4 4 0 0 0 20 15 L 20 34 L 34 25 L 20 16 L 20 34"
      ></path>
      <path class="indicator path2"
        [class]="indicatorMode"
        d="M 22 15 L 22 35 A 3 3 0 0 0 28 35 L 28 15"
      ></path>

    </svg>
  </div>
`;

const styles = [`
  .yt_button_play{
    display: inline-block;
    cursor: pointer;
  }

  circle.progress{
    cx: 25px;
    cy: 25px;
    r: 23px;
    stroke-width: 0;
    transform: rotate(-90deg);
    transform-origin: center;
  }

  path.indicator{
    stroke:white;
    stroke-width: 2px;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: transparent;
  }

  path.indicator.animate{
    animation-duration: .35s;
    animation-timing-function: linear;
  }
  path.indicator.path1.pause{
    stroke-dasharray: 20 100;
    stroke-dashoffset: 0;
    animation-name: indicatorPause1;
  }
  path.indicator.path1.play{
    stroke-dasharray: 51 100;
    stroke-dashoffset: -51;
    animation-name: indicatorPlay1;
  }
  path.indicator.path2.pause{
    stroke-dasharray: 20 100;
    stroke-dashoffset: 0;
    opacity: 1;
    animation-name: indicatorPause2;
  }
  path.indicator.path2.play{
    stroke-dasharray: 0 100;
    stroke-dashoffset: -35;
    opacity: 0;
    animation-name: indicatorPlay2;
  }

  @keyframes indicatorPlay1{
    0%{   stroke-dasharray: 20 100; stroke-dashoffset: 0;   }
    100%{ stroke-dasharray: 55 100; stroke-dashoffset: -51; }
  }
  @keyframes indicatorPause1{
    0%{   stroke-dasharray: 55 100; stroke-dashoffset: -51; }
    100%{ stroke-dasharray: 20 100; stroke-dashoffset: 0;   }
  }

  @keyframes indicatorPlay2{
    0%{ stroke-dasharray: 20 100; stroke-dashoffset: 0; opacity: 1;}
    30%{ stroke-dasharray: 20 100; stroke-dashoffset: -35; opacity: 1; }
    40%{ stroke-dasharray: 0 100; stroke-dashoffset: -75; opacity: 0; }
    100%{ stroke-dasharray: 0 100; stroke-dashoffset: -75; opacity: 0; }
  }
  @keyframes indicatorPause2{
    0%{ stroke-dasharray: 0 100; stroke-dashoffset: -75; opacity: 0; }
    60%{ stroke-dasharray: 0 100; stroke-dashoffset: -75; opacity: 0; }
    100%{ stroke-dasharray: 20 100; stroke-dashoffset: 0; opacity: 1;}
  }
`];


@Component({
  selector: 'yt-button-play',
  template: template,
  styles:   styles,
})
export class ButtonPlayComponent implements OnInit {

  @Input() size: number = 50;
  @Input() backgroundColor: string = '#000000cc';
  @Input() highlight: string = 'white';

  @Input() duration: number = 8000;

  @Output() onStart = new EventEmitter<void>();
  @Output() onPause = new EventEmitter<void>();
  @Output() onDone  = new EventEmitter<void>();

  public indicatorMode: 'pause' | 'play' = 'play';

  private host: any;
  private player: AnimationPlayer;
  private state: 'start' | 'stop' = 'stop';

  constructor(
    el: ElementRef,
    private builder: AnimationBuilder
  ) { this.host = el.nativeElement; }

  ngOnInit(): void {
    this.setupAnimation();
  }

  public toggleState(nextState: 'start' | 'stop' = null){
    if(!nextState){ nextState = (this.state == 'stop')? 'start' : 'stop'; }

    if(nextState == 'start'){ this.play();  }
    else{                     this.pause(); }
  }

  public pause(){
    this.state = 'stop';
    this.indicatorMode = 'play';

    this.player.pause();
    this.onPause.emit();
  }

  public play(){
    this.host.querySelectorAll('.indicator').forEach((el: Element)=>{el.classList.add('animate'); })

    this.state = 'start';
    this.indicatorMode = 'pause';

    this.player.play();
    this.onStart.emit();
  }

  private finish(){
    this.state = 'stop';
    this.indicatorMode = 'play';

    this.player.destroy();
    this.setupAnimation();

    this.onDone.emit();
  }


  private setupAnimation(){
    var lenCircle = Math.ceil(46 * Math.PI);
    var animation: AnimationMetadata = animate(this.duration, keyframes([
      style({offset: 0, strokeDasharray: `0 ${lenCircle}`, r: 23, strokeWidth: 4}),
      style({offset: 1, strokeDasharray: `${lenCircle}, ${lenCircle}`, r: 23, strokeWidth: 4}),
    ]));
    var animationFactory = this.builder.build(animation);
    this.player = animationFactory.create(this.host.querySelector('.progress'));
    this.player.onDone(()=>{ this.finish(); });
  }

}
