import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import { CfImageHalfSize } from '../../../models/contentful-content-types/image-half-size';
import { Asset } from 'contentful';
import { BaseImage } from '../../atom/base-image/base-image';

@Component({
  selector: 'app-image-half-size',
  imports: [BaseImage],
  template: '<app-base-image class="image-half-size-image" [image]="image()" [width]="700" [smallSize]="small() ? true : false" [halfSize]="true" />',
  styles: '',
  host: {
    '[class]': "{'image-half-size': true, 'image-half-size--small': small()}",
  },
  encapsulation: ViewEncapsulation.None
})
export class ImageHalfSize {
  data = input<CfImageHalfSize>();

  image = computed<Asset>(() => this.data()?.fields?.image);
  small = computed<boolean>(() => this.data()?.fields?.small);
}
