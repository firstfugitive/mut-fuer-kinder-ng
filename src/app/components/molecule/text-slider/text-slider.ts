import { Component, input, ViewEncapsulation } from '@angular/core';
import { SliderProperties } from '../../../models/slider-properties';

@Component({
  selector: 'app-text-slider',
  imports: [],
  templateUrl: './text-slider.html',
  styleUrl: './text-slider.scss',
  encapsulation: ViewEncapsulation.None
})
export class TextSlider {
  sliderProperties = input.required<SliderProperties>();
}
