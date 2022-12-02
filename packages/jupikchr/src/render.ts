import pikchrWasm from 'pikchr-wasm';

import { PromiseDelegate } from '@lumino/coreutils';

import {
  JP_UI_FONT_FAMILY,
  PIKCHR_DARK_MODE,
  RE_VIEWBOX,
  TPikchrFormat,
} from './tokens';

let initializing: PromiseDelegate<void> | null = null;

export async function initialize(): Promise<void> {
  if (initializing) {
    return initializing.promise;
  }
  initializing = new PromiseDelegate();
  await pikchrWasm.loadWASM();
  initializing.resolve(void 0);
}

export interface IOptions {
  tag?: TPikchrFormat;
  dark?: boolean;
}

export function render(content: string, options: IOptions = {}): string {
  let { dark, tag } = options;
  if (dark == null) {
    dark = document.body.dataset.jpThemeLight === 'false';
  }
  const flags = dark ? PIKCHR_DARK_MODE : 0;

  let result = pikchrWasm.render(content.trim(), 'pikchr', flags);

  if (result.includes('<svg')) {
    // sanitize
    switch (options.tag) {
      case undefined:
      case null:
      case 'img':
        result = `${HEADER}${result}`;
        const fontFamily = getComputedStyle(document.body).getPropertyValue(
          JP_UI_FONT_FAMILY
        );
        // defaults to serif, re-use the current lab stack
        result = result.replace(
          '</svg>',
          `<style>text { font-family: ${fontFamily}; }</style></svg>`
        );
        const viewBox = result.match(RE_VIEWBOX);
        const styles = [];
        let dimensions = '';
        if (viewBox != null) {
          styles.push(`max-width:${viewBox[3]}px`, `max-height:${viewBox[4]}px`);
          dimensions = `height="${viewBox[3]}" height="${viewBox[4]}"`;
        }
        // markdown-it strips svg
        result = `<img
              class="pikchr"
              ${dimensions}
              style="${styles.join(';')}"
              src="${`data:image/svg+xml,${encodeURIComponent(result)}`}"
            />`;
        break;
      case 'svg':
        break;
      default:
        result = `<pre>Can't render as <${tag}></pre>`;
    }
  }
  return result;
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
