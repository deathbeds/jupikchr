import * as _PACKAGE from '../package.json';

export const PACKAGE = _PACKAGE;
export const NS = PACKAGE.name;
export const VERSION = PACKAGE.version;
export const PLUGIN_ID = `${NS}:plugin`;

export const LANGS = ['pikchr', '{pikchr}'];
export const RE_VIEWBOX = /viewBox="([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)"/;
export const JP_UI_FONT_FAMILY = '--jp-content-font-family';

export namespace CSS {
  export const ICON = 'jp-PikchrIcon';
  export const WIDGET = 'jp-PikchrWidget';
  export const DOCUMENT = 'jp-PikchrDocument';
  export const CONTEXT_SELECTOR = 'jp-DirListing-content';
  export const FIT = 'jp-pikchr-mod-fit';
}

export const NAME = 'Pikchr';

export const PALETTE_CATEGORY = 'Text Editor';

export const LAUNCHER_CATEGORY = 'Other';

export const DOT_PIKCHR = '.pikchr';

export namespace CommandIDs {
  export const createNew = 'pikchr:create-new';
  export const fit = 'pikchr:fit';
  export const img = 'pikchr:img';
}
