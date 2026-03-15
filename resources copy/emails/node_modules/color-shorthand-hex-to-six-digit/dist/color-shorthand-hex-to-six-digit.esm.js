/**
 * @name color-shorthand-hex-to-six-digit
 * @fileoverview Convert shorthand hex color codes into full
 * @version 5.1.3
 * @author Roy Revelt
 * @license MIT
 * {@link https://codsen.com/os/color-shorthand-hex-to-six-digit/}
 */

import p from"hex-color-regex";import{isPlainObject as o}from"codsen-utils";import a from"rfdc";var s="5.1.3";var u=a(),x=s;function n(r){if(typeof r!="string"&&!Array.isArray(r)&&!o(r))return r;function i(e,t,c,l){return l[c-1]!=="&"&&e.length===4&&e.charAt(0)==="#"?`#${e.charAt(1)}${e.charAt(1)}${e.charAt(2)}${e.charAt(2)}${e.charAt(3)}${e.charAt(3)}`.toLowerCase():e.toLowerCase()}if(typeof r=="string")return r.replace(p(),i);if(Array.isArray(r))return r.map(n);if(o(r)){let e=u(r);return Object.keys(e).forEach(t=>{e[t]=n(e[t])}),e}return r}export{n as conv,x as version};
