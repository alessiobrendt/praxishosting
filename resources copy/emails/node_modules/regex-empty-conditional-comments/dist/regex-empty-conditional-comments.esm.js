/**
 * @name regex-empty-conditional-comments
 * @fileoverview Regular expression for matching HTML empty conditional comments
 * @version 3.1.3
 * @author Roy Revelt
 * @license MIT
 * {@link https://codsen.com/os/regex-empty-conditional-comments/}
 */

var e="3.1.3";var o=e;function r(){return/<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi}export{r as emptyCondCommentRegex,o as version};
