import {
  Component,
  ElementRef,
  forwardRef,
  inject,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  private _renderer = inject(Renderer2);
  @ViewChild('input', { static: true }) _input!: ElementRef<HTMLInputElement>;

  // این دو تا متد رو Angular موقع bind کردن می‌سازه
  onChange: any = () => {};
  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(value: any): void {
    if (this._input) {
      this._renderer.setProperty(this._input.nativeElement, 'value', value ?? '');
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._input.nativeElement, 'disabled', isDisabled);
  }

  handleInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value); // تغییر مقدار در FormControl
  }

  handleBlur() {
    this.onTouch(); // موقع blur صدا زده بشه
  }
}
