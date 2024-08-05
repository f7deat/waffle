"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3427],{84697:function(B,g,n){var v=n(97857),m=n.n(v),P=n(12361),t=n(64317),h=n(85893),_=function(s){return(0,h.jsx)(t.Z,m()(m()({},s),{},{request:P.Z9,label:s.label,name:s.name,initialValue:s.initialValue,rules:[{required:!0}]}))};g.Z=_},37097:function(B,g,n){n.d(g,{l:function(){return h}});var v=n(12361),m=n(64317),P=n(85893),t=function(s){return(0,P.jsx)(m.Z,{showSearch:!0,request:v.wu,label:s.label,name:s.name})},h=t,_=n(84697)},85335:function(B,g,n){var v=n(15009),m=n.n(v),P=n(99289),t=n.n(P),h=n(66352),_=n(93410),c=n(34994),s=n(5966),I=n(63434),j=n(35312),w=n(68872),M=n(67294),D=n(85893),C=function(){var T=(0,j.useParams)(),l=T.id,y=(0,M.useRef)();(0,M.useEffect)(function(){(0,h.Mk)(l).then(function(d){var O;(O=y.current)===null||O===void 0||O.setFields([{name:"name",value:d.name},{name:"active",value:d.active}])})},[l]);var U=function(){var d=t()(m()().mark(function O(p){var R;return m()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,(0,h.Qb)(p);case 2:R=i.sent,R.succeeded?w.ZP.success("Saved!"):w.ZP.error(R.errors[0].description);case 4:case"end":return i.stop()}},O)}));return function(p){return d.apply(this,arguments)}}();return(0,D.jsx)(_.Z,{title:"Info",children:(0,D.jsxs)(c.A,{formRef:y,onFinish:U,children:[(0,D.jsx)(s.Z,{hidden:!0,name:"id",initialValue:l}),(0,D.jsx)(s.Z,{name:"name",label:"Name"}),(0,D.jsx)(I.Z,{name:"active",label:"Active"})]})})};g.Z=C},37017:function(B,g,n){n.r(g);var v=n(15009),m=n.n(v),P=n(99289),t=n.n(P),h=n(37097),_=n(85335),c=n(66352),s=n(63386),I=n(93410),j=n(34994),w=n(5966),M=n(35312),D=n(68872),C=n(71230),A=n(15746),T=n(67294),l=n(85893),y=function(){var d=(0,T.useRef)(),O=(0,M.useParams)(),p=O.id;(0,T.useEffect)(function(){p&&(0,c.Tu)(p).then(function(f){var i,E=f.tagIds&&f.tagIds.length>0?f.tagIds[0]:null;(i=d.current)===null||i===void 0||i.setFields([{name:"title",value:f.title},{name:"tagId",value:E}])})},[p]);var R=function(){var f=t()(m()().mark(function i(E){var K;return m()().wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return E.tagIds=[E.tagId],b.next=3,(0,c.iH)(p,E);case 3:K=b.sent,K.succeeded&&D.ZP.success("Saved");case 5:case"end":return b.stop()}},i)}));return function(E){return f.apply(this,arguments)}}();return(0,l.jsx)(s._z,{children:(0,l.jsxs)(C.Z,{gutter:16,children:[(0,l.jsx)(A.Z,{md:16,children:(0,l.jsx)(I.Z,{children:(0,l.jsxs)(j.A,{onFinish:R,formRef:d,children:[(0,l.jsx)(w.Z,{label:"Title",name:"title"}),(0,l.jsx)(h.l,{name:"tagId",label:"Tag"})]})})}),(0,l.jsx)(A.Z,{md:8,children:(0,l.jsx)(_.Z,{})})]})})};g.default=y},12361:function(B,g,n){n.d(g,{A$:function(){return D},BA:function(){return U},BP:function(){return w},M0:function(){return x},Mx:function(){return ue},NU:function(){return ee},No:function(){return ae},R4:function(){return I},S8:function(){return l},U4:function(){return re},Z9:function(){return b},_V:function(){return R},gY:function(){return i},gg:function(){return ne},kn:function(){return q},lI:function(){return te},m_:function(){return J},tD:function(){return k},wu:function(){return X}});var v=n(97857),m=n.n(v),P=n(15009),t=n.n(P),h=n(99289),_=n.n(h),c=n(55375),s=n(35312);function I(r){return j.apply(this,arguments)}function j(){return j=_()(t()().mark(function r(a){return t()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.request)("catalog/".concat(a)));case 1:case"end":return e.stop()}},r)})),j.apply(this,arguments)}function w(r){return M.apply(this,arguments)}function M(){return M=_()(t()().mark(function r(a){return t()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.request)("catalog/add",{method:"POST",data:a}));case 1:case"end":return e.stop()}},r)})),M.apply(this,arguments)}function D(r,a){return C.apply(this,arguments)}function C(){return C=_()(t()().mark(function r(a,u){return t()().wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt("return",(0,s.request)("catalog/list",{method:"GET",params:m()({viewCount:u.viewCount?u.viewCount==="ascend"?c.BA.Ascending:c.BA.Descending:c.BA.Unspecified,modifiedDate:u.modifiedDate?u.modifiedDate==="ascend"?c.BA.Ascending:c.BA.Descending:c.BA.Unspecified},a)}));case 1:case"end":return o.stop()}},r)})),C.apply(this,arguments)}function A(){return T.apply(this,arguments)}function T(){return T=_asyncToGenerator(_regeneratorRuntime().mark(function r(){return _regeneratorRuntime().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.abrupt("return",request("catalog/tree"));case 1:case"end":return u.stop()}},r)})),T.apply(this,arguments)}function l(r){return y.apply(this,arguments)}function y(){return y=_()(t()().mark(function r(a){return t()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.request)("catalog/delete/".concat(a),{method:"POST"}));case 1:case"end":return e.stop()}},r)})),y.apply(this,arguments)}function U(r){return d.apply(this,arguments)}function d(){return d=_()(t()().mark(function r(a){return t()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.request)("catalog/save",{method:"POST",data:a}));case 1:case"end":return e.stop()}},r)})),d.apply(this,arguments)}function O(r){return p.apply(this,arguments)}function p(){return p=_asyncToGenerator(_regeneratorRuntime().mark(function r(a){return _regeneratorRuntime().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",request("catalog/tree-drop",{method:"POST",data:a}));case 1:case"end":return e.stop()}},r)})),p.apply(this,arguments)}function R(){return f.apply(this,arguments)}function f(){return f=_()(t()().mark(function r(){return t()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.abrupt("return",(0,s.request)("catalog/view-count"));case 1:case"end":return u.stop()}},r)})),f.apply(this,arguments)}function i(r){return E.apply(this,arguments)}function E(){return E=_()(t()().mark(function r(a){return t()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.request)("catalog/active/".concat(a),{method:"POST"}));case 1:case"end":return e.stop()}},r)})),E.apply(this,arguments)}function K(r){return W.apply(this,arguments)}function W(){return W=_asyncToGenerator(_regeneratorRuntime().mark(function r(a){return _regeneratorRuntime().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",request("catalog/update-thumbnail",{method:"POST",data:a}));case 1:case"end":return e.stop()}},r)})),W.apply(this,arguments)}function b(){return L.apply(this,arguments)}function L(){return L=_()(t()().mark(function r(){return t()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.abrupt("return",(0,s.request)("catalog/types"));case 1:case"end":return u.stop()}},r)})),L.apply(this,arguments)}function J(r){return $.apply(this,arguments)}function $(){return $=_()(t()().mark(function r(a){return t()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.request)("catalog/list-tag/".concat(a)));case 1:case"end":return e.stop()}},r)})),$.apply(this,arguments)}function X(r){return S.apply(this,arguments)}function S(){return S=_()(t()().mark(function r(a){return t()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.request)("catalog/list-tag-select",{params:a}));case 1:case"end":return e.stop()}},r)})),S.apply(this,arguments)}function x(r,a){return Z.apply(this,arguments)}function Z(){return Z=_()(t()().mark(function r(a,u){return t()().wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt("return",(0,s.request)("catalog/list-by-tag/".concat(a),{params:u}));case 1:case"end":return o.stop()}},r)})),Z.apply(this,arguments)}function k(){return F.apply(this,arguments)}function F(){return F=_()(t()().mark(function r(){return t()().wrap(function(u){for(;;)switch(u.prev=u.next){case 0:return u.abrupt("return",(0,s.request)("catalog/pie-chart"));case 1:case"end":return u.stop()}},r)})),F.apply(this,arguments)}function q(r,a){return G.apply(this,arguments)}function G(){return G=_()(t()().mark(function r(a,u){return t()().wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt("return",(0,s.request)("/product/image/save",{method:"POST",data:{urls:a,catalogId:u}}));case 1:case"end":return o.stop()}},r)})),G.apply(this,arguments)}function ee(r){return V.apply(this,arguments)}function V(){return V=_()(t()().mark(function r(a){return t()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.request)("/product/image/".concat(a)));case 1:case"end":return e.stop()}},r)})),V.apply(this,arguments)}function re(r){return N.apply(this,arguments)}function N(){return N=_()(t()().mark(function r(a){return t()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.request)("/catalog/form-select",{params:a}));case 1:case"end":return e.stop()}},r)})),N.apply(this,arguments)}function ne(r){return z.apply(this,arguments)}function z(){return z=_()(t()().mark(function r(a){return t()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.request)("/product/save",{method:"POST",data:a}));case 1:case"end":return e.stop()}},r)})),z.apply(this,arguments)}function te(r){return H.apply(this,arguments)}function H(){return H=_()(t()().mark(function r(a){return t()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.request)("/product/".concat(a)));case 1:case"end":return e.stop()}},r)})),H.apply(this,arguments)}function se(r){return Q.apply(this,arguments)}function Q(){return Q=_asyncToGenerator(_regeneratorRuntime().mark(function r(a){return _regeneratorRuntime().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",request("/product/brand/save",{method:"POST",data:a}));case 1:case"end":return e.stop()}},r)})),Q.apply(this,arguments)}function ae(r){return Y.apply(this,arguments)}function Y(){return Y=_()(t()().mark(function r(a){return t()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,s.request)("/catalog/top-view",{params:{type:a}}));case 1:case"end":return e.stop()}},r)})),Y.apply(this,arguments)}var ue=function(a){return(0,s.request)("catalog/delete-range",{method:"POST",data:a})}}}]);
