import { Component, computed, input } from '@angular/core';
import { CfTextModule } from '../../../models/contentful-content-types/text-module';
import { BaseText } from "../../atom/base-text/base-text";

@Component({
  selector: 'app-text-module',
  imports: [BaseText],
  template: `
  <app-base-text class="module" [text]="text()" [big]="big()" [bold]="bold()" [gotham]="gotham()" [align]="align()"
    [htmlTag]="htmlTag()">
  `
})
export class TextModule {
  data = input<CfTextModule>();

  text = computed<string>(() => this.data()?.fields?.text);
  big = computed<boolean>(() => this.data()?.fields?.big);
  bold = computed<boolean>(() => this.data()?.fields?.bold);
  gotham = computed<boolean>(() => this.data()?.fields?.gotham);
  align = computed<string>(() => this.data()?.fields?.align);
  htmlTag = computed<string>(() => this.data()?.fields?.htmlTag);

}
