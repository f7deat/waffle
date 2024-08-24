"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4165],{1913:function(Y,y,e){var R=e(15009),i=e.n(R),S=e(99289),t=e.n(S),I=e(5574),_=e.n(I),c=e(20385),l=e(64082),P=e(16596),E=e(35312),D=e(78367),A=e(68872),d=e(17788),C=e(14726),$=e(96074),U=e(55102),m=e(67294),f=e(85893),O=D.Z.Dragger,M=function(j){var Z=(0,m.useState)(""),L=_()(Z,2),w=L[0],a=L[1];function g(h){var v;try{v=new URL(h)}catch(F){return!1}return v.protocol==="https:"}var o=function(){var h=t()(i()().mark(function v(F){var W;return i()().wrap(function(x){for(;;)switch(x.prev=x.next){case 0:if(g(F)){x.next=3;break}return A.ZP.error("Sorry, URL failed to upload."),x.abrupt("return");case 3:return x.next=5,(0,c.tg)(F);case 5:W=x.sent,W.succeeded&&A.ZP.success("Uploaded!");case 7:case"end":return x.stop()}},v)}));return function(F){return h.apply(this,arguments)}}(),p=function(){var h=t()(i()().mark(function v(){return i()().wrap(function(W){for(;;)switch(W.prev=W.next){case 0:if(g(w)){W.next=3;break}return A.ZP.error("Sorry, URL failed to upload."),W.abrupt("return");case 3:j.onFinish(w),j.onCancel();case 5:case"end":return W.stop()}},v)}));return function(){return h.apply(this,arguments)}}();return(0,f.jsxs)(d.Z,{open:j.open,onCancel:function(){return j.onCancel()},centered:!0,title:"Upload",onOk:p,children:[(0,f.jsx)("div",{className:"mb-4",children:(0,f.jsxs)(O,{children:[(0,f.jsx)("p",{className:"ant-upload-drag-icon",children:(0,f.jsx)(l.Z,{})}),(0,f.jsx)("p",{className:"ant-upload-text",children:"Click or drag file to this area to upload"}),(0,f.jsx)("p",{className:"ant-upload-hint",children:"Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files."})]})}),(0,f.jsx)("div",{className:"text-center",children:(0,f.jsx)(C.ZP,{icon:(0,f.jsx)(P.Z,{}),type:"link",size:"large",children:(0,f.jsx)("b",{children:"Choose from your computer"})})}),(0,f.jsx)($.Z,{children:(0,f.jsx)(E.FormattedMessage,{id:"general.or"})}),(0,f.jsx)(U.Z,{placeholder:"Paste image or URL",onChange:function(v){return a(v.currentTarget.value)}})]})};y.Z=M},29694:function(Y,y,e){var R=e(97857),i=e.n(R),S=e(5574),t=e.n(S),I=e(12361),_=e(34994),c=e(5966),l=e(64317),P=e(78045),E=e(71230),D=e(15746),A=e(67294),d=e(85893),C=function(U){var m=_.A.useFormInstance(),f=(0,A.useState)("internal"),O=t()(f,2),M=O[0],B=O[1];return(0,d.jsxs)(_.A.Item,i()(i()({},U),{},{children:[(0,d.jsx)(P.ZP.Group,{options:[{label:"Li\xEAn k\u1EBFt n\u1ED9i b\u1ED9",value:"internal"},{label:"Li\xEAn k\u1EBFt ngo\xE0i",value:"external"}],value:M,onChange:function(Z){return B(Z.target.value)},className:"mb-2"}),M==="internal"&&(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(c.Z,{name:"name",hidden:!0}),(0,d.jsxs)(E.Z,{gutter:16,children:[(0,d.jsx)(D.Z,{md:18,children:(0,d.jsx)(l.Z,{allowClear:!1,rules:[{required:!0}],showSearch:!0,request:I.eL,label:"Ch\u1ECDn li\xEAn k\u1EBFt",name:"href",onChange:function(Z,L){m.setFieldValue("name",L.title)}})}),(0,d.jsx)(D.Z,{md:6,children:(0,d.jsx)(l.Z,{name:"target",label:"Target",allowClear:!0,options:[{value:"_blank",label:"Open in new tab"}]})})]})]}),M==="external"&&(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(c.Z,{name:"name",label:"Name",rules:[{required:!0}]}),(0,d.jsxs)(E.Z,{gutter:16,children:[(0,d.jsx)(D.Z,{md:18,children:(0,d.jsx)(c.Z,{name:"href",placeholder:"https://",label:"URL",rules:[{required:!0}]})}),(0,d.jsx)(D.Z,{md:6,children:(0,d.jsx)(l.Z,{name:"target",label:"Target",allowClear:!0,options:[{value:"_blank",label:"Open in new tab"}]})})]})]})]}))};y.Z=C},19489:function(Y,y,e){var R=e(5251),i=e(69753),S=e(93410),t=e(35312),I=e(55060),_=e(32983),c=e(14726),l=e(96074),P=e(26412),E=e(85893),D=function(d){var C,$=["image/jpeg","image/png","image/webp",".svg",".jpg",".png",".jpeg"],U=(0,t.useIntl)(),m=d.file,f=function(){d.onChange&&d.onChange()},O=function(){var B;return $.includes((B=m==null?void 0:m.type)!==null&&B!==void 0?B:"")?(0,E.jsx)("div",{className:"flex justify-center items-center",style:{minHeight:130},children:(0,E.jsx)(I.Z,{src:(0,R.Er)(m==null?void 0:m.url)})}):(0,E.jsx)("div",{onClick:f,children:(0,E.jsx)(_.Z,{})})};return(0,E.jsxs)(S.Z,{title:U.formatMessage({id:"general.preview"}),actions:[(0,E.jsx)(c.ZP,{type:"link",onClick:function(){return window.location.href=(0,R.Er)(m==null?void 0:m.url)},icon:(0,E.jsx)(i.Z,{}),children:"Download"},"download")],children:[O(),(0,E.jsx)(l.Z,{}),(0,E.jsxs)(P.Z,{title:"File info",column:1,children:[(0,E.jsx)(P.Z.Item,{label:"Name",children:m==null?void 0:m.name}),(0,E.jsxs)(P.Z.Item,{label:"Size",children:[(((C=m==null?void 0:m.size)!==null&&C!==void 0?C:0)/1024).toFixed(2)," KB"]}),(0,E.jsx)(P.Z.Item,{label:"Type",children:m==null?void 0:m.type})]})]})};y.Z=D},28301:function(Y,y,e){e.r(y);var R=e(15009),i=e.n(R),S=e(99289),t=e.n(S),I=e(5574),_=e.n(I),c=e(1913),l=e(29694),P=e(19489),E=e(66352),D=e(82061),A=e(82826),d=e(14361),C=e(63386),$=e(93410),U=e(34994),m=e(5966),f=e(35312),O=e(68872),M=e(78957),B=e(86738),j=e(14726),Z=e(71230),L=e(15746),w=e(67294),a=e(85893),g=function(){var p=(0,f.useParams)(),h=p.id,v=(0,f.useIntl)(),F=(0,w.useState)(),W=_()(F,2),H=W[0],x=W[1],Q=(0,w.useState)(!1),ne=_()(Q,2),X=ne[0],k=ne[1],J=(0,w.useRef)(),re=function(){var K=t()(i()().mark(function T(N){var z;return i()().wrap(function(G){for(;;)switch(G.prev=G.next){case 0:return G.next=2,(0,E.iH)(h,N);case 2:z=G.sent,z.succeeded?O.ZP.success("Saved!"):O.ZP.error(z.errors[0].description);case 4:case"end":return G.stop()}},T)}));return function(N){return K.apply(this,arguments)}}();(0,w.useEffect)(function(){(0,E.Tu)(h).then(function(K){var T;x(K.file),(T=J.current)===null||T===void 0||T.setFields([{name:"alt",value:K.alt},{name:"src",value:K.src},{name:"link",value:K.link}])})},[]);var q=function(){var K=t()(i()().mark(function T(){var N;return i()().wrap(function(V){for(;;)switch(V.prev=V.next){case 0:return V.next=2,(0,E.Js)(h);case 2:N=V.sent,N.succeeded?(O.ZP.success(v.formatMessage({id:"general.deleted"})),f.history.back()):O.ZP.error(N.errors[0].description);case 4:case"end":return V.stop()}},T)}));return function(){return K.apply(this,arguments)}}(),te=(0,a.jsxs)(M.Z,{children:[(0,a.jsx)(B.Z,{title:"Are you sure?",onConfirm:q,children:(0,a.jsx)(j.ZP,{type:"primary",danger:!0,icon:(0,a.jsx)(D.Z,{}),children:"Delete"})}),(0,a.jsx)(j.ZP,{icon:(0,a.jsx)(A.Z,{}),onClick:function(){return f.history.back()},children:"Back"}),(0,a.jsx)(j.ZP,{icon:(0,a.jsx)(d.Z,{})})]}),ee=function(T){x(T),k(!1)};return(0,a.jsxs)(C._z,{title:"Image",extra:te,children:[(0,a.jsxs)(Z.Z,{gutter:16,children:[(0,a.jsx)(L.Z,{span:6,children:(0,a.jsx)(P.Z,{file:H,onChange:function(){return k(!0)}})}),(0,a.jsx)(L.Z,{span:18,children:(0,a.jsx)($.Z,{title:v.formatMessage({id:"menu.settings"}),children:(0,a.jsxs)(U.A,{onFinish:re,formRef:J,children:[(0,a.jsx)(m.Z,{name:"src",label:"Src"}),(0,a.jsx)(l.Z,{name:"link",label:"Link"}),(0,a.jsx)(m.Z,{name:"alt",label:"Alt"})]})})})]}),(0,a.jsx)(c.Z,{open:X,onCancel:k,onFinish:ee})]})};y.default=g},12361:function(Y,y,e){e.d(y,{A$:function(){return d},BA:function(){return O},BP:function(){return D},M0:function(){return x},Mx:function(){return se},NU:function(){return re},No:function(){return ue},R4:function(){return P},S8:function(){return m},U4:function(){return te},Yj:function(){return p},_V:function(){return Z},e1:function(){return _e},eL:function(){return ie},gY:function(){return w},gg:function(){return K},kn:function(){return k},lI:function(){return N},m_:function(){return v},qn:function(){return le},tD:function(){return ne},wu:function(){return W}});var R=e(97857),i=e.n(R),S=e(15009),t=e.n(S),I=e(99289),_=e.n(I),c=e(55375),l=e(35312);function P(r){return E.apply(this,arguments)}function E(){return E=_()(t()().mark(function r(u){return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,l.request)("catalog/".concat(u)));case 1:case"end":return n.stop()}},r)})),E.apply(this,arguments)}function D(r){return A.apply(this,arguments)}function A(){return A=_()(t()().mark(function r(u){return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,l.request)("catalog/add",{method:"POST",data:u}));case 1:case"end":return n.stop()}},r)})),A.apply(this,arguments)}function d(r,u){return C.apply(this,arguments)}function C(){return C=_()(t()().mark(function r(u,s){return t()().wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return b.abrupt("return",(0,l.request)("catalog/list",{method:"GET",params:i()({viewCount:s.viewCount?s.viewCount==="ascend"?c.BA.Ascending:c.BA.Descending:c.BA.Unspecified,modifiedDate:s.modifiedDate?s.modifiedDate==="ascend"?c.BA.Ascending:c.BA.Descending:c.BA.Unspecified},u)}));case 1:case"end":return b.stop()}},r)})),C.apply(this,arguments)}function $(){return U.apply(this,arguments)}function U(){return U=_asyncToGenerator(_regeneratorRuntime().mark(function r(){return _regeneratorRuntime().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.abrupt("return",request("catalog/tree"));case 1:case"end":return s.stop()}},r)})),U.apply(this,arguments)}function m(r){return f.apply(this,arguments)}function f(){return f=_()(t()().mark(function r(u){return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,l.request)("catalog/delete/".concat(u),{method:"POST"}));case 1:case"end":return n.stop()}},r)})),f.apply(this,arguments)}function O(r){return M.apply(this,arguments)}function M(){return M=_()(t()().mark(function r(u){return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,l.request)("catalog/save",{method:"POST",data:u}));case 1:case"end":return n.stop()}},r)})),M.apply(this,arguments)}function B(r){return j.apply(this,arguments)}function j(){return j=_asyncToGenerator(_regeneratorRuntime().mark(function r(u){return _regeneratorRuntime().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",request("catalog/tree-drop",{method:"POST",data:u}));case 1:case"end":return n.stop()}},r)})),j.apply(this,arguments)}function Z(){return L.apply(this,arguments)}function L(){return L=_()(t()().mark(function r(){return t()().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.abrupt("return",(0,l.request)("catalog/view-count"));case 1:case"end":return s.stop()}},r)})),L.apply(this,arguments)}function w(r){return a.apply(this,arguments)}function a(){return a=_()(t()().mark(function r(u){return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,l.request)("catalog/active/".concat(u),{method:"POST"}));case 1:case"end":return n.stop()}},r)})),a.apply(this,arguments)}function g(r){return o.apply(this,arguments)}function o(){return o=_asyncToGenerator(_regeneratorRuntime().mark(function r(u){return _regeneratorRuntime().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",request("catalog/update-thumbnail",{method:"POST",data:u}));case 1:case"end":return n.stop()}},r)})),o.apply(this,arguments)}function p(){return h.apply(this,arguments)}function h(){return h=_()(t()().mark(function r(){return t()().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.abrupt("return",(0,l.request)("catalog/types"));case 1:case"end":return s.stop()}},r)})),h.apply(this,arguments)}function v(r){return F.apply(this,arguments)}function F(){return F=_()(t()().mark(function r(u){return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,l.request)("catalog/list-tag/".concat(u)));case 1:case"end":return n.stop()}},r)})),F.apply(this,arguments)}function W(r){return H.apply(this,arguments)}function H(){return H=_()(t()().mark(function r(u){return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,l.request)("catalog/list-tag-select",{params:u}));case 1:case"end":return n.stop()}},r)})),H.apply(this,arguments)}function x(r,u){return Q.apply(this,arguments)}function Q(){return Q=_()(t()().mark(function r(u,s){return t()().wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return b.abrupt("return",(0,l.request)("catalog/list-by-tag/".concat(u),{params:s}));case 1:case"end":return b.stop()}},r)})),Q.apply(this,arguments)}function ne(){return X.apply(this,arguments)}function X(){return X=_()(t()().mark(function r(){return t()().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.abrupt("return",(0,l.request)("catalog/pie-chart"));case 1:case"end":return s.stop()}},r)})),X.apply(this,arguments)}function k(r,u){return J.apply(this,arguments)}function J(){return J=_()(t()().mark(function r(u,s){return t()().wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return b.abrupt("return",(0,l.request)("/product/image/save",{method:"POST",data:{urls:u,catalogId:s}}));case 1:case"end":return b.stop()}},r)})),J.apply(this,arguments)}function re(r){return q.apply(this,arguments)}function q(){return q=_()(t()().mark(function r(u){return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,l.request)("/product/image/".concat(u)));case 1:case"end":return n.stop()}},r)})),q.apply(this,arguments)}function te(r){return ee.apply(this,arguments)}function ee(){return ee=_()(t()().mark(function r(u){return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,l.request)("/catalog/form-select",{params:u}));case 1:case"end":return n.stop()}},r)})),ee.apply(this,arguments)}function K(r){return T.apply(this,arguments)}function T(){return T=_()(t()().mark(function r(u){return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,l.request)("/product/save",{method:"POST",data:u}));case 1:case"end":return n.stop()}},r)})),T.apply(this,arguments)}function N(r){return z.apply(this,arguments)}function z(){return z=_()(t()().mark(function r(u){return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,l.request)("/product/".concat(u)));case 1:case"end":return n.stop()}},r)})),z.apply(this,arguments)}function V(r){return G.apply(this,arguments)}function G(){return G=_asyncToGenerator(_regeneratorRuntime().mark(function r(u){return _regeneratorRuntime().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",request("/product/brand/save",{method:"POST",data:u}));case 1:case"end":return n.stop()}},r)})),G.apply(this,arguments)}function ue(r){return ae.apply(this,arguments)}function ae(){return ae=_()(t()().mark(function r(u){return t()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,l.request)("/catalog/top-view",{params:{type:u}}));case 1:case"end":return n.stop()}},r)})),ae.apply(this,arguments)}var se=function(u){return(0,l.request)("catalog/delete-range",{method:"POST",data:u})},_e=function(u){return(0,l.request)("catalog/setting/".concat(u))},le=function(u,s){return(0,l.request)("catalog/setting/save/".concat(s),{method:"POST",data:u})},ie=function(u){return(0,l.request)("catalog/url-options",{params:u})}},20385:function(Y,y,e){e.d(y,{Ah:function(){return E},Cq:function(){return C},V6:function(){return l},p6:function(){return L},tg:function(){return M},yk:function(){return j},z3:function(){return U}});var R=e(15009),i=e.n(R),S=e(97857),t=e.n(S),I=e(99289),_=e.n(I),c=e(35312);function l(a,g,o){return P.apply(this,arguments)}function P(){return P=_()(i()().mark(function a(g,o,p){return i()().wrap(function(v){for(;;)switch(v.prev=v.next){case 0:return v.abrupt("return",(0,c.request)("file/list",t()({method:"GET",params:t()({type:Object.keys(o!=null?o:[]).length>0?o==null?void 0:o.join(","):""},g)},p||{})));case 1:case"end":return v.stop()}},a)})),P.apply(this,arguments)}function E(a){return D.apply(this,arguments)}function D(){return D=_()(i()().mark(function a(g){return i()().wrap(function(p){for(;;)switch(p.prev=p.next){case 0:return p.abrupt("return",(0,c.request)("file/delete-file-content/".concat(g),{method:"POST"}));case 1:case"end":return p.stop()}},a)})),D.apply(this,arguments)}function A(a){return d.apply(this,arguments)}function d(){return d=_asyncToGenerator(_regeneratorRuntime().mark(function a(g){return _regeneratorRuntime().wrap(function(p){for(;;)switch(p.prev=p.next){case 0:return p.abrupt("return",request("file/delete-file-item",{method:"POST",data:g}));case 1:case"end":return p.stop()}},a)})),d.apply(this,arguments)}function C(a){return $.apply(this,arguments)}function $(){return $=_()(i()().mark(function a(g){return i()().wrap(function(p){for(;;)switch(p.prev=p.next){case 0:return p.abrupt("return",(0,c.request)("file/".concat(g)));case 1:case"end":return p.stop()}},a)})),$.apply(this,arguments)}function U(a,g){return m.apply(this,arguments)}function m(){return m=_()(i()().mark(function a(g,o){return i()().wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return h.abrupt("return",(0,c.request)("file/file-items/".concat(o.id)));case 1:case"end":return h.stop()}},a)})),m.apply(this,arguments)}function f(a){return O.apply(this,arguments)}function O(){return O=_asyncToGenerator(_regeneratorRuntime().mark(function a(g){var o;return _regeneratorRuntime().wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return o=new FormData,o.append("file",g),h.abrupt("return",request("file/upload",{method:"POST",data:o}));case 3:case"end":return h.stop()}},a)})),O.apply(this,arguments)}function M(a){return B.apply(this,arguments)}function B(){return B=_()(i()().mark(function a(g){return i()().wrap(function(p){for(;;)switch(p.prev=p.next){case 0:return p.abrupt("return",(0,c.request)("file/upload-from-url",{method:"POST",data:{url:g}}));case 1:case"end":return p.stop()}},a)})),B.apply(this,arguments)}function j(){return Z.apply(this,arguments)}function Z(){return Z=_()(i()().mark(function a(){return i()().wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt("return",(0,c.request)("file/count"));case 1:case"end":return o.stop()}},a)})),Z.apply(this,arguments)}function L(){return w.apply(this,arguments)}function w(){return w=_()(i()().mark(function a(){return i()().wrap(function(o){for(;;)switch(o.prev=o.next){case 0:return o.abrupt("return",(0,c.request)("file/total-size"));case 1:case"end":return o.stop()}},a)})),w.apply(this,arguments)}},5251:function(Y,y,e){e.d(y,{Er:function(){return t},p6:function(){return I}});var R=e(27484),i=e.n(R);function S(c){return c.trim()}function t(c){return new URL(c||"",localStorage.getItem("wf_URL")||"").href}function I(c){return c?i()(c).format("DD/MM/YYYY hh:mm:ss"):"-"}var _=function(){var l=arguments.length>0&&arguments[0]!==void 0?arguments[0]:100;return new Promise(function(P){setTimeout(function(){P(!0)},l)})}}}]);
