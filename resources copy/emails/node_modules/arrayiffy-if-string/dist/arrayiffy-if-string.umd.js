/**
 * @name arrayiffy-if-string
 * @fileoverview Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * @version 5.1.3
 * @author Roy Revelt
 * @license MIT
 * {@link https://codsen.com/os/arrayiffy-if-string/}
 */

"use strict";var arrayiffyIfString=(()=>{var e=Object.defineProperty;var f=Object.getOwnPropertyDescriptor;var g=Object.getOwnPropertyNames;var s=Object.prototype.hasOwnProperty;var x=(n,r)=>{for(var T in r)e(n,T,{get:r[T],enumerable:!0})},y=(n,r,T,i)=>{if(r&&typeof r=="object"||typeof r=="function")for(let t of g(r))!s.call(n,t)&&t!==T&&e(n,t,{get:()=>r[t],enumerable:!(i=f(r,t))||i.enumerable});return n};var u=n=>y(e({},"__esModule",{value:!0}),n);var o={};x(o,{arrayiffy:()=>a});function a(n){return typeof n!="string"?n:n.length?[n]:[]}return u(o);})();
