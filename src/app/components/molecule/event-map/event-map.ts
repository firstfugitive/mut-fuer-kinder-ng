import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, input, PLATFORM_ID, viewChild, ViewEncapsulation, signal } from '@angular/core';
import { CfEvent } from '../../../models/contentful-content-types/event';
import {MatExpansionModule, MatAccordion} from '@angular/material/expansion';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Cluster from 'ol/source/Cluster';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { boundingExtent } from 'ol/extent';
import { Style, Icon, Text, Fill, Stroke, Circle } from 'ol/style';
import Overlay from 'ol/Overlay';
import { click } from 'ol/events/condition';
import Select from 'ol/interaction/Select';
import { EntryFields } from 'contentful';
import { EventDetails } from '../../../models/event-details';
import { EventDetailsDisplay } from "./event-details-display/event-details-display";

@Component({
  selector: 'app-event-map',
  templateUrl: './event-map.html',
  styleUrl: './event-map.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [EventDetailsDisplay, MatExpansionModule, MatAccordion]
})
export class EventMap implements AfterViewInit {

  events = input<CfEvent[]>();

  mapElementRef = viewChild<ElementRef>('map');
  popupElementRef = viewChild<ElementRef>('popup');
  popupContentRef = viewChild<ElementRef>('popupContentDiv');

  eventDetails = signal<EventDetails[]>(undefined);

  private map: Map | null = null;
  private popupOverlay: Overlay | null = null;
  private select: Select | null = null;
  protected popupContent = signal<EventDetails | null>(null);

  private platformId: Object = inject(PLATFORM_ID);
  private vectorSource: VectorSource<Feature> | null = null;

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      this.setEventDetails().then(() => this.loadOlMap());
    }
  }

  private async setEventDetails(): Promise<void> {
    const eventDetails: EventDetails[] = [];
    return Promise.all(
      this.events()?.map(async (event) => {
      if (event.fields?.detailsNotAvailable) {
        eventDetails.push({ event: event, formattedAddress: 'Details zum Event sind leider nicht verfügbar.' });
        return Promise.resolve();
      }
      return this.formatAddress(event.fields?.location || { lat: 0, lon: 0 }).then(formattedAddress => {
        console.log('Formatted Address:', formattedAddress);
        eventDetails.push({ event: event, formattedAddress: formattedAddress });
      });
    })).then(() => {
      this.eventDetails.set(eventDetails);
    });

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
      zoom: 5
    });

    germanyView.fit(germanyExtent, {
      padding: [50, 50, 50, 50],
      duration: 1000
    });

    // Vector Source für Events
    this.vectorSource = new VectorSource();
    this.addEventFeatures();

    // Cluster Source
    const clusterSource = new Cluster({
      distance: 80,
      source: this.vectorSource
    });

    // Vector Layer mit Clustering
    const vectorLayer = new VectorLayer({
      source: clusterSource,
      style: (feature) => this.styleFunction(feature as Feature, clusterSource)
    });

    // Popup Overlay
    this.setupPopupOverlay();

    this.map = new Map({
      target: this.mapElementRef().nativeElement,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: germanyView,
      overlays: this.popupOverlay ? [this.popupOverlay] : []
    });

    // Interaktionen für Click-Events
    this.setupInteractions(clusterSource);
  }

  private addEventFeatures() {
    if (!this.vectorSource || !this.eventDetails()) {
      return;
    }

    this.eventDetails()?.forEach((eventDetail) => {
      const event = eventDetail.event;
      if (event.fields?.location?.lon && event.fields?.location?.lat) {
        const feature = new Feature({
          geometry: new Point(fromLonLat([event.fields.location.lon, event.fields.location.lat])),
          eventDetails: eventDetail
        });

        this.vectorSource!.addFeature(feature);
      }
    });
  }

  private setupPopupOverlay() {
    if (!this.popupElementRef()) {
      return;
    }

    this.popupOverlay = new Overlay({
      element: this.popupElementRef().nativeElement,
      autoPan: false,
    });
  }

  private setupInteractions(clusterSource: Cluster) {
    if (!this.map) {
      return;
    }

    this.select = new Select({
      condition: click,
      style: (feature) => this.selectStyle(feature as Feature)
    });

    this.map.addInteraction(this.select);

    this.select.on('select', (e) => {
      this.handleFeatureSelect(e, clusterSource);
    });
  }

  protected closePopup() {
    this.popupContent.set(null);
    if (this.popupOverlay) {
      this.popupOverlay.setPosition(undefined);
    }
    if (this.select) {
      this.select.getFeatures().clear();
    }
  }

  private async handleFeatureSelect(e: any, clusterSource: Cluster): Promise<void> {
    if (!this.map || !this.popupOverlay) {
      return Promise.resolve();
    }

    const features = e.selected;

    if (features.length === 0) {
      this.popupOverlay.setPosition(undefined);
      this.popupContent.set(null);
      return Promise.resolve();
    }

    const feature = features[0];
    const featuresInCluster = feature.get('features');

    if (featuresInCluster && featuresInCluster.length > 1) {
      // Cluster wurde geklickt - zoome hinein
      const extent = clusterSource.getExtent();
      this.map.getView().fit(extent, {
        duration: 500,
        padding: [50, 50, 50, 50],
        maxZoom: 9
      });
      this.popupOverlay.setPosition(undefined);
      return Promise.resolve();
    } else {
      // Einzelnes Event wurde geklickt
      const eventFeature = featuresInCluster ? featuresInCluster[0] : feature;
      const eventDetails = eventFeature.get('eventDetails') as EventDetails;

      if (eventDetails) {
        const geometry = eventFeature.getGeometry() as Point;
        const coords = geometry.getCoordinates();

        // Zoom-abhängige Popup-Verschiebung
        const currentZoom = this.map.getView().getZoom() || 5;
        const baseOffset = 60000; // Basis-Verschiebung bei Zoom 5
        // console.log('Current Zoom:', currentZoom, 'Zoom Factor:', (5 / currentZoom));
        const zoomFactor = Math.max(0.2, (5 / currentZoom)); // Skaliert mit dem Zoom-Level
        const offsetX = Math.round(baseOffset * zoomFactor);
        // const newCoordsForMapViewWithPopup = add(coords, [offsetX, 32000]);

        // Zentriere die Karte auf den Event-Punkt
        this.map.getView().animate({
          center: coords,
          duration: 300
        });

        //todo : Popup-Positionierung verbessern, damit es nicht das Kalendericon verdeckt
        this.popupOverlay.setPosition(geometry.getCoordinates());

        return this.popupContent.set(eventDetails);
  
      }
    }
  }

  

  protected async formatAddress(location: EntryFields.Location): Promise<string> {
    if (!location) {
      return 'Adresse unbekannt';
    }

    const address = await reverseGeocode(location.lat || 0, location.lon || 0).catch(() => null);
    if (!address) {
      return `Lat ${location.lat?.toFixed(4) || '??'}, Lon ${location.lon?.toFixed(4) || '??'}`;
    }

    const street = address.road || address.pedestrian || address.cycleway || 'Straße unbekannt';
    const house = address.house_number ? ` ${address.house_number}` : '';
    const postcode = address.postcode ? ` ${address.postcode}` : '';
    const town = address.town ? ` ${address.town}` : address.city ? ` ${address.city}` : address.village ? ` ${address.village}` : '';

    return `${street}${house}, ${postcode}${town}`;
  }


  private styleFunction(feature: Feature, clusterSource: Cluster): Style | Style[] {
    const size = feature.get('features').length;

    if (size > 1) {
      // Cluster Style
      return new Style({
        image: new Circle({
          radius: 22,
          fill: new Fill({ color: 'rgba(51, 122, 183, 0.8)' }),
          stroke: new Stroke({ color: '#fff', width: 2 })
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({ color: '#fff' }),
          font: 'bold 14px Arial'
        })
      });
    } else {
      // Einzelnes Event - Kalender Icon
      const eventFeature = feature.get('features')[0];
      const eventDetails = eventFeature.get('eventDetails') as EventDetails;
      const day = this.extractDay(eventDetails?.event?.fields?.date?.toString() || '');

      return new Style({
        image: new Icon({
          src: this.generateCalendarIcon(day),
          scale: 1,
          anchor: [0.5, 1]
        })
      });
    }
  }

  private selectStyle(feature: Feature): Style | Style[] {
    const size = feature.get('features').length;

    if (size > 1) {
      // Selected Cluster
      return new Style({
        image: new Circle({
          radius: 25,
          fill: new Fill({ color: 'rgba(230, 126, 34, 0.9)' }),
          stroke: new Stroke({ color: '#fff', width: 3 })
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({ color: '#fff' }),
          font: 'bold 14px Arial'
        })
      });
    } else {
      // Selected Event - Kalender Icon mit Highlight
      const eventFeature = feature.get('features')[0];
      const eventDetails = eventFeature.get('eventDetails') as EventDetails;
      const day = this.extractDay(eventDetails?.event?.fields?.date?.toString() || '');

      return new Style({
        image: new Icon({
          src: this.generateCalendarIcon(day, true),
          scale: 1.2,
          anchor: [0.5, 1]
        })
      });
    }
  }

  protected extractDay(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.getDate().toString().padStart(2, '0');
    } catch {
      return '??';
    }
  }

  private generateCalendarIcon(day: string, highlight = false): string {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 56;

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Hintergrund
    const bgColor = highlight ? '#e67e22' : '#3498db';
    ctx.fillStyle = bgColor;
    ctx.fillRect(2, 10, 44, 40);

    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 10, 44, 40);

    // Kalender-Streifen oben
    ctx.fillStyle = '#34495e';
    ctx.fillRect(2, 2, 44, 8);

    // Löcher für Kalender-Aufhängung
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.arc(12, 6, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(36, 6, 2, 0, Math.PI * 2);
    ctx.fill();

    // Tag-Text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(day, 24, 32, 100);

    return canvas.toDataURL('image/png');
  }
}

async function reverseGeocode(lat: number, lon: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`;
  console.log('Reverse Geocoding URL:', url);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Reverse geocode failed: ${res.status}`);
    }
    const data = await res.json();
    return data.address;
  } catch {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const proxyRes = await fetch(proxyUrl);
    if (!proxyRes.ok) {
      throw new Error(`Reverse geocode proxy failed: ${proxyRes.status}`);
    }
    const proxyData = await proxyRes.json();
    return proxyData.address;
  }
}
