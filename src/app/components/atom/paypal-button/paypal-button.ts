import { Component, input } from '@angular/core';

@Component({
  selector: 'app-paypal-button',
  imports: [],
  templateUrl: './paypal-button.html',
  styleUrl: './paypal-button.scss',
})
export class PaypalButton {
  url = input<string>();
}
