"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4559],{82061:function(y,m,n){var c=n(1413),t=n(67294),f=n(47046),l=n(91146),o=function(D,i){return t.createElement(l.Z,(0,c.Z)((0,c.Z)({},D),{},{ref:i,icon:f.Z}))},E=t.forwardRef(o);m.Z=E},24482:function(y,m,n){n.r(m);var c=n(15009),t=n.n(c),f=n(99289),l=n.n(f),o=n(98364),E=n(55725),d=n(82061),D=n(63386),i=n(2177),v=n(35312),p=n(68872),C=n(14726),h=n(86738),j=n(67294),u=n(85893),R=function(){var g=(0,j.useRef)(),O=function(){var a=l()(t()().mark(function s(e){var _,T;return t()().wrap(function(P){for(;;)switch(P.prev=P.next){case 0:return P.next=2,(0,o.v7)(e);case 2:_=P.sent,_.succeeded?(p.ZP.success("Deleted!"),(T=g.current)===null||T===void 0||T.reload()):p.ZP.error(_.errors[0].description);case 4:case"end":return P.stop()}},s)}));return function(e){return a.apply(this,arguments)}}(),r=[{title:"#",valueType:"indexBorder",width:50},{title:"Name",dataIndex:"name",render:function(s,e){return(0,u.jsx)("a",{onClick:function(){return v.history.push("/settings/component/center/".concat(e.id))},children:e.name})}},{title:"Normalized name",dataIndex:"normalizedName",search:!1},{title:"Status",dataIndex:"active",valueEnum:{false:{text:"Draft",status:"Default"},true:{text:"Active",status:"Processing"}},width:100},{title:"Option",valueType:"option",render:function(s,e){return[(0,u.jsx)(C.ZP,{icon:(0,u.jsx)(E.Z,{}),size:"small",onClick:function(){return v.history.push("/settings/component/center/".concat(e.id))}},"view"),(0,u.jsx)(h.Z,{title:"Are you sure?",onConfirm:function(){return O(e.id)},children:(0,u.jsx)(C.ZP,{icon:(0,u.jsx)(d.Z,{}),type:"primary",danger:!0,size:"small"})},2)]},width:80}];return(0,u.jsx)(D._z,{children:(0,u.jsx)(i.Z,{rowSelection:{},actionRef:g,rowKey:"id",request:o.CO,columns:r,search:{layout:"vertical"},pagination:{defaultPageSize:10,showSizeChanger:!0}})})};m.default=R},98364:function(y,m,n){n.d(m,{CO:function(){return C},Ef:function(){return g},KL:function(){return v},Xr:function(){return E},Z:function(){return j},v7:function(){return R}});var c=n(15009),t=n.n(c),f=n(99289),l=n.n(f),o=n(35312);function E(r){return d.apply(this,arguments)}function d(){return d=l()(t()().mark(function r(a){return t()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,o.request)("component/".concat(a)));case 1:case"end":return e.stop()}},r)})),d.apply(this,arguments)}function D(r){return i.apply(this,arguments)}function i(){return i=_asyncToGenerator(_regeneratorRuntime().mark(function r(a){return _regeneratorRuntime().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",request("component/add",{method:"POST",data:a}));case 1:case"end":return e.stop()}},r)})),i.apply(this,arguments)}function v(r){return p.apply(this,arguments)}function p(){return p=l()(t()().mark(function r(a){return t()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,o.request)("component/update",{method:"POST",data:a}));case 1:case"end":return e.stop()}},r)})),p.apply(this,arguments)}function C(r){return h.apply(this,arguments)}function h(){return h=l()(t()().mark(function r(a){return t()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,o.request)("component/list",{params:a}));case 1:case"end":return e.stop()}},r)})),h.apply(this,arguments)}function j(r,a){return u.apply(this,arguments)}function u(){return u=l()(t()().mark(function r(a,s){return t()().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return _.abrupt("return",(0,o.request)("component/list-work/".concat(s),{params:a}));case 1:case"end":return _.stop()}},r)})),u.apply(this,arguments)}function R(r){return M.apply(this,arguments)}function M(){return M=l()(t()().mark(function r(a){return t()().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",(0,o.request)("component/delete/".concat(a),{method:"POST"}));case 1:case"end":return e.stop()}},r)})),M.apply(this,arguments)}function g(r){return O.apply(this,arguments)}function O(){return O=l()(t()().mark(function r(a){var s;return t()().wrap(function(_){for(;;)switch(_.prev=_.next){case 0:return s={searchTerm:a.keyWords},_.abrupt("return",(0,o.request)("component/form-select",{params:s}));case 2:case"end":return _.stop()}},r)})),O.apply(this,arguments)}}}]);
