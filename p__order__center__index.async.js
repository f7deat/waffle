"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4099],{67148:function(ee,w,r){r.r(w),r.d(w,{default:function(){return oe}});var a=r(5574),p=r.n(a),E=r(43285),$=r(5251),x=r(1413),S=r(67294),m={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M820 436h-40c-4.4 0-8 3.6-8 8v40c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-40c0-4.4-3.6-8-8-8zm32-104H732V120c0-4.4-3.6-8-8-8H300c-4.4 0-8 3.6-8 8v212H172c-44.2 0-80 35.8-80 80v328c0 17.7 14.3 32 32 32h168v132c0 4.4 3.6 8 8 8h424c4.4 0 8-3.6 8-8V772h168c17.7 0 32-14.3 32-32V412c0-44.2-35.8-80-80-80zM360 180h304v152H360V180zm304 664H360V568h304v276zm200-140H732V500H292v204H160V412c0-6.6 5.4-12 12-12h680c6.6 0 12 5.4 12 12v292z"}}]},name:"printer",theme:"outlined"},R=m,P=r(91146),Q=function(L,_){return S.createElement(P.Z,(0,x.Z)((0,x.Z)({},L),{},{ref:_,icon:R}))},N=S.forwardRef(Q),H=N,B=r(63386),f=r(93410),j=r(35312),O=r(14726),d=r(71230),te=r(15746),T=r(26412),ae=r(67839),u=r(85893),J=function(){var L=(0,j.useParams)(),_=L.id,ne=(0,S.useState)(),g=p()(ne,2),c=g[0],re=g[1];return(0,S.useEffect)(function(){(0,E.fn)(_).then(function(U){re(U)})},[]),(0,u.jsxs)(B._z,{title:c==null?void 0:c.number,extra:(0,u.jsx)(O.ZP,{icon:(0,u.jsx)(H,{}),children:"Print"}),children:[(0,u.jsxs)(d.Z,{gutter:16,className:"mb-4",children:[(0,u.jsx)(te.Z,{md:12,children:(0,u.jsx)(f.Z,{children:(0,u.jsxs)(T.Z,{title:"Customer Info",children:[(0,u.jsx)(T.Z.Item,{label:"Name",children:c==null?void 0:c.customerName}),(0,u.jsx)(T.Z.Item,{label:"Note",children:c==null?void 0:c.note})]})})}),(0,u.jsx)(te.Z,{md:12,children:(0,u.jsx)(f.Z,{children:(0,u.jsxs)(T.Z,{title:"Order Info",children:[(0,u.jsx)(T.Z.Item,{label:"Date",children:(0,$.p6)(c==null?void 0:c.createdDate)}),(0,u.jsx)(T.Z.Item,{label:"Note",children:c==null?void 0:c.note})]})})})]}),(0,u.jsx)(ae.Z,{dataSource:c==null?void 0:c.orderDetails,rowKey:"id",columns:[{title:"Product name",dataIndex:"productName",render:function(q,z){return(0,u.jsx)(j.Link,{to:"/catalog/".concat(z.productId),children:q})}},{title:"Price",dataIndex:"price"},{title:"Quantity",dataIndex:"quantity"},{title:"Th\xE0nh ti\u1EC1n",render:function(q,z){return z.price*z.quantity}}]})]})},oe=J},43285:function(ee,w,r){r.d(w,{FG:function(){return H},XB:function(){return S},fn:function(){return R},wH:function(){return Q}});var a=r(15009),p=r.n(a),E=r(99289),$=r.n(E),x=r(35312);function S(f){return m.apply(this,arguments)}function m(){return m=$()(p()().mark(function f(j){return p()().wrap(function(d){for(;;)switch(d.prev=d.next){case 0:return d.abrupt("return",(0,x.request)("order/list",{params:j}));case 1:case"end":return d.stop()}},f)})),m.apply(this,arguments)}function R(f){return P.apply(this,arguments)}function P(){return P=$()(p()().mark(function f(j){return p()().wrap(function(d){for(;;)switch(d.prev=d.next){case 0:return d.abrupt("return",(0,x.request)("order/".concat(j)));case 1:case"end":return d.stop()}},f)})),P.apply(this,arguments)}function Q(f){return N.apply(this,arguments)}function N(){return N=$()(p()().mark(function f(j){return p()().wrap(function(d){for(;;)switch(d.prev=d.next){case 0:return d.abrupt("return",(0,x.request)("order/delete/".concat(j),{method:"POST"}));case 1:case"end":return d.stop()}},f)})),N.apply(this,arguments)}function H(){return B.apply(this,arguments)}function B(){return B=$()(p()().mark(function f(){return p()().wrap(function(O){for(;;)switch(O.prev=O.next){case 0:return O.abrupt("return",(0,x.request)("order/count"));case 1:case"end":return O.stop()}},f)})),B.apply(this,arguments)}},5251:function(ee,w,r){r.d(w,{Er:function(){return $},p6:function(){return x}});var a=r(27484),p=r.n(a);function E(m){return m.trim()}function $(m){return new URL(m||"",localStorage.getItem("wf_URL")||"").href}function x(m){return m?p()(m).format("DD/MM/YYYY hh:mm:ss"):"-"}var S=function(){var R=arguments.length>0&&arguments[0]!==void 0?arguments[0]:100;return new Promise(function(P){setTimeout(function(){P(!0)},R)})}},26412:function(ee,w,r){r.d(w,{Z:function(){return me}});var a=r(67294),p=r(93967),E=r.n(p),$=r(74443),x=r(53124),S=r(98675),m=r(25378),P={xxl:3,xl:3,lg:3,md:3,sm:2,xs:1},N=a.createContext({}),H=r(50344),B=function(e,t){var o={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(o[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var l=0,n=Object.getOwnPropertySymbols(e);l<n.length;l++)t.indexOf(n[l])<0&&Object.prototype.propertyIsEnumerable.call(e,n[l])&&(o[n[l]]=e[n[l]]);return o};const f=e=>(0,H.Z)(e).map(t=>Object.assign(Object.assign({},t==null?void 0:t.props),{key:t.key}));function j(e,t,o){const n=a.useMemo(()=>t||f(o),[t,o]);return a.useMemo(()=>n.map(i=>{var{span:s}=i,b=B(i,["span"]);return Object.assign(Object.assign({},b),{span:typeof s=="number"?s:(0,$.m9)(e,s)})}),[n,e])}function O(e,t,o){let n=e,l=!1;return(o===void 0||o>t)&&(n=Object.assign(Object.assign({},e),{span:t}),l=o!==void 0),[n,l]}function d(e,t){const o=[];let n=[],l=t,i=!1;return e.filter(s=>s).forEach((s,b)=>{const D=s==null?void 0:s.span,h=D||1;if(b===e.length-1){const[v,C]=O(s,l,D);i=i||C,n.push(v),o.push(n);return}if(h<l)l-=h,n.push(s);else{const[v,C]=O(s,l,h);i=i||C,n.push(v),o.push(n),l=t,n=[]}}),[o,i]}var T=(e,t)=>{const[o,n]=(0,a.useMemo)(()=>d(t,e),[t,e]);return o},u=e=>{let{children:t}=e;return t};function J(e){return e!=null}var W=e=>{const{itemPrefixCls:t,component:o,span:n,className:l,style:i,labelStyle:s,contentStyle:b,bordered:D,label:h,content:v,colon:C,type:Z}=e,I=o;return D?a.createElement(I,{className:E()({[`${t}-item-label`]:Z==="label",[`${t}-item-content`]:Z==="content"},l),style:i,colSpan:n},J(h)&&a.createElement("span",{style:s},h),J(v)&&a.createElement("span",{style:b},v)):a.createElement(I,{className:E()(`${t}-item`,l),style:i,colSpan:n},a.createElement("div",{className:`${t}-item-container`},(h||h===0)&&a.createElement("span",{className:E()(`${t}-item-label`,{[`${t}-item-no-colon`]:!C}),style:s},h),(v||v===0)&&a.createElement("span",{className:E()(`${t}-item-content`),style:b},v)))};function L(e,t,o){let{colon:n,prefixCls:l,bordered:i}=t,{component:s,type:b,showLabel:D,showContent:h,labelStyle:v,contentStyle:C}=o;return e.map((Z,I)=>{let{label:V,children:k,prefixCls:G=l,className:K,style:X,labelStyle:M,contentStyle:y,span:A=1,key:F}=Z;return typeof s=="string"?a.createElement(W,{key:`${b}-${F||I}`,className:K,style:X,labelStyle:Object.assign(Object.assign({},v),M),contentStyle:Object.assign(Object.assign({},C),y),span:A,colon:n,component:s,itemPrefixCls:G,bordered:i,label:D?V:null,content:h?k:null,type:b}):[a.createElement(W,{key:`label-${F||I}`,className:K,style:Object.assign(Object.assign(Object.assign({},v),X),M),span:1,colon:n,component:s[0],itemPrefixCls:G,bordered:i,label:V,type:"label"}),a.createElement(W,{key:`content-${F||I}`,className:K,style:Object.assign(Object.assign(Object.assign({},C),X),y),span:A*2-1,component:s[1],itemPrefixCls:G,bordered:i,content:k,type:"content"})]})}var ne=e=>{const t=a.useContext(N),{prefixCls:o,vertical:n,row:l,index:i,bordered:s}=e;return n?a.createElement(a.Fragment,null,a.createElement("tr",{key:`label-${i}`,className:`${o}-row`},L(l,e,Object.assign({component:"th",type:"label",showLabel:!0},t))),a.createElement("tr",{key:`content-${i}`,className:`${o}-row`},L(l,e,Object.assign({component:"td",type:"content",showContent:!0},t)))):a.createElement("tr",{key:i,className:`${o}-row`},L(l,e,Object.assign({component:s?["th","td"]:"td",type:"item",showLabel:!0,showContent:!0},t)))},g=r(11568),c=r(14747),re=r(83559),U=r(83262);const q=e=>{const{componentCls:t,labelBg:o}=e;return{[`&${t}-bordered`]:{[`> ${t}-view`]:{overflow:"hidden",border:`${(0,g.bf)(e.lineWidth)} ${e.lineType} ${e.colorSplit}`,"> table":{tableLayout:"auto"},[`${t}-row`]:{borderBottom:`${(0,g.bf)(e.lineWidth)} ${e.lineType} ${e.colorSplit}`,"&:last-child":{borderBottom:"none"},[`> ${t}-item-label, > ${t}-item-content`]:{padding:`${(0,g.bf)(e.padding)} ${(0,g.bf)(e.paddingLG)}`,borderInlineEnd:`${(0,g.bf)(e.lineWidth)} ${e.lineType} ${e.colorSplit}`,"&:last-child":{borderInlineEnd:"none"}},[`> ${t}-item-label`]:{color:e.colorTextSecondary,backgroundColor:o,"&::after":{display:"none"}}}},[`&${t}-middle`]:{[`${t}-row`]:{[`> ${t}-item-label, > ${t}-item-content`]:{padding:`${(0,g.bf)(e.paddingSM)} ${(0,g.bf)(e.paddingLG)}`}}},[`&${t}-small`]:{[`${t}-row`]:{[`> ${t}-item-label, > ${t}-item-content`]:{padding:`${(0,g.bf)(e.paddingXS)} ${(0,g.bf)(e.padding)}`}}}}}},z=e=>{const{componentCls:t,extraColor:o,itemPaddingBottom:n,itemPaddingEnd:l,colonMarginRight:i,colonMarginLeft:s,titleMarginBottom:b}=e;return{[t]:Object.assign(Object.assign(Object.assign({},(0,c.Wf)(e)),q(e)),{"&-rtl":{direction:"rtl"},[`${t}-header`]:{display:"flex",alignItems:"center",marginBottom:b},[`${t}-title`]:Object.assign(Object.assign({},c.vS),{flex:"auto",color:e.titleColor,fontWeight:e.fontWeightStrong,fontSize:e.fontSizeLG,lineHeight:e.lineHeightLG}),[`${t}-extra`]:{marginInlineStart:"auto",color:o,fontSize:e.fontSize},[`${t}-view`]:{width:"100%",borderRadius:e.borderRadiusLG,table:{width:"100%",tableLayout:"fixed",borderCollapse:"collapse"}},[`${t}-row`]:{"> th, > td":{paddingBottom:n,paddingInlineEnd:l},"> th:last-child, > td:last-child":{paddingInlineEnd:0},"&:last-child":{borderBottom:"none","> th, > td":{paddingBottom:0}}},[`${t}-item-label`]:{color:e.colorTextTertiary,fontWeight:"normal",fontSize:e.fontSize,lineHeight:e.lineHeight,textAlign:"start","&::after":{content:'":"',position:"relative",top:-.5,marginInline:`${(0,g.bf)(s)} ${(0,g.bf)(i)}`},[`&${t}-item-no-colon::after`]:{content:'""'}},[`${t}-item-no-label`]:{"&::after":{margin:0,content:'""'}},[`${t}-item-content`]:{display:"table-cell",flex:1,color:e.contentColor,fontSize:e.fontSize,lineHeight:e.lineHeight,wordBreak:"break-word",overflowWrap:"break-word"},[`${t}-item`]:{paddingBottom:0,verticalAlign:"top","&-container":{display:"flex",[`${t}-item-label`]:{display:"inline-flex",alignItems:"baseline"},[`${t}-item-content`]:{display:"inline-flex",alignItems:"baseline",minWidth:0}}},"&-middle":{[`${t}-row`]:{"> th, > td":{paddingBottom:e.paddingSM}}},"&-small":{[`${t}-row`]:{"> th, > td":{paddingBottom:e.paddingXS}}}})}},ce=e=>({labelBg:e.colorFillAlter,titleColor:e.colorText,titleMarginBottom:e.fontSizeSM*e.lineHeightSM,itemPaddingBottom:e.padding,itemPaddingEnd:e.padding,colonMarginRight:e.marginXS,colonMarginLeft:e.marginXXS/2,contentColor:e.colorText,extraColor:e.colorText});var de=(0,re.I$)("Descriptions",e=>{const t=(0,U.IX)(e,{});return z(t)},ce),ue=function(e,t){var o={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(o[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var l=0,n=Object.getOwnPropertySymbols(e);l<n.length;l++)t.indexOf(n[l])<0&&Object.prototype.propertyIsEnumerable.call(e,n[l])&&(o[n[l]]=e[n[l]]);return o};const se=e=>{const{prefixCls:t,title:o,extra:n,column:l,colon:i=!0,bordered:s,layout:b,children:D,className:h,rootClassName:v,style:C,size:Z,labelStyle:I,contentStyle:V,items:k}=e,G=ue(e,["prefixCls","title","extra","column","colon","bordered","layout","children","className","rootClassName","style","size","labelStyle","contentStyle","items"]),{getPrefixCls:K,direction:X,descriptions:M}=a.useContext(x.E_),y=K("descriptions",t),A=(0,m.Z)(),F=a.useMemo(()=>{var Y;return typeof l=="number"?l:(Y=(0,$.m9)(A,Object.assign(Object.assign({},P),l)))!==null&&Y!==void 0?Y:3},[A,l]),fe=j(A,k,D),le=(0,S.Z)(Z),pe=T(F,fe),[ge,ve,be]=de(y),he=a.useMemo(()=>({labelStyle:I,contentStyle:V}),[I,V]);return ge(a.createElement(N.Provider,{value:he},a.createElement("div",Object.assign({className:E()(y,M==null?void 0:M.className,{[`${y}-${le}`]:le&&le!=="default",[`${y}-bordered`]:!!s,[`${y}-rtl`]:X==="rtl"},h,v,ve,be),style:Object.assign(Object.assign({},M==null?void 0:M.style),C)},G),(o||n)&&a.createElement("div",{className:`${y}-header`},o&&a.createElement("div",{className:`${y}-title`},o),n&&a.createElement("div",{className:`${y}-extra`},n)),a.createElement("div",{className:`${y}-view`},a.createElement("table",null,a.createElement("tbody",null,pe.map((Y,ie)=>a.createElement(ne,{key:ie,index:ie,colon:i,prefixCls:y,vertical:b==="vertical",bordered:s,row:Y}))))))))};se.Item=u;var me=se}}]);
