/**
 * @name object-boolean-combinations
 * @fileoverview Consumes a defaults object with booleans, generates all possible variations of it
 * @version 6.2.3
 * @author Roy Revelt
 * @license MIT
 * {@link https://codsen.com/os/object-boolean-combinations/}
 */

import{isPlainObject as i,intersection as y}from"codsen-utils";import O from"rfdc";var j="6.2.3";var f=O(),_=j;function R(c,l={}){function h(e){let t=[];for(let n=0;n<1<<e;n++){let r=[];for(let u=0;u<e;u++)r.push(n&1<<u?1:0);t.push(r)}return t}if(!c)throw new Error("[THROW_ID_01] missing input object");if(!i(c))throw new Error("[THROW_ID_02] the first input object must be a plain object");if(l&&!i(l))throw new Error("[THROW_ID_03] the second override object must be a plain object");let m=f(c),o=f(l),s=Object.keys(m),p=[],b=[];i(o)&&Object.keys(o).length&&(b=y(Object.keys(o),Object.keys(m)),s=s.filter(e=>!b.includes(e)));let d=h(Object.keys(s).length),a;return d.forEach((e,t)=>{a={},s.forEach((n,r)=>{a[n]=d[t][r]===1}),p.push(a)}),i(o)&&Object.keys(o).length&&p.forEach(e=>{b.forEach(t=>{e[t]=o[t]})}),p}export{R as combinations,_ as version};
