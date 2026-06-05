(function(){"use strict";const m=self.ChromeAdapters=self.ChromeAdapters||{};function i(t,o){return new Promise((e,b)=>{try{t(...o,()=>{if(chrome.runtime.lastError){b(new Error(chrome.runtime.lastError.message));return}e()})}catch(u){b(u)}})}function c(t,o){return new Promise((e,b)=>{try{t(...o,u=>{if(chrome.runtime.lastError){b(new Error(chrome.runtime.lastError.message));return}e(u)})}catch(u){b(u)}})}function s(t,o){return i(chrome.storage.local.set.bind(chrome.storage.local),[{[t]:o}])}function a(t){return c(chrome.storage.local.get.bind(chrome.storage.local),[t]).then(o=>o&&t in o?o[t]:null)}m.storage={getAnnotations(t){return a(t).then(o=>Array.isArray(o)?o:[])},setAnnotations(t,o){return s(t,o)},removeAnnotations(t){return i(chrome.storage.local.remove.bind(chrome.storage.local),[t])},getBadgeCount(t){return m.storage.getAnnotations(t).then(o=>o.length)},onChanged(t){chrome.storage.onChanged.addListener((o,e)=>{if(e==="local")for(const b of Object.keys(o)){const u=o[b],l=u&&u.newValue!==void 0?u.newValue:null;t(b,l)}})}}})(),(function(){"use strict";const m=self.ChromeAdapters=self.ChromeAdapters||{};function i(c,s){return new Promise((a,t)=>{try{c(...s,o=>{if(chrome.runtime.lastError){t(new Error(chrome.runtime.lastError.message));return}a(o)})}catch(o){t(o)}})}m.messaging={sendToBackground(c){return i(chrome.runtime.sendMessage.bind(chrome.runtime),[c])},sendToTab(c,s){return i(chrome.tabs.sendMessage.bind(chrome.tabs),[c,s])},onMessage(c){chrome.runtime.onMessage.addListener((s,a,t)=>c(s,a,t)===!0)}}})(),(function(){"use strict";const m=self.ChromeAdapters=self.ChromeAdapters||{};function i(s,a){return new Promise((t,o)=>{try{chrome.action.setBadgeText({text:a||"",tabId:s},()=>{if(chrome.runtime.lastError){o(new Error(chrome.runtime.lastError.message));return}t()})}catch(e){o(e)}})}function c(s,a){return new Promise((t,o)=>{try{chrome.action.setBadgeBackgroundColor({color:a,tabId:s},()=>{if(chrome.runtime.lastError){o(new Error(chrome.runtime.lastError.message));return}t()})}catch(e){o(e)}})}m.badge={setBadge(s,a,t){return t?Promise.all([i(s,a),c(s,t)]):i(s,a)},clearBadge(s){return i(s,"")}}})(),(function(){"use strict";function m(a){try{const t=new URL(a);return`annotations::${t.origin}${t.pathname}${t.hash}`}catch{return null}}function i(a){try{const t=new URL(a);return t.hostname==="localhost"||t.hostname==="127.0.0.1"||t.hostname.endsWith(".local")}catch{return!1}}let c;function s(a){return c||(c=document.createElement("div")),c.textContent=a||"",c.innerHTML}self.pageKey=m,self.isDevUrl=i,self.escapeHtml=s})(),(function(){"use strict";const m=`:host {
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
  --annota-accent: #3b82f6;
  --annota-accent-hover: #2563eb;
  --annota-accent-tint: rgba(59, 130, 246, 0.1);
  --annota-success: #22c55e;
  --annota-success-hover: #16a34a;
  --annota-success-bg: #1a2e1a;
  --annota-success-border: #2a3a2a;
  --annota-success-text: #4ade80;
  --annota-danger: #ef4444;
  --annota-danger-tint: rgba(239, 68, 68, 0.1);
  --annota-error: #f87171;
  --annota-shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.3);
  --annota-shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.3);
  --annota-shadow-md: 0 8px 24px rgba(0, 0, 0, 0.4);
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
  --annota-font-stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --annota-font-mono: 'SF Mono', Monaco, Consolas, monospace;
  --annota-font-size-base: 13px;
  --annota-font-size-sm: 12px;
  --annota-font-size-xs: 11px;
}`;function i(){return m}function c(){return m.replace(/:host/g,":root")}self.shadowTokens=i,self.rootTokens=c})(),(function(){"use strict";const m={};m.hasStableLocator=function(i){return!!(i.dataset.testid||i.dataset.cy)},m.hasRoleOrAriaLabel=function(i){return!!(i.getAttribute("role")||i.getAttribute("aria-label"))},m.isTextBlock=function(i){const c=(i.innerText||i.textContent||"").trim();if(c.length<1)return!1;if(!i.children||i.children.length===0||["P","SPAN","H1","H2","H3","H4","H5","H6","LI","LABEL","B","STRONG","I","EM","SMALL","SUB","SUP","CODE","PRE"].includes(i.tagName))return!0;if(c.length>500)return!1;const t=i.getBoundingClientRect(),o=window.innerWidth*window.innerHeight;return o===0||t.width*t.height/o<.6},m.isCardContainer=function(i){if(i===document.body||i===document.documentElement)return!1;const c=getComputedStyle(i),s=c.borderStyle!=="none"&&c.borderWidth!=="0px"&&c.borderColor!=="rgba(0, 0, 0, 0)",a=c.backgroundColor&&c.backgroundColor!=="rgba(0, 0, 0, 0)"&&c.backgroundColor!=="transparent",t=c.boxShadow&&c.boxShadow!=="none",o=i.dataset&&Object.keys(i.dataset).length>0,e=i.getAttribute("role");if(!s&&!a&&!t&&!o&&!e)return!1;const b=i.getBoundingClientRect(),u=window.innerWidth*window.innerHeight;return u===0||b.width*b.height/u<=.7},m.findRepeatedCardAncestor=function(i){let c=i;for(;c&&c!==document.body;){const s=c.parentElement;if(s&&Array.from(s.children).filter(t=>t.tagName===c.tagName&&t.className===c.className).length>=2)return c;c=s}return null},m.normalizeTarget=function(i){if(!i||i===document.documentElement||i===document.body)return i;const c=["IMG","INPUT","BUTTON","A","TEXTAREA","SELECT"];let s=i;for(;s&&s!==document.body&&s!==document.documentElement;){if(c.includes(s.tagName))return s;s=s.parentElement}let a=null,t=i;for(;t&&t!==document.body&&t!==document.documentElement;){if(m.hasStableLocator(t)){a=t;break}if(m.hasRoleOrAriaLabel(t)){a=t;break}if(m.isTextBlock(t)){a=t;break}if(m.isCardContainer(t)){a=t;break}t=t.parentElement}if(a){if(!(m.hasStableLocator(a)||m.hasRoleOrAriaLabel(a)||m.isTextBlock(a))){const u=m.findRepeatedCardAncestor(a);if(u)return u}return a}const o=i.getBoundingClientRect(),e=window.innerWidth*window.innerHeight;return e>0&&o.width*o.height/e>.8,i},window.normalizeTarget=m.normalizeTarget})(),(function(){"use strict";const m=/^(p|m|w|h|min|max|flex|grid|gap|text|font|bg|border|rounded|shadow|opacity|overflow|absolute|relative|fixed|sticky|inline|block|hidden|visible|cursor|transition|duration|ease|delay|animate|transform|origin|scale|rotate|translate|skew|space|divide|self|place|items|content|order|grow|shrink|basis|col|row|auto|top|right|bottom|left|z)-/,i=/^(sm|md|lg|xl|2xl):/,c=/^(hover|focus|active|visited|disabled|group-hover|dark):/,s=/_[a-zA-Z0-9]{5,8}$/;function a(l){if(!l)return"";const y=l.split(":"),h=y[y.length-1],E=y.length>1||i.test(l)||c.test(l);return m.test(h)||E||/^[a-z]$/.test(h)||/^\d/.test(h)?"":h.replace(s,"")||h}function t(l){try{return document.querySelectorAll(l).length===1}catch{return!1}}function o(l){if(!l.className||typeof l.className!="string")return[];const y=[],h=new Set;return l.className.split(/\s+/).forEach(E=>{const v=a(E);!v||h.has(v)||(h.add(v),y.push(v))}),y}function e(l){const y=[];let h=l;for(;h&&h!==document.body&&h!==document.documentElement;){const E=h.tagName.toLowerCase(),v=h.parentElement;if(v){const g=Array.from(v.children).filter(p=>p.tagName===h.tagName);if(g.length>1){const p=g.indexOf(h)+1;y.unshift(`${E}:nth-of-type(${p})`)}else y.unshift(E)}else y.unshift(E);h=v}return y.join(" > ")}function b(l){if(l.dataset.testid){const v=`[data-testid="${CSS.escape(l.dataset.testid)}"]`;if(t(v))return v}if(l.dataset.cy){const v=`[data-cy="${CSS.escape(l.dataset.cy)}"]`;if(t(v))return v}const y=l.getAttribute("aria-label");if(y){const v=`${l.tagName.toLowerCase()}[aria-label="${CSS.escape(y)}"]`;if(t(v))return v}const h=l.getAttribute("role");if(h&&y){const v=`[role="${CSS.escape(h)}"][aria-label="${CSS.escape(y)}"]`;if(t(v))return v}if(l.id){const v=`#${CSS.escape(l.id)}`;if(t(v))return v}const E=o(l);if(E.length>0){const v=E.map(p=>`.${CSS.escape(p)}`).join(""),g=`${l.tagName.toLowerCase()}${v}`;if(t(g))return g;if(l.parentElement){const p=Array.from(l.parentElement.children).filter(r=>r.tagName===l.tagName);if(p.length>1){const r=p.indexOf(l)+1,d=`${g}:nth-of-type(${r})`;if(t(d))return d}}}return e(l)}function u(l){try{return document.querySelector(l)}catch{return null}}window.generateSelector=b,window.getMeaningfulClasses=o,window.querySelectorSafe=u})(),(function(){"use strict";const m=self.ChromeAdapters;function i(a,t){const o=new Map;return function(b,u){const y=(o.get(b)||Promise.resolve()).then(()=>Promise.resolve(a(b)).then(h=>{const E=Array.isArray(h)?h:[],v=u(E);return Promise.resolve(t(b,v)).then(()=>v)}));return o.set(b,y.then(()=>{},()=>{})),y}}function c(){if(!m||!m.storage)throw new Error("ChromeAnnotationsStorage requires ChromeAdapters.storage (chrome-storage-adapter.js must load first)");const a=m.storage;function t(b){return a.getAnnotations(b)}function o(b,u){return a.setAnnotations(b,u)}const e=i(t,o);return{read:t,replace:o,mutate:e}}function s(){const a=new Map;function t(b){const u=a.get(b);return Promise.resolve(Array.isArray(u)?u:[])}function o(b,u){return a.set(b,Array.isArray(u)?u:[]),Promise.resolve()}const e=i(t,o);return{read:t,replace:o,mutate:e}}self.serializeMutate=i,self.ChromeAnnotationsStorage=c,self.MemoryAnnotationsStorage=s})(),(function(){"use strict";function m(){const i=[];let c=!1;const s=[];return{subscribe(a){return i.push(a),()=>{const t=i.indexOf(a);t!==-1&&i.splice(t,1)}},notify(a){if(c){s.push(a);return}c=!0;try{for(const t of i)try{t(a)}catch{}}finally{if(c=!1,s.length>0){const t=s.shift();this.notify(t)}}},size(){return i.length}}}self.createObserver=m})(),(function(){"use strict";function i(c){const{getAnnotations:s,setAnnotations:a,getPageKey:t,getLocatorHint:o}=c,e=c.storage||window.ChromeAnnotationsStorage(),b=window.createObserver(),u={subscribe:b.subscribe},l=b.notify,y=g=>e.mutate(t(),g).then(p=>(a(p),l(p),p),()=>{throw new Error("Could not save feedback. Try again.")});let h=null;function E(){h=new Map;for(const g of s())h.set(g.selector,g)}function v(){h=null}return u.loadAnnotations=async()=>{try{a(await e.read(t()))}catch{a([])}v()},u.saveAnnotation=g=>y(p=>[...p,{schemaVersion:1,id:crypto.randomUUID(),selector:g.selector,locatorHint:g.locatorHint||"",tag:g.tag,elementSnippet:g.elementSnippet||"",text:g.text||"",feedback:g.feedback,viewport:g.viewport,fingerprint:g.fingerprint,createdAt:Date.now(),pageKey:t()}]).then(p=>(v(),p)),u.replaceAnnotation=(g,p)=>y(r=>{const d=r.findIndex(S=>S.id===g);if(d===-1)return r;const w=r.slice();return w[d]=Object.assign({},w[d],{feedback:p,createdAt:Date.now()}),w}).then(r=>(v(),r)),u.deleteAnnotationById=async g=>{try{const p=await y(r=>r.filter(d=>d.id!==g));return v(),p}catch{return s()}},u.deleteAnnotationsByIds=async g=>{const p=new Set(g);try{return await y(r=>r.filter(d=>!p.has(d.id)))}catch{return s()}},u.clearPageAnnotations=async()=>{try{return await y(()=>[])}catch{}return v(),[]},u.findAnnotationForElement=g=>{h||E();const p=window.generateSelector(g),r=h.get(p);if(r)return r;if(!o)return null;const d=o(g);return d&&s().find(w=>w.locatorHint===d)||null},u}window.createAnnotationStore=i})(),(function(){"use strict";const{escapeHtml:m}=window;function i(){return`
      <div class="annota-popover-header">
        <span class="annota-popover-title">Add feedback</span>
        <button class="annota-popover-close" type="button">&times;</button>
      </div>
      <div class="annota-popover-body">
        <textarea class="annota-popover-textarea" rows="1" placeholder="Describe the change..."></textarea>
      </div>
      <div class="annota-popover-footer">
        <span class="annota-popover-error" style="display:none"></span>
        <button class="annota-btn annota-btn-primary annota-popover-save" type="button" disabled>Save</button>
      </div>
    `}function c(a){return`
      <div class="annota-popover-header">
        <span class="annota-popover-title">Existing feedback</span>
        <button class="annota-popover-close" type="button">&times;</button>
      </div>
      <div class="annota-popover-body">
        <div class="annota-popover-existing">${m(a.feedback)}</div>
      </div>
      <div class="annota-popover-footer">
        <span class="annota-popover-error" style="display:none"></span>
        <button class="annota-btn annota-btn-danger annota-popover-delete" type="button">Delete</button>
        <button class="annota-btn annota-btn-primary annota-popover-replace" type="button">Replace</button>
      </div>
    `}function s(a){return`
      <div class="annota-popover-header">
        <span class="annota-popover-title">Replace feedback</span>
        <button class="annota-popover-close" type="button">&times;</button>
      </div>
      <div class="annota-popover-body">
        <textarea class="annota-popover-textarea" rows="1" placeholder="New feedback...">${m(a.feedback)}</textarea>
      </div>
      <div class="annota-popover-footer">
        <span class="annota-popover-error" style="display:none"></span>
        <button class="annota-btn annota-btn-primary annota-popover-save" type="button">Save</button>
      </div>
    `}window.renderNewPopoverHTML=i,window.renderExistingPopoverHTML=c,window.renderReplacePopoverHTML=s})(),(function(){"use strict";const{escapeHtml:m}=window,i=360,c=12;function s(a){const t=a.popover,o=a.getOpenPopoverAnnotationId,e=a.setOpenPopoverAnnotationId,b=a.generateSelector,u=a.getElementText,l=a.getLocatorHint,y=a.getElementSnippet,h=a.getFingerprint,E=a.saveAnnotation,v=a.replaceAnnotation,g=a.deleteAnnotationById;function p(d,w,S,{onSave:x}){d.addEventListener("input",()=>{w.disabled=!d.value.trim()}),d.addEventListener("keydown",A=>{(A.key==="ArrowUp"||A.key==="ArrowDown")&&A.preventDefault()}),w.addEventListener("click",async()=>{const A=d.value.trim();if(A)try{await x(A),w.textContent="Saved",w.classList.remove("annota-btn-primary"),w.classList.add("annota-btn-saved"),w.disabled=!0,setTimeout(()=>r.closePopover(!0),300)}catch(C){S.textContent=C.message||"Could not save feedback. Try again.",S.style.display=""}})}const r={};return r.openNewPopover=function(d,w,S){e(null);const x=b(d),A=u(d),C=l(d);t.innerHTML=window.renderNewPopoverHTML(),r.positionPopover(w,S),t.style.display="block",t.classList.remove("annota-popover-instant"),requestAnimationFrame(()=>t.classList.add("annota-popover-open"));const k=t.querySelector(".annota-popover-textarea"),B=t.querySelector(".annota-popover-save"),H=t.querySelector(".annota-popover-close"),O=t.querySelector(".annota-popover-error");k.focus(),r.setupTextareaAutoGrow(k),p(k,B,O,{onSave:async I=>E({selector:x,locatorHint:C,tag:d.tagName.toLowerCase(),elementSnippet:y(d),text:A,feedback:I,viewport:{width:window.innerWidth,height:window.innerHeight},fingerprint:h(d)})}),H.addEventListener("click",()=>r.closePopover())},r.openExistingPopover=function(d,w,S){e(d.id),t.innerHTML=window.renderExistingPopoverHTML(d),r.positionPopover(w,S),t.style.display="block",t.classList.remove("annota-popover-instant"),requestAnimationFrame(()=>t.classList.add("annota-popover-open"));const x=t.querySelector(".annota-popover-close"),A=t.querySelector(".annota-popover-delete"),C=t.querySelector(".annota-popover-replace");x.addEventListener("click",()=>r.closePopover()),A.addEventListener("click",()=>{g(d.id),r.closePopover()}),C.addEventListener("click",()=>{r.openReplaceMode(d)})},r.openReplaceMode=function(d){t.innerHTML=window.renderReplacePopoverHTML(d);const w=t.querySelector(".annota-popover-textarea"),S=t.querySelector(".annota-popover-save"),x=t.querySelector(".annota-popover-close"),A=t.querySelector(".annota-popover-error");w.focus(),w.setSelectionRange(w.value.length,w.value.length),r.setupTextareaAutoGrow(w),p(w,S,A,{onSave:async C=>v(d.id,C)}),x.addEventListener("click",()=>r.closePopover())},r.closePopover=function(d){e(null),d&&t.classList.add("annota-popover-instant"),t.classList.remove("annota-popover-open"),setTimeout(()=>{t.style.display="none",t.classList.remove("annota-popover-instant"),t.innerHTML=""},d?0:120)},r.positionPopover=function(d,w){let S=d+c,x=w+c;const A=window.innerWidth,C=window.innerHeight;S+i>A-12&&(S=d-i-c),S<12&&(S=12),t.style.left=S+"px",t.style.top=x+"px",requestAnimationFrame(()=>{const k=t.getBoundingClientRect();x+k.height>C-12&&(x=w-k.height-c,x<12&&(x=12),t.style.top=x+"px")})},r.setupTextareaAutoGrow=function(d){d.style.resize="none",d.style.minHeight="36px";const w=200;d.addEventListener("input",()=>{d.style.height="auto",d.style.height=Math.min(d.scrollHeight,w)+"px"})},r}window.createPopoverManager=s,window.POPOVER_WIDTH=i,window.POPOVER_OFFSET=c})(),(function(){"use strict";function s(t,o){const e=[...t].sort((u,l)=>u.createdAt-l.createdAt),b=[];for(const u of e){const l=o(u);if(!l)continue;const y=l.getBoundingClientRect();let h=y.right-22/2+6,E=y.top-22/2-6;const v=window.innerWidth,g=window.innerHeight;h+22>v&&(h=v-22-4),h<0&&(h=4),E+22>g&&(E=g-22-4),E<0&&(E=4);for(const p of b)Math.abs(h-p.x)<22&&Math.abs(E-p.y)<22&&(h+=10,E+=10);b.push({id:u.id,x:h,y:E})}return b}function a(t){const o=t.badgeContainer,e=t.getAnnotations,b=t.setBadgePositions,u=t.openExistingPopover,l=t.querySelectorSafe||window.querySelectorSafe,y={};return y.renderBadges=function(){o.innerHTML="";const h=e(),E=s(h,p=>l(p.selector));b(E);const v=new Map(E.map(p=>[p.id,p]));[...h].sort((p,r)=>p.createdAt-r.createdAt).forEach((p,r)=>{const d=v.get(p.id);if(!d)return;const w=document.createElement("div");w.className="annota-badge",w.textContent=String(r+1),w.style.left=d.x+"px",w.style.top=d.y+"px",w.addEventListener("click",S=>{S.stopPropagation(),u(p,d.x,d.y+22)}),o.appendChild(w)})},y.repositionBadges=function(){const h=o.querySelectorAll(".annota-badge"),E=e(),v=s(E,r=>l(r.selector));b(v);const g=new Map(v.map(r=>[r.id,r]));[...E].sort((r,d)=>r.createdAt-d.createdAt).forEach((r,d)=>{const w=h[d];if(!w)return;const S=g.get(r.id);if(!S){w.style.display="none";return}w.style.display="flex",w.style.left=S.x+"px",w.style.top=S.y+"px"})},y}window.calculateBadgePositions=s,window.createBadgeRenderer=a,window.BADGE_SIZE=22,window.BADGE_OFFSET=6,window.BADGE_COLLISION_STEP=10})(),(function(){"use strict";function c(s){const a=s.getAnnotations,t=s.getOpenPopoverAnnotationId,o=s.retryMap,e=s.deleteAnnotations,b=s.onStaleRemoved,u=s.onStaleError,l=s.getElementText,y=s.querySelectorSafe||window.querySelectorSafe;function h(g,p){if(g===p)return 1;const r=g.length,d=p.length;if(r===0||d===0)return 0;const w=Math.max(r,d),S=[];for(let x=0;x<=d;x++)S[x]=[x];for(let x=0;x<=r;x++)S[0][x]=x;for(let x=1;x<=d;x++)for(let A=1;A<=r;A++){const C=g[A-1]===p[x-1]?0:1;S[x][A]=Math.min(S[x-1][A]+1,S[x][A-1]+1,S[x-1][A-1]+C)}return 1-S[d][r]/w}function E(g){return(g||"").toLowerCase().replace(/\s+/g," ").trim()}const v={};return v.levenshteinSimilarity=h,v.normalizeText=E,v.validateCurrentPageAnnotations=function(){const g=Date.now(),p=[];for(const r of a()){if(r.id===t())continue;const d=y(r.selector);if(!d){if(!o.has(r.id)){o.set(r.id,g);continue}g-o.get(r.id)>=3e3&&(p.push(r.id),o.delete(r.id));continue}if(o.delete(r.id),d.tagName.toLowerCase()!==r.fingerprint.tagName){if(!o.has(r.id+"_tag")){o.set(r.id+"_tag",g);continue}g-o.get(r.id+"_tag")>=3e3&&(p.push(r.id),o.delete(r.id+"_tag"));continue}const w=E(r.fingerprint.text),S=E(l(d));if(S&&w&&h(w,S)<.7){if(!o.has(r.id+"_text")){o.set(r.id+"_text",g);continue}g-o.get(r.id+"_text")>=3e3&&(p.push(r.id),o.delete(r.id+"_text"));continue}o.delete(r.id+"_text"),o.delete(r.id+"_tag")}p.length>0&&e(p).then(()=>b(p.length),()=>u())},v}window.createStaleValidator=c,window.RETRY_MS=3e3,window.STALE_TEXT_THRESHOLD=.7})(),(function(){"use strict";function m(i){const c=i.getLastUrl,s=i.setLastUrl,a=i.onUrlChange,t={};return t.handleUrlChange=function(){const o=location.href;o!==c()&&(s(o),a())},t.setupSPADetection=function(){const o=history.pushState,e=history.replaceState;history.pushState=function(){o.apply(this,arguments),t.handleUrlChange()},history.replaceState=function(){e.apply(this,arguments),t.handleUrlChange()},window.addEventListener("popstate",t.handleUrlChange),window.addEventListener("hashchange",t.handleUrlChange)},t}window.createSpaDetector=m})(),(function(){"use strict";const m=window.ChromeAdapters;function i(c){const s={onStartPickMode:c.onStartPickMode,onStopPickMode:c.onStopPickMode,onGetState:c.onGetState,onDeleteAnnotation:c.onDeleteAnnotation,onClearPage:c.onClearPage};function a(t,o,e){return t.type==="START_PICK_MODE"&&(s.onStartPickMode(),e({ok:!0})),t.type==="STOP_PICK_MODE"&&(s.onStopPickMode(),e({ok:!0})),t.type==="GET_STATE"&&e(s.onGetState()),t.type==="DELETE_ANNOTATION"?(s.onDeleteAnnotation(t.id).then(()=>e({ok:!0})),!0):(t.type==="CLEAR_PAGE"&&s.onClearPage().then(()=>e({ok:!0})),!0)}return m.messaging.onMessage(a),{listener:a}}window.createMessageRouter=i})(),(()=>{"use strict";const m=window.ChromeAdapters,{normalizeTarget:i,pageKey:c,getMeaningfulClasses:s}=window,a="__annota-root__",t="2147483647",o=500,e={shadowHost:null,shadowRoot:null,topBar:null,hoverHighlight:null,popover:null,badgeContainer:null,noticeEl:null,pickMode:!1,currentTarget:null,annotations:[],pageKey:"",currentPagePath:"",openPopoverAnnotationId:null,retryMap:new Map,mutationTimer:null,lastUrl:location.href,badgePositions:[]};let b=!1,u,l,y,h,E;function v(){return window.shadowTokens()}function g(){if(e.shadowHost&&document.documentElement.contains(e.shadowHost))return;e.shadowHost=document.createElement("div"),e.shadowHost.id=a,e.shadowHost.style.cssText=`all:initial;position:fixed;z-index:${t};top:0;left:0;width:0;height:0;pointer-events:none;`,e.shadowRoot=e.shadowHost.attachShadow({mode:"open"});const n=document.createElement("style");n.textContent=p(),e.shadowRoot.appendChild(n),e.topBar=document.createElement("div"),e.topBar.className="annota-topbar",e.topBar.style.display="none",e.topBar.innerHTML=`
      <span class="annota-topbar-label">Pick element</span>
      <span class="annota-topbar-count" style="display:none"></span>
      <button class="annota-topbar-exit">Exit</button>
    `,e.topBar.querySelector(".annota-topbar-exit").addEventListener("click",_),e.shadowRoot.appendChild(e.topBar),e.hoverHighlight=document.createElement("div"),e.hoverHighlight.className="annota-highlight",e.hoverHighlight.style.display="none",e.shadowRoot.appendChild(e.hoverHighlight),e.popover=document.createElement("div"),e.popover.className="annota-popover",e.popover.style.display="none",e.popover.addEventListener("mousedown",f=>f.stopPropagation()),e.popover.addEventListener("click",f=>f.stopPropagation()),e.shadowRoot.appendChild(e.popover),e.badgeContainer=document.createElement("div"),e.badgeContainer.className="annota-badges",e.shadowRoot.appendChild(e.badgeContainer),e.noticeEl=document.createElement("div"),e.noticeEl.className="annota-notice",e.noticeEl.style.display="none",e.shadowRoot.appendChild(e.noticeEl),document.documentElement.appendChild(e.shadowHost)}function p(){return v()+`
      :host { all: initial; position: fixed; z-index: ${t}; top: 0; left: 0; width: 0; height: 0; pointer-events: none; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      .annota-topbar {
        position: fixed; top: 12px; right: 12px; z-index: ${t};
        display: inline-flex; align-items: center; gap: 10px;
        padding: var(--annota-space-sm) var(--annota-space-lg);
        background: var(--annota-surface); border: 1px solid var(--annota-border); border-radius: var(--annota-radius-lg);
        box-shadow: var(--annota-shadow-sm);
        font: var(--annota-font-size-base)/1.4 var(--annota-font-stack);
        color: var(--annota-text); pointer-events: auto; white-space: nowrap;
        opacity: 0.95; transition: opacity 150ms ease;
      }
      .annota-topbar:hover { opacity: 1; }
      .annota-topbar-label { flex: 0 0 auto; }
      .annota-topbar-count {
        font-size: var(--annota-font-size-xs); background: var(--annota-accent); color: var(--annota-text-inverted);
        padding: var(--annota-space-2xs) var(--annota-space-md); border-radius: 10px; flex-shrink: 0;
      }
      .annota-topbar-exit {
        background: var(--annota-surface-elevated); color: var(--annota-text); border: 1px solid var(--annota-border);
        padding: var(--annota-space-xs) var(--annota-space-lg); border-radius: var(--annota-radius-xs); cursor: pointer; font: inherit; font-size: var(--annota-font-size-sm);
      }
      .annota-topbar-exit:hover { background: var(--annota-surface-hover); }
      .annota-topbar-exit:focus-visible { outline: 2px solid var(--annota-accent); outline-offset: 2px; }
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
        line-height: 1.5;
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
      }
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
    `}function r(){new MutationObserver(()=>{document.documentElement.contains(e.shadowHost)||(g(),l.renderBadges(),e.pickMode&&w())}).observe(document.documentElement,{childList:!0})}function d(n){e.noticeEl.textContent=n,e.noticeEl.style.display="block",requestAnimationFrame(()=>e.noticeEl.classList.add("annota-notice-visible")),setTimeout(()=>{e.noticeEl.classList.remove("annota-notice-visible"),setTimeout(()=>{e.noticeEl.style.display="none"},200)},3e3)}function w(){e.topBar.style.display="flex",x()}function S(){e.topBar.style.display="none"}function x(){const n=e.topBar.querySelector(".annota-topbar-count");e.annotations.length>0?(n.textContent=e.annotations.length,n.style.display=""):n.style.display="none"}function A(){x(),l.renderBadges(),m.messaging.sendToBackground({type:"ANNOTATIONS_CHANGED"})}function C(n){const f=n.getAttribute("aria-label");return f?f.trim():n.placeholder?n.placeholder.trim().slice(0,100):n.value!==void 0&&n.value!==""?String(n.value).trim().slice(0,100):n.alt?n.alt.trim():n.title?n.title.trim():(n.innerText||"").trim().slice(0,100)}function k(n){if(n.dataset.testid)return`data-testid="${n.dataset.testid}"`;if(n.dataset.cy)return`data-cy="${n.dataset.cy}"`;const f=n.getAttribute("aria-label");if(f)return`aria-label="${f}"`;const T=n.getAttribute("role");if(T){const P=f||n.getAttribute("aria-labelledby");if(P)return`role="${T}" name="${P}"`}const M=n.querySelector("h1, h2, h3, h4, h5, h6");if(M){const P=(M.innerText||"").trim().slice(0,50);if(P)return`heading text "${P}"`}const L=n.querySelector("img[alt]");return L&&L.alt?`image alt "${L.alt}"`:""}function B(n){return{tagName:n.tagName.toLowerCase(),text:C(n),childCount:n.children?n.children.length:0}}function H(n){const f=n.tagName.toLowerCase(),T=[];for(const M of n.attributes){const L=M.name.toLowerCase();let P=M.value;if(L==="class")P=s(n).join(" ");else if(!O(L,P))continue;!P||P.length>120||T.push(`${L}="${I(P)}"`)}return T.length>0?`<${f} ${T.join(" ")}>`:`<${f}>`}function O(n,f){return!f||n==="style"||n.startsWith("on")?!1:n==="id"||n==="role"||n==="data-testid"||n==="data-cy"||n.startsWith("aria-")?!0:["href","src","alt","title","name","type","placeholder","value"].includes(n)}function I(n){return String(n).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function D(n){if(!n)return!1;const f=n.composedPath?n.composedPath():[];return f.includes(e.shadowRoot)||f.includes(e.shadowHost)}function K(n){if(!n)return!1;if(n===e.shadowHost)return!0;try{return n.getRootNode()===e.shadowRoot}catch{return!1}}function q(){if(e.pickMode)return;e.pickMode=!0,w();const n=document.createElement("style");n.id="__annota-pick-cursor__",n.textContent="*,*::before,*::after{cursor:crosshair!important}",document.head.appendChild(n),document.addEventListener("mouseover",N,!0),document.addEventListener("click",z,!0),document.addEventListener("keydown",$,!0),m.messaging.sendToBackground({type:"PICK_MODE_CHANGED",pickMode:!0})}function _(){if(!e.pickMode)return;e.pickMode=!1;const n=document.getElementById("__annota-pick-cursor__");n&&n.remove(),e.currentTarget=null,S(),e.hoverHighlight.style.display="none",document.removeEventListener("mouseover",N,!0),document.removeEventListener("click",z,!0),document.removeEventListener("keydown",$,!0),m.messaging.sendToBackground({type:"PICK_MODE_CHANGED",pickMode:!1})}function N(n){if(D(n))return;const f=i(n.target);if(!f||f===document.body||f===document.documentElement){e.hoverHighlight.style.display="none",e.currentTarget=null;return}e.currentTarget=f;const T=f.getBoundingClientRect();e.hoverHighlight.style.display="block",e.hoverHighlight.style.top=T.top+"px",e.hoverHighlight.style.left=T.left+"px",e.hoverHighlight.style.width=T.width+"px",e.hoverHighlight.style.height=T.height+"px"}function z(n){if(D(n))return;if(e.popover.style.display!=="none"){n.preventDefault(),n.stopPropagation(),n.stopImmediatePropagation();return}n.preventDefault(),n.stopPropagation(),n.stopImmediatePropagation();const f=e.currentTarget||i(n.target);if(!f||f===document.body||f===document.documentElement)return;const T=y.findAnnotationForElement(f);T?u.openExistingPopover(T,n.clientX,n.clientY):u.openNewPopover(f,n.clientX,n.clientY)}function $(n){n.key==="Escape"&&(e.popover.style.display!=="none"?u.closePopover():e.pickMode&&_(),n.preventDefault(),n.stopPropagation())}function F(){new MutationObserver(()=>{e.annotations.length!==0&&(clearTimeout(e.mutationTimer),e.mutationTimer=setTimeout(()=>{h.validateCurrentPageAnnotations()},o))}).observe(document.body,{childList:!0,subtree:!0})}function G(){e.pageKey=c(location.href),e.currentPagePath=location.pathname+location.hash}async function R(){G(),await y.loadAnnotations(),x(),l.renderBadges()}function U(){g(),r();const n=window.ChromeAnnotationsStorage();y=window.createAnnotationStore({getAnnotations:()=>e.annotations,setAnnotations:f=>{e.annotations=f},getPageKey:()=>e.pageKey,getLocatorHint:k,storage:n}),y.subscribe(A),u=window.createPopoverManager({popover:e.popover,getOpenPopoverAnnotationId:()=>e.openPopoverAnnotationId,setOpenPopoverAnnotationId:f=>{e.openPopoverAnnotationId=f},generateSelector:window.generateSelector,getElementText:C,getLocatorHint:k,getElementSnippet:H,getFingerprint:B,saveAnnotation:f=>(b=!0,y.saveAnnotation(f)),replaceAnnotation:(f,T)=>(b=!0,y.replaceAnnotation(f,T)),deleteAnnotationById:f=>(b=!0,y.deleteAnnotationById(f))}),l=window.createBadgeRenderer({badgeContainer:e.badgeContainer,getAnnotations:()=>e.annotations,getBadgePositions:()=>e.badgePositions,setBadgePositions:f=>{e.badgePositions=f},openExistingPopover:u.openExistingPopover}),h=window.createStaleValidator({getAnnotations:()=>e.annotations,getOpenPopoverAnnotationId:()=>e.openPopoverAnnotationId,retryMap:e.retryMap,deleteAnnotations:f=>y.deleteAnnotationsByIds(f),onStaleRemoved:f=>{x(),l.renderBadges(),d(`Removed ${f} stale feedback item${f!==1?"s":""}.`)},onStaleError:()=>d("Could not update stale feedback."),getElementText:C}),E=window.createSpaDetector({getLastUrl:()=>e.lastUrl,setLastUrl:f=>{e.lastUrl=f},onUrlChange:()=>{u.closePopover(!0),e.pickMode&&_(),e.retryMap.clear(),R().then(()=>{setTimeout(()=>h.validateCurrentPageAnnotations(),window.RETRY_MS)})}}),window.createMessageRouter({onStartPickMode:q,onStopPickMode:_,onGetState:()=>({pickMode:e.pickMode,annotations:[...e.annotations].sort((f,T)=>f.createdAt-T.createdAt)}),onDeleteAnnotation:f=>(b=!0,y.deleteAnnotationById(f)),onClearPage:()=>(b=!0,y.clearPageAnnotations())}),G(),R(),F(),E.setupSPADetection(),m.storage.onChanged((f,T)=>{if(b){b=!1;return}R().then(()=>h.validateCurrentPageAnnotations())}),window.addEventListener("scroll",l.repositionBadges,{passive:!0}),window.addEventListener("resize",l.repositionBadges,{passive:!0})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",U):U()})();
