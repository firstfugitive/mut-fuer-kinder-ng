import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import { CfPage } from '../../../models/contentful-content-types/page';
import { CfPageContentBlog } from '../../../models/contentful-content-types/page-content';
import { Asset } from 'contentful';
import { getImageUrl, getUrlFromPage } from '../../shared/utils';
import { RouterModule } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-blog-teaser',
  imports: [RouterModule, NgOptimizedImage],
  templateUrl: './blog-teaser.html',
  styleUrl: './blog-teaser.scss',
})
export class BlogTeaser {
  data = input<CfPage>();

  blogUrl = computed<string>(() => getUrlFromPage(this.data()));
  blogContent = computed<CfPageContentBlog>(() => this.data()?.fields?.content);
  blogTitle = computed<string>(() => this.blogContent().fields?.title);
  blogImage = computed<Asset>(() => this.blogContent().fields?.image);
  blogImageUrl = computed<string>(() => getImageUrl(this.blogImage()));
  blogImageTitle = computed<string>(() => this.blogImage()?.fields?.title?.toString());
}
