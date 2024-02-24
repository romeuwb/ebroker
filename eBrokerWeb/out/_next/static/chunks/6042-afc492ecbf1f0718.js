"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6042],{5567:function(e,t,a){var o=a(85893),n=a(67294),i=a(37054);let r=e=>{let{onSelectLocation:t,apiKey:a,latitude:r,longitude:s}=e,[c,l]=(0,n.useState)({lat:r?parseFloat(r):23.2419997,lng:s?parseFloat(s):69.6669324}),[p,u]=(0,n.useState)(c),[d,h]=(0,n.useState)(null),[m,f]=(0,n.useState)(""),g=(0,n.useRef)(null);(0,n.useEffect)(()=>{u(c)},[c]),(0,n.useEffect)(()=>{let e=async()=>{try{let e=await H(r,s);if(e){let{formatted_address:a,city:o,country:n,state:i}=e;t({lat:r,lng:s,formatted_address:a,city:o,country:n,state:i})}}catch(e){console.error("Error performing reverse geocoding:",e)}};e()},[]);let y=()=>{},x=async e=>{try{let a=await H(e.latLng.lat(),e.latLng.lng());if(a){let{formatted_address:o,city:n,country:i,state:r}=a,s={lat:e.latLng.lat(),lng:e.latLng.lng(),formatted_address:o,city:n,country:i,state:r};l(s),u(s),t(s)}else console.error("No reverse geocoding data available")}catch(e){console.error("Error performing reverse geocoding:",e)}},H=async(e,t)=>{try{let o=await fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng=".concat(e,",").concat(t,"&key=").concat(a));if(!o.ok)throw Error("Failed to fetch data. Status: "+o.status);let n=await o.json();if("OK"===n.status&&n.results&&n.results.length>0){let e=n.results[0],t=e.formatted_address,{city:a,country:o,state:i}=T(e);return{formatted_address:t,city:a,country:o,state:i}}throw Error("No results found")}catch(e){return console.error("Error performing reverse geocoding:",e),null}},T=e=>{let t=null,a=null,o=null;for(let n of e.address_components)n.types.includes("locality")?t=n.long_name:n.types.includes("country")?a=n.long_name:n.types.includes("administrative_area_level_1")&&(o=n.long_name);return{city:t,country:a,state:o}},j=()=>{h("Failed to load the map. Please check your API key and network connection.")},v=e=>{f(e.target.value)},b=()=>{if(g.current&&""!==m.trim()){let e=g.current.getPlace();if(e.geometry){let a=e.formatted_address||"Address not available",{city:o,country:n,state:i}=T(e),r={lat:e.geometry.location.lat(),lng:e.geometry.location.lng(),formatted_address:a,city:o,country:n,state:i};f(a),u(r),t(r)}else console.error("No geometry available for selected place.")}};return(0,o.jsx)("div",{children:d?(0,o.jsx)("div",{children:d}):(0,o.jsxs)(i.KJ,{googleMapsApiKey:a,libraries:["places"],onError:j,children:[(0,o.jsx)(i.F2,{onLoad:e=>{g.current=e},onPlaceChanged:b,children:(0,o.jsx)("div",{id:"search_location",children:(0,o.jsx)("input",{type:"text",placeholder:"Search for a location",value:m,onChange:v})})}),(0,o.jsx)(i.b6,{zoom:11,center:p,mapContainerStyle:{height:"350px"},children:(0,o.jsx)(i.Jx,{position:p,draggable:!0,onDragStart:y,onDragEnd:x})})]})})};t.Z=r},34774:function(e,t,a){var o=a(85893),n=a(9008),i=a.n(n);let r=e=>{let{title:t,description:a,keywords:n,ogImage:r,pathName:s}=e;return(0,o.jsxs)(i(),{children:[(0,o.jsx)("title",{children:t||"IPANEMA eBroker | Capacite seu neg\xf3cio imobili\xe1rio"}),(0,o.jsx)("meta",{name:"name",content:t||"IPANEMA eBroker | Capacite seu neg\xf3cio imobili\xe1rio"}),(0,o.jsx)("meta",{name:"description",content:a||"Desbloqueie o seu potencial imobili\xe1rio com o Ipanema eBroker - a solu\xe7\xe3o definitiva para o seu neg\xf3cio. Simplifique as opera\xe7\xf5es, aumente a efici\xeancia e tenha sucesso com estilo!"}),(0,o.jsx)("meta",{name:"keywords",content:n||"Unique Properties Search,Tailored Real Estate Experiences,Exclusive Property Deals,Personalised Realty Services,Seamless Property Transactions,Prime Residential Properties,Bespoke Property Search,Exceptional Real Estate Guidance,,Premium Housing Options,Innovative Property Solutions"}),(0,o.jsx)("meta",{name:"image",content:r||null}),(0,o.jsx)("meta",{property:"og:title",content:t||"IPANEMA eBroker | Capacite seu neg\xf3cio imobili\xe1rio"}),(0,o.jsx)("meta",{property:"og:description",content:a||"Desbloqueie o seu potencial imobili\xe1rio com o Ipanema eBroker - a solu\xe7\xe3o definitiva para o seu neg\xf3cio. Simplifique as opera\xe7\xf5es, aumente a efici\xeancia e tenha sucesso com estilo!"}),(0,o.jsx)("meta",{property:"og:image",content:r||null}),(0,o.jsx)("meta",{property:"og:image:type",content:"image/jpg"}),(0,o.jsx)("meta",{property:"og:image:width",content:"1080"}),(0,o.jsx)("meta",{property:"og:image:height",content:"608"}),(0,o.jsx)("meta",{property:"og:url",content:s||"EBROKER"}),(0,o.jsx)("meta",{property:"og:type",content:"website"}),(0,o.jsx)("meta",{name:"twitter:title",content:t||"IPANEMA eBroker | Capacite seu neg\xf3cio imobili\xe1rio"}),(0,o.jsx)("meta",{name:"twitter:description",content:a||"Desbloqueie o seu potencial imobili\xe1rio com o Ipanema eBroker - a solu\xe7\xe3o definitiva para o seu neg\xf3cio. Simplifique as opera\xe7\xf5es, aumente a efici\xeancia e tenha sucesso com estilo!"}),(0,o.jsx)("meta",{name:"twitter:image",content:r||null}),(0,o.jsx)("meta",{name:"twitter:card",content:"summary_large_image"}),(0,o.jsx)("link",{rel:"canonical",href:"".concat("https://webroker.wbservicos.com.br")}),(0,o.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"}),(0,o.jsx)("meta",{name:"robots",content:"index, follow,max-snippet:-1,max-video-preview:-1,max-image-preview:large"})]})};t.Z=r},51183:function(e,t,a){a.d(t,{$z:function(){return u},A2:function(){return b},BP:function(){return w},CV:function(){return A},L:function(){return k},LU:function(){return m},MV:function(){return T},NJ:function(){return g},PQ:function(){return I},Q3:function(){return B},RO:function(){return s},Se:function(){return j},TY:function(){return r},Zy:function(){return q},bM:function(){return E},cZ:function(){return x},dG:function(){return y},gC:function(){return H},gL:function(){return f},gj:function(){return R},gq:function(){return v},lb:function(){return P},li:function(){return c},nZ:function(){return N},p4:function(){return _},pw:function(){return p},sR:function(){return d},v7:function(){return C},vq:function(){return l},wN:function(){return h},zK:function(){return S}});var o=a(49824),n=a(41240),i=a(2711);let r=e=>{let{userid:t="",name:a="",email:r="",mobile:s="",type:c="",address:l="",firebase_id:p="",logintype:u="",profile:d="",latitude:h="",longitude:m="",about_me:f="",facebook_id:g="",twiiter_id:y="",instagram_id:x="",pintrest_id:H="",fcm_id:T="",notification:j="",city:v="",state:b="",country:w="",onSuccess:E=()=>{},onError:k=()=>{},onStart:P=()=>{}}=e;n.h.dispatch((0,i.pH)({...(0,o.LL)(t,a,r,s,c,l,p,u,d,h,m,f,g,y,x,H,T,j,v,b,w),displayToast:!1,onStart:P,onSuccess:E,onError:k}))},s=e=>{let{promoted:t="",top_rated:a="",id:r="",category_id:s="",most_liked:c="",city:l="",get_simiilar:p="",offset:u="",limit:d="",current_user:h="",property_type:m="",max_price:f="",min_price:g="",posted_since:y="",state:x="",country:H="",search:T="",userid:j="",users_promoted:v="",slug_id:b="",onSuccess:w=()=>{},onError:E=()=>{},onStart:k=()=>{}}=e;n.h.dispatch((0,i.pH)({...(0,o.uC)(t,a,r,s,c,l,p,u,d,h,m,f,g,y,x,H,T,j,v,b),displayToast:!1,onStart:k,onSuccess:w,onError:E}))},c=(e,t,a,r,s,c,l)=>{n.h.dispatch((0,i.pH)({...(0,o.wD)(e,t,a,r),displayToast:!1,onStart:l,onSuccess:s,onError:c}))},l=(e,t,a)=>{n.h.dispatch((0,i.pH)({...(0,o.dB)(),displayToast:!1,onStart:a,onSuccess:e,onError:t}))},p=(e,t,a,r,s)=>{n.h.dispatch((0,i.pH)({...(0,o.IR)(e,t),displayToast:!1,onStart:s,onSuccess:a,onError:r}))},u=(e,t,a,r,s,c,l,p)=>{n.h.dispatch((0,i.pH)({...(0,o.Ub)(e,t,a,r,s),displayToast:!1,onStart:p,onSuccess:c,onError:l}))},d=(e,t,a,r,s)=>{n.h.dispatch((0,i.pH)({...(0,o.YE)(e,t),displayToast:!1,onStart:s,onSuccess:a,onError:r}))},h=(e,t,a)=>{n.h.dispatch((0,i.pH)({...(0,o.EV)(),displayToast:!1,onStart:a,onSuccess:e,onError:t}))},m=(e,t,a)=>{n.h.dispatch((0,i.pH)({...(0,o.Rs)(),displayToast:!1,onStart:a,onSuccess:e,onError:t}))},f=(e,t,a,r,s,c,l,p,u,d,h,m,f,g)=>{n.h.dispatch((0,i.pH)({...(0,o.Gl)(e,t,a,r,s,c,l,p,u,d,h),displayToast:!1,onStart:g,onSuccess:m,onError:f}))},g=(e,t,a,r)=>{n.h.dispatch((0,i.pH)({...(0,o.B1)(e),displayToast:!1,onStart:r,onSuccess:t,onError:a}))},y=(e,t,a)=>{n.h.dispatch((0,i.pH)({...(0,o.hd)(),displayToast:!1,onStart:a,onSuccess:e,onError:t}))},x=(e,t,a,r,s,c,l,p,u,d,h,m,f,g,y,x,H,T,j,v,b,w,E,k,P,_,S)=>{n.h.dispatch((0,i.pH)({...(0,o.wO)(e,t,a,r,s,c,l,p,u,d,h,m,f,g,y,x,H,T,j,v,b,w,E,k),displayToast:!1,onStart:S,onSuccess:P,onError:_}))},H=(e,t,a,r)=>{n.h.dispatch((0,i.pH)({...(0,o.Qc)(e),displayToast:!1,onStart:r,onSuccess:t,onError:a}))},T=(e,t,a,r,s)=>{n.h.dispatch((0,i.pH)({...(0,o.Gn)(e,t),displayToast:!1,onStart:s,onSuccess:a,onError:r}))},j=(e,t,a,r,s,c,l,p,u,d,h,m,f,g,y,x,H,T,j,v,b,w,E,k,P,_,S,A,B)=>{n.h.dispatch((0,i.pH)({...(0,o.xV)(e,t,a,r,s,c,l,p,u,d,h,m,f,g,y,x,H,T,j,v,b,w,E,k,P,_),displayToast:!1,onStart:B,onSuccess:S,onError:A}))},v=(e,t,a,r)=>{n.h.dispatch((0,i.pH)({...(0,o.E2)(e),displayToast:!1,onStart:r,onSuccess:t,onError:a}))},b=(e,t,a,r,s,c,l)=>{n.h.dispatch((0,i.pH)({...(0,o.Jq)(e,t,a,r),displayToast:!1,onStart:l,onSuccess:s,onError:c}))},w=(e,t,a,r,s)=>{n.h.dispatch((0,i.pH)({...(0,o.kd)(e,t),displayToast:!1,onStart:s,onSuccess:a,onError:r}))},E=(e,t,a,r,s,c)=>{n.h.dispatch((0,i.pH)({...(0,o.vK)(e,t,a),displayToast:!1,onStart:c,onSuccess:r,onError:s}))},k=(e,t,a,r)=>{n.h.dispatch((0,i.pH)({...(0,o.DS)(e),displayToast:!1,onStart:r,onSuccess:t,onError:a}))},P=(e,t,a)=>{n.h.dispatch((0,i.pH)({...(0,o.Ag)(),displayToast:!1,onStart:a,onSuccess:e,onError:t}))},_=(e,t,a,r,s,c,l)=>{n.h.dispatch((0,i.pH)({...(0,o.b6)(e,t,a,r),displayToast:!1,onStart:l,onSuccess:s,onError:c}))},S=(e,t,a,r,s,c,l,p,u)=>{n.h.dispatch((0,i.pH)({...(0,o.bG)(e,t,a,r,s,c),displayToast:!1,onStart:u,onSuccess:l,onError:p}))},A=(e,t,a,r,s,c)=>{n.h.dispatch((0,i.pH)({...(0,o.K4)(e,t,a),displayToast:!1,onStart:c,onSuccess:r,onError:s}))},B=(e,t,a,r)=>{n.h.dispatch((0,i.pH)({...(0,o.h8)(e),displayToast:!1,onStart:r,onSuccess:t,onError:a}))},C=(e,t,a)=>{n.h.dispatch((0,i.pH)({...(0,o.HH)(),displayToast:!1,onStart:a,onSuccess:e,onError:t}))},q=e=>{let{reason_id:t="",property_id:a="",other_message:r="",onSuccess:s=()=>{},onError:c=()=>{},onStart:l=()=>{}}=e;n.h.dispatch((0,i.pH)({...(0,o.cq)(t,a,r),displayToast:!1,onStart:l,onSuccess:s,onError:c}))},N=e=>{let{city:t="",state:a="",type:r="",onSuccess:s=()=>{},onError:c=()=>{},onStart:l=()=>{}}=e;n.h.dispatch((0,i.pH)({...(0,o.QQ)(t,a,r),displayToast:!1,onStart:l,onSuccess:s,onError:c}))},R=e=>{let{slug_id:t="",onSuccess:a=()=>{},onError:r=()=>{},onStart:s=()=>{}}=e;n.h.dispatch((0,i.pH)({...(0,o.DV)(t),displayToast:!1,onStart:s,onSuccess:a,onError:r}))},I=e=>{let{property_id:t="",status:a="",onSuccess:r=()=>{},onError:s=()=>{},onStart:c=()=>{}}=e;n.h.dispatch((0,i.pH)({...(0,o.Bh)(t,a),displayToast:!1,onStart:c,onSuccess:r,onError:s}))}}}]);