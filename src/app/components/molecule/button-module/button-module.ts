import { Component, computed, input } from '@angular/core';
import { CfButtonModule } from '../../../models/contentful-content-types/button-module';
import { getUrlFromPage } from '../../shared/utils';
import { RouterModule } from '@angular/router';
import { PaypalButton } from '../../atom/paypal-button/paypal-button';

@Component({
  selector: 'app-button-module',
  imports: [RouterModule, PaypalButton],
  template: `
    @if(isPaypalButton()) {
    <app-paypal-button [url]="paypalUrl()"></app-paypal-button>
    }
    @else {
    <a [routerLink]="internalPageUrl()">{{text()}}</a>
    }`,
  styles: '',
  host: {
    class: "module"
  }
})
export class ButtonModule {
  data = input<CfButtonModule>();

  isPaypalButton = computed<boolean>(() => this.data()?.fields?.isPaypalButton);
  paypalUrl = computed<string>(() => this.data()?.fields?.paypalUrl);
  text = computed<string>(() => this.data()?.fields?.text);
  internalPageUrl = computed<string>(() => getUrlFromPage(this.data()?.fields?.linkedPage));
}
