(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9110,9149],{90629:function(e,t,r){"use strict";r.d(t,{Z:function(){return w}});var n=r(63366),o=r(87462),a=r(67294),i=r(90512),l=r(58510),v=r(88111),u=r(56513);let s=e=>((e<1?5.11916*e**2:4.5*Math.log(e+1)+2)/100).toFixed(2);var c=r(39228),f=r(1977),d=r(8027);function p(e){return(0,d.ZP)("MuiPaper",e)}(0,f.Z)("MuiPaper",["root","rounded","outlined","elevation","elevation0","elevation1","elevation2","elevation3","elevation4","elevation5","elevation6","elevation7","elevation8","elevation9","elevation10","elevation11","elevation12","elevation13","elevation14","elevation15","elevation16","elevation17","elevation18","elevation19","elevation20","elevation21","elevation22","elevation23","elevation24"]);var m=r(85893);let y=["className","component","elevation","square","variant"],g=e=>{let{square:t,elevation:r,variant:n,classes:o}=e,a={root:["root",n,!t&&"rounded","elevation"===n&&`elevation${r}`]};return(0,l.Z)(a,p,o)},b=(0,u.ZP)("div",{name:"MuiPaper",slot:"Root",overridesResolver:(e,t)=>{let{ownerState:r}=e;return[t.root,t[r.variant],!r.square&&t.rounded,"elevation"===r.variant&&t[`elevation${r.elevation}`]]}})(({theme:e,ownerState:t})=>{var r;return(0,o.Z)({backgroundColor:(e.vars||e).palette.background.paper,color:(e.vars||e).palette.text.primary,transition:e.transitions.create("box-shadow")},!t.square&&{borderRadius:e.shape.borderRadius},"outlined"===t.variant&&{border:`1px solid ${(e.vars||e).palette.divider}`},"elevation"===t.variant&&(0,o.Z)({boxShadow:(e.vars||e).shadows[t.elevation]},!e.vars&&"dark"===e.palette.mode&&{backgroundImage:`linear-gradient(${(0,v.Fq)("#fff",s(t.elevation))}, ${(0,v.Fq)("#fff",s(t.elevation))})`},e.vars&&{backgroundImage:null==(r=e.vars.overlays)?void 0:r[t.elevation]}))}),h=a.forwardRef(function(e,t){let r=(0,c.Z)({props:e,name:"MuiPaper"}),{className:a,component:l="div",elevation:v=1,square:u=!1,variant:s="elevation"}=r,f=(0,n.Z)(r,y),d=(0,o.Z)({},r,{component:l,elevation:v,square:u,variant:s}),p=g(d);return(0,m.jsx)(b,(0,o.Z)({as:l,ownerState:d,className:(0,i.Z)(p.root,a),ref:t},f))});var w=h},88357:function(e,t,r){"use strict";r.d(t,{w_:function(){return v}});var n=r(67294),o={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},a=n.createContext&&n.createContext(o),i=function(){return(i=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)},l=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&0>t.indexOf(n)&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)0>t.indexOf(n[o])&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]]);return r};function v(e){return function(t){return n.createElement(u,i({attr:i({},e.attr)},t),function e(t){return t&&t.map(function(t,r){return n.createElement(t.tag,i({key:r},t.attr),e(t.child))})}(e.child))}}function u(e){var t=function(t){var r,o=e.attr,a=e.size,v=e.title,u=l(e,["attr","size","title"]),s=a||t.size||"1em";return t.className&&(r=t.className),e.className&&(r=(r?r+" ":"")+e.className),n.createElement("svg",i({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},t.attr,o,u,{className:r,style:i(i({color:e.color||t.color},t.style),e.style),height:s,width:s,xmlns:"http://www.w3.org/2000/svg"}),v&&n.createElement("title",null,v),e.children)};return void 0!==a?n.createElement(a.Consumer,null,function(e){return t(e)}):t(o)}},93967:function(e,t){var r;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/!function(){"use strict";var n={}.hasOwnProperty;function o(){for(var e="",t=0;t<arguments.length;t++){var r=arguments[t];r&&(e=a(e,function(e){if("string"==typeof e||"number"==typeof e)return e;if("object"!=typeof e)return"";if(Array.isArray(e))return o.apply(null,e);if(e.toString!==Object.prototype.toString&&!e.toString.toString().includes("[native code]"))return e.toString();var t="";for(var r in e)n.call(e,r)&&e[r]&&(t=a(t,r));return t}(r)))}return e}function a(e,t){return t?e?e+" "+t:e+t:e}e.exports?(o.default=o,e.exports=o):void 0!==(r=(function(){return o}).apply(t,[]))&&(e.exports=r)}()}}]);