import type MarkdownIt from 'markdown-it';

import { render } from './render';
import { LANGS } from './tokens';

export function renderPikchrMarkdownIt(md: MarkdownIt): void {
  let { fence } = md.renderer.rules;

  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const { info, content } = tokens[idx];
    const lang = info.trim().split(/\s+/g)[0];
    if (!LANGS.includes(lang)) {
      return fence ? fence(tokens, idx, options, env, slf) : '';
    }
    return render(content);
  };
}
