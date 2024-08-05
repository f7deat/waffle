"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[9287],{63434:function($,T,e){var t=e(1413),a=e(91),l=e(22270),y=e(84567),R=e(67294),v=e(28614),j=e(53287),C=e(85893),g=["options","fieldProps","proFieldProps","valueEnum"],_=R.forwardRef(function(m,D){var i=m.options,c=m.fieldProps,Z=m.proFieldProps,o=m.valueEnum,n=(0,a.Z)(m,g);return(0,C.jsx)(j.Z,(0,t.Z)({ref:D,valueType:"checkbox",valueEnum:(0,l.h)(o,void 0),fieldProps:(0,t.Z)({options:i},c),lightProps:(0,t.Z)({labelFormatter:function(){return(0,C.jsx)(j.Z,(0,t.Z)({ref:D,valueType:"checkbox",mode:"read",valueEnum:(0,l.h)(o,void 0),filedConfig:{customLightMode:!0},fieldProps:(0,t.Z)({options:i},c),proFieldProps:Z},n))}},n.lightProps),proFieldProps:Z},n))}),W=R.forwardRef(function(m,D){var i=m.fieldProps,c=m.children;return(0,C.jsx)(y.Z,(0,t.Z)((0,t.Z)({ref:D},i),{},{children:c}))}),I=(0,v.G)(W,{valuePropName:"checked"}),u=I;u.Group=_,T.Z=u},5966:function($,T,e){var t=e(97685),a=e(1413),l=e(91),y=e(21770),R=e(8232),v=e(55241),j=e(97435),C=e(67294),g=e(53287),_=e(85893),W=["fieldProps","proFieldProps"],I=["fieldProps","proFieldProps"],u="text",m=function(o){var n=o.fieldProps,d=o.proFieldProps,p=(0,l.Z)(o,W);return(0,_.jsx)(g.Z,(0,a.Z)({valueType:u,fieldProps:n,filedConfig:{valueType:u},proFieldProps:d},p))},D=function(o){var n=(0,y.Z)(o.open||!1,{value:o.open,onChange:o.onOpenChange}),d=(0,t.Z)(n,2),p=d[0],f=d[1];return(0,_.jsx)(R.Z.Item,{shouldUpdate:!0,noStyle:!0,children:function(r){var M,U=r.getFieldValue(o.name||[]);return(0,_.jsx)(v.Z,(0,a.Z)((0,a.Z)({getPopupContainer:function(s){return s&&s.parentNode?s.parentNode:s},onOpenChange:function(s){return f(s)},content:(0,_.jsxs)("div",{style:{padding:"4px 0"},children:[(M=o.statusRender)===null||M===void 0?void 0:M.call(o,U),o.strengthText?(0,_.jsx)("div",{style:{marginTop:10},children:(0,_.jsx)("span",{children:o.strengthText})}):null]}),overlayStyle:{width:240},placement:"rightTop"},o.popoverProps),{},{open:p,children:o.children}))}})},i=function(o){var n=o.fieldProps,d=o.proFieldProps,p=(0,l.Z)(o,I),f=(0,C.useState)(!1),h=(0,t.Z)(f,2),r=h[0],M=h[1];return n!=null&&n.statusRender&&p.name?(0,_.jsx)(D,{name:p.name,statusRender:n==null?void 0:n.statusRender,popoverProps:n==null?void 0:n.popoverProps,strengthText:n==null?void 0:n.strengthText,open:r,onOpenChange:M,children:(0,_.jsx)("div",{children:(0,_.jsx)(g.Z,(0,a.Z)({valueType:"password",fieldProps:(0,a.Z)((0,a.Z)({},(0,j.Z)(n,["statusRender","popoverProps","strengthText"])),{},{onBlur:function(O){var s;n==null||(s=n.onBlur)===null||s===void 0||s.call(n,O),M(!1)},onClick:function(O){var s;n==null||(s=n.onClick)===null||s===void 0||s.call(n,O),M(!0)}}),proFieldProps:d,filedConfig:{valueType:u}},p))})}):(0,_.jsx)(g.Z,(0,a.Z)({valueType:"password",fieldProps:n,proFieldProps:d,filedConfig:{valueType:u}},p))},c=m;c.Password=i,c.displayName="ProFormComponent",T.Z=c},34994:function($,T,e){e.d(T,{A:function(){return s}});var t=e(1413),a=e(8232),l=e(67294),y=e(89671),R=e(9105),v=e(4942),j=e(97685),C=e(87462),g=e(50756),_=e(57080),W=function(P,B){return l.createElement(_.Z,(0,C.Z)({},P,{ref:B,icon:g.Z}))},I=l.forwardRef(W),u=I,m=e(21770),D=e(86333),i=e(28459),c=e(78957),Z=e(93967),o=e.n(Z),n=e(66758),d=e(2514),p=e(98082),f=function(P){return(0,v.Z)({},P.componentCls,{"&-title":{marginBlockEnd:P.marginXL,fontWeight:"bold"},"&-container":(0,v.Z)({flexWrap:"wrap",maxWidth:"100%"},"> div".concat(P.antCls,"-space-item"),{maxWidth:"100%"}),"&-twoLine":(0,v.Z)((0,v.Z)((0,v.Z)((0,v.Z)({display:"block",width:"100%"},"".concat(P.componentCls,"-title"),{width:"100%",margin:"8px 0"}),"".concat(P.componentCls,"-container"),{paddingInlineStart:16}),"".concat(P.antCls,"-space-item,").concat(P.antCls,"-form-item"),{width:"100%"}),"".concat(P.antCls,"-form-item"),{"&-control":{display:"flex",alignItems:"center",justifyContent:"flex-end","&-input":{alignItems:"center",justifyContent:"flex-end","&-content":{flex:"none"}}}})})};function h(x){return(0,p.Xj)("ProFormGroup",function(P){var B=(0,t.Z)((0,t.Z)({},P),{},{componentCls:".".concat(x)});return[f(B)]})}var r=e(85893),M=l.forwardRef(function(x,P){var B=l.useContext(n.Z),b=B.groupProps,E=(0,t.Z)((0,t.Z)({},b),x),Q=E.children,J=E.collapsible,ve=E.defaultCollapsed,ce=E.style,pe=E.labelLayout,Y=E.title,N=Y===void 0?x.label:Y,w=E.tooltip,k=E.align,q=k===void 0?"start":k,ee=E.direction,ne=E.size,re=ne===void 0?32:ne,Pe=E.titleStyle,oe=E.titleRender,A=E.spaceProps,z=E.extra,V=E.autoFocus,Ee=(0,m.Z)(function(){return ve||!1},{value:x.collapsed,onChange:x.onCollapse}),te=(0,j.Z)(Ee,2),H=te[0],fe=te[1],he=(0,l.useContext)(i.ZP.ConfigContext),Me=he.getPrefixCls,se=(0,d.zx)(x),Oe=se.ColWrapper,ae=se.RowWrapper,K=Me("pro-form-group"),le=h(K),Ce=le.wrapSSR,G=le.hashId,ie=J&&(0,r.jsx)(u,{style:{marginInlineEnd:8},rotate:H?void 0:90}),de=(0,r.jsx)(D.G,{label:ie?(0,r.jsxs)("div",{children:[ie,N]}):N,tooltip:w}),_e=(0,l.useCallback)(function(F){var S=F.children;return(0,r.jsx)(c.Z,(0,t.Z)((0,t.Z)({},A),{},{className:o()("".concat(K,"-container ").concat(G),A==null?void 0:A.className),size:re,align:q,direction:ee,style:(0,t.Z)({rowGap:0},A==null?void 0:A.style),children:S}))},[q,K,ee,G,re,A]),ue=oe?oe(de,x):de,De=(0,l.useMemo)(function(){var F=[],S=l.Children.toArray(Q).map(function(L,je){var X;return l.isValidElement(L)&&L!==null&&L!==void 0&&(X=L.props)!==null&&X!==void 0&&X.hidden?(F.push(L),null):je===0&&l.isValidElement(L)&&V?l.cloneElement(L,(0,t.Z)((0,t.Z)({},L.props),{},{autoFocus:V})):L});return[(0,r.jsx)(ae,{Wrapper:_e,children:S},"children"),F.length>0?(0,r.jsx)("div",{style:{display:"none"},children:F}):null]},[Q,ae,_e,V]),me=(0,j.Z)(De,2),xe=me[0],Re=me[1];return Ce((0,r.jsx)(Oe,{children:(0,r.jsxs)("div",{className:o()(K,G,(0,v.Z)({},"".concat(K,"-twoLine"),pe==="twoLine")),style:ce,ref:P,children:[Re,(N||w||z)&&(0,r.jsx)("div",{className:"".concat(K,"-title ").concat(G).trim(),style:Pe,onClick:function(){fe(!H)},children:z?(0,r.jsxs)("div",{style:{display:"flex",width:"100%",alignItems:"center",justifyContent:"space-between"},children:[ue,(0,r.jsx)("span",{onClick:function(S){return S.stopPropagation()},children:z})]}):ue}),(0,r.jsx)("div",{style:{display:J&&H?"none":void 0},children:xe})]})}))});M.displayName="ProForm-Group";var U=M,O=e(4499);function s(x){return(0,r.jsx)(y.I,(0,t.Z)({layout:"vertical",contentRender:function(B,b){return(0,r.jsxs)(r.Fragment,{children:[B,b]})}},x))}s.Group=U,s.useForm=a.Z.useForm,s.Item=O.Z,s.useWatch=a.Z.useWatch,s.ErrorList=a.Z.ErrorList,s.Provider=a.Z.Provider,s.useFormInstance=a.Z.useFormInstance,s.EditOrReadOnlyContext=R.A},85335:function($,T,e){var t=e(15009),a=e.n(t),l=e(99289),y=e.n(l),R=e(66352),v=e(93410),j=e(34994),C=e(5966),g=e(63434),_=e(35312),W=e(68872),I=e(67294),u=e(85893),m=function(){var i=(0,_.useParams)(),c=i.id,Z=(0,I.useRef)();(0,I.useEffect)(function(){(0,R.Mk)(c).then(function(n){var d;(d=Z.current)===null||d===void 0||d.setFields([{name:"name",value:n.name},{name:"active",value:n.active}])})},[c]);var o=function(){var n=y()(a()().mark(function d(p){var f;return a()().wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,(0,R.Qb)(p);case 2:f=r.sent,f.succeeded?W.ZP.success("Saved!"):W.ZP.error(f.errors[0].description);case 4:case"end":return r.stop()}},d)}));return function(p){return n.apply(this,arguments)}}();return(0,u.jsx)(v.Z,{title:"Info",children:(0,u.jsxs)(j.A,{formRef:Z,onFinish:o,children:[(0,u.jsx)(C.Z,{hidden:!0,name:"id",initialValue:c}),(0,u.jsx)(C.Z,{name:"name",label:"Name"}),(0,u.jsx)(g.Z,{name:"active",label:"Active"})]})})};T.Z=m},94166:function($,T,e){e.r(T);var t=e(15009),a=e.n(t),l=e(99289),y=e.n(l),R=e(85335),v=e(66352),j=e(63386),C=e(93410),g=e(34994),_=e(5966),W=e(35312),I=e(68872),u=e(71230),m=e(15746),D=e(67294),i=e(85893),c=function(){var o=(0,W.useParams)(),n=o.id,d=(0,D.useRef)();(0,D.useEffect)(function(){(0,v.Tu)(n).then(function(f){var h;(h=d.current)===null||h===void 0||h.setFields([{name:"mode",value:f.mode}])})},[]);var p=function(){var f=y()(a()().mark(function h(r){var M;return a()().wrap(function(O){for(;;)switch(O.prev=O.next){case 0:return r.format=1,O.next=3,(0,v.iH)(n,r);case 3:M=O.sent,M.succeeded&&I.ZP.success("Saved");case 5:case"end":return O.stop()}},h)}));return function(r){return f.apply(this,arguments)}}();return(0,i.jsx)(j._z,{children:(0,i.jsxs)(u.Z,{gutter:16,children:[(0,i.jsx)(m.Z,{md:16,children:(0,i.jsx)(C.Z,{children:(0,i.jsxs)(g.A,{formRef:d,onFinish:p,children:[(0,i.jsx)(_.Z,{name:"title",label:"Title"}),(0,i.jsx)(_.Z,{name:"mode",label:"Display mode"})]})})}),(0,i.jsx)(m.Z,{md:8,children:(0,i.jsx)(R.Z,{})})]})})};T.default=c}}]);
