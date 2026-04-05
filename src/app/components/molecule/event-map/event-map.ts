import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, input, PLATFORM_ID, viewChild, ViewEncapsulation } from '@angular/core';
import { CfEvent } from '../../../models/contentful-content-types/event';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { boundingExtent } from 'ol/extent';

@Component({
  selector: 'app-event-map',
  templateUrl: './event-map.html',
  styleUrl: './event-map.scss',
  encapsulation: ViewEncapsulation.None
})
export class EventMap implements AfterViewInit {
  
  events = input<CfEvent[]>();

  mapElementRef = viewChild<ElementRef>('map');
  private map: any;

  private platformId: Object = inject(PLATFORM_ID);

  async ngAfterViewInit(): Promise<void> {
    const onlyInBrowser = true;

    if (onlyInBrowser) {
      if (isPlatformBrowser(this.platformId)) {
        console.log("Running in browser", window?.innerHeight);

        this.loadOlMap();
      }
    } else {

      //works without isPlatformBrowser!
      this.loadOlMap();
    }
  }

  private loadOlMap() {
    if (!this.mapElementRef()) {
      return;
    }
    const germanyExtent = boundingExtent([
      fromLonLat([5.9, 47.3]),   // Südwest
      fromLonLat([15.0, 55.1])   // Nordost
    ]);

    const germanyView = new View({
      center: fromLonLat([10.45, 51.16]), // Mittelpunkt Deutschland
      zoom: 6
    })
    germanyView.fit(germanyExtent, {
      padding: [50, 50, 50, 50],
      duration: 1000
    });

    this.map = new Map({
      target: this.mapElementRef().nativeElement,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: germanyView
    });
  }

  private async loadMap(): Promise<void> {
    // if (!isPlatformBrowser(this.platformId) || !this.mapElementRef() || !this.events()) {
    //   return;
    // }
    

    // const leaflet = await import('leaflet');
    // this.map = L.map(this.mapElementRef().nativeElement).setView([51.3, 10.1], 6);
    // leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '© OpenStreetMap'
    // }).addTo(this.map);
    // if (this.events()) {

    //   this.events()?.forEach(async event => {

    //     //todo check if possible via leaflet?
    //     const address = await reverseGeocode(event.fields?.location?.lat || 0, event.fields?.location?.lon || 0);

    //     const street = address.road || address.pedestrian || address.cycleway || 'Straße unbekannt';
    //     const house = address.house_number ? ` ${address.house_number}` : '';
    //     const postcode = address.postcode ? ` ${address.postcode}` : '';
    //     const village = address.village ? ` ${address.village}` : '';

    //     leaflet.marker([event.fields?.location?.lat || 0, event.fields?.location?.lon || 0]).addTo(this.map)
    //       .bindPopup(`
    //         <br>${event.fields?.locationName}<br>
    //         ${formatDate(event.fields?.date?.toString())}
    //         <br>${event.fields?.contactDetails}<br>
    //         <a href="${event.fields?.link}" target="_blank">Mehr Informationen</a>
    //         <br>📍 ${street} ${house}, ${postcode || ''} ${village || ''}
    //         `);
    //   });
    // }
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
