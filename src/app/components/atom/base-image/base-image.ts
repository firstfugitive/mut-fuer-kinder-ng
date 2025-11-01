import { Component, computed, input } from '@angular/core';
import { Asset } from 'contentful';
import { getImageUrl } from '../../shared/utils';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-base-image',
  imports: [MatCardModule],
  templateUrl: './base-image.html',
  styleUrl: './base-image.scss'
})
export class BaseImage {
  image = input<Asset>();
  width = input(0);
  height = input(0);
  lazyLoadDisabled = input(false);
  fullWidth = input(false);
  halfSize = input(false);
  smallSize = input(false);
  roundCorners = input(false);

  imageTitle = computed<string>(() => this.image()?.fields?.title?.toString());
  imageUrl = computed<string>(() => {
    const imageUrl = getImageUrl(this.image());
    let imageUrlProcessed = this.fullWidth() ? this.getContentfulUrl(imageUrl, this.fullSizeMd)
      : this.getContentfulUrl(imageUrl, this.standardSizeMd);
    if (this.smallSize()) {
      imageUrlProcessed = this.getContentfulUrl(imageUrl, this.smallSizeMd);
    }
    return imageUrlProcessed;
  });

  readonly fullSizeSm = 575;
  readonly fullSizeMd = 1023;
  readonly fullSizeLg = 1440;
  readonly fullSizeXl = 2500;

  readonly standardSizeSm = 575;
  readonly standardSizeMd = 720;
  readonly standardSizeLg = 1300;

  readonly smallSizeMd = 300;

  getContentfulUrl(imageUrl: string, width: number, height = undefined, isWebp = true) {
    return imageUrl ?
      `${imageUrl}?${width ? `w=${width}${width && height ? '&' : ''}` : ``}${height ? `h=${height}` : ``}${isWebp ? '&fm=webp' : ''}` : undefined;
  }

  
  sources = computed(() => {
    const imageUrlNoCf = getImageUrl(this.image());
    if (this.fullWidth()) {
      const sourceListFullSize = [
        {
          srcset: this.getContentfulUrl(imageUrlNoCf, this.fullSizeXl),
          media: `(min-width: 1440px)`
        },
        {
          srcset: this.getContentfulUrl(imageUrlNoCf, this.fullSizeLg),
          media: `(min-width: 1024px)`
        },
        {
          srcset: this.getContentfulUrl(imageUrlNoCf, this.fullSizeMd),
          media: `(max-width: 1023px)`
        },
        /* {
          srcset: this.getContentfulUrl(imageUrl, fullSizeSm),
          media: `(max-width: 575px)`
        } */
      ]
      return sourceListFullSize;
    }
    if (this.smallSize()) {
      const sourceListSmallSize = [
        {
          srcset: this.getContentfulUrl(imageUrlNoCf, this.smallSizeMd),
          media: undefined
        }
      ]
      return sourceListSmallSize;
    }

    const sourceListStandard = [
      {
        srcset: this.getContentfulUrl(imageUrlNoCf, this.standardSizeLg),
        media: `(min-width: 1440px)`
      },
      {
        srcset: this.getContentfulUrl(imageUrlNoCf, this.standardSizeMd),
        media: `(min-width: 1024px)`
      },
      {
        srcset: this.getContentfulUrl(imageUrlNoCf, this.standardSizeSm),
        media: `(max-width: 1023px)`
      }
    ]
    return sourceListStandard;
  });
}
