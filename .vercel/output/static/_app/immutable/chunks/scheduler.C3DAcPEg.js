function q(){}const V=t=>t;function D(t,e){for(const n in e)t[n]=e[n];return t}function P(t){return t()}function X(){return Object.create(null)}function B(t){t.forEach(P)}function Y(t){return typeof t=="function"}function Z(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let h;function $(t,e){return t===e?!0:(h||(h=document.createElement("a")),h.href=e,t===h.href)}function tt(t){return Object.keys(t).length===0}function L(t,...e){if(t==null){for(const i of e)i(void 0);return q}const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function et(t,e,n){t.$$.on_destroy.push(L(e,n))}function nt(t,e,n,i){if(t){const r=N(t,e,n,i);return t[0](r)}}function N(t,e,n,i){return t[1]&&i?D(n.ctx.slice(),t[1](i(e))):n.ctx}function it(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const u=[],c=Math.max(e.dirty.length,r.length);for(let s=0;s<c;s+=1)u[s]=e.dirty[s]|r[s];return u}return e.dirty|r}return e.dirty}function rt(t,e,n,i,r,u){if(r){const c=N(e,n,i,u);t.p(c,r)}}function ct(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function lt(t,e,n){return t.set(n),e}let p=!1;function st(){p=!0}function ut(){p=!1}function M(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function O(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const l=[];for(let o=0;o<e.length;o++){const a=e[o];a.claim_order!==void 0&&l.push(a)}e=l}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let l=0;l<e.length;l++){const o=e[l].claim_order,a=(r>0&&e[n[r]].claim_order<=o?r+1:M(1,r,S=>e[n[S]].claim_order,o))-1;i[l]=n[a]+1;const E=a+1;n[E]=l,r=Math.max(E,r)}const u=[],c=[];let s=e.length-1;for(let l=n[r]+1;l!=0;l=i[l-1]){for(u.push(e[l-1]);s>=l;s--)c.push(e[s]);s--}for(;s>=0;s--)c.push(e[s]);u.reverse(),c.sort((l,o)=>l.claim_order-o.claim_order);for(let l=0,o=0;l<c.length;l++){for(;o<u.length&&c[l].claim_order>=u[o].claim_order;)o++;const a=o<u.length?u[o]:null;t.insertBefore(c[l],a)}}function T(t,e){t.appendChild(e)}function H(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function ot(t){const e=A("style");return e.textContent="/* empty */",I(H(t),e),e.sheet}function I(t,e){return T(t.head||t,e),e.sheet}function R(t,e){if(p){for(O(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function at(t,e,n){p&&!n?R(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function ft(t){t.parentNode&&t.parentNode.removeChild(t)}function _t(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function A(t){return document.createElement(t)}function x(t){return document.createTextNode(t)}function dt(){return x(" ")}function ht(){return x("")}function mt(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function pt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function yt(t){return t.dataset.svelteH}function bt(t){return Array.from(t.childNodes)}function z(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function j(t,e,n,i,r=!1){z(t);const u=(()=>{for(let c=t.claim_info.last_index;c<t.length;c++){const s=t[c];if(e(s)){const l=n(s);return l===void 0?t.splice(c,1):t[c]=l,r||(t.claim_info.last_index=c),s}}for(let c=t.claim_info.last_index-1;c>=0;c--){const s=t[c];if(e(s)){const l=n(s);return l===void 0?t.splice(c,1):t[c]=l,r?l===void 0&&t.claim_info.last_index--:t.claim_info.last_index=c,s}}return i()})();return u.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,u}function F(t,e,n,i){return j(t,r=>r.nodeName===e,r=>{const u=[];for(let c=0;c<r.attributes.length;c++){const s=r.attributes[c];n[s.name]||u.push(s.name)}u.forEach(c=>r.removeAttribute(c))},()=>i(e))}function gt(t,e,n){return F(t,e,n,A)}function U(t,e){return j(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>x(e),!0)}function xt(t){return U(t," ")}function vt(t,e){e=""+e,t.data!==e&&(t.data=e)}function Et(t,e){t.value=e??""}function kt(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function wt(t,e,n){t.classList.toggle(e,!!n)}function W(t,e,{bubbles:n=!1,cancelable:i=!1}={}){return new CustomEvent(t,{detail:e,bubbles:n,cancelable:i})}function Nt(t,e){return new t(e)}let m;function y(t){m=t}function v(){if(!m)throw new Error("Function called outside component initialization");return m}function At(t){v().$$.on_mount.push(t)}function jt(t){v().$$.after_update.push(t)}function Ct(){const t=v();return(e,n,{cancelable:i=!1}={})=>{const r=t.$$.callbacks[e];if(r){const u=W(e,n,{cancelable:i});return r.slice().forEach(c=>{c.call(t,u)}),!u.defaultPrevented}return!0}}function St(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(i=>i.call(this,e))}const d=[],k=[];let _=[];const w=[],C=Promise.resolve();let g=!1;function G(){g||(g=!0,C.then(K))}function qt(){return G(),C}function J(t){_.push(t)}const b=new Set;let f=0;function K(){if(f!==0)return;const t=m;do{try{for(;f<d.length;){const e=d[f];f++,y(e),Q(e.$$)}}catch(e){throw d.length=0,f=0,e}for(y(null),d.length=0,f=0;k.length;)k.pop()();for(let e=0;e<_.length;e+=1){const n=_[e];b.has(n)||(b.add(n),n())}_.length=0}while(d.length);for(;w.length;)w.pop()();g=!1,b.clear(),y(t)}function Q(t){if(t.fragment!==null){t.update(),B(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(J)}}function Dt(t){const e=[],n=[];_.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),_=e}export{H as A,ot as B,B as C,Y as D,J as E,W as F,V as G,X as H,K as I,tt as J,Dt as K,m as L,y as M,P as N,d as O,G as P,st as Q,ut as R,$ as S,wt as T,mt as U,lt as V,Ct as W,yt as X,Et as Y,_t as Z,St as _,it as a,dt as b,nt as c,gt as d,A as e,bt as f,ct as g,U as h,ft as i,xt as j,at as k,R as l,vt as m,q as n,et as o,ht as p,jt as q,At as r,Z as s,x as t,rt as u,pt as v,kt as w,k as x,Nt as y,qt as z};
