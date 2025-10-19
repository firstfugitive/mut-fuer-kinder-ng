import { ChangeDetectionStrategy, Component, computed, ElementRef, input, Input, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-base-text',
  imports: [NgTemplateOutlet],
  templateUrl: './base-text.html',
  styleUrl: './base-text.scss'
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
