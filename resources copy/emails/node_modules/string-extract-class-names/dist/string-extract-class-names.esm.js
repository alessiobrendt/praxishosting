/**
 * @name string-extract-class-names
 * @fileoverview Extracts CSS class/id names from a string
 * @version 8.1.3
 * @author Roy Revelt
 * @license MIT
 * {@link https://codsen.com/os/string-extract-class-names/}
 */

import{left as u,right as s}from"string-left-right";var a="8.1.3";var $=a;function y(e){if(typeof e!="string")throw new TypeError(`string-extract-class-names: [THROW_ID_01] first str should be string, not ${typeof e}, currently equal to ${JSON.stringify(e,null,4)}`);let m=".# ~\\!@$%^&*()+=,/';:\"?><[]{}|`",o;function c(t){return typeof t=="string"&&!!t.length&&(t.charCodeAt(0)>64&&t.charCodeAt(0)<91||t.charCodeAt(0)>96&&t.charCodeAt(0)<123)}let n=null,i={res:[],ranges:[]};for(let t=0,p=e.length;t<=p;t++){n!==null&&t>=n&&(!e[t]?.trim()||m.includes(e[t]))&&(t>n+1&&(i.ranges.push([n,t]),i.res.push(`${o||""}${e.slice(n,t)}`),o&&(o=void 0)),n=null),e[t]&&n===null&&(e[t]==="."||e[t]==="#")&&(n=t);let r=s(e,t+4);e.startsWith("class",t)&&typeof u(e,t)=="number"&&e[u(e,t)]==="["&&typeof r=="number"&&e[r]==="="&&(s(e,r)&&c(e[s(e,r)])?n=s(e,r):`'"`.includes(e[s(e,r)])&&c(e[s(e,s(e,r))])&&(n=s(e,s(e,r))),o=".");let l=s(e,t+1);e.startsWith("id",t)&&e[u(e,t)]==="["&&l!==null&&e[l]==="="&&(c(e[s(e,l)])?n=s(e,l):`'"`.includes(e[s(e,l)])&&c(e[s(e,s(e,l))])&&(n=s(e,s(e,l))),o="#")}return i.ranges.length||(i.ranges=null),i}export{y as extract,$ as version};
