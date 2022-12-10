/// <reference path="../../../node_modules/@jupyterlab/codemirror/typings/codemirror/codemirror.d.ts" />
import type { ISimpleMeta, ISimpleState } from 'codemirror';

import type { ICodeMirror } from '@jupyterlab/codemirror';

import { EXTENSIONS, MIME_TYPE, MODE_LABEL, MODE_NAME } from './tokens';

/** All the possible states: pushing non-existing states == bad */
export type TState =
  | 'start'
  | 'comment'
  | 'attribute'
  | 'expr'
  | 'object'
  | 'place'
  | 'position'
  | 'statement';

/** the tokens we (might) use */
export enum TT {
  AM = 'atom',
  AT = 'attribute',
  BE = 'builtin.em',
  BI = 'builtin',
  BK = 'bracket',
  CM = 'comment',
  DF = 'def',
  HL = 'header',
  KW = 'keyword',
  MT = 'meta',
  NB = 'number',
  OP = 'operator',
  PC = 'punctuation',
  QF = 'qualifier',
  PR = 'property',
  SE = 'string.em',
  SH = 'string.header',
  SS = 'string.strong',
  SSE = 'string.strong.em',
  S2 = 'string-2',
  ST = 'string',
  TG = 'tag',
  VB = 'variable',
  V2 = 'variable-2',
}

/** Our custom state. */
type TPikchrState = ISimpleState<TState, TT>;

/** Our overall states */
export type TPikchrStates = {
  [key in TState]: TPikchrState[];
};

const RE_SRC_TERM = /(?=($|[;,.\s<>{}()\\]))/;

/** helper function for compactly representing a rule */
function r(
  regex: RegExp,
  token?: TT | TT[],
  term = true,
  opt?: Partial<TPikchrState>
): TPikchrState {
  return {
    regex: !term ? regex : new RegExp(regex.source + RE_SRC_TERM.source, regex.flags),
    token,
    ...opt,
  };
}

/** collects the states that we build */
const states: Partial<TPikchrStates> = {};

const R_OP = r(/(=|\+=|-=|\*=|\/=|\+|\-|abs|cos|dist|int|max|min|sin|sqrt|%)/, TT.OP);

const R_OBJECT_CLASS = r(
  /(arc|arrow|box|circle|cylinder|dot|ellipse|file|line|move|oval|spline|text)/,
  TT.AM
);

const R_META = r(/(define|print|assert)/, TT.MT);

const R_LABEL = r(/[A-Z][a-zA-Z\d_]*/, TT.DF, false);

const R_STRING = r(/"([^"\\]|\\")*?"/, TT.ST, false);

const R_COMMENT = r(/#.*/, TT.CM, false);

const R_BRACKET = r(/[\][(){}]/, TT.BK, false);

const R_PUNCT = r(/[;\\,]/, TT.PC, false);

const R_PIK_VALUE = r(
  /(arcrad|arrowht|arrowwid|bottommargin|boxht|boxrad|boxwid|charht|charwid|circlerad|color|cylht|cylrad|cylwid|dashwid|debug_label_color|dotrad|ellipseht|ellipsewid|fileht|filerad|filewid|fill|fontscale|leftmargin|lineht|linerad|linewid|margin|movewid|ovalht|ovalwid|rightmargin|scale|textht|textwid|thickness|topmargin)/,
  TT.BI
);

const R_DIRECTION = r(/right|down|left|up/, TT.BI);

const R_ORDINAL = r(/this|first|last|previous|\d+(st|nd|rd|th)/, TT.KW);

const R_VAR = r(/[\$@a-z][a-zA-Z\d_]*/, TT.V2);

const R_EDGENAME = r(
  /(\.?)(n|north|t|top|ne|e|east|right|se|s|south|bot|bottom|sw|w|west|left|nw|c|center|start|end)/,
  TT.QF
);

const R_HEX = r(/0x[\da-f]{6}/, TT.NB);

const R_NUMBER = r(/[\d][\d\.]+(in|cm|px|pt|pc|mm)?/, TT.NB);

const R_HTML_COLOR = r(
  /aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|none|off|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen/i,
  TT.NB
);

const R_ATTR = r(
  /(same|same as|dashed|dotted|color|fill|behind|cw|ccw|invis|invisible|thick|thing|solid|chop|fit|<-|->|<->)/,
  TT.AT
);

const R_FANCY_ARROW = r(/→|←|↔/, TT.AT);

const R_ENT_ATTR = r(/&(rarr|rightarrow|larr|leftarrow|leftrightarrow);/, TT.AT);

const R_NUM_PROP = r(/(diameter|ht|height|rad|radius|thickness|width|wid)/, TT.PR);

const R_TEXT_ATTR = r(
  /(above|aligned|below|big|bold|center|italic|ljust|rjust|small)/,
  TT.AT
);

const R_WHICH_WAY = r(
  /((above|below|heading)|((right|left|n|north|ne|e|east|se|s|south|sw|w|west|nw)\s+of))/,
  TT.QF
);

const R_PATH_ATTR = r(
  /(at|with|from|then|go|to|close|even\s+with|until\s+even\s+with)/,
  TT.QF
);

const R_PLACE = r(/(vertex|of|in)/, TT.QF);

const R_LOC_POS = r(/(of the way between|and|way between)/, TT.AT);

/** base isn't a state. these are the "normal business" that any state might use */
const base: TPikchrState[] = [
  R_COMMENT,
  R_ATTR,
  R_ENT_ATTR,
  R_FANCY_ARROW,
  R_OP,
  R_BRACKET,
  R_META,
  R_ORDINAL,
  R_WHICH_WAY,
  R_PLACE,
  R_LOC_POS,
  R_DIRECTION,
  R_EDGENAME,
  R_PUNCT,
  R_HTML_COLOR,
  R_NUM_PROP,
  R_TEXT_ATTR,
  R_PATH_ATTR,
  R_STRING,
  R_HEX,
  R_NUMBER,
  R_OBJECT_CLASS,
  R_PIK_VALUE,
  R_VAR,
  R_LABEL,
];

/** the starting state (begining of a file) */
states.start = [...base];

/** the actual exported function that will install the mode in CodeMirror */
export function definePikchrMode({ CodeMirror }: ICodeMirror) {
  const meta: ISimpleMeta<TState, TT> = {
    meta: {
      dontIndentStates: ['comment'],
      lineComment: '#',
    },
  };

  CodeMirror.defineSimpleMode<TState, TT>(MODE_NAME, { ...states, meta: meta as any });

  CodeMirror.defineMIME(MIME_TYPE, MODE_NAME);

  const mimeInfo = {
    ext: EXTENSIONS,
    mime: MIME_TYPE,
    mode: MODE_NAME,
    name: MODE_LABEL,
  };

  CodeMirror.modeInfo.push(mimeInfo);
}
