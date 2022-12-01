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

/** helper function for compactly representing a rule */
function r(
  regex: RegExp,
  token?: TT | TT[],
  opt?: Partial<TPikchrState>
): TPikchrState {
  return { regex, token, ...opt };
}

/** collects the states that we build */
const states: Partial<TPikchrStates> = {};

const R_OP = r(/=|\+=|-=|\*=|\/=|\+|\-|abs|cos|dist|int|max|min|sin|sqrt|%/, TT.OP);

const R_OBJECT_CLASS = r(
  /(arc|arrow|box|circle|cylinder|dot|ellipse|file|line|move|oval|spline|text|linerad|arcrad)(?=($|[\.\s\\]))/,
  TT.AM
);

const R_LABEL = r(/[A-Z][a-zA-Z\d_]*/, TT.DF);

const R_STRING = r(/"[^"]*"/, TT.ST);

const R_COMMENT = r(/#.*/, TT.CM);

const R_DIRECTION = r(/right|down|left|up/, TT.BI);

const R_ORDINAL = r(/first|last|previous|\d+(st|nd|rd|th)/, TT.KW);

const R_VAR = r(/[\$@a-z][a-zA-Z\d_]*/, TT.V2);

const R_EDGENAME = r(
  /(\.?)(n|north|t|top|ne|e|east|right|se|s|south|bot|bottom|sw|w|west|left|nw|c|center|start|end)(?=($|[\.\s\\]))/,
  TT.AT
);

const R_HEX = r(/0x[\da-f]{6}/, TT.NB);

const R_BRACKET = r(/[\[\]\(\)]/, TT.BK);

const R_NUMBER = r(/[\d][\d\.]+(in|cm|px|pt|pc|mm)?/, TT.NB);

const R_PUNCT = r(/[;\\,]/, TT.PC);

const R_ATTR = r(
  /(same|same as|dashed|dotted|color|fill|behind|cw|ccw|invis|invisible|thick|thing|solid|chop|fit|<-|->|<->)(?=($|[\.\s\\]))/,
  TT.AT
);

const R_NUM_PROP = r(
  /(diameter|ht|height|rad|radius|thickness|width|wid)(?=($|[\.\s\\]))/,
  TT.PR
);

const R_TEXT_ATTR = r(
  /(above|aligned|below|big|bold|center|italic|ljust|rjust|small)(?=($|[\.\s\\]))/,
  TT.AT
);

const R_WHICH_WAY = r(
  /((above|below|heading)|((right|left|n|north|ne|e|east|se|s|south|sw|w|west|nw) of))(?=($|[\.\s\\]))/,
  TT.AT
);

const R_PATH_ATTR = r(
  /(from|then|go|to|close|even with|until even with)(?=($|[\.\s\\]))/,
  TT.AT
);

const R_LOC_ATTR = r(/(at|with)(?=($|[\.\s\\]))/, TT.AT);

const R_LOC_POS = r(/(of the way between|and|way between)(?=($|[\.\s\\]))/, TT.AT);

/** base isn't a state. these are the "normal business" that any state might use */
const base: TPikchrState[] = [
  R_COMMENT,
  R_OP,
  R_BRACKET,
  R_ORDINAL,
  R_WHICH_WAY,
  R_EDGENAME,
  R_PUNCT,
  R_ATTR,
  R_DIRECTION,
  R_NUM_PROP,
  R_TEXT_ATTR,
  R_PATH_ATTR,
  R_LOC_ATTR,
  R_LOC_POS,
  R_STRING,
  R_HEX,
  R_NUMBER,
  R_OBJECT_CLASS,
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
