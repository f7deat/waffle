"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4379],{69760:function(J,B,u){u.d(B,{Z:function(){return y},w:function(){return j}});var s=u(67294),A=u(84481),m=u(64217);function j(C){if(C)return{closable:C.closable,closeIcon:C.closeIcon}}function I(C){const{closable:h,closeIcon:d}=C||{};return s.useMemo(()=>{if(!h&&(h===!1||d===!1||d===null))return!1;if(h===void 0&&d===void 0)return null;let g={closeIcon:typeof d!="boolean"&&d!==null?d:void 0};return h&&typeof h=="object"&&(g=Object.assign(Object.assign({},g),h)),g},[h,d])}function H(){const C={};for(var h=arguments.length,d=new Array(h),g=0;g<h;g++)d[g]=arguments[g];return d.forEach(f=>{f&&Object.keys(f).forEach(v=>{f[v]!==void 0&&(C[v]=f[v])})}),C}const x={};function y(C,h){let d=arguments.length>2&&arguments[2]!==void 0?arguments[2]:x;const g=I(C),f=I(h),v=s.useMemo(()=>Object.assign({closeIcon:s.createElement(A.Z,null)},d),[d]),P=s.useMemo(()=>g===!1?!1:g?H(v,f,g):f===!1?!1:f?H(v,f):v.closable?v:!1,[g,f,v]);return s.useMemo(()=>{if(P===!1)return[!1,null];const{closeIconRender:T}=v,{closeIcon:D}=P;let k=D;if(k!=null){T&&(k=T(D));const z=(0,m.Z)(P,!0);Object.keys(z).length&&(k=s.isValidElement(k)?s.cloneElement(k,z):s.createElement("span",Object.assign({},z),k))}return[!0,k]},[P,v])}},99559:function(J,B,u){u.d(B,{Z:function(){return Se}});var s=u(67294),A=u(93967),m=u.n(A),j=u(53124),I=u(98423),x=e=>{const{prefixCls:t,className:n,style:l,size:a,shape:i}=e,c=m()({[`${t}-lg`]:a==="large",[`${t}-sm`]:a==="small"}),o=m()({[`${t}-circle`]:i==="circle",[`${t}-square`]:i==="square",[`${t}-round`]:i==="round"}),r=s.useMemo(()=>typeof a=="number"?{width:a,height:a,lineHeight:`${a}px`}:{},[a]);return s.createElement("span",{className:m()(t,c,o,n),style:Object.assign(Object.assign({},r),l)})},y=u(11568),C=u(83559),h=u(83262);const d=new y.E4("ant-skeleton-loading",{"0%":{backgroundPosition:"100% 50%"},"100%":{backgroundPosition:"0 50%"}}),g=e=>({height:e,lineHeight:(0,y.bf)(e)}),f=e=>Object.assign({width:e},g(e)),v=e=>({background:e.skeletonLoadingBackground,backgroundSize:"400% 100%",animationName:d,animationDuration:e.skeletonLoadingMotionDuration,animationTimingFunction:"ease",animationIterationCount:"infinite"}),P=(e,t)=>Object.assign({width:t(e).mul(5).equal(),minWidth:t(e).mul(5).equal()},g(e)),T=e=>{const{skeletonAvatarCls:t,gradientFromColor:n,controlHeight:l,controlHeightLG:a,controlHeightSM:i}=e;return{[`${t}`]:Object.assign({display:"inline-block",verticalAlign:"top",background:n},f(l)),[`${t}${t}-circle`]:{borderRadius:"50%"},[`${t}${t}-lg`]:Object.assign({},f(a)),[`${t}${t}-sm`]:Object.assign({},f(i))}},D=e=>{const{controlHeight:t,borderRadiusSM:n,skeletonInputCls:l,controlHeightLG:a,controlHeightSM:i,gradientFromColor:c,calc:o}=e;return{[`${l}`]:Object.assign({display:"inline-block",verticalAlign:"top",background:c,borderRadius:n},P(t,o)),[`${l}-lg`]:Object.assign({},P(a,o)),[`${l}-sm`]:Object.assign({},P(i,o))}},k=e=>Object.assign({width:e},g(e)),z=e=>{const{skeletonImageCls:t,imageSizeBase:n,gradientFromColor:l,borderRadiusSM:a,calc:i}=e;return{[`${t}`]:Object.assign(Object.assign({display:"flex",alignItems:"center",justifyContent:"center",verticalAlign:"top",background:l,borderRadius:a},k(i(n).mul(2).equal())),{[`${t}-path`]:{fill:"#bfbfbf"},[`${t}-svg`]:Object.assign(Object.assign({},k(n)),{maxWidth:i(n).mul(4).equal(),maxHeight:i(n).mul(4).equal()}),[`${t}-svg${t}-svg-circle`]:{borderRadius:"50%"}}),[`${t}${t}-circle`]:{borderRadius:"50%"}}},Z=(e,t,n)=>{const{skeletonButtonCls:l}=e;return{[`${n}${l}-circle`]:{width:t,minWidth:t,borderRadius:"50%"},[`${n}${l}-round`]:{borderRadius:t}}},U=(e,t)=>Object.assign({width:t(e).mul(2).equal(),minWidth:t(e).mul(2).equal()},g(e)),ee=e=>{const{borderRadiusSM:t,skeletonButtonCls:n,controlHeight:l,controlHeightLG:a,controlHeightSM:i,gradientFromColor:c,calc:o}=e;return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({[`${n}`]:Object.assign({display:"inline-block",verticalAlign:"top",background:c,borderRadius:t,width:o(l).mul(2).equal(),minWidth:o(l).mul(2).equal()},U(l,o))},Z(e,l,n)),{[`${n}-lg`]:Object.assign({},U(a,o))}),Z(e,a,`${n}-lg`)),{[`${n}-sm`]:Object.assign({},U(i,o))}),Z(e,i,`${n}-sm`))},te=e=>{const{componentCls:t,skeletonAvatarCls:n,skeletonTitleCls:l,skeletonParagraphCls:a,skeletonButtonCls:i,skeletonInputCls:c,skeletonImageCls:o,controlHeight:r,controlHeightLG:b,controlHeightSM:$,gradientFromColor:p,padding:O,marginSM:S,borderRadius:N,titleHeight:E,blockRadius:L,paragraphLiHeight:G,controlHeightXS:K,paragraphMarginTop:R}=e;return{[`${t}`]:{display:"table",width:"100%",[`${t}-header`]:{display:"table-cell",paddingInlineEnd:O,verticalAlign:"top",[`${n}`]:Object.assign({display:"inline-block",verticalAlign:"top",background:p},f(r)),[`${n}-circle`]:{borderRadius:"50%"},[`${n}-lg`]:Object.assign({},f(b)),[`${n}-sm`]:Object.assign({},f($))},[`${t}-content`]:{display:"table-cell",width:"100%",verticalAlign:"top",[`${l}`]:{width:"100%",height:E,background:p,borderRadius:L,[`+ ${a}`]:{marginBlockStart:$}},[`${a}`]:{padding:0,"> li":{width:"100%",height:G,listStyle:"none",background:p,borderRadius:L,"+ li":{marginBlockStart:K}}},[`${a}> li:last-child:not(:first-child):not(:nth-child(2))`]:{width:"61%"}},[`&-round ${t}-content`]:{[`${l}, ${a} > li`]:{borderRadius:N}}},[`${t}-with-avatar ${t}-content`]:{[`${l}`]:{marginBlockStart:S,[`+ ${a}`]:{marginBlockStart:R}}},[`${t}${t}-element`]:Object.assign(Object.assign(Object.assign(Object.assign({display:"inline-block",width:"auto"},ee(e)),T(e)),D(e)),z(e)),[`${t}${t}-block`]:{width:"100%",[`${i}`]:{width:"100%"},[`${c}`]:{width:"100%"}},[`${t}${t}-active`]:{[`
        ${l},
        ${a} > li,
        ${n},
        ${i},
        ${c},
        ${o}
      `]:Object.assign({},v(e))}}},ne=e=>{const{colorFillContent:t,colorFill:n}=e,l=t,a=n;return{color:l,colorGradientEnd:a,gradientFromColor:l,gradientToColor:a,titleHeight:e.controlHeight/2,blockRadius:e.borderRadiusSM,paragraphMarginTop:e.marginLG+e.marginXXS,paragraphLiHeight:e.controlHeight/2}};var w=(0,C.I$)("Skeleton",e=>{const{componentCls:t,calc:n}=e,l=(0,h.IX)(e,{skeletonAvatarCls:`${t}-avatar`,skeletonTitleCls:`${t}-title`,skeletonParagraphCls:`${t}-paragraph`,skeletonButtonCls:`${t}-button`,skeletonInputCls:`${t}-input`,skeletonImageCls:`${t}-image`,imageSizeBase:n(e.controlHeight).mul(1.5).equal(),borderRadius:100,skeletonLoadingBackground:`linear-gradient(90deg, ${e.gradientFromColor} 25%, ${e.gradientToColor} 37%, ${e.gradientFromColor} 63%)`,skeletonLoadingMotionDuration:"1.4s"});return[te(l)]},ne,{deprecatedTokens:[["color","gradientFromColor"],["colorGradientEnd","gradientToColor"]]}),se=e=>{const{prefixCls:t,className:n,rootClassName:l,active:a,shape:i="circle",size:c="default"}=e,{getPrefixCls:o}=s.useContext(j.E_),r=o("skeleton",t),[b,$,p]=w(r),O=(0,I.Z)(e,["prefixCls","className"]),S=m()(r,`${r}-element`,{[`${r}-active`]:a},n,l,$,p);return b(s.createElement("div",{className:S},s.createElement(x,Object.assign({prefixCls:`${r}-avatar`,shape:i,size:c},O))))},le=e=>{const{prefixCls:t,className:n,rootClassName:l,active:a,block:i=!1,size:c="default"}=e,{getPrefixCls:o}=s.useContext(j.E_),r=o("skeleton",t),[b,$,p]=w(r),O=(0,I.Z)(e,["prefixCls"]),S=m()(r,`${r}-element`,{[`${r}-active`]:a,[`${r}-block`]:i},n,l,$,p);return b(s.createElement("div",{className:S},s.createElement(x,Object.assign({prefixCls:`${r}-button`,size:c},O))))};const ae="M365.714286 329.142857q0 45.714286-32.036571 77.677714t-77.677714 32.036571-77.677714-32.036571-32.036571-77.677714 32.036571-77.677714 77.677714-32.036571 77.677714 32.036571 32.036571 77.677714zM950.857143 548.571429l0 256-804.571429 0 0-109.714286 182.857143-182.857143 91.428571 91.428571 292.571429-292.571429zM1005.714286 146.285714l-914.285714 0q-7.460571 0-12.873143 5.412571t-5.412571 12.873143l0 694.857143q0 7.460571 5.412571 12.873143t12.873143 5.412571l914.285714 0q7.460571 0 12.873143-5.412571t5.412571-12.873143l0-694.857143q0-7.460571-5.412571-12.873143t-12.873143-5.412571zM1097.142857 164.571429l0 694.857143q0 37.741714-26.843429 64.585143t-64.585143 26.843429l-914.285714 0q-37.741714 0-64.585143-26.843429t-26.843429-64.585143l0-694.857143q0-37.741714 26.843429-64.585143t64.585143-26.843429l914.285714 0q37.741714 0 64.585143 26.843429t26.843429 64.585143z";var oe=e=>{const{prefixCls:t,className:n,rootClassName:l,style:a,active:i}=e,{getPrefixCls:c}=s.useContext(j.E_),o=c("skeleton",t),[r,b,$]=w(o),p=m()(o,`${o}-element`,{[`${o}-active`]:i},n,l,b,$);return r(s.createElement("div",{className:p},s.createElement("div",{className:m()(`${o}-image`,n),style:a},s.createElement("svg",{viewBox:"0 0 1098 1024",xmlns:"http://www.w3.org/2000/svg",className:`${o}-image-svg`},s.createElement("title",null,"Image placeholder"),s.createElement("path",{d:ae,className:`${o}-image-path`})))))},re=e=>{const{prefixCls:t,className:n,rootClassName:l,active:a,block:i,size:c="default"}=e,{getPrefixCls:o}=s.useContext(j.E_),r=o("skeleton",t),[b,$,p]=w(r),O=(0,I.Z)(e,["prefixCls"]),S=m()(r,`${r}-element`,{[`${r}-active`]:a,[`${r}-block`]:i},n,l,$,p);return b(s.createElement("div",{className:S},s.createElement(x,Object.assign({prefixCls:`${r}-input`,size:c},O))))},ie=u(87462),ce={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM288 604a64 64 0 10128 0 64 64 0 10-128 0zm118-224a48 48 0 1096 0 48 48 0 10-96 0zm158 228a96 96 0 10192 0 96 96 0 10-192 0zm148-314a56 56 0 10112 0 56 56 0 10-112 0z"}}]},name:"dot-chart",theme:"outlined"},ue=ce,ge=u(93771),de=function(t,n){return s.createElement(ge.Z,(0,ie.Z)({},t,{ref:n,icon:ue}))},me=s.forwardRef(de),fe=me,Ce=e=>{const{prefixCls:t,className:n,rootClassName:l,style:a,active:i,children:c}=e,{getPrefixCls:o}=s.useContext(j.E_),r=o("skeleton",t),[b,$,p]=w(r),O=m()(r,`${r}-element`,{[`${r}-active`]:i},$,n,l,p),S=c!=null?c:s.createElement(fe,null);return b(s.createElement("div",{className:O},s.createElement("div",{className:m()(`${r}-image`,n),style:a},S)))},he=u(74902);const pe=(e,t)=>{const{width:n,rows:l=2}=t;if(Array.isArray(n))return n[e];if(l-1===e)return n};var be=e=>{const{prefixCls:t,className:n,style:l,rows:a}=e,i=(0,he.Z)(Array(a)).map((c,o)=>s.createElement("li",{key:o,style:{width:pe(o,e)}}));return s.createElement("ul",{className:m()(t,n),style:l},i)},$e=e=>{let{prefixCls:t,className:n,width:l,style:a}=e;return s.createElement("h3",{className:m()(t,n),style:Object.assign({width:l},a)})};function q(e){return e&&typeof e=="object"?e:{}}function ve(e,t){return e&&!t?{size:"large",shape:"square"}:{size:"large",shape:"circle"}}function Ee(e,t){return!e&&t?{width:"38%"}:e&&t?{width:"50%"}:{}}function ke(e,t){const n={};return(!e||!t)&&(n.width="61%"),!e&&t?n.rows=3:n.rows=2,n}const M=e=>{const{prefixCls:t,loading:n,className:l,rootClassName:a,style:i,children:c,avatar:o=!1,title:r=!0,paragraph:b=!0,active:$,round:p}=e,{getPrefixCls:O,direction:S,skeleton:N}=s.useContext(j.E_),E=O("skeleton",t),[L,G,K]=w(E);if(n||!("loading"in e)){const R=!!o,F=!!r,W=!!b;let Q;if(R){const V=Object.assign(Object.assign({prefixCls:`${E}-avatar`},ve(F,W)),q(o));Q=s.createElement("div",{className:`${E}-header`},s.createElement(x,Object.assign({},V)))}let Y;if(F||W){let V;if(F){const X=Object.assign(Object.assign({prefixCls:`${E}-title`},Ee(R,W)),q(r));V=s.createElement($e,Object.assign({},X))}let _;if(W){const X=Object.assign(Object.assign({prefixCls:`${E}-paragraph`},ke(R,F)),q(b));_=s.createElement(be,Object.assign({},X))}Y=s.createElement("div",{className:`${E}-content`},V,_)}const je=m()(E,{[`${E}-with-avatar`]:R,[`${E}-active`]:$,[`${E}-rtl`]:S==="rtl",[`${E}-round`]:p},N==null?void 0:N.className,l,a,G,K);return L(s.createElement("div",{className:je,style:Object.assign(Object.assign({},N==null?void 0:N.style),i)},Q,Y))}return c!=null?c:null};M.Button=le,M.Avatar=se,M.Input=re,M.Image=oe,M.Node=Ce;var Oe=M,Se=Oe},16569:function(J,B,u){u.d(B,{H:function(){return I}});var s=u(67294),A=u(56790);function m(){}const j=s.createContext({add:m,remove:m});function I(x){const y=s.useContext(j),C=s.useRef();return(0,A.zX)(d=>{if(d){const g=x?d.querySelector(x):d;y.add(g),C.current=g}else y.remove(C.current)})}var H=null}}]);
