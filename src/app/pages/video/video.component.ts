import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import * as faceapi from 'face-api.js';
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent implements OnInit, OnDestroy {
  @ViewChild('videoEl', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;
  modelsLoaded = false;
  recording = false;
  message = '';
  recordedVideoURL: string | null = null;
  isPlaying = false;
  progress = 0; // 0..1

  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private detectionIntervalId: any = null;

  constructor(private cd: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.loadModels();
    if (this.modelsLoaded) {
      this.startCameraStream();
    }
  }

  ngOnDestroy() {
    this.stopDetectionInterval();
    this.stopMediaRecorderIfActive();
    this.stopCameraTracks();
    // revoke blob URL
    if (this.recordedVideoURL) {
      URL.revokeObjectURL(this.recordedVideoURL);
    }
  }

  // --------------------------
  // مدل‌ها
  // --------------------------
  private async loadModels() {
    const MODEL_URL = '/models';
    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
      ]);
      this.modelsLoaded = true;
      this.message = '✅ مدل‌ها با موفقیت لود شدند.';
      this.cd.markForCheck();
    } catch (err) {
      console.error('خطا در لود مدل‌ها:', err);
      this.message = '❌ خطا در لود مدل‌ها. لطفاً صفحه را رفرش کنید.';
    }
  }

  // --------------------------
  // استریم دوربین
  // --------------------------
  private async startCameraStream(): Promise<MediaStream | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const video = this.videoRef.nativeElement;
      // اگر ویدیوی قبلی ضبط شده بود، پاکش کن
      if (this.recordedVideoURL) {
        URL.revokeObjectURL(this.recordedVideoURL);
        this.recordedVideoURL = null;
      }
      video.srcObject = stream;
      video.muted = this.recording; // هنگام ضبط میوت کن
      video.play().catch(() => {});
      this.cd.markForCheck();
      return stream;
    } catch (err) {
      console.error('خطا در دسترسی به دوربین و میکروفن:', err);
      this.message = '❌ دسترسی به دوربین و میکروفن رد شد.';
      return null;
    }
  }

  private stopCameraTracks() {
    const video = this.videoRef?.nativeElement;
    if (video && video.srcObject) {
      const s = video.srcObject as MediaStream;
      s.getTracks().forEach(t => t.stop());
      video.srcObject = null;
    }
  }

  // --------------------------
  // تشخیص چهره
  // --------------------------
  private async detectFace() {
    if (!this.modelsLoaded) return;
    const video = this.videoRef?.nativeElement;
    if (!video) return;
    if (video.paused || video.ended) return;
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    if (displaySize.width === 0 || displaySize.height === 0) return;

    try {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks();

      if (!detection) {
        this.message = '❌ چهره‌ای تشخیص داده نشد. لطفاً در مرکز کادر قرار بگیرید.';
        this.cd.markForCheck();
        return;
      }

      const landmarks = detection.landmarks;
      const box = detection.detection.box;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      const isFaceTooSmall = box.width < videoWidth * 0.3 || box.height < videoHeight * 0.4;
      const isFaceOutOfFrame =
        box.x < 20 ||
        box.y < 20 ||
        box.x + box.width > videoWidth - 20 ||
        box.y + box.height > videoHeight - 20;

      if (isFaceTooSmall || isFaceOutOfFrame) {
        this.message = '❌ لطفاً صورت را کامل و در مرکز کادر قرار دهید.';
        this.cd.markForCheck();
        return;
      }

      // بررسی پوشیدگی دهان
      const mouth = landmarks.getMouth();
      const jaw = landmarks.getJawOutline();
      const faceWidth = Math.abs(jaw[16].x - jaw[0].x);
      const mouthWidth = Math.abs(mouth[6].x - mouth[0].x);
      const mouthHeight = Math.abs(mouth[3].y - mouth[9].y);

      if (mouthWidth < faceWidth * 0.2 || mouthHeight < faceWidth * 0.05) {
        this.message = '❌ بخشی از صورت یا دهان پوشیده شده است.';
        this.cd.markForCheck();
        return;
      }

      // همه چیز اوکی
      this.message = '✅ چهره شما کامل و واضح شناسایی شد.';
      this.cd.markForCheck();
    } catch (err) {
      console.error('خطا در تشخیص چهره:', err);
    }
  }

  // --------------------------
  // ضبط و MediaRecorder
  // --------------------------
  async startRecording() {
    // اگر ویدئوی قبلی وجود داشت، دوباره استریم دوربین رو فعال کن
    if (this.recordedVideoURL || !this.videoRef.nativeElement.srcObject) {
      const stream = await this.startCameraStream();
      if (!stream) return;
    }

    this.recordedChunks = [];
    let options: MediaRecorderOptions = { mimeType: 'video/webm; codecs=vp9' };
    try {
      this.mediaRecorder = new MediaRecorder(this.videoRef.nativeElement.srcObject as MediaStream, options);
    } catch (e) {
      console.warn('گزینه mimeType پشتیبانی نشد، تلاش با تنظیمات پیش‌فرض:', e);
      this.mediaRecorder = new MediaRecorder(this.videoRef.nativeElement.srcObject as MediaStream);
    }

    this.mediaRecorder.ondataavailable = (ev: BlobEvent) => {
      if (ev.data && ev.data.size > 0) {
        this.recordedChunks.push(ev.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      this.recordedVideoURL = url;

      // بستن استریم دوربین هنگام توقف ضبط
      this.stopCameraTracks();

      // ست کردن ویدیو به حالت بازپخش
      const video = this.videoRef.nativeElement;
      video.srcObject = null;
      video.src = this.recordedVideoURL;
      video.muted = false;
      video.load();
      this.cd.markForCheck();
    };

    this.mediaRecorder.start();
    this.startDetectionInterval();
    this.recording = true;
    this.message = '🔴 ضبط و تشخیص فعال است.';
    // video should be muted while recording (not playing audio back)
    this.videoRef.nativeElement.muted = true;
    this.cd.markForCheck();
  }

  stopRecording() {
    this.stopMediaRecorderIfActive();
    this.stopDetectionInterval();
    this.recording = false;
    this.message = '⏹ ضبط متوقف شد.';
    this.cd.markForCheck();
    // unmute video after stop (playback will have audio)
    try {
      this.videoRef.nativeElement.muted = false;
    } catch {}
  }

  toggleRecording() {
    if (this.recording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  private stopMediaRecorderIfActive() {
    try {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    } catch (err) {
      console.warn('خطا در توقف MediaRecorder:', err);
    }
  }

  // --------------------------
  // interval مدیریت
  // --------------------------
  private startDetectionInterval() {
    this.stopDetectionInterval();
    this.detectionIntervalId = setInterval(() => {
      this.detectFace();
    }, 500);
  }

  private stopDetectionInterval() {
    if (this.detectionIntervalId) {
      clearInterval(this.detectionIntervalId);
      this.detectionIntervalId = null;
    }
  }

  // --------------------------
  // کنترل پخش و نوار زمان
  // --------------------------
  handlePlaybackClick() {
    const video = this.videoRef.nativeElement;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
    this.cd.markForCheck();
  }

  onTimeUpdate() {
    const video = this.videoRef.nativeElement;
    if (!video) return;
    const current = video.currentTime || 0;
    const duration = video.duration || 0;
    if (duration > 0) {
      this.progress = current / duration;
      this.cd.markForCheck();
    }
  }

  onProgressBarClick(event: MouseEvent) {
    const container = event.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const video = this.videoRef.nativeElement;
    if (!video || !video.duration) return;
    const newTime = (clickX / rect.width) * video.duration;
    video.currentTime = newTime;
  }
}
