import type MarkdownIt from 'markdown-it';

import { Pikchr } from './pikchr';
import { LANGS } from './tokens';

export function renderPikchrMarkdownIt(md: MarkdownIt): void {
  let { fence } = md.renderer.rules;

  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const { info, content } = tokens[idx];
    const lang = info.trim().split(/\s+/g)[0];

    if (!LANGS.includes(lang)) {
      return fence ? fence(tokens, idx, options, env, slf) : '';
    }

    const placeholderId = Private.nextId();
    const placeholder = `<img id="${placeholderId}"></span>`;

    Private.pikchr.render({ pikchr: content, tag: 'img' }).then((img) => {
      const node = document.getElementById(placeholderId);
      if (node) {
        node.outerHTML = img;
      }
    });

    return placeholder;
  };
}

namespace Private {
  export const pikchr = Pikchr.initialize();
  let _nextId = 0;
  export function nextId() {
    return `pikchr-${_nextId++}`;
  }
}
