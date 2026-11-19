// VCT mode: 2D/3D vectors VctA/B/C/Ans: + − scalar×, ÷scalar, cross (×), Dot, Abs( magnitude, Ang( angle (needs RE, fmt)
function vcalc(s,st){const VC=st.vc;VC.show=0;const T=s.match(RE)||[];let p=0;const pk=()=>T[p],nx=()=>T[p++],ER=()=>{throw'Math ERROR'},SE=()=>{throw'Syntax ERROR'},DE=()=>{throw'Dimension ERROR'};
 if(T.join('')!==s)SE();const isV=Array.isArray,isN=t=>t&&/^[\d.]/.test(t),num=t=>parseFloat(t.replace('ᴇ','e').replace('−','-')),mag=v=>Math.hypot(...v);
 const ad=(x,y,g)=>{if(!isV(x)&&!isV(y))return x+g*y;if(!isV(x)||!isV(y)||x.length!=y.length)DE();return x.map((v,i)=>v+g*y[i])},
 dt=(x,y)=>{if(!isV(x)||!isV(y)||x.length!=y.length)DE();return x.reduce((a,v,i)=>a+v*y[i],0)},
 ml=(x,y,im)=>{if(!isV(x)&&!isV(y))return x*y;if(!isV(x))return y.map(v=>x*v);if(!isV(y))return x.map(v=>v*y);if(im)SE();if(x.length!=y.length)DE();
  const a=x.length==2?[...x,0]:x,b=y.length==2?[...y,0]:y;return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]},
 dv=(x,y)=>{if(isV(y))SE();if(y==0)ER();return isV(x)?x.map(v=>v/y):x/y};
 const sf=t=>t&&(isN(t)||/^[A-FXYMπe]$|\($|^Ans$|^Vct[ABC]$|^VctAns$/.test(t));
 const add=()=>{let v=mul();while(pk()=='+'||pk()=='−'){const o=nx(),r=mul();v=ad(v,r,o=='+'?1:-1)}return v};
 const mul=()=>{let v=imp();while(pk()=='×'||pk()=='÷'||pk()=='Dot'){const o=nx(),r=imp();v=o=='×'?ml(v,r):o=='÷'?dv(v,r):dt(v,r)}return v};
 const imp=()=>{let v=un();while(sf(pk()))v=ml(v,un(),1);return v};
 const un=()=>{if(pk()=='−'){nx();const v=pw();return isV(v)?v.map(x=>-x):-v}if(pk()=='+')nx();return pw()};
 const pw=()=>{let v=po();if(pk()=='^'){nx();const e=un();if(isV(v)||isV(e))SE();if(v==0&&e<=0)ER();if(v<0&&e%1)ER();v=Math.pow(v,e)}return v};
 const po=()=>{let v=pr();for(;;){const t=pk();if(['²','³','⁻¹','%'].includes(t)){if(isV(v))SE();if(t=='²')v*=v;else if(t=='³')v=v*v*v;else if(t=='%')v/=100;else{if(v==0)ER();v=1/v}}else break;nx()}return v};
 const cl=()=>{if(pk()==')')nx()};
 const pr=()=>{const t=nx();if(t===undefined)SE();
  if(isN(t))return num(t);if(t=='π')return Math.PI;if(t=='e')return Math.E;if(t=='Ans')return st.ans;if(/^[A-FXYM]$/.test(t))return st.mem[t];
  if(/^Vct[ABC]$/.test(t))return VC.V['ABC'.indexOf(t[3])].v.slice();if(t=='VctAns'){if(!VC.ans)ER();return VC.ans.slice()}
  if(t=='('){const v=add();cl();return v}
  if(t=='Abs('){const v=add();cl();return isV(v)?mag(v):Math.abs(v)}
  if(t=='Ang('){const a=add();if(pk()!=',')SE();nx();const b=add();cl();const d=dt(a,b),m=mag(a)*mag(b);if(!m)ER();
   const r=Math.acos(Math.max(-1,Math.min(1,d/m)));return st.am=='D'?r*180/Math.PI:st.am=='G'?r*200/Math.PI:r}
  SE()};
 const v=add();if(p<T.length)SE();const ok=x=>isFinite(x)&&Math.abs(x)<1e100,c=x=>Number(x.toPrecision(15))||0;
 if(isV(v)){if(!v.every(ok))ER();VC.ans=v.map(c);VC.show=1;return{v:st.ans}}if(!ok(v))ER();return{v:c(v)}}
function vwrap(V){return'<div style="font-size:1.25rem;text-align:right;white-space:pre">[ '+V.map(x=>String(Number(x.toPrecision(8)))).join('  ')+' ]</div>'}
function startVct(){S.vc={ph:'calc',V:[0,1,2].map(()=>({d:3,v:[0,0,0]})),ans:null,show:0,i:0,vi:0,b:[]};
 S.mt=0;S.eq=0;S.cm=0;S.bn=0;S.sm=0;S.sd=[];S.pol=0;S.menu=null;S.E=[];S.c=0;S.res=null;S.resC=null;S.err=null;S.done=0;S.sl=0}
function vcKeyA(a){const C=S.vc,ph=C.ph;if(ph=='calc')return false;S.err=null;
 if(a=='@MODE'){C.ph='calc';cmd(a);return true}
 if(a=='@AC'){if(C.b.length)C.b=[];else C.ph='calc';return true}
 if(ph=='pickD'||ph=='pickE'){if(/^[1-3]$/.test(a)){C.vi=+a-1;C.i=0;C.b=[];C.ph=ph=='pickD'?'dimN':'edit'}return true}
 const o=C.V[C.vi];if(a=='@DEL'){C.b.pop();return true}
 if(ph=='edit'&&(a=='@U'||a=='@D')){C.i=Math.max(0,Math.min(o.d-1,C.i+(a=='@D'?1:-1)));C.b=[];return true}
 if(a=='@EXE'){if(ph=='edit'){if(C.b.length)o.v[C.i]=calc(C.b.join(''),S).v;C.b=[];if(++C.i==o.d){C.i=0;C.ph='calc'}return true}
  const v=calc(C.b.join(''),S).v;C.b=[];if(v!=2&&v!=3)throw'Dimension ERROR';C.V[C.vi]={d:v,v:Array.from({length:v},(_,i)=>o.v[i]||0)};C.ph='calc';return true}
 if(a[0]!='@'&&a!='=')C.b.push(a);return true}
function vcR(){const C=S.vc,L=$('l1'),O=$('l2'),n='ABC'[C.vi],o=C.V[C.vi],ph=C.ph,er=S.err?'<span class="er">'+S.err+'</span>':'';
 if(ph=='pickD'||ph=='pickE'){L.innerHTML=(ph=='pickD'?'Dim':'Edit')+' 1:A 2:B 3:C';O.innerHTML=er;return}
 L.innerHTML=ph=='edit'?'Vct'+n+' '+(C.i+1)+' ? ('+o.d+'D)':'Vct'+n+' Dim? (2 or 3)';
 O.innerHTML=er||(C.b.length?C.b.join(''):ph=='edit'?fmt(o.v[C.i],S):'0')}
if(typeof module!='undefined')module.exports={vcalc};
