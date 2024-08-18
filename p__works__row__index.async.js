"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[649],{82826:function(w,y,e){e.d(y,{Z:function(){return j}});var d=e(1413),a=e(67294),M={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M872 474H286.9l350.2-304c5.6-4.9 2.2-14-5.2-14h-88.5c-3.9 0-7.6 1.4-10.5 3.9L155 487.8a31.96 31.96 0 000 48.3L535.1 866c1.5 1.3 3.3 2 5.2 2h91.5c7.4 0 10.8-9.2 5.2-14L286.9 550H872c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"}}]},name:"arrow-left",theme:"outlined"},i=M,m=e(91146),x=function(O,u){return a.createElement(m.Z,(0,d.Z)((0,d.Z)({},O),{},{ref:u,icon:i}))},o=a.forwardRef(x),j=o},64317:function(w,y,e){var d=e(1413),a=e(91),M=e(22270),i=e(67294),m=e(66758),x=e(53287),o=e(85893),j=["fieldProps","children","params","proFieldProps","mode","valueEnum","request","showSearch","options"],Z=["fieldProps","children","params","proFieldProps","mode","valueEnum","request","options"],O=function(p,C){var g=p.fieldProps,R=p.children,r=p.params,s=p.proFieldProps,f=p.mode,t=p.valueEnum,v=p.request,S=p.showSearch,A=p.options,K=(0,a.Z)(p,j),Q=(0,i.useContext)(m.Z);return(0,o.jsx)(x.Z,(0,d.Z)((0,d.Z)({valueEnum:(0,M.h)(t),request:v,params:r,valueType:"select",filedConfig:{customLightMode:!0},fieldProps:(0,d.Z)({options:A,mode:f,showSearch:S,getPopupContainer:Q.getPopupContainer},g),ref:C,proFieldProps:s},K),{},{children:R}))},u=i.forwardRef(function(l,p){var C=l.fieldProps,g=l.children,R=l.params,r=l.proFieldProps,s=l.mode,f=l.valueEnum,t=l.request,v=l.options,S=(0,a.Z)(l,Z),A=(0,d.Z)({options:v,mode:s||"multiple",labelInValue:!0,showSearch:!0,suffixIcon:null,autoClearSearchValue:!0,optionLabelProp:"label"},C),K=(0,i.useContext)(m.Z);return(0,o.jsx)(x.Z,(0,d.Z)((0,d.Z)({valueEnum:(0,M.h)(f),request:t,params:R,valueType:"select",filedConfig:{customLightMode:!0},fieldProps:(0,d.Z)({getPopupContainer:K.getPopupContainer},A),ref:p,proFieldProps:r},S),{},{children:g}))}),I=i.forwardRef(O),c=u,F=I;F.SearchSelect=c,F.displayName="ProFormComponent",y.Z=F},18576:function(w,y,e){e.d(y,{Z:function(){return u}});var d=e(97857),a=e.n(d),M=e(37476),i=e(5966),m=e(98364),x=e(64317),o=e(85893),j=function(c){return(0,o.jsx)(x.Z,{showSearch:!0,request:m.Ef,name:c.name,label:c.label,rules:[{required:!0}]})},Z=j,O=function(c){return(0,o.jsxs)(M.Y,a()(a()({},c),{},{title:"Add component",children:[(0,o.jsx)(i.Z,{name:"name",label:"Name"}),(0,o.jsx)(Z,{name:"componentId",label:"Component"})]}))},u=O},85335:function(w,y,e){var d=e(15009),a=e.n(d),M=e(99289),i=e.n(M),m=e(66352),x=e(93410),o=e(34994),j=e(5966),Z=e(63434),O=e(35312),u=e(68872),I=e(67294),c=e(85893),F=function(){var p=(0,O.useParams)(),C=p.id,g=(0,I.useRef)();(0,I.useEffect)(function(){(0,m.Mk)(C).then(function(r){var s;(s=g.current)===null||s===void 0||s.setFields([{name:"name",value:r.name},{name:"active",value:r.active}])})},[C]);var R=function(){var r=i()(a()().mark(function s(f){var t;return a()().wrap(function(S){for(;;)switch(S.prev=S.next){case 0:return S.next=2,(0,m.Qb)(f);case 2:t=S.sent,t.succeeded?u.ZP.success("Saved!"):u.ZP.error(t.errors[0].description);case 4:case"end":return S.stop()}},s)}));return function(f){return r.apply(this,arguments)}}();return(0,c.jsx)(x.Z,{title:"Info",children:(0,c.jsxs)(o.A,{formRef:g,onFinish:R,children:[(0,c.jsx)(j.Z,{hidden:!0,name:"id",initialValue:C}),(0,c.jsx)(j.Z,{name:"name",label:"Name"}),(0,c.jsx)(Z.Z,{name:"active",label:"Active"})]})})};y.Z=F},60168:function(w,y,e){e.r(y),e.d(y,{default:function(){return de}});var d=e(5574),a=e.n(d),M=e(85335),i=e(82826),m=e(63386),x=e(93410),o=e(35312),j=e(14726),Z=e(71230),O=e(15746),u=e(67294),I=e(97857),c=e.n(I),F=e(15009),l=e.n(F),p=e(99289),C=e.n(p),g=e(66352),R=e(47389),r=e(82061),s=e(51042),f=e(62763),t=e(37476),v=e(5966),S=e(64317),A=e(68872),K=e(86738),Q=e(78957),te=e(32983),re=e(18576),n=e(85893),ae=function(){var U=(0,o.useParams)(),L=U.id,B=(0,o.useIntl)(),N=(0,u.useState)([]),T=a()(N,2),b=T[0],$=T[1],V=(0,u.useState)(!1),X=a()(V,2),W=X[0],Y=X[1],me=(0,u.useState)(""),q=a()(me,2),ce=q[0],pe=q[1],fe=(0,u.useState)(!1),ee=a()(fe,2),ve=ee[0],J=ee[1],G=function(){(0,g.RI)(L).then(function(P){$(P||[])})};(0,u.useEffect)(function(){L&&G()},[L]);var he=function(){var h=C()(l()().mark(function P(E){var _;return l()().wrap(function(D){for(;;)switch(D.prev=D.next){case 0:return E.rowId=L,D.next=3,(0,g.Wf)(E);case 3:_=D.sent,_.succeeded?(A.ZP.success("Added!"),J(!1),G()):A.ZP.error(_.errors[0].description);case 5:case"end":return D.stop()}},P)}));return function(E){return h.apply(this,arguments)}}(),Pe=function(){var h=C()(l()().mark(function P(E){var _,H;return l()().wrap(function(z){for(;;)switch(z.prev=z.next){case 0:return _=c()({active:!0,parentId:ce},E),z.next=3,(0,g.XQ)(_);case 3:H=z.sent,H.succeeded&&(A.ZP.success("Added!"),Y(!1),G());case 5:case"end":return z.stop()}},P)}));return function(E){return h.apply(this,arguments)}}(),ne=function(){var h=C()(l()().mark(function P(E){var _;return l()().wrap(function(D){for(;;)switch(D.prev=D.next){case 0:return D.next=2,(0,g.Js)(E);case 2:_=D.sent,_.succeeded?(A.ZP.success(B.formatMessage({id:"general.deleted"})),G()):A.ZP.error(_.errors[0].description);case 4:case"end":return D.stop()}},P)}));return function(E){return h.apply(this,arguments)}}(),Ee=function(P){return Number(P.split("-")[2])*2},je=[{title:"#",dataIndex:"sort",className:"drag-visible",width:20,align:"center"},{title:"Name",dataIndex:"name"},{title:"Status",dataIndex:"active",valueEnum:{false:{text:"Draft",status:"Default"},true:{text:"Active",status:"Processing"}}},{title:"Action",valueType:"option",render:function(P,E){return[(0,n.jsx)(j.ZP,{type:"primary",size:"small",icon:(0,n.jsx)(R.Z,{}),onClick:function(){o.history.push("/works/".concat(E.normalizedName.toLocaleLowerCase(),"/").concat(E.id))}},1),(0,n.jsx)(K.Z,{title:"Are you sure?",onConfirm:function(){return ne(E.id)},children:(0,n.jsx)(j.ZP,{icon:(0,n.jsx)(r.Z,{}),danger:!0,size:"small",type:"primary"})},4)]},width:70}],Ce=function(P){var E=P.map(function(_){return _.id||""});(0,g.pd)(E).then(function(_){_.succeeded&&(G(),A.ZP.success("Saved!"))})};return(0,n.jsxs)("div",{children:[(0,n.jsx)("div",{className:"mb-4 flex justify-end",children:(0,n.jsx)(j.ZP,{icon:(0,n.jsx)(s.Z,{}),type:"primary",onClick:function(){return J(!0)},children:(0,n.jsx)("span",{children:(0,n.jsx)(o.FormattedMessage,{id:"general.new"})})})}),(0,n.jsx)(Z.Z,{gutter:16,children:b.map(function(h,P){return(0,n.jsx)(O.Z,{span:Ee(h.className),children:(0,n.jsx)(x.Z,{title:h.name,bordered:!0,headerBordered:!0,extra:(0,n.jsxs)(Q.Z,{children:[(0,n.jsx)(j.ZP,{type:"primary",icon:(0,n.jsx)(s.Z,{}),onClick:function(){pe(h.id||""),Y(!0)},size:"small"}),(0,n.jsx)(K.Z,{title:"Are you sure?",onConfirm:function(){return ne(h.id)},children:(0,n.jsx)(j.ZP,{type:"primary",danger:!0,icon:(0,n.jsx)(r.Z,{}),size:"small"})})]}),children:h.items&&h.items.length>0?(0,n.jsx)(f.Z,{ghost:!0,search:!1,columns:je,dataSource:h.items,rowKey:"id",dragSortKey:"sort",onDragSortEnd:Ce}):(0,n.jsx)(te.Z,{})})},P)})}),(0,n.jsx)(re.Z,{open:W,onOpenChange:Y,onFinish:Pe}),(0,n.jsxs)(t.Y,{open:ve,onOpenChange:J,onFinish:he,children:[(0,n.jsx)(v.Z,{name:"name",label:"Name",rules:[{required:!0}]}),(0,n.jsx)(S.Z,{label:"Collumn",options:[{label:"col-md-1",value:"col-md-1"},{label:"col-md-2",value:"col-md-2"},{label:"col-md-3",value:"col-md-3"},{label:"col-md-4",value:"col-md-4"},{label:"col-md-5",value:"col-md-5"},{label:"col-md-6",value:"col-md-6"},{label:"col-md-7",value:"col-md-7"},{label:"col-md-8",value:"col-md-8"},{label:"col-md-9",value:"col-md-9"},{label:"col-md-10",value:"col-md-10"},{label:"col-md-11",value:"col-md-11"},{label:"col-md-12",value:"col-md-12"}],name:"className"})]})]})},se=ae,oe=e(34994),le=function(){var U=(0,o.useParams)(),L=U.id,B=(0,u.useRef)();(0,u.useEffect)(function(){(0,g.dM)(L).then(function(T){var b;(b=B.current)===null||b===void 0||b.setFields([{name:"name",value:T.name},{name:"layout",value:T.layout},{name:"className",value:T.className},{name:"gap",value:T.gap}])})},[]);var N=function(){var T=C()(l()().mark(function b($){var V;return l()().wrap(function(W){for(;;)switch(W.prev=W.next){case 0:return $.id=L,W.next=3,(0,g.n5)($);case 3:V=W.sent,V.succeeded&&A.ZP.success("Saved!");case 5:case"end":return W.stop()}},b)}));return function($){return T.apply(this,arguments)}}();return(0,n.jsxs)(oe.A,{onFinish:N,formRef:B,children:[(0,n.jsx)(v.Z,{name:"name",label:"Name"}),(0,n.jsx)(v.Z,{name:"className",label:"Class name"}),(0,n.jsx)(S.Z,{name:"layout",label:"Layout",options:[{label:"Full width",value:"container-fluid"},{label:"Container",value:"container"}]}),(0,n.jsx)(S.Z,{name:"gap",label:"Gap",options:[{label:"0",value:"gap-0"},{label:"4",value:"gap-4"}]})]})},ue=le,ie=function(){var U=(0,u.useState)("content"),L=a()(U,2),B=L[0],N=L[1];return(0,n.jsx)(m._z,{extra:(0,n.jsx)(j.ZP,{icon:(0,n.jsx)(i.Z,{}),onClick:function(){return o.history.back()},children:(0,n.jsx)("span",{children:(0,n.jsx)(o.FormattedMessage,{id:"general.back"})})}),children:(0,n.jsxs)(Z.Z,{gutter:16,children:[(0,n.jsx)(O.Z,{span:18,children:(0,n.jsx)(x.Z,{tabs:{activeKey:B,items:[{label:"Content",key:"content",children:(0,n.jsx)(se,{})},{label:(0,n.jsx)(o.FormattedMessage,{id:"menu.settings"}),key:"setting",children:(0,n.jsx)(ue,{})}],onChange:function(b){N(b)}}})}),(0,n.jsx)(O.Z,{span:6,children:(0,n.jsx)(M.Z,{})})]})})},de=ie},98364:function(w,y,e){e.d(y,{CO:function(){return I},Ef:function(){return g},KL:function(){return O},Xr:function(){return x},Z:function(){return F},v7:function(){return p}});var d=e(15009),a=e.n(d),M=e(99289),i=e.n(M),m=e(35312);function x(r){return o.apply(this,arguments)}function o(){return o=i()(a()().mark(function r(s){return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,m.request)("component/".concat(s)));case 1:case"end":return t.stop()}},r)})),o.apply(this,arguments)}function j(r){return Z.apply(this,arguments)}function Z(){return Z=_asyncToGenerator(_regeneratorRuntime().mark(function r(s){return _regeneratorRuntime().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",request("component/add",{method:"POST",data:s}));case 1:case"end":return t.stop()}},r)})),Z.apply(this,arguments)}function O(r){return u.apply(this,arguments)}function u(){return u=i()(a()().mark(function r(s){return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,m.request)("component/update",{method:"POST",data:s}));case 1:case"end":return t.stop()}},r)})),u.apply(this,arguments)}function I(r){return c.apply(this,arguments)}function c(){return c=i()(a()().mark(function r(s){return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,m.request)("component/list",{params:s}));case 1:case"end":return t.stop()}},r)})),c.apply(this,arguments)}function F(r,s){return l.apply(this,arguments)}function l(){return l=i()(a()().mark(function r(s,f){return a()().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return v.abrupt("return",(0,m.request)("component/list-work/".concat(f),{params:s}));case 1:case"end":return v.stop()}},r)})),l.apply(this,arguments)}function p(r){return C.apply(this,arguments)}function C(){return C=i()(a()().mark(function r(s){return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,m.request)("component/delete/".concat(s),{method:"POST"}));case 1:case"end":return t.stop()}},r)})),C.apply(this,arguments)}function g(r){return R.apply(this,arguments)}function R(){return R=i()(a()().mark(function r(s){var f;return a()().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return f={searchTerm:s.keyWords},v.abrupt("return",(0,m.request)("component/form-select",{params:f}));case 2:case"end":return v.stop()}},r)})),R.apply(this,arguments)}}}]);
