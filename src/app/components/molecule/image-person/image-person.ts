import { Component, computed, input } from '@angular/core';
import { CfImagePerson } from '../../../models/contentful-content-types/image-person';
import { BaseImage } from '../../atom/base-image/base-image';
import { Asset } from 'contentful';

@Component({
  selector: 'app-image-person',
  imports: [BaseImage],
  template: '<app-base-image [image]="image()" [width]="150" [height]="150"/>',
  styles: `
  :host {
    text-align: center;
    width: 150px;
    height: 150px;
    position: relative;
    overflow: hidden;
    img {
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }
  }`,
  host: {
    class: "module"
  }
})
export class ImagePerson {
  data = input<CfImagePerson>();

  image = computed<Asset>(() => this.data()?.fields?.image);
}
