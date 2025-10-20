import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { CfSliderHalfSize } from '../../../models/contentful-content-types/slider-half-size';
import { Asset } from 'contentful';
import { Swiper } from 'swiper';
import { Navigation } from 'swiper/modules';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import { BaseImage } from "../../atom/base-image/base-image";

register();

@Component({
  selector: 'app-slider-half-size',
  imports: [BaseImage],
  templateUrl: './slider-half-size.html',
  styleUrl: './slider-half-size.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  host: {
    class: "module slider-half-size"
  }
})
export class SliderHalfSize {
  data = input<CfSliderHalfSize>();

  images = computed<Asset[]>(() => this.data()?.fields?.images);
  small = computed<boolean>(() => this.data()?.fields?.small);
}
