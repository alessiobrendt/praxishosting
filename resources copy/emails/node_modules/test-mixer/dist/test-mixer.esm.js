/**
 * @name test-mixer
 * @fileoverview Test helper to generate function opts object variations
 * @version 4.2.3
 * @author Roy Revelt
 * @license MIT
 * {@link https://codsen.com/os/test-mixer/}
 */

import{combinations as u}from"object-boolean-combinations";import m from"rfdc";var i="4.2.3";var l=m(),f=i;function y(o={},t={}){if(o&&typeof o!="object")throw new Error("test-mixer: [THROW_ID_01] the first input arg is missing!");if(t&&typeof t!="object")throw new Error("test-mixer: [THROW_ID_02] the second input arg is missing!");let s;if(typeof o=="object"&&typeof t=="object"&&Object.keys(o).filter(e=>typeof o[e]=="boolean").some(e=>Object.keys(t).includes(e)?!1:(s=e,!0)))throw new Error(`test-mixer: [THROW_ID_03] the second input arg object should be defaults; it should be a superset of 1st input arg object. However, 1st input arg object contains key "${s}" which 2nd input arg object doesn't have.`);if(!Object.keys(t).length)return[];let c=l(o),n=l(t),r={};return Object.keys(t).forEach(e=>{typeof n[e]=="boolean"&&!Object.keys(o).includes(e)&&(r[e]=n[e])}),u(r).map(e=>({...t,...c,...e}))}export{y as mixer,f as version};
