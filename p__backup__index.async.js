"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3859],{54811:function(J,$,r){r.r($),r.d($,{default:function(){return q}});var k=r(97857),l=r.n(k),A=r(15009),o=r.n(A),g=r(99289),E=r.n(g),P=r(5574),N=r.n(P),x=r(78710),C=r(66352),O=r(55287),B=r(82061),T=r(69753),z=r(64082),R=r(63386),c=r(93410),d=r(1646),s=r(2177),m=r(78367),n=r(68872),p=r(14726),Z=r(86738),K=r(71230),f=r(15746),F=r(96074),L=r(67294),H=r(35312),e=r(85893),Q=function(){var M=(0,L.useRef)(),W=function(){var w=E()(o()().mark(function j(v,I){var S,U;return o()().wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,(0,C.wz)({catalogId:v,workId:I,sortOrder:0});case 2:S=a.sent,S.succeeded?(n.ZP.success("Deleted"),(U=M.current)===null||U===void 0||U.reload()):n.ZP.error(S.errors[0].description);case 4:case"end":return a.stop()}},j)}));return function(v,I){return w.apply(this,arguments)}}(),t=[{title:"#",valueType:"indexBorder"},{title:"Catalog",dataIndex:"catalogName",render:function(j,v){return(0,e.jsx)(H.Link,{to:"/catalog/".concat(v.catalogId),children:j})}},{title:"Work",valueType:"option",render:function(j,v){return[(0,e.jsx)(Z.Z,{title:"Are you sure?",onConfirm:function(){return W(v.catalogId,v.workId)},children:(0,e.jsx)(p.ZP,{size:"small",danger:!0,type:"text",icon:(0,e.jsx)(B.Z,{})})})]}}];return(0,e.jsx)(c.Z,{title:"Unuse Works",children:(0,e.jsx)(s.Z,{actionRef:M,request:C.Td,columns:t,ghost:!0,search:!1})})},V=Q,X=m.Z.Dragger,Y=function(){var M=(0,L.useState)(),W=N()(M,2),t=W[0],w=W[1],j=(0,L.useRef)();(0,L.useEffect)(function(){(0,x.rZ)().then(function(h){w(h)})},[]);var v=function(){var h=E()(o()().mark(function a(){var u,y,D,G,i;return o()().wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return b.next=2,(0,x._O)();case 2:y=b.sent,D=new Blob([JSON.stringify(y)],{type:"application/json"}),G=URL.createObjectURL(D),i=document.createElement("a"),i.href=G,i.download="".concat((u=localStorage.getItem("wf_URL"))===null||u===void 0?void 0:u.replace("https://","").replace("/",""),"-").concat(Date.now(),".json"),document.body.appendChild(i),i.click(),document.body.removeChild(i);case 11:case"end":return b.stop()}},a)}));return function(){return h.apply(this,arguments)}}(),I={action:x.dk,onChange:function(a){var u=a.file.status;u!=="uploading"&&console.log(a.file,a.fileList),u==="done"?n.ZP.success("".concat(a.file.name," file uploaded successfully.")):u==="error"&&n.ZP.error("".concat(a.file.name," file upload failed."))},onDrop:function(a){console.log("Dropped files",a.dataTransfer.files)}},S=function(){var h=E()(o()().mark(function a(u){var y,D;return o()().wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,(0,C.Js)(u);case 2:y=i.sent,y.succeeded?(n.ZP.success("Deleted"),(D=j.current)===null||D===void 0||D.reload()):n.ZP.error(y.errors[0].description);case 4:case"end":return i.stop()}},a)}));return function(u){return h.apply(this,arguments)}}(),U=[{title:"#",valueType:"indexBorder",width:40},{title:"Name",dataIndex:"name"},{title:"",render:function(a,u){return[(0,e.jsx)(p.ZP,{type:"primary",icon:(0,e.jsx)(O.Z,{})},1),(0,e.jsx)(Z.Z,{title:"Are you sure?",onConfirm:function(){return S(u.id)},children:(0,e.jsx)(p.ZP,{type:"primary",danger:!0,icon:(0,e.jsx)(B.Z,{})})},2)]},valueType:"option",width:60}];return(0,e.jsxs)(R._z,{title:"Backup",extra:(0,e.jsx)(p.ZP,{type:"primary",icon:(0,e.jsx)(T.Z,{}),onClick:v,children:"Export"}),children:[(0,e.jsxs)(K.Z,{gutter:16,children:[(0,e.jsx)(f.Z,{span:4,children:(0,e.jsx)(c.Z,{children:(0,e.jsx)(d.Z,{title:"Catalog",value:t==null?void 0:t.catalog})})}),(0,e.jsx)(f.Z,{span:4,children:(0,e.jsx)(c.Z,{children:(0,e.jsx)(d.Z,{title:"Component",value:t==null?void 0:t.component})})}),(0,e.jsx)(f.Z,{span:4,children:(0,e.jsx)(c.Z,{children:(0,e.jsx)(d.Z,{title:"Work content",value:t==null?void 0:t.workContent})})}),(0,e.jsx)(f.Z,{span:4,children:(0,e.jsx)(c.Z,{children:(0,e.jsx)(d.Z,{title:"Work item",value:t==null?void 0:t.workItem})})}),(0,e.jsx)(f.Z,{span:4,children:(0,e.jsx)(c.Z,{children:(0,e.jsx)(d.Z,{title:"File",value:t==null?void 0:t.fileContent})})}),(0,e.jsx)(f.Z,{span:4,children:(0,e.jsx)(c.Z,{children:(0,e.jsx)(d.Z,{title:"Localization",value:t==null?void 0:t.localization})})})]}),(0,e.jsx)(F.Z,{}),(0,e.jsxs)(K.Z,{gutter:16,children:[(0,e.jsx)(f.Z,{span:8,children:(0,e.jsx)(c.Z,{title:"Import",children:(0,e.jsxs)(X,l()(l()({},I),{},{children:[(0,e.jsx)("p",{className:"ant-upload-drag-icon",children:(0,e.jsx)(z.Z,{})}),(0,e.jsx)("p",{className:"ant-upload-text",children:"Click or drag file to this area to upload"}),(0,e.jsx)("p",{className:"ant-upload-hint",children:"Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files"})]}))})}),(0,e.jsx)(f.Z,{md:16,children:(0,e.jsxs)(K.Z,{gutter:16,children:[(0,e.jsx)(f.Z,{md:12,children:(0,e.jsx)(c.Z,{title:"Unuse Contents",children:(0,e.jsx)(s.Z,{request:C.Mw,columns:U,actionRef:j,ghost:!0,search:!1})})}),(0,e.jsx)(f.Z,{md:12,children:(0,e.jsx)(V,{})})]})})]})]})},q=Y},78710:function(J,$,r){r.d($,{Jx:function(){return B},_O:function(){return N},_s:function(){return C},dk:function(){return c},gn:function(){return z},rZ:function(){return E}});var k=r(15009),l=r.n(k),A=r(99289),o=r.n(A),g=r(35312);function E(){return P.apply(this,arguments)}function P(){return P=o()(l()().mark(function s(){return l()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,g.request)("backup/statistic"));case 1:case"end":return n.stop()}},s)})),P.apply(this,arguments)}function N(){return x.apply(this,arguments)}function x(){return x=o()(l()().mark(function s(){return l()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,g.request)("backup/export"));case 1:case"end":return n.stop()}},s)})),x.apply(this,arguments)}function C(){return O.apply(this,arguments)}function O(){return O=o()(l()().mark(function s(){return l()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,g.request)("backup/upgrade",{method:"POST"}));case 1:case"end":return n.stop()}},s)})),O.apply(this,arguments)}function B(){return T.apply(this,arguments)}function T(){return T=o()(l()().mark(function s(){return l()().wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.abrupt("return",(0,g.request)("backup/upgrade/list"));case 1:case"end":return n.stop()}},s)})),T.apply(this,arguments)}function z(s){return R.apply(this,arguments)}function R(){return R=o()(l()().mark(function s(m){return l()().wrap(function(p){for(;;)switch(p.prev=p.next){case 0:return p.abrupt("return",(0,g.request)(m,{method:"POST"}));case 1:case"end":return p.stop()}},s)})),R.apply(this,arguments)}function c(s){return d.apply(this,arguments)}function d(){return d=o()(l()().mark(function s(m){var n;return l()().wrap(function(Z){for(;;)switch(Z.prev=Z.next){case 0:return n=new FormData,n.append("file",m),Z.abrupt("return",(0,g.request)("backup/import",{method:"POST",data:n}));case 3:case"end":return Z.stop()}},s)})),d.apply(this,arguments)}}}]);
