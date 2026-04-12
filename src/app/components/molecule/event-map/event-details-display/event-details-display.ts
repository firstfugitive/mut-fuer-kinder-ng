import { Component, input } from '@angular/core';
import { EventDetails } from '../../../../models/event-details';import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-event-details-display',
  imports: [MatIconModule],
  templateUrl: './event-details-display.html',
  styleUrl: './event-details-display.scss',
})
export class EventDetailsDisplay {

  eventDetails = input<EventDetails>();
  showTitle = input<boolean>(true);

  protected formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  protected formatDateTime(dateString: string, dateAdditionalInfo: string): string {
    try {
      const date = new Date(dateString);
      const formattedTime = date.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
      });
      if (formattedTime === '00:00') {
        return "Uhrzeit noch nicht bekannt";
      }
      return formattedTime + (dateAdditionalInfo ? ` (${dateAdditionalInfo})` : '');
    } catch {
      return dateString;
    }
  }
}
