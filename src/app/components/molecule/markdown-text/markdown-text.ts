import { Component, computed, inject, Inject, input, ViewEncapsulation } from '@angular/core';
import { marked } from 'marked';
import { CfMarkdownText } from '../../../models/contentful-content-types/markdown-text';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-markdown-text',
  imports: [],
  template: '<div [innerHTML]="parsedMarkdown()"></div>',
  styleUrl: './markdown-text.scss',
  host: {
    '[style.text-align]': 'align()',
    '[class.module]': '!noModule()',
    '[class.alternative-font-for-text]': 'alternativeFontForText()',
  },
  encapsulation: ViewEncapsulation.None,
})
export class MarkdownText {
  data = input<CfMarkdownText>();
  noModule = input(false);
  sanitizer = inject(DomSanitizer);
  
  parsedMarkdown = computed(() => this.sanitizer.bypassSecurityTrustHtml(marked.parse(this.data()?.fields?.text, {breaks: true}).toString()));
  align = computed<string>(() => this.data()?.fields?.align);
  alternativeFontForText = computed<boolean>(() => this.data()?.fields?.alternativeFontForText);
}
