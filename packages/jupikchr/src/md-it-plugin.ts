import type MarkdownIt from 'markdown-it';

import { Pikchr } from './pikchr';
import { EMOJI, LANGS } from './tokens';

export function renderPikchrMarkdownIt(md: MarkdownIt): void {
  let { fence } = md.renderer.rules;

  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const { info, content } = tokens[idx];
    const lang = info.trim().split(/\s+/g)[0];

    if (!LANGS.includes(lang)) {
      return fence ? fence(tokens, idx, options, env, slf) : '';
    }

    const placeholderId = Private.nextId();
    const placeholder = `<img id="${placeholderId}" />`;

    const renderOptions: Pikchr.IRenderOptions = {
      pikchr: content,
      tag: 'img',
      addDimensions: true,
    };

    void Private.renderLater(renderOptions, placeholderId);

    return placeholder;
  };
}

namespace Private {
  export const pikchr = Pikchr.initialize();
  let _nextId = 0;
  export function nextId() {
    return `md-it-pikchr-${_nextId++}`;
  }
  async function sleep(): Promise<void> {
    return await new Promise((resolve, reject) => setTimeout(resolve, 100));
  }
  export async function renderLater(
    renderOptions: Pikchr.IRenderOptions,
    placeholderId: string,
    retries = 5
  ): Promise<void> {
    let imgStr: string;
    try {
      imgStr = await Private.pikchr.render(renderOptions);
    } catch {
      if (retries > 0) {
        await sleep();
        return await renderLater(renderOptions, placeholderId, retries - 1);
      } else {
        console.warn(`${EMOJI} failed to render`);
        return;
      }
    }
    await replacePlaceholder(placeholderId, imgStr);
  }

  export async function replacePlaceholder(
    placeholderId: string,
    imgStr: string,
    retries = 5
  ): Promise<void> {
    const node = document.getElementById(placeholderId);
    if (node) {
      node.outerHTML = imgStr;
      return;
    }
    if (retries > 0) {
      await sleep();
      return await replacePlaceholder(placeholderId, imgStr, retries - 1);
    }
    console.warn(`${EMOJI} failed to update placeholder`);
    return;
  }
}
