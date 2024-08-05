"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4099],{67148:function(H,j,r){r.r(j),r.d(j,{default:function(){return ie}});var l=r(5574),c=r.n(l),S=r(43285),h=r(5251),v=r(1413),d=r(67294),m={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M820 436h-40c-4.4 0-8 3.6-8 8v40c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-40c0-4.4-3.6-8-8-8zm32-104H732V120c0-4.4-3.6-8-8-8H300c-4.4 0-8 3.6-8 8v212H172c-44.2 0-80 35.8-80 80v328c0 17.7 14.3 32 32 32h168v132c0 4.4 3.6 8 8 8h424c4.4 0 8-3.6 8-8V772h168c17.7 0 32-14.3 32-32V412c0-44.2-35.8-80-80-80zM360 180h304v152H360V180zm304 664H360V568h304v276zm200-140H732V500H292v204H160V412c0-6.6 5.4-12 12-12h680c6.6 0 12 5.4 12 12v292z"}}]},name:"printer",theme:"outlined"},C=m,O=r(91146),J=function(R,q){return d.createElement(O.Z,(0,v.Z)((0,v.Z)({},R),{},{ref:q,icon:C}))},T=d.forwardRef(J),U=T,N=r(63386),g=r(93410),I=r(35312),P=r(14726),f=r(71230),te=r(15746),L=r(26412),oe=r(67839),p=r(85893),_=function(){var R=(0,I.useParams)(),q=R.id,ne=(0,d.useState)(),b=c()(ne,2),u=b[0],re=b[1];return(0,d.useEffect)(function(){(0,S.fn)(q).then(function(V){re(V)})},[]),(0,p.jsxs)(N._z,{title:u==null?void 0:u.number,extra:(0,p.jsx)(P.ZP,{icon:(0,p.jsx)(U,{}),children:"Print"}),children:[(0,p.jsxs)(f.Z,{gutter:16,className:"mb-4",children:[(0,p.jsx)(te.Z,{md:12,children:(0,p.jsx)(g.Z,{children:(0,p.jsxs)(L.Z,{title:"Customer Info",children:[(0,p.jsx)(L.Z.Item,{label:"Name",children:u==null?void 0:u.customerName}),(0,p.jsx)(L.Z.Item,{label:"Note",children:u==null?void 0:u.note})]})})}),(0,p.jsx)(te.Z,{md:12,children:(0,p.jsx)(g.Z,{children:(0,p.jsxs)(L.Z,{title:"Order Info",children:[(0,p.jsx)(L.Z.Item,{label:"Date",children:(0,h.p6)(u==null?void 0:u.createdDate)}),(0,p.jsx)(L.Z.Item,{label:"Note",children:u==null?void 0:u.note})]})})})]}),(0,p.jsx)(oe.Z,{dataSource:u==null?void 0:u.orderDetails,rowKey:"id",columns:[{title:"Product name",dataIndex:"productName",render:function(k,A){return(0,p.jsx)(I.Link,{to:"/catalog/".concat(A.productId),children:k})}},{title:"Price",dataIndex:"price"},{title:"Quantity",dataIndex:"quantity"},{title:"Th\xE0nh ti\u1EC1n",render:function(k,A){return A.price*A.quantity}}]})]})},ie=_},43285:function(H,j,r){r.d(j,{FG:function(){return U},XB:function(){return d},fn:function(){return C},wH:function(){return J}});var l=r(15009),c=r.n(l),S=r(99289),h=r.n(S),v=r(35312);function d(g){return m.apply(this,arguments)}function m(){return m=h()(c()().mark(function g(I){return c()().wrap(function(f){for(;;)switch(f.prev=f.next){case 0:return f.abrupt("return",(0,v.request)("order/list",{params:I}));case 1:case"end":return f.stop()}},g)})),m.apply(this,arguments)}function C(g){return O.apply(this,arguments)}function O(){return O=h()(c()().mark(function g(I){return c()().wrap(function(f){for(;;)switch(f.prev=f.next){case 0:return f.abrupt("return",(0,v.request)("order/".concat(I)));case 1:case"end":return f.stop()}},g)})),O.apply(this,arguments)}function J(g){return T.apply(this,arguments)}function T(){return T=h()(c()().mark(function g(I){return c()().wrap(function(f){for(;;)switch(f.prev=f.next){case 0:return f.abrupt("return",(0,v.request)("order/delete/".concat(I),{method:"POST"}));case 1:case"end":return f.stop()}},g)})),T.apply(this,arguments)}function U(){return N.apply(this,arguments)}function N(){return N=h()(c()().mark(function g(){return c()().wrap(function(P){for(;;)switch(P.prev=P.next){case 0:return P.abrupt("return",(0,v.request)("order/count"));case 1:case"end":return P.stop()}},g)})),N.apply(this,arguments)}},5251:function(H,j,r){r.d(j,{Er:function(){return h},p6:function(){return v}});var l=r(27484),c=r.n(l);function S(m){return m.trim()}function h(m){return new URL(m||"",localStorage.getItem("wf_URL")||"").href}function v(m){return m?c()(m).format("DD/MM/YYYY hh:mm:ss"):"-"}var d=function(){var C=arguments.length>0&&arguments[0]!==void 0?arguments[0]:100;return new Promise(function(O){setTimeout(function(){O(!0)},C)})}},26412:function(H,j,r){r.d(j,{Z:function(){return me}});var l=r(67294),c=r(93967),S=r.n(c),h=r(74443),v=r(53124),d=r(98675),m=r(25378),O={xxl:3,xl:3,lg:3,md:3,sm:2,xs:1},T=l.createContext({}),U=r(50344),N=function(e,t){var i={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(i[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(i[n[o]]=e[n[o]]);return i};const g=e=>(0,U.Z)(e).map(t=>Object.assign(Object.assign({},t==null?void 0:t.props),{key:t.key}));function I(e,t,i){const n=l.useMemo(()=>t||g(i),[t,i]);return l.useMemo(()=>n.map(s=>{var{span:a}=s,$=N(s,["span"]);return Object.assign(Object.assign({},$),{span:typeof a=="number"?a:(0,h.m9)(e,a)})}),[n,e])}function P(e,t,i){let n=e,o=!1;return(i===void 0||i>t)&&(n=Object.assign(Object.assign({},e),{span:t}),o=i!==void 0),[n,o]}function f(e,t){const i=[];let n=[],o=t,s=!1;return e.filter(a=>a).forEach((a,$)=>{const B=a==null?void 0:a.span,x=B||1;if($===e.length-1){const[y,w]=P(a,o,B);s=s||w,n.push(y),i.push(n);return}if(x<o)o-=x,n.push(a);else{const[y,w]=P(a,o,x);s=s||w,n.push(y),i.push(n),o=t,n=[]}}),[i,s]}var L=(e,t)=>{const[i,n]=(0,l.useMemo)(()=>f(t,e),[t,e]);return i},p=e=>{let{children:t}=e;return t};function _(e){return e!=null}var W=e=>{const{itemPrefixCls:t,component:i,span:n,className:o,style:s,labelStyle:a,contentStyle:$,bordered:B,label:x,content:y,colon:w,type:z}=e,M=i;return B?l.createElement(M,{className:S()({[`${t}-item-label`]:z==="label",[`${t}-item-content`]:z==="content"},o),style:s,colSpan:n},_(x)&&l.createElement("span",{style:a},x),_(y)&&l.createElement("span",{style:$},y)):l.createElement(M,{className:S()(`${t}-item`,o),style:s,colSpan:n},l.createElement("div",{className:`${t}-item-container`},(x||x===0)&&l.createElement("span",{className:S()(`${t}-item-label`,{[`${t}-item-no-colon`]:!w}),style:a},x),(y||y===0)&&l.createElement("span",{className:S()(`${t}-item-content`),style:$},y)))};function R(e,t,i){let{colon:n,prefixCls:o,bordered:s}=t,{component:a,type:$,showLabel:B,showContent:x,labelStyle:y,contentStyle:w}=i;return e.map((z,M)=>{let{label:G,children:ee,prefixCls:K=o,className:X,style:F,labelStyle:D,contentStyle:E,span:Z=1,key:Y}=z;return typeof a=="string"?l.createElement(W,{key:`${$}-${Y||M}`,className:X,style:F,labelStyle:Object.assign(Object.assign({},y),D),contentStyle:Object.assign(Object.assign({},w),E),span:Z,colon:n,component:a,itemPrefixCls:K,bordered:s,label:B?G:null,content:x?ee:null,type:$}):[l.createElement(W,{key:`label-${Y||M}`,className:X,style:Object.assign(Object.assign(Object.assign({},y),F),D),span:1,colon:n,component:a[0],itemPrefixCls:K,bordered:s,label:G,type:"label"}),l.createElement(W,{key:`content-${Y||M}`,className:X,style:Object.assign(Object.assign(Object.assign({},w),F),E),span:Z*2-1,component:a[1],itemPrefixCls:K,bordered:s,content:ee,type:"content"})]})}var ne=e=>{const t=l.useContext(T),{prefixCls:i,vertical:n,row:o,index:s,bordered:a}=e;return n?l.createElement(l.Fragment,null,l.createElement("tr",{key:`label-${s}`,className:`${i}-row`},R(o,e,Object.assign({component:"th",type:"label",showLabel:!0},t))),l.createElement("tr",{key:`content-${s}`,className:`${i}-row`},R(o,e,Object.assign({component:"td",type:"content",showContent:!0},t)))):l.createElement("tr",{key:s,className:`${i}-row`},R(o,e,Object.assign({component:a?["th","td"]:"td",type:"item",showLabel:!0,showContent:!0},t)))},b=r(11568),u=r(14747),re=r(83559),V=r(83262);const k=e=>{const{componentCls:t,labelBg:i}=e;return{[`&${t}-bordered`]:{[`> ${t}-view`]:{overflow:"hidden",border:`${(0,b.bf)(e.lineWidth)} ${e.lineType} ${e.colorSplit}`,"> table":{tableLayout:"auto"},[`${t}-row`]:{borderBottom:`${(0,b.bf)(e.lineWidth)} ${e.lineType} ${e.colorSplit}`,"&:last-child":{borderBottom:"none"},[`> ${t}-item-label, > ${t}-item-content`]:{padding:`${(0,b.bf)(e.padding)} ${(0,b.bf)(e.paddingLG)}`,borderInlineEnd:`${(0,b.bf)(e.lineWidth)} ${e.lineType} ${e.colorSplit}`,"&:last-child":{borderInlineEnd:"none"}},[`> ${t}-item-label`]:{color:e.colorTextSecondary,backgroundColor:i,"&::after":{display:"none"}}}},[`&${t}-middle`]:{[`${t}-row`]:{[`> ${t}-item-label, > ${t}-item-content`]:{padding:`${(0,b.bf)(e.paddingSM)} ${(0,b.bf)(e.paddingLG)}`}}},[`&${t}-small`]:{[`${t}-row`]:{[`> ${t}-item-label, > ${t}-item-content`]:{padding:`${(0,b.bf)(e.paddingXS)} ${(0,b.bf)(e.padding)}`}}}}}},A=e=>{const{componentCls:t,extraColor:i,itemPaddingBottom:n,itemPaddingEnd:o,colonMarginRight:s,colonMarginLeft:a,titleMarginBottom:$}=e;return{[t]:Object.assign(Object.assign(Object.assign({},(0,u.Wf)(e)),k(e)),{"&-rtl":{direction:"rtl"},[`${t}-header`]:{display:"flex",alignItems:"center",marginBottom:$},[`${t}-title`]:Object.assign(Object.assign({},u.vS),{flex:"auto",color:e.titleColor,fontWeight:e.fontWeightStrong,fontSize:e.fontSizeLG,lineHeight:e.lineHeightLG}),[`${t}-extra`]:{marginInlineStart:"auto",color:i,fontSize:e.fontSize},[`${t}-view`]:{width:"100%",borderRadius:e.borderRadiusLG,table:{width:"100%",tableLayout:"fixed",borderCollapse:"collapse"}},[`${t}-row`]:{"> th, > td":{paddingBottom:n,paddingInlineEnd:o},"> th:last-child, > td:last-child":{paddingInlineEnd:0},"&:last-child":{borderBottom:"none","> th, > td":{paddingBottom:0}}},[`${t}-item-label`]:{color:e.colorTextTertiary,fontWeight:"normal",fontSize:e.fontSize,lineHeight:e.lineHeight,textAlign:"start","&::after":{content:'":"',position:"relative",top:-.5,marginInline:`${(0,b.bf)(a)} ${(0,b.bf)(s)}`},[`&${t}-item-no-colon::after`]:{content:'""'}},[`${t}-item-no-label`]:{"&::after":{margin:0,content:'""'}},[`${t}-item-content`]:{display:"table-cell",flex:1,color:e.contentColor,fontSize:e.fontSize,lineHeight:e.lineHeight,wordBreak:"break-word",overflowWrap:"break-word"},[`${t}-item`]:{paddingBottom:0,verticalAlign:"top","&-container":{display:"flex",[`${t}-item-label`]:{display:"inline-flex",alignItems:"baseline"},[`${t}-item-content`]:{display:"inline-flex",alignItems:"baseline",minWidth:0}}},"&-middle":{[`${t}-row`]:{"> th, > td":{paddingBottom:e.paddingSM}}},"&-small":{[`${t}-row`]:{"> th, > td":{paddingBottom:e.paddingXS}}}})}},ce=e=>({labelBg:e.colorFillAlter,titleColor:e.colorText,titleMarginBottom:e.fontSizeSM*e.lineHeightSM,itemPaddingBottom:e.padding,itemPaddingEnd:e.padding,colonMarginRight:e.marginXS,colonMarginLeft:e.marginXXS/2,contentColor:e.colorText,extraColor:e.colorText});var de=(0,re.I$)("Descriptions",e=>{const t=(0,V.IX)(e,{});return A(t)},ce),ue=function(e,t){var i={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(i[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(i[n[o]]=e[n[o]]);return i};const ae=e=>{const{prefixCls:t,title:i,extra:n,column:o,colon:s=!0,bordered:a,layout:$,children:B,className:x,rootClassName:y,style:w,size:z,labelStyle:M,contentStyle:G,items:ee}=e,K=ue(e,["prefixCls","title","extra","column","colon","bordered","layout","children","className","rootClassName","style","size","labelStyle","contentStyle","items"]),{getPrefixCls:X,direction:F,descriptions:D}=l.useContext(v.E_),E=X("descriptions",t),Z=(0,m.Z)(),Y=l.useMemo(()=>{var Q;return typeof o=="number"?o:(Q=(0,h.m9)(Z,Object.assign(Object.assign({},O),o)))!==null&&Q!==void 0?Q:3},[Z,o]),fe=I(Z,ee,B),le=(0,d.Z)(z),pe=L(Y,fe),[ve,ge,be]=de(E),ye=l.useMemo(()=>({labelStyle:M,contentStyle:G}),[M,G]);return ve(l.createElement(T.Provider,{value:ye},l.createElement("div",Object.assign({className:S()(E,D==null?void 0:D.className,{[`${E}-${le}`]:le&&le!=="default",[`${E}-bordered`]:!!a,[`${E}-rtl`]:F==="rtl"},x,y,ge,be),style:Object.assign(Object.assign({},D==null?void 0:D.style),w)},K),(i||n)&&l.createElement("div",{className:`${E}-header`},i&&l.createElement("div",{className:`${E}-title`},i),n&&l.createElement("div",{className:`${E}-extra`},n)),l.createElement("div",{className:`${E}-view`},l.createElement("table",null,l.createElement("tbody",null,pe.map((Q,se)=>l.createElement(ne,{key:se,index:se,colon:s,prefixCls:E,vertical:$==="vertical",bordered:a,row:Q}))))))))};ae.Item=p;var me=ae},49867:function(H,j,r){r.d(j,{N:function(){return l}});const l=c=>({color:c.colorLink,textDecoration:"none",outline:"none",cursor:"pointer",transition:`color ${c.motionDurationSlow}`,"&:focus, &:hover":{color:c.colorLinkHover},"&:active":{color:c.colorLinkActive}})},79370:function(H,j,r){r.d(j,{G:function(){return h}});var l=r(98924),c=function(d){if((0,l.Z)()&&window.document.documentElement){var m=Array.isArray(d)?d:[d],C=window.document.documentElement;return m.some(function(O){return O in C.style})}return!1},S=function(d,m){if(!c(d))return!1;var C=document.createElement("div"),O=C.style[d];return C.style[d]=m,C.style[d]!==O};function h(v,d){return!Array.isArray(v)&&d!==void 0?S(v,d):c(v)}}}]);
