"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[1689],{57584:function(C,t,_){var u=_(97857),o=_.n(u),d=_(64317),P=_(85893),l=function(m){return(0,P.jsx)(d.Z,o()({label:"Item per row",name:"itemPerRow",options:[{label:"Desktop 2 - Mobile 2",value:"col-6"},{label:"Desktop 6 - Mobile 2",value:"col-6 col-md-2"},{label:"Desktop 4 - Mobile 2",value:"col-6 col-md-3"}]},m))};t.Z=l},85335:function(C,t,_){var u=_(15009),o=_.n(u),d=_(99289),P=_.n(d),l=_(66352),f=_(93410),m=_(34994),v=_(5966),p=_(63434),T=_(35312),O=_(68872),c=_(67294),r=_(85893),I=function(){var j=(0,T.useParams)(),E=j.id,e=(0,c.useRef)();(0,c.useEffect)(function(){(0,l.Mk)(E).then(function(M){var s;(s=e.current)===null||s===void 0||s.setFields([{name:"name",value:M.name},{name:"active",value:M.active}])})},[E]);var A=function(){var M=P()(o()().mark(function s(R){var a;return o()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,(0,l.Qb)(R);case 2:a=n.sent,a.succeeded?O.ZP.success("Saved!"):O.ZP.error(a.errors[0].description);case 4:case"end":return n.stop()}},s)}));return function(R){return M.apply(this,arguments)}}();return(0,r.jsx)(f.Z,{title:"Info",children:(0,r.jsxs)(m.A,{formRef:e,onFinish:A,children:[(0,r.jsx)(v.Z,{hidden:!0,name:"id",initialValue:E}),(0,r.jsx)(v.Z,{name:"name",label:"Name"}),(0,r.jsx)(p.Z,{name:"active",label:"Active"})]})})};t.Z=I},6306:function(C,t,_){_.r(t);var u=_(15009),o=_.n(u),d=_(99289),P=_.n(d),l=_(57584),f=_(85335),m=_(66352),v=_(63386),p=_(93410),T=_(34994),O=_(5966),c=_(31199),r=_(35312),I=_(68872),L=_(71230),j=_(15746),E=_(67294),e=_(85893),A=function(){var s=(0,E.useRef)(),R=(0,r.useParams)(),a=R.id;(0,E.useEffect)(function(){a&&(0,m.Tu)(a).then(function(n){var i;(i=s.current)===null||i===void 0||i.setFields([{name:"title",value:n.title},{name:"itemPerRow",value:n.itemPerRow},{name:"pageSize",value:n.pageSize}])})},[a]);var W=function(){var n=P()(o()().mark(function i(h){var B;return o()().wrap(function(D){for(;;)switch(D.prev=D.next){case 0:return D.next=2,(0,m.iH)(a,h);case 2:B=D.sent,B.succeeded&&I.ZP.success("Saved");case 4:case"end":return D.stop()}},i)}));return function(h){return n.apply(this,arguments)}}();return(0,e.jsx)(v._z,{children:(0,e.jsxs)(L.Z,{gutter:16,children:[(0,e.jsx)(j.Z,{md:16,children:(0,e.jsx)(p.Z,{children:(0,e.jsxs)(T.A,{onFinish:W,formRef:s,children:[(0,e.jsx)(O.Z,{label:"Title",name:"title"}),(0,e.jsx)(l.Z,{}),(0,e.jsx)(c.Z,{label:"Page size",name:"pageSize"})]})})}),(0,e.jsx)(j.Z,{md:8,children:(0,e.jsx)(f.Z,{})})]})})};t.default=A}}]);
