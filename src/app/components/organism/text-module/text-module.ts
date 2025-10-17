import { Component, computed, input } from '@angular/core';
import { CfTextModule } from '../../../models/contentful-content-types/text-module';
import { BaseText } from "../../atom/base-text/base-text";

@Component({
  selector: 'app-text-module',
  imports: [BaseText],
  templateUrl: './text-module.html',
  styleUrl: './text-module.scss'
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
