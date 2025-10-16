import { Component, input, Input } from '@angular/core';
import { CfPageHeader } from '../../../models/contentful-content-types/page-header';

@Component({
  selector: 'app-page-header',
  imports: [],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss'
})
export class PageHeader {
  data = input<CfPageHeader>();
}
