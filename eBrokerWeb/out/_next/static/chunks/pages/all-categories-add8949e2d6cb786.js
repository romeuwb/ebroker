(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5882],{96994:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/all-categories",function(){return a(76415)}])},76415:function(e,t,a){"use strict";a.r(t),a.d(t,{__N_SSP:function(){return j},default:function(){return _}});var i=a(85893),s=a(67294),r=a(85715),n=a(44511),o=a(7134),l=a(88216),c=a(25789),d=a(87713),u=a(24404),m=a(41664),A=a.n(m),p=a(9473),x=a(64297);let h=()=>{let e=(0,p.v9)(c.iT);(0,s.useEffect)(()=>{},[e]);let[t,a]=(0,s.useState)(!1),m=(0,p.v9)(d.A3);return(0,i.jsxs)(x.Z,{children:[(0,i.jsx)(r.Z,{title:(0,u.Iu)("allCategories")}),(0,i.jsx)("section",{id:"view_all_cate_section",children:(0,i.jsx)("div",{className:"cate_section",children:(null==m?void 0:m.length)>0&&m.some(e=>0!==e.properties_count&&""!==e.properties_count)?(0,i.jsx)("div",{className:"container",children:(0,i.jsx)("div",{className:"row",children:t?Array.from({length:m?m.length:12}).map((e,t)=>(0,i.jsx)("div",{className:"col-sm-12 col-md-6 col-lg-2 loading_data",children:(0,i.jsx)(l.Z,{})},t)):m&&(null==m?void 0:m.map((e,t)=>0!==e.properties_count&&""!==e.properties_count?(0,i.jsx)("div",{className:"col-sm-12 col-md-6 col-lg-2",children:(0,i.jsx)(A(),{href:"/properties/categories/".concat(e.slug_id),children:(0,i.jsx)(n.Z,{ele:e})})},t):null))})}):(0,i.jsx)("div",{className:"noDataFoundDiv",children:(0,i.jsx)(o.Z,{})})})})]})};var g=a(34774);a(49824);let v=e=>{let{seoData:t,currentURL:a}=e;return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(g.Z,{title:(null==t?void 0:t.data)&&t.data.length>0&&t.data[0].meta_title,description:(null==t?void 0:t.data)&&t.data.length>0&&t.data[0].meta_description,keywords:(null==t?void 0:t.data)&&t.data.length>0&&t.data[0].meta_keywords,ogImage:(null==t?void 0:t.data)&&t.data.length>0&&t.data[0].meta_image,pathName:a}),(0,i.jsx)(h,{})]})};var j=!0,_=v},85715:function(e,t,a){"use strict";a.d(t,{Z:function(){return v}});var i=a(85893),s=a(67294),r={src:"/_next/static/media/Breadcrumbs.1ae0e8e1.jpg",height:1300,width:3840,blurDataURL:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoKCgoKCgsMDAsPEA4QDxYUExMUFiIYGhgaGCIzICUgICUgMy03LCksNy1RQDg4QFFeT0pPXnFlZXGPiI+7u/sBCgoKCgoKCwwMCw8QDhAPFhQTExQWIhgaGBoYIjMgJSAgJSAzLTcsKSw3LVFAODhAUV5PSk9ecWVlcY+Ij7u7+//CABEIAAMACAMBIgACEQEDEQH/xAAoAAEBAAAAAAAAAAAAAAAAAAAAAwEBAQAAAAAAAAAAAAAAAAAAAQL/2gAMAwEAAhADEAAAALBn/8QAHBAAAQMFAAAAAAAAAAAAAAAAAQACBAMREiFS/9oACAEBAAE/AJEqs/C7hscgL//EABkRAAEFAAAAAAAAAAAAAAAAAAIAAQMSMf/aAAgBAgEBPwCIiprr/8QAFhEAAwAAAAAAAAAAAAAAAAAAAAMy/9oACAEDAQE/AGUf/9k=",blurWidth:8,blurHeight:3},n=a(38138),o=a(47516),l=a(9473),c=a(82267),d=a(86501),u=a(51183),m=a(8193),A=a(82610),p=a(11163),x=a(68258),h=a(24404);let g=e=>{let t=(0,p.useRouter)(),{data:a,title:g}=e,v=(0,l.v9)(c.vV),j=v&&v.currency_symbol;v&&v.company_name;let _=(0,l.v9)(e=>e.User_signup);_&&_.data&&_.data.data.id;let[f,y]=(0,s.useState)(e.data&&e.data.is_favourite),[w,b]=(0,s.useState)(!1),E=t=>{t.preventDefault(),t.stopPropagation(),_&&_.data&&_.data.token?(0,u.pw)(e.data.propId,"1",e=>{y(!0),b(!1),d.Am.success(e.message)},e=>{console.log(e)}):d.Am.error("Please login first to add this property to favorites.")},N=t=>{t.preventDefault(),t.stopPropagation(),(0,u.pw)(e.data.propId,"0",e=>{y(!1),b(!0),d.Am.success(e.message)},e=>{console.log(e)})};return"".concat("https://webroker.wbservicos.com.br").concat(t.asPath),(0,s.useEffect)(()=>{y(e.data&&1===e.data.is_favourite),b(!1)},[e.data&&e.data.is_favourite]),A.Z,A.Z.Item,x.Dk,null==a||a.title,x.Vq,(0,h.Iu)("Facebook"),A.Z.Item,x.B,x.b0,(0,h.Iu)("Twitter"),A.Z.Item,x.N0,null==a||a.title,x.ud,(0,h.Iu)("Whatsapp"),A.Z.Item,n.dmD,(0,h.Iu)("Copy Link"),(0,i.jsx)("div",{id:"breadcrumb",style:{backgroundImage:"url(".concat(r.src,")")},children:e.data?(0,i.jsx)(i.Fragment,{children:(0,i.jsx)("div",{id:"breadcrumb-content",className:"container",children:(0,i.jsxs)("div",{className:"row",id:"breadcrumb_row",children:[(0,i.jsx)("div",{className:"col-12 col-md-6 col-lg-6",children:(0,i.jsxs)("div",{className:"left-side-content",children:[(0,i.jsx)("span",{className:"prop-types",children:a.type}),(0,i.jsx)("span",{className:"prop-name",children:a.title}),(0,i.jsxs)("span",{className:"prop-Location",children:[(0,i.jsx)(n.v2c,{size:25})," ",a.loc]}),(0,i.jsxs)("div",{className:"prop-sell-time",children:[(0,i.jsx)("span",{className:"propertie-sell-tag",children:a.propertyType}),(0,i.jsxs)("span",{children:[" ",(0,i.jsx)(o.YFw,{size:20})," ",a.time]})]})]})}),(0,i.jsx)("div",{className:"col-12 col-md-6 col-lg-6",children:(0,i.jsxs)("div",{className:"right-side-content",children:[(0,i.jsxs)("span",{children:[" ",j," ",(0,h.pw)(a.price)," ","rent"===a.propertyType&&a.rentduration?"/ ".concat(a.rentduration):""]}),(0,i.jsxs)("div",{className:"rightside_buttons",children:[(0,i.jsx)("div",{children:f?(0,i.jsx)("button",{onClick:N,children:(0,i.jsx)(m.M_L,{size:25,className:"liked_property"})}):w?(0,i.jsx)("button",{onClick:E,children:(0,i.jsx)(m.lo,{size:25,className:"disliked_property"})}):(0,i.jsx)("button",{onClick:E,children:(0,i.jsx)(m.lo,{size:25})})}),null]})]})})]})})}):(0,i.jsx)("div",{className:"container",id:"breadcrumb-headline",children:(0,i.jsx)("h2",{children:e.title})})})};var v=g},44511:function(e,t,a){"use strict";var i=a(85893),s=a(82267),r=a(24404);a(67294);var n=a(28837),o=a(9473),l=a(25675),c=a.n(l),d=a(26990);let u=e=>{let{ele:t}=e,a=(0,o.v9)(s.vV),l=null==a?void 0:a.web_placeholder_logo,u=(0,r.$W)();return(0,i.jsx)("div",{className:"Category_card",children:(0,i.jsx)(n.Z,{id:"main_aprt_card",children:(0,i.jsx)(n.Z.Body,{children:(0,i.jsxs)("div",{className:"apart_card_content",children:[(0,i.jsx)("div",{id:"apart_icon",children:u?(0,i.jsx)(d.t,{imageUrl:t.image?t.image:l,className:"custom-svg"}):(0,i.jsx)(c(),{loading:"lazy",src:t.image?t.image:l,alt:"no_img",className:"solo_icon",width:200,height:200})}),(0,i.jsxs)("div",{id:"apart_name",children:[t.category,(0,i.jsxs)("div",{id:"propertie_count",children:[t.properties_count," ",(0,r.Iu)("properties")]})]})]})})})})};t.Z=u},26990:function(e,t,a){"use strict";a.d(t,{t:function(){return r}});var i=a(85893);a(82267);var s=a(67294);a(9473);let r=e=>{let{imageUrl:t,className:a}=e,[r,n]=(0,s.useState)("");return(0,s.useEffect)(()=>{let e=async()=>{try{let e=await fetch(t),a=await e.text(),i=a.replace(/<defs>([\s\S]*?)<\/defs>/,"");n(i)}catch(e){console.error("Error converting image to SVG:",e)}};e()},[t]),(0,i.jsx)("div",{className:a,dangerouslySetInnerHTML:{__html:r}})}},64297:function(e,t,a){"use strict";a.d(t,{Z:function(){return f}});var i=a(85893),s=a(67294),r=a(87650),n=a(96392),o=a(9473),l=a(25789),c=a(69998),d=a(82267),u={src:"/_next/static/media/under_maintain.69392bf7.svg",height:1080,width:1080,blurWidth:0,blurHeight:0},m=a(24404),A=a(25675),p=a.n(A),x=a(11163),h=a(78269),g=a(39332),v=a(86455),j=a.n(v);let _=e=>{let{children:t}=e,[a,A]=(0,s.useState)(!0),v=(0,o.v9)(e=>e.User_signup),_=v&&v.data?v.data.data.id:null,f=(0,x.useRouter)(),y=(0,o.v9)(d.vV);(0,s.useEffect)(()=>{(0,d.PH)(null,v?_:"",e=>{var t,a,i;A(!1),document.documentElement.style.setProperty("--primary-color",null==e?void 0:null===(t=e.data)||void 0===t?void 0:t.system_color),document.documentElement.style.setProperty("--primary-category-background",null==e?void 0:null===(a=e.data)||void 0===a?void 0:a.category_background),document.documentElement.style.setProperty("--primary-sell",null==e?void 0:null===(i=e.data)||void 0===i?void 0:i.sell_background)},e=>{console.log(e)})},[v,null==y?void 0:y.svg_clr]);let w=(0,g.usePathname)(),b=h.Fl.includes(w);(0,s.useEffect)(()=>{E()},[b]);let E=()=>{b&&!_&&j().fire({icon:"error",title:"Oops...",text:"You have notLogin. Please Login First",allowOutsideClick:!1,customClass:{confirmButton:"Swal-confirm-buttons"}}).then(e=>{e.isConfirmed&&f.push("/")})};return(0,s.useEffect)(()=>{_||"/user-register"!==window.location.pathname||f.push("/")},[]),(0,o.v9)(l.iT),(0,i.jsx)("div",{children:a?(0,i.jsx)(c.Z,{}):(0,i.jsx)(i.Fragment,{children:(null==y?void 0:y.maintenance_mode)==="1"?(0,i.jsx)("div",{className:"under_maintance",children:(0,i.jsxs)("div",{className:"col-12 text-center",children:[(0,i.jsx)("div",{children:(0,i.jsx)(p(),{loading:"lazy",src:u.src,alt:"underMaintance",width:600,height:600})}),(0,i.jsxs)("div",{className:"no_page_found_text",children:[(0,i.jsx)("h3",{children:(0,m.Iu)("underMaintance")}),(0,i.jsx)("span",{children:(0,m.Iu)("pleaseTryagain")})]})]})}):(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.Z,{}),t,(0,i.jsx)(r.Z,{})]})})})};var f=_},7134:function(e,t,a){"use strict";a.d(t,{Z:function(){return c}});var i=a(85893);a(67294);var s={src:"/_next/static/media/no_data_found_illustrator.4b0bd5d0.svg",height:255,width:255,blurWidth:0,blurHeight:0},r=a(24404),n=a(25675),o=a.n(n);let l=()=>(0,i.jsxs)("div",{className:"col-12 text-center",children:[(0,i.jsx)("div",{children:(0,i.jsx)(o(),{loading:"lazy",src:s.src,alt:"no_img",width:200,height:200})}),(0,i.jsxs)("div",{className:"no_data_found_text",children:[(0,i.jsx)("h3",{children:(0,r.Iu)("noData")}),(0,i.jsx)("span",{children:(0,r.Iu)("noDatatext")})]})]});var c=l},34774:function(e,t,a){"use strict";var i=a(85893),s=a(9008),r=a.n(s);let n=e=>{let{title:t,description:a,keywords:s,ogImage:n,pathName:o}=e;return(0,i.jsxs)(r(),{children:[(0,i.jsx)("title",{children:t||"IPANEMA eBroker | Capacite seu neg\xf3cio imobili\xe1rio"}),(0,i.jsx)("meta",{name:"name",content:t||"IPANEMA eBroker | Capacite seu neg\xf3cio imobili\xe1rio"}),(0,i.jsx)("meta",{name:"description",content:a||"Desbloqueie o seu potencial imobili\xe1rio com o Ipanema eBroker - a solu\xe7\xe3o definitiva para o seu neg\xf3cio. Simplifique as opera\xe7\xf5es, aumente a efici\xeancia e tenha sucesso com estilo!"}),(0,i.jsx)("meta",{name:"keywords",content:s||"Unique Properties Search,Tailored Real Estate Experiences,Exclusive Property Deals,Personalised Realty Services,Seamless Property Transactions,Prime Residential Properties,Bespoke Property Search,Exceptional Real Estate Guidance,,Premium Housing Options,Innovative Property Solutions"}),(0,i.jsx)("meta",{name:"image",content:n||null}),(0,i.jsx)("meta",{property:"og:title",content:t||"IPANEMA eBroker | Capacite seu neg\xf3cio imobili\xe1rio"}),(0,i.jsx)("meta",{property:"og:description",content:a||"Desbloqueie o seu potencial imobili\xe1rio com o Ipanema eBroker - a solu\xe7\xe3o definitiva para o seu neg\xf3cio. Simplifique as opera\xe7\xf5es, aumente a efici\xeancia e tenha sucesso com estilo!"}),(0,i.jsx)("meta",{property:"og:image",content:n||null}),(0,i.jsx)("meta",{property:"og:image:type",content:"image/jpg"}),(0,i.jsx)("meta",{property:"og:image:width",content:"1080"}),(0,i.jsx)("meta",{property:"og:image:height",content:"608"}),(0,i.jsx)("meta",{property:"og:url",content:o||"EBROKER"}),(0,i.jsx)("meta",{property:"og:type",content:"website"}),(0,i.jsx)("meta",{name:"twitter:title",content:t||"IPANEMA eBroker | Capacite seu neg\xf3cio imobili\xe1rio"}),(0,i.jsx)("meta",{name:"twitter:description",content:a||"Desbloqueie o seu potencial imobili\xe1rio com o Ipanema eBroker - a solu\xe7\xe3o definitiva para o seu neg\xf3cio. Simplifique as opera\xe7\xf5es, aumente a efici\xeancia e tenha sucesso com estilo!"}),(0,i.jsx)("meta",{name:"twitter:image",content:n||null}),(0,i.jsx)("meta",{name:"twitter:card",content:"summary_large_image"}),(0,i.jsx)("link",{rel:"canonical",href:"".concat("https://webroker.wbservicos.com.br")}),(0,i.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"}),(0,i.jsx)("meta",{name:"robots",content:"index, follow,max-snippet:-1,max-video-preview:-1,max-image-preview:large"})]})};t.Z=n},88216:function(e,t,a){"use strict";var i=a(85893);a(67294);var s=a(28837),r=a(50549);a(2261),a(99304),a(76268),a(75720),a(84940);let n=()=>(0,i.jsx)("div",{className:"Category_card",children:(0,i.jsx)(s.Z,{id:"main_aprt_card",children:(0,i.jsx)(s.Z.Body,{children:(0,i.jsxs)("div",{className:"apart_card_content",children:[(0,i.jsxs)("div",{id:"apart_icon",children:[(0,i.jsx)(r.Z,{width:"20px",height:"20px"})," "]}),(0,i.jsxs)("div",{id:"apart_name",children:[(0,i.jsx)(r.Z,{width:"80%",height:"20px"})," ",(0,i.jsx)(r.Z,{width:"60%",height:"16px"})," "]})]})})})});t.Z=n},78269:function(e,t,a){"use strict";a.d(t,{Fl:function(){return s},i1:function(){return i}});let i=["/user/dashboard/","/user/advertisement/","/user/properties/","/user/subscription/","/user/transaction-history/"],s=["/user/chat/","/user-register/","/user/profile/","/user/favorites-properties/"]}},function(e){e.O(0,[5937,8166,4617,4980,3874,3609,9401,5675,913,631,1664,3789,155,5529,6958,7545,2610,8258,3742,2871,354,9774,2888,179],function(){return e(e.s=96994)}),_N_E=e.O()}]);