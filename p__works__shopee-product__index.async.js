"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[129],{63434:function(G,j,e){var t=e(1413),l=e(91),i=e(22270),y=e(84567),R=e(67294),v=e(28614),g=e(53287),O=e(85893),Z=["options","fieldProps","proFieldProps","valueEnum"],_=R.forwardRef(function(c,D){var d=c.options,m=c.fieldProps,T=c.proFieldProps,r=c.valueEnum,n=(0,l.Z)(c,Z);return(0,O.jsx)(g.Z,(0,t.Z)({ref:D,valueType:"checkbox",valueEnum:(0,i.h)(r,void 0),fieldProps:(0,t.Z)({options:d},m),lightProps:(0,t.Z)({labelFormatter:function(){return(0,O.jsx)(g.Z,(0,t.Z)({ref:D,valueType:"checkbox",mode:"read",valueEnum:(0,i.h)(r,void 0),filedConfig:{customLightMode:!0},fieldProps:(0,t.Z)({options:d},m),proFieldProps:T},n))}},n.lightProps),proFieldProps:T},n))}),I=R.forwardRef(function(c,D){var d=c.fieldProps,m=c.children;return(0,O.jsx)(y.Z,(0,t.Z)((0,t.Z)({ref:D},d),{},{children:m}))}),W=(0,v.G)(I,{valuePropName:"checked"}),u=W;u.Group=_,j.Z=u},5966:function(G,j,e){var t=e(97685),l=e(1413),i=e(91),y=e(21770),R=e(8232),v=e(55241),g=e(97435),O=e(67294),Z=e(53287),_=e(85893),I=["fieldProps","proFieldProps"],W=["fieldProps","proFieldProps"],u="text",c=function(r){var n=r.fieldProps,a=r.proFieldProps,p=(0,i.Z)(r,I);return(0,_.jsx)(Z.Z,(0,l.Z)({valueType:u,fieldProps:n,filedConfig:{valueType:u},proFieldProps:a},p))},D=function(r){var n=(0,y.Z)(r.open||!1,{value:r.open,onChange:r.onOpenChange}),a=(0,t.Z)(n,2),p=a[0],P=a[1];return(0,_.jsx)(R.Z.Item,{shouldUpdate:!0,noStyle:!0,children:function(o){var C,F=o.getFieldValue(r.name||[]);return(0,_.jsx)(v.Z,(0,l.Z)((0,l.Z)({getPopupContainer:function(s){return s&&s.parentNode?s.parentNode:s},onOpenChange:function(s){return P(s)},content:(0,_.jsxs)("div",{style:{padding:"4px 0"},children:[(C=r.statusRender)===null||C===void 0?void 0:C.call(r,F),r.strengthText?(0,_.jsx)("div",{style:{marginTop:10},children:(0,_.jsx)("span",{children:r.strengthText})}):null]}),overlayStyle:{width:240},placement:"rightTop"},r.popoverProps),{},{open:p,children:r.children}))}})},d=function(r){var n=r.fieldProps,a=r.proFieldProps,p=(0,i.Z)(r,W),P=(0,O.useState)(!1),h=(0,t.Z)(P,2),o=h[0],C=h[1];return n!=null&&n.statusRender&&p.name?(0,_.jsx)(D,{name:p.name,statusRender:n==null?void 0:n.statusRender,popoverProps:n==null?void 0:n.popoverProps,strengthText:n==null?void 0:n.strengthText,open:o,onOpenChange:C,children:(0,_.jsx)("div",{children:(0,_.jsx)(Z.Z,(0,l.Z)({valueType:"password",fieldProps:(0,l.Z)((0,l.Z)({},(0,g.Z)(n,["statusRender","popoverProps","strengthText"])),{},{onBlur:function(M){var s;n==null||(s=n.onBlur)===null||s===void 0||s.call(n,M),C(!1)},onClick:function(M){var s;n==null||(s=n.onClick)===null||s===void 0||s.call(n,M),C(!0)}}),proFieldProps:a,filedConfig:{valueType:u}},p))})}):(0,_.jsx)(Z.Z,(0,l.Z)({valueType:"password",fieldProps:n,proFieldProps:a,filedConfig:{valueType:u}},p))},m=c;m.Password=d,m.displayName="ProFormComponent",j.Z=m},34994:function(G,j,e){e.d(j,{A:function(){return s}});var t=e(1413),l=e(8232),i=e(67294),y=e(89671),R=e(9105),v=e(4942),g=e(97685),O=e(87462),Z=e(50756),_=e(57080),I=function(f,A){return i.createElement(_.Z,(0,O.Z)({},f,{ref:A,icon:Z.Z}))},W=i.forwardRef(I),u=W,c=e(21770),D=e(86333),d=e(28459),m=e(78957),T=e(93967),r=e.n(T),n=e(66758),a=e(2514),p=e(98082),P=function(f){return(0,v.Z)({},f.componentCls,{"&-title":{marginBlockEnd:f.marginXL,fontWeight:"bold"},"&-container":(0,v.Z)({flexWrap:"wrap",maxWidth:"100%"},"> div".concat(f.antCls,"-space-item"),{maxWidth:"100%"}),"&-twoLine":(0,v.Z)((0,v.Z)((0,v.Z)((0,v.Z)({display:"block",width:"100%"},"".concat(f.componentCls,"-title"),{width:"100%",margin:"8px 0"}),"".concat(f.componentCls,"-container"),{paddingInlineStart:16}),"".concat(f.antCls,"-space-item,").concat(f.antCls,"-form-item"),{width:"100%"}),"".concat(f.antCls,"-form-item"),{"&-control":{display:"flex",alignItems:"center",justifyContent:"flex-end","&-input":{alignItems:"center",justifyContent:"flex-end","&-content":{flex:"none"}}}})})};function h(x){return(0,p.Xj)("ProFormGroup",function(f){var A=(0,t.Z)((0,t.Z)({},f),{},{componentCls:".".concat(x)});return[P(A)]})}var o=e(85893),C=i.forwardRef(function(x,f){var A=i.useContext(n.Z),b=A.groupProps,E=(0,t.Z)((0,t.Z)({},b),x),Q=E.children,J=E.collapsible,ve=E.defaultCollapsed,me=E.style,pe=E.labelLayout,Y=E.title,N=Y===void 0?x.label:Y,w=E.tooltip,k=E.align,q=k===void 0?"start":k,ee=E.direction,ne=E.size,re=ne===void 0?32:ne,Pe=E.titleStyle,oe=E.titleRender,U=E.spaceProps,z=E.extra,V=E.autoFocus,fe=(0,c.Z)(function(){return ve||!1},{value:x.collapsed,onChange:x.onCollapse}),te=(0,g.Z)(fe,2),H=te[0],Ee=te[1],he=(0,i.useContext)(d.ZP.ConfigContext),Ce=he.getPrefixCls,se=(0,a.zx)(x),Me=se.ColWrapper,ae=se.RowWrapper,K=Ce("pro-form-group"),le=h(K),Oe=le.wrapSSR,$=le.hashId,ie=J&&(0,o.jsx)(u,{style:{marginInlineEnd:8},rotate:H?void 0:90}),de=(0,o.jsx)(D.G,{label:ie?(0,o.jsxs)("div",{children:[ie,N]}):N,tooltip:w}),_e=(0,i.useCallback)(function(B){var S=B.children;return(0,o.jsx)(m.Z,(0,t.Z)((0,t.Z)({},U),{},{className:r()("".concat(K,"-container ").concat($),U==null?void 0:U.className),size:re,align:q,direction:ee,style:(0,t.Z)({rowGap:0},U==null?void 0:U.style),children:S}))},[q,K,ee,$,re,U]),ue=oe?oe(de,x):de,De=(0,i.useMemo)(function(){var B=[],S=i.Children.toArray(Q).map(function(L,ge){var X;return i.isValidElement(L)&&L!==null&&L!==void 0&&(X=L.props)!==null&&X!==void 0&&X.hidden?(B.push(L),null):ge===0&&i.isValidElement(L)&&V?i.cloneElement(L,(0,t.Z)((0,t.Z)({},L.props),{},{autoFocus:V})):L});return[(0,o.jsx)(ae,{Wrapper:_e,children:S},"children"),B.length>0?(0,o.jsx)("div",{style:{display:"none"},children:B}):null]},[Q,ae,_e,V]),ce=(0,g.Z)(De,2),xe=ce[0],Re=ce[1];return Oe((0,o.jsx)(Me,{children:(0,o.jsxs)("div",{className:r()(K,$,(0,v.Z)({},"".concat(K,"-twoLine"),pe==="twoLine")),style:me,ref:f,children:[Re,(N||w||z)&&(0,o.jsx)("div",{className:"".concat(K,"-title ").concat($).trim(),style:Pe,onClick:function(){Ee(!H)},children:z?(0,o.jsxs)("div",{style:{display:"flex",width:"100%",alignItems:"center",justifyContent:"space-between"},children:[ue,(0,o.jsx)("span",{onClick:function(S){return S.stopPropagation()},children:z})]}):ue}),(0,o.jsx)("div",{style:{display:J&&H?"none":void 0},children:xe})]})}))});C.displayName="ProForm-Group";var F=C,M=e(4499);function s(x){return(0,o.jsx)(y.I,(0,t.Z)({layout:"vertical",contentRender:function(A,b){return(0,o.jsxs)(o.Fragment,{children:[A,b]})}},x))}s.Group=F,s.useForm=l.Z.useForm,s.Item=M.Z,s.useWatch=l.Z.useWatch,s.ErrorList=l.Z.ErrorList,s.Provider=l.Z.Provider,s.useFormInstance=l.Z.useFormInstance,s.EditOrReadOnlyContext=R.A},85335:function(G,j,e){var t=e(15009),l=e.n(t),i=e(99289),y=e.n(i),R=e(66352),v=e(93410),g=e(34994),O=e(5966),Z=e(63434),_=e(35312),I=e(68872),W=e(67294),u=e(85893),c=function(){var d=(0,_.useParams)(),m=d.id,T=(0,W.useRef)();(0,W.useEffect)(function(){(0,R.Mk)(m).then(function(n){var a;(a=T.current)===null||a===void 0||a.setFields([{name:"name",value:n.name},{name:"active",value:n.active}])})},[m]);var r=function(){var n=y()(l()().mark(function a(p){var P;return l()().wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.next=2,(0,R.Qb)(p);case 2:P=o.sent,P.succeeded?I.ZP.success("Saved!"):I.ZP.error(P.errors[0].description);case 4:case"end":return o.stop()}},a)}));return function(p){return n.apply(this,arguments)}}();return(0,u.jsx)(v.Z,{title:"Info",children:(0,u.jsxs)(g.A,{formRef:T,onFinish:r,children:[(0,u.jsx)(O.Z,{hidden:!0,name:"id",initialValue:m}),(0,u.jsx)(O.Z,{name:"name",label:"Name"}),(0,u.jsx)(Z.Z,{name:"active",label:"Active"})]})})};j.Z=c},3723:function(G,j,e){e.r(j);var t=e(15009),l=e.n(t),i=e(99289),y=e.n(i),R=e(85335),v=e(66352),g=e(63386),O=e(93410),Z=e(34994),_=e(5966),I=e(35312),W=e(68872),u=e(71230),c=e(15746),D=e(67294),d=e(85893),m=function(){var r=(0,D.useRef)(),n=(0,I.useParams)(),a=n.id;(0,D.useEffect)(function(){a&&(0,v.Tu)(a).then(function(P){var h;(h=r.current)===null||h===void 0||h.setFields([{name:"urlSuffix",value:P.urlSuffix},{name:"groupId",value:P.groupId},{name:"title",value:P.title}])})},[a]);var p=function(){var P=y()(l()().mark(function h(o){var C;return l()().wrap(function(M){for(;;)switch(M.prev=M.next){case 0:return M.next=2,(0,v.iH)(a,o);case 2:C=M.sent,C.succeeded&&W.ZP.success("Saved");case 4:case"end":return M.stop()}},h)}));return function(o){return P.apply(this,arguments)}}();return(0,d.jsx)(g._z,{children:(0,d.jsxs)(u.Z,{gutter:16,children:[(0,d.jsx)(c.Z,{md:16,children:(0,d.jsx)(O.Z,{children:(0,d.jsxs)(Z.A,{onFinish:p,formRef:r,children:[(0,d.jsx)(_.Z,{label:"Title",name:"title"}),(0,d.jsx)(_.Z,{label:"Group Id",name:"groupId"}),(0,d.jsx)(_.Z,{label:"Url Suffix",name:"urlSuffix"})]})})}),(0,d.jsx)(c.Z,{md:8,children:(0,d.jsx)(R.Z,{})})]})})};j.default=m}}]);
