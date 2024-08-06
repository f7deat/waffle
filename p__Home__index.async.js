"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3371],{41245:function(z,M,s){s.r(M),s.d(M,{default:function(){return R}});var x=s(5574),_=s.n(x),b=s(12361),a=s(63386),y=s(93410),l=s(71230),p=s(15746),i=s(55054),I=s(63012),d=s(67294),E=s(55375),D=s(55287),K=s(42525),g=s(35312),Y=s(30381),A=s.n(Y),u=s(85893),B=function(){var w=(0,d.useState)([]),j=_()(w,2),C=j[0],U=j[1],P=(0,d.useState)(E.HQ.Article.toString()),T=_()(P,2),m=T[0],$=T[1];(0,d.useEffect)(function(){(0,b.No)(m).then(function(v){U(v)})},[m]);var f=function(){return(0,u.jsx)(K.Rs,{ghost:!0,dataSource:C,metas:{title:{dataIndex:"name",render:function(S,c){return(0,u.jsx)(g.Link,{to:"/catalog/".concat(c.id),children:S})}},description:{render:function(S,c){return(0,u.jsxs)(u.Fragment,{children:[A()(c.modifiedDate).format("DD/MM/YYYY hh:mm")," | ",(0,u.jsx)(D.Z,{})," ",c.viewCount.toLocaleString()]})}}}})};return(0,u.jsx)(u.Fragment,{children:(0,u.jsx)(y.Z,{title:"Top view",tabs:{tabPosition:"top",activeKey:m,onChange:function(h){return $(h)},items:[{label:(0,u.jsx)(g.FormattedMessage,{id:"menu.catalog.article"}),key:E.HQ.Article.toString(),children:(0,u.jsx)(f,{})},{label:(0,u.jsx)(g.FormattedMessage,{id:"menu.ecommerce.product"}),key:E.HQ.Product.toString(),children:(0,u.jsx)(f,{})},{label:"Tag",key:E.HQ.Tag.toString(),children:(0,u.jsx)(f,{})}]}})})},L=B,O=function(){return(0,g.request)("report/activity")},Q=function(){var w=(0,d.useState)(0),j=_()(w,2),C=j[0],U=j[1],P=(0,d.useState)([]),T=_()(P,2),m=T[0],$=T[1],f=(0,d.useState)([]),v=_()(f,2),h=v[0],S=v[1];return(0,d.useEffect)(function(){(0,b._V)().then(function(c){U(c)}),(0,b.tD)().then(function(c){$(c)}),O().then(function(c){return S(c)})},[]),(0,u.jsx)(a._z,{children:(0,u.jsxs)(l.Z,{gutter:16,children:[(0,u.jsx)(p.Z,{span:16,children:(0,u.jsx)(y.Z,{title:"Ho\u1EA1t \u0111\u1ED9ng",headerBordered:!0,children:(0,u.jsx)(I.ColumnChart,{xField:"month",yField:"value",data:h})})}),(0,u.jsxs)(p.Z,{span:8,children:[(0,u.jsxs)(l.Z,{gutter:16,className:"mb-4",children:[(0,u.jsx)(p.Z,{span:12,children:(0,u.jsx)(y.Z,{children:(0,u.jsx)(i.Z,{title:"L\u01B0\u1EE3t xem",value:C})})}),(0,u.jsx)(p.Z,{span:12,children:(0,u.jsx)(y.Z,{children:(0,u.jsx)(i.Z,{title:"B\xE0i vi\u1EBFt",value:0})})})]}),(0,u.jsx)(y.Z,{title:"Catalogs",headerBordered:!0,className:"mb-4",children:(0,u.jsx)(I.PieChart,{angleField:"value",colorField:"label",radius:1,innerRadius:.55,data:m})}),(0,u.jsx)(L,{})]})]})})},R=Q},12361:function(z,M,s){s.d(M,{A$:function(){return K},BA:function(){return L},BP:function(){return E},M0:function(){return S},Mx:function(){return ue},NU:function(){return ee},No:function(){return ae},R4:function(){return I},S8:function(){return u},U4:function(){return te},Z9:function(){return T},_V:function(){return Z},gY:function(){return j},gg:function(){return re},kn:function(){return X},lI:function(){return ne},m_:function(){return $},tD:function(){return J},wu:function(){return v}});var x=s(97857),_=s.n(x),b=s(15009),a=s.n(b),y=s(99289),l=s.n(y),p=s(55375),i=s(35312);function I(t){return d.apply(this,arguments)}function d(){return d=l()(a()().mark(function t(r){return a()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,i.request)("catalog/".concat(r)));case 1:case"end":return e.stop()}},t)})),d.apply(this,arguments)}function E(t){return D.apply(this,arguments)}function D(){return D=l()(a()().mark(function t(r){return a()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,i.request)("catalog/add",{method:"POST",data:r}));case 1:case"end":return e.stop()}},t)})),D.apply(this,arguments)}function K(t,r){return g.apply(this,arguments)}function g(){return g=l()(a()().mark(function t(r,n){return a()().wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt("return",(0,i.request)("catalog/list",{method:"GET",params:_()({viewCount:n.viewCount?n.viewCount==="ascend"?p.BA.Ascending:p.BA.Descending:p.BA.Unspecified,modifiedDate:n.modifiedDate?n.modifiedDate==="ascend"?p.BA.Ascending:p.BA.Descending:p.BA.Unspecified},r)}));case 1:case"end":return o.stop()}},t)})),g.apply(this,arguments)}function Y(){return A.apply(this,arguments)}function A(){return A=_asyncToGenerator(_regeneratorRuntime().mark(function t(){return _regeneratorRuntime().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",request("catalog/tree"));case 1:case"end":return n.stop()}},t)})),A.apply(this,arguments)}function u(t){return B.apply(this,arguments)}function B(){return B=l()(a()().mark(function t(r){return a()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,i.request)("catalog/delete/".concat(r),{method:"POST"}));case 1:case"end":return e.stop()}},t)})),B.apply(this,arguments)}function L(t){return O.apply(this,arguments)}function O(){return O=l()(a()().mark(function t(r){return a()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,i.request)("catalog/save",{method:"POST",data:r}));case 1:case"end":return e.stop()}},t)})),O.apply(this,arguments)}function Q(t){return R.apply(this,arguments)}function R(){return R=_asyncToGenerator(_regeneratorRuntime().mark(function t(r){return _regeneratorRuntime().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",request("catalog/tree-drop",{method:"POST",data:r}));case 1:case"end":return e.stop()}},t)})),R.apply(this,arguments)}function Z(){return w.apply(this,arguments)}function w(){return w=l()(a()().mark(function t(){return a()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,i.request)("catalog/view-count"));case 1:case"end":return n.stop()}},t)})),w.apply(this,arguments)}function j(t){return C.apply(this,arguments)}function C(){return C=l()(a()().mark(function t(r){return a()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,i.request)("catalog/active/".concat(r),{method:"POST"}));case 1:case"end":return e.stop()}},t)})),C.apply(this,arguments)}function U(t){return P.apply(this,arguments)}function P(){return P=_asyncToGenerator(_regeneratorRuntime().mark(function t(r){return _regeneratorRuntime().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",request("catalog/update-thumbnail",{method:"POST",data:r}));case 1:case"end":return e.stop()}},t)})),P.apply(this,arguments)}function T(){return m.apply(this,arguments)}function m(){return m=l()(a()().mark(function t(){return a()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,i.request)("catalog/types"));case 1:case"end":return n.stop()}},t)})),m.apply(this,arguments)}function $(t){return f.apply(this,arguments)}function f(){return f=l()(a()().mark(function t(r){return a()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,i.request)("catalog/list-tag/".concat(r)));case 1:case"end":return e.stop()}},t)})),f.apply(this,arguments)}function v(t){return h.apply(this,arguments)}function h(){return h=l()(a()().mark(function t(r){return a()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,i.request)("catalog/list-tag-select",{params:r}));case 1:case"end":return e.stop()}},t)})),h.apply(this,arguments)}function S(t,r){return c.apply(this,arguments)}function c(){return c=l()(a()().mark(function t(r,n){return a()().wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt("return",(0,i.request)("catalog/list-by-tag/".concat(r),{params:n}));case 1:case"end":return o.stop()}},t)})),c.apply(this,arguments)}function J(){return F.apply(this,arguments)}function F(){return F=l()(a()().mark(function t(){return a()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,i.request)("catalog/pie-chart"));case 1:case"end":return n.stop()}},t)})),F.apply(this,arguments)}function X(t,r){return G.apply(this,arguments)}function G(){return G=l()(a()().mark(function t(r,n){return a()().wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt("return",(0,i.request)("/product/image/save",{method:"POST",data:{urls:r,catalogId:n}}));case 1:case"end":return o.stop()}},t)})),G.apply(this,arguments)}function ee(t){return V.apply(this,arguments)}function V(){return V=l()(a()().mark(function t(r){return a()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,i.request)("/product/image/".concat(r)));case 1:case"end":return e.stop()}},t)})),V.apply(this,arguments)}function te(t){return H.apply(this,arguments)}function H(){return H=l()(a()().mark(function t(r){return a()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,i.request)("/catalog/form-select",{params:r}));case 1:case"end":return e.stop()}},t)})),H.apply(this,arguments)}function re(t){return W.apply(this,arguments)}function W(){return W=l()(a()().mark(function t(r){return a()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,i.request)("/product/save",{method:"POST",data:r}));case 1:case"end":return e.stop()}},t)})),W.apply(this,arguments)}function ne(t){return k.apply(this,arguments)}function k(){return k=l()(a()().mark(function t(r){return a()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,i.request)("/product/".concat(r)));case 1:case"end":return e.stop()}},t)})),k.apply(this,arguments)}function se(t){return q.apply(this,arguments)}function q(){return q=_asyncToGenerator(_regeneratorRuntime().mark(function t(r){return _regeneratorRuntime().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",request("/product/brand/save",{method:"POST",data:r}));case 1:case"end":return e.stop()}},t)})),q.apply(this,arguments)}function ae(t){return N.apply(this,arguments)}function N(){return N=l()(a()().mark(function t(r){return a()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,i.request)("/catalog/top-view",{params:{type:r}}));case 1:case"end":return e.stop()}},t)})),N.apply(this,arguments)}var ue=function(r){return(0,i.request)("catalog/delete-range",{method:"POST",data:r})}}}]);
