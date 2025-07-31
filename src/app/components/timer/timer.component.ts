import { CommonModule } from '@angular/common';
import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class TimerComponent implements OnInit, OnDestroy {
  inputMinutes = signal(1)
  currentTime = signal(new Date())
  startTime = signal<Date | null>(null)
  endTime = signal<Date | null>(null)
  remainingSeconds = signal(0)
  totalSeconds = signal(0)
  isPaused = signal(false)
  timerStarted = signal(false)
  showProgress = false

  private timerIntervalId: any
  private clockIntervalId: any
  private alertSound = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg')

  readonly displayTime = computed(() => {
    const total = this.remainingSeconds()
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${this.pad(m)}:${this.pad(s)}`
  })

  readonly progressPercent = computed(() => {
    const total = this.totalSeconds()
    const remaining = this.remainingSeconds()
    if (total === 0) return 0
    return ((total - remaining) / total) * 100
  })

  ngOnInit(): void {
    this.clockIntervalId = setInterval(() => {
      this.currentTime.set(new Date())
    }, 1000)
  }

  ngOnDestroy(): void {
    clearInterval(this.timerIntervalId)
    clearInterval(this.clockIntervalId)
  }

  startTimer(): void {
    clearInterval(this.timerIntervalId)

    const total = this.inputMinutes() * 60
    this.totalSeconds.set(total)
    this.remainingSeconds.set(total)
    this.startTime.set(this.currentTime())
    const start = this.startTime()
    if (start) {
      this.endTime.set(new Date(start.getTime() + total * 1000))
    } else {
      this.endTime.set(null)
    }
    this.timerStarted.set(true)
    this.isPaused.set(false)

    this.timerIntervalId = setInterval(() => this.tick(), 1000)
  }

  tick(): void {
    if (!this.isPaused() && this.remainingSeconds() > 0) {
      this.remainingSeconds.update(t => t - 1)
    }

    if (this.remainingSeconds() === 0) {
      this.stopTimer()
      this.playSound()
    }
  }

  togglePause(): void {
    this.isPaused.update(p => !p)
  }

  resetTimer(): void {
    this.stopTimer()
    this.inputMinutes.set(1)
    this.remainingSeconds.set(0)
    this.totalSeconds.set(0)
    this.startTime.set(null)
    this.endTime.set(null)
  }

  stopTimer(): void {
    clearInterval(this.timerIntervalId)
    this.timerStarted.set(false)
    this.isPaused.set(false)
    this.endTime.set(null)
  }

  playSound(): void {
    this.alertSound.play().catch(() => { })
  }

  pad(value: number): string {
    return value < 10 ? '0' + value : value.toString()
  }

  formatTime(date: Date | null): string {
    if (!date) return '--:--:--'
    return date.toLocaleTimeString('pt-BR', { hour12: false })
  }
}