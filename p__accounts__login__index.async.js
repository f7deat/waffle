"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[9345],{63434:function(Ke,_,e){var c=e(1413),d=e(91),m=e(22270),G=e(84567),ee=e(67294),y=e(28614),V=e(53287),w=e(85893),X=["options","fieldProps","proFieldProps","valueEnum"],n=ee.forwardRef(function(g,z){var N=g.options,T=g.fieldProps,Y=g.proFieldProps,i=g.valueEnum,r=(0,d.Z)(g,X);return(0,w.jsx)(V.Z,(0,c.Z)({ref:z,valueType:"checkbox",valueEnum:(0,m.h)(i,void 0),fieldProps:(0,c.Z)({options:N},T),lightProps:(0,c.Z)({labelFormatter:function(){return(0,w.jsx)(V.Z,(0,c.Z)({ref:z,valueType:"checkbox",mode:"read",valueEnum:(0,m.h)(i,void 0),filedConfig:{customLightMode:!0},fieldProps:(0,c.Z)({options:N},T),proFieldProps:Y},r))}},r.lightProps),proFieldProps:Y},r))}),o=ee.forwardRef(function(g,z){var N=g.fieldProps,T=g.children;return(0,w.jsx)(G.Z,(0,c.Z)((0,c.Z)({ref:z},N),{},{children:T}))}),le=(0,y.G)(o,{valuePropName:"checked"}),B=le;B.Group=n,_.Z=B},5966:function(Ke,_,e){var c=e(97685),d=e(1413),m=e(91),G=e(21770),ee=e(8232),y=e(55241),V=e(97435),w=e(67294),X=e(53287),n=e(85893),o=["fieldProps","proFieldProps"],le=["fieldProps","proFieldProps"],B="text",g=function(i){var r=i.fieldProps,R=i.proFieldProps,O=(0,m.Z)(i,o);return(0,n.jsx)(X.Z,(0,d.Z)({valueType:B,fieldProps:r,filedConfig:{valueType:B},proFieldProps:R},O))},z=function(i){var r=(0,G.Z)(i.open||!1,{value:i.open,onChange:i.onOpenChange}),R=(0,c.Z)(r,2),O=R[0],oe=R[1];return(0,n.jsx)(ee.Z.Item,{shouldUpdate:!0,noStyle:!0,children:function(v){var L,se=v.getFieldValue(i.name||[]);return(0,n.jsx)(y.Z,(0,d.Z)((0,d.Z)({getPopupContainer:function(s){return s&&s.parentNode?s.parentNode:s},onOpenChange:function(s){return oe(s)},content:(0,n.jsxs)("div",{style:{padding:"4px 0"},children:[(L=i.statusRender)===null||L===void 0?void 0:L.call(i,se),i.strengthText?(0,n.jsx)("div",{style:{marginTop:10},children:(0,n.jsx)("span",{children:i.strengthText})}):null]}),overlayStyle:{width:240},placement:"rightTop"},i.popoverProps),{},{open:O,children:i.children}))}})},N=function(i){var r=i.fieldProps,R=i.proFieldProps,O=(0,m.Z)(i,le),oe=(0,w.useState)(!1),ie=(0,c.Z)(oe,2),v=ie[0],L=ie[1];return r!=null&&r.statusRender&&O.name?(0,n.jsx)(z,{name:O.name,statusRender:r==null?void 0:r.statusRender,popoverProps:r==null?void 0:r.popoverProps,strengthText:r==null?void 0:r.strengthText,open:v,onOpenChange:L,children:(0,n.jsx)("div",{children:(0,n.jsx)(X.Z,(0,d.Z)({valueType:"password",fieldProps:(0,d.Z)((0,d.Z)({},(0,V.Z)(r,["statusRender","popoverProps","strengthText"])),{},{onBlur:function(J){var s;r==null||(s=r.onBlur)===null||s===void 0||s.call(r,J),L(!1)},onClick:function(J){var s;r==null||(s=r.onClick)===null||s===void 0||s.call(r,J),L(!0)}}),proFieldProps:R,filedConfig:{valueType:B}},O))})}):(0,n.jsx)(X.Z,(0,d.Z)({valueType:"password",fieldProps:r,proFieldProps:R,filedConfig:{valueType:B}},O))},T=g;T.Password=N,T.displayName="ProFormComponent",_.Z=T},34994:function(Ke,_,e){e.d(_,{A:function(){return s}});var c=e(1413),d=e(8232),m=e(67294),G=e(89671),ee=e(9105),y=e(4942),V=e(97685),w=e(87462),X=e(50756),n=e(57080),o=function(P,Q){return m.createElement(n.Z,(0,w.Z)({},P,{ref:Q,icon:X.Z}))},le=m.forwardRef(o),B=le,g=e(21770),z=e(86333),N=e(28459),T=e(78957),Y=e(93967),i=e.n(Y),r=e(66758),R=e(2514),O=e(98082),oe=function(P){return(0,y.Z)({},P.componentCls,{"&-title":{marginBlockEnd:P.marginXL,fontWeight:"bold"},"&-container":(0,y.Z)({flexWrap:"wrap",maxWidth:"100%"},"> div".concat(P.antCls,"-space-item"),{maxWidth:"100%"}),"&-twoLine":(0,y.Z)((0,y.Z)((0,y.Z)((0,y.Z)({display:"block",width:"100%"},"".concat(P.componentCls,"-title"),{width:"100%",margin:"8px 0"}),"".concat(P.componentCls,"-container"),{paddingInlineStart:16}),"".concat(P.antCls,"-space-item,").concat(P.antCls,"-form-item"),{width:"100%"}),"".concat(P.antCls,"-form-item"),{"&-control":{display:"flex",alignItems:"center",justifyContent:"flex-end","&-input":{alignItems:"center",justifyContent:"flex-end","&-content":{flex:"none"}}}})})};function ie(F){return(0,O.Xj)("ProFormGroup",function(P){var Q=(0,c.Z)((0,c.Z)({},P),{},{componentCls:".".concat(F)});return[oe(Q)]})}var v=e(85893),L=m.forwardRef(function(F,P){var Q=m.useContext(r.Z),ye=Q.groupProps,p=(0,c.Z)((0,c.Z)({},ye),F),Te=p.children,Re=p.collapsible,He=p.defaultCollapsed,$e=p.style,Ve=p.labelLayout,Ce=p.title,je=Ce===void 0?F.label:Ce,Oe=p.tooltip,Le=p.align,Ie=Le===void 0?"start":Le,De=p.direction,ve=p.size,Be=ve===void 0?32:ve,we=p.titleStyle,be=p.titleRender,t=p.spaceProps,Se=p.extra,Fe=p.autoFocus,fe=(0,g.Z)(function(){return He||!1},{value:F.collapsed,onChange:F.onCollapse}),de=(0,V.Z)(fe,2),he=de[0],Me=de[1],Xe=(0,m.useContext)(N.ZP.ConfigContext),Ye=Xe.getPrefixCls,ce=(0,R.zx)(F),Je=ce.ColWrapper,We=ce.RowWrapper,te=Ye("pro-form-group"),Ae=ie(te),Qe=Ae.wrapSSR,me=Ae.hashId,I=Re&&(0,v.jsx)(B,{style:{marginInlineEnd:8},rotate:he?void 0:90}),ge=(0,v.jsx)(z.G,{label:I?(0,v.jsxs)("div",{children:[I,je]}):je,tooltip:Oe}),Ge=(0,m.useCallback)(function(ne){var ue=ne.children;return(0,v.jsx)(T.Z,(0,c.Z)((0,c.Z)({},t),{},{className:i()("".concat(te,"-container ").concat(me),t==null?void 0:t.className),size:Be,align:Ie,direction:De,style:(0,c.Z)({rowGap:0},t==null?void 0:t.style),children:ue}))},[Ie,te,De,me,Be,t]),ze=be?be(ge,F):ge,ke=(0,m.useMemo)(function(){var ne=[],ue=m.Children.toArray(Te).map(function(b,a){var l;return m.isValidElement(b)&&b!==null&&b!==void 0&&(l=b.props)!==null&&l!==void 0&&l.hidden?(ne.push(b),null):a===0&&m.isValidElement(b)&&Fe?m.cloneElement(b,(0,c.Z)((0,c.Z)({},b.props),{},{autoFocus:Fe})):b});return[(0,v.jsx)(We,{Wrapper:Ge,children:ue},"children"),ne.length>0?(0,v.jsx)("div",{style:{display:"none"},children:ne}):null]},[Te,We,Ge,Fe]),Ne=(0,V.Z)(ke,2),qe=Ne[0],_e=Ne[1];return Qe((0,v.jsx)(Je,{children:(0,v.jsxs)("div",{className:i()(te,me,(0,y.Z)({},"".concat(te,"-twoLine"),Ve==="twoLine")),style:$e,ref:P,children:[_e,(je||Oe||Se)&&(0,v.jsx)("div",{className:"".concat(te,"-title ").concat(me).trim(),style:we,onClick:function(){Me(!he)},children:Se?(0,v.jsxs)("div",{style:{display:"flex",width:"100%",alignItems:"center",justifyContent:"space-between"},children:[ze,(0,v.jsx)("span",{onClick:function(ue){return ue.stopPropagation()},children:Se})]}):ze}),(0,v.jsx)("div",{style:{display:Re&&he?"none":void 0},children:qe})]})}))});L.displayName="ProForm-Group";var se=L,J=e(4499);function s(F){return(0,v.jsx)(G.I,(0,c.Z)({layout:"vertical",contentRender:function(Q,ye){return(0,v.jsxs)(v.Fragment,{children:[Q,ye]})}},F))}s.Group=se,s.useForm=d.Z.useForm,s.Item=J.Z,s.useWatch=d.Z.useWatch,s.ErrorList=d.Z.ErrorList,s.Provider=d.Z.Provider,s.useFormInstance=d.Z.useFormInstance,s.EditOrReadOnlyContext=ee.A},63912:function(Ke,_,e){e.r(_),e.d(_,{default:function(){return b}});var c=e(15009),d=e.n(c),m=e(97857),G=e.n(m),ee=e(99289),y=e.n(ee),V=e(5574),w=e.n(V),X=e(6742),n=e(1413),o=e(67294),le={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-92.4 233.5h-63.9c-50.1 0-59.8 23.8-59.8 58.8v77.1h119.6l-15.6 120.7h-104V912H539.2V602.2H434.9V481.4h104.3v-89c0-103.3 63.1-159.6 155.3-159.6 44.2 0 82.1 3.3 93.2 4.8v107.9z"}}]},name:"facebook",theme:"filled"},B=le,g=e(91146),z=function(l,u){return o.createElement(g.Z,(0,n.Z)((0,n.Z)({},l),{},{ref:u,icon:B}))},N=o.forwardRef(z),T=N,Y={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm167 633.6C638.4 735 583 757 516.9 757c-95.7 0-178.5-54.9-218.8-134.9C281.5 589 272 551.6 272 512s9.5-77 26.1-110.1c40.3-80.1 123.1-135 218.8-135 66 0 121.4 24.3 163.9 63.8L610.6 401c-25.4-24.3-57.7-36.6-93.6-36.6-63.8 0-117.8 43.1-137.1 101-4.9 14.7-7.7 30.4-7.7 46.6s2.8 31.9 7.7 46.6c19.3 57.9 73.3 101 137 101 33 0 61-8.7 82.9-23.4 26-17.4 43.2-43.3 48.9-74H516.9v-94.8h230.7c2.9 16.1 4.4 32.8 4.4 50.1 0 74.7-26.7 137.4-73 180.1z"}}]},name:"google-circle",theme:"filled"},i=Y,r=function(l,u){return o.createElement(g.Z,(0,n.Z)((0,n.Z)({},l),{},{ref:u,icon:i}))},R=o.forwardRef(r),O=R,oe={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0138.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"}}]},name:"github",theme:"filled"},ie=oe,v=function(l,u){return o.createElement(g.Z,(0,n.Z)((0,n.Z)({},l),{},{ref:u,icon:ie}))},L=o.forwardRef(v),se=L,J=e(29158),s=e(87547),F={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM332 240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224H332V240zm460 600H232V536h560v304zM484 701v53c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-53a48.01 48.01 0 10-56 0z"}}]},name:"lock",theme:"outlined"},P=F,Q=function(l,u){return o.createElement(g.Z,(0,n.Z)((0,n.Z)({},l),{},{ref:u,icon:P}))},ye=o.forwardRef(Q),p=ye,Te={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M744 62H280c-35.3 0-64 28.7-64 64v768c0 35.3 28.7 64 64 64h464c35.3 0 64-28.7 64-64V126c0-35.3-28.7-64-64-64zm-8 824H288V134h448v752zM472 784a40 40 0 1080 0 40 40 0 10-80 0z"}}]},name:"mobile",theme:"outlined"},Re=Te,He=function(l,u){return o.createElement(g.Z,(0,n.Z)((0,n.Z)({},l),{},{ref:u,icon:Re}))},$e=o.forwardRef(He),Ve=$e,Ce=e(91),je=e(10915),Oe=e(28459),Le=e(93967),Ie=e.n(Le),De=e(34994),ve=e(4942),Be=e(98082),we=function(l){return(0,ve.Z)((0,ve.Z)({},l.componentCls,{"&-container":{display:"flex",flex:"1",flexDirection:"column",height:"100%",paddingInline:32,paddingBlock:24,overflow:"auto",background:"inherit"},"&-top":{textAlign:"center"},"&-header":{display:"flex",alignItems:"center",justifyContent:"center",height:"44px",lineHeight:"44px",a:{textDecoration:"none"}},"&-title":{position:"relative",insetBlockStart:"2px",color:"@heading-color",fontWeight:"600",fontSize:"33px"},"&-logo":{width:"44px",height:"44px",marginInlineEnd:"16px",verticalAlign:"top",img:{width:"100%"}},"&-desc":{marginBlockStart:"12px",marginBlockEnd:"40px",color:l.colorTextSecondary,fontSize:l.fontSize},"&-main":{minWidth:"328px",maxWidth:"580px",margin:"0 auto","&-other":{marginBlockStart:"24px",lineHeight:"22px",textAlign:"start"}}}),"@media (min-width: @screen-md-min)",(0,ve.Z)({},"".concat(l.componentCls,"-container"),{paddingInline:0,paddingBlockStart:32,paddingBlockEnd:24,backgroundRepeat:"no-repeat",backgroundPosition:"center 110px",backgroundSize:"100%"}))};function be(a){return(0,Be.Xj)("LoginForm",function(l){var u=(0,n.Z)((0,n.Z)({},l),{},{componentCls:".".concat(a)});return[we(u)]})}var t=e(85893),Se=["logo","message","contentStyle","title","subTitle","actions","children","containerStyle","otherStyle"];function Fe(a){var l,u=a.logo,re=a.message,pe=a.contentStyle,U=a.title,k=a.subTitle,xe=a.actions,W=a.children,ae=a.containerStyle,q=a.otherStyle,f=(0,Ce.Z)(a,Se),x=(0,je.YB)(),Z=f.submitter===!1?!1:(0,n.Z)((0,n.Z)({searchConfig:{submitText:x.getMessage("loginForm.submitText","\u767B\u5F55")}},f.submitter),{},{submitButtonProps:(0,n.Z)({size:"large",style:{width:"100%"}},(l=f.submitter)===null||l===void 0?void 0:l.submitButtonProps),render:function(Ee,Ue){var Ze,E=Ue.pop();if(typeof(f==null||(Ze=f.submitter)===null||Ze===void 0?void 0:Ze.render)=="function"){var M,H;return f==null||(M=f.submitter)===null||M===void 0||(H=M.render)===null||H===void 0?void 0:H.call(M,Ee,Ue)}return E}}),j=(0,o.useContext)(Oe.ZP.ConfigContext),C=j.getPrefixCls("pro-form-login"),K=be(C),h=K.wrapSSR,A=K.hashId,D=function(Ee){return"".concat(C,"-").concat(Ee," ").concat(A)},Pe=(0,o.useMemo)(function(){return u?typeof u=="string"?(0,t.jsx)("img",{src:u}):u:null},[u]);return h((0,t.jsxs)("div",{className:Ie()(D("container"),A),style:ae,children:[(0,t.jsxs)("div",{className:"".concat(D("top")," ").concat(A).trim(),children:[U||Pe?(0,t.jsxs)("div",{className:"".concat(D("header")),children:[Pe?(0,t.jsx)("span",{className:D("logo"),children:Pe}):null,U?(0,t.jsx)("span",{className:D("title"),children:U}):null]}):null,k?(0,t.jsx)("div",{className:D("desc"),children:k}):null]}),(0,t.jsxs)("div",{className:D("main"),style:(0,n.Z)({width:328},pe),children:[(0,t.jsxs)(De.A,(0,n.Z)((0,n.Z)({isKeyPressSubmit:!0},f),{},{submitter:Z,children:[re,W]})),xe?(0,t.jsx)("div",{className:D("main-other"),style:q,children:xe}):null]})]}))}var fe=e(5966),de=e(74165),he=e(15861),Me=e(97685),Xe=e(8232),Ye=e(55102),ce=e(14726),Je=e(28614),We=["rules","name","phoneName","fieldProps","onTiming","captchaTextRender","captchaProps"],te=o.forwardRef(function(a,l){var u=Xe.Z.useFormInstance(),re=(0,o.useState)(a.countDown||60),pe=(0,Me.Z)(re,2),U=pe[0],k=pe[1],xe=(0,o.useState)(!1),W=(0,Me.Z)(xe,2),ae=W[0],q=W[1],f=(0,o.useState)(),x=(0,Me.Z)(f,2),Z=x[0],j=x[1],C=a.rules,K=a.name,h=a.phoneName,A=a.fieldProps,D=a.onTiming,Pe=a.captchaTextRender,et=Pe===void 0?function(E,M){return E?"".concat(M," \u79D2\u540E\u91CD\u65B0\u83B7\u53D6"):"\u83B7\u53D6\u9A8C\u8BC1\u7801"}:Pe,Ee=a.captchaProps,Ue=(0,Ce.Z)(a,We),Ze=function(){var E=(0,he.Z)((0,de.Z)().mark(function M(H){return(0,de.Z)().wrap(function($){for(;;)switch($.prev=$.next){case 0:return $.prev=0,j(!0),$.next=4,Ue.onGetCaptcha(H);case 4:j(!1),q(!0),$.next=13;break;case 8:$.prev=8,$.t0=$.catch(0),q(!1),j(!1),console.log($.t0);case 13:case"end":return $.stop()}},M,null,[[0,8]])}));return function(H){return E.apply(this,arguments)}}();return(0,o.useImperativeHandle)(l,function(){return{startTiming:function(){return q(!0)},endTiming:function(){return q(!1)}}}),(0,o.useEffect)(function(){var E=0,M=a.countDown;return ae&&(E=window.setInterval(function(){k(function(H){return H<=1?(q(!1),clearInterval(E),M||60):H-1})},1e3)),function(){return clearInterval(E)}},[ae]),(0,o.useEffect)(function(){D&&D(U)},[U,D]),(0,t.jsxs)("div",{style:(0,n.Z)((0,n.Z)({},A==null?void 0:A.style),{},{display:"flex",alignItems:"center"}),ref:l,children:[(0,t.jsx)(Ye.Z,(0,n.Z)((0,n.Z)({},A),{},{style:(0,n.Z)({flex:1,transition:"width .3s",marginRight:8},A==null?void 0:A.style)})),(0,t.jsx)(ce.ZP,(0,n.Z)((0,n.Z)({style:{display:"block"},disabled:ae,loading:Z},Ee),{},{onClick:(0,he.Z)((0,de.Z)().mark(function E(){var M;return(0,de.Z)().wrap(function(S){for(;;)switch(S.prev=S.next){case 0:if(S.prev=0,!h){S.next=9;break}return S.next=4,u.validateFields([h].flat(1));case 4:return M=u.getFieldValue([h].flat(1)),S.next=7,Ze(M);case 7:S.next=11;break;case 9:return S.next=11,Ze("");case 11:S.next=16;break;case 13:S.prev=13,S.t0=S.catch(0),console.log(S.t0);case 16:case"end":return S.stop()}},E,null,[[0,13]])})),children:et(ae,U)}))]})}),Ae=(0,Je.G)(te),Qe=Ae,me=e(63434),I=e(35312),ge=e(68872),Ge=e(78957),ze=e(11941),ke=e(73935),Ne=e(66949),qe={navTheme:"light",contentWidth:"Fluid",fixedHeader:!1,fixSiderbar:!0,title:"Waffle"},_e=qe,ne=e(61320),ue=function(){var l=(0,o.useState)("account"),u=w()(l,2),re=u[0],pe=u[1],U=(0,I.useModel)("@@initialState"),k=U.initialState,xe=U.setInitialState,W=(0,I.useIntl)(),ae=function(){var f=y()(d()().mark(function x(){var Z,j;return d()().wrap(function(K){for(;;)switch(K.prev=K.next){case 0:return K.next=2,k==null||(Z=k.fetchUserInfo)===null||Z===void 0?void 0:Z.call(k);case 2:j=K.sent,j&&(0,ke.flushSync)(function(){xe(function(h){return G()(G()({},h),{},{currentUser:j})})});case 4:case"end":return K.stop()}},x)}));return function(){return f.apply(this,arguments)}}(),q=function(){var f=y()(d()().mark(function x(Z){var j,C;return d()().wrap(function(h){for(;;)switch(h.prev=h.next){case 0:return h.prev=0,localStorage.setItem("wf_URL",Z.baseURL),h.next=4,(0,X.x4)(G()(G()({},Z),{},{type:re}));case 4:if(j=h.sent,j.succeeded){h.next=7;break}return h.abrupt("return",ge.ZP.error("Login failed!"));case 7:return localStorage.setItem("wf_token",j.token),h.next=10,ae();case 10:C=new URL(window.location.href).searchParams,I.history.push(C.get("redirect")||"/"),h.next=17;break;case 14:h.prev=14,h.t0=h.catch(0),ge.ZP.error("Login failed!");case 17:case"end":return h.stop()}},x,null,[[0,14]])}));return function(Z){return f.apply(this,arguments)}}();return(0,t.jsxs)("div",{className:"h-full",children:[(0,t.jsx)(I.Helmet,{children:(0,t.jsxs)("title",{children:[W.formatMessage({id:"menu.login",defaultMessage:"Login"})," - ",_e.title]})}),(0,t.jsx)("div",{className:"fixed",style:{left:10,top:10},children:(0,t.jsx)(I.SelectLang,{})}),(0,t.jsx)("div",{className:"flex items-center relative h-full",children:(0,t.jsxs)(Fe,{logo:(0,t.jsx)("img",{alt:"logo",src:Ne}),title:"Waffle",subTitle:W.formatMessage({id:"pages.login.subTitle"}),initialValues:{autoLogin:!0},actions:[(0,t.jsx)("div",{className:"mb-4 text-center",children:(0,t.jsx)(I.FormattedHTMLMessage,{id:"pages.login.orLoginWith"})},2),(0,t.jsx)("div",{className:"text-center",children:(0,t.jsxs)(Ge.Z,{align:"center",children:[(0,t.jsx)(ce.ZP,{icon:(0,t.jsx)(T,{}),shape:"circle",size:"large",type:"primary"}),(0,t.jsx)(ce.ZP,{icon:(0,t.jsx)(O,{}),shape:"circle",size:"large",type:"primary",danger:!0}),(0,t.jsx)(ce.ZP,{icon:(0,t.jsx)(se,{}),shape:"circle",size:"large"})]})},3)],onFinish:function(){var f=y()(d()().mark(function x(Z){return d()().wrap(function(C){for(;;)switch(C.prev=C.next){case 0:return C.next=2,q(Z);case 2:case"end":return C.stop()}},x)}));return function(x){return f.apply(this,arguments)}}(),children:[(0,t.jsx)(ze.Z,{activeKey:re,onChange:pe,centered:!0,items:[{key:"account",label:W.formatMessage({id:"pages.login.account",defaultMessage:"Account"})},{key:"mobile",label:W.formatMessage({id:"general.phoneNumber",defaultMessage:"Phone number"})}]}),re==="account"&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(fe.Z,{name:"baseURL",fieldProps:{size:"large",prefix:(0,t.jsx)(J.Z,{})},placeholder:"https://"}),(0,t.jsx)(fe.Z,{name:"username",fieldProps:{size:"large",prefix:(0,t.jsx)(s.Z,{})},placeholder:"Email",rules:[{required:!0,message:"Please input email!"}]}),(0,t.jsx)(fe.Z.Password,{name:"password",fieldProps:{size:"large",prefix:(0,t.jsx)(p,{})},placeholder:W.formatMessage({id:"pages.login.password"}),rules:[{required:!0,message:"Please input password!"}]})]}),re==="mobile"&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(fe.Z,{fieldProps:{size:"large",prefix:(0,t.jsx)(Ve,{})},name:"mobile",placeholder:W.formatMessage({id:"general.phoneNumber",defaultMessage:"Phone number"}),rules:[{required:!0,message:"Vui l\xF2ng nh\u1EADp s\u1ED1 \u0111i\u1EC7n tho\u1EA1i"},{pattern:/^1\d{10}$/,message:"S\u1ED1 \u0111i\u1EC7n tho\u1EA1i kh\xF4ng h\u1EE3p l\u1EC7"}]}),(0,t.jsx)(Qe,{fieldProps:{size:"large",prefix:(0,t.jsx)(p,{})},captchaProps:{size:"large"},placeholder:"M\xE3 x\xE1c nh\u1EADn",captchaTextRender:function(x,Z){return x?"L\u1EA5y m\xE3 + "+Z:"L\u1EA5y m\xE3"},name:"captcha",rules:[{required:!0,message:"Vui l\xF2ng nh\u1EADp m\xE3 x\xE1c nh\u1EADn!"}],onGetCaptcha:function(){var f=y()(d()().mark(function x(Z){return d()().wrap(function(C){for(;;)switch(C.prev=C.next){case 0:ge.ZP.success("\u0110\xE3 g\u1EEDi m\xE3 x\xE1c minh t\u1EDBi: "+Z);case 1:case"end":return C.stop()}},x)}));return function(x){return f.apply(this,arguments)}}()})]}),(0,t.jsxs)("div",{style:{marginBottom:24},children:[(0,t.jsx)(me.Z,{noStyle:!0,name:"autoLogin",children:(0,t.jsx)(I.FormattedHTMLMessage,{id:"pages.login.rememberMe"})}),(0,t.jsx)("div",{style:{float:"right"},children:(0,t.jsx)(I.Link,{to:"#",children:(0,t.jsx)(I.FormattedHTMLMessage,{id:"pages.login.forgotPassword"})})})]})]})})]})},b=ue}}]);
