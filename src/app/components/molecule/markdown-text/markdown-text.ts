import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import { marked } from 'marked';
import { CfMarkdownText } from '../../../models/contentful-content-types/markdown-text';

@Component({
  selector: 'app-markdown-text',
  imports: [],
  template: '<div [innerHTML]="parsedMarkdown()" [style]="`text-align: ${align()}`"></div>',
  styleUrl: './markdown-text.scss',
  host: {
    '[class.module]': '!noModule()',
  },
  encapsulation: ViewEncapsulation.None,
})
export class MarkdownText {
  data = input<CfMarkdownText>();
  noModule = input(false);

  parsedMarkdown = computed(() => marked.parse(this.data()?.fields?.text));
  align = computed<string>(() => this.data()?.fields?.align);
}
