/**
 * @name array-pull-all-with-glob
 * @fileoverview Like _.pullAll but with globs (wildcards)
 * @version 7.1.3
 * @author Roy Revelt
 * @license MIT
 * {@link https://codsen.com/os/array-pull-all-with-glob/}
 */

import{isMatch as a}from"matcher";var r="7.1.3";var h=r,c={caseSensitive:!0};function y(e,t,s){if(!e.length)return[];if(!e.length||!t.length)return Array.from(e);let l=typeof t=="string"?[t]:Array.from(t),n={...c,...s};return Array.from(e).filter(i=>!l.some(p=>a(i,p,{caseSensitive:n.caseSensitive})))}export{c as defaults,y as pull,h as version};
