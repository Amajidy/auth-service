import {AfterViewInit, Component, ElementRef, signal, ViewChild} from '@angular/core';
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

  isSignDrawn = signal(false)

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    const scale = window.devicePixelRatio || 1;

    this.ctx = canvas.getContext('2d')!;
    this.ctx.scale(scale, scale);

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
    const scale = window.devicePixelRatio || 1;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.scale(scale, scale);
    this.isSignDrawn.set(false)
  }

  saveSignature() {
    const dataUrl = this.canvasRef.nativeElement.toDataURL('image/png');
    console.log('Signature Base64:', dataUrl);
    alert('✅ امضا با موفقیت ذخیره شد (مشاهده در Console مرورگر).');
  }

  private getCoordinates(event: MouseEvent | TouchEvent): { x: number; y: number } {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    if (event instanceof TouchEvent && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    }

    if (event instanceof MouseEvent) {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }

    return { x: 0, y: 0 };
  }
}
