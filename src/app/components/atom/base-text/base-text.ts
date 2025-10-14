import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-base-text',
  imports: [],
  templateUrl: './base-text.html',
  styleUrl: './base-text.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseText {
  @Input() text: string;
  @Input() align: string;
  @Input() big = false;
  @Input() headline = false;
  @Input() bold = false;
  @Input() gotham = false;
  @Input() htmlTag: string;

  get classes() {
    return {
      'base-text': true,
      'base-text--big': this.big,
      'base-text--headline': this.headline,
      'base-text--bold': this.bold,
      'base-text--gotham': this.gotham
    }
  }
}
