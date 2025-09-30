import {AfterViewInit, Component, ElementRef, signal, ViewChild, HostListener} from '@angular/core';
import {ButtonComponent} from "../../../components/button/button.component";

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.scss'
})
export class SignComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private scale = window.devicePixelRatio || 1; // برای نگهداری مقیاس DPI

  isSignDrawn = signal(false);

  // اگر ابعاد مرورگر تغییر کند، Canvas باید مجدداً تنظیم شود تا آفست ایجاد نشود
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // باید Canvas را دوباره تنظیم کرده و محتویات را پاک کنیم
    this.setupCanvas();
    this.isSignDrawn.set(false);
  }

  ngAfterViewInit() {
    // تنظیم اولیه Canvas
    this.setupCanvas();
  }

  /**
   * تنظیم رزولوشن داخلی Canvas بر اساس ابعاد CSS و DPI دستگاه
   * این تابع هسته اصلی حل مشکل آفست است.
   */
  private setupCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.scale = window.devicePixelRatio || 1;

    // 1. دریافت ابعاد CSS رندر شده از المان
    const rect = canvas.getBoundingClientRect();
    const cssWidth = rect.width;
    const cssHeight = rect.height;

    // 2. تنظیم رزولوشن داخلی (width/height attribute) بر اساس ابعاد CSS * مقیاس DPI
    canvas.width = cssWidth * this.scale;
    canvas.height = cssHeight * this.scale;

    this.ctx = canvas.getContext('2d')!;

    // 3. مقیاس‌دهی مجدد Context:
    // با این کار، توابع ترسیم (moveTo, lineTo) همچنان از مختصات CSS (پیکسل‌های منطقی) استفاده می‌کنند،
    // اما Context با رزولوشن بالای دستگاه ترسیم می‌کند.
    this.ctx.scale(this.scale, this.scale);

    // اعمال مجدد تنظیمات ترسیم
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    this.isSignDrawn.set(true);
    event.preventDefault();
    const { x, y } = this.getCoordinates(event);
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.isDrawing = true;
  }

  draw(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    if (!this.isDrawing) return;
    const { x, y } = this.getCoordinates(event);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  stopDrawing() {
    this.ctx.closePath();
    this.isDrawing = false;
  }

  clearCanvas() {
    const canvas = this.canvasRef.nativeElement;

    // بازنشانی Transform برای پاکسازی کل بافر داخلی
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // اعمال مجدد مقیاس و تنظیمات
    this.ctx.scale(this.scale, this.scale);
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;

    this.isSignDrawn.set(false)
  }

  saveSignature() {
    const dataUrl = this.canvasRef.nativeElement.toDataURL('image/png');
    console.log('Signature Base64:', dataUrl);
    // هشدار (alert) طبق دستورالعمل‌ها حذف و با پیام Console جایگزین شد.
    console.log('✅ امضا با موفقیت ذخیره شد (مشاهده در Console مرورگر).');
  }

  private getCoordinates(event: MouseEvent | TouchEvent): { x: number; y: number } {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    let clientX: number, clientY: number;

    if (event instanceof TouchEvent && event.touches.length > 0) {
      // استفاده از اولین نقطه لمس
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if (event instanceof MouseEvent) {
      // استفاده از نقطه مکان‌نما
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return { x: 0, y: 0 };
    }

    // محاسبه مختصات نسبت به گوشه بالا و سمت چپ Canvas در واحدهای CSS (پیکسل‌های منطقی).
    // این مختصات صحیح هستند زیرا Context از قبل با scale مقیاس‌دهی شده است.
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }
}
