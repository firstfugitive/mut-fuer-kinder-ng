/* 
 * -- LinkService --        [Temporary]
 * @MarkPieszak
 * 
 * Similar to Meta service but made to handle <link> creation for SEO purposes
 * -- NOTE: Soon there will be an overall DocumentService within Angular that handles Meta/Link everything
 */

import { Injectable, Optional, RendererFactory2, ViewEncapsulation, Inject, inject } from '@angular/core';
import { DOCUMENT } from '@angular/core';

@Injectable()
export class ScriptService {
    rendererFactory = inject(RendererFactory2);
    document = inject(DOCUMENT);

    /**
     * Inject the State into the bottom of the <head>
     */
    addTag(type: string, innerHTML: string) {

        try {
            const renderer = this.rendererFactory.createRenderer(this.document, {
                id: '-1',
                encapsulation: ViewEncapsulation.None,
                styles: [],
                data: {}
            });

            const scriptTag = renderer.createElement('script');
            const head = this.document.head;
            const selector = this._parseSelector(scriptTag);

            if (head === null) {
                throw new Error('<head> not found within DOCUMENT.');
            }

            scriptTag.innerHTML = innerHTML;
            renderer.setAttribute(scriptTag, 'type', type);
            

            // [TODO]: get them to update the existing one (if it exists) ?
            renderer.appendChild(head, scriptTag);

        } catch (e) {
            console.error('Error within linkService : ', e);
        }
    }

    private _parseSelector(tag: LinkDefinition): string {
        // Possibly re-work this
        const attr: string = tag.rel ? 'rel' : 'hreflang';
        return `${attr}="${tag[attr]}"`;
    }
}

export declare type LinkDefinition = {
    charset?: string;
    crossorigin?: string;
    href?: string;
    hreflang?: string;
    media?: string;
    rel?: string;
    rev?: string;
    sizes?: string;
    target?: string;
    type?: string;
} & {
    [prop: string]: string;
};