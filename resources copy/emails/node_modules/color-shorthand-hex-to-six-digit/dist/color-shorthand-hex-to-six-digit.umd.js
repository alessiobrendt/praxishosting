/**
 * @name color-shorthand-hex-to-six-digit
 * @fileoverview Convert shorthand hex color codes into full
 * @version 5.1.3
 * @author Roy Revelt
 * @license MIT
 * {@link https://codsen.com/os/color-shorthand-hex-to-six-digit/}
 */

"use strict";var colorShorthandHexToSixDigit=(()=>{var E=Object.create;var m=Object.defineProperty;var L=Object.getOwnPropertyDescriptor;var M=Object.getOwnPropertyNames;var R=Object.getPrototypeOf,F=Object.prototype.hasOwnProperty;var x=(e,n)=>()=>(n||e((n={exports:{}}).exports,n),n.exports),P=(e,n)=>{for(var s in n)m(e,s,{get:n[s],enumerable:!0})},O=(e,n,s,l)=>{if(n&&typeof n=="object"||typeof n=="function")for(let c of M(n))!F.call(e,c)&&c!==s&&m(e,c,{get:()=>n[c],enumerable:!(l=L(n,c))||l.enumerable});return e};var g=(e,n,s)=>(s=e!=null?E(R(e)):{},O(n||!e||!e.__esModule?m(s,"default",{value:e,enumerable:!0}):s,e)),N=e=>O(m({},"__esModule",{value:!0}),e);var C=x((W,v)=>{"use strict";v.exports=function(n){return n=n&&typeof n=="object"?n:{},n.strict?/^#([a-f0-9]{3,4}|[a-f0-9]{4}(?:[a-f0-9]{2}){1,2})\b$/i:/#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})\b/gi}});var b=x((_,S)=>{"use strict";S.exports=T;function y(e){return e instanceof Buffer?Buffer.from(e):new e.constructor(e.buffer.slice(),e.byteOffset,e.length)}function T(e){if(e=e||{},e.circles)return H(e);let n=new Map;if(n.set(Date,o=>new Date(o)),n.set(Map,(o,u)=>new Map(l(Array.from(o),u))),n.set(Set,(o,u)=>new Set(l(Array.from(o),u))),e.constructorHandlers)for(let o of e.constructorHandlers)n.set(o[0],o[1]);let s=null;return e.proto?p:c;function l(o,u){let r=Object.keys(o),t=new Array(r.length);for(let a=0;a<r.length;a++){let i=r[a],f=o[i];typeof f!="object"||f===null?t[i]=f:f.constructor!==Object&&(s=n.get(f.constructor))?t[i]=s(f,u):ArrayBuffer.isView(f)?t[i]=y(f):t[i]=u(f)}return t}function c(o){if(typeof o!="object"||o===null)return o;if(Array.isArray(o))return l(o,c);if(o.constructor!==Object&&(s=n.get(o.constructor)))return s(o,c);let u={};for(let r in o){if(Object.hasOwnProperty.call(o,r)===!1)continue;let t=o[r];typeof t!="object"||t===null?u[r]=t:t.constructor!==Object&&(s=n.get(t.constructor))?u[r]=s(t,c):ArrayBuffer.isView(t)?u[r]=y(t):u[r]=c(t)}return u}function p(o){if(typeof o!="object"||o===null)return o;if(Array.isArray(o))return l(o,p);if(o.constructor!==Object&&(s=n.get(o.constructor)))return s(o,p);let u={};for(let r in o){let t=o[r];typeof t!="object"||t===null?u[r]=t:t.constructor!==Object&&(s=n.get(t.constructor))?u[r]=s(t,p):ArrayBuffer.isView(t)?u[r]=y(t):u[r]=p(t)}return u}}function H(e){let n=[],s=[],l=new Map;if(l.set(Date,r=>new Date(r)),l.set(Map,(r,t)=>new Map(p(Array.from(r),t))),l.set(Set,(r,t)=>new Set(p(Array.from(r),t))),e.constructorHandlers)for(let r of e.constructorHandlers)l.set(r[0],r[1]);let c=null;return e.proto?u:o;function p(r,t){let a=Object.keys(r),i=new Array(a.length);for(let f=0;f<a.length;f++){let h=a[f],d=r[h];if(typeof d!="object"||d===null)i[h]=d;else if(d.constructor!==Object&&(c=l.get(d.constructor)))i[h]=c(d,t);else if(ArrayBuffer.isView(d))i[h]=y(d);else{let j=n.indexOf(d);j!==-1?i[h]=s[j]:i[h]=t(d)}}return i}function o(r){if(typeof r!="object"||r===null)return r;if(Array.isArray(r))return p(r,o);if(r.constructor!==Object&&(c=l.get(r.constructor)))return c(r,o);let t={};n.push(r),s.push(t);for(let a in r){if(Object.hasOwnProperty.call(r,a)===!1)continue;let i=r[a];if(typeof i!="object"||i===null)t[a]=i;else if(i.constructor!==Object&&(c=l.get(i.constructor)))t[a]=c(i,o);else if(ArrayBuffer.isView(i))t[a]=y(i);else{let f=n.indexOf(i);f!==-1?t[a]=s[f]:t[a]=o(i)}}return n.pop(),s.pop(),t}function u(r){if(typeof r!="object"||r===null)return r;if(Array.isArray(r))return p(r,u);if(r.constructor!==Object&&(c=l.get(r.constructor)))return c(r,u);let t={};n.push(r),s.push(t);for(let a in r){let i=r[a];if(typeof i!="object"||i===null)t[a]=i;else if(i.constructor!==Object&&(c=l.get(i.constructor)))t[a]=c(i,u);else if(ArrayBuffer.isView(i))t[a]=y(i);else{let f=n.indexOf(i);f!==-1?t[a]=s[f]:t[a]=u(i)}}return n.pop(),s.pop(),t}}});var U={};P(U,{conv:()=>w,version:()=>Q});var D=g(C(),1);var k=g(b(),1);var q=(0,k.default)();function A(e){if(e==null||typeof e!="object")return!1;let n=Object.getPrototypeOf(e);return n!==null&&n!==Object.prototype&&Object.getPrototypeOf(n)!==null?!1:!(Symbol.iterator in e)&&!(Symbol.toStringTag in e)}var $=g(b(),1);var B="5.1.3";var V=(0,$.default)(),Q=B;function w(e){if(typeof e!="string"&&!Array.isArray(e)&&!A(e))return e;function n(s,l,c,p){return p[c-1]!=="&"&&s.length===4&&s.charAt(0)==="#"?"#".concat(s.charAt(1)).concat(s.charAt(1)).concat(s.charAt(2)).concat(s.charAt(2)).concat(s.charAt(3)).concat(s.charAt(3)).toLowerCase():s.toLowerCase()}if(typeof e=="string")return e.replace((0,D.default)(),n);if(Array.isArray(e))return e.map(w);if(A(e)){let s=V(e);return Object.keys(s).forEach(l=>{s[l]=w(s[l])}),s}return e}return N(U);})();
/**
 * @name codsen-utils
 * @fileoverview Various utility functions
 * @version 1.7.3
 * @author Roy Revelt
 * @license MIT
 * {@link https://codsen.com/os/codsen-utils/}
 */
/*! Bundled license information:

hex-color-regex/index.js:
  (*!
   * hex-color-regex <https://github.com/regexps/hex-color-regex>
   *
   * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
   * Released under the MIT license.
   *)
*/
