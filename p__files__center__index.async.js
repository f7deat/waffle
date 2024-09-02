"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4136],{49495:function(F,O){var t={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M505.7 661a8 8 0 0012.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"}}]},name:"download",theme:"outlined"};O.Z=t},82826:function(F,O,t){t.d(O,{Z:function(){return D}});var r=t(1413),o=t(67294),b={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"}}]},name:"arrow-left",theme:"outlined"},P=b,M=t(91146),v=function(h,$){return o.createElement(M.Z,(0,r.Z)((0,r.Z)({},h),{},{ref:$,icon:P}))},u=o.forwardRef(v),D=u},82061:function(F,O,t){var r=t(1413),o=t(67294),b=t(47046),P=t(91146),M=function(D,g){return o.createElement(P.Z,(0,r.Z)((0,r.Z)({},D),{},{ref:g,icon:b.Z}))},v=o.forwardRef(M);O.Z=v},69753:function(F,O,t){var r=t(1413),o=t(67294),b=t(49495),P=t(91146),M=function(D,g){return o.createElement(P.Z,(0,r.Z)((0,r.Z)({},D),{},{ref:g,icon:b.Z}))},v=o.forwardRef(M);O.Z=v},27895:function(F,O,t){t.r(O);var r=t(15009),o=t.n(r),b=t(99289),P=t.n(b),M=t(5574),v=t.n(M),u=t(20385),D=t(55725),g=t(82061),h=t(82826),$=t(63386),q=t(2177),y=t(35312),R=t(14726),A=t(86738),w=t(68872),f=t(78957),ee=t(71230),B=t(15746),z=t(67294),L=t(19489),p=t(85893),X=function(){var U=(0,y.useParams)(),J=U.id,d=(0,y.useIntl)(),c=(0,z.useState)(),i=v()(c,2),_=i[0],C=i[1];(0,z.useEffect)(function(){(0,u.Cq)(J).then(function(G){C(G)})},[]);var N=[{title:"#",valueType:"indexBorder"},{title:"Name",dataIndex:"name"},{title:d.formatMessage({id:"general.status"}),dataIndex:"active",valueEnum:{false:{text:"Draft",status:"Default"},true:{text:"Active",status:"Processing"}}},{title:"",valueType:"option",width:120,render:function(V,W){return[(0,p.jsx)(R.ZP,{icon:(0,p.jsx)(D.Z,{}),type:"primary",onClick:function(){y.history.push("/works/".concat(W.normalizedName.toLocaleLowerCase(),"/").concat(W.id))}},1),(0,p.jsx)(A.Z,{title:"Are you sure?",children:(0,p.jsx)(R.ZP,{icon:(0,p.jsx)(g.Z,{}),type:"primary",danger:!0})},2)]}}],oe=function(){var G=P()(o()().mark(function V(){var W;return o()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,u.Ah)(J);case 2:W=e.sent,W.succeeded?(w.ZP.success(d.formatMessage({id:"general.deleted"})),y.history.back()):w.ZP.error(W.errors[0].description);case 4:case"end":return e.stop()}},V)}));return function(){return G.apply(this,arguments)}}(),ce=(0,p.jsxs)(f.Z,{children:[(0,p.jsx)(A.Z,{title:"Are you sure?",onConfirm:oe,children:(0,p.jsx)(R.ZP,{type:"primary",danger:!0,icon:(0,p.jsx)(g.Z,{}),children:"Delete"})}),(0,p.jsx)(R.ZP,{onClick:function(){return y.history.back()},icon:(0,p.jsx)(h.Z,{}),children:(0,p.jsx)(y.FormattedMessage,{id:"general.back"})})]});return(0,p.jsx)($._z,{title:"Center",extra:ce,children:(0,p.jsxs)(ee.Z,{gutter:16,children:[(0,p.jsx)(B.Z,{span:8,children:(0,p.jsx)(L.Z,{file:_})}),(0,p.jsx)(B.Z,{span:16,children:(0,p.jsx)(q.Z,{columns:N,request:function(V){return(0,u.z3)(V,{id:J})},rowKey:"id"})})]})})};O.default=X},19489:function(F,O,t){var r=t(5251),o=t(69753),b=t(93410),P=t(35312),M=t(55060),v=t(32983),u=t(14726),D=t(96074),g=t(26412),h=t(85893),$=function(y){var R,A=["image/jpeg","image/png","image/webp",".svg",".jpg",".png",".jpeg"],w=(0,P.useIntl)(),f=y.file,ee=function(){y.onChange&&y.onChange()},B=function(){var L;return A.includes((L=f==null?void 0:f.type)!==null&&L!==void 0?L:"")?(0,h.jsx)("div",{className:"flex justify-center items-center",style:{minHeight:130},children:(0,h.jsx)(M.Z,{src:(0,r.Er)(f==null?void 0:f.url)})}):(0,h.jsx)("div",{onClick:ee,children:(0,h.jsx)(v.Z,{})})};return(0,h.jsxs)(b.Z,{title:w.formatMessage({id:"general.preview"}),actions:[(0,h.jsx)(u.ZP,{type:"link",onClick:function(){return window.location.href=(0,r.Er)(f==null?void 0:f.url)},icon:(0,h.jsx)(o.Z,{}),children:"Download"},"download")],children:[B(),(0,h.jsx)(D.Z,{}),(0,h.jsxs)(g.Z,{title:"File info",column:1,children:[(0,h.jsx)(g.Z.Item,{label:"Name",children:f==null?void 0:f.name}),(0,h.jsxs)(g.Z.Item,{label:"Size",children:[(((R=f==null?void 0:f.size)!==null&&R!==void 0?R:0)/1024).toFixed(2)," KB"]}),(0,h.jsx)(g.Z.Item,{label:"Type",children:f==null?void 0:f.type})]})]})};O.Z=$},20385:function(F,O,t){t.d(O,{Ah:function(){return h},Cq:function(){return R},V6:function(){return D},p6:function(){return Y},tg:function(){return z},yk:function(){return p},z3:function(){return w},zR:function(){return J}});var r=t(15009),o=t.n(r),b=t(97857),P=t.n(b),M=t(99289),v=t.n(M),u=t(35312);function D(d,c,i){return g.apply(this,arguments)}function g(){return g=v()(o()().mark(function d(c,i,_){return o()().wrap(function(N){for(;;)switch(N.prev=N.next){case 0:return N.abrupt("return",(0,u.request)("file/list",P()({method:"GET",params:P()({type:Object.keys(i!=null?i:[]).length>0?i==null?void 0:i.join(","):""},c)},_||{})));case 1:case"end":return N.stop()}},d)})),g.apply(this,arguments)}function h(d){return $.apply(this,arguments)}function $(){return $=v()(o()().mark(function d(c){return o()().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return _.abrupt("return",(0,u.request)("file/delete-file-content/".concat(c),{method:"POST"}));case 1:case"end":return _.stop()}},d)})),$.apply(this,arguments)}function q(d){return y.apply(this,arguments)}function y(){return y=_asyncToGenerator(_regeneratorRuntime().mark(function d(c){return _regeneratorRuntime().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return _.abrupt("return",request("file/delete-file-item",{method:"POST",data:c}));case 1:case"end":return _.stop()}},d)})),y.apply(this,arguments)}function R(d){return A.apply(this,arguments)}function A(){return A=v()(o()().mark(function d(c){return o()().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return _.abrupt("return",(0,u.request)("file/".concat(c)));case 1:case"end":return _.stop()}},d)})),A.apply(this,arguments)}function w(d,c){return f.apply(this,arguments)}function f(){return f=v()(o()().mark(function d(c,i){return o()().wrap(function(C){for(;;)switch(C.prev=C.next){case 0:return C.abrupt("return",(0,u.request)("file/file-items/".concat(i.id)));case 1:case"end":return C.stop()}},d)})),f.apply(this,arguments)}function ee(d){return B.apply(this,arguments)}function B(){return B=_asyncToGenerator(_regeneratorRuntime().mark(function d(c){var i;return _regeneratorRuntime().wrap(function(C){for(;;)switch(C.prev=C.next){case 0:return i=new FormData,i.append("file",c),C.abrupt("return",request("file/upload",{method:"POST",data:i}));case 3:case"end":return C.stop()}},d)})),B.apply(this,arguments)}function z(d){return L.apply(this,arguments)}function L(){return L=v()(o()().mark(function d(c){return o()().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return _.abrupt("return",(0,u.request)("file/upload-from-url",{method:"POST",data:{url:c}}));case 1:case"end":return _.stop()}},d)})),L.apply(this,arguments)}function p(){return X.apply(this,arguments)}function X(){return X=v()(o()().mark(function d(){return o()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.abrupt("return",(0,u.request)("file/count"));case 1:case"end":return i.stop()}},d)})),X.apply(this,arguments)}function Y(){return U.apply(this,arguments)}function U(){return U=v()(o()().mark(function d(){return o()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.abrupt("return",(0,u.request)("file/total-size"));case 1:case"end":return i.stop()}},d)})),U.apply(this,arguments)}var J=function(c){return(0,u.request)("file/muti-upload",{method:"POST",data:c})}},5251:function(F,O,t){t.d(O,{Er:function(){return P},p6:function(){return M}});var r=t(27484),o=t.n(r);function b(u){return u.trim()}function P(u){return new URL(u||"",localStorage.getItem("wf_URL")||"").href}function M(u){return u?o()(u).format("DD/MM/YYYY hh:mm:ss"):"-"}var v=function(){var D=arguments.length>0&&arguments[0]!==void 0?arguments[0]:100;return new Promise(function(g){setTimeout(function(){g(!0)},D)})}},26412:function(F,O,t){t.d(O,{Z:function(){return de}});var r=t(67294),o=t(93967),b=t.n(o),P=t(74443),M=t(53124),v=t(98675),u=t(25378),g={xxl:3,xl:3,lg:3,md:3,sm:2,xs:1},$=r.createContext({}),q=t(50344),y=function(e,n){var s={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&n.indexOf(l)<0&&(s[l]=e[l]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var a=0,l=Object.getOwnPropertySymbols(e);a<l.length;a++)n.indexOf(l[a])<0&&Object.prototype.propertyIsEnumerable.call(e,l[a])&&(s[l[a]]=e[l[a]]);return s};const R=e=>(0,q.Z)(e).map(n=>Object.assign(Object.assign({},n==null?void 0:n.props),{key:n.key}));function A(e,n,s){const l=r.useMemo(()=>n||R(s),[n,s]);return r.useMemo(()=>l.map(E=>{var{span:m}=E,x=y(E,["span"]);return Object.assign(Object.assign({},x),{span:typeof m=="number"?m:(0,P.m9)(e,m)})}),[l,e])}function w(e,n,s){let l=e,a=!1;return(s===void 0||s>n)&&(l=Object.assign(Object.assign({},e),{span:n}),a=s!==void 0),[l,a]}function f(e,n){const s=[];let l=[],a=n,E=!1;return e.filter(m=>m).forEach((m,x)=>{const H=m==null?void 0:m.span,I=H||1;if(x===e.length-1){const[j,S]=w(m,a,H);E=E||S,l.push(j),s.push(l);return}if(I<a)a-=I,l.push(m);else{const[j,S]=w(m,a,I);E=E||S,l.push(j),s.push(l),a=n,l=[]}}),[s,E]}var B=(e,n)=>{const[s,l]=(0,r.useMemo)(()=>f(n,e),[n,e]);return s},L=e=>{let{children:n}=e;return n};function p(e){return e!=null}var Y=e=>{const{itemPrefixCls:n,component:s,span:l,className:a,style:E,labelStyle:m,contentStyle:x,bordered:H,label:I,content:j,colon:S,type:Q}=e,K=s;return H?r.createElement(K,{className:b()({[`${n}-item-label`]:Q==="label",[`${n}-item-content`]:Q==="content"},a),style:E,colSpan:l},p(I)&&r.createElement("span",{style:m},I),p(j)&&r.createElement("span",{style:x},j)):r.createElement(K,{className:b()(`${n}-item`,a),style:E,colSpan:l},r.createElement("div",{className:`${n}-item-container`},(I||I===0)&&r.createElement("span",{className:b()(`${n}-item-label`,{[`${n}-item-no-colon`]:!S}),style:m},I),(j||j===0)&&r.createElement("span",{className:b()(`${n}-item-content`),style:x},j)))};function U(e,n,s){let{colon:l,prefixCls:a,bordered:E}=n,{component:m,type:x,showLabel:H,showContent:I,labelStyle:j,contentStyle:S}=s;return e.map((Q,K)=>{let{label:te,children:ie,prefixCls:ne=a,className:re,style:le,labelStyle:Z,contentStyle:T,span:k=1,key:ae}=Q;return typeof m=="string"?r.createElement(Y,{key:`${x}-${ae||K}`,className:re,style:le,labelStyle:Object.assign(Object.assign({},j),Z),contentStyle:Object.assign(Object.assign({},S),T),span:k,colon:l,component:m,itemPrefixCls:ne,bordered:E,label:H?te:null,content:I?ie:null,type:x}):[r.createElement(Y,{key:`label-${ae||K}`,className:re,style:Object.assign(Object.assign(Object.assign({},j),le),Z),span:1,colon:l,component:m[0],itemPrefixCls:ne,bordered:E,label:te,type:"label"}),r.createElement(Y,{key:`content-${ae||K}`,className:re,style:Object.assign(Object.assign(Object.assign({},S),le),T),span:k*2-1,component:m[1],itemPrefixCls:ne,bordered:E,content:ie,type:"content"})]})}var d=e=>{const n=r.useContext($),{prefixCls:s,vertical:l,row:a,index:E,bordered:m}=e;return l?r.createElement(r.Fragment,null,r.createElement("tr",{key:`label-${E}`,className:`${s}-row`},U(a,e,Object.assign({component:"th",type:"label",showLabel:!0},n))),r.createElement("tr",{key:`content-${E}`,className:`${s}-row`},U(a,e,Object.assign({component:"td",type:"content",showContent:!0},n)))):r.createElement("tr",{key:E,className:`${s}-row`},U(a,e,Object.assign({component:m?["th","td"]:"td",type:"item",showLabel:!0,showContent:!0},n)))},c=t(11568),i=t(14747),_=t(83559),C=t(83262);const N=e=>{const{componentCls:n,labelBg:s}=e;return{[`&${n}-bordered`]:{[`> ${n}-view`]:{overflow:"hidden",border:`${(0,c.bf)(e.lineWidth)} ${e.lineType} ${e.colorSplit}`,"> table":{tableLayout:"auto"},[`${n}-row`]:{borderBottom:`${(0,c.bf)(e.lineWidth)} ${e.lineType} ${e.colorSplit}`,"&:last-child":{borderBottom:"none"},[`> ${n}-item-label, > ${n}-item-content`]:{padding:`${(0,c.bf)(e.padding)} ${(0,c.bf)(e.paddingLG)}`,borderInlineEnd:`${(0,c.bf)(e.lineWidth)} ${e.lineType} ${e.colorSplit}`,"&:last-child":{borderInlineEnd:"none"}},[`> ${n}-item-label`]:{color:e.colorTextSecondary,backgroundColor:s,"&::after":{display:"none"}}}},[`&${n}-middle`]:{[`${n}-row`]:{[`> ${n}-item-label, > ${n}-item-content`]:{padding:`${(0,c.bf)(e.paddingSM)} ${(0,c.bf)(e.paddingLG)}`}}},[`&${n}-small`]:{[`${n}-row`]:{[`> ${n}-item-label, > ${n}-item-content`]:{padding:`${(0,c.bf)(e.paddingXS)} ${(0,c.bf)(e.padding)}`}}}}}},oe=e=>{const{componentCls:n,extraColor:s,itemPaddingBottom:l,itemPaddingEnd:a,colonMarginRight:E,colonMarginLeft:m,titleMarginBottom:x}=e;return{[n]:Object.assign(Object.assign(Object.assign({},(0,i.Wf)(e)),N(e)),{"&-rtl":{direction:"rtl"},[`${n}-header`]:{display:"flex",alignItems:"center",marginBottom:x},[`${n}-title`]:Object.assign(Object.assign({},i.vS),{flex:"auto",color:e.titleColor,fontWeight:e.fontWeightStrong,fontSize:e.fontSizeLG,lineHeight:e.lineHeightLG}),[`${n}-extra`]:{marginInlineStart:"auto",color:s,fontSize:e.fontSize},[`${n}-view`]:{width:"100%",borderRadius:e.borderRadiusLG,table:{width:"100%",tableLayout:"fixed",borderCollapse:"collapse"}},[`${n}-row`]:{"> th, > td":{paddingBottom:l,paddingInlineEnd:a},"> th:last-child, > td:last-child":{paddingInlineEnd:0},"&:last-child":{borderBottom:"none","> th, > td":{paddingBottom:0}}},[`${n}-item-label`]:{color:e.colorTextTertiary,fontWeight:"normal",fontSize:e.fontSize,lineHeight:e.lineHeight,textAlign:"start","&::after":{content:'":"',position:"relative",top:-.5,marginInline:`${(0,c.bf)(m)} ${(0,c.bf)(E)}`},[`&${n}-item-no-colon::after`]:{content:'""'}},[`${n}-item-no-label`]:{"&::after":{margin:0,content:'""'}},[`${n}-item-content`]:{display:"table-cell",flex:1,color:e.contentColor,fontSize:e.fontSize,lineHeight:e.lineHeight,wordBreak:"break-word",overflowWrap:"break-word"},[`${n}-item`]:{paddingBottom:0,verticalAlign:"top","&-container":{display:"flex",[`${n}-item-label`]:{display:"inline-flex",alignItems:"baseline"},[`${n}-item-content`]:{display:"inline-flex",alignItems:"baseline",minWidth:0}}},"&-middle":{[`${n}-row`]:{"> th, > td":{paddingBottom:e.paddingSM}}},"&-small":{[`${n}-row`]:{"> th, > td":{paddingBottom:e.paddingXS}}}})}},ce=e=>({labelBg:e.colorFillAlter,titleColor:e.colorText,titleMarginBottom:e.fontSizeSM*e.lineHeightSM,itemPaddingBottom:e.padding,itemPaddingEnd:e.padding,colonMarginRight:e.marginXS,colonMarginLeft:e.marginXXS/2,contentColor:e.colorText,extraColor:e.colorText});var G=(0,_.I$)("Descriptions",e=>{const n=(0,C.IX)(e,{});return oe(n)},ce),V=function(e,n){var s={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&n.indexOf(l)<0&&(s[l]=e[l]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var a=0,l=Object.getOwnPropertySymbols(e);a<l.length;a++)n.indexOf(l[a])<0&&Object.prototype.propertyIsEnumerable.call(e,l[a])&&(s[l[a]]=e[l[a]]);return s};const W=e=>{const{prefixCls:n,title:s,extra:l,column:a,colon:E=!0,bordered:m,layout:x,children:H,className:I,rootClassName:j,style:S,size:Q,labelStyle:K,contentStyle:te,items:ie}=e,ne=V(e,["prefixCls","title","extra","column","colon","bordered","layout","children","className","rootClassName","style","size","labelStyle","contentStyle","items"]),{getPrefixCls:re,direction:le,descriptions:Z}=r.useContext(M.E_),T=re("descriptions",n),k=(0,u.Z)(),ae=r.useMemo(()=>{var se;return typeof a=="number"?a:(se=(0,P.m9)(k,Object.assign(Object.assign({},g),a)))!==null&&se!==void 0?se:3},[k,a]),me=A(k,ie,H),ue=(0,v.Z)(Q),fe=B(ae,me),[pe,Ee,ve]=G(T),ge=r.useMemo(()=>({labelStyle:K,contentStyle:te}),[K,te]);return pe(r.createElement($.Provider,{value:ge},r.createElement("div",Object.assign({className:b()(T,Z==null?void 0:Z.className,{[`${T}-${ue}`]:ue&&ue!=="default",[`${T}-bordered`]:!!m,[`${T}-rtl`]:le==="rtl"},I,j,Ee,ve),style:Object.assign(Object.assign({},Z==null?void 0:Z.style),S)},ne),(s||l)&&r.createElement("div",{className:`${T}-header`},s&&r.createElement("div",{className:`${T}-title`},s),l&&r.createElement("div",{className:`${T}-extra`},l)),r.createElement("div",{className:`${T}-view`},r.createElement("table",null,r.createElement("tbody",null,fe.map((se,_e)=>r.createElement(d,{key:_e,index:_e,colon:E,prefixCls:T,vertical:x==="vertical",bordered:m,row:se}))))))))};W.Item=L;var de=W}}]);
