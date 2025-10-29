/* 
 * -- LinkService --        [Temporary]
 * @MarkPieszak
 * 
 * Similar to Meta service but made to handle <link> creation for SEO purposes
 * -- NOTE: Soon there will be an overall DocumentService within Angular that handles Meta/Link everything
 */

import { Injectable, RendererFactory2, ViewEncapsulation, inject } from '@angular/core';
import { DOCUMENT } from '@angular/core';

@Injectable()
export class TagService {
    rendererFactory = inject(RendererFactory2);
    document = inject(DOCUMENT);

    addLinkTag(href: string, rel: string, itemprop: string) {

        try {
            const renderer = this.rendererFactory.createRenderer(this.document, {
                id: '-1',
                encapsulation: ViewEncapsulation.None,
                styles: [],
                data: {}
            });

            const link = renderer.createElement('link');
            const head = this.document.head;

            if (head === null) {
                throw new Error('<head> not found within DOCUMENT.');
            }

            if (rel) {
                renderer.setAttribute(link, 'rel', rel);
            }
            if (itemprop) {
                renderer.setAttribute(link, 'itemprop', itemprop);
            }
            renderer.setAttribute(link, 'href', href);

            // [TODO]: get them to update the existing one (if it exists) ?
            renderer.appendChild(head, link);

        } catch (e) {
            console.error('Error within TagService : ', e);
        }
    }

    addScriptTag(type: string, innerHTML: string) {

        try {
            const renderer = this.rendererFactory.createRenderer(this.document, {
                id: '-1',
                encapsulation: ViewEncapsulation.None,
                styles: [],
                data: {}
            });

            const scriptTag = renderer.createElement('script');
            const head = this.document.head;

            if (head === null) {
                throw new Error('<head> not found within DOCUMENT.');
            }

            scriptTag.innerHTML = innerHTML;
            renderer.setAttribute(scriptTag, 'type', type);


            // [TODO]: get them to update the existing one (if it exists) ?
            renderer.appendChild(head, scriptTag);

        } catch (e) {
            console.error('Error within TagService : ', e);
        }
    }
}
