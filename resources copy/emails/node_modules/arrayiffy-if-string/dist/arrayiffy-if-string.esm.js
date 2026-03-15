/**
 * @name arrayiffy-if-string
 * @fileoverview Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.
 * @version 5.1.3
 * @author Roy Revelt
 * @license MIT
 * {@link https://codsen.com/os/arrayiffy-if-string/}
 */

function r(n){return typeof n!="string"?n:n.length?[n]:[]}export{r as arrayiffy};
