import { AfterViewInit, Component, computed, ElementRef, inject, input, PLATFORM_ID, viewChild } from '@angular/core';
import { PageContent } from '../page-content';
import { PageFooter } from "../../components/organism/page-footer/page-footer";
import { CfPageContentBlog } from '../../models/contentful-content-types/page-content';
import { PageHeader } from '../../components/organism/page-header/page-header';
import { Asset } from 'contentful';
import { isPlatformBrowser, NgComponentOutlet, NgOptimizedImage } from '@angular/common';
import { formatDate, getImageUrl } from '../../components/shared/utils';

@Component({
  selector: 'app-page-content-blog',
  imports: [PageFooter, PageHeader, NgComponentOutlet, NgOptimizedImage],
  templateUrl: './page-content-blog.html',
  styles: `
    @use "../../styles/placeholder.scss" as *;

    :host {
      @extend %heroImage;
      @extend %heroTextContainer;
    }
  `
})
export class PageContentBlog extends PageContent implements AfterViewInit {
  override pageContent = input<CfPageContentBlog>();

  heroImage = computed<Asset>(() => this.pageContent()?.fields?.image);
  heroImageSrc = computed<string>(() => getImageUrl(this.heroImage()));
  heroImageTitle = computed<string>(() => this.heroImage()?.fields?.title.toString());
  title = computed<string>(() => this.pageContent()?.fields?.title);
  creationDate = computed<string>(() => formatDate(this.pageContent()?.fields?.creationDate?.toString()));
  hideCreationDate = computed<boolean>(() => this.pageContent()?.fields?.hideCreationDate);
  events = computed(() => this.pageContent()?.fields?.events);

  mapElementRef = viewChild<ElementRef>('map');
  private map: any;

  private platformId: Object = inject(PLATFORM_ID);

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.events()) {
      return;
    }

    const leaflet = await import('leaflet');
    this.map = leaflet.map(this.mapElementRef().nativeElement).setView([51.3, 10.1], 6);
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    if(this.events()) {

      this.events()?.forEach(async event => {

        //todo check if possible via leaflet?
        const address = await reverseGeocode(event.fields?.location?.lat || 0, event.fields?.location?.lon || 0);
        
        const street = address.road || address.pedestrian || address.cycleway || 'Straße unbekannt';
        const house = address.house_number ? ` ${address.house_number}` : '';
        const postcode = address.postcode ? ` ${address.postcode}` : '';
        const village = address.village ? ` ${address.village}` : '';

        leaflet.marker([event.fields?.location?.lat || 0, event.fields?.location?.lon || 0]).addTo(this.map)
          .bindPopup(`
            <br>${event.fields?.locationName}<br>
            ${formatDate(event.fields?.date?.toString())}
            <br>${event.fields?.contactDetails}<br>
            <a href="${event.fields?.link}" target="_blank">Mehr Informationen</a>
            <br>📍 ${street} ${house}, ${postcode || ''} ${village || ''}
            `);
      });
    }
  }
}

async function reverseGeocode(lat: number, lon: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'mut-fuer-kinder-ng/1.0' }
  });
  if (!res.ok) throw new Error('Reverse geocode failed');
  const data = await res.json();
  return data.address;
}
