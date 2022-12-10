/** A wrapper class for the pikchr worker */
import { PromiseDelegate } from '@lumino/coreutils';

import * as URLS from './_pikchr_urls';
import { JP_UI_FONT_FAMILY } from './tokens';

class _Pikchr implements Pikchr.IPikchr {
  private _ready = new PromiseDelegate<void>();
  private _renderPromises = new Map<
    string,
    PromiseDelegate<Pikchr.IRenderResponseData>
  >();

  constructor(options?: Pikchr.IOptions) {
    // nothing here yet
  }

  async render(options: Pikchr.IRenderOptions): Promise<string> {
    let { _worker } = this;

    if (!_worker) {
      this._worker = _worker = new Worker(URLS.WORKER_JS_URL.default);
      _worker.onmessage = this.onMessage;
    }

    await this._ready.promise;

    let promise = this._renderPromises.get(options.pikchr);

    if (promise == null) {
      promise = new PromiseDelegate<Pikchr.IRenderResponseData>();
      this._renderPromises.set(options.pikchr, promise);
      const data = {
        ...options,
        ...(options.darkMode == null
          ? {
              darkMode: document.body.dataset.jpThemeLight === 'false',
            }
          : {}),
      };
      this.postMessage({
        type: 'pikchr',
        data,
      });
    }

    const response = await promise.promise;

    if (options.tag === 'img') {
      return this.transformToImg(response);
    }
    const { result, height, width } = response;
    return result.replace(
      '<svg ',
      `<svg style="max-width:${width}px;max-height:${height}px;" `
    );
  }

  transformToImg(data: Pikchr.IRenderResponseData): string {
    let { result, width, height } = data;
    const match = data.result.match(/(<svg[\s\S]*svg>)/m);
    if (match == null) {
      return result;
    }
    result = `${HEADER}${match[1]}`;
    const fontFamily = getComputedStyle(document.body).getPropertyValue(
      JP_UI_FONT_FAMILY
    );
    result = result.replace(
      '</svg>',
      `<style>text { font-family: ${fontFamily}; font-size: 14px; }</style></svg>`
    );
    result = `<img
          class="pikchr"
          style="max-width:${width}px;max-height:${height}px;"
          src="${`data:image/svg+xml,${encodeURIComponent(result)}`}"
        />`;
    return result;
  }

  postMessage(message: Pikchr.IMessage) {
    this._worker!.postMessage(message);
  }

  onMessage = (evt: MessageEvent<Pikchr.TAnyMessage>) => {
    const { type, data } = evt.data;
    let renderPromise: PromiseDelegate<Pikchr.IRenderResponseData> | null;
    switch (type) {
      case 'pikchr-ready':
        this._ready.resolve(void 0);
        break;
      case 'pikchr':
        if (data.hasOwnProperty('result')) {
          renderPromise = this._renderPromises.get(data.pikchr) || null;
          if (renderPromise) {
            renderPromise.resolve(data as any as Pikchr.IRenderResponseData);
            this._renderPromises.delete(data.pikchr);
          } else {
            console.warn('Unepected pikchr result', evt);
          }
        }
        break;
    }
  };

  private _worker: Worker | null = null;
}

export namespace Pikchr {
  let instance: _Pikchr | null = null;

  export type IMessageType =
    | 'module'
    | 'pikchr-ready'
    | 'pikchr'
    | 'status'
    | 'working';

  export interface IMessage {
    type: IMessageType;
    data: any;
  }

  export interface IRenderRequestMessage extends IMessage {
    type: 'pikchr';
    data: IRenderRequestData;
  }

  export interface IRenderRequestData {
    pikchr: string;
    darkMode?: boolean;
    cssClass?: string;
  }

  export interface IRenderResponseMessage extends IMessage {
    type: 'pikchr';
    data: IRenderResponseData;
  }

  export interface IRenderResponseData {
    pikchr: string;
    height: number;
    width: number;
    isError: boolean;
    result: string;
  }

  export interface IReadyMessage extends IMessage {
    type: 'pikchr-ready';
  }

  export type TAnyMessage =
    | IReadyMessage
    | IRenderRequestMessage
    | IRenderResponseMessage;

  export interface IStatusData {
    step: number;
    text: string;
  }

  export type TPikchrFormat = 'img' | 'svg';

  export interface IRenderOptions extends IRenderRequestData {
    tag?: TPikchrFormat;
  }

  export interface IPikchr {
    render(options: IRenderOptions): Promise<string>;
  }

  export interface IOptions {
    // nothing here yet...
  }

  export function initialize(options?: IOptions): IPikchr {
    if (instance == null) {
      instance = new _Pikchr(options);
    }
    return instance;
  }
}

// TODO: find a better source of these
const HTML_ENTITIES = `
<!ENTITY quot "&#34;">
<!ENTITY Aacute "&#193;">
<!ENTITY aacute "&#225;">
<!ENTITY Acirc "&#194;">
<!ENTITY acirc "&#226;">
<!ENTITY acute "&#180;">
<!ENTITY AElig "&#198;">
<!ENTITY aelig "&#230;">
<!ENTITY Agrave "&#192;">
<!ENTITY agrave "&#224;">
<!ENTITY alefsym "&#8501;">
<!ENTITY Alpha "&#913;">
<!ENTITY alpha "&#945;">
<!ENTITY amp "&#38;">
<!ENTITY and "&#8743;">
<!ENTITY ang "&#8736;">
<!ENTITY apos "&#39;">
<!ENTITY Aring "&#197;">
<!ENTITY aring "&#229;">
<!ENTITY asymp "&#8776;">
<!ENTITY Atilde "&#195;">
<!ENTITY atilde "&#227;">
<!ENTITY Auml "&#196;">
<!ENTITY auml "&#228;">
<!ENTITY bdquo "&#8222;">
<!ENTITY Beta "&#914;">
<!ENTITY beta "&#946;">
<!ENTITY brvbar "&#166;">
<!ENTITY bull "&#8226;">
<!ENTITY cap "&#8745;">
<!ENTITY Ccedil "&#199;">
<!ENTITY ccedil "&#231;">
<!ENTITY cedil "&#184;">
<!ENTITY cent "&#162;">
<!ENTITY Chi "&#935;">
<!ENTITY chi "&#967;">
<!ENTITY circ "&#710;">
<!ENTITY clubs "&#9827;">
<!ENTITY cong "&#8773;">
<!ENTITY copy "&#169;">
<!ENTITY crarr "&#8629;">
<!ENTITY cup "&#8746;">
<!ENTITY curren "&#164;">
<!ENTITY dagger "&#8224;">
<!ENTITY Dagger "&#8225;">
<!ENTITY darr "&#8595;">
<!ENTITY dArr "&#8659;">
<!ENTITY deg "&#176;">
<!ENTITY Delta "&#916;">
<!ENTITY delta "&#948;">
<!ENTITY diams "&#9830;">
<!ENTITY divide "&#247;">
<!ENTITY Eacute "&#201;">
<!ENTITY eacute "&#233;">
<!ENTITY Ecirc "&#202;">
<!ENTITY ecirc "&#234;">
<!ENTITY Egrave "&#200;">
<!ENTITY egrave "&#232;">
<!ENTITY empty "&#8709;">
<!ENTITY emsp "&#8195;">
<!ENTITY ensp "&#8194;">
<!ENTITY Epsilon "&#917;">
<!ENTITY epsilon "&#949;">
<!ENTITY equiv "&#8801;">
<!ENTITY Eta "&#919;">
<!ENTITY eta "&#951;">
<!ENTITY ETH "&#208;">
<!ENTITY eth "&#240;">
<!ENTITY Euml "&#203;">
<!ENTITY euml "&#235;">
<!ENTITY euro "&#8364;">
<!ENTITY exist "&#8707;">
<!ENTITY fnof "&#402;">
<!ENTITY forall "&#8704;">
<!ENTITY frac12 "&#189;">
<!ENTITY frac14 "&#188;">
<!ENTITY frac34 "&#190;">
<!ENTITY frasl "&#8260;">
<!ENTITY Gamma "&#915;">
<!ENTITY gamma "&#947;">
<!ENTITY ge "&#8805;">
<!ENTITY gt "&#62;">
<!ENTITY harr "&#8596;">
<!ENTITY hArr "&#8660;">
<!ENTITY hearts "&#9829;">
<!ENTITY hellip "&#8230;">
<!ENTITY Iacute "&#205;">
<!ENTITY iacute "&#237;">
<!ENTITY Icirc "&#206;">
<!ENTITY icirc "&#238;">
<!ENTITY iexcl "&#161;">
<!ENTITY Igrave "&#204;">
<!ENTITY igrave "&#236;">
<!ENTITY image "&#8465;">
<!ENTITY infin "&#8734;">
<!ENTITY int "&#8747;">
<!ENTITY Iota "&#921;">
<!ENTITY iota "&#953;">
<!ENTITY iquest "&#191;">
<!ENTITY isin "&#8712;">
<!ENTITY Iuml "&#207;">
<!ENTITY iuml "&#239;">
<!ENTITY Kappa "&#922;">
<!ENTITY kappa "&#954;">
<!ENTITY Lambda "&#923;">
<!ENTITY lambda "&#955;">
<!ENTITY lang "&#9001;">
<!ENTITY laquo "&#171;">
<!ENTITY larr "&#8592;">
<!ENTITY lArr "&#8656;">
<!ENTITY lceil "&#8968;">
<!ENTITY ldquo "&#8220;">
<!ENTITY le "&#8804;">
<!ENTITY lfloor "&#8970;">
<!ENTITY lowast "&#8727;">
<!ENTITY loz "&#9674;">
<!ENTITY lrm "&#8206;">
<!ENTITY lsaquo "&#8249;">
<!ENTITY lsquo "&#8216;">
<!ENTITY lt "&#60;">
<!ENTITY macr "&#175;">
<!ENTITY mdash "&#8212;">
<!ENTITY micro "&#181;">
<!ENTITY middot "&#183;">
<!ENTITY minus "&#8722;">
<!ENTITY Mu "&#924;">
<!ENTITY mu "&#956;">
<!ENTITY nabla "&#8711;">
<!ENTITY nbsp "&#160;">
<!ENTITY ndash "&#8211;">
<!ENTITY ne "&#8800;">
<!ENTITY ni "&#8715;">
<!ENTITY not "&#172;">
<!ENTITY notin "&#8713;">
<!ENTITY nsub "&#8836;">
<!ENTITY Ntilde "&#209;">
<!ENTITY ntilde "&#241;">
<!ENTITY Nu "&#925;">
<!ENTITY nu "&#957;">
<!ENTITY Oacute "&#211;">
<!ENTITY oacute "&#243;">
<!ENTITY Ocirc "&#212;">
<!ENTITY ocirc "&#244;">
<!ENTITY OElig "&#338;">
<!ENTITY oelig "&#339;">
<!ENTITY Ograve "&#210;">
<!ENTITY ograve "&#242;">
<!ENTITY oline "&#8254;">
<!ENTITY Omega "&#937;">
<!ENTITY omega "&#969;">
<!ENTITY Omicron "&#927;">
<!ENTITY omicron "&#959;">
<!ENTITY oplus "&#8853;">
<!ENTITY or "&#8744;">
<!ENTITY ordf "&#170;">
<!ENTITY ordm "&#186;">
<!ENTITY Oslash "&#216;">
<!ENTITY oslash "&#248;">
<!ENTITY Otilde "&#213;">
<!ENTITY otilde "&#245;">
<!ENTITY otimes "&#8855;">
<!ENTITY Ouml "&#214;">
<!ENTITY ouml "&#246;">
<!ENTITY para "&#182;">
<!ENTITY part "&#8706;">
<!ENTITY permil "&#8240;">
<!ENTITY perp "&#8869;">
<!ENTITY Phi "&#934;">
<!ENTITY phi "&#966;">
<!ENTITY Pi "&#928;">
<!ENTITY pi "&#960;">
<!ENTITY piv "&#982;">
<!ENTITY plusmn "&#177;">
<!ENTITY pound "&#163;">
<!ENTITY prime "&#8242;">
<!ENTITY Prime "&#8243;">
<!ENTITY prod "&#8719;">
<!ENTITY prop "&#8733;">
<!ENTITY Psi "&#936;">
<!ENTITY psi "&#968;">
<!ENTITY radic "&#8730;">
<!ENTITY rang "&#9002;">
<!ENTITY raquo "&#187;">
<!ENTITY rarr "&#8594;">
<!ENTITY rArr "&#8658;">
<!ENTITY rceil "&#8969;">
<!ENTITY rdquo "&#8221;">
<!ENTITY real "&#8476;">
<!ENTITY reg "&#174;">
<!ENTITY rfloor "&#8971;">
<!ENTITY Rho "&#929;">
<!ENTITY rho "&#961;">
<!ENTITY rlm "&#8207;">
<!ENTITY rsaquo "&#8250;">
<!ENTITY rsquo "&#8217;">
<!ENTITY sbquo "&#8218;">
<!ENTITY Scaron "&#352;">
<!ENTITY scaron "&#353;">
<!ENTITY sdot "&#8901;">
<!ENTITY sect "&#167;">
<!ENTITY shy "&#173;">
<!ENTITY Sigma "&#931;">
<!ENTITY sigma "&#963;">
<!ENTITY sigmaf "&#962;">
<!ENTITY sim "&#8764;">
<!ENTITY spades "&#9824;">
<!ENTITY sub "&#8834;">
<!ENTITY sube "&#8838;">
<!ENTITY sum "&#8721;">
<!ENTITY sup "&#8835;">
<!ENTITY sup1 "&#185;">
<!ENTITY sup2 "&#178;">
<!ENTITY sup3 "&#179;">
<!ENTITY supe "&#8839;">
<!ENTITY szlig "&#223;">
<!ENTITY Tau "&#932;">
<!ENTITY tau "&#964;">
<!ENTITY there4 "&#8756;">
<!ENTITY Theta "&#920;">
<!ENTITY theta "&#952;">
<!ENTITY thetasym "&#977;">
<!ENTITY thinsp "&#8201;">
<!ENTITY THORN "&#222;">
<!ENTITY thorn "&#254;">
<!ENTITY tilde "&#732;">
<!ENTITY times "&#215;">
<!ENTITY trade "&#8482;">
<!ENTITY Uacute "&#218;">
<!ENTITY uacute "&#250;">
<!ENTITY uarr "&#8593;">
<!ENTITY uArr "&#8657;">
<!ENTITY Ucirc "&#219;">
<!ENTITY ucirc "&#251;">
<!ENTITY Ugrave "&#217;">
<!ENTITY ugrave "&#249;">
<!ENTITY uml "&#168;">
<!ENTITY upsih "&#978;">
<!ENTITY Upsilon "&#933;">
<!ENTITY upsilon "&#965;">
<!ENTITY Uuml "&#220;">
<!ENTITY uuml "&#252;">
<!ENTITY weierp "&#8472;">
<!ENTITY Xi "&#926;">
<!ENTITY xi "&#958;">
<!ENTITY Yacute "&#221;">
<!ENTITY yacute "&#253;">
<!ENTITY yen "&#165;">
<!ENTITY yuml "&#255;">
<!ENTITY Yuml "&#376;">
<!ENTITY Zeta "&#918;">
<!ENTITY zeta "&#950;">
<!ENTITY zwj "&#8205;">
<!ENTITY zwnj "&#8204;">
`.replace(/\n/g, ' ');

const HEADER = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [ ${HTML_ENTITIES} ]>
`;
