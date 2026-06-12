(function(){"use strict";const v=self.ChromeAdapters=self.ChromeAdapters||{};function a(t,r){return new Promise((w,b)=>{try{t(...r,()=>{if(chrome.runtime.lastError){b(new Error(chrome.runtime.lastError.message));return}w()})}catch(e){b(e)}})}function s(t,r){return new Promise((w,b)=>{try{t(...r,e=>{if(chrome.runtime.lastError){b(new Error(chrome.runtime.lastError.message));return}w(e)})}catch(e){b(e)}})}function i(t,r){return a(chrome.storage.local.set.bind(chrome.storage.local),[{[t]:r}])}function o(t){return s(chrome.storage.local.get.bind(chrome.storage.local),[t]).then(r=>r&&t in r?r[t]:null)}v.storage={getAnnotations(t){return o(t).then(r=>Array.isArray(r)?r:[])},setAnnotations(t,r){return i(t,r)},removeAnnotations(t){return a(chrome.storage.local.remove.bind(chrome.storage.local),[t])},getBadgeCount(t){return v.storage.getAnnotations(t).then(r=>r.length)},onChanged(t){chrome.storage.onChanged.addListener((r,w)=>{if(w==="local")for(const b of Object.keys(r)){const e=r[b],l=e&&e.newValue!==void 0?e.newValue:null;t(b,l)}})}}})(),(function(){"use strict";const v=self.ChromeAdapters=self.ChromeAdapters||{};function a(s,i){return new Promise((o,t)=>{try{s(...i,r=>{if(chrome.runtime.lastError){t(new Error(chrome.runtime.lastError.message));return}o(r)})}catch(r){t(r)}})}v.messaging={sendToBackground(s){return a(chrome.runtime.sendMessage.bind(chrome.runtime),[s])},sendToTab(s,i){return a(chrome.tabs.sendMessage.bind(chrome.tabs),[s,i])},onMessage(s){chrome.runtime.onMessage.addListener((i,o,t)=>s(i,o,t)===!0)}}})(),(function(){"use strict";const v=self.ChromeAdapters=self.ChromeAdapters||{};function a(i,o){return new Promise((t,r)=>{try{chrome.action.setBadgeText({text:o||"",tabId:i},()=>{if(chrome.runtime.lastError){r(new Error(chrome.runtime.lastError.message));return}t()})}catch(w){r(w)}})}function s(i,o){return new Promise((t,r)=>{try{chrome.action.setBadgeBackgroundColor({color:o,tabId:i},()=>{if(chrome.runtime.lastError){r(new Error(chrome.runtime.lastError.message));return}t()})}catch(w){r(w)}})}v.badge={setBadge(i,o,t){return t?Promise.all([a(i,o),s(i,t)]):a(i,o)},clearBadge(i){return a(i,"")}}})(),(function(){"use strict";function v(o){try{const t=new URL(o);return`annotations::${t.origin}${t.pathname}${t.hash}`}catch{return null}}function a(o){try{const t=new URL(o);return t.hostname==="localhost"||t.hostname==="127.0.0.1"||t.hostname.endsWith(".local")}catch{return!1}}let s;function i(o){return s||(s=document.createElement("div")),s.textContent=o||"",s.innerHTML}self.pageKey=v,self.isDevUrl=a,self.escapeHtml=i})(),(function(){"use strict";const v=`:host {
  --annota-surface: #0f1115;
  --annota-surface-elevated: #1e2330;
  --annota-surface-hover: #252b3a;
  --annota-surface-list-hover: #161a22;
  --annota-border: #2a2f3a;
  --annota-text: #f3f4f6;
  --annota-text-inverted: #ffffff;
  --annota-text-muted: #9ca3af;
  --annota-text-secondary: #d1d5db;
  --annota-text-tertiary: #6b7280;
  --annota-accent: #4a8fe8;
  --annota-accent-hover: #3a7fd8;
  --annota-accent-tint: rgba(74, 143, 232, 0.12);
  --annota-success: #22c55e;
  --annota-success-hover: #16a34a;
  --annota-success-bg: #1a2e1a;
  --annota-success-border: #2a3a2a;
  --annota-success-text: #4ade80;
  --annota-danger: #ef4444;
  --annota-danger-tint: rgba(239, 68, 68, 0.1);
  --annota-error: #f87171;
  --annota-shadow-xs: 0 1px 3px rgba(15, 20, 35, 0.25);
  --annota-shadow-sm: 0 4px 12px rgba(15, 20, 35, 0.25);
  --annota-shadow-md: 0 8px 24px rgba(15, 20, 35, 0.35);
  --annota-space-2xs: 2px;
  --annota-space-xs: 4px;
  --annota-space-sm: 6px;
  --annota-space-md: 8px;
  --annota-space-lg: 12px;
  --annota-space-xl: 16px;
  --annota-radius-2xs: 3px;
  --annota-radius-xs: 4px;
  --annota-radius-sm: 5px;
  --annota-radius-md: 6px;
  --annota-radius-lg: 8px;
  --annota-font-stack: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --annota-font-mono: 'Geist Mono', 'SF Mono', Monaco, Consolas, monospace;
  --annota-font-size-base: 13px;
  --annota-font-size-sm: 12px;
  --annota-font-size-xs: 11px;
}`;function a(){return v}function s(){return v.replace(/:host/g,":root")}self.shadowTokens=a,self.rootTokens=s})(),(function(){"use strict";const v={};v.hasStableLocator=function(a){return!!(a.dataset.testid||a.dataset.cy)},v.hasRoleOrAriaLabel=function(a){return!!(a.getAttribute("role")||a.getAttribute("aria-label"))},v.isTextBlock=function(a){const s=(a.innerText||a.textContent||"").trim();if(s.length<1)return!1;if(!a.children||a.children.length===0||["P","SPAN","H1","H2","H3","H4","H5","H6","LI","LABEL","B","STRONG","I","EM","SMALL","SUB","SUP","CODE","PRE"].includes(a.tagName))return!0;if(s.length>500)return!1;const t=a.getBoundingClientRect(),r=window.innerWidth*window.innerHeight;return r===0||t.width*t.height/r<.6},v.isCardContainer=function(a){if(a===document.body||a===document.documentElement)return!1;const s=getComputedStyle(a),i=s.borderStyle!=="none"&&s.borderWidth!=="0px"&&s.borderColor!=="rgba(0, 0, 0, 0)",o=s.backgroundColor&&s.backgroundColor!=="rgba(0, 0, 0, 0)"&&s.backgroundColor!=="transparent",t=s.boxShadow&&s.boxShadow!=="none",r=a.dataset&&Object.keys(a.dataset).length>0,w=a.getAttribute("role");if(!i&&!o&&!t&&!r&&!w)return!1;const b=a.getBoundingClientRect(),e=window.innerWidth*window.innerHeight;return e===0||b.width*b.height/e<=.7},v.findRepeatedCardAncestor=function(a){let s=a;for(;s&&s!==document.body;){const i=s.parentElement;if(i&&Array.from(i.children).filter(t=>t.tagName===s.tagName&&t.className===s.className).length>=2)return s;s=i}return null},v.isStructuralContainer=function(a){if(a===document.body||a===document.documentElement)return!1;if(["SECTION","ARTICLE","MAIN","ASIDE","NAV","HEADER","FOOTER"].includes(a.tagName))return!0;if(a.tagName==="DIV"){const i=a.getBoundingClientRect();if(i.width===0||i.height===0)return!1;const o=window.innerWidth*window.innerHeight;if(o===0)return!1;const t=i.width*i.height/o;return t>=.01&&t<=.7}return!1},v.normalizeTarget=function(a){if(!a||a===document.documentElement||a===document.body)return a;const s=["IMG","INPUT","BUTTON","A","TEXTAREA","SELECT"];let i=a;for(;i&&i!==document.body&&i!==document.documentElement;){if(s.includes(i.tagName))return i;i=i.parentElement}let o=null,t=a;for(;t&&t!==document.body&&t!==document.documentElement;){if(v.hasStableLocator(t)){o=t;break}if(v.hasRoleOrAriaLabel(t)){o=t;break}if(v.isTextBlock(t)){o=t;break}if(v.isCardContainer(t)){o=t;break}if(v.isStructuralContainer(t)){o=t;break}t=t.parentElement}if(o){if(!(v.hasStableLocator(o)||v.hasRoleOrAriaLabel(o)||v.isTextBlock(o))){const e=v.findRepeatedCardAncestor(o);if(e)return e}return o}const r=a.getBoundingClientRect(),w=window.innerWidth*window.innerHeight;return w>0&&r.width*r.height/w>.8,a},window.normalizeTarget=v.normalizeTarget})(),(function(){"use strict";const v=/^(p|m|w|h|min|max|flex|grid|gap|text|font|bg|border|rounded|shadow|opacity|overflow|absolute|relative|fixed|sticky|inline|block|hidden|visible|cursor|transition|duration|ease|delay|animate|transform|origin|scale|rotate|translate|skew|space|divide|self|place|items|content|order|grow|shrink|basis|col|row|auto|top|right|bottom|left|z)-/,a=/^(sm|md|lg|xl|2xl):/,s=/^(hover|focus|active|visited|disabled|group-hover|dark):/,i=/_[a-zA-Z0-9]{5,8}$/;function o(l){if(!l)return"";const E=l.split(":"),u=E[E.length-1],y=E.length>1||a.test(l)||s.test(l);return v.test(u)||y||/^[a-z]$/.test(u)||/^\d/.test(u)?"":u.replace(i,"")||u}function t(l){try{return document.querySelectorAll(l).length===1}catch{return!1}}function r(l){if(!l.className||typeof l.className!="string")return[];const E=[],u=new Set;return l.className.split(/\s+/).forEach(y=>{const p=o(y);!p||u.has(p)||(u.add(p),E.push(p))}),E}function w(l){const E=[];let u=l;for(;u&&u!==document.body&&u!==document.documentElement;){const y=u.tagName.toLowerCase(),p=u.parentElement;if(p){const h=Array.from(p.children).filter(g=>g.tagName===u.tagName);if(h.length>1){const g=h.indexOf(u)+1;E.unshift(`${y}:nth-of-type(${g})`)}else E.unshift(y)}else E.unshift(y);u=p}return E.join(" > ")}function b(l){if(l.dataset.testid){const p=`[data-testid="${CSS.escape(l.dataset.testid)}"]`;if(t(p))return p}if(l.dataset.cy){const p=`[data-cy="${CSS.escape(l.dataset.cy)}"]`;if(t(p))return p}const E=l.getAttribute("aria-label");if(E){const p=`${l.tagName.toLowerCase()}[aria-label="${CSS.escape(E)}"]`;if(t(p))return p}const u=l.getAttribute("role");if(u&&E){const p=`[role="${CSS.escape(u)}"][aria-label="${CSS.escape(E)}"]`;if(t(p))return p}if(l.id){const p=`#${CSS.escape(l.id)}`;if(t(p))return p}const y=r(l);if(y.length>0){const p=y.map(g=>`.${CSS.escape(g)}`).join(""),h=`${l.tagName.toLowerCase()}${p}`;if(t(h))return h;if(l.parentElement){const g=Array.from(l.parentElement.children).filter(c=>c.tagName===l.tagName);if(g.length>1){const c=g.indexOf(l)+1,S=`${h}:nth-of-type(${c})`;if(t(S))return S}}}return w(l)}function e(l){try{return document.querySelector(l)}catch{return null}}window.generateSelector=b,window.getMeaningfulClasses=r,window.querySelectorSafe=e})(),(function(){"use strict";const v=self.ChromeAdapters;function a(o,t){const r=new Map;return function(b,e){const E=(r.get(b)||Promise.resolve()).then(()=>Promise.resolve(o(b)).then(u=>{const y=Array.isArray(u)?u:[],p=e(y);return Promise.resolve(t(b,p)).then(()=>p)}));return r.set(b,E.then(()=>{},()=>{})),E}}function s(){if(!v||!v.storage)throw new Error("ChromeAnnotationsStorage requires ChromeAdapters.storage (chrome-storage-adapter.js must load first)");const o=v.storage;function t(b){return o.getAnnotations(b)}function r(b,e){return o.setAnnotations(b,e)}const w=a(t,r);return{read:t,replace:r,mutate:w}}function i(){const o=new Map;function t(b){const e=o.get(b);return Promise.resolve(Array.isArray(e)?e:[])}function r(b,e){return o.set(b,Array.isArray(e)?e:[]),Promise.resolve()}const w=a(t,r);return{read:t,replace:r,mutate:w}}self.serializeMutate=a,self.ChromeAnnotationsStorage=s,self.MemoryAnnotationsStorage=i})(),(function(){"use strict";function v(){const a=[];let s=!1;const i=[];return{subscribe(o){return a.push(o),()=>{const t=a.indexOf(o);t!==-1&&a.splice(t,1)}},notify(o){if(s){i.push(o);return}s=!0;try{for(const t of a)try{t(o)}catch{}}finally{if(s=!1,i.length>0){const t=i.shift();this.notify(t)}}},size(){return a.length}}}self.createObserver=v})(),(function(){"use strict";function a(s){const{getAnnotations:i,setAnnotations:o,getPageKey:t,getLocatorHint:r}=s,w=s.storage||window.ChromeAnnotationsStorage(),b=window.createObserver(),e={subscribe:b.subscribe},l=b.notify,E=h=>w.mutate(t(),h).then(g=>(o(g),l(g),g),()=>{throw new Error("Could not save feedback. Try again.")});let u=null;function y(){u=new Map;for(const h of i())u.set(h.selector,h)}function p(){u=null}return e.loadAnnotations=async()=>{try{o(await w.read(t()))}catch{o([])}p()},e.saveAnnotation=h=>E(g=>[...g,{schemaVersion:1,id:crypto.randomUUID(),selector:h.selector,locatorHint:h.locatorHint||"",tag:h.tag,elementSnippet:h.elementSnippet||"",text:h.text||"",feedback:h.feedback,viewport:h.viewport,fingerprint:h.fingerprint,createdAt:Date.now(),pageKey:t()}]).then(g=>(p(),g)),e.replaceAnnotation=(h,g)=>E(c=>{const S=c.findIndex(f=>f.id===h);if(S===-1)return c;const x=c.slice();return x[S]=Object.assign({},x[S],{feedback:g}),x}).then(c=>(p(),c)),e.deleteAnnotationById=async h=>{try{const g=await E(c=>c.filter(S=>S.id!==h));return p(),g}catch{return i()}},e.deleteAnnotationsByIds=async h=>{const g=new Set(h);try{return await E(c=>c.filter(S=>!g.has(S.id)))}catch{return i()}},e.clearPageAnnotations=async()=>{try{return await E(()=>[])}catch{}return p(),[]},e.findAnnotationForElement=h=>{u||y();const g=window.generateSelector(h),c=u.get(g);if(c)return c;if(!r)return null;const S=r(h);return S&&i().find(x=>x.locatorHint===S)||null},e}window.createAnnotationStore=a})(),(function(){"use strict";const{escapeHtml:v}=window;function a(){return`
      <div class="annota-popover-header">
        <span class="annota-popover-title">Add feedback</span>
      </div>
      <div class="annota-popover-body">
        <textarea class="annota-popover-textarea" rows="1" placeholder="Describe the change..."></textarea>
      </div>
      <div class="annota-popover-footer">
        <span class="annota-popover-error" style="display:none"></span>
        <button class="annota-btn annota-btn-secondary annota-popover-cancel" type="button">Cancel</button>
        <button class="annota-btn annota-btn-primary annota-popover-save" type="button" disabled>Save</button>
      </div>
    `}function s(o){return`
      <div class="annota-popover-header">
        <span class="annota-popover-title">Existing feedback</span>
      </div>
      <div class="annota-popover-body">
        <div class="annota-popover-existing">${v(o.feedback)}</div>
      </div>
      <div class="annota-popover-footer">
        <span class="annota-popover-error" style="display:none"></span>
        <button class="annota-btn annota-btn-secondary annota-popover-cancel" type="button">Cancel</button>
        <button class="annota-btn annota-btn-danger annota-popover-delete" type="button">Delete</button>
        <button class="annota-btn annota-btn-primary annota-popover-replace" type="button">Replace</button>
      </div>
    `}function i(o){return`
      <div class="annota-popover-header">
        <span class="annota-popover-title">Replace feedback</span>
      </div>
      <div class="annota-popover-body">
        <textarea class="annota-popover-textarea" rows="1" placeholder="New feedback...">${v(o.feedback)}</textarea>
      </div>
      <div class="annota-popover-footer">
        <span class="annota-popover-error" style="display:none"></span>
        <button class="annota-btn annota-btn-secondary annota-popover-cancel" type="button">Cancel</button>
        <button class="annota-btn annota-btn-primary annota-popover-save" type="button">Save</button>
      </div>
    `}window.renderNewPopoverHTML=a,window.renderExistingPopoverHTML=s,window.renderReplacePopoverHTML=i})(),(function(){"use strict";const{escapeHtml:v}=window,a=360,s=12;function i(o){const t=o.popover,r=o.getOpenPopoverAnnotationId,w=o.setOpenPopoverAnnotationId,b=o.generateSelector,e=o.getElementText,l=o.getLocatorHint,E=o.getElementSnippet,u=o.getFingerprint,y=o.saveAnnotation,p=o.replaceAnnotation,h=o.deleteAnnotationById;let g=0,c=0;function S(f,m,A,{onSave:C}){f.addEventListener("input",()=>{m.disabled=!f.value.trim()}),f.addEventListener("keydown",P=>{(P.key==="ArrowUp"||P.key==="ArrowDown")&&(P.preventDefault(),P.stopPropagation())}),m.addEventListener("click",async()=>{const P=f.value.trim();if(P)try{await C(P),m.textContent="Saved",m.classList.remove("annota-btn-primary"),m.classList.add("annota-btn-saved"),m.disabled=!0,setTimeout(()=>x.closePopover(!0),300)}catch(k){A.textContent=k.message||"Could not save feedback. Try again.",A.style.display=""}})}const x={};return x.openNewPopover=function(f,m,A){w(null);const C=b(f),P=e(f),k=l(f);t.innerHTML=window.renderNewPopoverHTML(),g=m,c=A,x.positionPopover(m,A),t.style.display="block",t.classList.remove("annota-popover-instant"),requestAnimationFrame(()=>t.classList.add("annota-popover-open"));const I=t.querySelector(".annota-popover-textarea"),R=t.querySelector(".annota-popover-save"),D=t.querySelector(".annota-popover-cancel"),N=t.querySelector(".annota-popover-error");I.focus(),x.setupTextareaAutoGrow(I),S(I,R,N,{onSave:async z=>y({selector:C,locatorHint:k,tag:f.tagName.toLowerCase(),elementSnippet:E(f),text:P,feedback:z,viewport:{width:window.innerWidth,height:window.innerHeight},fingerprint:u(f)})}),D.addEventListener("click",()=>x.closePopover())},x.openExistingPopover=function(f,m,A){w(f.id),t.innerHTML=window.renderExistingPopoverHTML(f),g=m,c=A,x.positionPopover(m,A),t.style.display="block",t.classList.remove("annota-popover-instant"),requestAnimationFrame(()=>t.classList.add("annota-popover-open"));const C=t.querySelector(".annota-popover-cancel"),P=t.querySelector(".annota-popover-delete"),k=t.querySelector(".annota-popover-replace");C.addEventListener("click",()=>x.closePopover()),P.addEventListener("click",()=>{h(f.id),x.closePopover()}),k.addEventListener("click",()=>{x.openReplaceMode(f)})},x.openReplaceMode=function(f){t.innerHTML=window.renderReplacePopoverHTML(f);const m=t.querySelector(".annota-popover-textarea"),A=t.querySelector(".annota-popover-save"),C=t.querySelector(".annota-popover-cancel"),P=t.querySelector(".annota-popover-error");m.focus(),m.setSelectionRange(m.value.length,m.value.length),x.setupTextareaAutoGrow(m),S(m,A,P,{onSave:async k=>p(f.id,k)}),C.addEventListener("click",()=>{x.openExistingPopover(f,g,c)})},x.closePopover=function(f){w(null),f&&t.classList.add("annota-popover-instant"),t.classList.remove("annota-popover-open"),setTimeout(()=>{t.style.display="none",t.classList.remove("annota-popover-instant"),t.innerHTML=""},f?0:120)},x.positionPopover=function(f,m){let A=f+s,C=m+s;const P=window.innerWidth,k=window.innerHeight;A+a>P-12&&(A=f-a-s),A<12&&(A=12),t.style.left=A+"px",t.style.top=C+"px",requestAnimationFrame(()=>{const I=t.getBoundingClientRect();C+I.height>k-12&&(C=m-I.height-s,C<12&&(C=12),t.style.top=C+"px")})},x.setupTextareaAutoGrow=function(f){f.style.resize="none",f.style.minHeight="36px";const m=200;f.addEventListener("input",()=>{f.style.height="auto",f.style.height=Math.min(f.scrollHeight,m)+"px"})},x}window.createPopoverManager=i,window.POPOVER_WIDTH=a,window.POPOVER_OFFSET=s})(),(function(){"use strict";function i(t,r){const w=[...t].sort((e,l)=>e.createdAt-l.createdAt),b=[];for(const e of w){const l=r(e);if(!l)continue;const E=l.getBoundingClientRect();let u=E.right-22+4,y=E.top-4;const p=window.innerWidth,h=window.innerHeight;u+22>p&&(u=p-22-4),u<0&&(u=4),y+22>h&&(y=h-22-4),y<0&&(y=4);for(const g of b)Math.abs(u-g.x)<22&&Math.abs(y-g.y)<22&&(u+=10,y+=10);b.push({id:e.id,x:u,y})}return b}function o(t){const r=t.badgeContainer,w=t.getAnnotations,b=t.setBadgePositions,e=t.openExistingPopover,l=t.querySelectorSafe||window.querySelectorSafe,E={};return E.renderBadges=function(){r.innerHTML="";const u=w(),y=i(u,g=>l(g.selector));b(y);const p=new Map(y.map(g=>[g.id,g]));[...u].sort((g,c)=>g.createdAt-c.createdAt).forEach((g,c)=>{const S=p.get(g.id);if(!S)return;const x=document.createElement("div");x.className="annota-badge",x.textContent=String(c+1),x.style.left=S.x+"px",x.style.top=S.y+"px",x.addEventListener("click",f=>{f.stopPropagation(),e(g,S.x,S.y+22)}),r.appendChild(x)})},E.repositionBadges=function(){const u=r.querySelectorAll(".annota-badge"),y=w(),p=i(y,c=>l(c.selector));b(p);const h=new Map(p.map(c=>[c.id,c]));[...y].sort((c,S)=>c.createdAt-S.createdAt).forEach((c,S)=>{const x=u[S];if(!x)return;const f=h.get(c.id);if(!f){x.style.display="none";return}x.style.display="flex",x.style.left=f.x+"px",x.style.top=f.y+"px"})},E}window.calculateBadgePositions=i,window.createBadgeRenderer=o,window.BADGE_SIZE=22,window.BADGE_OFFSET=4,window.BADGE_COLLISION_STEP=10})(),(function(){"use strict";function s(i){const o=i.getAnnotations,t=i.getOpenPopoverAnnotationId,r=i.retryMap,w=i.deleteAnnotations,b=i.onStaleRemoved,e=i.onStaleError,l=i.getElementText,E=i.querySelectorSafe||window.querySelectorSafe;function u(h,g){if(h===g)return 1;const c=h.length,S=g.length;if(c===0||S===0)return 0;const x=Math.max(c,S),f=[];for(let m=0;m<=S;m++)f[m]=[m];for(let m=0;m<=c;m++)f[0][m]=m;for(let m=1;m<=S;m++)for(let A=1;A<=c;A++){const C=h[A-1]===g[m-1]?0:1;f[m][A]=Math.min(f[m-1][A]+1,f[m][A-1]+1,f[m-1][A-1]+C)}return 1-f[S][c]/x}function y(h){return(h||"").toLowerCase().replace(/\s+/g," ").trim()}const p={};return p.levenshteinSimilarity=u,p.normalizeText=y,p.validateCurrentPageAnnotations=function(){const h=Date.now(),g=[];for(const c of o()){if(c.id===t())continue;const S=E(c.selector);if(!S){if(!r.has(c.id)){r.set(c.id,h);continue}h-r.get(c.id)>=3e3&&(g.push(c.id),r.delete(c.id));continue}if(r.delete(c.id),S.tagName.toLowerCase()!==c.fingerprint.tagName){if(!r.has(c.id+"_tag")){r.set(c.id+"_tag",h);continue}h-r.get(c.id+"_tag")>=3e3&&(g.push(c.id),r.delete(c.id+"_tag"));continue}const x=y(c.fingerprint.text),f=y(l(S));if(f&&x&&u(x,f)<.7){if(!r.has(c.id+"_text")){r.set(c.id+"_text",h);continue}h-r.get(c.id+"_text")>=3e3&&(g.push(c.id),r.delete(c.id+"_text"));continue}r.delete(c.id+"_text"),r.delete(c.id+"_tag")}g.length>0&&w(g).then(()=>b(g.length),()=>e())},p}window.createStaleValidator=s,window.RETRY_MS=3e3,window.STALE_TEXT_THRESHOLD=.7})(),(function(){"use strict";function v(a){const s=a.getLastUrl,i=a.setLastUrl,o=a.onUrlChange,t={};return t.handleUrlChange=function(){const r=location.href;r!==s()&&(i(r),o())},t.setupSPADetection=function(){const r=history.pushState,w=history.replaceState;history.pushState=function(){r.apply(this,arguments),t.handleUrlChange()},history.replaceState=function(){w.apply(this,arguments),t.handleUrlChange()},window.addEventListener("popstate",t.handleUrlChange),window.addEventListener("hashchange",t.handleUrlChange)},t}window.createSpaDetector=v})(),(function(){"use strict";const v=window.ChromeAdapters;function a(s){const i={onStartPickMode:s.onStartPickMode,onStopPickMode:s.onStopPickMode,onGetState:s.onGetState,onDeleteAnnotation:s.onDeleteAnnotation,onClearPage:s.onClearPage};function o(t,r,w){return t.type==="START_PICK_MODE"&&(i.onStartPickMode(),w({ok:!0})),t.type==="STOP_PICK_MODE"&&(i.onStopPickMode(),w({ok:!0})),t.type==="GET_STATE"&&w(i.onGetState()),t.type==="DELETE_ANNOTATION"?(i.onDeleteAnnotation(t.id).then(()=>w({ok:!0})),!0):(t.type==="CLEAR_PAGE"&&i.onClearPage().then(()=>w({ok:!0})),!0)}return v.messaging.onMessage(o),{listener:o}}window.createMessageRouter=a})(),(()=>{"use strict";const v=window.ChromeAdapters,{normalizeTarget:a,pageKey:s,getMeaningfulClasses:i}=window,o="__annota-root__",t="2147483647",r=500,w="Extension context invalidated";function b(n){return v.messaging.sendToBackground(n).catch(d=>{if(!(d&&d.message&&d.message.includes(w)))throw d})}const e={shadowHost:null,shadowRoot:null,chip:null,hoverHighlight:null,popover:null,badgeContainer:null,noticeEl:null,pickMode:!1,currentTarget:null,annotations:[],pageKey:"",currentPagePath:"",openPopoverAnnotationId:null,retryMap:new Map,mutationTimer:null,lastUrl:location.href,badgePositions:[]};let l=0,E,u,y,p,h;function g(){return window.shadowTokens()}function c(){if(e.shadowHost&&document.documentElement.contains(e.shadowHost))return;e.shadowHost=document.createElement("div"),e.shadowHost.id=o,e.shadowHost.style.cssText=`all:initial;position:fixed;z-index:${t};top:0;left:0;width:0;height:0;pointer-events:none;`,e.shadowRoot=e.shadowHost.attachShadow({mode:"open"});const n=document.createElement("style");n.textContent=S(),e.shadowRoot.appendChild(n),e.chip=document.createElement("div"),e.chip.className="annota-chip",e.chip.style.display="none",e.chip.innerHTML=`
      <span class="annota-chip-label">Design mode</span>
      <span class="annota-chip-count" style="display:none"></span>
      <button class="annota-chip-done">Done</button>
    `,e.chip.querySelector(".annota-chip-done").addEventListener("click",$),J(e.chip),e.shadowRoot.appendChild(e.chip),e.hoverHighlight=document.createElement("div"),e.hoverHighlight.className="annota-highlight",e.hoverHighlight.style.display="none",e.shadowRoot.appendChild(e.hoverHighlight),e.popover=document.createElement("div"),e.popover.className="annota-popover",e.popover.style.display="none",e.popover.addEventListener("mousedown",d=>d.stopPropagation()),e.popover.addEventListener("click",d=>d.stopPropagation()),e.shadowRoot.appendChild(e.popover),e.badgeContainer=document.createElement("div"),e.badgeContainer.className="annota-badges",e.shadowRoot.appendChild(e.badgeContainer),e.noticeEl=document.createElement("div"),e.noticeEl.className="annota-notice",e.noticeEl.style.display="none",e.shadowRoot.appendChild(e.noticeEl),document.documentElement.appendChild(e.shadowHost)}function S(){return g()+`
      :host { all: initial; position: fixed; z-index: ${t}; top: 0; left: 0; width: 0; height: 0; pointer-events: none; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .annota-chip {
        position: fixed; top: 12px; right: 12px; z-index: ${t};
        display: inline-flex; align-items: center; gap: 8px;
        padding: 6px 12px;
        background: var(--annota-surface); border: 1px solid var(--annota-border); border-radius: 20px;
        box-shadow: var(--annota-shadow-sm);
        font: var(--annota-font-size-sm)/1.4 var(--annota-font-stack);
        color: var(--annota-text); pointer-events: auto; white-space: nowrap;
        opacity: 0.9; transition: opacity 150ms ease;
        cursor: grab; user-select: none;
      }
      .annota-chip:hover { opacity: 1; }
      .annota-chip:active { cursor: grabbing; }
      .annota-chip-label { font-weight: 500; }
      .annota-chip-count {
        font-size: var(--annota-font-size-xs); background: var(--annota-accent); color: var(--annota-text-inverted);
        padding: 1px 6px; border-radius: 10px; flex-shrink: 0; font-variant-numeric: tabular-nums;
      }
      .annota-chip-done {
        background: var(--annota-surface-elevated); color: var(--annota-text); border: 1px solid var(--annota-border);
        padding: 2px 10px; border-radius: var(--annota-radius-xs); cursor: pointer;
        font: inherit; font-size: var(--annota-font-size-xs); font-weight: 500;
        transition: background 150ms ease;
      }
      .annota-chip-done:hover { background: var(--annota-surface-hover); }
      .annota-chip-done:focus-visible { outline: 2px solid var(--annota-accent); outline-offset: 2px; }
      .annota-highlight {
        position: fixed; z-index: ${t}; pointer-events: none;
        border: 2px solid var(--annota-accent); background: var(--annota-accent-tint);
        border-radius: var(--annota-radius-2xs); transition: all 60ms ease;
      }
      .annota-popover {
        position: fixed; z-index: ${t}; pointer-events: auto;
        width: ${window.POPOVER_WIDTH}px; max-width: calc(100vw - 24px);
        background: var(--annota-surface); border: 1px solid var(--annota-border); border-radius: var(--annota-radius-lg);
        box-shadow: var(--annota-shadow-md);
        font: var(--annota-font-size-base)/1.4 var(--annota-font-stack);
        color: var(--annota-text);
        transform: scale(0.95); opacity: 0;
        transition: transform 120ms ease, opacity 120ms ease;
      }
      .annota-popover.annota-popover-open { transform: scale(1); opacity: 1; }
      .annota-popover.annota-popover-instant { transition: none; }
      @media (prefers-reduced-motion: reduce) {
        .annota-popover { transition: none; }
        .annota-highlight { transition: none; }
      }
      .annota-popover-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 10px var(--annota-space-lg); border-bottom: 1px solid var(--annota-border);
      }
      .annota-popover-title { font-size: var(--annota-font-size-sm); color: var(--annota-text-muted); }
      .annota-popover-close {
        background: none; border: none; color: var(--annota-text-muted); cursor: pointer;
        font-size: 16px; line-height: 1; padding: var(--annota-space-2xs) var(--annota-space-xs);
      }
      .annota-popover-close:hover { color: var(--annota-text); }
      .annota-popover-close:focus-visible { outline: 2px solid var(--annota-accent); }
      .annota-popover-body { padding: var(--annota-space-lg); }
      .annota-popover-textarea {
        width: 100%; min-height: 36px; max-height: 200px; resize: none;
        background: var(--annota-surface-elevated); color: var(--annota-text); border: 1px solid var(--annota-border);
        border-radius: var(--annota-radius-md); padding: var(--annota-space-md); font: inherit; font-size: var(--annota-font-size-base);
        line-height: 1.5; overflow: hidden; scrollbar-width: none;
      }
      .annota-popover-textarea:focus { outline: none; border-color: var(--annota-accent); }
      .annota-popover-existing {
        font-size: var(--annota-font-size-sm); color: var(--annota-text-secondary); white-space: pre-wrap;
        word-break: break-word; padding: var(--annota-space-xs) 0;
      }
      .annota-popover-footer {
        display: flex; align-items: center; justify-content: flex-end; gap: var(--annota-space-md);
        padding: 10px var(--annota-space-lg); border-top: 1px solid var(--annota-border);
      }
      .annota-popover-error {
        font-size: var(--annota-font-size-sm); color: var(--annota-error); margin-right: auto;
      }
      .annota-btn {
        padding: var(--annota-space-sm) 14px; border: none; border-radius: var(--annota-radius-sm);
        font: inherit; font-size: var(--annota-font-size-sm); font-weight: 500; cursor: pointer;
        transition: background 150ms ease, transform 80ms ease;
      }
      .annota-btn:active { transform: translateY(1px); }
      .annota-btn:focus-visible { outline: 2px solid var(--annota-accent); outline-offset: 2px; }
      .annota-btn-primary { background: var(--annota-accent); color: var(--annota-text-inverted); }
      .annota-btn-primary:hover { background: var(--annota-accent-hover); }
      .annota-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
      .annota-btn-secondary { background: var(--annota-surface-elevated); color: var(--annota-text); border: 1px solid var(--annota-border); }
      .annota-btn-secondary:hover { background: var(--annota-surface-hover); }
      .annota-btn-danger { background: none; color: var(--annota-danger); }
      .annota-btn-danger:hover { background: var(--annota-danger-tint); }
      .annota-btn-saved { background: var(--annota-success); color: var(--annota-text-inverted); }
      .annota-badge {
        position: fixed; z-index: ${t}; pointer-events: auto;
        width: ${window.BADGE_SIZE}px; height: ${window.BADGE_SIZE}px; border-radius: 50%;
        background: var(--annota-accent); color: var(--annota-text-inverted);
        font: 600 var(--annota-font-size-xs)/1 var(--annota-font-stack);
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; box-shadow: var(--annota-shadow-xs);
      }
      .annota-badge:hover { background: var(--annota-accent-hover); }
      .annota-notice {
        position: fixed; bottom: var(--annota-space-lg); left: 50%; transform: translateX(-50%);
        z-index: ${t}; pointer-events: auto;
        background: var(--annota-surface-elevated); color: var(--annota-text); border: 1px solid var(--annota-border);
        padding: var(--annota-space-md) var(--annota-space-xl); border-radius: var(--annota-radius-md);
        font: var(--annota-font-size-sm)/1.4 var(--annota-font-stack);
        box-shadow: var(--annota-shadow-sm);
        opacity: 0; transition: opacity 200ms ease;
      }
      .annota-notice.annota-notice-visible { opacity: 1; }
    `}function x(){new MutationObserver(()=>{document.documentElement.contains(e.shadowHost)||(c(),u.renderBadges(),e.pickMode&&m())}).observe(document.documentElement,{childList:!0})}function f(n){e.noticeEl.textContent=n,e.noticeEl.style.display="block",requestAnimationFrame(()=>e.noticeEl.classList.add("annota-notice-visible")),setTimeout(()=>{e.noticeEl.classList.remove("annota-notice-visible"),setTimeout(()=>{e.noticeEl.style.display="none"},200)},3e3)}function m(){e.chip.style.display="flex",C()}function A(){e.chip.style.display="none"}function C(){const n=e.chip.querySelector(".annota-chip-count");e.annotations.length>0?(n.textContent=e.annotations.length,n.style.display=""):n.style.display="none"}function P(){C(),u.renderBadges(),b({type:"ANNOTATIONS_CHANGED"})}function k(n){const d=n.getAttribute("aria-label");return d?d.trim():n.placeholder?n.placeholder.trim().slice(0,100):n.value!==void 0&&n.value!==""?String(n.value).trim().slice(0,100):n.alt?n.alt.trim():n.title?n.title.trim():(n.innerText||"").trim().slice(0,100)}function I(n){if(n.dataset.testid)return`data-testid="${n.dataset.testid}"`;if(n.dataset.cy)return`data-cy="${n.dataset.cy}"`;const d=n.getAttribute("aria-label");if(d)return`aria-label="${d}"`;const T=n.getAttribute("role");if(T){const L=n.getAttribute("aria-labelledby"),M=d||L&&document.getElementById(L)?.textContent?.trim();if(M)return`role="${T}" name="${M}"`}const _=n.querySelector("h1, h2, h3, h4, h5, h6");if(_){const L=(_.innerText||"").trim().slice(0,50);if(L)return`heading text "${L}"`}const H=n.querySelector("img[alt]");return H&&H.alt?`image alt "${H.alt}"`:""}function R(n){return{tagName:n.tagName.toLowerCase(),text:k(n),childCount:n.children?n.children.length:0}}function D(n){const d=n.tagName.toLowerCase(),T=[];for(const _ of n.attributes){const H=_.name.toLowerCase();let L=_.value;if(H==="class")L=i(n).join(" ");else if(!N(H,L))continue;!L||L.length>120||T.push(`${H}="${z(L)}"`)}return T.length>0?`<${d} ${T.join(" ")}>`:`<${d}>`}function N(n,d){return!d||n==="style"||n.startsWith("on")?!1:n==="id"||n==="role"||n==="data-testid"||n==="data-cy"||n.startsWith("aria-")?!0:["href","src","alt","title","name","type","placeholder","value"].includes(n)}function z(n){return String(n).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function F(n){if(!n)return!1;const d=n.composedPath?n.composedPath():[];return d.includes(e.shadowRoot)||d.includes(e.shadowHost)}function Z(){if(e.pickMode)return;e.pickMode=!0,m();const n=document.createElement("style");n.id="__annota-pick-cursor__",n.textContent="*,*::before,*::after{cursor:crosshair!important}",document.head.appendChild(n),document.addEventListener("mouseover",V,!0),document.addEventListener("click",W,!0),window.addEventListener("scroll",B,{passive:!0}),window.addEventListener("resize",B,{passive:!0}),b({type:"PICK_MODE_CHANGED",pickMode:!0})}function $(){if(!e.pickMode)return;e.pickMode=!1;const n=document.getElementById("__annota-pick-cursor__");n&&n.remove(),e.currentTarget=null,A(),e.hoverHighlight.style.display="none",document.removeEventListener("mouseover",V,!0),document.removeEventListener("click",W,!0),window.removeEventListener("scroll",B),window.removeEventListener("resize",B),b({type:"PICK_MODE_CHANGED",pickMode:!1})}function B(){const n=e.currentTarget;if(!n||!document.documentElement.contains(n)){e.hoverHighlight.style.display="none",e.currentTarget=null;return}const d=n.getBoundingClientRect();if(d.width===0&&d.height===0){e.hoverHighlight.style.display="none";return}e.hoverHighlight.style.display="block",e.hoverHighlight.style.top=d.top+"px",e.hoverHighlight.style.left=d.left+"px",e.hoverHighlight.style.width=d.width+"px",e.hoverHighlight.style.height=d.height+"px"}function V(n){if(F(n))return;const d=a(n.target);if(!d||d===document.body||d===document.documentElement){e.hoverHighlight.style.display="none",e.currentTarget=null;return}e.currentTarget=d,B()}function W(n){if(F(n))return;if(e.popover.style.display!=="none"){n.preventDefault(),n.stopPropagation(),n.stopImmediatePropagation();return}n.preventDefault(),n.stopPropagation(),n.stopImmediatePropagation();const T=a(n.target)||e.currentTarget;if(!T||T===document.body||T===document.documentElement)return;const _=y.findAnnotationForElement(T);_?E.openExistingPopover(_,n.clientX,n.clientY):E.openNewPopover(T,n.clientX,n.clientY)}function j(){new MutationObserver(()=>{e.annotations.length!==0&&(clearTimeout(e.mutationTimer),e.mutationTimer=setTimeout(()=>{p.validateCurrentPageAnnotations()},r))}).observe(document.body,{childList:!0,subtree:!0})}function Y(){e.pageKey=s(location.href),e.currentPagePath=location.pathname+location.hash}async function G(){Y(),await y.loadAnnotations(),C(),u.renderBadges()}function J(n){let d=!1,T,_,H,L;n.addEventListener("pointerdown",M=>{if(M.button!==0||M.target.closest(".annota-chip-done"))return;d=!0,T=M.clientX,_=M.clientY;const O=n.getBoundingClientRect();H=O.left,L=O.top,n.setPointerCapture(M.pointerId),M.preventDefault()}),n.addEventListener("pointermove",M=>{if(!d)return;const O=M.clientX-T,Q=M.clientY-_;let U=H+O,q=L+Q;const tt=window.innerWidth,et=window.innerHeight,K=n.getBoundingClientRect();U=Math.max(0,Math.min(U,tt-K.width)),q=Math.max(0,Math.min(q,et-K.height)),n.style.left=U+"px",n.style.top=q+"px",n.style.right="auto"}),n.addEventListener("pointerup",()=>{d=!1}),n.addEventListener("pointercancel",()=>{d=!1})}function X(){c(),x();const n=window.ChromeAnnotationsStorage();y=window.createAnnotationStore({getAnnotations:()=>e.annotations,setAnnotations:d=>{e.annotations=d},getPageKey:()=>e.pageKey,getLocatorHint:I,storage:n}),y.subscribe(P),E=window.createPopoverManager({popover:e.popover,getOpenPopoverAnnotationId:()=>e.openPopoverAnnotationId,setOpenPopoverAnnotationId:d=>{e.openPopoverAnnotationId=d},generateSelector:window.generateSelector,getElementText:k,getLocatorHint:I,getElementSnippet:D,getFingerprint:R,saveAnnotation:d=>(l++,y.saveAnnotation(d)),replaceAnnotation:(d,T)=>(l++,y.replaceAnnotation(d,T)),deleteAnnotationById:d=>(l++,y.deleteAnnotationById(d))}),u=window.createBadgeRenderer({badgeContainer:e.badgeContainer,getAnnotations:()=>e.annotations,getBadgePositions:()=>e.badgePositions,setBadgePositions:d=>{e.badgePositions=d},openExistingPopover:E.openExistingPopover}),p=window.createStaleValidator({getAnnotations:()=>e.annotations,getOpenPopoverAnnotationId:()=>e.openPopoverAnnotationId,retryMap:e.retryMap,deleteAnnotations:d=>y.deleteAnnotationsByIds(d),onStaleRemoved:d=>{C(),u.renderBadges(),f(`Removed ${d} stale feedback item${d!==1?"s":""}.`)},onStaleError:()=>f("Could not update stale feedback."),getElementText:k}),h=window.createSpaDetector({getLastUrl:()=>e.lastUrl,setLastUrl:d=>{e.lastUrl=d},onUrlChange:()=>{E.closePopover(!0),e.pickMode&&$(),e.retryMap.clear(),G().then(()=>{setTimeout(()=>p.validateCurrentPageAnnotations(),window.RETRY_MS)}).catch(()=>{})}}),window.createMessageRouter({onStartPickMode:Z,onStopPickMode:$,onGetState:()=>({pickMode:e.pickMode,annotations:[...e.annotations].sort((d,T)=>d.createdAt-T.createdAt)}),onDeleteAnnotation:d=>(l++,y.deleteAnnotationById(d)),onClearPage:()=>(l++,y.clearPageAnnotations())}),Y(),G(),j(),h.setupSPADetection(),v.storage.onChanged((d,T)=>{if(l>0){l--;return}G().then(()=>p.validateCurrentPageAnnotations()).catch(()=>{})}),window.addEventListener("scroll",u.repositionBadges,{passive:!0}),window.addEventListener("resize",u.repositionBadges,{passive:!0})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",X):X()})();
