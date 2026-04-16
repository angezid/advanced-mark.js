/*! jQuery v3.6.0 | (c) OpenJS Foundation and other contributors | jquery.org/license */
!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(C,e){"use strict";var t=[],r=Object.getPrototypeOf,s=t.slice,g=t.flat?function(e){return t.flat.call(e)}:function(e){return t.concat.apply([],e)},u=t.push,i=t.indexOf,n={},o=n.toString,v=n.hasOwnProperty,a=v.toString,l=a.call(Object),y={},m=function(e){return"function"==typeof e&&"number"!=typeof e.nodeType&&"function"!=typeof e.item},x=function(e){return null!=e&&e===e.window},E=C.document,c={type:!0,src:!0,nonce:!0,noModule:!0};function b(e,t,n){var r,i,o=(n=n||E).createElement("script");if(o.text=e,t)for(r in c)(i=t[r]||t.getAttribute&&t.getAttribute(r))&&o.setAttribute(r,i);n.head.appendChild(o).parentNode.removeChild(o)}function w(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?n[o.call(e)]||"object":typeof e}var f="3.6.0",S=function(e,t){return new S.fn.init(e,t)};function p(e){var t=!!e&&"length"in e&&e.length,n=w(e);return!m(e)&&!x(e)&&("array"===n||0===t||"number"==typeof t&&0<t&&t-1 in e)}S.fn=S.prototype={jquery:f,constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return S.each(this,e)},map:function(n){return this.pushStack(S.map(this,function(e,t){return n.call(e,t,e)}))},slice:function(){return this.pushStack(s.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},even:function(){return this.pushStack(S.grep(this,function(e,t){return(t+1)%2}))},odd:function(){return this.pushStack(S.grep(this,function(e,t){return t%2}))},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(0<=n&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:u,sort:t.sort,splice:t.splice},S.extend=S.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||m(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)r=e[t],"__proto__"!==t&&a!==r&&(l&&r&&(S.isPlainObject(r)||(i=Array.isArray(r)))?(n=a[t],o=i&&!Array.isArray(n)?[]:i||S.isPlainObject(n)?n:{},i=!1,a[t]=S.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},S.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==o.call(e))&&(!(t=r(e))||"function"==typeof(n=v.call(t,"constructor")&&t.constructor)&&a.call(n)===l)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e,t,n){b(e,{nonce:t&&t.nonce},n)},each:function(e,t){var n,r=0;if(p(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},makeArray:function(e,t){var n=t||[];return null!=e&&(p(Object(e))?S.merge(n,"string"==typeof e?[e]:e):u.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:i.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r=[],i=0,o=e.length,a=!n;i<o;i++)!t(e[i],i)!==a&&r.push(e[i]);return r},map:function(e,t,n){var r,i,o=0,a=[];if(p(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&a.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&a.push(i);return g(a)},guid:1,support:y}),"function"==typeof Symbol&&(S.fn[Symbol.iterator]=t[Symbol.iterator]),S.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){n["[object "+t+"]"]=t.toLowerCase()});var d=function(n){var e,d,b,o,i,h,f,g,w,u,l,T,C,a,E,v,s,c,y,S="sizzle"+1*new Date,p=n.document,k=0,r=0,m=ue(),x=ue(),A=ue(),N=ue(),j=function(e,t){return e===t&&(l=!0),0},D={}.hasOwnProperty,t=[],q=t.pop,L=t.push,H=t.push,O=t.slice,P=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},R="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",I="(?:\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",W="\\["+M+"*("+I+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+I+"))|)"+M+"*\\]",F=":("+I+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+W+")*)|.*)\\)|)",B=new RegExp(M+"+","g"),$=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),_=new RegExp("^"+M+"*,"+M+"*"),z=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=new RegExp(M+"|>"),X=new RegExp(F),V=new RegExp("^"+I+"$"),G={ID:new RegExp("^#("+I+")"),CLASS:new RegExp("^\\.("+I+")"),TAG:new RegExp("^("+I+"|[*])"),ATTR:new RegExp("^"+W),PSEUDO:new RegExp("^"+F),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+R+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Y=/HTML$/i,Q=/^(?:input|select|textarea|button)$/i,J=/^h\d$/i,K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ee=/[+~]/,te=new RegExp("\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\([^\\r\\n\\f])","g"),ne=function(e,t){var n="0x"+e.slice(1)-65536;return t||(n<0?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,1023&n|56320))},re=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ie=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},oe=function(){T()},ae=be(function(e){return!0===e.disabled&&"fieldset"===e.nodeName.toLowerCase()},{dir:"parentNode",next:"legend"});try{H.apply(t=O.call(p.childNodes),p.childNodes),t[p.childNodes.length].nodeType}catch(e){H={apply:t.length?function(e,t){L.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function se(t,e,n,r){var i,o,a,s,u,l,c,f=e&&e.ownerDocument,p=e?e.nodeType:9;if(n=n||[],"string"!=typeof t||!t||1!==p&&9!==p&&11!==p)return n;if(!r&&(T(e),e=e||C,E)){if(11!==p&&(u=Z.exec(t)))if(i=u[1]){if(9===p){if(!(a=e.getElementById(i)))return n;if(a.id===i)return n.push(a),n}else if(f&&(a=f.getElementById(i))&&y(e,a)&&a.id===i)return n.push(a),n}else{if(u[2])return H.apply(n,e.getElementsByTagName(t)),n;if((i=u[3])&&d.getElementsByClassName&&e.getElementsByClassName)return H.apply(n,e.getElementsByClassName(i)),n}if(d.qsa&&!N[t+" "]&&(!v||!v.test(t))&&(1!==p||"object"!==e.nodeName.toLowerCase())){if(c=t,f=e,1===p&&(U.test(t)||z.test(t))){(f=ee.test(t)&&ye(e.parentNode)||e)===e&&d.scope||((s=e.getAttribute("id"))?s=s.replace(re,ie):e.setAttribute("id",s=S)),o=(l=h(t)).length;while(o--)l[o]=(s?"#"+s:":scope")+" "+xe(l[o]);c=l.join(",")}try{return H.apply(n,f.querySelectorAll(c)),n}catch(e){N(t,!0)}finally{s===S&&e.removeAttribute("id")}}}return g(t.replace($,"$1"),e,n,r)}function ue(){var r=[];return function e(t,n){return r.push(t+" ")>b.cacheLength&&delete e[r.shift()],e[t+" "]=n}}function le(e){return e[S]=!0,e}function ce(e){var t=C.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function fe(e,t){var n=e.split("|"),r=n.length;while(r--)b.attrHandle[n[r]]=t}function pe(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function de(t){return function(e){return"input"===e.nodeName.toLowerCase()&&e.type===t}}function he(n){return function(e){var t=e.nodeName.toLowerCase();return("input"===t||"button"===t)&&e.type===n}}function ge(t){return function(e){return"form"in e?e.parentNode&&!1===e.disabled?"label"in e?"label"in e.parentNode?e.parentNode.disabled===t:e.disabled===t:e.isDisabled===t||e.isDisabled!==!t&&ae(e)===t:e.disabled===t:"label"in e&&e.disabled===t}}function ve(a){return le(function(o){return o=+o,le(function(e,t){var n,r=a([],e.length,o),i=r.length;while(i--)e[n=r[i]]&&(e[n]=!(t[n]=e[n]))})})}function ye(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}for(e in d=se.support={},i=se.isXML=function(e){var t=e&&e.namespaceURI,n=e&&(e.ownerDocument||e).documentElement;return!Y.test(t||n&&n.nodeName||"HTML")},T=se.setDocument=function(e){var t,n,r=e?e.ownerDocument||e:p;return r!=C&&9===r.nodeType&&r.documentElement&&(a=(C=r).documentElement,E=!i(C),p!=C&&(n=C.defaultView)&&n.top!==n&&(n.addEventListener?n.addEventListener("unload",oe,!1):n.attachEvent&&n.attachEvent("onunload",oe)),d.scope=ce(function(e){return a.appendChild(e).appendChild(C.createElement("div")),"undefined"!=typeof e.querySelectorAll&&!e.querySelectorAll(":scope fieldset div").length}),d.attributes=ce(function(e){return e.className="i",!e.getAttribute("className")}),d.getElementsByTagName=ce(function(e){return e.appendChild(C.createComment("")),!e.getElementsByTagName("*").length}),d.getElementsByClassName=K.test(C.getElementsByClassName),d.getById=ce(function(e){return a.appendChild(e).id=S,!C.getElementsByName||!C.getElementsByName(S).length}),d.getById?(b.filter.ID=function(e){var t=e.replace(te,ne);return function(e){return e.getAttribute("id")===t}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&E){var n=t.getElementById(e);return n?[n]:[]}}):(b.filter.ID=function(e){var n=e.replace(te,ne);return function(e){var t="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return t&&t.value===n}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&E){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),b.find.TAG=d.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):d.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},b.find.CLASS=d.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&E)return t.getElementsByClassName(e)},s=[],v=[],(d.qsa=K.test(C.querySelectorAll))&&(ce(function(e){var t;a.appendChild(e).innerHTML="<a id='"+S+"'></a><select id='"+S+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&v.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||v.push("\\["+M+"*(?:value|"+R+")"),e.querySelectorAll("[id~="+S+"-]").length||v.push("~="),(t=C.createElement("input")).setAttribute("name",""),e.appendChild(t),e.querySelectorAll("[name='']").length||v.push("\\["+M+"*name"+M+"*="+M+"*(?:''|\"\")"),e.querySelectorAll(":checked").length||v.push(":checked"),e.querySelectorAll("a#"+S+"+*").length||v.push(".#.+[+~]"),e.querySelectorAll("\\\f"),v.push("[\\r\\n\\f]")}),ce(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=C.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&v.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&v.push(":enabled",":disabled"),a.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&v.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),v.push(",.*:")})),(d.matchesSelector=K.test(c=a.matches||a.webkitMatchesSelector||a.mozMatchesSelector||a.oMatchesSelector||a.msMatchesSelector))&&ce(function(e){d.disconnectedMatch=c.call(e,"*"),c.call(e,"[s!='']:x"),s.push("!=",F)}),v=v.length&&new RegExp(v.join("|")),s=s.length&&new RegExp(s.join("|")),t=K.test(a.compareDocumentPosition),y=t||K.test(a.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},j=t?function(e,t){if(e===t)return l=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n||(1&(n=(e.ownerDocument||e)==(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!d.sortDetached&&t.compareDocumentPosition(e)===n?e==C||e.ownerDocument==p&&y(p,e)?-1:t==C||t.ownerDocument==p&&y(p,t)?1:u?P(u,e)-P(u,t):0:4&n?-1:1)}:function(e,t){if(e===t)return l=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],s=[t];if(!i||!o)return e==C?-1:t==C?1:i?-1:o?1:u?P(u,e)-P(u,t):0;if(i===o)return pe(e,t);n=e;while(n=n.parentNode)a.unshift(n);n=t;while(n=n.parentNode)s.unshift(n);while(a[r]===s[r])r++;return r?pe(a[r],s[r]):a[r]==p?-1:s[r]==p?1:0}),C},se.matches=function(e,t){return se(e,null,null,t)},se.matchesSelector=function(e,t){if(T(e),d.matchesSelector&&E&&!N[t+" "]&&(!s||!s.test(t))&&(!v||!v.test(t)))try{var n=c.call(e,t);if(n||d.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(e){N(t,!0)}return 0<se(t,C,null,[e]).length},se.contains=function(e,t){return(e.ownerDocument||e)!=C&&T(e),y(e,t)},se.attr=function(e,t){(e.ownerDocument||e)!=C&&T(e);var n=b.attrHandle[t.toLowerCase()],r=n&&D.call(b.attrHandle,t.toLowerCase())?n(e,t,!E):void 0;return void 0!==r?r:d.attributes||!E?e.getAttribute(t):(r=e.getAttributeNode(t))&&r.specified?r.value:null},se.escape=function(e){return(e+"").replace(re,ie)},se.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},se.uniqueSort=function(e){var t,n=[],r=0,i=0;if(l=!d.detectDuplicates,u=!d.sortStable&&e.slice(0),e.sort(j),l){while(t=e[i++])t===e[i]&&(r=n.push(i));while(r--)e.splice(n[r],1)}return u=null,e},o=se.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e)}else if(3===i||4===i)return e.nodeValue}else while(t=e[r++])n+=o(t);return n},(b=se.selectors={cacheLength:50,createPseudo:le,match:G,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(te,ne),e[3]=(e[3]||e[4]||e[5]||"").replace(te,ne),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||se.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&se.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return G.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=h(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(te,ne).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=m[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&m(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(n,r,i){return function(e){var t=se.attr(e,n);return null==t?"!="===r:!r||(t+="","="===r?t===i:"!="===r?t!==i:"^="===r?i&&0===t.indexOf(i):"*="===r?i&&-1<t.indexOf(i):"$="===r?i&&t.slice(-i.length)===i:"~="===r?-1<(" "+t.replace(B," ")+" ").indexOf(i):"|="===r&&(t===i||t.slice(0,i.length+1)===i+"-"))}},CHILD:function(h,e,t,g,v){var y="nth"!==h.slice(0,3),m="last"!==h.slice(-4),x="of-type"===e;return 1===g&&0===v?function(e){return!!e.parentNode}:function(e,t,n){var r,i,o,a,s,u,l=y!==m?"nextSibling":"previousSibling",c=e.parentNode,f=x&&e.nodeName.toLowerCase(),p=!n&&!x,d=!1;if(c){if(y){while(l){a=e;while(a=a[l])if(x?a.nodeName.toLowerCase()===f:1===a.nodeType)return!1;u=l="only"===h&&!u&&"nextSibling"}return!0}if(u=[m?c.firstChild:c.lastChild],m&&p){d=(s=(r=(i=(o=(a=c)[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]||[])[0]===k&&r[1])&&r[2],a=s&&c.childNodes[s];while(a=++s&&a&&a[l]||(d=s=0)||u.pop())if(1===a.nodeType&&++d&&a===e){i[h]=[k,s,d];break}}else if(p&&(d=s=(r=(i=(o=(a=e)[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]||[])[0]===k&&r[1]),!1===d)while(a=++s&&a&&a[l]||(d=s=0)||u.pop())if((x?a.nodeName.toLowerCase()===f:1===a.nodeType)&&++d&&(p&&((i=(o=a[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]=[k,d]),a===e))break;return(d-=v)===g||d%g==0&&0<=d/g}}},PSEUDO:function(e,o){var t,a=b.pseudos[e]||b.setFilters[e.toLowerCase()]||se.error("unsupported pseudo: "+e);return a[S]?a(o):1<a.length?(t=[e,e,"",o],b.setFilters.hasOwnProperty(e.toLowerCase())?le(function(e,t){var n,r=a(e,o),i=r.length;while(i--)e[n=P(e,r[i])]=!(t[n]=r[i])}):function(e){return a(e,0,t)}):a}},pseudos:{not:le(function(e){var r=[],i=[],s=f(e.replace($,"$1"));return s[S]?le(function(e,t,n,r){var i,o=s(e,null,r,[]),a=e.length;while(a--)(i=o[a])&&(e[a]=!(t[a]=i))}):function(e,t,n){return r[0]=e,s(r,null,n,i),r[0]=null,!i.pop()}}),has:le(function(t){return function(e){return 0<se(t,e).length}}),contains:le(function(t){return t=t.replace(te,ne),function(e){return-1<(e.textContent||o(e)).indexOf(t)}}),lang:le(function(n){return V.test(n||"")||se.error("unsupported lang: "+n),n=n.replace(te,ne).toLowerCase(),function(e){var t;do{if(t=E?e.lang:e.getAttribute("xml:lang")||e.getAttribute("lang"))return(t=t.toLowerCase())===n||0===t.indexOf(n+"-")}while((e=e.parentNode)&&1===e.nodeType);return!1}}),target:function(e){var t=n.location&&n.location.hash;return t&&t.slice(1)===e.id},root:function(e){return e===a},focus:function(e){return e===C.activeElement&&(!C.hasFocus||C.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:ge(!1),disabled:ge(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!b.pseudos.empty(e)},header:function(e){return J.test(e.nodeName)},input:function(e){return Q.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:ve(function(){return[0]}),last:ve(function(e,t){return[t-1]}),eq:ve(function(e,t,n){return[n<0?n+t:n]}),even:ve(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:ve(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:ve(function(e,t,n){for(var r=n<0?n+t:t<n?t:n;0<=--r;)e.push(r);return e}),gt:ve(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=b.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})b.pseudos[e]=de(e);for(e in{submit:!0,reset:!0})b.pseudos[e]=he(e);function me(){}function xe(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function be(s,e,t){var u=e.dir,l=e.next,c=l||u,f=t&&"parentNode"===c,p=r++;return e.first?function(e,t,n){while(e=e[u])if(1===e.nodeType||f)return s(e,t,n);return!1}:function(e,t,n){var r,i,o,a=[k,p];if(n){while(e=e[u])if((1===e.nodeType||f)&&s(e,t,n))return!0}else while(e=e[u])if(1===e.nodeType||f)if(i=(o=e[S]||(e[S]={}))[e.uniqueID]||(o[e.uniqueID]={}),l&&l===e.nodeName.toLowerCase())e=e[u]||e;else{if((r=i[c])&&r[0]===k&&r[1]===p)return a[2]=r[2];if((i[c]=a)[2]=s(e,t,n))return!0}return!1}}function we(i){return 1<i.length?function(e,t,n){var r=i.length;while(r--)if(!i[r](e,t,n))return!1;return!0}:i[0]}function Te(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function Ce(d,h,g,v,y,e){return v&&!v[S]&&(v=Ce(v)),y&&!y[S]&&(y=Ce(y,e)),le(function(e,t,n,r){var i,o,a,s=[],u=[],l=t.length,c=e||function(e,t,n){for(var r=0,i=t.length;r<i;r++)se(e,t[r],n);return n}(h||"*",n.nodeType?[n]:n,[]),f=!d||!e&&h?c:Te(c,s,d,n,r),p=g?y||(e?d:l||v)?[]:t:f;if(g&&g(f,p,n,r),v){i=Te(p,u),v(i,[],n,r),o=i.length;while(o--)(a=i[o])&&(p[u[o]]=!(f[u[o]]=a))}if(e){if(y||d){if(y){i=[],o=p.length;while(o--)(a=p[o])&&i.push(f[o]=a);y(null,p=[],i,r)}o=p.length;while(o--)(a=p[o])&&-1<(i=y?P(e,a):s[o])&&(e[i]=!(t[i]=a))}}else p=Te(p===t?p.splice(l,p.length):p),y?y(null,t,p,r):H.apply(t,p)})}function Ee(e){for(var i,t,n,r=e.length,o=b.relative[e[0].type],a=o||b.relative[" "],s=o?1:0,u=be(function(e){return e===i},a,!0),l=be(function(e){return-1<P(i,e)},a,!0),c=[function(e,t,n){var r=!o&&(n||t!==w)||((i=t).nodeType?u(e,t,n):l(e,t,n));return i=null,r}];s<r;s++)if(t=b.relative[e[s].type])c=[be(we(c),t)];else{if((t=b.filter[e[s].type].apply(null,e[s].matches))[S]){for(n=++s;n<r;n++)if(b.relative[e[n].type])break;return Ce(1<s&&we(c),1<s&&xe(e.slice(0,s-1).concat({value:" "===e[s-2].type?"*":""})).replace($,"$1"),t,s<n&&Ee(e.slice(s,n)),n<r&&Ee(e=e.slice(n)),n<r&&xe(e))}c.push(t)}return we(c)}return me.prototype=b.filters=b.pseudos,b.setFilters=new me,h=se.tokenize=function(e,t){var n,r,i,o,a,s,u,l=x[e+" "];if(l)return t?0:l.slice(0);a=e,s=[],u=b.preFilter;while(a){for(o in n&&!(r=_.exec(a))||(r&&(a=a.slice(r[0].length)||a),s.push(i=[])),n=!1,(r=z.exec(a))&&(n=r.shift(),i.push({value:n,type:r[0].replace($," ")}),a=a.slice(n.length)),b.filter)!(r=G[o].exec(a))||u[o]&&!(r=u[o](r))||(n=r.shift(),i.push({value:n,type:o,matches:r}),a=a.slice(n.length));if(!n)break}return t?a.length:a?se.error(e):x(e,s).slice(0)},f=se.compile=function(e,t){var n,v,y,m,x,r,i=[],o=[],a=A[e+" "];if(!a){t||(t=h(e)),n=t.length;while(n--)(a=Ee(t[n]))[S]?i.push(a):o.push(a);(a=A(e,(v=o,m=0<(y=i).length,x=0<v.length,r=function(e,t,n,r,i){var o,a,s,u=0,l="0",c=e&&[],f=[],p=w,d=e||x&&b.find.TAG("*",i),h=k+=null==p?1:Math.random()||.1,g=d.length;for(i&&(w=t==C||t||i);l!==g&&null!=(o=d[l]);l++){if(x&&o){a=0,t||o.ownerDocument==C||(T(o),n=!E);while(s=v[a++])if(s(o,t||C,n)){r.push(o);break}i&&(k=h)}m&&((o=!s&&o)&&u--,e&&c.push(o))}if(u+=l,m&&l!==u){a=0;while(s=y[a++])s(c,f,t,n);if(e){if(0<u)while(l--)c[l]||f[l]||(f[l]=q.call(r));f=Te(f)}H.apply(r,f),i&&!e&&0<f.length&&1<u+y.length&&se.uniqueSort(r)}return i&&(k=h,w=p),c},m?le(r):r))).selector=e}return a},g=se.select=function(e,t,n,r){var i,o,a,s,u,l="function"==typeof e&&e,c=!r&&h(e=l.selector||e);if(n=n||[],1===c.length){if(2<(o=c[0]=c[0].slice(0)).length&&"ID"===(a=o[0]).type&&9===t.nodeType&&E&&b.relative[o[1].type]){if(!(t=(b.find.ID(a.matches[0].replace(te,ne),t)||[])[0]))return n;l&&(t=t.parentNode),e=e.slice(o.shift().value.length)}i=G.needsContext.test(e)?0:o.length;while(i--){if(a=o[i],b.relative[s=a.type])break;if((u=b.find[s])&&(r=u(a.matches[0].replace(te,ne),ee.test(o[0].type)&&ye(t.parentNode)||t))){if(o.splice(i,1),!(e=r.length&&xe(o)))return H.apply(n,r),n;break}}}return(l||f(e,c))(r,t,!E,n,!t||ee.test(e)&&ye(t.parentNode)||t),n},d.sortStable=S.split("").sort(j).join("")===S,d.detectDuplicates=!!l,T(),d.sortDetached=ce(function(e){return 1&e.compareDocumentPosition(C.createElement("fieldset"))}),ce(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||fe("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),d.attributes&&ce(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||fe("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ce(function(e){return null==e.getAttribute("disabled")})||fe(R,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),se}(C);S.find=d,S.expr=d.selectors,S.expr[":"]=S.expr.pseudos,S.uniqueSort=S.unique=d.uniqueSort,S.text=d.getText,S.isXMLDoc=d.isXML,S.contains=d.contains,S.escapeSelector=d.escape;var h=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&S(e).is(n))break;r.push(e)}return r},T=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},k=S.expr.match.needsContext;function A(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var N=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function j(e,n,r){return m(n)?S.grep(e,function(e,t){return!!n.call(e,t,e)!==r}):n.nodeType?S.grep(e,function(e){return e===n!==r}):"string"!=typeof n?S.grep(e,function(e){return-1<i.call(n,e)!==r}):S.filter(n,e,r)}S.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?S.find.matchesSelector(r,e)?[r]:[]:S.find.matches(e,S.grep(t,function(e){return 1===e.nodeType}))},S.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(S(e).filter(function(){for(t=0;t<r;t++)if(S.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)S.find(e,i[t],n);return 1<r?S.uniqueSort(n):n},filter:function(e){return this.pushStack(j(this,e||[],!1))},not:function(e){return this.pushStack(j(this,e||[],!0))},is:function(e){return!!j(this,"string"==typeof e&&k.test(e)?S(e):e||[],!1).length}});var D,q=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(S.fn.init=function(e,t,n){var r,i;if(!e)return this;if(n=n||D,"string"==typeof e){if(!(r="<"===e[0]&&">"===e[e.length-1]&&3<=e.length?[null,e,null]:q.exec(e))||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof S?t[0]:t,S.merge(this,S.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:E,!0)),N.test(r[1])&&S.isPlainObject(t))for(r in t)m(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return(i=E.getElementById(r[2]))&&(this[0]=i,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):m(e)?void 0!==n.ready?n.ready(e):e(S):S.makeArray(e,this)}).prototype=S.fn,D=S(E);var L=/^(?:parents|prev(?:Until|All))/,H={children:!0,contents:!0,next:!0,prev:!0};function O(e,t){while((e=e[t])&&1!==e.nodeType);return e}S.fn.extend({has:function(e){var t=S(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(S.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&S(e);if(!k.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?-1<a.index(n):1===n.nodeType&&S.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(1<o.length?S.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?i.call(S(e),this[0]):i.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(S.uniqueSort(S.merge(this.get(),S(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),S.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return h(e,"parentNode")},parentsUntil:function(e,t,n){return h(e,"parentNode",n)},next:function(e){return O(e,"nextSibling")},prev:function(e){return O(e,"previousSibling")},nextAll:function(e){return h(e,"nextSibling")},prevAll:function(e){return h(e,"previousSibling")},nextUntil:function(e,t,n){return h(e,"nextSibling",n)},prevUntil:function(e,t,n){return h(e,"previousSibling",n)},siblings:function(e){return T((e.parentNode||{}).firstChild,e)},children:function(e){return T(e.firstChild)},contents:function(e){return null!=e.contentDocument&&r(e.contentDocument)?e.contentDocument:(A(e,"template")&&(e=e.content||e),S.merge([],e.childNodes))}},function(r,i){S.fn[r]=function(e,t){var n=S.map(this,i,e);return"Until"!==r.slice(-5)&&(t=e),t&&"string"==typeof t&&(n=S.filter(t,n)),1<this.length&&(H[r]||S.uniqueSort(n),L.test(r)&&n.reverse()),this.pushStack(n)}});var P=/[^\x20\t\r\n\f]+/g;function R(e){return e}function M(e){throw e}function I(e,t,n,r){var i;try{e&&m(i=e.promise)?i.call(e).done(t).fail(n):e&&m(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}S.Callbacks=function(r){var e,n;r="string"==typeof r?(e=r,n={},S.each(e.match(P)||[],function(e,t){n[t]=!0}),n):S.extend({},r);var i,t,o,a,s=[],u=[],l=-1,c=function(){for(a=a||r.once,o=i=!0;u.length;l=-1){t=u.shift();while(++l<s.length)!1===s[l].apply(t[0],t[1])&&r.stopOnFalse&&(l=s.length,t=!1)}r.memory||(t=!1),i=!1,a&&(s=t?[]:"")},f={add:function(){return s&&(t&&!i&&(l=s.length-1,u.push(t)),function n(e){S.each(e,function(e,t){m(t)?r.unique&&f.has(t)||s.push(t):t&&t.length&&"string"!==w(t)&&n(t)})}(arguments),t&&!i&&c()),this},remove:function(){return S.each(arguments,function(e,t){var n;while(-1<(n=S.inArray(t,s,n)))s.splice(n,1),n<=l&&l--}),this},has:function(e){return e?-1<S.inArray(e,s):0<s.length},empty:function(){return s&&(s=[]),this},disable:function(){return a=u=[],s=t="",this},disabled:function(){return!s},lock:function(){return a=u=[],t||i||(s=t=""),this},locked:function(){return!!a},fireWith:function(e,t){return a||(t=[e,(t=t||[]).slice?t.slice():t],u.push(t),i||c()),this},fire:function(){return f.fireWith(this,arguments),this},fired:function(){return!!o}};return f},S.extend({Deferred:function(e){var o=[["notify","progress",S.Callbacks("memory"),S.Callbacks("memory"),2],["resolve","done",S.Callbacks("once memory"),S.Callbacks("once memory"),0,"resolved"],["reject","fail",S.Callbacks("once memory"),S.Callbacks("once memory"),1,"rejected"]],i="pending",a={state:function(){return i},always:function(){return s.done(arguments).fail(arguments),this},"catch":function(e){return a.then(null,e)},pipe:function(){var i=arguments;return S.Deferred(function(r){S.each(o,function(e,t){var n=m(i[t[4]])&&i[t[4]];s[t[1]](function(){var e=n&&n.apply(this,arguments);e&&m(e.promise)?e.promise().progress(r.notify).done(r.resolve).fail(r.reject):r[t[0]+"With"](this,n?[e]:arguments)})}),i=null}).promise()},then:function(t,n,r){var u=0;function l(i,o,a,s){return function(){var n=this,r=arguments,e=function(){var e,t;if(!(i<u)){if((e=a.apply(n,r))===o.promise())throw new TypeError("Thenable self-resolution");t=e&&("object"==typeof e||"function"==typeof e)&&e.then,m(t)?s?t.call(e,l(u,o,R,s),l(u,o,M,s)):(u++,t.call(e,l(u,o,R,s),l(u,o,M,s),l(u,o,R,o.notifyWith))):(a!==R&&(n=void 0,r=[e]),(s||o.resolveWith)(n,r))}},t=s?e:function(){try{e()}catch(e){S.Deferred.exceptionHook&&S.Deferred.exceptionHook(e,t.stackTrace),u<=i+1&&(a!==M&&(n=void 0,r=[e]),o.rejectWith(n,r))}};i?t():(S.Deferred.getStackHook&&(t.stackTrace=S.Deferred.getStackHook()),C.setTimeout(t))}}return S.Deferred(function(e){o[0][3].add(l(0,e,m(r)?r:R,e.notifyWith)),o[1][3].add(l(0,e,m(t)?t:R)),o[2][3].add(l(0,e,m(n)?n:M))}).promise()},promise:function(e){return null!=e?S.extend(e,a):a}},s={};return S.each(o,function(e,t){var n=t[2],r=t[5];a[t[1]]=n.add,r&&n.add(function(){i=r},o[3-e][2].disable,o[3-e][3].disable,o[0][2].lock,o[0][3].lock),n.add(t[3].fire),s[t[0]]=function(){return s[t[0]+"With"](this===s?void 0:this,arguments),this},s[t[0]+"With"]=n.fireWith}),a.promise(s),e&&e.call(s,s),s},when:function(e){var n=arguments.length,t=n,r=Array(t),i=s.call(arguments),o=S.Deferred(),a=function(t){return function(e){r[t]=this,i[t]=1<arguments.length?s.call(arguments):e,--n||o.resolveWith(r,i)}};if(n<=1&&(I(e,o.done(a(t)).resolve,o.reject,!n),"pending"===o.state()||m(i[t]&&i[t].then)))return o.then();while(t--)I(i[t],a(t),o.reject);return o.promise()}});var W=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;S.Deferred.exceptionHook=function(e,t){C.console&&C.console.warn&&e&&W.test(e.name)&&C.console.warn("jQuery.Deferred exception: "+e.message,e.stack,t)},S.readyException=function(e){C.setTimeout(function(){throw e})};var F=S.Deferred();function B(){E.removeEventListener("DOMContentLoaded",B),C.removeEventListener("load",B),S.ready()}S.fn.ready=function(e){return F.then(e)["catch"](function(e){S.readyException(e)}),this},S.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--S.readyWait:S.isReady)||(S.isReady=!0)!==e&&0<--S.readyWait||F.resolveWith(E,[S])}}),S.ready.then=F.then,"complete"===E.readyState||"loading"!==E.readyState&&!E.documentElement.doScroll?C.setTimeout(S.ready):(E.addEventListener("DOMContentLoaded",B),C.addEventListener("load",B));var $=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===w(n))for(s in i=!0,n)$(e,t,s,n[s],!0,o,a);else if(void 0!==r&&(i=!0,m(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(S(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},_=/^-ms-/,z=/-([a-z])/g;function U(e,t){return t.toUpperCase()}function X(e){return e.replace(_,"ms-").replace(z,U)}var V=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function G(){this.expando=S.expando+G.uid++}G.uid=1,G.prototype={cache:function(e){var t=e[this.expando];return t||(t={},V(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[X(t)]=n;else for(r in t)i[X(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][X(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(X):(t=X(t))in r?[t]:t.match(P)||[]).length;while(n--)delete r[t[n]]}(void 0===t||S.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!S.isEmptyObject(t)}};var Y=new G,Q=new G,J=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,K=/[A-Z]/g;function Z(e,t,n){var r,i;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(K,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n="true"===(i=n)||"false"!==i&&("null"===i?null:i===+i+""?+i:J.test(i)?JSON.parse(i):i)}catch(e){}Q.set(e,t,n)}else n=void 0;return n}S.extend({hasData:function(e){return Q.hasData(e)||Y.hasData(e)},data:function(e,t,n){return Q.access(e,t,n)},removeData:function(e,t){Q.remove(e,t)},_data:function(e,t,n){return Y.access(e,t,n)},_removeData:function(e,t){Y.remove(e,t)}}),S.fn.extend({data:function(n,e){var t,r,i,o=this[0],a=o&&o.attributes;if(void 0===n){if(this.length&&(i=Q.get(o),1===o.nodeType&&!Y.get(o,"hasDataAttrs"))){t=a.length;while(t--)a[t]&&0===(r=a[t].name).indexOf("data-")&&(r=X(r.slice(5)),Z(o,r,i[r]));Y.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof n?this.each(function(){Q.set(this,n)}):$(this,function(e){var t;if(o&&void 0===e)return void 0!==(t=Q.get(o,n))?t:void 0!==(t=Z(o,n))?t:void 0;this.each(function(){Q.set(this,n,e)})},null,e,1<arguments.length,null,!0)},removeData:function(e){return this.each(function(){Q.remove(this,e)})}}),S.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=Y.get(e,t),n&&(!r||Array.isArray(n)?r=Y.access(e,t,S.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=S.queue(e,t),r=n.length,i=n.shift(),o=S._queueHooks(e,t);"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,function(){S.dequeue(e,t)},o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return Y.get(e,n)||Y.access(e,n,{empty:S.Callbacks("once memory").add(function(){Y.remove(e,[t+"queue",n])})})}}),S.fn.extend({queue:function(t,n){var e=2;return"string"!=typeof t&&(n=t,t="fx",e--),arguments.length<e?S.queue(this[0],t):void 0===n?this:this.each(function(){var e=S.queue(this,t,n);S._queueHooks(this,t),"fx"===t&&"inprogress"!==e[0]&&S.dequeue(this,t)})},dequeue:function(e){return this.each(function(){S.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=S.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=Y.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var ee=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,te=new RegExp("^(?:([+-])=|)("+ee+")([a-z%]*)$","i"),ne=["Top","Right","Bottom","Left"],re=E.documentElement,ie=function(e){return S.contains(e.ownerDocument,e)},oe={composed:!0};re.getRootNode&&(ie=function(e){return S.contains(e.ownerDocument,e)||e.getRootNode(oe)===e.ownerDocument});var ae=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&ie(e)&&"none"===S.css(e,"display")};function se(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return S.css(e,t,"")},u=s(),l=n&&n[3]||(S.cssNumber[t]?"":"px"),c=e.nodeType&&(S.cssNumber[t]||"px"!==l&&+u)&&te.exec(S.css(e,t));if(c&&c[3]!==l){u/=2,l=l||c[3],c=+u||1;while(a--)S.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,S.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var ue={};function le(e,t){for(var n,r,i,o,a,s,u,l=[],c=0,f=e.length;c<f;c++)(r=e[c]).style&&(n=r.style.display,t?("none"===n&&(l[c]=Y.get(r,"display")||null,l[c]||(r.style.display="")),""===r.style.display&&ae(r)&&(l[c]=(u=a=o=void 0,a=(i=r).ownerDocument,s=i.nodeName,(u=ue[s])||(o=a.body.appendChild(a.createElement(s)),u=S.css(o,"display"),o.parentNode.removeChild(o),"none"===u&&(u="block"),ue[s]=u)))):"none"!==n&&(l[c]="none",Y.set(r,"display",n)));for(c=0;c<f;c++)null!=l[c]&&(e[c].style.display=l[c]);return e}S.fn.extend({show:function(){return le(this,!0)},hide:function(){return le(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?S(this).show():S(this).hide()})}});var ce,fe,pe=/^(?:checkbox|radio)$/i,de=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,he=/^$|^module$|\/(?:java|ecma)script/i;ce=E.createDocumentFragment().appendChild(E.createElement("div")),(fe=E.createElement("input")).setAttribute("type","radio"),fe.setAttribute("checked","checked"),fe.setAttribute("name","t"),ce.appendChild(fe),y.checkClone=ce.cloneNode(!0).cloneNode(!0).lastChild.checked,ce.innerHTML="<textarea>x</textarea>",y.noCloneChecked=!!ce.cloneNode(!0).lastChild.defaultValue,ce.innerHTML="<option></option>",y.option=!!ce.lastChild;var ge={thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};function ve(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&A(e,t)?S.merge([e],n):n}function ye(e,t){for(var n=0,r=e.length;n<r;n++)Y.set(e[n],"globalEval",!t||Y.get(t[n],"globalEval"))}ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td,y.option||(ge.optgroup=ge.option=[1,"<select multiple='multiple'>","</select>"]);var me=/<|&#?\w+;/;function xe(e,t,n,r,i){for(var o,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((o=e[d])||0===o)if("object"===w(o))S.merge(p,o.nodeType?[o]:o);else if(me.test(o)){a=a||f.appendChild(t.createElement("div")),s=(de.exec(o)||["",""])[1].toLowerCase(),u=ge[s]||ge._default,a.innerHTML=u[1]+S.htmlPrefilter(o)+u[2],c=u[0];while(c--)a=a.lastChild;S.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(o));f.textContent="",d=0;while(o=p[d++])if(r&&-1<S.inArray(o,r))i&&i.push(o);else if(l=ie(o),a=ve(f.appendChild(o),"script"),l&&ye(a),n){c=0;while(o=a[c++])he.test(o.type||"")&&n.push(o)}return f}var be=/^([^.]*)(?:\.(.+)|)/;function we(){return!0}function Te(){return!1}function Ce(e,t){return e===function(){try{return E.activeElement}catch(e){}}()==("focus"===t)}function Ee(e,t,n,r,i,o){var a,s;if("object"==typeof t){for(s in"string"!=typeof n&&(r=r||n,n=void 0),t)Ee(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=Te;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return S().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=S.guid++)),e.each(function(){S.event.add(this,t,i,r,n)})}function Se(e,i,o){o?(Y.set(e,i,!1),S.event.add(e,i,{namespace:!1,handler:function(e){var t,n,r=Y.get(this,i);if(1&e.isTrigger&&this[i]){if(r.length)(S.event.special[i]||{}).delegateType&&e.stopPropagation();else if(r=s.call(arguments),Y.set(this,i,r),t=o(this,i),this[i](),r!==(n=Y.get(this,i))||t?Y.set(this,i,!1):n={},r!==n)return e.stopImmediatePropagation(),e.preventDefault(),n&&n.value}else r.length&&(Y.set(this,i,{value:S.event.trigger(S.extend(r[0],S.Event.prototype),r.slice(1),this)}),e.stopImmediatePropagation())}})):void 0===Y.get(e,i)&&S.event.add(e,i,we)}S.event={global:{},add:function(t,e,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Y.get(t);if(V(t)){n.handler&&(n=(o=n).handler,i=o.selector),i&&S.find.matchesSelector(re,i),n.guid||(n.guid=S.guid++),(u=v.events)||(u=v.events=Object.create(null)),(a=v.handle)||(a=v.handle=function(e){return"undefined"!=typeof S&&S.event.triggered!==e.type?S.event.dispatch.apply(t,arguments):void 0}),l=(e=(e||"").match(P)||[""]).length;while(l--)d=g=(s=be.exec(e[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=S.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=S.event.special[d]||{},c=S.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&S.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(t,r,h,a)||t.addEventListener&&t.addEventListener(d,a)),f.add&&(f.add.call(t,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),S.event.global[d]=!0)}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Y.hasData(e)&&Y.get(e);if(v&&(u=v.events)){l=(t=(t||"").match(P)||[""]).length;while(l--)if(d=g=(s=be.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d){f=S.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,v.handle)||S.removeEvent(e,d,v.handle),delete u[d])}else for(d in u)S.event.remove(e,d+t[l],n,r,!0);S.isEmptyObject(u)&&Y.remove(e,"handle events")}},dispatch:function(e){var t,n,r,i,o,a,s=new Array(arguments.length),u=S.event.fix(e),l=(Y.get(this,"events")||Object.create(null))[u.type]||[],c=S.event.special[u.type]||{};for(s[0]=u,t=1;t<arguments.length;t++)s[t]=arguments[t];if(u.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,u)){a=S.event.handlers.call(this,u,l),t=0;while((i=a[t++])&&!u.isPropagationStopped()){u.currentTarget=i.elem,n=0;while((o=i.handlers[n++])&&!u.isImmediatePropagationStopped())u.rnamespace&&!1!==o.namespace&&!u.rnamespace.test(o.namespace)||(u.handleObj=o,u.data=o.data,void 0!==(r=((S.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,s))&&!1===(u.result=r)&&(u.preventDefault(),u.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,u),u.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&1<=e.button))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?-1<S(i,this).index(l):S.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(t,e){Object.defineProperty(S.Event.prototype,t,{enumerable:!0,configurable:!0,get:m(e)?function(){if(this.originalEvent)return e(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[t]},set:function(e){Object.defineProperty(this,t,{enumerable:!0,configurable:!0,writable:!0,value:e})}})},fix:function(e){return e[S.expando]?e:new S.Event(e)},special:{load:{noBubble:!0},click:{setup:function(e){var t=this||e;return pe.test(t.type)&&t.click&&A(t,"input")&&Se(t,"click",we),!1},trigger:function(e){var t=this||e;return pe.test(t.type)&&t.click&&A(t,"input")&&Se(t,"click"),!0},_default:function(e){var t=e.target;return pe.test(t.type)&&t.click&&A(t,"input")&&Y.get(t,"click")||A(t,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},S.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},S.Event=function(e,t){if(!(this instanceof S.Event))return new S.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?we:Te,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&S.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[S.expando]=!0},S.Event.prototype={constructor:S.Event,isDefaultPrevented:Te,isPropagationStopped:Te,isImmediatePropagationStopped:Te,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=we,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=we,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=we,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},S.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:!0},S.event.addProp),S.each({focus:"focusin",blur:"focusout"},function(e,t){S.event.special[e]={setup:function(){return Se(this,e,Ce),!1},trigger:function(){return Se(this,e),!0},_default:function(){return!0},delegateType:t}}),S.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,i){S.event.special[e]={delegateType:i,bindType:i,handle:function(e){var t,n=e.relatedTarget,r=e.handleObj;return n&&(n===this||S.contains(this,n))||(e.type=r.origType,t=r.handler.apply(this,arguments),e.type=i),t}}}),S.fn.extend({on:function(e,t,n,r){return Ee(this,e,t,n,r)},one:function(e,t,n,r){return Ee(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,S(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=Te),this.each(function(){S.event.remove(this,e,n,t)})}});var ke=/<script|<style|<link/i,Ae=/checked\s*(?:[^=]|=\s*.checked.)/i,Ne=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function je(e,t){return A(e,"table")&&A(11!==t.nodeType?t:t.firstChild,"tr")&&S(e).children("tbody")[0]||e}function De(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function qe(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Le(e,t){var n,r,i,o,a,s;if(1===t.nodeType){if(Y.hasData(e)&&(s=Y.get(e).events))for(i in Y.remove(t,"handle events"),s)for(n=0,r=s[i].length;n<r;n++)S.event.add(t,i,s[i][n]);Q.hasData(e)&&(o=Q.access(e),a=S.extend({},o),Q.set(t,a))}}function He(n,r,i,o){r=g(r);var e,t,a,s,u,l,c=0,f=n.length,p=f-1,d=r[0],h=m(d);if(h||1<f&&"string"==typeof d&&!y.checkClone&&Ae.test(d))return n.each(function(e){var t=n.eq(e);h&&(r[0]=d.call(this,e,t.html())),He(t,r,i,o)});if(f&&(t=(e=xe(r,n[0].ownerDocument,!1,n,o)).firstChild,1===e.childNodes.length&&(e=t),t||o)){for(s=(a=S.map(ve(e,"script"),De)).length;c<f;c++)u=e,c!==p&&(u=S.clone(u,!0,!0),s&&S.merge(a,ve(u,"script"))),i.call(n[c],u,c);if(s)for(l=a[a.length-1].ownerDocument,S.map(a,qe),c=0;c<s;c++)u=a[c],he.test(u.type||"")&&!Y.access(u,"globalEval")&&S.contains(l,u)&&(u.src&&"module"!==(u.type||"").toLowerCase()?S._evalUrl&&!u.noModule&&S._evalUrl(u.src,{nonce:u.nonce||u.getAttribute("nonce")},l):b(u.textContent.replace(Ne,""),u,l))}return n}function Oe(e,t,n){for(var r,i=t?S.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||S.cleanData(ve(r)),r.parentNode&&(n&&ie(r)&&ye(ve(r,"script")),r.parentNode.removeChild(r));return e}S.extend({htmlPrefilter:function(e){return e},clone:function(e,t,n){var r,i,o,a,s,u,l,c=e.cloneNode(!0),f=ie(e);if(!(y.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||S.isXMLDoc(e)))for(a=ve(c),r=0,i=(o=ve(e)).length;r<i;r++)s=o[r],u=a[r],void 0,"input"===(l=u.nodeName.toLowerCase())&&pe.test(s.type)?u.checked=s.checked:"input"!==l&&"textarea"!==l||(u.defaultValue=s.defaultValue);if(t)if(n)for(o=o||ve(e),a=a||ve(c),r=0,i=o.length;r<i;r++)Le(o[r],a[r]);else Le(e,c);return 0<(a=ve(c,"script")).length&&ye(a,!f&&ve(e,"script")),c},cleanData:function(e){for(var t,n,r,i=S.event.special,o=0;void 0!==(n=e[o]);o++)if(V(n)){if(t=n[Y.expando]){if(t.events)for(r in t.events)i[r]?S.event.remove(n,r):S.removeEvent(n,r,t.handle);n[Y.expando]=void 0}n[Q.expando]&&(n[Q.expando]=void 0)}}}),S.fn.extend({detach:function(e){return Oe(this,e,!0)},remove:function(e){return Oe(this,e)},text:function(e){return $(this,function(e){return void 0===e?S.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return He(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||je(this,e).appendChild(e)})},prepend:function(){return He(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=je(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return He(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return He(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(S.cleanData(ve(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return S.clone(this,e,t)})},html:function(e){return $(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!ke.test(e)&&!ge[(de.exec(e)||["",""])[1].toLowerCase()]){e=S.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(S.cleanData(ve(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var n=[];return He(this,arguments,function(e){var t=this.parentNode;S.inArray(this,n)<0&&(S.cleanData(ve(this)),t&&t.replaceChild(e,this))},n)}}),S.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,a){S.fn[e]=function(e){for(var t,n=[],r=S(e),i=r.length-1,o=0;o<=i;o++)t=o===i?this:this.clone(!0),S(r[o])[a](t),u.apply(n,t.get());return this.pushStack(n)}});var Pe=new RegExp("^("+ee+")(?!px)[a-z%]+$","i"),Re=function(e){var t=e.ownerDocument.defaultView;return t&&t.opener||(t=C),t.getComputedStyle(e)},Me=function(e,t,n){var r,i,o={};for(i in t)o[i]=e.style[i],e.style[i]=t[i];for(i in r=n.call(e),t)e.style[i]=o[i];return r},Ie=new RegExp(ne.join("|"),"i");function We(e,t,n){var r,i,o,a,s=e.style;return(n=n||Re(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||ie(e)||(a=S.style(e,t)),!y.pixelBoxStyles()&&Pe.test(a)&&Ie.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function Fe(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}!function(){function e(){if(l){u.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",l.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",re.appendChild(u).appendChild(l);var e=C.getComputedStyle(l);n="1%"!==e.top,s=12===t(e.marginLeft),l.style.right="60%",o=36===t(e.right),r=36===t(e.width),l.style.position="absolute",i=12===t(l.offsetWidth/3),re.removeChild(u),l=null}}function t(e){return Math.round(parseFloat(e))}var n,r,i,o,a,s,u=E.createElement("div"),l=E.createElement("div");l.style&&(l.style.backgroundClip="content-box",l.cloneNode(!0).style.backgroundClip="",y.clearCloneStyle="content-box"===l.style.backgroundClip,S.extend(y,{boxSizingReliable:function(){return e(),r},pixelBoxStyles:function(){return e(),o},pixelPosition:function(){return e(),n},reliableMarginLeft:function(){return e(),s},scrollboxSize:function(){return e(),i},reliableTrDimensions:function(){var e,t,n,r;return null==a&&(e=E.createElement("table"),t=E.createElement("tr"),n=E.createElement("div"),e.style.cssText="position:absolute;left:-11111px;border-collapse:separate",t.style.cssText="border:1px solid",t.style.height="1px",n.style.height="9px",n.style.display="block",re.appendChild(e).appendChild(t).appendChild(n),r=C.getComputedStyle(t),a=parseInt(r.height,10)+parseInt(r.borderTopWidth,10)+parseInt(r.borderBottomWidth,10)===t.offsetHeight,re.removeChild(e)),a}}))}();var Be=["Webkit","Moz","ms"],$e=E.createElement("div").style,_e={};function ze(e){var t=S.cssProps[e]||_e[e];return t||(e in $e?e:_e[e]=function(e){var t=e[0].toUpperCase()+e.slice(1),n=Be.length;while(n--)if((e=Be[n]+t)in $e)return e}(e)||e)}var Ue=/^(none|table(?!-c[ea]).+)/,Xe=/^--/,Ve={position:"absolute",visibility:"hidden",display:"block"},Ge={letterSpacing:"0",fontWeight:"400"};function Ye(e,t,n){var r=te.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function Qe(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=S.css(e,n+ne[a],!0,i)),r?("content"===n&&(u-=S.css(e,"padding"+ne[a],!0,i)),"margin"!==n&&(u-=S.css(e,"border"+ne[a]+"Width",!0,i))):(u+=S.css(e,"padding"+ne[a],!0,i),"padding"!==n?u+=S.css(e,"border"+ne[a]+"Width",!0,i):s+=S.css(e,"border"+ne[a]+"Width",!0,i));return!r&&0<=o&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))||0),u}function Je(e,t,n){var r=Re(e),i=(!y.boxSizingReliable()||n)&&"border-box"===S.css(e,"boxSizing",!1,r),o=i,a=We(e,t,r),s="offset"+t[0].toUpperCase()+t.slice(1);if(Pe.test(a)){if(!n)return a;a="auto"}return(!y.boxSizingReliable()&&i||!y.reliableTrDimensions()&&A(e,"tr")||"auto"===a||!parseFloat(a)&&"inline"===S.css(e,"display",!1,r))&&e.getClientRects().length&&(i="border-box"===S.css(e,"boxSizing",!1,r),(o=s in e)&&(a=e[s])),(a=parseFloat(a)||0)+Qe(e,t,n||(i?"border":"content"),o,r,a)+"px"}function Ke(e,t,n,r,i){return new Ke.prototype.init(e,t,n,r,i)}S.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=We(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=X(t),u=Xe.test(t),l=e.style;if(u||(t=ze(s)),a=S.cssHooks[t]||S.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"===(o=typeof n)&&(i=te.exec(n))&&i[1]&&(n=se(e,t,i),o="number"),null!=n&&n==n&&("number"!==o||u||(n+=i&&i[3]||(S.cssNumber[s]?"":"px")),y.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=X(t);return Xe.test(t)||(t=ze(s)),(a=S.cssHooks[t]||S.cssHooks[s])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=We(e,t,r)),"normal"===i&&t in Ge&&(i=Ge[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),S.each(["height","width"],function(e,u){S.cssHooks[u]={get:function(e,t,n){if(t)return!Ue.test(S.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?Je(e,u,n):Me(e,Ve,function(){return Je(e,u,n)})},set:function(e,t,n){var r,i=Re(e),o=!y.scrollboxSize()&&"absolute"===i.position,a=(o||n)&&"border-box"===S.css(e,"boxSizing",!1,i),s=n?Qe(e,u,n,a,i):0;return a&&o&&(s-=Math.ceil(e["offset"+u[0].toUpperCase()+u.slice(1)]-parseFloat(i[u])-Qe(e,u,"border",!1,i)-.5)),s&&(r=te.exec(t))&&"px"!==(r[3]||"px")&&(e.style[u]=t,t=S.css(e,u)),Ye(0,t,s)}}}),S.cssHooks.marginLeft=Fe(y.reliableMarginLeft,function(e,t){if(t)return(parseFloat(We(e,"marginLeft"))||e.getBoundingClientRect().left-Me(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),S.each({margin:"",padding:"",border:"Width"},function(i,o){S.cssHooks[i+o]={expand:function(e){for(var t=0,n={},r="string"==typeof e?e.split(" "):[e];t<4;t++)n[i+ne[t]+o]=r[t]||r[t-2]||r[0];return n}},"margin"!==i&&(S.cssHooks[i+o].set=Ye)}),S.fn.extend({css:function(e,t){return $(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=Re(e),i=t.length;a<i;a++)o[t[a]]=S.css(e,t[a],!1,r);return o}return void 0!==n?S.style(e,t,n):S.css(e,t)},e,t,1<arguments.length)}}),((S.Tween=Ke).prototype={constructor:Ke,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||S.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(S.cssNumber[n]?"":"px")},cur:function(){var e=Ke.propHooks[this.prop];return e&&e.get?e.get(this):Ke.propHooks._default.get(this)},run:function(e){var t,n=Ke.propHooks[this.prop];return this.options.duration?this.pos=t=S.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):Ke.propHooks._default.set(this),this}}).init.prototype=Ke.prototype,(Ke.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=S.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){S.fx.step[e.prop]?S.fx.step[e.prop](e):1!==e.elem.nodeType||!S.cssHooks[e.prop]&&null==e.elem.style[ze(e.prop)]?e.elem[e.prop]=e.now:S.style(e.elem,e.prop,e.now+e.unit)}}}).scrollTop=Ke.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},S.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},S.fx=Ke.prototype.init,S.fx.step={};var Ze,et,tt,nt,rt=/^(?:toggle|show|hide)$/,it=/queueHooks$/;function ot(){et&&(!1===E.hidden&&C.requestAnimationFrame?C.requestAnimationFrame(ot):C.setTimeout(ot,S.fx.interval),S.fx.tick())}function at(){return C.setTimeout(function(){Ze=void 0}),Ze=Date.now()}function st(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)i["margin"+(n=ne[r])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function ut(e,t,n){for(var r,i=(lt.tweeners[t]||[]).concat(lt.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function lt(o,e,t){var n,a,r=0,i=lt.prefilters.length,s=S.Deferred().always(function(){delete u.elem}),u=function(){if(a)return!1;for(var e=Ze||at(),t=Math.max(0,l.startTime+l.duration-e),n=1-(t/l.duration||0),r=0,i=l.tweens.length;r<i;r++)l.tweens[r].run(n);return s.notifyWith(o,[l,n,t]),n<1&&i?t:(i||s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l]),!1)},l=s.promise({elem:o,props:S.extend({},e),opts:S.extend(!0,{specialEasing:{},easing:S.easing._default},t),originalProperties:e,originalOptions:t,startTime:Ze||at(),duration:t.duration,tweens:[],createTween:function(e,t){var n=S.Tween(o,l.opts,e,t,l.opts.specialEasing[e]||l.opts.easing);return l.tweens.push(n),n},stop:function(e){var t=0,n=e?l.tweens.length:0;if(a)return this;for(a=!0;t<n;t++)l.tweens[t].run(1);return e?(s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l,e])):s.rejectWith(o,[l,e]),this}}),c=l.props;for(!function(e,t){var n,r,i,o,a;for(n in e)if(i=t[r=X(n)],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=S.cssHooks[r])&&"expand"in a)for(n in o=a.expand(o),delete e[r],o)n in e||(e[n]=o[n],t[n]=i);else t[r]=i}(c,l.opts.specialEasing);r<i;r++)if(n=lt.prefilters[r].call(l,o,c,l.opts))return m(n.stop)&&(S._queueHooks(l.elem,l.opts.queue).stop=n.stop.bind(n)),n;return S.map(c,ut,l),m(l.opts.start)&&l.opts.start.call(o,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),S.fx.timer(S.extend(u,{elem:o,anim:l,queue:l.opts.queue})),l}S.Animation=S.extend(lt,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return se(n.elem,e,te.exec(t),n),n}]},tweener:function(e,t){m(e)?(t=e,e=["*"]):e=e.match(P);for(var n,r=0,i=e.length;r<i;r++)n=e[r],lt.tweeners[n]=lt.tweeners[n]||[],lt.tweeners[n].unshift(t)},prefilters:[function(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&ae(e),v=Y.get(e,"fxshow");for(r in n.queue||(null==(a=S._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,S.queue(e,"fx").length||a.empty.fire()})})),t)if(i=t[r],rt.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!v||void 0===v[r])continue;g=!0}d[r]=v&&v[r]||S.style(e,r)}if((u=!S.isEmptyObject(t))||!S.isEmptyObject(d))for(r in f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=v&&v.display)&&(l=Y.get(e,"display")),"none"===(c=S.css(e,"display"))&&(l?c=l:(le([e],!0),l=e.style.display||l,c=S.css(e,"display"),le([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===S.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1,d)u||(v?"hidden"in v&&(g=v.hidden):v=Y.access(e,"fxshow",{display:l}),o&&(v.hidden=!g),g&&le([e],!0),p.done(function(){for(r in g||le([e]),Y.remove(e,"fxshow"),d)S.style(e,r,d[r])})),u=ut(g?v[r]:0,r,p),r in v||(v[r]=u.start,g&&(u.end=u.start,u.start=0))}],prefilter:function(e,t){t?lt.prefilters.unshift(e):lt.prefilters.push(e)}}),S.speed=function(e,t,n){var r=e&&"object"==typeof e?S.extend({},e):{complete:n||!n&&t||m(e)&&e,duration:e,easing:n&&t||t&&!m(t)&&t};return S.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in S.fx.speeds?r.duration=S.fx.speeds[r.duration]:r.duration=S.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){m(r.old)&&r.old.call(this),r.queue&&S.dequeue(this,r.queue)},r},S.fn.extend({fadeTo:function(e,t,n,r){return this.filter(ae).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(t,e,n,r){var i=S.isEmptyObject(t),o=S.speed(e,n,r),a=function(){var e=lt(this,S.extend({},t),o);(i||Y.get(this,"finish"))&&e.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(i,e,o){var a=function(e){var t=e.stop;delete e.stop,t(o)};return"string"!=typeof i&&(o=e,e=i,i=void 0),e&&this.queue(i||"fx",[]),this.each(function(){var e=!0,t=null!=i&&i+"queueHooks",n=S.timers,r=Y.get(this);if(t)r[t]&&r[t].stop&&a(r[t]);else for(t in r)r[t]&&r[t].stop&&it.test(t)&&a(r[t]);for(t=n.length;t--;)n[t].elem!==this||null!=i&&n[t].queue!==i||(n[t].anim.stop(o),e=!1,n.splice(t,1));!e&&o||S.dequeue(this,i)})},finish:function(a){return!1!==a&&(a=a||"fx"),this.each(function(){var e,t=Y.get(this),n=t[a+"queue"],r=t[a+"queueHooks"],i=S.timers,o=n?n.length:0;for(t.finish=!0,S.queue(this,a,[]),r&&r.stop&&r.stop.call(this,!0),e=i.length;e--;)i[e].elem===this&&i[e].queue===a&&(i[e].anim.stop(!0),i.splice(e,1));for(e=0;e<o;e++)n[e]&&n[e].finish&&n[e].finish.call(this);delete t.finish})}}),S.each(["toggle","show","hide"],function(e,r){var i=S.fn[r];S.fn[r]=function(e,t,n){return null==e||"boolean"==typeof e?i.apply(this,arguments):this.animate(st(r,!0),e,t,n)}}),S.each({slideDown:st("show"),slideUp:st("hide"),slideToggle:st("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,r){S.fn[e]=function(e,t,n){return this.animate(r,e,t,n)}}),S.timers=[],S.fx.tick=function(){var e,t=0,n=S.timers;for(Ze=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||S.fx.stop(),Ze=void 0},S.fx.timer=function(e){S.timers.push(e),S.fx.start()},S.fx.interval=13,S.fx.start=function(){et||(et=!0,ot())},S.fx.stop=function(){et=null},S.fx.speeds={slow:600,fast:200,_default:400},S.fn.delay=function(r,e){return r=S.fx&&S.fx.speeds[r]||r,e=e||"fx",this.queue(e,function(e,t){var n=C.setTimeout(e,r);t.stop=function(){C.clearTimeout(n)}})},tt=E.createElement("input"),nt=E.createElement("select").appendChild(E.createElement("option")),tt.type="checkbox",y.checkOn=""!==tt.value,y.optSelected=nt.selected,(tt=E.createElement("input")).value="t",tt.type="radio",y.radioValue="t"===tt.value;var ct,ft=S.expr.attrHandle;S.fn.extend({attr:function(e,t){return $(this,S.attr,e,t,1<arguments.length)},removeAttr:function(e){return this.each(function(){S.removeAttr(this,e)})}}),S.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?S.prop(e,t,n):(1===o&&S.isXMLDoc(e)||(i=S.attrHooks[t.toLowerCase()]||(S.expr.match.bool.test(t)?ct:void 0)),void 0!==n?null===n?void S.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=S.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!y.radioValue&&"radio"===t&&A(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(P);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n)}}),ct={set:function(e,t,n){return!1===t?S.removeAttr(e,n):e.setAttribute(n,n),n}},S.each(S.expr.match.bool.source.match(/\w+/g),function(e,t){var a=ft[t]||S.find.attr;ft[t]=function(e,t,n){var r,i,o=t.toLowerCase();return n||(i=ft[o],ft[o]=r,r=null!=a(e,t,n)?o:null,ft[o]=i),r}});var pt=/^(?:input|select|textarea|button)$/i,dt=/^(?:a|area)$/i;function ht(e){return(e.match(P)||[]).join(" ")}function gt(e){return e.getAttribute&&e.getAttribute("class")||""}function vt(e){return Array.isArray(e)?e:"string"==typeof e&&e.match(P)||[]}S.fn.extend({prop:function(e,t){return $(this,S.prop,e,t,1<arguments.length)},removeProp:function(e){return this.each(function(){delete this[S.propFix[e]||e]})}}),S.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&S.isXMLDoc(e)||(t=S.propFix[t]||t,i=S.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=S.find.attr(e,"tabindex");return t?parseInt(t,10):pt.test(e.nodeName)||dt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),y.optSelected||(S.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),S.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){S.propFix[this.toLowerCase()]=this}),S.fn.extend({addClass:function(t){var e,n,r,i,o,a,s,u=0;if(m(t))return this.each(function(e){S(this).addClass(t.call(this,e,gt(this)))});if((e=vt(t)).length)while(n=this[u++])if(i=gt(n),r=1===n.nodeType&&" "+ht(i)+" "){a=0;while(o=e[a++])r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=ht(r))&&n.setAttribute("class",s)}return this},removeClass:function(t){var e,n,r,i,o,a,s,u=0;if(m(t))return this.each(function(e){S(this).removeClass(t.call(this,e,gt(this)))});if(!arguments.length)return this.attr("class","");if((e=vt(t)).length)while(n=this[u++])if(i=gt(n),r=1===n.nodeType&&" "+ht(i)+" "){a=0;while(o=e[a++])while(-1<r.indexOf(" "+o+" "))r=r.replace(" "+o+" "," ");i!==(s=ht(r))&&n.setAttribute("class",s)}return this},toggleClass:function(i,t){var o=typeof i,a="string"===o||Array.isArray(i);return"boolean"==typeof t&&a?t?this.addClass(i):this.removeClass(i):m(i)?this.each(function(e){S(this).toggleClass(i.call(this,e,gt(this),t),t)}):this.each(function(){var e,t,n,r;if(a){t=0,n=S(this),r=vt(i);while(e=r[t++])n.hasClass(e)?n.removeClass(e):n.addClass(e)}else void 0!==i&&"boolean"!==o||((e=gt(this))&&Y.set(this,"__className__",e),this.setAttribute&&this.setAttribute("class",e||!1===i?"":Y.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&-1<(" "+ht(gt(n))+" ").indexOf(t))return!0;return!1}});var yt=/\r/g;S.fn.extend({val:function(n){var r,e,i,t=this[0];return arguments.length?(i=m(n),this.each(function(e){var t;1===this.nodeType&&(null==(t=i?n.call(this,e,S(this).val()):n)?t="":"number"==typeof t?t+="":Array.isArray(t)&&(t=S.map(t,function(e){return null==e?"":e+""})),(r=S.valHooks[this.type]||S.valHooks[this.nodeName.toLowerCase()])&&"set"in r&&void 0!==r.set(this,t,"value")||(this.value=t))})):t?(r=S.valHooks[t.type]||S.valHooks[t.nodeName.toLowerCase()])&&"get"in r&&void 0!==(e=r.get(t,"value"))?e:"string"==typeof(e=t.value)?e.replace(yt,""):null==e?"":e:void 0}}),S.extend({valHooks:{option:{get:function(e){var t=S.find.attr(e,"value");return null!=t?t:ht(S.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!A(n.parentNode,"optgroup"))){if(t=S(n).val(),a)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=S.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=-1<S.inArray(S.valHooks.option.get(r),o))&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),S.each(["radio","checkbox"],function(){S.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=-1<S.inArray(S(e).val(),t)}},y.checkOn||(S.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),y.focusin="onfocusin"in C;var mt=/^(?:focusinfocus|focusoutblur)$/,xt=function(e){e.stopPropagation()};S.extend(S.event,{trigger:function(e,t,n,r){var i,o,a,s,u,l,c,f,p=[n||E],d=v.call(e,"type")?e.type:e,h=v.call(e,"namespace")?e.namespace.split("."):[];if(o=f=a=n=n||E,3!==n.nodeType&&8!==n.nodeType&&!mt.test(d+S.event.triggered)&&(-1<d.indexOf(".")&&(d=(h=d.split(".")).shift(),h.sort()),u=d.indexOf(":")<0&&"on"+d,(e=e[S.expando]?e:new S.Event(d,"object"==typeof e&&e)).isTrigger=r?2:3,e.namespace=h.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=n),t=null==t?[e]:S.makeArray(t,[e]),c=S.event.special[d]||{},r||!c.trigger||!1!==c.trigger.apply(n,t))){if(!r&&!c.noBubble&&!x(n)){for(s=c.delegateType||d,mt.test(s+d)||(o=o.parentNode);o;o=o.parentNode)p.push(o),a=o;a===(n.ownerDocument||E)&&p.push(a.defaultView||a.parentWindow||C)}i=0;while((o=p[i++])&&!e.isPropagationStopped())f=o,e.type=1<i?s:c.bindType||d,(l=(Y.get(o,"events")||Object.create(null))[e.type]&&Y.get(o,"handle"))&&l.apply(o,t),(l=u&&o[u])&&l.apply&&V(o)&&(e.result=l.apply(o,t),!1===e.result&&e.preventDefault());return e.type=d,r||e.isDefaultPrevented()||c._default&&!1!==c._default.apply(p.pop(),t)||!V(n)||u&&m(n[d])&&!x(n)&&((a=n[u])&&(n[u]=null),S.event.triggered=d,e.isPropagationStopped()&&f.addEventListener(d,xt),n[d](),e.isPropagationStopped()&&f.removeEventListener(d,xt),S.event.triggered=void 0,a&&(n[u]=a)),e.result}},simulate:function(e,t,n){var r=S.extend(new S.Event,n,{type:e,isSimulated:!0});S.event.trigger(r,null,t)}}),S.fn.extend({trigger:function(e,t){return this.each(function(){S.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return S.event.trigger(e,t,n,!0)}}),y.focusin||S.each({focus:"focusin",blur:"focusout"},function(n,r){var i=function(e){S.event.simulate(r,e.target,S.event.fix(e))};S.event.special[r]={setup:function(){var e=this.ownerDocument||this.document||this,t=Y.access(e,r);t||e.addEventListener(n,i,!0),Y.access(e,r,(t||0)+1)},teardown:function(){var e=this.ownerDocument||this.document||this,t=Y.access(e,r)-1;t?Y.access(e,r,t):(e.removeEventListener(n,i,!0),Y.remove(e,r))}}});var bt=C.location,wt={guid:Date.now()},Tt=/\?/;S.parseXML=function(e){var t,n;if(!e||"string"!=typeof e)return null;try{t=(new C.DOMParser).parseFromString(e,"text/xml")}catch(e){}return n=t&&t.getElementsByTagName("parsererror")[0],t&&!n||S.error("Invalid XML: "+(n?S.map(n.childNodes,function(e){return e.textContent}).join("\n"):e)),t};var Ct=/\[\]$/,Et=/\r?\n/g,St=/^(?:submit|button|image|reset|file)$/i,kt=/^(?:input|select|textarea|keygen)/i;function At(n,e,r,i){var t;if(Array.isArray(e))S.each(e,function(e,t){r||Ct.test(n)?i(n,t):At(n+"["+("object"==typeof t&&null!=t?e:"")+"]",t,r,i)});else if(r||"object"!==w(e))i(n,e);else for(t in e)At(n+"["+t+"]",e[t],r,i)}S.param=function(e,t){var n,r=[],i=function(e,t){var n=m(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(null==e)return"";if(Array.isArray(e)||e.jquery&&!S.isPlainObject(e))S.each(e,function(){i(this.name,this.value)});else for(n in e)At(n,e[n],t,i);return r.join("&")},S.fn.extend({serialize:function(){return S.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=S.prop(this,"elements");return e?S.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!S(this).is(":disabled")&&kt.test(this.nodeName)&&!St.test(e)&&(this.checked||!pe.test(e))}).map(function(e,t){var n=S(this).val();return null==n?null:Array.isArray(n)?S.map(n,function(e){return{name:t.name,value:e.replace(Et,"\r\n")}}):{name:t.name,value:n.replace(Et,"\r\n")}}).get()}});var Nt=/%20/g,jt=/#.*$/,Dt=/([?&])_=[^&]*/,qt=/^(.*?):[ \t]*([^\r\n]*)$/gm,Lt=/^(?:GET|HEAD)$/,Ht=/^\/\//,Ot={},Pt={},Rt="*/".concat("*"),Mt=E.createElement("a");function It(o){return function(e,t){"string"!=typeof e&&(t=e,e="*");var n,r=0,i=e.toLowerCase().match(P)||[];if(m(t))while(n=i[r++])"+"===n[0]?(n=n.slice(1)||"*",(o[n]=o[n]||[]).unshift(t)):(o[n]=o[n]||[]).push(t)}}function Wt(t,i,o,a){var s={},u=t===Pt;function l(e){var r;return s[e]=!0,S.each(t[e]||[],function(e,t){var n=t(i,o,a);return"string"!=typeof n||u||s[n]?u?!(r=n):void 0:(i.dataTypes.unshift(n),l(n),!1)}),r}return l(i.dataTypes[0])||!s["*"]&&l("*")}function Ft(e,t){var n,r,i=S.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&S.extend(!0,e,r),e}Mt.href=bt.href,S.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:bt.href,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(bt.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Rt,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":S.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?Ft(Ft(e,S.ajaxSettings),t):Ft(S.ajaxSettings,e)},ajaxPrefilter:It(Ot),ajaxTransport:It(Pt),ajax:function(e,t){"object"==typeof e&&(t=e,e=void 0),t=t||{};var c,f,p,n,d,r,h,g,i,o,v=S.ajaxSetup({},t),y=v.context||v,m=v.context&&(y.nodeType||y.jquery)?S(y):S.event,x=S.Deferred(),b=S.Callbacks("once memory"),w=v.statusCode||{},a={},s={},u="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(h){if(!n){n={};while(t=qt.exec(p))n[t[1].toLowerCase()+" "]=(n[t[1].toLowerCase()+" "]||[]).concat(t[2])}t=n[e.toLowerCase()+" "]}return null==t?null:t.join(", ")},getAllResponseHeaders:function(){return h?p:null},setRequestHeader:function(e,t){return null==h&&(e=s[e.toLowerCase()]=s[e.toLowerCase()]||e,a[e]=t),this},overrideMimeType:function(e){return null==h&&(v.mimeType=e),this},statusCode:function(e){var t;if(e)if(h)T.always(e[T.status]);else for(t in e)w[t]=[w[t],e[t]];return this},abort:function(e){var t=e||u;return c&&c.abort(t),l(0,t),this}};if(x.promise(T),v.url=((e||v.url||bt.href)+"").replace(Ht,bt.protocol+"//"),v.type=t.method||t.type||v.method||v.type,v.dataTypes=(v.dataType||"*").toLowerCase().match(P)||[""],null==v.crossDomain){r=E.createElement("a");try{r.href=v.url,r.href=r.href,v.crossDomain=Mt.protocol+"//"+Mt.host!=r.protocol+"//"+r.host}catch(e){v.crossDomain=!0}}if(v.data&&v.processData&&"string"!=typeof v.data&&(v.data=S.param(v.data,v.traditional)),Wt(Ot,v,t,T),h)return T;for(i in(g=S.event&&v.global)&&0==S.active++&&S.event.trigger("ajaxStart"),v.type=v.type.toUpperCase(),v.hasContent=!Lt.test(v.type),f=v.url.replace(jt,""),v.hasContent?v.data&&v.processData&&0===(v.contentType||"").indexOf("application/x-www-form-urlencoded")&&(v.data=v.data.replace(Nt,"+")):(o=v.url.slice(f.length),v.data&&(v.processData||"string"==typeof v.data)&&(f+=(Tt.test(f)?"&":"?")+v.data,delete v.data),!1===v.cache&&(f=f.replace(Dt,"$1"),o=(Tt.test(f)?"&":"?")+"_="+wt.guid+++o),v.url=f+o),v.ifModified&&(S.lastModified[f]&&T.setRequestHeader("If-Modified-Since",S.lastModified[f]),S.etag[f]&&T.setRequestHeader("If-None-Match",S.etag[f])),(v.data&&v.hasContent&&!1!==v.contentType||t.contentType)&&T.setRequestHeader("Content-Type",v.contentType),T.setRequestHeader("Accept",v.dataTypes[0]&&v.accepts[v.dataTypes[0]]?v.accepts[v.dataTypes[0]]+("*"!==v.dataTypes[0]?", "+Rt+"; q=0.01":""):v.accepts["*"]),v.headers)T.setRequestHeader(i,v.headers[i]);if(v.beforeSend&&(!1===v.beforeSend.call(y,T,v)||h))return T.abort();if(u="abort",b.add(v.complete),T.done(v.success),T.fail(v.error),c=Wt(Pt,v,t,T)){if(T.readyState=1,g&&m.trigger("ajaxSend",[T,v]),h)return T;v.async&&0<v.timeout&&(d=C.setTimeout(function(){T.abort("timeout")},v.timeout));try{h=!1,c.send(a,l)}catch(e){if(h)throw e;l(-1,e)}}else l(-1,"No Transport");function l(e,t,n,r){var i,o,a,s,u,l=t;h||(h=!0,d&&C.clearTimeout(d),c=void 0,p=r||"",T.readyState=0<e?4:0,i=200<=e&&e<300||304===e,n&&(s=function(e,t,n){var r,i,o,a,s=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}(v,T,n)),!i&&-1<S.inArray("script",v.dataTypes)&&S.inArray("json",v.dataTypes)<0&&(v.converters["text script"]=function(){}),s=function(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}(v,s,T,i),i?(v.ifModified&&((u=T.getResponseHeader("Last-Modified"))&&(S.lastModified[f]=u),(u=T.getResponseHeader("etag"))&&(S.etag[f]=u)),204===e||"HEAD"===v.type?l="nocontent":304===e?l="notmodified":(l=s.state,o=s.data,i=!(a=s.error))):(a=l,!e&&l||(l="error",e<0&&(e=0))),T.status=e,T.statusText=(t||l)+"",i?x.resolveWith(y,[o,l,T]):x.rejectWith(y,[T,l,a]),T.statusCode(w),w=void 0,g&&m.trigger(i?"ajaxSuccess":"ajaxError",[T,v,i?o:a]),b.fireWith(y,[T,l]),g&&(m.trigger("ajaxComplete",[T,v]),--S.active||S.event.trigger("ajaxStop")))}return T},getJSON:function(e,t,n){return S.get(e,t,n,"json")},getScript:function(e,t){return S.get(e,void 0,t,"script")}}),S.each(["get","post"],function(e,i){S[i]=function(e,t,n,r){return m(t)&&(r=r||n,n=t,t=void 0),S.ajax(S.extend({url:e,type:i,dataType:r,data:t,success:n},S.isPlainObject(e)&&e))}}),S.ajaxPrefilter(function(e){var t;for(t in e.headers)"content-type"===t.toLowerCase()&&(e.contentType=e.headers[t]||"")}),S._evalUrl=function(e,t,n){return S.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,converters:{"text script":function(){}},dataFilter:function(e){S.globalEval(e,t,n)}})},S.fn.extend({wrapAll:function(e){var t;return this[0]&&(m(e)&&(e=e.call(this[0])),t=S(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(n){return m(n)?this.each(function(e){S(this).wrapInner(n.call(this,e))}):this.each(function(){var e=S(this),t=e.contents();t.length?t.wrapAll(n):e.append(n)})},wrap:function(t){var n=m(t);return this.each(function(e){S(this).wrapAll(n?t.call(this,e):t)})},unwrap:function(e){return this.parent(e).not("body").each(function(){S(this).replaceWith(this.childNodes)}),this}}),S.expr.pseudos.hidden=function(e){return!S.expr.pseudos.visible(e)},S.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},S.ajaxSettings.xhr=function(){try{return new C.XMLHttpRequest}catch(e){}};var Bt={0:200,1223:204},$t=S.ajaxSettings.xhr();y.cors=!!$t&&"withCredentials"in $t,y.ajax=$t=!!$t,S.ajaxTransport(function(i){var o,a;if(y.cors||$t&&!i.crossDomain)return{send:function(e,t){var n,r=i.xhr();if(r.open(i.type,i.url,i.async,i.username,i.password),i.xhrFields)for(n in i.xhrFields)r[n]=i.xhrFields[n];for(n in i.mimeType&&r.overrideMimeType&&r.overrideMimeType(i.mimeType),i.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest"),e)r.setRequestHeader(n,e[n]);o=function(e){return function(){o&&(o=a=r.onload=r.onerror=r.onabort=r.ontimeout=r.onreadystatechange=null,"abort"===e?r.abort():"error"===e?"number"!=typeof r.status?t(0,"error"):t(r.status,r.statusText):t(Bt[r.status]||r.status,r.statusText,"text"!==(r.responseType||"text")||"string"!=typeof r.responseText?{binary:r.response}:{text:r.responseText},r.getAllResponseHeaders()))}},r.onload=o(),a=r.onerror=r.ontimeout=o("error"),void 0!==r.onabort?r.onabort=a:r.onreadystatechange=function(){4===r.readyState&&C.setTimeout(function(){o&&a()})},o=o("abort");try{r.send(i.hasContent&&i.data||null)}catch(e){if(o)throw e}},abort:function(){o&&o()}}}),S.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),S.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return S.globalEval(e),e}}}),S.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),S.ajaxTransport("script",function(n){var r,i;if(n.crossDomain||n.scriptAttrs)return{send:function(e,t){r=S("<script>").attr(n.scriptAttrs||{}).prop({charset:n.scriptCharset,src:n.url}).on("load error",i=function(e){r.remove(),i=null,e&&t("error"===e.type?404:200,e.type)}),E.head.appendChild(r[0])},abort:function(){i&&i()}}});var _t,zt=[],Ut=/(=)\?(?=&|$)|\?\?/;S.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=zt.pop()||S.expando+"_"+wt.guid++;return this[e]=!0,e}}),S.ajaxPrefilter("json jsonp",function(e,t,n){var r,i,o,a=!1!==e.jsonp&&(Ut.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Ut.test(e.data)&&"data");if(a||"jsonp"===e.dataTypes[0])return r=e.jsonpCallback=m(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,a?e[a]=e[a].replace(Ut,"$1"+r):!1!==e.jsonp&&(e.url+=(Tt.test(e.url)?"&":"?")+e.jsonp+"="+r),e.converters["script json"]=function(){return o||S.error(r+" was not called"),o[0]},e.dataTypes[0]="json",i=C[r],C[r]=function(){o=arguments},n.always(function(){void 0===i?S(C).removeProp(r):C[r]=i,e[r]&&(e.jsonpCallback=t.jsonpCallback,zt.push(r)),o&&m(i)&&i(o[0]),o=i=void 0}),"script"}),y.createHTMLDocument=((_t=E.implementation.createHTMLDocument("").body).innerHTML="<form></form><form></form>",2===_t.childNodes.length),S.parseHTML=function(e,t,n){return"string"!=typeof e?[]:("boolean"==typeof t&&(n=t,t=!1),t||(y.createHTMLDocument?((r=(t=E.implementation.createHTMLDocument("")).createElement("base")).href=E.location.href,t.head.appendChild(r)):t=E),o=!n&&[],(i=N.exec(e))?[t.createElement(i[1])]:(i=xe([e],t,o),o&&o.length&&S(o).remove(),S.merge([],i.childNodes)));var r,i,o},S.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return-1<s&&(r=ht(e.slice(s)),e=e.slice(0,s)),m(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),0<a.length&&S.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?S("<div>").append(S.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},S.expr.pseudos.animated=function(t){return S.grep(S.timers,function(e){return t===e.elem}).length},S.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l=S.css(e,"position"),c=S(e),f={};"static"===l&&(e.style.position="relative"),s=c.offset(),o=S.css(e,"top"),u=S.css(e,"left"),("absolute"===l||"fixed"===l)&&-1<(o+u).indexOf("auto")?(a=(r=c.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),m(t)&&(t=t.call(e,n,S.extend({},s))),null!=t.top&&(f.top=t.top-s.top+a),null!=t.left&&(f.left=t.left-s.left+i),"using"in t?t.using.call(e,f):c.css(f)}},S.fn.extend({offset:function(t){if(arguments.length)return void 0===t?this:this.each(function(e){S.offset.setOffset(this,t,e)});var e,n,r=this[0];return r?r.getClientRects().length?(e=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:e.top+n.pageYOffset,left:e.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===S.css(r,"position"))t=r.getBoundingClientRect();else{t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===S.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=S(e).offset()).top+=S.css(e,"borderTopWidth",!0),i.left+=S.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-S.css(r,"marginTop",!0),left:t.left-i.left-S.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===S.css(e,"position"))e=e.offsetParent;return e||re})}}),S.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,i){var o="pageYOffset"===i;S.fn[t]=function(e){return $(this,function(e,t,n){var r;if(x(e)?r=e:9===e.nodeType&&(r=e.defaultView),void 0===n)return r?r[i]:e[t];r?r.scrollTo(o?r.pageXOffset:n,o?n:r.pageYOffset):e[t]=n},t,e,arguments.length)}}),S.each(["top","left"],function(e,n){S.cssHooks[n]=Fe(y.pixelPosition,function(e,t){if(t)return t=We(e,n),Pe.test(t)?S(e).position()[n]+"px":t})}),S.each({Height:"height",Width:"width"},function(a,s){S.each({padding:"inner"+a,content:s,"":"outer"+a},function(r,o){S.fn[o]=function(e,t){var n=arguments.length&&(r||"boolean"!=typeof e),i=r||(!0===e||!0===t?"margin":"border");return $(this,function(e,t,n){var r;return x(e)?0===o.indexOf("outer")?e["inner"+a]:e.document.documentElement["client"+a]:9===e.nodeType?(r=e.documentElement,Math.max(e.body["scroll"+a],r["scroll"+a],e.body["offset"+a],r["offset"+a],r["client"+a])):void 0===n?S.css(e,t,i):S.style(e,t,n,i)},s,n?e:void 0,n)}})}),S.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){S.fn[t]=function(e){return this.on(t,e)}}),S.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),S.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,n){S.fn[n]=function(e,t){return 0<arguments.length?this.on(n,null,e,t):this.trigger(n)}});var Xt=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;S.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),m(e))return r=s.call(arguments,2),(i=function(){return e.apply(t||this,r.concat(s.call(arguments)))}).guid=e.guid=e.guid||S.guid++,i},S.holdReady=function(e){e?S.readyWait++:S.ready(!0)},S.isArray=Array.isArray,S.parseJSON=JSON.parse,S.nodeName=A,S.isFunction=m,S.isWindow=x,S.camelCase=X,S.type=w,S.now=Date.now,S.isNumeric=function(e){var t=S.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},S.trim=function(e){return null==e?"":(e+"").replace(Xt,"")},"function"==typeof define&&define.amd&&define("jquery",[],function(){return S});var Vt=C.jQuery,Gt=C.$;return S.noConflict=function(e){return C.$===S&&(C.$=Gt),e&&C.jQuery===S&&(C.jQuery=Vt),S},"undefined"==typeof e&&(C.jQuery=C.$=S),S});


//(() => {
(function(global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.simpleTooltip = factory());
})(this, (function() {
	'use strict';
	
	function simpleTooltip(options) {
		
		this.destroy = function() {
			removeEvents();
		};
		
		const name = 'simple-tooltip',
			libName = 'simpleTooltip.js';
		
		let wordsIndexObject,
			tooltip,
			tooltipSelector,
			currentElement,
			currentContent = '',
			block;
		
		const opt = Object.assign({}, {
			nearMouse: true,
			prefer: 'bottom',
			tooltipWidth: 800,
			tooltipTag: 'div',
			tooltipId: name + '-box',
			offsetX: 10,
			offsetY: 20,
			debounce: 50,
			getContent: () => {},
			debug: false,
		}, options);
		
		tooltipSelector = `${opt.tooltipTag}.${opt.tooltipId }`;
		const processDebounce = debounce(processTooltip, opt.debounce);
		
		createTooltip();
		registerEvents();
		
		function createTooltip() {
			tooltip = createElement(document.body, opt.tooltipTag, { 'id': opt.tooltipId });
			const div = createElement(tooltip, 'div', { 'id': 'content' });
			
			addEvent(tooltip, 'mousedown', (e) => e.preventDefault());
			addEvent(tooltip, 'click', listItemClick);
		}
		
		function hideTooltip() {
			block = true;
			setTimeout(() => { block = false; }, 200);
			hide();
		}
		
		function destroyTooltip() {
			if (tooltip) {
				remove(tooltip, 'click', listItemClick);
				remove(tooltip, 'mousedown', (e) => e.preventDefault());
				document.body.removeChild(tooltip);
			}
		}
		
		function listItemClick(e) {
			console.log('listItemClick');
		}
		
		function registerEvents() {
			addEvent(window, 'load', hideLists);    // FireFox displays all lists on load
			addEvent(window, 'resize', hide);
			addEvent(document, 'click', outsideClick);
			
			addEvent(document.body, 'mousemove', onMouseMove);
		}
		
		function onMouseMove(e) {
			if ( !block) processDebounce(e);
		}
		
		function processTooltip(e) {
			if (e.target === currentElement) {
				if (currentContent) {
					show(currentContent, e);
				}
				return;
				
			} else {
				hide();
			}
			
			const elem = getElementAtPoint(e.clientX, e.clientY);
			
			if (elem) {
				let content;
				
				if (elem.tagName === 'A' && elem.hasAttribute('href')) {
					const href = elem.getAttribute('href');
					
					if ( !href.includes('#') || !isValid(elem, e.clientX)) return;
					
					content = opt.getContent(elem);
					
				} else if (elem.hasAttribute('tooltip') && isValid(elem, e.clientX)) {
					content = elem.getAttribute('tooltip');
				}
				
				if (content) {
					currentContent = content;
					currentElement = elem;
					
					show(currentContent, e);
					return;
				}
			}
			hide();
		}
		
		// checks whether the mouse pointer is within element boundary
		function isValid(elem, cursorPos) {
			const rect = elem.getBoundingClientRect();
			return cursorPos > rect.left && cursorPos < rect.right;
		}
		
		function hideLists() {
			setTimeout(() => {
				document.querySelectorAll(tooltipSelector).forEach(elem => { elem.style.display = 'none'; });
			}, 20);
		}
		
		function outsideClick(e) {
			if ( !tooltip.contains(e.target)) hide();
		}
		
		function getElementAtPoint(x, y) {
			let range, textNode, offset;
			
			if (document.caretPositionFromPoint) {
				range = document.caretPositionFromPoint(x, y);
				textNode = range.offsetNode;
				//offset = range.offset;
				
			} else if (document.caretRangeFromPoint) {
				range = document.caretRangeFromPoint(x, y);
				textNode = range.startContainer;
				//offset = range.startOffset;
			}
			
			if (textNode && textNode.nodeType == 3) {
				return textNode.parentNode;
			}
			return null;
		}
		
		function show(content, e) {
			const div = tooltip.lastElementChild;
			div.innerHTML = '';
			
			//tooltip.style.width = 800 + 'px';
			div.innerHTML = content;
			
			if (content.length > 200) {
				tooltip.style.width = opt.tooltipWidth + 'px';
				
			} else {
				tooltip.style.width = 'auto';
			}
			
			const rect = getTooltipPlacement(e, opt.tooltipWidth);
			//console.log(rect);
			tooltip.style.top = rect.top + 'px';
			tooltip.style.left = rect.left + 'px';
			
			if (rect.tooltipWidth != opt.tooltipWidth) {
				tooltip.style.display = 'none';
				tooltip.style.width = rect.tooltipWidth + 'px';
				tooltip.style.display = 'block';
			}
			
			tooltip.scrollTop = 0;
		}
		
		function hide() {
			tooltip.lastElementChild.innerHTML = '';
			tooltip.style.display = 'none';
		}
		
		function getTooltipPlacement(e, tooltipWidth) {
			const elementRect = currentElement.getBoundingClientRect();
			// must be set first
			tooltip.style.display = 'block';
			
			const style = window.getComputedStyle(currentElement),
				lineLeight = style.getPropertyValue('lineHeight') || 0;
			
			const tooltipRect = tooltip.getBoundingClientRect(),
				winOffsetY = window.pageYOffset,
				winOffsetX = window.pageXOffset,
				winTop = winOffsetY,
				winLeft = winOffsetX,
				winRight = winOffsetX + window.innerWidth,
				winBottom = winOffsetY + window.innerHeight,
				halfWinHeight = window.innerHeight / 2,
				halfWinWidth = window.innerWidth / 2;
			
			let elemTop = elementRect.top + winOffsetY - opt.offsetY,
				elemBottom = elementRect.bottom + winOffsetY + opt.offsetX,
				elemRight = elementRect.right + winOffsetX,
				elemLeft = elementRect.left + winOffsetX,
				caretY = e.clientY + winOffsetY,
				caretX = e.clientX + winOffsetX;
			
			const isBroken = lineLeight < elementRect.height,    // a long element text is break at space
				pos = {};
			
			//console.log(caretX, lineLeight, elementRect );
			
			const posOrder = ['top', 'bottom', 'right', 'left'];
			
			if (opt.prefer) {
				const preferArray = Array.isArray(opt.prefer) ? opt.prefer :[opt.prefer];
				
				if (getPosition(preferArray)) return pos;
				
				const remains = posOrder.filter((str) => !preferArray.includes(str));
				
				if (getPosition(remains)) return pos;
				
			} else {
				if (getPosition(posOrder)) return pos;
			}
			
			function getPosition(array) {
				for (let i = 0; i < array.length; i++) {
					const place = array[i];
					
					if (place === 'top' && checkTop()) return true;
					
					if (place === 'bottom' && checkBottom()) return true;
					
					if (place === 'right' && checkRight()) return true;
					
					if (place === 'left' && checkLeft()) return true;
				}
				return false;
			}
			
			function checkTop() {
				if (elemTop - tooltipRect.height > winTop + 20) {    // fit Top
					pos.top = elemTop - tooltipRect.height;
					pos.left = getLeft();
					return true;
				}
				return false;
			}
			
			function checkBottom() {
				if (elemBottom + tooltipRect.height < winBottom - 20) {    //fit Bottom
					pos.top = elemBottom + opt.offsetY;
					pos.left = getLeft();
					//console.log('checkBottom', isBroken, caretX, elemLeft);
					return true;
				}
				return false;
			}
			
			function checkRight(allowLeft) {
				if (caretX + tooltipRect.width + 20 < winRight) {    // enough space on right
					if (elemRight + tooltipRect.width + 20 < winRight) {    // enough space on right
						pos.left = elemRight + 20;    // right of element
						
					} else if (allowLeft && elementRect.left - tooltipRect.width - 20 > winLeft) {    // enough space on left
						pos.left = elementRect.left - tooltipRect.width - 20;
						
					} else {
						//pos.left = e.clientX + 20;    // right of cursor
						pos.left = caretX + 20;    // right of cursor
					}
					pos.top = getTop();
					return true;
				}
				return false;
			}
			
			function checkLeft(allowRight) {
				if (caretX - tooltipRect.width - 20 > winLeft) {    // enough space on left
					if (elementRect.left - tooltipRect.width - 20 > winLeft) {    // enough space on left
						pos.left = elementRect.left - tooltipRect.width - 20;
						
					} else if (allowRight && elemRight + tooltipRect.width + 20 < winRight) {    // enough space on right
						pos.left = elemRight + 20;    // right of element
						
					} else {
						//pos.left = e.clientX - tooltipRect.width - 20;    // left of cursor
						pos.left = caretX - tooltipRect.width - 20;    // left of cursor
					}
					pos.top = getTop();
					return true;
				}
				return false;
			}
			
			//console.log('checkLeft', isBroken, caretX, elemLeft);
			
			function getTop() {
				console.log('getTop', isBroken, caretX, elemLeft, elemRight, winRight);
				return Math.min(Math.max(caretY - (tooltipRect.height / 2), winTop + 10), winBottom - tooltipRect.height);
			}
			
			function getLeft() {
				console.log('getLeft', isBroken, caretX, elemLeft, elemRight);
				const posX = isBroken ? caretX : elemLeft;
				//const posX = isBroken ? elemRight + tooltipRect.width < winRight ? elemRight : caretX : elemLeft;
				return Math.min(Math.max(posX - tooltipRect.width / 2, winLeft), winRight - tooltipRect.width - 20);
			}
			
			console.log('FAILED');
			
			return { top: winTop, left: winLeft };
		}
		
		function debounce(callback, duration) {
			let id;
			return function(arg) {
				clearTimeout(id);
				id = setTimeout(() => { callback(arg); }, duration);
			};
		}
		
		function log() {
			if (opt.debug) {
				console.log(libName + ': ' + Array.from(arguments).join(' '));
			}
		}
		
		function removeEvents() {
			remove(document, 'click', outsideClick);
			remove(window, 'resize', hide);
			remove(window, 'load', hideLists);
			remove(document.body, 'mousemove', onMouseMove);
			
			if (tooltip) document.body.removeChild(tooltip);
		}
		
		function addEvent(elem, type, fn) {
			elem.addEventListener(type, fn);
		}
		
		function remove(elem, type, fn) {
			elem.removeEventListener(type, fn);
		}
		
		function createElement(parent, tag, attributes, content) {
			var elem = document.createElement(tag);
			if (attributes) {
				for (var name in attributes) {
					elem.setAttribute(name, attributes[name]);
				}
			}
			if (content) elem.textContent = content;
			parent.appendChild(elem);
			return elem;
		}
	}
	return simpleTooltip;
}));


/*!***************************************************
* advanced-mark.js v3.0.0
* https://github.com/angezid/advanced-mark.js
* MIT licensed
* Copyright (c) 2022–2026, angezid
* Based on 'mark.js', license https://git.io/vwTVl
*****************************************************/
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).Mark=e()}(this,(function(){"use strict";function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,(o=r.key,i=void 0,"symbol"==typeof(i=function(t,e){if("object"!=typeof t||null===t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var r=n.call(t,e||"default");if("object"!=typeof r)return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(o,"string"))?i:String(i)),r)}var o,i}function r(t,e,r){return e&&n(t.prototype,e),r&&n(t,r),Object.defineProperty(t,"prototype",{writable:!1}),t}function o(){return o=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},o.apply(this,arguments)}var i=function(){function t(n,r){e(this,t),this.ctx=n,this.opt=r,this.map=new Map}return r(t,[{key:"getContexts",value:function(){var t=this.ctx,e=this.opt.window,n=!1;if(!t)return[];Array.isArray(t)?n=!0:"string"==typeof t?t=e.document.querySelectorAll(t):void 0===t.length&&(t=[t]);for(var r=[],o=function(e){r.includes(t[e])||r.some((function(n){return n.contains(t[e])}))||r.push(t[e])},i=0;i<t.length;i++)o(i);return n&&r.sort((function(t,n){return(t.compareDocumentPosition(n)&e.Node.DOCUMENT_POSITION_FOLLOWING)>0?-1:1})),r}},{key:"getIframeContents",value:function(t,e,n){try{var r=t.contentWindow.document;r&&(this.map.set(t,"ready"),e({iframe:t,context:r}))}catch(e){n({iframe:t,error:e})}}},{key:"observeIframeLoad",value:function(t,e,n){var r=this;if(!this.map.has(t)){var o=null,i=function i(){clearTimeout(o),t.removeEventListener("load",i),r.getIframeContents(t,e,n)};t.addEventListener("load",i),this.map.set(t,!0),o=setTimeout(i,this.opt.iframesTimeout)}}},{key:"onIframeReady",value:function(t,e,n){var r="about:blank",o=t.getAttribute("src"),i=t.contentWindow;try{"complete"!==i.document.readyState||o&&o.trim()!==r&&i.location.href===r?this.observeIframeLoad(t,e,n):this.getIframeContents(t,e,n)}catch(t){n(t)}}},{key:"waitForIframes",value:function(t,e){var n,r,o=this,i=this.opt.shadowDOM,a=0,s=0,c=function t(e){for(var a=o.createIterator(e,o.opt.window.NodeFilter.SHOW_ELEMENT);r=a.nextNode();)o.isIframe(r)&&!o.map.has(r)&&(n.push(r),s++),i&&r.shadowRoot&&"open"===r.shadowRoot.mode&&t(r.shadowRoot)};!function t(r){n=[],r.iframe&&"about:blank"===r.context.location.href||(c(r.context),r.iframe||n.length)?n.length?n.forEach((function(n){o.onIframeReady(n,(function(e){a++,t(e)}),(function(t){o.opt.debug&&console.log(t.error||t),++a===s&&e()}))})):a===s&&e():e()}({context:t})}},{key:"createIterator",value:function(t,e){var n=this.opt.window;return n.document.createNodeIterator(t,e,(function(){return n.NodeFilter.FILTER_ACCEPT}),!1)}},{key:"addRemoveStyle",value:function(t,e,n){if(!n||e){var r=t.querySelector("style[data-markjs]");n?(r||((r=this.opt.window.document.createElement("style")).setAttribute("data-markjs","true"),t.appendChild(r)),r.textContent=e):r&&t.removeChild(r)}}},{key:"isIframe",value:function(e){return"IFRAME"===e.tagName&&!t.matches(e,this.opt.exclude)}},{key:"iterateThroughNodes",value:function(t,e,n,r,o){var i=this,a=this.opt.window.NodeFilter,s=this.opt.shadowDOM,c=this.opt.iframes;if(c||s){var u=(e&a.SHOW_ELEMENT)>0,h=(e&a.SHOW_TEXT)>0;!function t(o){for(var l,f=i.createIterator(o,e|a.SHOW_ELEMENT);o=f.nextNode();)if(1===o.nodeType){if(u&&n(o)&&r(o),c&&i.isIframe(o)&&"ready"===i.map.get(o)){var d=o.contentWindow.document;d&&t(d)}s&&(l=o.shadowRoot)&&"open"===l.mode&&(i.addRemoveStyle(l,s.style,h),t(l))}else h&&3===o.nodeType&&n(o)&&r(o)}(t)}else for(var l,f=this.createIterator(t,e);l=f.nextNode();)n(l)&&r(l);o()}},{key:"forEachNode",value:function(t,e,n){var r=this,o=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(){},i=this.getContexts(),a=i.length;a||o();var s=function(){i.forEach((function(i){r.iterateThroughNodes(i,t,n,e,(function(){--a<=0&&o()}))}))};if(this.opt.iframes){var c=a;i.forEach((function(t){r.waitForIframes(t,(function(){--c<=0&&s()}))}))}else s()}}],[{key:"matches",value:function(t,e){if(!e||!e.length)return!1;var n="string"==typeof e?[e]:e,r=t.matches;return r&&n.some((function(e){return r.call(t,e)}))}}]),t}(),a=function(){function t(n){e(this,t),this.opt=o({},{diacritics:!0,synonyms:{},accuracy:"partially",caseSensitive:!1,ignoreJoiners:!1,ignorePunctuation:[],wildcards:"disabled"},n)}return r(t,[{key:"chars",get:function(){var t=this;return this._chars||(this._chars=[],["aàáảãạăằắẳẵặâầấẩẫậäåāą","cçćč","dđď","eèéẻẽẹêềếểễệëěēę","iìíỉĩịîïī","lł","nñňń","oòóỏõọôồốổỗộơởỡớờợöøōő","rř","sšśșş","tťțţ","uùúủũụưừứửữựûüůūű","yýỳỷỹỵÿ","zžżź"].forEach((function(e){t._chars.push(e,e.toUpperCase())}))),this._chars}},{key:"create",value:function(t){var e=this,n="g".concat(this.opt.caseSensitive?"":"i");t=t.map((function(t){return"("+e.createPattern(t,n)+")"}));var r=this.createAccuracy(t.join("|"));return new RegExp("".concat(r.lookbehind,"(").concat(r.pattern,")").concat(r.lookahead),n)}},{key:"createPattern",value:function(t,e){t=this.checkWildcardsEscape(t),t=this.createSynonyms(t,e);var n=this.getJoinersPunctuation();return n&&(t=this.setupIgnoreJoiners(t)),this.opt.diacritics&&(t=this.createDiacritics(t)),t=t.replace(/\s+/g,"[\\s]+"),n&&(t=this.createJoiners(t,n)),"disabled"!==this.opt.wildcards&&(t=this.createWildcards(t)),t}},{key:"createCombinePattern",value:function(t,e){var n=this;if(!Array.isArray(t)||!t.length)return null;var r=e?"(":"(?:",o=this.create(t[0],!0);return o.pattern=this.distinct(t.map((function(t){return"".concat(r).concat(n.create(t,!0).pattern,")")}))).join("|"),o}},{key:"escape",value:function(t){return t.replace(/[[\]/{}()*+?.\\^$|]/g,"\\$&")}},{key:"preprocess",value:function(t){return t&&t.length?this.distinct("string"==typeof t?t.split(""):t).join("").replace(/[-^\]\\]/g,"\\$&"):""}},{key:"distinct",value:function(t){var e=[];return t.forEach((function(t){t.trim()&&!e.includes(t)&&e.push(t)})),e}},{key:"createSynonyms",value:function(t,e){var n=this,r=this.opt.synonyms;for(var o in r)if(r.hasOwnProperty(o)){var i=Array.isArray(r[o])?r[o]:[r[o]];if(i.unshift(o),(i=this.distinct(i)).length>1){i.sort((function(t,e){return e.length-t.length}));var a=(i=i.map((function(t){return n.checkWildcardsEscape(t)}))).map((function(t){return n.escape(t)})).join("|");t=t.replace(new RegExp(a,e),"(?:".concat(i.join("|"),")"))}}return t}},{key:"checkWildcardsEscape",value:function(t){return"disabled"!==this.opt.wildcards&&(t=t.replace(/(\\.)+|[?*]/g,(function(t,e){return e?t:"?"===t?"":""})).replace(/\\(?=[?*\x01\x02])/g,"")),this.escape(t)}},{key:"createWildcards",value:function(t){var e="withSpaces"===this.opt.wildcards,n=this.opt.blockElementsBoundary,r="[^".concat(e&&n?"":"","]*?");return t.replace(/\x01/g,e?"[^]?":"\\S?").replace(/\x02/g,e?r:"\\S*")}},{key:"setupIgnoreJoiners",value:function(t){return t.replace(/((?:\\\\)+|\x02|\(\?:|\|)|\\?(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|.)(?=([|)\x02]|$)|.)/g,(function(t,e,n){return e||void 0!==n?t:t+"\0"}))}},{key:"createJoiners",value:function(t,e){return t.split(/\x00+/).join("[".concat(e,"]*"))}},{key:"getJoinersPunctuation",value:function(){var t=this.preprocess(this.opt.ignorePunctuation),e=t||"";return this.opt.ignoreJoiners&&(e+="\\u00ad\\u200b\\u200c\\u200d"),e}},{key:"createDiacritics",value:function(t){var e=this,n=this.chars;return t.split("").map((function(t){for(var r=0;r<n.length;r+=2){var o=n[r].includes(t);if(e.opt.caseSensitive){if(o)return"["+n[r]+"]";if(n[r+1].includes(t))return"["+n[r+1]+"]"}else if(o||n[r+1].includes(t))return"["+n[r]+n[r+1]+"]"}return t})).join("")}},{key:"createAccuracy",value:function(t){var e,n=this.opt.accuracy,r="()",o="(?:".concat(t,")"),i="";if("partially"!==n)if("string"!=typeof n&&(e=this.preprocess(n.limiters),n=n.value),"exactly"===n){var a=e?"[\\s"+e+"]":"\\s";r="(^|".concat(a,")"),i="(?=$|".concat(a,")")}else{var s=e||"!-/:-@[-`{-~¡¿",c="[^\\s".concat(s,"]*");"complementary"===n?o=c+o+c:"startsWith"===n&&(r="(^|[\\s".concat(s,"])"),o=o.split(/\[\\s\]\+/).join(c+"[\\s]+")+c)}return{lookbehind:r,pattern:o,lookahead:i}}}]),t}(),s=function(){function n(t){e(this,n),this.ctx=t,this.nodeNames=["script","style","title","head","html"]}return r(n,[{key:"opt",get:function(){return this._opt},set:function(t){if(!(t&&t.window&&t.window.document)&&"undefined"==typeof window)throw new Error("Mark.js: please provide a window object as an option.");var e=t&&t.window||window,n=t&&t.highlight&&t.highlight instanceof Highlight;this._opt=o({},{window:e,element:"",className:"",exclude:[],iframes:!1,iframesTimeout:5e3,separateWordSearch:!0,rangeAcrossElements:!0,acrossElements:!1,ignoreGroups:0,each:function(){},noMatch:function(){},filter:function(){return!0},done:function(){},debug:!1,log:e.console},t),this._opt.element||(this._opt.element="mark"),this.filter=e.NodeFilter,this.empty=e.document.createTextNode(""),n?this.rangeArray=[]:this._opt.highlight=null}},{key:"iterator",get:function(){return new i(this.ctx,this.opt)}},{key:"log",value:function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"debug";if(this.opt.debug){var r=this.opt.log;"object"===t(r)&&"function"==typeof r[n]&&r[n]("mark.js: ".concat(e))}}},{key:"report",value:function(t){var e=this;t.forEach((function(t){e.log("".concat(t.text," ").concat(JSON.stringify(t.obj)),t.level||"debug"),t.skip||e.opt.noMatch(t.obj)}))}},{key:"getSeachTerms",value:function(t){var e="string"==typeof t?[t]:t,n=this.opt.separateWordSearch,r=[],o={},i=function(t){t.split(/ +/).forEach((function(t){return a(t)}))},a=function(t){t.trim()&&!r.includes(t)&&(r.push(t),o[t]=0)};return e.forEach((function(t){n?"preserveTerms"===n?t.split(/"("*[^"]+"*)"/).forEach((function(t,e){e%2>0?a(t):i(t)})):i(t):a(t)})),r.sort((function(t,e){return e.length-t.length})),{terms:r,termStats:o}}},{key:"isNumeric",value:function(t){return Number(parseFloat(t))==t}},{key:"checkRanges",value:function(t,e,n,r){var o=this,i="error",a=t.filter((function(t){return!!(o.isNumeric(t.start)&&o.isNumeric(t.length)&&(t.start=parseInt(t.start),t.length=parseInt(t.length),t.start>=n&&t.start<r&&t.length>0))||(e.push({text:"Invalid range: ",obj:t,level:i}),!1)})).sort((function(t,e){return t.start-e.start}));if(this.opt.wrapAllRanges)return a;var s,c=0;return a.filter((function(t){return s=t.start+t.length,t.start>=c?(c=s,!0):(e.push({text:(s<c?"Nest":"Overlapp")+"ing range: ",obj:t,level:i}),!1)}))}},{key:"setType",value:function(t,e){var n=Array.isArray(e.tagNames)&&e.tagNames.length;if(n&&e.tagNames.forEach((function(e){return t[e.toLowerCase()]=2})),!n||e.extend)for(var r in t)t[r]=2;t.br=3}},{key:"getTextNodesAcross",value:function(t){var e,n,r,o=this,i={div:1,p:1,li:1,td:1,tr:1,th:1,ul:1,ol:1,dd:1,dl:1,dt:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,hr:1,blockquote:1,figcaption:1,figure:1,pre:1,table:1,thead:1,tbody:1,tfoot:1,input:1,img:1,nav:1,details:1,label:1,form:1,select:1,menu:1,br:3,menuitem:1,main:1,section:1,article:1,aside:1,picture:1,output:1,button:1,header:1,footer:1,address:1,area:1,canvas:1,map:1,fieldset:1,textarea:1,track:1,video:1,audio:1,body:1,iframe:1,meter:1,object:1,svg:1},a=[],s=this.opt.blockElementsBoundary,c=s?2:1,u="";s&&(this.setType(i,s),s.char&&(u=s.char.charAt(0)));var h={text:"",regex:/\s/,tags:i,boundary:s,str:"",ch:u};this.iterator.forEachNode(this.filter.SHOW_ELEMENT|this.filter.SHOW_TEXT,(function(t){r&&a.push(o.getNodeInfo(r,t,n,h)),n=null,r=t}),(function(t){return 1===t.nodeType?(3===(e=i[t.nodeName.toLowerCase()])&&(h.str+="\n"),n&&e!==c||(n=e),!1):!o.excluded(t.parentNode)}),(function(){r&&a.push(o.getNodeInfo(r,null,n,h)),t({text:h.text,nodes:a,lastIndex:0})}))}},{key:"getNodeInfo",value:function(t,e,n,r){var o=r.text.length,i=r.ch,a=0,s=r.str,c=t.textContent;if(e){var u=r.regex.test(e.textContent[0]),h=u&&r.regex.test(c[c.length-1]);if(r.boundary||!h){var l=n;if(!n)for(var f=t.parentNode;f;){if(n=r.tags[f.nodeName.toLowerCase()]){l=!(f===e.parentNode||f.contains(e));break}f=f.parentNode}l&&(h?2===n&&(s+=h?i:u?" "+i:i+" "):s+=1===n?" ":2===n?" "+i+" ":"")}}return s&&(c+=s,a=s.length,r.str=""),r.text+=c,this.createInfo(t,o,r.text.length-a,a)}},{key:"getRangesTextNodes",value:function(t,e){var n,r=this,o=[],i=/\n/g,a=[0],s=this.filter.SHOW_TEXT|(e?this.filter.SHOW_ELEMENT:0),c="",u=0;this.iterator.forEachNode(s,(function(t){if(e)for(;null!==(n=i.exec(t.textContent));)a.push(u+n.index);c+=t.textContent,o.push({start:u,end:u=c.length,offset:0,node:t})}),(function(t){return e&&1===t.nodeType?("br"===t.tagName.toLowerCase()&&a.push(u),!1):!r.excluded(t.parentNode)}),(function(){var n={text:c,nodes:o,lastIndex:0};e&&(a.push(u),n.newLines=a),t(n)}))}},{key:"getTextNodes",value:function(t){var e=this,n=[],r=0;this.iterator.forEachNode(this.filter.SHOW_TEXT,(function(t){n.push({node:t,start:r}),r+=t.textContent.length}),(function(t){return!e.excluded(t.parentNode)}),(function(){t({nodes:n,lastIndex:0})}))}},{key:"excluded",value:function(t){return this.nodeNames.includes(t.nodeName.toLowerCase())||i.matches(t,this.opt.exclude)}},{key:"wrapRangeInsert",value:function(t,e,n,r,o,i){var a=r===e.node.textContent.length,s=e.end,c=1,u=r,h=e.node;0!==n?(h=h.splitText(n),u=r-n,c=a?2:3):a&&(c=0);var l=a?this.empty:h.splitText(u),f=this.createElement(h),d=f.childNodes[0],p=this.createInfo(l,0===c||2===c?s:e.start+r,s,e.offset);if(0===c)return e.node=d,{mark:f,nodeInfo:p,increment:0};var g=this.createInfo(d,1===c?e.start:o,e.start+r,0);return 1===c?t.nodes.splice(i,1,g,p):(2===c?t.nodes.splice(i+1,0,g):t.nodes.splice(i+1,0,g,p),e.end=o,e.offset=0),{mark:f,nodeInfo:p,increment:c<3?1:2}}},{key:"createInfo",value:function(t,e,n,r){return{node:t,start:e,end:n,offset:r}}},{key:"wrapRange",value:function(t,e,n,r){var o,i=t.node;if(this.rangeArray)this.createRange(i,e,i,n,t.start+e,r),o=i;else{var a=n===i.textContent.length,s=n;0!==e&&(i=i.splitText(e),s=n-e),o=a?this.empty:i.splitText(s),r(this.createElement(i))}return o}},{key:"createRange",value:function(t,e,n,r,o,i){var a=new Range;a.setStart(t,e),a.setEnd(n,r),a.absoluteOffset=o,i(a,!0),a&&this.rangeArray.push(a)}},{key:"createElement",value:function(t){var e=this.opt.window.document.createElement(this.opt.element);return e.setAttribute("data-markjs","true"),this.opt.className&&e.setAttribute("class",this.opt.className),e.textContent=t.textContent,t.parentNode.replaceChild(e,t),e}},{key:"wrapRangeAcross",value:function(t,e,n,r,o){var i,a,s=t.lastIndex,c=!0,u=[],h=this.opt.wrapAllRanges,l=this.opt.highlight,f=l&&this.opt.rangeAcrossElements;if(h)for(;s>0&&t.nodes[s].start>e;)s--;for(;s<t.nodes.length;s++)if(s+1===t.nodes.length||t.nodes[s+1].start>e){var d=t.nodes[s];if(f)u.push(d.node);else if(!r(d.node))break;var p=e-d.start;if(a=(n>d.end?d.end:n)-d.start,p>=0&&a>p){if(f)c&&(i=[d.node,p,d.start+p]);else if(!l&&h){var g=this.wrapRangeInsert(t,d,p,a,e,s);d=g.nodeInfo,o(g.mark,c)}else d.node=this.wrapRange(d,p,a,(function(t){o(t,c)})),d.start+=a;c=!1}if(!(n>d.end)){i&&r(u)&&this.createRange(i[0],i[1],d.node,a,i[2],o);break}e=d.end+d.offset}t.lastIndex=s}},{key:"wrapGroups",value:function(t,e,n,r,o){for(var i,a,s=0,c=0,u=0,h=!1,l=t.node,f=0;++u<e.length;)(i=e[u])&&(a=e.indices[u][0])>=s&&(f=e.indices[u][1],r(t.node,i,u)&&(l=this.wrapRange(t,a-c,f-c,(function(t){o(t,u)})),f>s&&(s=f),c=f,h=!0));return h?this.opt.highlight||(n.lastIndex=0):0===e[0].length&&this.setLastIndex(n,f),l}},{key:"wrapGroupsAcross",value:function(t,e,n,r,o){for(var i,a,s,c=0,u=0,h=0;++u<e.length;)(a=e[u])&&(i=e.indices[u][0],(this.opt.wrapAllRanges||i>=c)&&(h=e.indices[u][1],s=!1,this.wrapRangeAcross(t,i,h,(function(t){return r(t,a,u)}),(function(t,e){s=!0,o(t,u,e)})),s&&h>c&&(c=h)));0===e[0].length&&this.setLastIndex(n,h)}},{key:"setLastIndex",value:function(t,e){var n=t.lastIndex;t.lastIndex=e>n?e:e>0?n+1:1/0}},{key:"processGroups",value:function(t,e,n,r,o){var i,a,s,c=this,u={abort:!1},h={execution:u},l=0;this.getTextNodes((function(e){e.nodes.every((function(e){for(;null!==(i=t.exec(e.node.textContent))&&(h.match=i,a=s=!0,e.node=c.wrapGroups(e,i,t,(function(t,e,r){return h.matchStart=a,h.groupIndex=r,a=!1,n(t,e,h)}),(function(t,e){s&&l++,r(t,{match:i,matchStart:s,count:l,groupIndex:e}),s=!1})),!u.abort););return!u.abort})),o(l)}))}},{key:"processGroupsAcross",value:function(t,e,n,r,o){var i,a,s,c=this,u={abort:!1},h={execution:u},l=0;this.getTextNodesAcross((function(e){for(;null!==(i=t.exec(e.text))&&(h.match=i,a=s=!0,c.wrapGroupsAcross(e,i,t,(function(t,e,r){return h.matchStart=a,h.groupIndex=r,a=!1,n(t,e,h)}),(function(t,e,n){s&&l++,r(t,{match:i,matchStart:s,count:l,groupIndex:e,groupStart:n}),s=!1})),!u.abort););o(l)}))}},{key:"processMatches",value:function(t,e,n,r,o){var i,a,s=this,c=0===e?0:e+1,u={abort:!1},h={execution:u},l=0;this.getTextNodes((function(e){e.nodes.every((function(e){for(;null!==(i=t.exec(e.node.textContent));)if(""!==(a=i[c])){if(h.match=i,n(e.node,a,h)){for(var o=0,f=i.index;++o<c;)i[o]&&(f+=i[o].length);var d=f+a.length;if(e.node=s.wrapRange(e,f,d,(function(t){r(t,{match:i,count:++l})})),s.opt.highlight||(t.lastIndex=0),u.abort)break}}else t.lastIndex++;return!u.abort})),o(l)}))}},{key:"processMatchesAcross",value:function(t,e,n,r,o){var i,a,s,c=this,u=0===e?0:e+1,h={abort:!1},l={execution:h},f=0;this.getTextNodesAcross((function(e){for(;null!==(i=t.exec(e.text));)if(""!==(a=i[u])){l.match=i,s=!0;for(var d=0,p=i.index;++d<u;)i[d]&&(p+=i[d].length);if(c.wrapRangeAcross(e,p,p+a.length,(function(t){return l.matchStart=s,s=!1,n(t,a,l)}),(function(t,e){e&&f++,r(t,{match:i,matchStart:e,count:f})})),h.abort)break}else t.lastIndex++;o(f)}))}},{key:"processRanges",value:function(t,e,n,r){var o=this,i=this.opt.markLines,a=[],s=[],c="warn",u=0;this.getRangesTextNodes((function(h){var l=i?h.newLines.length:h.text.length,f=o.checkRanges(t,a,i?1:0,l);f.forEach((function(t,r){var f=t.start,d=f+t.length;d>l&&(a.push({text:"Range was limited to: ".concat(l),obj:t,skip:!0,level:c}),d=l),i&&(f=h.newLines[f-1],"\n"===h.text[f]&&f++,d=h.newLines[d-1]);var p=h.text.slice(f,d);p.trim()?o.wrapRangeAcross(h,f,d,(function(n){return e(n,t,p,r)}),(function(e,r){r&&u++,n(e,t,{matchStart:r,count:u})})):(a.push({text:"Skipping whitespace only range: ",obj:t,level:c}),s.push(t))})),o.log("Valid ranges: ".concat(JSON.stringify(f.filter((function(t){return!s.includes(t)}))))),r(u,a)}),i)}},{key:"unwrapMatches",value:function(t){var e=t.parentNode,n=t.firstChild;if(1===t.childNodes.length)if(3===n.nodeType){var r=t.previousSibling,o=t.nextSibling;if(r&&3===r.nodeType)o&&3===o.nodeType?(r.nodeValue+=n.nodeValue+o.nodeValue,e.removeChild(o)):r.nodeValue+=n.nodeValue;else{if(!o||3!==o.nodeType)return void e.replaceChild(t.firstChild,t);o.nodeValue=n.nodeValue+o.nodeValue}e.removeChild(t)}else e.replaceChild(t.firstChild,t);else{if(n){for(var i=this.opt.window.document.createDocumentFragment();t.firstChild;)i.appendChild(t.removeChild(t.firstChild));e.replaceChild(i,t)}else e.removeChild(t);e.normalize()}}},{key:"markRegExp",value:function(t,e){var n=this;this.opt=e;var r=0,o=0,i=this.opt.acrossElements,a="processMatches";if(this.opt.separateGroups){if(!t.hasIndices)throw new Error("Mark.js: RegExp must have a `d` flag");a=i?"processGroupsAcross":"processGroups"}else i&&(a="processMatchesAcross");if(!t.global&&!t.sticky){var s=t.toString().split("/");t=new RegExp(t.source,"g"+s[s.length-1]),this.log("RegExp is recompiled - it must have a `g` flag","warn")}this.log('RegExp "'.concat(t,'"')),this[a](t,this.opt.ignoreGroups,(function(t,e,r){return n.opt.filter(t,e,o,r)}),(function(t,e){o=e.count,r++,n.opt.each(t,e)}),(function(e){0===e&&n.opt.noMatch(t),n.registerHighlight(),n.opt.done(r,e)}))}},{key:"mark",value:function(t,e){var n=this;this.opt=e;var r=this.getSeachTerms(t),o=r.terms,i=r.termStats;if(o.length){var a,s,c=0,u=0,h=0,l=this.opt.acrossElements,f=l?"processMatchesAcross":"processMatches",d=this.getRegExps(o);!function t(e){var r=e.regex,o=e.regTerms;n.log("RegExp ".concat(r)),n[f](r,1,(function(t,e,r){return l&&!r.matchStart||(a=n.getCurrentTerm(r.match,o)),s=i[a],n.opt.filter(t,a,h+s,s,r)}),(function(t,e){u++,l&&!e.matchStart||(i[a]+=1),n.opt.each(t,e)}),(function(e){h+=e;var r=o.filter((function(t){return 0===i[t]}));r.length&&n.opt.noMatch(r),++c<d.length?t(d[c]):(n.registerHighlight(),n.opt.done(u,h,i))}))}(d[0])}else this.opt.done(0,0,i)}},{key:"getCurrentTerm",value:function(t,e){for(var n=t.length;--n>2;)if(t[n])return e[n-3];return" "}},{key:"getRegExps",value:function(t){var e,n=new a(this.opt),r=this.opt.combineBy||this.opt.combinePatterns,o=t.length,i=[],s=10;r===1/0?s=o:!isNaN(+r)&&(e=parseInt(r))>0&&(s=e);for(var c=0;c<o;c+=s){var u=t.slice(c,Math.min(c+s,o));i.push({regex:n.create(u),regTerms:u})}return i}},{key:"markRanges",value:function(t,e){var n=this;if(this.opt=e,Array.isArray(t)){var r=0;this.processRanges(t,(function(t,e,r,o){return n.opt.filter(t,e,r,o)}),(function(t,e,o){r++,n.opt.each(t,e,o)}),(function(t,e){n.report(e),n.registerHighlight(),n.opt.done(r,t)}))}else this.report([{text:"markRanges() accept an array of objects: ",obj:t,level:"error"}]),this.opt.done(0,0)}},{key:"unmark",value:function(t){var e=this;this.opt=t;var n=this.opt.highlight;if(n)n.size&&(this.registerHighlight(!0),n.forEach((function(t){var r=t.startContainer;3===r.nodeType&&(r=r.parentNode),e.excluded(r)||n.delete(t)})),this.registerHighlight()),this.opt.done();else{var r=this.opt.element+"[data-markjs]";this.opt.className&&(r+=".".concat(this.opt.className)),this.log('Removal selector "'.concat(r,'"')),this.iterator.forEachNode(this.filter.SHOW_ELEMENT,(function(t){e.unwrapMatches(t)}),(function(t){return i.matches(t,r)&&!e.excluded(t)}),this.opt.done)}}},{key:"registerHighlight",value:function(t){var e=this,n=this.opt.highlight;if(n){var r=this.opt.highlightName||"markjs",o=CSS.highlights;if(t)return void o.delete(r);this.rangeArray.length&&(o.delete(r),n.size&&(n.forEach((function(t){e.rangeArray.push(t)})),n.clear()),this.rangeArray.sort((function(t,e){return t.absoluteOffset-e.absoluteOffset})),this.rangeArray.forEach((function(t){n.add(t)}))),n.size&&o.set(r,n)}}}]),n}();return function(t){var e=this,n=new s(t);return this.mark=function(t,r){return n.mark(t,r),e},this.markRegExp=function(t,r){return n.markRegExp(t,r),e},this.markRanges=function(t,r){return n.markRanges(t,r),e},this.unmark=function(t){return n.unmark(t),e},this.getVersion=function(){return"3.0.0"},this}}));


(function($) {
	const debug = false,
		preserveTerms = true,
		showSearchScore = false,
		scrollIntoViewOnSettingChange = false,
		autoCopySelection = false;
	let searchStartsWith = true;
	
	$(document).ready(function() {
		
		const locationSearch = location.search,
			hasHash = location.hash.length > 2,
			srcCode = /^.+\/(?:mark|domiterator|regexpcreator).html$/.test(location.pathname),
			name = location.pathname.replace(/^.+\/([^/]+)\.html?/i, '$1'),
			addPageHeaders = true,
			isApiPage = /-method$/.test(name),
			isSearchFile = name === '$search';

		let selected = false,
			allow = false,
			shiftKey = false,
			sidebarToc = $(),
			currentItem = $(),
			pageHeaders = [],
			//marginLeft = 280,
			headersMenu,
			id;

		let t0 = performance.now();

		renderSidebar();

		if (addPageHeaders) {
			if (srcCode) buildMethodsMenu();
			else buildHeadersMenu();
		}

		renderSearchBar();
		registerEvents();
		handleWidth();
		
		new simpleTooltip({
			prefer: ['top', 'right', 'left'],
			getContent: (elem) => {
				let content;
				const href = elem.getAttribute('href'),
					tipId = href.split('#')[1];
				
				if (typeof tooltipsDict !== 'undefined' && (content = tooltipsDict[tipId])) {
					return content;
					
				} else {
					content = document.getElementById(tipId);
					if (content) {
						return content.outerHTML;
					}
				}
				return null;
			}
		});

		if (hasHash) {
			let hash = decodeURIComponent(location.hash.substring(1)),
				elem = $('#' + hash).first();

			if (elem.length) {
				if (elem.is('h1,h2,h3,h4,tr,span')) {
					elem.addClass('hd-current');
					id = elem.attr('id');
				}
				scrollTo(elem, 100, highlightMenuItem());
			}
		}

		function highlightMenuItem() {
			if (id && headersMenu && headersMenu.length) {
				findCurrentItem(id);
			}
		}

		console.log(performance.now() - t0);

		function findCurrentItem(id) {
			let change = false;
			headersMenu.each((i, elem) => {
				if ($(elem).data('id') == id) {
					if ($(elem).hasClass('span-current')) return false;

					headersMenu.removeClass('span-current');
					$(elem).addClass('span-current');
					change = true;
					return false;
				}
			});
			return change;
		}

		function renderSidebar() {
			sidebarToc = $('nav.sidebar .toc');
			sidebarToc.html(toc);
			currentItem = $('nav.sidebar .toc a[href="' + name + '.html"]').addClass('current');

			columnHeight();

			if (currentItem.length) {
				let parents = currentItem.parents('ul');
				if (parents.length) {
					parents.show();

					let parentsLi = currentItem.parents('li');
					parentsLi.children('div.collapsed, div.close').each((i, elem) => {
						if ($(elem).hasClass('collapsed')) $(elem).removeClass('collapsed').addClass('expanded');
					});
				}
				let li = currentItem.parent();
				li.children('ul').show();
			}
		}

		function renderSearchBar() {
			const maxSearchLength = 256,
				searchButton = $('form.search-bar .advanced-search'),
				wholeWordButton = $('form.search-bar .whole-word'),
				highlightAllButton = $('form.search-bar .highlight-all');
			let searchPage = false,
				hasSearch = false,
				highlightAll = false,
				searchWholeWord = false,
				shiftKey = false,
				query = '',
				currentTerm,
				marks, startElements, searchSetting;

			if (window.location.search.length > 3) {
				let params = getQueryParameters();
				if (params.q && !/^\d+$/.test(params.q)) {
					query = normalize(params.q);
				}
				hasSearch = query.length > 0;

				if (params.s) {
					searchSetting = params.s;
					if (searchSetting && Number(parseInt(searchSetting)) == searchSetting) {
						searchSetting = (searchSetting | 0);
					}
				}
			}

			setSearchSettings();
			setSearchBar(hasSearch, searchPage);
			registerEvents();

			if (hasSearch) {
				highlightSearchWords(query, !isSearchFile);
				if ( !isSearchFile) $("input#q").val(query);
			}

			function highlightSearchWords(query, scroll) {
				const instance = new Mark(document.querySelectorAll(isSearchFile ? 'div.results' : 'article')),
					limiters = ",.;:?!'\"()[]{}",
					exactly = { value : "exactly", limiters },
					startsWith = { value : "startsWith", limiters };

				const options = {
					diacritics : false,
					separateWordSearch : preserveTerms ? 'preserveTerms' : true,
					accuracy : searchWholeWord ? exactly : startsWith,
					acrossElements : true,
					blockElementsBoundary : isSearchFile,
					combinePatterns : Infinity,

					filter : (elem, curTerm) => {
						currentTerm = curTerm;
						return true;
					},
					each : (elem, info) => {
						if (info.matchStart) {
							elem.className = 'start-1';
						}
						elem.classList.add(/ /.test(currentTerm) ? 'term' : 'word');
					},

					debug : true,
					done : finish,
					noMatch : (term) => { if (debug) console.log(term + '  X'); },
				};

				let run = 0;

				instance.unmark({
					done : () => {
						run = 1;
						instance.mark(query, options);
					}
				});

				function finish(totalMark, totalMatch) {
					if (totalMark === 0 && run === 1) {
						run++;
						options.separateWordSearch = true;
						options.accuracy = searchWholeWord ? exactly : searchStartsWith ? startsWith : 'partially';
						instance.mark(query.replace(/"/g, ''), options);
					}

					if (totalMatch > 0) {
						marks = $('mark');

						if (highlightAll) marks.addClass('show');

						displayFirst(query, scroll);
					}
					searchButton.text(totalMatch);
				}
			}

			function displayFirst(query, scroll) {
				let elem;

				// it not so easy find first preserve term with acrossElements option
				if (preserveTerms) {
					let splits = splitsQuery(query);

					for (let i = 0; i < splits.length; i++) {
						if (/ /.test(splits[i])) {
							let reg = getSearchRegex(splits[i], true),
								str = '', add = false, prevElem;

							marks.each((i, el) => {
								if ($(el).hasClass('start-1')) {
									if (reg.test(str)) {
										elem = prevElem ? $(prevElem) : $(el);
										return false;
									}
									str = el.textContent.toLowerCase();
									prevElem = el;
									add = true;

								} else if (add) str += el.textContent.toLowerCase();
								else add = false;
							});
						}
						if (elem) break;
					}
				}

				if ( !elem) {
					elem = $('mark.start-1').first();
				}

				if (elem.length) {
					highlightCurrentMatch(elem, true);

					if ( !hasHash && scroll) scrollTo(elem, 100);
					setTimeout(function() { findCurrentIndex(true); }, 120);
				}
			}

			function registerEvents() {

				$('body').on('keypress', function(e) {
					if (shiftKey && e.keyCode === 70) {    //F
						e.preventDefault();

						setInputBoxSearchOptions();
						setSearchBar(true, true);
						searchCurrentPage();
						shiftKey = false;
					}
				}).on('keydown', function(e) {
					if (e.shiftKey) shiftKey = true;
				}).on('keyup', function(e) {
					shiftKey = false;
				});

				searchButton.on('click', function() {
					searchPage = settings.toggleAdvancedSearch(isSearchFile);
					$(this).toggleClass('on', searchPage);

					if (searchPage) {
						if (isSearchFile) {
							setSearchBar(true, true);
							highlightWords(true);

						} else {
							setLocalSettings(true, true);
							highlightWords(false);
						}

					} else if (hasSearch) {
						if (isSearchFile) location.reload();
						else {
							setLocalSettings(false, false);
							highlightWords(false);
						}

					} else {
						setSearchBar(searchPage, false);
					}
				});

				highlightAllButton.on('click', function() {
					highlightAll = settings.toggleHighlightAll(isSearchFile);
					$(this).toggleClass('on', highlightAll);

					highlightWords(isSearchFile);
				});

				wholeWordButton.on('click', function() {
					searchWholeWord = settings.toggleWholeWord(isSearchFile);
					$(this).toggleClass('on', searchWholeWord);

					highlightWords(isSearchFile);
				});
			}

			function highlightWords(reload) {
				if (reload) location.reload();
				else if (hasSearch) {
					highlightSearchWords(query, scrollIntoViewOnSettingChange);
				}
			}

			function setInputBoxSearchOptions() {
				settings.getSearchSetting(isSearchFile, true);
				settings.localSearch = settings.setLocalFlag(settings.localSearchFlag, true);

				searchPage = true;
				searchButton.toggleClass('on', searchPage);

				highlightAll = settings.localHighlightAll;
				highlightAllButton.toggleClass('on', highlightAll);
			}

			function setLocalSettings(on, highlightAll) {
				if (searchSetting) {
					// shift left number to apply search file settings to the current page settings
					settings.localSettingValue = searchSetting << 1;

					let all = highlightAll && (searchSetting & settings.highlightAllFlag) !== 0;
					settings.localHighlightAll = settings.setLocalFlag(settings.localHighlightAllFlag, all);
				}
				settings.localSearch = settings.setLocalFlag(settings.localSearchFlag, on);
				setOptions();
				setSearchBar(true, on);
			}

			function setSearchSettings() {
				if (searchSetting) {
					// shift left number to apply search file settings to the current page settings
					settings.localSettingValue = searchSetting << 1;

					if ((searchSetting & settings.advancedSearchFlag) === 0 && (searchSetting & settings.highlightAllFlag) !== 0) {
						settings.localHighlightAll = settings.setLocalFlag(settings.localHighlightAllFlag, false);
					}
				}
				setOptions();
			}

			function setOptions() {
				settings.getSearchSetting(isSearchFile, true);

				searchPage = isSearchFile ? settings.advancedSearch : settings.localSearch;
				searchButton.toggleClass('on', searchPage);

				highlightAll = isSearchFile ? settings.highlightAll : settings.localHighlightAll;
				highlightAllButton.toggleClass('on', highlightAll);

				searchWholeWord = isSearchFile ? settings.wholeWord : settings.localWholeWord;
				wholeWordButton.toggleClass('on', searchWholeWord);
			}

			function setSearchBar(show, expand) {
				$('form.search-bar').css('display', show ? 'block' : 'none');

				if (show && expand) {
					$('form.search-bar').addClass('on');
					searchButton.attr('title', 'Disable highlighting');

				} else {
					$('form.search-bar').removeClass('on');
					searchButton.text('');
					searchButton.attr('title', 'Highlight');
				}

				$('form.search-bar .control-block').css('display', expand ? 'block' : 'none');
			}

			function findCurrentIndex(refresh) {
				const top = $(window).scrollTop() + 120;
				let length, index = -1;

				if (refresh || !startElements) filterElements();

				length = startElements.length;
				if (length) {
					if (startElements.first().offset().top > (top + 1)) {
						index = 0;

					} else if (startElements.last().offset().top < top - 120) {
						index = length;

					} else {
						startElements.each((i, elem) => {
							if ($(elem).offset().top > top) {
								index = i;
								return false;
							}
						});
						if (index === -1) index = length;
					}
				}
			}

			function filterElements() {
				marks = $('mark');
				startElements = marks.filter((i, elem) => $(elem).hasClass('start-1'));
			}

			function highlightCurrent(elem) {
				if ( !highlightAll) marks.removeClass('show');
				marks.removeClass('current');

				highlightCurrentMatch(elem, false);
			}

			function highlightCurrentMatch(elem, show) {
				let add = false;
				marks.each((i, el) => {
					if ( !add) {
						if (el === elem[0]) add = true;

					} else if ($(el).hasClass('start-1')) return false;

					if (add) {
						if (show) $(el).addClass('show');
						else {
							if ( !highlightAll) $(el).addClass('show');

							$(el).addClass('current');
						}
					}
				});
			}
		}

		function registerEvents() {
 
			$(window).on('scroll', function() {
				if (allow && pageHeaders.length && headersMenu.length) {
					allow = false;
					const top = $(window).scrollTop(),
						height = $(window).height(),
						bottom = top + height - 100,
						half = top + height / 2,
						elems = pageHeaders.get(),
						len = elems.length;
					let change = false, pos, id;

					for (let i = 0; i < len; i++) {
						pos = elems[i].offsetTop;

						if (pos > top && pos < half || pos < top && i + 1 < len && ((pos = elems[i + 1].offsetTop) > half && pos < bottom)) {
							id = elems[i].id;
							if ( !id) continue;

							change = findCurrentItem(id);
							break;
						}
					}
					if ( !change && elems[0].offsetTop > bottom) headersMenu.removeClass('span-current');
					setTimeout(function() { allow = true; }, 50);
				}
			});

			$('.sidebar .toc li>span.generated').on('click', function() {
				handleWidth();

				allow = false;
				const id = $(this).attr('data-id');
				pageHeaders.removeClass('hd-current');

				pageHeaders.each(function() {
					if (id == $(this).attr('id')) {
						scrollTo($(this), 100);
						$(this).addClass('hd-current');
						return false;
					}
				});
				headersMenu.removeClass('span-current');
				$(this).addClass('span-current');
				setTimeout(function() { allow = true; }, 100);
			});

			$('.sidebar .toc li div').on('click', function() {
				expandCollapse($(this));
			});

			$('.sidebar .toc li span:not(.generated)').on('click', function() {
				expandCollapse($(this).prev('div'));

				let parLi = $(this).parents('li').eq(1);

				if ( !parLi.children('a').first().hasClass('current')) {
					let href = parLi.children('a').first().attr('href');
					if (href) {
						location.replace(href + '#' + id);
					}
				}
			});

			$(".sidebar .toc li a").on('click', function() {
				let attrHref = $(this).attr('href');

				currentItem.removeClass('current');
				currentItem = sidebarToc.find('a[href="' + attrHref + '"]').first();
				if (currentItem.length) currentItem.addClass('current');

				let prevAr = $(this).prev('div');
				if (prevAr.length) expandCollapse(prevAr);

				handleWidth();
			});

			$(".search-info .button").on('click', function() {
				$('.search-info .info').css('display', 'block');
				$('.search-results').empty();
			});

			$("form #q").one('click', function() {
				if ( !selected) {
					selected = true;
					$(this).select();
				}
			}).on('focusout', function() {
				selected = false;
			});

			$('header #menu').on('click', function() {
				toggleSidebar();
			});

			$('.up-btn').on('click', function() {
				$('html, body').animate({ scrollTop : 0 }, 50);
			});

			$('.down-btn').on('click', function() {
				let h = $(document).height();
				$('html, body').animate({ scrollTop : h }, 50);
			});

			$("span.copy-code").on('mouseup', function(e) {
				document.getSelection().selectAllChildren($(this).parent()[0]);
				document.execCommand('copy');
				document.getSelection().removeAllRanges();
			});

			$('#wrapper').on('mouseup', function(e) {
				let sel = copySelection();
				if (sel !== '' && e.ctrlKey) {
					$('form #q').val(sel);
				}
			});

			$(window).on('resize', function() {
				handleWidth();
				columnHeight();
			});
		}
		
		function buildMethodsMenu() {
			let parentLi = currentItem.parents('li:first');
			if ( !parentLi.length) return;

			let reg = /(?:\n[ ]*(?:(?:static|([gs]et))[ ]+)?(?!(?:if|for|while|switch)\b)(\w+)(?=[ ]*\(.*\)[ ]*\{[ ]*\n))|\n/gd,
				menu = '',
				method = '', id;

			new Mark($('pre')[0]).markRegExp(reg, {
				'element' : 'span',
				'className' : 'func',
				'acrossElements' : true,
				'separateGroups' : true,
				'filter' : (n, t, m, info) => {
					if (info.matchStart) {
						if (info.match[2]) {
							method = (info.match[1] ? info.match[1] + ' ' : '') + info.match[2];
							id = method.replace(/\W+/g, '-').toLowerCase();
							menu += '<li><span class="generated" data-id="' + id + '">' + method + '</span></li>';
						}
					}
					return true;
				},
				'each' : (markElement, info) => {
					if (info.matchStart) markElement.id = id;
				},
			});

			if (menu.length) {
				addMenu(menu, parentLi);
				pageHeaders = $('article').find('span[class=func][id]');
			}
		}

		function buildHeadersMenu() {
			let parentLi = currentItem.parents('li:first');
			if (parentLi.length) {
				let menu = '',
					num = -1;
				pageHeaders = $('article').find('h1[id], h2[id], h3[id], h4[id]');

				pageHeaders.each((i, elem) => {
					if (++num == 0) return true;

					let text = $(elem).text();
					if (text.length) {
						let id = $(elem).attr('id');

						if ( !id) {
							id = Math.random().toString().replace(/\./g, '');
							$(elem).attr('id', id);
						}
						//text = text.replace('<', '&lt;').replace('>', '&gt;');
						menu += '<li><span class="generated ' + $(elem)[0].tagName.toLowerCase().replace('h', 'hd') + '" data-id="' + id + '">' + text + '</span></li>';
						$(elem).attr('id', id);
					}
				});
				if (menu.length) {
					addMenu(menu, parentLi);
				}
			}
		}

		function addMenu(menu, parentLi) {
			$('.sidebar .toc ul.page-headers').remove();

			$('<ul class="page-headers">' + menu + '</ul>').insertAfter(parentLi.children('a').first());
			headersMenu = parentLi.find('span.generated');
			allow = true;
		}

		function highlightCodeLine(pre, line) {
			let elem;
			const instance = new Mark(pre);
			instance.unmark({
				'done' : () => {
					instance.markRanges([{ start : line, length : 1 }], {
						'markLines' : true,
						'each' : (markElement, range, info) => {
							if (info.matchStart) elem = markElement;
							markElement.className = 'mark-range';
						},
						'done' : () => {
							if (elem) scrollTo($(elem), 100);
						}
					});
				}
			});
		}

		function showBoth() {
			const width = $(window).width();
			return isApiPage && width > 1000 || !isApiPage && width > 800;
		}

		function handleWidth() {
			if (showBoth()) setBoth();
			else toggleSidebar();
		}

		function getMargin() {
			const width = $(window).width();
			let marginLeft = width < 1280 ? 310 : 380;
			return marginLeft;
		}

		function setBoth() {
			const marginLeft = getMargin();
			$('div.nav-wrap, main').css('display', 'block');
			$('div.nav-wrap, nav.sidebar').css('width', (marginLeft - 20) + 'px');
			$('main').css('margin-left', marginLeft + 'px').css('margin-top', '0px');
		}

		function toggleSidebar() {
			const on = $('div.nav-wrap').css('display') === 'none';
			const marginLeft = getMargin();
			
			$('div.nav-wrap').css('display', on ? 'block' : 'none');
			$('main').css('margin-left', on ? marginLeft + 'px' : '0px').css('margin-top', on ? '0px' : '50px');
			$('article').css('padding-left', on ? '10px' : '10px');
		}

		function scrollIntoView(elem, scroll) {
			if (isSearchFile && !scroll) return;
			scrollTo(elem, 100);
		}

		function expandCollapseSpan(arrow) {
			if (arrow.hasClass('open')) { arrow.removeClass('open').addClass('close'); }
			else if (arrow.hasClass('close')) { arrow.removeClass('close').addClass('open'); }
			arrow.parent().children('ul').toggle();
		}

		function expandCollapse(arrow) {
			let par = arrow.parent();
			par.find('ul').toggle();
			par.find('div').each((i, elem) => { toggleArrow($(elem)) });

		}

		function toggleArrow(arrow) {
			if (arrow.hasClass('expanded')) {
				if (arrow.hasClass('asm')) arrow.removeClass('expanded');
				else arrow.removeClass('expanded').addClass('collapsed');

			} else arrow.filter("collapsed").removeClass('collapsed').addClass('expanded');
		}
	});

	function scrollTo(elem, delay, done) {
		const pos = elem.offset().top - 120;
		$('html, body').animate({ scrollTop : pos }, delay, done);
	}

	function columnHeight() {
		const h = $(window).height();
		$('.buttons').css('top', h * 3 / 5);
		$('nav.sidebar .toc').css('height', h - 35);
	}

	function copySelection() {
		let sel = document.getSelection().toString();
		if ( !sel) return '';
		if (autoCopySelection) document.execCommand('copy');
		sel = normalize(sel);
		return sel.length < 128 ? sel : '';
	}

	function normalize(str) {
		const reg = new RegExp("['\\u2018\\u2019][st]\\b|" + (preserveTerms ? '[^"\\w]+' : '\\W+'), 'gi');
		return str.replace(reg, ' ').trim().toLowerCase();
	}

	function trim(query) {
		return query.replace(/^[\s\W]+|[\s\W]+$/g, '');
	}

	function escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	function splitsQuery(query) {
		const array = [],
			split = str => {
				str.split(/ +/).forEach(word => add(word));
			},
			add = term => {
				if (term && array.indexOf(term) === -1) {
					array.push(term);
				}
			};

		if (preserveTerms) {
			query.split(/"("*[^"]+"*)"/).forEach((term, i) => {
				if (i % 2 > 0) {
					add(term);

				} else {
					split(term);
				}
			});

		} else {
			split(query);
		}
		return array;
	}

	function splitsBySpace(query) {
		return query.split(/[" ]+/).filter(elem => elem.length > 0);
	}

	function unique(a) {
		const len = a.length,
			array = [];
		for (let i = 0; i < len; ++i) {
			if (array.indexOf(a[i]) === -1) array.push(a[i]);
		}
		return array;
	};

	function getQueryParameters() {
		const parameters = {},
			search = decodeURIComponent(window.location.search.substr(1)),
			splits = search.replace(/\+/g, ' ').split(/[&;]/);

		splits.forEach((item) => {
			const p = item.split(/=/, 2);
			parameters[p[0]] = p[1];
		});
		return parameters;
	}

	function getPageContent(i) {
		return Info ? Info[i][0] : null;
	}

	function getPages(terms, isPhrase, termsInfo) {
		let score = {},
			termsScore = 1,
			flag = 1,
			count,
			searchType,
			term;

		for (let i = 0; i < terms.length; i++) {
			term = terms[i];
			count = 0;
			searchType = '';

			if (SearchIndex[term]) {
				const num = initScore(SearchIndex[term]);
				if (settings.wholeWord) {
					count += num;
					searchType = 'Whole word';
				}
			}

			if ( !settings.wholeWord && term.length > 1) {
				for (let si in SearchIndex) {
					if (searchStartsWith) {
						if (si.startsWith(term)) {    // start with
							count += initScore(SearchIndex[si]);
							searchType = 'Starts with';
						}

					} else {
						if (si.indexOf(term) !== -1) {    // contains
							count += initScore(SearchIndex[si]);
							searchType = 'Contains';
						}
					}
				}
			}

			termsInfo[term] = { score : count, searchType };

			termsScore |= flag;
			flag <<= 1;
		}

		function initScore(indices) {
			const length = indices.length;

			for (let j = 0; j < length; j++) {
				const index = indices[j],
					page = score[index],
					count = indices[++j];

				if ( !page) {
					score[index] = { termsScore : flag, count : count };

				} else {
					page.termsScore |= flag;
					page.count += count + 1;
				}
			}
			return length;
		}

		if (isPhrase) termsScore >>= 1;

		const result = {};
		for (let page in score) {
			if (score[page].termsScore >= termsScore) result[page] = score[page];
		}

		return result;
	}

	function getSearchResults(query) {
		const wholeWord = settings.wholeWord,
			termsInfo = {},
			results = [],
			splits = splitsQuery(query);

		splits.forEach(part => {
			const terms = unique(splitsBySpace(part)),
				isPhrase = / /.test(part),
				pages = getPages(terms, isPhrase, termsInfo),
				wordsReg = getSearchRegex(part, false);
			let wordRegs, phraseReg, phraseFound, num, count, lastIndex;

			if (isPhrase) {
				phraseReg = getSearchRegex(part, true);
				wordRegs = getWordRegexes(part);

			} else {
				wordRegs = [wordsReg];
			}

			for (let index in Headers) {
				const array = Headers[index];
				if ( !array) continue;

				for (let i = 0; i < array.length; i++) {
					let rm, header = array[i][0], type = array[i][1];

					num = 0;
					phraseFound = false;

					if (isPhrase) {
						phraseReg.lastIndex = 0;

						if ((rm = phraseReg.exec(header)) !== null) {
							let pow = Math.pow(type, type);

							if (rm.index === 0) {
								if (rm[0].length === header.length) num += pow * 1000;
								else num += pow * 500;

							} else num += pow * 250;

							phraseFound = true;
						}
					}

					if (isPhrase && !phraseFound) continue;

					if ( !phraseFound) {
						wordsReg.lastIndex = 0;

						if ((rm = wordsReg.exec(header)) !== null) {
							let reg, multiplier = 1, pow = Math.pow(type, type);

							if (rm.index === 0) {
								if (rm[0].length === header.length) num += pow * 200;
								else num += pow * 50;

							} else num += pow * 30;

							for (let k = wordRegs.length - 1; k >= 0; k--) {
								reg = wordRegs[k];
								reg.lastIndex = 0;

								if (reg.test(header)) {
									num += 10 * pow * multiplier;
									multiplier *= 5;
								}
							}
						}
					}

					if (num > 0) {
						results.push({
							index : index,
							url : Pages[index][0],
							title : Pages[index][1],
							lastIndex : -1,
							score : num,
							isPhrase : phraseFound,
							header : [{ text : header, level : 6 - type, id : array[i][2] }]
						});
					}
				}
			}

			for (let index in pages) {
				const content = getPageContent(index);

				num = pages[index].count;
				phraseFound = false;
				lastIndex = -1;

				if (content != null) {
					if (isPhrase) {
						phraseReg.lastIndex = 0;

						if (phraseReg.test(content)) {
							if (phraseReg.lastIndex <= content.length) lastIndex = phraseReg.lastIndex;
							count = countMatches(content, phraseReg);
							num += 5000 * count;
							phraseFound = true;
						}
					}

					if (isPhrase && !phraseFound) continue;

					wordsReg.lastIndex = 0;
					if (lastIndex === -1 && wordsReg.test(content)) {
						if (wordsReg.lastIndex <= content.length) lastIndex = wordsReg.lastIndex;
					}
				}

				results.push({
					index : index,
					url : Pages[index][0],
					title : Pages[index][1],
					lastIndex : lastIndex,
					score : num,
					isPhrase : phraseFound,
				});
			}

			if (debug) {
				console.log(' Search regs: phrase - ' + getSearchRegex(part, true) + '   words - ' + getSearchRegex(part, false) + '   wordsReg - ' + wordRegs);
			}
		});

		function countMatches(text, reg) {
			const array = text.match(reg);
			return array === null ? 0 : array.length;
		}

		function getWordRegexes(query) {
			//const words = unique(splitsBySpace(query).filter(wd => Common[wd] !== 1)),
			const words = unique(splitsBySpace(query)),
				array = [];

			for (let i = 0; i < words.length; i++) {
				array.push(new RegExp((wholeWord || searchStartsWith ? '\\b' : '') + words[i] + (wholeWord ? '\\b' : ''), 'gi'));
			}
			return array;
		}

		return { results, termsInfo };
	}

	function getSearchRegex(query, phrase) {
		const wholeWord = settings.wholeWord,
			words = splitsBySpace(query);
		let regString;

		if (words.length === 1) regString = (wholeWord || searchStartsWith ? '\\b' : '') + words[0] + (wholeWord ? '\\b' : '');
		else {
			const start = wholeWord || searchStartsWith ? '\\b(?:' : '(?:',
				end = wholeWord ? ')\\b' : ')',
				ending = (wholeWord ? '' : '(?:\\w+)?');

			if (phrase) regString = start + words.join(ending + '[^\\u220E\\w]+') + ending + end;
			else regString = start + unique(words.filter(wd => Common[wd] !== 1)).join('|') + end;
		}
		return new RegExp(regString, 'gi');
	}

	function performSearch() {
		let t0 = performance.now();

		const p = getQueryParameters(),
			search = document.getElementById('q');

		if (search && p.q) search.value = p.q;
		else return;

		settings.getSearchSetting(true);
		searchStartsWith = !settings.wholeWord;

		let searchSettings = settings.getSettingValue();
		searchSettings = searchSettings ? '&amp;s=' + searchSettings : '';

		let query = p.q.trim().toLowerCase();
		let { results, termsInfo } = getSearchResults(normalize(query));

		results = distinct(results);
		results = sortResults(results);
		results = results.sort((a, b) => b.isPhrase > a.isPhrase ? 1 : b.isPhrase < a.isPhrase ? -1 : 0);

		function distinct(a) {
			const len = a.length, array = [];

			for (let i = 0; i < len; ++i) {
				let item = a[i], add = true;

				for (let j = 0; j < array.length; ++j) {
					if (array[j].url === item.url) {
						array[j].score += item.score;    // sum scores

						if (item.isPhrase) {
							array[j].isPhrase = true;
							array[j].lastIndex = item.lastIndex;

						} else if (array[j].lastIndex === -1) {
							array[j].lastIndex = item.lastIndex;
						}

						if (item.header) {
							if ( !array[j].header) array[j].header = [];

							array[j].header.push(item.header[0]);
						}
						add = false;
						break;
					}
				}
				if (add) array.push(item);
			}
			return array;
		}

		function getEntity(n) {
			let entity = '';
			switch (n) {
				case 0 : entity = '&#x2780;'; break;
				case 1 : entity = '&#x2781;'; break;
				case 2 : entity = '&#x2782;'; break;
				case 3 : entity = '&#x2783;'; break;
				case 4 : entity = '&#x2784;'; break;
				case 5 : entity = '&#x2785;'; break;
				default : break;
			}
			return entity ? '<b>' + entity + ' </b>' : '';
		}

		function sortResults(results) {
			const array = results.sort((a, b) => {
				if (b.score === a.score) {    // sort alphabetically by title if score is the same
					const x = a.title.toLowerCase(),
						y = b.title.toLowerCase();
					return (x < y) ? -1 : ((x > y) ? 1 : 0);

				} else {    // else by score descending
					return b.score - a.score;
				}
			});
			return array;
		}

		function addContent(info) {
			const content = getPageContent(info.index);
			if (content === null) return null;

			let start = info.lastIndex - 80,
				end = info.lastIndex + 50,
				len = content.length;

			if (start < 0) {
				start = 0;
				end = 130;

			} else {
				start = findWordBreak(start - 1, len, content);
			}

			end = findWordBreak(end - 1, len, content);
			if (end >= len) end = len - 1;

			function findWordBreak(i, len, content) {
				while (++i < len && /\w/.test(content[i]));
				return i;
			}
			return (start > 0 ? '...' : '') + content.substring(start, end).replace(/\u220E/g, ' ') + (len - end > 3 ? ' ...' : '');
		}

		if (results.length > 0) {
			if (debug) console.log('termsInfo =', termsInfo);

			query = encodeURI(query);
			const array = [], num = results.length;
			let info;

			array.push('<h4>Your search for <b class="query">', p.q, '</b> resulted in ', num, ' match' + (num === 1 ? "" : "es") + ':</h4><div class="results">');

			for (let i in results) {
				info = results[i];
				array.push('<div class="result"><a href="', info.url, '.html?q=', query, searchSettings, '" class="title">', info.title, '</a>');

				if (showSearchScore) array.push(' <span>', info.score, '</span>');

				if (info.score > 500000) array.push(' <span class="found-title">&#x2600;</span>');
				else if (info.score > 50000) array.push(' <span class="found-' + (info.isPhrase ? 'phrase' : 'word') + '">&#x2600;</span>');
				else if (info.score > 10000) array.push(' <span class="found-word">&#x2600;</span>');

				if (info.header && (info.header.length > 1 || info.header[0].text !== info.title)) {
					for (let k = 0; k < info.header.length; k++) {
						const header = info.header[k];
						if (header.text === info.title) continue;
						array.push('<br>', getEntity(header.level), '<a class="header" href="', info.url, '.html?q=', query, searchSettings, '#', header.id, '">', header.text, '</a>');
					}
					if (info.isPhrase && info.lastIndex !== -1) array.push('<p>', addContent(info), '</p>');

				} else {
					const content = addContent(info);
					if (content != null) array.push('<p>', content, '</p>');
				}
				array.push('<hr class="dvd"></div>');
			}
			array.push('</div>');
			$('.search-results').html(array.join(''));

		} else {
			const whole = settings.wholeWord,
				warning = whole ? 'with the option <b class="warning">Whole word</b> ' : '';
			let info = '', matches = '', zeroMatch = false, count = 0;

			if (Object.keys(termsInfo).length) {
				info += '<h4>Query statistics:</h4><ol class="stats">';

				for (const term in termsInfo) {
					const { score, searchType } = termsInfo[term];
					if (score === 0) {
						info += '<li><b>' + term + ' = ' + score + '</b></li>';
						zeroMatch = true;

					} else {
						info += '<li><a href="$search.html?q=' + term + '">' + term + '</a> = ' + score + ' - ' + searchType + '</li>';
						matches += term + ' ';
						count++;
					}
				}
				info += '</ol>';
				if (zeroMatch && count > 1) info += '<a href="$search.html?q=' + matches + '">' + matches + '</a>';
			}

			$('.search-results').html('<div>Your search for <b class="q">' + p.q + '</b> ' + warning + 'did not result in any matches.' + info + '</div>');
			$(".search-info").css('display', 'block');
		}

		console.log('search time = ' + (performance.now() - t0));
	}

	let settings = {
		storageName : 'Search-Bar-Options',
		maxNumber : 255,
		advancedSearchFlag : 1,
		localSearchFlag : 2,
		highlightAllFlag : 4,
		localHighlightAllFlag : 8,
		wholeWordFlag : 16,
		localWholeWordFlag : 32,

		advancedSearch : false,
		highlightAll : false,
		wholeWord : false,

		localSearch : false,
		localHighlightAll : true,
		localWholeWord : false,

		localSettingValue : 1,

		getSearchSetting : function(isSearchFile, local) {
			let value = !isSearchFile ? this.localSettingValue : this.getValue(this.storageName);
			if (isSearchFile) {
				if (local) {
					this.localSearch = (value & this.advancedSearchFlag) !== 0;
					this.localHighlightAll = (value & this.highlightAllFlag) !== 0;
					this.localWholeWord = (value & this.wholeWordFlag) !== 0;

				} else {
					this.advancedSearch = (value & this.advancedSearchFlag) !== 0;
					this.highlightAll = (value & this.highlightAllFlag) !== 0;
					this.wholeWord = (value & this.wholeWordFlag) !== 0;
				}

			} else {
				this.localSearch = (value & this.localSearchFlag) !== 0;
				this.localHighlightAll = (value & this.localHighlightAllFlag) !== 0;
				this.localWholeWord = (value & this.localWholeWordFlag) !== 0;
			}
		},

		toggleAdvancedSearch : function(isSearchFile) {
			return isSearchFile ? (this.advancedSearch = this.toggleFlag(this.advancedSearchFlag)) : (this.localSearch = this.toggleLocalFlag(this.localSearchFlag));
		},

		toggleHighlightAll : function(isSearchFile) {
			return isSearchFile ? (this.highlightAll = this.toggleFlag(this.highlightAllFlag)) : (this.localHighlightAll = this.toggleLocalFlag(this.localHighlightAllFlag));
		},

		toggleWholeWord : function(isSearchFile) {
			return isSearchFile ? (this.wholeWord = this.toggleFlag(this.wholeWordFlag)) : (this.localWholeWord = this.toggleLocalFlag(this.localWholeWordFlag));
		},

		setLocalFlag : function(flag, on) {
			this.localSettingValue = on ? ((this.localSettingValue ^ flag) | flag) : ((this.localSettingValue ^ flag) & (this.maxNumber ^ flag));
			return (this.localSettingValue & flag) !== 0;
		},

		toggleFlag : function(flag) {
			let value = this.getValue(this.storageName) ^ flag;
			this.saveValue(this.storageName, value);
			return (value & flag) !== 0;
		},

		toggleLocalFlag : function(flag) {
			this.localSettingValue = this.localSettingValue ^ flag;
			return (this.localSettingValue & flag) !== 0;
		},

		saveValue : function(name, val) {
			val = val & this.maxNumber;
			try {
				localStorage.setItem(name, val);
			} catch (e) {
				console.log(e);
			}
		},

		getValue : function(name) {
			try {
				let val = localStorage.getItem(name);
				return val ? val : this.localSearchFlag;
			} catch (e) { }

			try { this.saveValue(this.storageName, this.localSearchFlag); } catch (e) { }
			return this.localSearchFlag;
		},

		getSettingValue : function() {
			return this.getValue(this.storageName);
		}
	};
	
	$.fn.performSearch = function() {
		new performSearch();
	};

})(jQuery);

























var tooltipsDict = {"mark-wildcards":"<div><td><code>wildcards</code></td><td><em class=\"type\">string</em></td><td> <code>'disabled'</code></td><td>Two characters <code>?</code> and <code>*</code> used as wildcards unless they are escaped \n<ul>\n<li><code>'disabled'</code>: The characters <code>?</code> and <code>*</code> match itself</li>\n<li><code>'enabled'</code>:\n<ul>\n<li>The character <code>?</code> match any non-white-space character zero or one time.</li>\n<li>The character <code>*</code> match any non-white-space character zero or more times.</li>\n</ul>\n</li>\n<li><code>'withSpaces'</code>:\n<ul>\n<li>The character <code>?</code> match any character zero or one time.</li>\n<li>The character <code>*</code> match any character zero or more times, but as few times as possible.</li>\n</ul>\n</li>\n</ul>\n</td></div>","mark-filter":"<div><td><code>filter</code></td><td><em class=\"type\">function</em></td><td> </td><td>A callback to filter matches. It calls for each match (<a href='#FAE'>FAE</a>) \n<br><b>filter: (nodeOrArray, term, matchesSoFar, termMatchesSoFar, info) => {}</b>\n<ul>\n<li><code>nodeOrArray</code> <em class=\"type\">Text <span class=\"or\">or</span> Text[]</em> - The text node which includes the match (<a href='#TAE'>TAE</a>)<br>\nOR an array of text node(s) which include the match if the <code>Highlight</code> API is used with <code>acrossElements</code> and <code>rangeAcrossElements</code> options</li>\n<li><code>term</code> <em class=\"type\">string</em> - The current term</li>\n<li><code>matchesSoFar</code> <em class=\"type\">number</em> - The number of all matches so far</li>\n<li><code>termMatchesSoFar</code> <em class=\"type\">number</em> - The number of matches for the current term so far</li>\n<li><code>info</code> <em class=\"type\">object</em>:\n<ul>\n<li><code>match</code> <em class=\"type\">array</em> - The result of RegExp exec() method</li>\n<li><code>count</code> <em class=\"type\">number</em> - The number of matches so far <a href='#MC'>MC</a></li>\n<li><code>matchStart</code> <em class=\"type\">boolean</em> - indicate the start of a match  <a href='#AE'>AE</a></li>\n<li><code>abort</code> <em class=\"type\">boolean</em> - Setting it to <code>true</code> breaks the method execution</li>\n</ul>\n</li>\n</ul>\n<p>The function <b>must</b> return either <code>true</code> (highlight) or <code>false</code> (skip highlighting).<br>\nSee <a href=\"filtering-matches.html\">Filtering matches</a> for more details.</p>\n</td></div>","mark-each":"<div><td><code>each</code></td><td><em class=\"type\">function</em></td><td> </td><td>A callback for each created element OR <code>StaticRange/Range</code> object (<code>Highlight</code> API) \n<br><b>each: (elementOrRange, info) => {}</b>\n<ul>\n<li><code>elementOrRange</code> <em class=\"type\">HTMLElement <span class=\"or\">or</span> StaticRange <span class=\"or\">or</span> Range</em> - The marked DOM element OR <code>StaticRange/Range</code> object (<code>Highlight</code> API)</li>\n<li><code>info</code> <em class=\"type\">object</em>:\n<ul>\n<li><code>match</code> <em class=\"type\">array</em> - The result of RegExp exec() method</li>\n<li><code>count</code> <em class=\"type\">number</em> - The number of matches so far <a href='#MC'>MC</a></li>\n<li><code>matchStart</code> <em class=\"type\">boolean</em> - Indicate the start of a match  <a href='#AE'>AE</a></li>\n<li><code>abort</code> <em class=\"type\">boolean</em> - Setting it to <code>true</code> breaks the method execution.</li>\n</ul>\n</li>\n</ul>\n<p>See <a href=\"some-examples.html\">Code examples</a>.</p>\n<div class='note'><b>Note:</b> the <code>filter</code> and <code>each</code> callbacks are shared the <code>info</code> object with updated properties.\n</div></td></div>","markRegExp-filter":"<div><td><code>filter</code></td><td><em class=\"type\">function</em></td><td> </td><td>A callback to filter matches. It calls for each match (<a href='#FAE'>FAE</a>) \n<br><b>filter: (nodeOrArray, matchString, matchesSoFar, info) => {}</b>\n<ul>\n<li><code>nodeOrArray</code> <em class=\"type\">Text <span class=\"or\">or</span> Text[]</em> - The text node which includes the match (<a href='#TAE'>TAE</a>)<br>\nOR an array of text node(s) which include the match if the <code>Highlight</code> API is used with <code>acrossElements</code> and <code>rangeAcrossElements</code> options</li>\n<li><code>matchString</code> <em class=\"type\">string</em> - The matching string:\n<br></li>\n</ul>\n<ol>\n<li>without <code>ignoreGroups</code> and <code>separateGroups</code> options - the whole match</li>\n</ol>\n  <br>\n2. with <code>ignoreGroups</code> option - the match[ignoreGroups+1] group matching string,  \n<p>e.g. <code>/(-)(\\w+)\\s+/g</code>, <code>ignoreGroups: 1</code>, the matching string is content of the group 2\n<br>\n3. with <code>separateGroups</code> option - the current group matching string</p>\n<ul>\n<li><code>matchesSoFar</code> <em class=\"type\">number</em> - The number of all matches so far</li>\n<li><code>info</code> <em class=\"type\">object</em>:\n<ul>\n<li><code>match</code> <em class=\"type\">array</em> - The result of RegExp exec() method</li>\n<li><code>count</code> <em class=\"type\">number</em> - The number of matches so far <a href='#MC'>MC</a></li>\n<li><code>matchStart</code> <em class=\"type\">boolean</em> - indicate the start of a match  <a href='#AE'>AE</a></li>\n<li><code>groupIndex</code> <em class=\"type\">number</em> - The current group index  <a href='#SG'>SG</a></li>\n<li><code>abort</code> <em class=\"type\">boolean</em> - Setting it to <code>true</code> breaks the method execution</li>\n</ul>\n</li>\n</ul>\n<p>The function <b>must</b> return either <code>true</code> (highlight) or <code>false</code> (skip highlighting).</p>\n</td></div>","markRegExp-each":"<div><td><code>each</code></td><td><em class=\"type\">function</em></td><td> </td><td>A callback for each created element OR <code>StaticRange/Range</code> object (<code>Highlight</code> API) \n<br><b>each: (elementOrRange, info) => {}</b>\n<ul>\n<li><code>elementOrRange</code> <em class=\"type\">HTMLElement <span class=\"or\">or</span> StaticRange <span class=\"or\">or</span> Range</em> - The marked DOM element OR <code>StaticRange/Range</code> object (<code>Highlight</code> API)</li>\n<li><code>info</code> <em class=\"type\">object</em>:\n<ul>\n<li><code>match</code> <em class=\"type\">array</em> - The result of RegExp exec() method</li>\n<li><code>count</code> <em class=\"type\">number</em> - The number of matches so far <a href='#MC'>MC</a></li>\n<li><code>matchStart</code> <em class=\"type\">boolean</em> - Indicate the start of a match  <a href='#AE'>AE</a></li>\n<li><code>groupIndex</code> <em class=\"type\">number</em> - The current index of match group  <a href='#SG'>SG</a></li>\n<li><code>groupStart</code> <em class=\"type\">boolean</em> - Indicate the start of group  <a href='#AE SG'>AE SG</a></li>\n<li><code>abort</code> <em class=\"type\">boolean</em> - Setting it to <code>true</code> breaks the method execution</li>\n</ul>\n</li>\n</ul>\n<div class='note'><b>Note:</b> the <code>filter</code> and <code>each</code> callbacks are shared the <code>info</code> object with updated properties.\n</div></td></div>","simple-example-with-nextprevious-buttons-and-wrapallranges-true":"<div><h4 id=\"simple-example-with-nextprevious-buttons-and-wrapallranges-true\">Simple example with next/previous buttons and <code>wrapAllRanges: true</code></h4><p>It uses numbers as unique match identifiers in continuous ascending order.\nThe code example <a href=\"some-examples.html#simple-example-with-nextprevious-buttons\">with next/previous buttons</a> which uses 'start elements' doesn't work correctly with nesting/overlapping matches.</p><pre><code class=\"language-js\"><span class=\"copy-code\"></span><span class=\"kwd\">let</span> currentIndex = 0,\n    matchCount,\n    marks,\n    <span class=\"com\">// highlight 3 words in sentences in any order, e.g. 'word word2 word word3 word word1.'</span>\n    regex = <span class=\"jreg\">/(?=[^.]*?(word1))(?=[^.]*?(word2))(?=[^.]*?(word3))/dgi</span>;\n    \ninstance.markRegExp(regex, {\n    <span class=\"str\">'acrossElements'</span>: <span class=\"kwd\">true</span>,\n    <span class=\"str\">'separateGroups'</span>: <span class=\"kwd\">true</span>,\n    <span class=\"str\">'wrapAllRanges'</span>: <span class=\"kwd\">true</span>,\n    <span class=\"str\">'each'</span>: (markElement, info) =&gt; {\n        <span class=\"com\">// info.count as a match identifier</span>\n        markElement.setAttribute(<span class=\"str\">'data-markjs'</span>, info.count);\n    },\n    <span class=\"str\">'done'</span>: (totalMarks, totalMatches) =&gt; {\n        marks = $(<span class=\"str\">'mark'</span>);\n        matchCount = totalMatches;\n    }\n});\n\nprevButton.click(<span class=\"kwd\">function</span>() {\n    <span class=\"kwd\">if</span> (--currentIndex &lt;= 0) currentIndex = 0;\n    highlightMatchGroups();\n});\n\nnextButton.click(<span class=\"kwd\">function</span>() {\n    <span class=\"kwd\">if</span> (++currentIndex &gt; matchCount) currentIndex = matchCount;\n    highlightMatchGroups();\n});\n\n<span class=\"kwd\">function</span> highlightMatchGroups() {\n    marks.removeClass(<span class=\"str\">'current'</span>);\n    <span class=\"kwd\">const</span> elems = marks.filter((i, elem) =&gt; $(elem).data(<span class=\"str\">'markjs'</span>) === currentIndex).addClass(<span class=\"str\">'current'</span>);\n    elems.find(<span class=\"str\">'*[data-markjs]'</span>).addClass(<span class=\"str\">'current'</span>); <span class=\"com\">// add class to all descendant too</span>\n}</code></pre></div>","acrosselements-option":"<div><h3 id=\"acrosselements-option\"><code>acrossElements</code> option</h3><p>With this option, the library aggregates all context(s) text node contents into a single string taking into account HTML elements.<br>\nIf two text nodes are divided by a block element, and <code>node.textContent</code>s doesn't separated by white spaces, a space is added to the string to separate them,<br>\ne.g. '&lt;h1&gt;Header&lt;/h1&gt;&lt;p&gt;Paragraph&lt;/p&gt;' resulted in 'Header Paragraph' (in <em>mark.js</em> - 'HeaderParagraph').</p><p>Due to searching in single string, it can highlight matches across HTML block elements, which in most cases are undesirable.\nA <code>blockElementsBoundary</code> option can be used to limit matches within HTML elements. See <a href=\"elements-boundaries.html\">Elements boundaries</a> for more details.</p></div>","separatewordsearch-option":"<div><h3 id=\"separatewordsearch-option\"><code>separateWordSearch</code> option</h3><p>When it is set to <code>true</code>, if a searching string contains several words, it splits the string by spaces into separate words and highlights individual words instead of the whole string.\nIt also applies to every string in a search array.</p><p>When it is set to <code>'preserveTerms'</code>, it preserves the term(s) surrounded by double quotes from breaking into separate words.<br>\nThis allows highlighting exact term(s) alongside with individual words.<br>\nIt can be useful when the library is used to highlight searches or in the case of using a string instead of an array, and there is a need to keep some term(s) intact.</p><p>It also allows highlighting quoted terms no matter how many quotes it contains on each side (but not in the middle),\ne.g. <code>&quot;&quot;term&quot;&quot;</code> - marked <code>&quot;term&quot;</code>, <code>&quot;&quot;&quot;&quot;term&quot;</code> - <code>&quot;&quot;&quot;term</code>.</p></div>","exclude-option":"<div><h3 id=\"exclude-option\"><code>exclude</code> option</h3><p>In the case if the context contains element(s) matches in which shouldn't be highlighted, the <code>exclude</code> option can be pretty handy.</p><pre><code class=\"language-html\">&lt;section&gt;\n    &lt;p&gt;Lorem ipsum dolor&lt;/p&gt;\n    &lt;p&gt;Lorem ipsum dolor&lt;/p&gt;\n    &lt;p&gt;Lorem &lt;i&gt;ipsum &lt;b&gt;dolor&lt;/b&gt;&lt;/i&gt;&lt;/p&gt;\n&lt;/section&gt;\n</code></pre><pre><code class=\"language-js\"><span class=\"copy-code\"></span><span class=\"kwd\">new</span> Mark(<span class=\"str\">'section'</span>).mark([<span class=\"str\">'Lorem'</span>, <span class=\"str\">'dolor'</span>], {\n  <span class=\"com\">// Note: to exclude all descendants, you need to add 'p:last-child *' selector</span>\n  exclude: <span class=\"str\">'p:last-child, p:last-child *'</span>\n});</code></pre></div>","synonyms-option":"<div><h3 id=\"synonyms-option\"><code>synonyms</code> option</h3><p>This option can be useful for providing alternative for words in phrases.</p><div class='warning'><b>Warning:</b> this option is blindly replaces all occurrences of (<code>key</code> and <code>value</code> of <code>synonyms</code> object) strings/substrings which it found in the input string or array of strings.</div></div>","accuracy-option":"<div><h3 id=\"accuracy-option\"><code>accuracy</code> option</h3><p>The option values specify how library should perform searching:</p><ul>\n<li><p><code>partially</code> (contains) - searches for matches within a text node content (AE - within an aggregated context string). Can highlight practically anything.</p>\n</li>\n<li><p><code>exactly</code> - the default word boundaries are:</p>\n<ul>\n<li>start - the start of a text node (AE - start of a context) and the <em>built-in</em> boundaries.</li>\n<li>end - the end of a text node (AE - end of a context) and the <em>built-in</em> boundaries.</li>\n</ul>\n</li>\n<li><p><code>startsWith</code> - the default word boundaries are:</p>\n<ul>\n<li>start - the start of a text node (AE - start of a context) and the <em>built-in</em> boundaries.</li>\n<li>end - searching will continued til <em>built-in</em> word boundaries or to the end of a text node content (AE - to the end of a context).</li>\n</ul>\n</li>\n<li><p><code>complementary</code> - the default word boundaries are:</p>\n<ul>\n<li>start - will search for the start of <em>built-in</em> boundaries or to the start of a text node content (AE - to the start of a context).</li>\n<li>end - searching will continued til <em>built-in</em> word boundaries or to the end of a text node content (AE - to the end of a context).</li>\n</ul>\n</li>\n</ul><p>The <b>built-in</b> word boundary characters are: white spaces and <code>!&quot;#$%&amp;'`()*+,-./:;&lt;=&gt;?@[\\\\]^_{|}~¡¿</code>.</p><p>An accuracy object can be used if the default boundaries are not satisfactory:</p><ul>\n<li><code>value</code>: <code>'exactly'</code> or <code>'startsWith'</code> or <code>'complementary'</code></li>\n<li><code>limiters</code>: a string or an array of custom word boundary characters,<br>\ne.g. <code>{ value: 'exactly', limiters: &quot;,.;:?!'\\\\&quot;()&quot; }</code></li>\n</ul><p><b>AE</b> - with the option <code>acrossElements: true</code>.</p></div>","combineby-option":"<div><h3 id=\"combineby-option\"><code>combineBy</code> option</h3><p>Old name is <code>combinePatterns</code>. Related to <code>mark()</code> method.<br>\nThis option allows to control how many individual terms will be processed at run, e.g., an array of 50 strings, <code>combineBy: 10</code> - the library creates 5 combine patterns and perform 5 runs.<br>\nAny number bigger than the array length or <code>Infinity</code> creates a single combined pattern.<br>\nIf there is a need to highlight terms one by one, use <code>combineBy: 1</code>.</p><div class='note'><b>Note:</b> when highlighting a (especially) large array of strings with the <code>diacritics</code> option (<code>ignorePunctuation</code> and <code>ignoreJoiners</code> options also affect size), a single pattern can be monstrous and slower (it can also exceed the browser RegExp size limit); it's better to create several patterns.   \n   Also, a single pattern prevents highlighting inside already highlighted elements.</div><pre><code class=\"language-js\">instance.mark([ <span class=\"str\">'str1'</span>, <span class=\"str\">'str2'</span>, .. ], {\n  <span class=\"str\">'combineBy'</span>: number  <span class=\"com\">// default number is 10</span>\n});</code></pre></div>","iframes-option":"<div><h3 id=\"iframes-option\"><code>iframes</code> option</h3><p>To customize the style of mark elements in iframe, the option <code>iframes: { style: 'your mark element style' }</code> can be used.<br>\nTo customize the style of highlighting when using a <code>Highlight</code> API the pseudo-element <code>::highlight(custom-highlight-name) { your highlight style }</code> should be added to the <code>iframes</code> style property.<br>\nThe library creates a <code>style</code> element with the attribute 'data-markjs' and appends it to an iframe head element.</p><div class='note'><b>Note</b> that the style is added to an iframe no matter whether it contains any matches or not.  </div><br></div>","shadowdom-option":"<div><h3 id=\"shadowdom-option\"><code>shadowDOM</code> option</h3><p>The option <code>shadowDOM: true</code> allows to highlight a text inside shadow DOMs that have <code>mode: 'open'</code> option and are already created.<br>\nYou can play with Playground - Examples -&gt; Shadow DOM.</p><p>To customize the style of mark elements in shadow DOM, the option <code>shadowDOM: { style: 'your mark element style' }</code> can be used.<br>\nTo customize the style of highlighting when using a <code>Highlight</code> API the pseudo-element <code>::highlight(custom-highlight-name) { your highlight style }</code> should be added to the <code>shadowDOM</code> style property.<br>\nThe library creates a <code>style</code> element with the attribute 'data-markjs' and appends it at the end of shadow root child nodes.</p><div class='note'><b>Note</b> that the style is added to the shadow root no matter whether it contains any matches or not.</div><p>An <code>unmark()</code> method will remove the style from a shadow root if it call with option <code>shadowDOM: { style: 'any string' }</code>.</p><p>An inline style can be used as an alternative:</p><div class='warning'><b>Warning:</b> it's not workable when using a <code>Highlight</code> API.</div><pre><code class=\"language-js\"><span class=\"copy-code\"></span>each: (markElement, info) =&gt; {\n  <span class=\"com\">// a shadow root is the DocumentFragment</span>\n  <span class=\"kwd\">if</span> (markElement.getRootNode().nodeType === Node.DOCUMENT_FRAGMENT_NODE) {\n    markElement.style.color = <span class=\"str\">\"red\"</span>;\n  }\n}</code></pre></div>","highlight-option":"<div><h3 id=\"highlight-option\"><code>highlight</code> option</h3><p>This option allows using <a href=\"https://developer.mozilla.org/developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API.html\" class=\"external\">CSS Custom Highlight API</a>.</p><p>If a <code>Highlight</code> object is provided, the library creates <code>StaticRange/Range</code> objects of matches, adds them to the <code>Highlight</code> object, and registers it using the <code>HighlightRegistry</code> when it finishes.</p><div class='note'><b>Note</b> that the <code>each</code> callback's first parameter is the <code>StaticRange/Range</code> object instead of an HTML element.</div><p>If a browser does not support the Highlight API, the library wrap matches in HTML elements.</p><pre><code class=\"language-js\"><span class=\"copy-code\"></span><span class=\"kwd\">const</span> array = [,,,,];\n<span class=\"kwd\">let</span> highlight;\n\n<span class=\"com\">// checks whether the browser supports the Highlight API</span>\n<span class=\"kwd\">if</span> (<span class=\"kwd\">typeof</span> Highlight !== <span class=\"str\">'undefined'</span>) {\n\thighlight = <span class=\"kwd\">new</span> Highlight();\n}\n\n<span class=\"kwd\">new</span> Mark(ctx).mark(array, {\n    highlight: highlight,\n    highlightName: <span class=\"str\">'my-highlight'</span>\n});</code></pre><p>CSS</p><pre><code class=\"language-css\">::highlight(my-highlight) {\n  background-color: yellow;\n}\n</code></pre></div>","staticranges-option":"<div><h3 id=\"staticranges-option\"><code>staticRanges</code> option</h3><p>When using <code>Range</code> objects one serious problem was discovered: after the library runs using a Highlight API, there is a huge performance degradation if the next run wraps matches in HTML elements.<br>\nThe library splits text nodes when wrapping matches in HTML elements and this is forced the browser to re-calculate layout and re-render highlights.<br>\n<br>This performance problem is solved by using <code>StaticRange</code> objects, but it may raise another problem - a <code>StaticRange</code> does not keep the same content on document changes.</p><p>So, be aware of possible performance issue, when setting option <code>staticRanges: false</code>.</p></div>","rangeacrosselements-option":"<div><h3 id=\"rangeacrosselements-option\"><code>rangeAcrossElements</code> option</h3><p>This option allows creating a single range for matches located across elements when using the Highlight API with the <code>acrossElements</code> (<code>markRanges()</code> API does not require this) option.</p><div class='note'><b>Note</b> that the <code>filter</code> callback's first parameter is an array of text node(s) containing a match instead of a text node.</div><p>When it is set to <code>false</code>, the number of <code>StaticRange/Range</code> objects is equal to the number of marked elements (the library creates a <code>StaticRange/Range</code> object instead of creating an element).<br>\nIt can be useful for compatibility: the only difference is <code>each</code> callback's first parameter - a <code>StaticRange/Range</code> object instead of an HTML element.</p><pre><code class=\"language-js\"></code></pre></div>","filtering-capturing-groups":"<div><h4 id=\"filtering-capturing-groups\">Filtering capturing groups:</h4><p>See <a href=\"markRegExp-method.html#markRegExp-filter\">markRegExp() filter callback</a>'s <code>info</code> object properties.</p><pre><code class=\"language-js\"><span class=\"copy-code\"></span>instance.markRegExp(<span class=\"jreg\">/(AB)\\b.+\\b(?&lt;gr2&gt;CD)?.+(EF)\\b/dgi</span>, {\n    <span class=\"com\">// 'acrossElements': true,</span>\n    <span class=\"str\">'separateGroups'</span>: <span class=\"kwd\">true</span>,\n    <span class=\"str\">'filter'</span>: (textNode, matchString, matchesSoFar, info) =&gt; {\n        <span class=\"com\">// To filter any group use info.groupIndex - a current group index\n        // Note: if a group lays across elements, the index be the same while a group is wrapping</span>\n        <span class=\"kwd\">if</span> (info.groupIndex === 1) <span class=\"kwd\">return</span> <span class=\"kwd\">false</span>;\n\n        <span class=\"com\">// also can be used a group content (not reliable)\n       // if (matchString === 'AB') return  false;</span>\n\n        <span class=\"com\">// To filter a whole match on a group presence\n        // Note: it iterates through all groups and only then returns</span>\n        <span class=\"kwd\">if</span> (info.match[2]) <span class=\"kwd\">return</span> <span class=\"kwd\">true</span>/<span class=\"kwd\">false</span>;\n\n        <span class=\"com\">// also can be used a named capturing group</span>\n        <span class=\"kwd\">if</span> (info.match.groups.gr2) <span class=\"kwd\">return</span>  <span class=\"kwd\">true</span>/<span class=\"kwd\">false</span>;\n\n        <span class=\"kwd\">return</span>  <span class=\"kwd\">true</span>;\n    },\n});</code></pre></div>","simple-example-with-nextprevious-buttons":"<div><h3 id=\"simple-example-with-nextprevious-buttons\">Simple example with next/previous buttons</h3><p>Unusable with <code>markRegExp()</code> method having <code>wrapAllRanges</code> option. See <a href=\"nesting-overlapping.html#simple-example-with-nextprevious-buttons-and-wrapallranges-true\">Example with next/previous buttons</a> that can be used for this case.</p><pre><code class=\"language-js\"><span class=\"copy-code\"></span><span class=\"kwd\">let</span> currentIndex = 0,\n    marks = $(<span class=\"str\">'mark'</span>),\n    startElements = marks.filter((i, elem) =&gt; $(elem).hasClass(<span class=\"str\">'start-1'</span>));\n    <span class=\"com\">//startElements = marks.filter((i, elem) =&gt; $(elem).data('advanced-markjs') === 'start-1');</span>\n\nprevButton.on(<span class=\"str\">'click'</span>, <span class=\"kwd\">function</span>() {\n    <span class=\"kwd\">if</span> (--currentIndex &lt;= 0) currentIndex = 0;\n\n    <span class=\"kwd\">let</span> elem = startElements.eq(currentIndex);\n    <span class=\"kwd\">if</span> (elem.length) highlightMatch(elem[0]);\n});\n\nnextButton.on(<span class=\"str\">'click'</span>, <span class=\"kwd\">function</span>() {\n    <span class=\"kwd\">if</span> (++currentIndex &gt;= startElements.length) currentIndex = startElements.length - 1;\n\n    <span class=\"kwd\">let</span> elem = startElements.eq(currentIndex);\n    <span class=\"kwd\">if</span> (elem.length) highlightMatch(elem[0]);\n});\n\n<span class=\"com\">// adds class 'current' to all mark elements of the found match if it located across elements\n// or to the first mark element</span>\n<span class=\"kwd\">function</span> highlightMatch(elem) {\n    <span class=\"kwd\">let</span> found = <span class=\"kwd\">false</span>;\n    marks.each((i, el) =&gt; {\n        <span class=\"kwd\">if</span> ( !found) {\n            <span class=\"kwd\">if</span> (el === elem[0]) found = <span class=\"kwd\">true</span>;\n\n        <span class=\"com\">// start of the next 'start element' means the end of the current match</span>\n        } <span class=\"kwd\">else</span> <span class=\"kwd\">if</span> ($(el).hasClass(<span class=\"str\">'start-1'</span>)) <span class=\"kwd\">return</span>  <span class=\"kwd\">false</span>;\n        <span class=\"com\">//} else if ($(el).data('advanced-markjs') === 'start-1') return  false;</span>\n\n        <span class=\"kwd\">if</span> (found) {\n            $(el).addClass(<span class=\"str\">'current'</span>);\n            $(el).find(<span class=\"str\">'*[data-markjs]'</span>).addClass(<span class=\"str\">'current'</span>);  <span class=\"com\">// add class to all descendant too</span>\n        }\n    });\n}</code></pre></div>"};