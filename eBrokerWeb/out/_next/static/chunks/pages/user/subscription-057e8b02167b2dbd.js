(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[812],{10123:function(e,s,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/user/subscription",function(){return i(34797)}])},34797:function(e,s,i){"use strict";i.r(s),i.d(s,{default:function(){return y}});var a=i(85893),t=i(67294),n=i(38703),r=function(e){let{usedLimit:s,totalLimit:i}=e;return(0,a.jsxs)("div",{style:{position:"relative",display:"inline-flex"},children:[(0,a.jsx)(n.Z,{id:"progress_bar",type:"circle",percent:s/i*100,format:()=>null,strokeWidth:10}),(0,a.jsx)("div",{style:{position:"absolute",display:"flex",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",top:0,left:0},children:(0,a.jsx)("span",{className:"progress_bar_count",children:"".concat(s," / ").concat(i)})})]})},c=i(24617),o=i(9473),l=i(82267),d=i(51183),p=i(24404),u=i(25789),h=i(5152),m=i.n(h),x=i(11163),v=i(86501);let _=m()(()=>Promise.all([i.e(5937),i.e(8166),i.e(5675),i.e(913),i.e(631),i.e(1664),i.e(6284),i.e(583),i.e(9026),i.e(6448)]).then(i.bind(i,9026)),{ssr:!1}),g=()=>{var e,s,i,h,m,g,f,j,y,b,N;let[k,T]=(0,t.useState)(),H=(0,o.v9)(l.vV),w=null==H?void 0:null===(e=H.package)||void 0===e?void 0:e.user_purchased_package,I=(0,x.useRouter)(),E=H&&H.currency_symbol;if(!w||0===w.length)return console.error("currentUserPackage is undefined or empty"),null;(0,t.useEffect)(()=>{w&&0!==w.length||(v.ZP.error("Opps! No P{ackage Found!!!"),I.push("/"))},[w]);let P=w[0].package.id,S=w[0].package.property_limit,A=null===(s=w[0])||void 0===s?void 0:s.used_limit_for_property,B=w[0].package.property_limit,C=null===(i=w[0])||void 0===i?void 0:i.used_limit_for_advertisement,D=(0,o.v9)(u.iT);function q(e){if(null===e)return"Lifetime";let s=new Date(e),i=s.toLocaleDateString("en-US",{weekday:"long"}),a=s.getDate(),t=["January","February","March","April","May","June","July","August","September","October","November","December"][s.getMonth()],n=s.getFullYear();return"".concat(i,", ").concat(a," ").concat(t,", ").concat(n)}(0,t.useEffect)(()=>{},[D]),(0,t.useEffect)(()=>{(0,d.gC)(P,e=>{T(e&&e)},e=>{console.log("API Error:",e)})},[P]);let L=q(w&&(null===(h=w[0])||void 0===h?void 0:h.start_date)),R=q(w&&(null===(m=w[0])||void 0===m?void 0:m.end_date));return(0,a.jsx)(_,{children:(0,a.jsxs)("div",{className:"container",children:[(0,a.jsx)("div",{className:"dashboard_titles",children:(0,a.jsx)("h3",{children:(0,p.Iu)("mySub")})}),(0,a.jsx)("div",{className:"row",children:(0,a.jsx)("div",{className:"col-sm-12 col-md-6",id:"subscription_card_col",children:(0,a.jsxs)("div",{className:"card",id:"subscription_card",children:[(0,a.jsxs)("div",{className:"card-header",id:"subscription_card_header",children:[(0,a.jsx)("span",{className:"subscription_current_package",children:(0,p.Iu)("currentPack")}),(0,a.jsx)("span",{className:"subscription_current_package_type",children:w[0].package.name})]}),(0,a.jsxs)("div",{className:"card-body",children:[(0,a.jsxs)("div",{id:"subscription_validity",children:[(0,a.jsxs)("div",{className:"package_validity",children:[(0,a.jsx)("span",{className:"package_details_title",children:(0,p.Iu)("packVali")}),w&&(null===(g=w[0])||void 0===g?void 0:g.end_date)!==null?(0,a.jsxs)("span",{className:"package_details_value",children:[w[0].package.duration,""," ",(0,p.Iu)("days")]}):(0,a.jsxs)("span",{className:"package_details_value",children:[R," "]})]}),(0,a.jsxs)("div",{className:"package_price",children:[(0,a.jsx)("span",{className:"package_details_title",children:(0,p.Iu)("price")}),(0,a.jsx)("span",{className:"package_details_value",children:w&&0!==w[0].package.price?E+w[0].package.price:"Free"})]})]}),(0,a.jsx)("hr",{}),(0,a.jsx)("div",{id:"subscription_details",children:(0,a.jsxs)("div",{className:"row",id:"subscription_card_row",children:[(0,a.jsx)("div",{className:"col-sm-12 col-md-6 col-lg-4",id:"subscription_progress_cards",children:(0,a.jsxs)("div",{className:"property_count_card",children:[(0,a.jsx)("span",{children:(0,p.Iu)("property")}),(0,a.jsx)("div",{className:"progress_bar_div",children:(0,a.jsx)(r,{usedLimit:A,totalLimit:S})})]})}),(0,a.jsx)("div",{className:"col-sm-12 col-md-6 col-lg-4",id:"subscription_progress_cards",children:(0,a.jsxs)("div",{className:"advertisement_count_card",children:[(0,a.jsx)("span",{children:(0,p.Iu)("advertisement")}),(0,a.jsx)("div",{className:"progress_bar_div",children:(0,a.jsx)(r,{usedLimit:C,totalLimit:B})})]})}),(0,a.jsx)("div",{className:"col-sm-12 col-md-6 col-lg-4",id:"subscription_progress_cards",children:(0,a.jsxs)("div",{className:"remaining_count_card",children:[(0,a.jsx)("span",{children:(0,p.Iu)("remaining")}),(0,a.jsx)("div",{className:"progress_bar_div",children:(0,a.jsxs)("div",{style:{position:"relative",display:"inline-flex"},children:[(0,a.jsx)(n.Z,{id:"progress_bar",type:"circle",percent:w&&(null===(f=w[0])||void 0===f?void 0:f.remaining_days)?(null===(j=w[0])||void 0===j?void 0:j.remaining_days)/w[0].package.duration*100:100,format:()=>null,strokeWidth:10}),(0,a.jsx)("div",{style:{position:"absolute",display:"flex",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",top:0,left:0},children:w&&(null===(y=w[0])||void 0===y?void 0:y.end_date)!==null?(0,a.jsx)("span",{className:"progress_bar_count",children:"".concat(w&&(null===(b=w[0])||void 0===b?void 0:b.remaining_days)," Days")}):(0,a.jsx)("span",{className:"progress_bar_count",children:(0,p.Iu)("infinity")})})]})})]})})]})}),(0,a.jsxs)("div",{id:"subscription_duration",children:[(0,a.jsxs)("div",{className:"started_on",children:[(0,a.jsx)("div",{className:"icon_div",children:(0,a.jsx)(c.Z,{className:"cal_icon"})}),(0,a.jsxs)("div",{className:"dates",children:[(0,a.jsx)("span",{className:"dates_title",children:(0,p.Iu)("startOn")}),(0,a.jsx)("span",{className:"dates_value",children:L})]})]}),w&&(null===(N=w[0])||void 0===N?void 0:N.end_date)!==null?(0,a.jsxs)("div",{className:"ends_on",children:[(0,a.jsxs)("div",{className:"dates",children:[(0,a.jsx)("span",{className:"dates_title",children:(0,p.Iu)("endsOn")}),(0,a.jsx)("span",{className:"dates_value",children:R})]}),(0,a.jsx)("div",{className:"icon_div",children:(0,a.jsx)(c.Z,{className:"cal_icon"})})]}):null]})]})]})})})]})})};var f=i(34774);let j=()=>(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(f.Z,{title:"",description:"",keywords:"",ogImage:"",pathName:""}),(0,a.jsx)(g,{})]});var y=j},34774:function(e,s,i){"use strict";var a=i(85893),t=i(9008),n=i.n(t);let r=e=>{let{title:s,description:i,keywords:t,ogImage:r,pathName:c}=e;return(0,a.jsxs)(n(),{children:[(0,a.jsx)("title",{children:s||"IPANEMA eBroker | Capacite seu neg\xf3cio imobili\xe1rio"}),(0,a.jsx)("meta",{name:"name",content:s||"IPANEMA eBroker | Capacite seu neg\xf3cio imobili\xe1rio"}),(0,a.jsx)("meta",{name:"description",content:i||"Desbloqueie o seu potencial imobili\xe1rio com o Ipanema eBroker - a solu\xe7\xe3o definitiva para o seu neg\xf3cio. Simplifique as opera\xe7\xf5es, aumente a efici\xeancia e tenha sucesso com estilo!"}),(0,a.jsx)("meta",{name:"keywords",content:t||"Unique Properties Search,Tailored Real Estate Experiences,Exclusive Property Deals,Personalised Realty Services,Seamless Property Transactions,Prime Residential Properties,Bespoke Property Search,Exceptional Real Estate Guidance,,Premium Housing Options,Innovative Property Solutions"}),(0,a.jsx)("meta",{name:"image",content:r||null}),(0,a.jsx)("meta",{property:"og:title",content:s||"IPANEMA eBroker | Capacite seu neg\xf3cio imobili\xe1rio"}),(0,a.jsx)("meta",{property:"og:description",content:i||"Desbloqueie o seu potencial imobili\xe1rio com o Ipanema eBroker - a solu\xe7\xe3o definitiva para o seu neg\xf3cio. Simplifique as opera\xe7\xf5es, aumente a efici\xeancia e tenha sucesso com estilo!"}),(0,a.jsx)("meta",{property:"og:image",content:r||null}),(0,a.jsx)("meta",{property:"og:image:type",content:"image/jpg"}),(0,a.jsx)("meta",{property:"og:image:width",content:"1080"}),(0,a.jsx)("meta",{property:"og:image:height",content:"608"}),(0,a.jsx)("meta",{property:"og:url",content:c||"EBROKER"}),(0,a.jsx)("meta",{property:"og:type",content:"website"}),(0,a.jsx)("meta",{name:"twitter:title",content:s||"IPANEMA eBroker | Capacite seu neg\xf3cio imobili\xe1rio"}),(0,a.jsx)("meta",{name:"twitter:description",content:i||"Desbloqueie o seu potencial imobili\xe1rio com o Ipanema eBroker - a solu\xe7\xe3o definitiva para o seu neg\xf3cio. Simplifique as opera\xe7\xf5es, aumente a efici\xeancia e tenha sucesso com estilo!"}),(0,a.jsx)("meta",{name:"twitter:image",content:r||null}),(0,a.jsx)("meta",{name:"twitter:card",content:"summary_large_image"}),(0,a.jsx)("link",{rel:"canonical",href:"".concat("https://webroker.wbservicos.com.br")}),(0,a.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0"}),(0,a.jsx)("meta",{name:"robots",content:"index, follow,max-snippet:-1,max-video-preview:-1,max-image-preview:large"})]})};s.Z=r},51183:function(e,s,i){"use strict";i.d(s,{$z:function(){return p},A2:function(){return N},BP:function(){return k},CV:function(){return P},L:function(){return H},LU:function(){return m},MV:function(){return j},NJ:function(){return v},PQ:function(){return q},Q3:function(){return S},RO:function(){return c},Se:function(){return y},TY:function(){return r},Zy:function(){return B},bM:function(){return T},cZ:function(){return g},dG:function(){return _},gC:function(){return f},gL:function(){return x},gj:function(){return D},gq:function(){return b},lb:function(){return w},li:function(){return o},nZ:function(){return C},p4:function(){return I},pw:function(){return d},sR:function(){return u},v7:function(){return A},vq:function(){return l},wN:function(){return h},zK:function(){return E}});var a=i(49824),t=i(41240),n=i(2711);let r=e=>{let{userid:s="",name:i="",email:r="",mobile:c="",type:o="",address:l="",firebase_id:d="",logintype:p="",profile:u="",latitude:h="",longitude:m="",about_me:x="",facebook_id:v="",twiiter_id:_="",instagram_id:g="",pintrest_id:f="",fcm_id:j="",notification:y="",city:b="",state:N="",country:k="",onSuccess:T=()=>{},onError:H=()=>{},onStart:w=()=>{}}=e;t.h.dispatch((0,n.pH)({...(0,a.LL)(s,i,r,c,o,l,d,p,u,h,m,x,v,_,g,f,j,y,b,N,k),displayToast:!1,onStart:w,onSuccess:T,onError:H}))},c=e=>{let{promoted:s="",top_rated:i="",id:r="",category_id:c="",most_liked:o="",city:l="",get_simiilar:d="",offset:p="",limit:u="",current_user:h="",property_type:m="",max_price:x="",min_price:v="",posted_since:_="",state:g="",country:f="",search:j="",userid:y="",users_promoted:b="",slug_id:N="",onSuccess:k=()=>{},onError:T=()=>{},onStart:H=()=>{}}=e;t.h.dispatch((0,n.pH)({...(0,a.uC)(s,i,r,c,o,l,d,p,u,h,m,x,v,_,g,f,j,y,b,N),displayToast:!1,onStart:H,onSuccess:k,onError:T}))},o=(e,s,i,r,c,o,l)=>{t.h.dispatch((0,n.pH)({...(0,a.wD)(e,s,i,r),displayToast:!1,onStart:l,onSuccess:c,onError:o}))},l=(e,s,i)=>{t.h.dispatch((0,n.pH)({...(0,a.dB)(),displayToast:!1,onStart:i,onSuccess:e,onError:s}))},d=(e,s,i,r,c)=>{t.h.dispatch((0,n.pH)({...(0,a.IR)(e,s),displayToast:!1,onStart:c,onSuccess:i,onError:r}))},p=(e,s,i,r,c,o,l,d)=>{t.h.dispatch((0,n.pH)({...(0,a.Ub)(e,s,i,r,c),displayToast:!1,onStart:d,onSuccess:o,onError:l}))},u=(e,s,i,r,c)=>{t.h.dispatch((0,n.pH)({...(0,a.YE)(e,s),displayToast:!1,onStart:c,onSuccess:i,onError:r}))},h=(e,s,i)=>{t.h.dispatch((0,n.pH)({...(0,a.EV)(),displayToast:!1,onStart:i,onSuccess:e,onError:s}))},m=(e,s,i)=>{t.h.dispatch((0,n.pH)({...(0,a.Rs)(),displayToast:!1,onStart:i,onSuccess:e,onError:s}))},x=(e,s,i,r,c,o,l,d,p,u,h,m,x,v)=>{t.h.dispatch((0,n.pH)({...(0,a.Gl)(e,s,i,r,c,o,l,d,p,u,h),displayToast:!1,onStart:v,onSuccess:m,onError:x}))},v=(e,s,i,r)=>{t.h.dispatch((0,n.pH)({...(0,a.B1)(e),displayToast:!1,onStart:r,onSuccess:s,onError:i}))},_=(e,s,i)=>{t.h.dispatch((0,n.pH)({...(0,a.hd)(),displayToast:!1,onStart:i,onSuccess:e,onError:s}))},g=(e,s,i,r,c,o,l,d,p,u,h,m,x,v,_,g,f,j,y,b,N,k,T,H,w,I,E)=>{t.h.dispatch((0,n.pH)({...(0,a.wO)(e,s,i,r,c,o,l,d,p,u,h,m,x,v,_,g,f,j,y,b,N,k,T,H),displayToast:!1,onStart:E,onSuccess:w,onError:I}))},f=(e,s,i,r)=>{t.h.dispatch((0,n.pH)({...(0,a.Qc)(e),displayToast:!1,onStart:r,onSuccess:s,onError:i}))},j=(e,s,i,r,c)=>{t.h.dispatch((0,n.pH)({...(0,a.Gn)(e,s),displayToast:!1,onStart:c,onSuccess:i,onError:r}))},y=(e,s,i,r,c,o,l,d,p,u,h,m,x,v,_,g,f,j,y,b,N,k,T,H,w,I,E,P,S)=>{t.h.dispatch((0,n.pH)({...(0,a.xV)(e,s,i,r,c,o,l,d,p,u,h,m,x,v,_,g,f,j,y,b,N,k,T,H,w,I),displayToast:!1,onStart:S,onSuccess:E,onError:P}))},b=(e,s,i,r)=>{t.h.dispatch((0,n.pH)({...(0,a.E2)(e),displayToast:!1,onStart:r,onSuccess:s,onError:i}))},N=(e,s,i,r,c,o,l)=>{t.h.dispatch((0,n.pH)({...(0,a.Jq)(e,s,i,r),displayToast:!1,onStart:l,onSuccess:c,onError:o}))},k=(e,s,i,r,c)=>{t.h.dispatch((0,n.pH)({...(0,a.kd)(e,s),displayToast:!1,onStart:c,onSuccess:i,onError:r}))},T=(e,s,i,r,c,o)=>{t.h.dispatch((0,n.pH)({...(0,a.vK)(e,s,i),displayToast:!1,onStart:o,onSuccess:r,onError:c}))},H=(e,s,i,r)=>{t.h.dispatch((0,n.pH)({...(0,a.DS)(e),displayToast:!1,onStart:r,onSuccess:s,onError:i}))},w=(e,s,i)=>{t.h.dispatch((0,n.pH)({...(0,a.Ag)(),displayToast:!1,onStart:i,onSuccess:e,onError:s}))},I=(e,s,i,r,c,o,l)=>{t.h.dispatch((0,n.pH)({...(0,a.b6)(e,s,i,r),displayToast:!1,onStart:l,onSuccess:c,onError:o}))},E=(e,s,i,r,c,o,l,d,p)=>{t.h.dispatch((0,n.pH)({...(0,a.bG)(e,s,i,r,c,o),displayToast:!1,onStart:p,onSuccess:l,onError:d}))},P=(e,s,i,r,c,o)=>{t.h.dispatch((0,n.pH)({...(0,a.K4)(e,s,i),displayToast:!1,onStart:o,onSuccess:r,onError:c}))},S=(e,s,i,r)=>{t.h.dispatch((0,n.pH)({...(0,a.h8)(e),displayToast:!1,onStart:r,onSuccess:s,onError:i}))},A=(e,s,i)=>{t.h.dispatch((0,n.pH)({...(0,a.HH)(),displayToast:!1,onStart:i,onSuccess:e,onError:s}))},B=e=>{let{reason_id:s="",property_id:i="",other_message:r="",onSuccess:c=()=>{},onError:o=()=>{},onStart:l=()=>{}}=e;t.h.dispatch((0,n.pH)({...(0,a.cq)(s,i,r),displayToast:!1,onStart:l,onSuccess:c,onError:o}))},C=e=>{let{city:s="",state:i="",type:r="",onSuccess:c=()=>{},onError:o=()=>{},onStart:l=()=>{}}=e;t.h.dispatch((0,n.pH)({...(0,a.QQ)(s,i,r),displayToast:!1,onStart:l,onSuccess:c,onError:o}))},D=e=>{let{slug_id:s="",onSuccess:i=()=>{},onError:r=()=>{},onStart:c=()=>{}}=e;t.h.dispatch((0,n.pH)({...(0,a.DV)(s),displayToast:!1,onStart:c,onSuccess:i,onError:r}))},q=e=>{let{property_id:s="",status:i="",onSuccess:r=()=>{},onError:c=()=>{},onStart:o=()=>{}}=e;t.h.dispatch((0,n.pH)({...(0,a.Bh)(s,i),displayToast:!1,onStart:o,onSuccess:r,onError:c}))}}},function(e){e.O(0,[3789,5529,8851,8158,30,9774,2888,179],function(){return e(e.s=10123)}),_N_E=e.O()}]);