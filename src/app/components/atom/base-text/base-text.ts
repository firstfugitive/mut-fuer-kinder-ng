import { ChangeDetectionStrategy, Component, computed, input, Input, signal } from '@angular/core';

@Component({
  selector: 'app-base-text',
  imports: [],
  templateUrl: './base-text.html',
  styleUrl: './base-text.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseText {
  text = input.required<string>();
  align = input("");
  big = input(false);
  headline = input(false);
  bold = input(false);
  gotham = input(false);
  htmlTag = input("");

  classes = computed(() => ({
      'base-text': true,
      'base-text--big': this.big(),
      'base-text--headline': this.headline(),
      'base-text--bold': this.bold(),
      'base-text--gotham': this.gotham()
  }))
}
