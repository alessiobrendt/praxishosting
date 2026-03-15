/**
 * @name string-character-is-astral-surrogate
 * @fileoverview Tells, is given character a part of astral character, specifically, a high and low surrogate
 * @version 3.1.3
 * @author Roy Revelt
 * @license MIT
 * {@link https://codsen.com/os/string-character-is-astral-surrogate/}
 */

"use strict";var stringCharacterIsAstralSurrogate=(()=>{var a=Object.defineProperty;var u=Object.getOwnPropertyDescriptor;var f=Object.getOwnPropertyNames;var o=Object.prototype.hasOwnProperty;var s=(r,t)=>{for(var n in t)a(r,n,{get:t[n],enumerable:!0})},d=(r,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let e of f(t))!o.call(r,e)&&e!==n&&a(r,e,{get:()=>t[e],enumerable:!(i=u(t,e))||i.enumerable});return r};var c=r=>d(a({},"__esModule",{value:!0}),r);var g={};s(g,{isHighSurrogate:()=>l,isLowSurrogate:()=>p});function l(r){if(typeof r=="string")return r.length===0?!1:r.charCodeAt(0)>=55296&&r.charCodeAt(0)<=56319;if(r===void 0)return!1;throw new TypeError("string-character-is-astral-surrogate/isHighSurrogate(): the input is not string but ".concat(typeof r))}function p(r){if(typeof r=="string")return r.length===0?!1:r.charCodeAt(0)>=56320&&r.charCodeAt(0)<=57343;if(r===void 0)return!1;throw new TypeError("string-character-is-astral-surrogate/isLowSurrogate(): the input is not string but ".concat(typeof r))}return c(g);})();
