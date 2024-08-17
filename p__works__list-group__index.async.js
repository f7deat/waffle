"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[9319],{82826:function(K,v,e){e.d(v,{Z:function(){return m}});var o=e(1413),t=e(67294),M={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"}}]},name:"arrow-left",theme:"outlined"},d=M,P=e(91146),f=function(I,S){return t.createElement(P.Z,(0,o.Z)((0,o.Z)({},I),{},{ref:S,icon:d}))},Z=t.forwardRef(f),m=Z},47389:function(K,v,e){var o=e(1413),t=e(67294),M=e(27363),d=e(91146),P=function(m,A){return t.createElement(d.Z,(0,o.Z)((0,o.Z)({},m),{},{ref:A,icon:M.Z}))},f=t.forwardRef(P);v.Z=f},64317:function(K,v,e){var o=e(1413),t=e(91),M=e(22270),d=e(67294),P=e(66758),f=e(53287),Z=e(85893),m=["fieldProps","children","params","proFieldProps","mode","valueEnum","request","showSearch","options"],A=["fieldProps","children","params","proFieldProps","mode","valueEnum","request","options"],I=function(s,_){var T=s.fieldProps,F=s.children,j=s.params,h=s.proFieldProps,c=s.mode,R=s.valueEnum,B=s.request,O=s.showSearch,$=s.options,G=(0,t.Z)(s,m),w=(0,d.useContext)(P.Z);return(0,Z.jsx)(f.Z,(0,o.Z)((0,o.Z)({valueEnum:(0,M.h)(R),request:B,params:j,valueType:"select",filedConfig:{customLightMode:!0},fieldProps:(0,o.Z)({options:$,mode:c,showSearch:O,getPopupContainer:w.getPopupContainer},T),ref:_,proFieldProps:h},G),{},{children:F}))},S=d.forwardRef(function(l,s){var _=l.fieldProps,T=l.children,F=l.params,j=l.proFieldProps,h=l.mode,c=l.valueEnum,R=l.request,B=l.options,O=(0,t.Z)(l,A),$=(0,o.Z)({options:B,mode:h||"multiple",labelInValue:!0,showSearch:!0,suffixIcon:null,autoClearSearchValue:!0,optionLabelProp:"label"},_),G=(0,d.useContext)(P.Z);return(0,Z.jsx)(f.Z,(0,o.Z)((0,o.Z)({valueEnum:(0,M.h)(c),request:R,params:F,valueType:"select",filedConfig:{customLightMode:!0},fieldProps:(0,o.Z)({getPopupContainer:G.getPopupContainer},$),ref:s,proFieldProps:j},O),{},{children:T}))}),g=d.forwardRef(I),C=S,x=g;x.SearchSelect=C,x.displayName="ProFormComponent",v.Z=x},85335:function(K,v,e){var o=e(15009),t=e.n(o),M=e(99289),d=e.n(M),P=e(66352),f=e(93410),Z=e(34994),m=e(5966),A=e(63434),I=e(35312),S=e(68872),g=e(67294),C=e(85893),x=function(){var s=(0,I.useParams)(),_=s.id,T=(0,g.useRef)();(0,g.useEffect)(function(){(0,P.Mk)(_).then(function(j){var h;(h=T.current)===null||h===void 0||h.setFields([{name:"name",value:j.name},{name:"active",value:j.active}])})},[_]);var F=function(){var j=d()(t()().mark(function h(c){var R;return t()().wrap(function(O){for(;;)switch(O.prev=O.next){case 0:return O.next=2,(0,P.Qb)(c);case 2:R=O.sent,R.succeeded?S.ZP.success("Saved!"):S.ZP.error(R.errors[0].description);case 4:case"end":return O.stop()}},h)}));return function(c){return j.apply(this,arguments)}}();return(0,C.jsx)(f.Z,{title:"Info",children:(0,C.jsxs)(Z.A,{formRef:T,onFinish:F,children:[(0,C.jsx)(m.Z,{hidden:!0,name:"id",initialValue:_}),(0,C.jsx)(m.Z,{name:"name",label:"Name"}),(0,C.jsx)(A.Z,{name:"active",label:"Active"})]})})};v.Z=x},67486:function(K,v,e){e.r(v),e.d(v,{default:function(){return re}});var o=e(15009),t=e.n(o),M=e(99289),d=e.n(M),P=e(5574),f=e.n(P),Z=e(85335),m=e(66352),A=e(63386),I=e(93410),S=e(34994),g=e(5966),C=e(62763),x=e(35312),l=e(68872),s=e(14726),_=e(86738),T=e(71230),F=e(15746),j=e(83062),h=e(96074),c=e(67294),R=e(47389),B=e(82061),O=e(82826),$=e(51042),G=e(37476),w=e(64317),r=e(85893),q=function(N){var y=function(){var z=d()(t()().mark(function H(D){return t()().wrap(function(V){for(;;)switch(V.prev=V.next){case 0:N.onFinish(D);case 1:case"end":return V.stop()}},H)}));return function(D){return z.apply(this,arguments)}}();return(0,r.jsxs)(G.Y,{onFinish:y,open:N.open,onOpenChange:N.onOpenChange,children:[(0,r.jsx)(g.Z,{name:"id",hidden:!0}),(0,r.jsx)(g.Z,{name:"name",label:"Name"}),(0,r.jsx)(g.Z,{name:"href",label:"URL",rules:[{required:!0}]}),(0,r.jsx)(w.Z,{name:"target",label:"Target",allowClear:!0,options:[{value:"_blank",label:"Open in new tab"}]})]})},ee=q,Y=e(89575),ne=function(){var N=(0,x.useParams)(),y=N.id,z=(0,c.useState)(),H=f()(z,2),D=H[0],U=H[1],V=(0,c.useState)(),b=f()(V,2),ae=b[0],J=b[1],X=(0,c.useRef)();(0,c.useEffect)(function(){(0,m.Tu)(y).then(function(u){if(u){var i;U(u),J(u.items),(i=X.current)===null||i===void 0||i.setFields([{name:"name",value:u.name}])}})},[y]);var oe=(0,c.useRef)(),se=(0,c.useState)(!1),k=f()(se,2),ie=k[0],Q=k[1],le=function(){var u=d()(t()().mark(function i(a){var n,L,W,p;return t()().wrap(function(E){for(;;)switch(E.prev=E.next){case 0:if(n=D,!n){E.next=8;break}return L=n.items.filter(function(fe){return fe.id!==a}),n.items=L,E.next=6,(0,m.iH)(y,n);case 6:W=E.sent,W.succeeded&&(l.ZP.success("Deleted!"),U(n),(p=oe.current)===null||p===void 0||p.reload());case 8:case"end":return E.stop()}},i)}));return function(a){return u.apply(this,arguments)}}(),ue=function(){var u=d()(t()().mark(function i(a){var n,L,W,p;return t()().wrap(function(E){for(;;)switch(E.prev=E.next){case 0:return n=D,L={id:(0,Y.k)(),link:{href:a.href,name:a.name,target:a.target,id:(0,Y.k)()}},n!=null&&n.items?n==null||(W=n.items)===null||W===void 0||W.push(L):n.items=[L],E.next=5,(0,m.iH)(y,n);case 5:p=E.sent,p.succeeded&&(U(n),l.ZP.success("Added!"),Q(!1));case 7:case"end":return E.stop()}},i)}));return function(a){return u.apply(this,arguments)}}(),de=function(){var u=d()(t()().mark(function i(a){var n,L;return t()().wrap(function(p){for(;;)switch(p.prev=p.next){case 0:return n={name:"",items:[]},D&&(n=D),n.name=a.name,p.next=5,(0,m.iH)(y,n);case 5:L=p.sent,L.succeeded&&(U(n),l.ZP.success("Saved!"));case 7:case"end":return p.stop()}},i)}));return function(a){return u.apply(this,arguments)}}(),me=[{title:"#",dataIndex:"sort",className:"drag-visible"},{title:"Name",render:function(i,a){var n;return(n=a.link)===null||n===void 0?void 0:n.name}},{title:"Url",render:function(i,a){var n;return(n=a.link)===null||n===void 0?void 0:n.href}},{title:"Action",valueType:"option",render:function(i,a){return[(0,r.jsx)(s.ZP,{type:"primary",icon:(0,r.jsx)(R.Z,{})},1),(0,r.jsx)(_.Z,{title:"Are you sure?",onConfirm:function(){return le(a.id)},children:(0,r.jsx)(s.ZP,{icon:(0,r.jsx)(B.Z,{}),danger:!0,type:"primary"})},4)]}}],ce=function(i){var a=D;a&&(a.items=i),U(a),J(i),l.ZP.success("Saved!")};return(0,r.jsx)(A._z,{title:D==null?void 0:D.name,extra:(0,r.jsx)(s.ZP,{icon:(0,r.jsx)(O.Z,{}),onClick:function(){return history.back()},children:(0,r.jsx)("span",{children:(0,r.jsx)(x.FormattedMessage,{id:"general.back"})})}),children:(0,r.jsxs)(T.Z,{gutter:16,children:[(0,r.jsxs)(F.Z,{span:16,children:[(0,r.jsx)(I.Z,{children:(0,r.jsxs)(S.A,{formRef:X,onFinish:de,children:[(0,r.jsx)(g.Z,{name:"name",label:"Name",rules:[{required:!0}]}),(0,r.jsx)(C.Z,{toolBarRender:function(){return[(0,r.jsx)(j.Z,{title:(0,r.jsx)(x.FormattedMessage,{id:"general.new"}),children:(0,r.jsx)(s.ZP,{type:"link",icon:(0,r.jsx)($.Z,{}),onClick:function(){return Q(!0)}})},"new")]},rowKey:"id",ghost:!0,columns:me,dataSource:ae,pagination:!1,search:!1,dragSortKey:"sort",onDragSortEnd:ce}),(0,r.jsx)(h.Z,{dashed:!0})]})}),(0,r.jsx)(ee,{open:ie,onOpenChange:Q,onFinish:ue})]}),(0,r.jsx)(F.Z,{span:8,children:(0,r.jsx)(Z.Z,{})})]})})},re=ne},89575:function(K,v,e){e.d(v,{k:function(){return o}});function o(){return"10000000-1000-4000-8000-100000000000".replace(/[018]/g,function(t){return(t^crypto.getRandomValues(new Uint8Array(1))[0]&15>>t/4).toString(16)})}}}]);
