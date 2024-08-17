"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4165],{1913:function(k,D,e){var M=e(15009),a=e.n(M),A=e(99289),E=e.n(A),T=e(5574),m=e.n(T),u=e(20385),y=e(64082),_=e(16596),o=e(78367),h=e(68872),S=e(17788),v=e(14726),P=e(96074),f=e(55102),r=e(67294),n=e(85893),W=o.Z.Dragger,x=function(p){var w=(0,r.useState)(""),L=m()(w,2),F=L[0],B=L[1];function l(t){var i;try{i=new URL(t)}catch(g){return!1}return i.protocol==="https:"}var d=function(){var t=E()(a()().mark(function i(g){var C;return a()().wrap(function(j){for(;;)switch(j.prev=j.next){case 0:if(l(g)){j.next=3;break}return h.ZP.error("Sorry, URL failed to upload."),j.abrupt("return");case 3:return j.next=5,(0,u.tg)(g);case 5:C=j.sent,C.succeeded&&h.ZP.success("Uploaded!");case 7:case"end":return j.stop()}},i)}));return function(g){return t.apply(this,arguments)}}(),s=function(){var t=E()(a()().mark(function i(){return a()().wrap(function(C){for(;;)switch(C.prev=C.next){case 0:if(l(F)){C.next=3;break}return h.ZP.error("Sorry, URL failed to upload."),C.abrupt("return");case 3:p.onFinish(F),p.onCancel();case 5:case"end":return C.stop()}},i)}));return function(){return t.apply(this,arguments)}}();return(0,n.jsxs)(S.Z,{open:p.open,onCancel:function(){return p.onCancel()},centered:!0,title:"Upload",onOk:s,children:[(0,n.jsx)("div",{className:"mb-4",children:(0,n.jsxs)(W,{children:[(0,n.jsx)("p",{className:"ant-upload-drag-icon",children:(0,n.jsx)(y.Z,{})}),(0,n.jsx)("p",{className:"ant-upload-text",children:"Click or drag file to this area to upload"}),(0,n.jsx)("p",{className:"ant-upload-hint",children:"Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files."})]})}),(0,n.jsx)("div",{className:"text-center",children:(0,n.jsx)(v.ZP,{icon:(0,n.jsx)(_.Z,{}),type:"link",size:"large",children:(0,n.jsx)("b",{children:"Choose from your computer"})})}),(0,n.jsx)(P.Z,{children:"or"}),(0,n.jsx)(f.Z,{placeholder:"Paste image or URL",onChange:function(i){return B(i.currentTarget.value)}})]})};D.Z=x},19489:function(k,D,e){var M=e(5251),a=e(69753),A=e(93410),E=e(35312),T=e(55060),m=e(32983),u=e(14726),y=e(96074),_=e(26412),o=e(85893),h=function(v){var P,f=["image/jpeg","image/png","image/webp",".svg",".jpg",".png",".jpeg"],r=(0,E.useIntl)(),n=v.file,W=function(){v.onChange&&v.onChange()},x=function(){var p;return f.includes((p=n==null?void 0:n.type)!==null&&p!==void 0?p:"")?(0,o.jsx)("div",{className:"flex justify-center items-center",style:{minHeight:130},children:(0,o.jsx)(T.Z,{src:(0,M.Er)(n==null?void 0:n.url)})}):(0,o.jsx)("div",{onClick:W,children:(0,o.jsx)(m.Z,{})})};return(0,o.jsxs)(A.Z,{title:r.formatMessage({id:"general.preview"}),actions:[(0,o.jsx)(u.ZP,{type:"link",onClick:function(){return window.location.href=(0,M.Er)(n==null?void 0:n.url)},icon:(0,o.jsx)(a.Z,{}),children:"Download"},"download")],children:[x(),(0,o.jsx)(y.Z,{}),(0,o.jsxs)(_.Z,{title:"File info",column:1,children:[(0,o.jsx)(_.Z.Item,{label:"Name",children:n==null?void 0:n.name}),(0,o.jsxs)(_.Z.Item,{label:"Size",children:[(((P=n==null?void 0:n.size)!==null&&P!==void 0?P:0)/1024).toFixed(2)," KB"]}),(0,o.jsx)(_.Z.Item,{label:"Type",children:n==null?void 0:n.type})]})]})};D.Z=h},16411:function(k,D,e){e.r(D),e.d(D,{default:function(){return C}});var M=e(15009),a=e.n(M),A=e(99289),E=e.n(A),T=e(5574),m=e.n(T),u=e(1913),y=e(97857),_=e.n(y),o=e(34994),h=e(5966),S=e(64317),v=e(68872),P=e(14726),f=e(67294),r=e(85893),n=function(j){var R=o.A.useFormInstance(),$=(0,f.useRef)(),ee=(0,f.useState)(!0),z=m()(ee,2),Q=z[0],N=z[1],ne=(0,f.useState)(),G=m()(ne,2),H=G[0],Y=G[1];(0,f.useEffect)(function(){var U=R==null?void 0:R.getFieldValue("link");if(U){var Z;(Z=$.current)===null||Z===void 0||Z.setFields([{name:"name",value:U.name},{name:"href",value:U.href},{name:"target",value:U.target}])}},[]);var X=function(){var U=E()(a()().mark(function Z(V){return a()().wrap(function(c){for(;;)switch(c.prev=c.next){case 0:if(j.name){c.next=2;break}return c.abrupt("return",v.ZP.warning("Name missing"));case 2:Y(V),R==null||R.setFields([{name:j.name,value:V}]),N(!0);case 5:case"end":return c.stop()}},Z)}));return function(V){return U.apply(this,arguments)}}();return(0,r.jsxs)(o.A.Item,_()(_()({},j),{},{children:[(0,r.jsxs)("div",{style:{display:"flex",gap:16},children:[(0,r.jsx)("div",{style:{height:32,border:"1px dashed #d1d1d1",flex:1,padding:"4px 11px",borderRadius:4},children:H==null?void 0:H.name}),(0,r.jsx)(P.ZP,{type:"primary",onClick:function(){return N(!Q)},children:"Add link"},"primary")]}),(0,r.jsx)("div",{style:{backgroundColor:"#eee",padding:16,borderRadius:4,marginTop:16},hidden:Q,children:(0,r.jsxs)(o.A,{onFinish:X,formRef:$,children:[(0,r.jsx)(h.Z,{name:"name",label:"Name"}),(0,r.jsx)(h.Z,{name:"href",label:"URL",rules:[{required:!0}]}),(0,r.jsx)(S.Z,{name:"target",label:"Target",allowClear:!0,options:[{value:"_blank",label:"Open in new tab"}]})]})})]}))},W=n,x=e(19489),I=e(66352),p=e(82061),w=e(82826),L=e(14361),F=e(63386),B=e(93410),l=e(35312),d=e(78957),s=e(86738),t=e(71230),i=e(15746),g=function(){var j=(0,l.useParams)(),R=j.id,$=(0,l.useIntl)(),ee=(0,f.useState)(),z=m()(ee,2),Q=z[0],N=z[1],ne=(0,f.useState)(!1),G=m()(ne,2),H=G[0],Y=G[1],X=(0,f.useRef)(),U=function(){var c=E()(a()().mark(function O(b){var q;return a()().wrap(function(J){for(;;)switch(J.prev=J.next){case 0:return J.next=2,(0,I.iH)(R,b);case 2:q=J.sent,q.succeeded?v.ZP.success("Saved!"):v.ZP.error(q.errors[0].description);case 4:case"end":return J.stop()}},O)}));return function(b){return c.apply(this,arguments)}}();(0,f.useEffect)(function(){(0,I.Tu)(R).then(function(c){var O;N(c.file),(O=X.current)===null||O===void 0||O.setFields([{name:"alt",value:c.alt},{name:"src",value:c.src},{name:"link",value:c.link}])})},[]);var Z=function(){var c=E()(a()().mark(function O(){var b;return a()().wrap(function(K){for(;;)switch(K.prev=K.next){case 0:return K.next=2,(0,I.Js)(R);case 2:b=K.sent,b.succeeded?(v.ZP.success($.formatMessage({id:"general.deleted"})),l.history.back()):v.ZP.error(b.errors[0].description);case 4:case"end":return K.stop()}},O)}));return function(){return c.apply(this,arguments)}}(),V=(0,r.jsxs)(d.Z,{children:[(0,r.jsx)(s.Z,{title:"Are you sure?",onConfirm:Z,children:(0,r.jsx)(P.ZP,{type:"primary",danger:!0,icon:(0,r.jsx)(p.Z,{}),children:"Delete"})}),(0,r.jsx)(P.ZP,{icon:(0,r.jsx)(w.Z,{}),onClick:function(){return l.history.back()},children:"Back"}),(0,r.jsx)(P.ZP,{icon:(0,r.jsx)(L.Z,{})})]}),te=function(O){N(O),Y(!1)};return(0,r.jsxs)(F._z,{title:"Image",extra:V,children:[(0,r.jsxs)(t.Z,{gutter:16,children:[(0,r.jsx)(i.Z,{span:6,children:(0,r.jsx)(x.Z,{file:Q,onChange:function(){return Y(!0)}})}),(0,r.jsx)(i.Z,{span:18,children:(0,r.jsx)(B.Z,{title:$.formatMessage({id:"menu.settings"}),children:(0,r.jsxs)(o.A,{onFinish:U,formRef:X,children:[(0,r.jsx)(h.Z,{name:"src",label:"Src"}),(0,r.jsx)(W,{name:"link",label:"Link"}),(0,r.jsx)(h.Z,{name:"alt",label:"Alt"})]})})})]}),(0,r.jsx)(u.Z,{open:H,onCancel:Y,onFinish:te})]})},C=g},20385:function(k,D,e){e.d(D,{Ah:function(){return o},Cq:function(){return P},V6:function(){return y},kE:function(){return W},p6:function(){return F},tg:function(){return I},yk:function(){return w},z3:function(){return r}});var M=e(15009),a=e.n(M),A=e(97857),E=e.n(A),T=e(99289),m=e.n(T),u=e(35312);function y(l,d,s){return _.apply(this,arguments)}function _(){return _=m()(a()().mark(function l(d,s,t){return a()().wrap(function(g){for(;;)switch(g.prev=g.next){case 0:return g.abrupt("return",(0,u.request)("file/list",E()({method:"GET",params:E()({type:Object.keys(s!=null?s:[]).length>0?s==null?void 0:s.join(","):""},d)},t||{})));case 1:case"end":return g.stop()}},l)})),_.apply(this,arguments)}function o(l){return h.apply(this,arguments)}function h(){return h=m()(a()().mark(function l(d){return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,u.request)("file/delete-file-content/".concat(d),{method:"POST"}));case 1:case"end":return t.stop()}},l)})),h.apply(this,arguments)}function S(l){return v.apply(this,arguments)}function v(){return v=_asyncToGenerator(_regeneratorRuntime().mark(function l(d){return _regeneratorRuntime().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",request("file/delete-file-item",{method:"POST",data:d}));case 1:case"end":return t.stop()}},l)})),v.apply(this,arguments)}function P(l){return f.apply(this,arguments)}function f(){return f=m()(a()().mark(function l(d){return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,u.request)("file/".concat(d)));case 1:case"end":return t.stop()}},l)})),f.apply(this,arguments)}function r(l,d){return n.apply(this,arguments)}function n(){return n=m()(a()().mark(function l(d,s){return a()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.abrupt("return",(0,u.request)("file/file-items/".concat(s.id)));case 1:case"end":return i.stop()}},l)})),n.apply(this,arguments)}function W(l){return x.apply(this,arguments)}function x(){return x=m()(a()().mark(function l(d){var s;return a()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return s=new FormData,s.append("file",d),i.abrupt("return",(0,u.request)("file/upload",{method:"POST",data:s}));case 3:case"end":return i.stop()}},l)})),x.apply(this,arguments)}function I(l){return p.apply(this,arguments)}function p(){return p=m()(a()().mark(function l(d){return a()().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",(0,u.request)("file/upload-from-url",{method:"POST",data:{url:d}}));case 1:case"end":return t.stop()}},l)})),p.apply(this,arguments)}function w(){return L.apply(this,arguments)}function L(){return L=m()(a()().mark(function l(){return a()().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.abrupt("return",(0,u.request)("file/count"));case 1:case"end":return s.stop()}},l)})),L.apply(this,arguments)}function F(){return B.apply(this,arguments)}function B(){return B=m()(a()().mark(function l(){return a()().wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.abrupt("return",(0,u.request)("file/total-size"));case 1:case"end":return s.stop()}},l)})),B.apply(this,arguments)}},5251:function(k,D,e){e.d(D,{Er:function(){return E},p6:function(){return T}});var M=e(27484),a=e.n(M);function A(u){return u.trim()}function E(u){return new URL(u||"",localStorage.getItem("wf_URL")||"").href}function T(u){return u?a()(u).format("DD/MM/YYYY hh:mm:ss"):"-"}var m=function(){var y=arguments.length>0&&arguments[0]!==void 0?arguments[0]:100;return new Promise(function(_){setTimeout(function(){_(!0)},y)})}}}]);