(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1786],{22952:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/properties-on-map",function(){return r(90116)}])},25182:function(e,t,r){"use strict";function n(e){}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"clientHookInServerComponentError",{enumerable:!0,get:function(){return n}}),r(38754),r(67294),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},31414:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{ReadonlyURLSearchParams:function(){return p},useSearchParams:function(){return f},usePathname:function(){return g},ServerInsertedHTMLContext:function(){return l.ServerInsertedHTMLContext},useServerInsertedHTML:function(){return l.useServerInsertedHTML},useRouter:function(){return h},useParams:function(){return x},useSelectedLayoutSegments:function(){return A},useSelectedLayoutSegment:function(){return v},redirect:function(){return c.redirect},notFound:function(){return u.notFound}});let n=r(67294),a=r(24224),o=r(78463),i=r(25182),s=r(72526),l=r(43014),c=r(48781),u=r(78147),d=Symbol("internal for urlsearchparams readonly");function m(){return Error("ReadonlyURLSearchParams cannot be modified")}class p{[Symbol.iterator](){return this[d][Symbol.iterator]()}append(){throw m()}delete(){throw m()}set(){throw m()}sort(){throw m()}constructor(e){this[d]=e,this.entries=e.entries.bind(e),this.forEach=e.forEach.bind(e),this.get=e.get.bind(e),this.getAll=e.getAll.bind(e),this.has=e.has.bind(e),this.keys=e.keys.bind(e),this.values=e.values.bind(e),this.toString=e.toString.bind(e)}}function f(){(0,i.clientHookInServerComponentError)("useSearchParams");let e=(0,n.useContext)(o.SearchParamsContext),t=(0,n.useMemo)(()=>e?new p(e):null,[e]);return t}function g(){return(0,i.clientHookInServerComponentError)("usePathname"),(0,n.useContext)(o.PathnameContext)}function h(){(0,i.clientHookInServerComponentError)("useRouter");let e=(0,n.useContext)(a.AppRouterContext);if(null===e)throw Error("invariant expected app router to be mounted");return e}function x(){(0,i.clientHookInServerComponentError)("useParams");let e=(0,n.useContext)(a.GlobalLayoutRouterContext);return e?function e(t,r){var n;void 0===r&&(r={});let a=t[1],o=null!=(n=a.children)?n:Object.values(a)[0];if(!o)return r;let i=o[0],s=Array.isArray(i),l=s?i[1]:i;return!l||l.startsWith("__PAGE__")?r:(s&&(r[i[0]]=i[1]),e(o,r))}(e.tree):null}function A(e){void 0===e&&(e="children"),(0,i.clientHookInServerComponentError)("useSelectedLayoutSegments");let{tree:t}=(0,n.useContext)(a.LayoutRouterContext);return function e(t,r,n,a){let o;if(void 0===n&&(n=!0),void 0===a&&(a=[]),n)o=t[1][r];else{var i;let e=t[1];o=null!=(i=e.children)?i:Object.values(e)[0]}if(!o)return a;let l=o[0],c=(0,s.getSegmentValue)(l);return!c||c.startsWith("__PAGE__")?a:(a.push(c),e(o,r,!1,a))}(t,e)}function v(e){void 0===e&&(e="children"),(0,i.clientHookInServerComponentError)("useSelectedLayoutSegment");let t=A(e);return 0===t.length?null:t[0]}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},78147:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{notFound:function(){return n},isNotFoundError:function(){return a}});let r="NEXT_NOT_FOUND";function n(){let e=Error(r);throw e.digest=r,e}function a(e){return(null==e?void 0:e.digest)===r}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},48781:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{redirect:function(){return n},isRedirectError:function(){return a},getURLFromRedirectError:function(){return o}});let r="NEXT_REDIRECT";function n(e){let t=Error(r);throw t.digest=r+";"+e,t}function a(e){return"string"==typeof(null==e?void 0:e.digest)&&e.digest.startsWith(r+";")&&e.digest.length>r.length+1}function o(e){return a(e)?e.digest.slice(r.length+1):null}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},72526:function(e,t){"use strict";function r(e){return Array.isArray(e)?e[1]:e}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getSegmentValue",{enumerable:!0,get:function(){return r}}),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},43014:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{ServerInsertedHTMLContext:function(){return o},useServerInsertedHTML:function(){return i}});let n=r(61757),a=n._(r(67294)),o=a.default.createContext(null);function i(e){let t=(0,a.useContext)(o);t&&t(e)}},90116:function(e,t,r){"use strict";r.r(t),r.d(t,{__N_SSP:function(){return E},default:function(){return S}});var n=r(85893),a=r(67294);r(49824);var o=r(34774),i=r(85715),s=r(64297),l=r(37054),c=r(25675),u=r.n(c),d=r(82267),m=r(9473),p=r(86893);r(41664);var f=r(2086),g=r(24404),h=r(26990),x=r(60155),A=r(11163);let v=e=>{let{data:t,CurrencySymbol:r,PlaceHolderImg:a}=e,o=(0,A.useRouter)(),i=(0,g.$W)(),s=e=>{e.preventDefault(),o.push("properties-details/".concat(t.slug_id))};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)("div",{className:"verticle_card_map",children:(0,n.jsxs)("div",{className:"card verticle_main_card_map",children:[(0,n.jsx)("div",{className:"verticle_card_img_div_map",children:(0,n.jsx)(u(),{loading:"lazy",className:"card-img",id:"verticle_card_img_map",src:t.title_image?t.title_image:a,alt:"no_img",width:200,height:200})}),(0,n.jsx)("div",{className:"card-img-overlay",children:(0,n.jsx)("span",{className:"sell_tag_map",children:t.property_type})}),(0,n.jsxs)("div",{className:"card-body",children:[(0,n.jsxs)("span",{className:"price_teg",children:[r," ",(0,g.ze)(t.price)]}),(0,n.jsxs)("div",{className:"feature_card_mainbody",children:[(0,n.jsx)("div",{className:"cate_image",children:i?(0,n.jsx)(h.t,{imageUrl:t.category&&t.category.image,className:"custom-svg"}):(0,n.jsx)(u(),{loading:"lazy",src:t.category&&t.category.image,alt:"no_img",width:20,height:20})}),(0,n.jsxs)("span",{className:"feature_body_title",children:[" ",t.category&&t.category.category," "]})]}),(0,n.jsxs)("div",{className:"feature_card_middletext",children:[(0,n.jsx)("span",{children:t.title}),(0,n.jsxs)("p",{children:[t.city," ",t.city?",":null," ",t.state," ",t.state?",":null," ",t.country]})]}),(0,n.jsx)("div",{className:"view_property_map",children:(0,n.jsx)("button",{onClick:s,children:(0,n.jsx)(x.ewB,{size:25})})})]})]})})})},j=e=>{let{onSelectLocation:t,apiKey:r,latitude:o,longitude:i,data:s,setActiveTab:c,activeTab:u,fetchAllData:h}=e,[x,A]=(0,a.useState)({lat:o?parseFloat(o):23.2419997,lng:i?parseFloat(i):69.6669324}),[j,y]=(0,a.useState)(x),[_,b]=(0,a.useState)(null),[E,S]=(0,a.useState)(""),[C,w]=(0,a.useState)(null),P=(0,a.useRef)(null),N=(0,m.v9)(d.vV),k=N&&N.currency_symbol,I=null==N?void 0:N.web_placeholder_logo;(0,a.useEffect)(()=>{y(x)},[x]),(0,a.useEffect)(()=>{},[C]);let M=e=>{c("sell"===e?0:1)},F=()=>{b("Failed to load the map. Please check your API key and network connection.")},O=e=>{S(e.target.value)},B=()=>{if(P.current&&""!==E.trim()){let e=P.current.getPlace();if(e.geometry){let r=e.formatted_address||"Address not available",{city:n,country:a,state:o}=R(e),i={lat:e.geometry.location.lat(),lng:e.geometry.location.lng(),formatted_address:r,city:n,country:a,state:o};S(r),y(i),t(i);let s=document.getElementById("map");s&&s.scrollIntoView({behavior:"smooth"})}else console.error("No geometry available for selected place.")}},R=e=>{let t=null,r=null,n=null;for(let a of e.address_components)a.types.includes("locality")?t=a.long_name:a.types.includes("country")?r=a.long_name:a.types.includes("administrative_area_level_1")&&(n=a.long_name);return{city:t,country:r,state:n}},L=e=>{e.preventDefault(),S(""),h()};return(0,n.jsx)(n.Fragment,{children:(0,n.jsx)("div",{id:"map",children:_?(0,n.jsx)("div",{children:_}):(0,n.jsxs)(l.KJ,{googleMapsApiKey:r,libraries:["places"],onError:F,children:[(0,n.jsx)(l.F2,{onLoad:e=>{P.current=e},children:(0,n.jsxs)("div",{id:"searchbox1",className:"container",children:[(0,n.jsx)(f.Z,{children:(0,n.jsxs)("ul",{className:"nav nav-tabs",id:"tabs",children:[(0,n.jsx)("li",{className:"",children:(0,n.jsx)("a",{className:"nav-link ".concat(0===u?"tab-0":""),"aria-current":"page",id:"sellbutton",onClick:()=>M("sell"),children:(0,g.Iu)("sell")})}),(0,n.jsx)("li",{className:"",children:(0,n.jsx)("a",{className:"nav-link ".concat(1===u?"tab-1":""),onClick:()=>M("rent"),"aria-current":"page",id:"rentbutton",children:(0,g.Iu)("rent")})})]})}),(0,n.jsxs)("div",{id:"searchcard",children:[(0,n.jsxs)("div",{id:"searchbuttoon",children:[(0,n.jsx)(p.jRj,{size:20}),(0,n.jsx)("input",{className:"searchinput",placeholder:"Search your property",name:"propertySearch",value:E,onChange:O})]}),(0,n.jsxs)("div",{id:"leftside-buttons1",children:[(0,n.jsx)("button",{className:"clear-map",onClick:L,children:(0,g.Iu)("clear")}),(0,n.jsx)("button",{className:"find-map",onClick:B,children:(0,g.Iu)("search")})]})]})]})}),(0,n.jsxs)(l.b6,{zoom:11,center:j,id:"properties_on_map_googlemap",children:[s.map((e,t)=>(0,n.jsx)(l.Jx,{position:{lat:parseFloat(e.latitude),lng:parseFloat(e.longitude)},onClick:()=>w(e),icon:{url:"/map-icon.svg"}},t)),C&&(0,n.jsx)(l.nx,{position:{lat:parseFloat(C.latitude),lng:parseFloat(C.longitude)},onCloseClick:()=>w(null),children:(0,n.jsx)(v,{data:C,CurrencySymbol:k,PlaceHolderImg:I})})]})]})})})};var y=r(51183);let _=()=>{let[e,t]=(0,a.useState)(""),[r,o]=(0,a.useState)([]),[l,c]=(0,a.useState)(0),u=()=>{(0,y.nZ)({city:"",state:"",type:"",onSuccess:e=>{o(e.data)},onError:e=>{console.log(e)}})};(0,a.useEffect)(()=>{u()},[]);let d=e=>{t(e),(0,y.nZ)({city:e.city,state:e.state,type:l,onSuccess:e=>{o(e.data)},onError:e=>{console.log(e)}})};return(0,a.useEffect)(()=>{},[r,l]),(0,n.jsxs)(s.Z,{children:[(0,n.jsx)(i.Z,{}),(0,n.jsx)("section",{id:"properties_on_map",children:(0,n.jsx)(j,{apiKey:"AIzaSyBEolDOd9q3YtNdwVPlCiWNyCYuXC8E7go",onSelectLocation:d,data:r,setActiveTab:c,activeTab:l,fetchAllData:u})})]})},b=e=>{let{seoData:t,currentURL:r}=e;return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(o.Z,{title:(null==t?void 0:t.data)&&t.data.length>0&&t.data[0].meta_title,description:(null==t?void 0:t.data)&&t.data.length>0&&t.data[0].meta_description,keywords:(null==t?void 0:t.data)&&t.data.length>0&&t.data[0].meta_keywords,ogImage:(null==t?void 0:t.data)&&t.data.length>0&&t.data[0].meta_image,pathName:r}),(0,n.jsx)(_,{})]})};var E=!0,S=b},85715:function(e,t,r){"use strict";r.d(t,{Z:function(){return A}});var n=r(85893),a=r(67294),o={src:"/_next/static/media/Breadcrumbs.1ae0e8e1.jpg",height:1300,width:3840,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAMACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAwEBAQAAAAAAAAAAAAAAAAAAAQL/2gAMAwEAAhADEAAAALBn/8QAHBAAAQMFAAAAAAAAAAAAAAAAAQACBAMREiFS/9oACAEBAAE/AJEqs/C7hscgL//EABkRAAEFAAAAAAAAAAAAAAAAAAIAAQMSMf/aAAgBAgEBPwCIiprr/8QAFhEAAwAAAAAAAAAAAAAAAAAAAAMy/9oACAEDAQE/AGUf/9k=",blurWidth:8,blurHeight:3},i=r(38138),s=r(47516),l=r(9473),c=r(82267),u=r(86501),d=r(51183),m=r(8193),p=r(82610),f=r(11163),g=r(68258),h=r(24404);let x=e=>{let t=(0,f.useRouter)(),{data:r,title:x}=e,A=(0,l.v9)(c.vV),v=A&&A.currency_symbol;A&&A.company_name;let j=(0,l.v9)(e=>e.User_signup);j&&j.data&&j.data.data.id;let[y,_]=(0,a.useState)(e.data&&e.data.is_favourite),[b,E]=(0,a.useState)(!1),S=t=>{t.preventDefault(),t.stopPropagation(),j&&j.data&&j.data.token?(0,d.pw)(e.data.propId,"1",e=>{_(!0),E(!1),u.Am.success(e.message)},e=>{console.log(e)}):u.Am.error("Please login first to add this property to favorites.")},C=t=>{t.preventDefault(),t.stopPropagation(),(0,d.pw)(e.data.propId,"0",e=>{_(!1),E(!0),u.Am.success(e.message)},e=>{console.log(e)})};return"".concat("https://webroker.wbservicos.com.br").concat(t.asPath),(0,a.useEffect)(()=>{_(e.data&&1===e.data.is_favourite),E(!1)},[e.data&&e.data.is_favourite]),p.Z,p.Z.Item,g.Dk,null==r||r.title,g.Vq,(0,h.Iu)("Facebook"),p.Z.Item,g.B,g.b0,(0,h.Iu)("Twitter"),p.Z.Item,g.N0,null==r||r.title,g.ud,(0,h.Iu)("Whatsapp"),p.Z.Item,i.dmD,(0,h.Iu)("Copy Link"),(0,n.jsx)("div",{id:"breadcrumb",style:{backgroundImage:"url(".concat(o.src,")")},children:e.data?(0,n.jsx)(n.Fragment,{children:(0,n.jsx)("div",{id:"breadcrumb-content",className:"container",children:(0,n.jsxs)("div",{className:"row",id:"breadcrumb_row",children:[(0,n.jsx)("div",{className:"col-12 col-md-6 col-lg-6",children:(0,n.jsxs)("div",{className:"left-side-content",children:[(0,n.jsx)("span",{className:"prop-types",children:r.type}),(0,n.jsx)("span",{className:"prop-name",children:r.title}),(0,n.jsxs)("span",{className:"prop-Location",children:[(0,n.jsx)(i.v2c,{size:25})," ",r.loc]}),(0,n.jsxs)("div",{className:"prop-sell-time",children:[(0,n.jsx)("span",{className:"propertie-sell-tag",children:r.propertyType}),(0,n.jsxs)("span",{children:[" ",(0,n.jsx)(s.YFw,{size:20})," ",r.time]})]})]})}),(0,n.jsx)("div",{className:"col-12 col-md-6 col-lg-6",children:(0,n.jsxs)("div",{className:"right-side-content",children:[(0,n.jsxs)("span",{children:[" ",v," ",(0,h.pw)(r.price)," ","rent"===r.propertyType&&r.rentduration?"/ ".concat(r.rentduration):""]}),(0,n.jsxs)("div",{className:"rightside_buttons",children:[(0,n.jsx)("div",{children:y?(0,n.jsx)("button",{onClick:C,children:(0,n.jsx)(m.M_L,{size:25,className:"liked_property"})}):b?(0,n.jsx)("button",{onClick:S,children:(0,n.jsx)(m.lo,{size:25,className:"disliked_property"})}):(0,n.jsx)("button",{onClick:S,children:(0,n.jsx)(m.lo,{size:25})})}),null]})]})})]})})}):(0,n.jsx)("div",{className:"container",id:"breadcrumb-headline",children:(0,n.jsx)("h2",{children:e.title})})})};var A=x},26990:function(e,t,r){"use strict";r.d(t,{t:function(){return o}});var n=r(85893);r(82267);var a=r(67294);r(9473);let o=e=>{let{imageUrl:t,className:r}=e,[o,i]=(0,a.useState)("");return(0,a.useEffect)(()=>{let e=async()=>{try{let e=await fetch(t),r=await e.text(),n=r.replace(/<defs>([\s\S]*?)<\/defs>/,"");i(n)}catch(e){console.error("Error converting image to SVG:",e)}};e()},[t]),(0,n.jsx)("div",{className:r,dangerouslySetInnerHTML:{__html:o}})}},64297:function(e,t,r){"use strict";r.d(t,{Z:function(){return y}});var n=r(85893),a=r(67294),o=r(87650),i=r(96392),s=r(9473),l=r(25789),c=r(69998),u=r(82267),d={src:"/_next/static/media/under_maintain.69392bf7.svg",height:1080,width:1080,blurWidth:0,blurHeight:0},m=r(24404),p=r(25675),f=r.n(p),g=r(11163),h=r(78269),x=r(39332),A=r(86455),v=r.n(A);let j=e=>{let{children:t}=e,[r,p]=(0,a.useState)(!0),A=(0,s.v9)(e=>e.User_signup),j=A&&A.data?A.data.data.id:null,y=(0,g.useRouter)(),_=(0,s.v9)(u.vV);(0,a.useEffect)(()=>{(0,u.PH)(null,A?j:"",e=>{var t,r,n;p(!1),document.documentElement.style.setProperty("--primary-color",null==e?void 0:null===(t=e.data)||void 0===t?void 0:t.system_color),document.documentElement.style.setProperty("--primary-category-background",null==e?void 0:null===(r=e.data)||void 0===r?void 0:r.category_background),document.documentElement.style.setProperty("--primary-sell",null==e?void 0:null===(n=e.data)||void 0===n?void 0:n.sell_background)},e=>{console.log(e)})},[A,null==_?void 0:_.svg_clr]);let b=(0,x.usePathname)(),E=h.Fl.includes(b);(0,a.useEffect)(()=>{S()},[E]);let S=()=>{E&&!j&&v().fire({icon:"error",title:"Oops...",text:"You have notLogin. Please Login First",allowOutsideClick:!1,customClass:{confirmButton:"Swal-confirm-buttons"}}).then(e=>{e.isConfirmed&&y.push("/")})};return(0,a.useEffect)(()=>{j||"/user-register"!==window.location.pathname||y.push("/")},[]),(0,s.v9)(l.iT),(0,n.jsx)("div",{children:r?(0,n.jsx)(c.Z,{}):(0,n.jsx)(n.Fragment,{children:(null==_?void 0:_.maintenance_mode)==="1"?(0,n.jsx)("div",{className:"under_maintance",children:(0,n.jsxs)("div",{className:"col-12 text-center",children:[(0,n.jsx)("div",{children:(0,n.jsx)(f(),{loading:"lazy",src:d.src,alt:"underMaintance",width:600,height:600})}),(0,n.jsxs)("div",{className:"no_page_found_text",children:[(0,n.jsx)("h3",{children:(0,m.Iu)("underMaintance")}),(0,n.jsx)("span",{children:(0,m.Iu)("pleaseTryagain")})]})]})}):(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(i.Z,{}),t,(0,n.jsx)(o.Z,{})]})})})};var y=j},34774:function(e,t,r){"use strict";var n=r(85893),a=r(9008),o=r.n(a);let i=e=>{let{title:t,description:r,keywords:a,ogImage:i,pathName:s}=e;return(0,n.jsxs)(o(),{children:[(0,n.jsx)("title",{children:t||"IPANEMA eBroker | Capacite seu neg\xf3cio imobili\xe1rio"}),(0,n.jsx)("meta",{name:"name",content:t||"IPANEMA eBroker | Capacite seu neg\xf3cio imobili\xe1rio"}),(0,n.jsx)("meta",{name:"description",content:r||"Desbloqueie o seu potencial imobili\xe1rio com o Ipanema eBroker - a solu\xe7\xe3o definitiva para o seu neg\xf3cio. Simplifique as opera\xe7\xf5es, aumente a efici\xeancia e tenha sucesso com estilo!"}),(0,n.jsx)("meta",{name:"keywords",content:a||"Unique Properties Search,Tailored Real Estate Experiences,Exclusive Property Deals,Personalised Realty Services,Seamless Property Transactions,Prime Residential Properties,Bespoke Property Search,Exceptional Real Estate Guidance,,Premium Housing Options,Innovative Property Solutions"}),(0,n.jsx)("meta",{name:"image",content:i||null}),(0,n.jsx)("meta",{property:"og:title",content:t||"IPANEMA eBroker | Capacite seu neg\xf3cio imobili\xe1rio"}),(0,n.jsx)("meta",{property:"og:description",content:r||"Desbloqueie o seu potencial imobili\xe1rio com o Ipanema eBroker - a solu\xe7\xe3o definitiva para o seu neg\xf3cio. Simplifique as opera\xe7\xf5es, aumente a efici\xeancia e tenha sucesso com estilo!"}),(0,n.jsx)("meta",{property:"og:image",content:i||null}),(0,n.jsx)("meta",{property:"og:image:type",content:"image/jpg"}),(0,n.jsx)("meta",{property:"og:image:width",content:"1080"}),(0,n.jsx)("meta",{property:"og:image:height",content:"608"}),(0,n.jsx)("meta",{property:"og:url",content:s||"EBROKER"}),(0,n.jsx)("meta",{property:"og:type",content:"website"}),(0,n.jsx)("meta",{name:"twitter:title",content:t||"IPANEMA eBroker | Capacite seu neg\xf3cio imobili\xe1rio"}),(0,n.jsx)("meta",{name:"twitter:description",content:r||"Desbloqueie o seu potencial imobili\xe1rio com o Ipanema eBroker - a solu\xe7\xe3o definitiva para o seu neg\xf3cio. Simplifique as opera\xe7\xf5es, aumente a efici\xeancia e tenha sucesso com estilo!"}),(0,n.jsx)("meta",{name:"twitter:image",content:i||null}),(0,n.jsx)("meta",{name:"twitter:card",content:"summary_large_image"}),(0,n.jsx)("link",{rel:"canonical",href:"".concat("https://webroker.wbservicos.com.br")}),(0,n.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"}),(0,n.jsx)("meta",{name:"robots",content:"index, follow,max-snippet:-1,max-video-preview:-1,max-image-preview:large"})]})};t.Z=i},78269:function(e,t,r){"use strict";r.d(t,{Fl:function(){return a},i1:function(){return n}});let n=["/user/dashboard/","/user/advertisement/","/user/properties/","/user/subscription/","/user/transaction-history/"],a=["/user/chat/","/user-register/","/user/profile/","/user/favorites-properties/"]},9008:function(e,t,r){e.exports=r(42636)},39332:function(e,t,r){e.exports=r(31414)},2086:function(e,t,r){"use strict";var n=r(93967),a=r.n(n),o=r(67294),i=r(76792),s=r(85893);let l=o.forwardRef(({bsPrefix:e,size:t,vertical:r=!1,className:n,role:o="group",as:l="div",...c},u)=>{let d=(0,i.vE)(e,"btn-group"),m=d;return r&&(m=`${d}-vertical`),(0,s.jsx)(l,{...c,ref:u,role:o,className:a()(n,m,t&&`${d}-${t}`)})});l.displayName="ButtonGroup",t.Z=l}},function(e){e.O(0,[5937,8166,4617,4980,3874,3609,9401,260,5675,913,631,1664,3789,155,5529,6958,7545,2610,8258,354,9774,2888,179],function(){return e(e.s=22952)}),_N_E=e.O()}]);