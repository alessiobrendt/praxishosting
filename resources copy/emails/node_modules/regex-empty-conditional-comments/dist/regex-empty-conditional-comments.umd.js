/**
 * @name regex-empty-conditional-comments
 * @fileoverview Regular expression for matching HTML empty conditional comments
 * @version 3.1.3
 * @author Roy Revelt
 * @license MIT
 * {@link https://codsen.com/os/regex-empty-conditional-comments/}
 */

"use strict";var regexEmptyConditionalComments=(()=>{var o=Object.defineProperty;var p=Object.getOwnPropertyDescriptor;var c=Object.getOwnPropertyNames;var m=Object.prototype.hasOwnProperty;var l=(t,e)=>{for(var s in e)o(t,s,{get:e[s],enumerable:!0})},d=(t,e,s,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of c(e))!m.call(t,n)&&n!==s&&o(t,n,{get:()=>e[n],enumerable:!(r=p(e,n))||r.enumerable});return t};var u=t=>d(o({},"__esModule",{value:!0}),t);var y={};l(y,{emptyCondCommentRegex:()=>x,version:()=>g});var i="3.1.3";var g=i;function x(){return/<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi}return u(y);})();
