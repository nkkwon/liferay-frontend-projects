define(["exports"],function(e){"use strict";function n(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function e(e,n){for(var r=0;r<n.length;r++){var t=n[r];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(n,r,t){return r&&e(n.prototype,r),t&&e(n,t),n}}(),t=function(){function e(){n(this,e)}return r(e,null,[{key:"caseInsensitiveCompare",value:function(e,n){var r=String(e).toLowerCase(),t=String(n).toLowerCase();return r<t?-1:r===t?0:1}},{key:"collapseBreakingSpaces",value:function(e){return e.replace(/[\t\r\n ]+/g," ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g,"")}},{key:"escapeRegex",value:function(e){return String(e).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08")}},{key:"getRandomString",value:function(){var e=2147483648;return Math.floor(Math.random()*e).toString(36)+Math.abs(Math.floor(Math.random()*e)^Date.now()).toString(36)}},{key:"hashCode",value:function(e){for(var n=0,r=0,t=e.length;r<t;r++)n=31*n+e.charCodeAt(r),n%=4294967296;return n}},{key:"replaceInterval",value:function(e,n,r,t){return e.substring(0,n)+t+e.substring(r)}}]),e}();e["default"]=t});