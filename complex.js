// CMPLX mode: complex expression evaluator + display (needs RE, fmt from engine.js)
function cplx(s,st){
 const T=s.match(RE)||[];let p=0;const pk=()=>T[p],nx=()=>T[p++],ER=()=>{throw'Math ERROR'},SE=()=>{throw'Syntax ERROR'};
 if(T.join('')!==s)SE();
 const U=st.am=='D'?180:st.am=='G'?200:0,PI=Math.PI,k=U?PI/U:1,isN=t=>t&&/^[\d.]/.test(t),num=t=>parseFloat(t.replace('ᴇ','e').replace('−','-'));
 const ad=(x,y)=>[x[0]+y[0],x[1]+y[1]],sb=(x,y)=>[x[0]-y[0],x[1]-y[1]],ml=(x,y)=>[x[0]*y[0]-x[1]*y[1],x[0]*y[1]+x[1]*y[0]],
 dv=(x,y)=>{const d=y[0]*y[0]+y[1]*y[1];if(!d)ER();return[(x[0]*y[0]+x[1]*y[1])/d,(x[1]*y[0]-x[0]*y[1])/d]},
 ab=x=>Math.hypot(x[0],x[1]),ex=x=>{const m=Math.exp(x[0]);return[m*Math.cos(x[1]),m*Math.sin(x[1])]},
 ln=x=>{if(!x[0]&&!x[1])ER();return[Math.log(ab(x)),Math.atan2(x[1]+0,x[0])]},
 sq=x=>{const r=ab(x);if(!r)return[0,0];const a=Math.sqrt((r+x[0])/2),b=Math.sqrt((r-x[0])/2);return[a,x[1]<0?-b:b]},
 pw=(x,y)=>{if(!x[0]&&!x[1]&&!y[1]&&y[0]<=0)ER();
  if(!y[1]&&Number.isInteger(y[0])&&Math.abs(y[0])<=64){let n=Math.abs(y[0]),r=[1,0],b=x;while(n){if(n&1)r=ml(r,b);b=ml(b,b);n=Math.floor(n/2)}return y[0]<0?dv([1,0],r):r}
  if(!x[0]&&!x[1])return y[1]?ER():[0,0];return ex(ml(y,ln(x)))};
 const tr=(f,x)=>{if(U){const m=x%U,h=U/2;if(f=='sin'&&m==0)return 0;if(f=='cos'&&Math.abs(m)==h)return 0;if(f=='tan'){if(m==0)return 0;if(Math.abs(m)==h)ER()}}else{const q=x/(PI/2),n=Math.round(q);if(Math.abs(q-n)<1e-13){const m=((n%4)+4)%4;if(f=='sin')return[0,1,0,-1][m];if(f=='cos')return[1,0,-1,0][m];if(m%2)ER();return 0}}return Math[f](x*k)};
 const sn=z=>z[1]?[Math.sin(z[0]*k)*Math.cosh(z[1]*k),Math.cos(z[0]*k)*Math.sinh(z[1]*k)]:[tr('sin',z[0]),0],
 cs=z=>z[1]?[Math.cos(z[0]*k)*Math.cosh(z[1]*k),-Math.sin(z[0]*k)*Math.sinh(z[1]*k)]:[tr('cos',z[0]),0],
 tn=z=>z[1]?dv(sn(z),cs(z)):[tr('tan',z[0]),0],
 shz=z=>[Math.sinh(z[0])*Math.cos(z[1]),Math.cosh(z[0])*Math.sin(z[1])],chz=z=>[Math.cosh(z[0])*Math.cos(z[1]),Math.sinh(z[0])*Math.sin(z[1])];
 const F={sin:sn,cos:cs,tan:tn,sinh:shz,cosh:chz,tanh:z=>dv(shz(z),chz(z)),ln,log:z=>dv(ln(z),[Math.LN10,0]),'√':sq,Abs:z=>[ab(z),0],Arg:z=>{if(!z[0]&&!z[1])ER();return[Math.atan2(z[1]+0,z[0])/k,0]},Conj:z=>[z[0],-z[1]]};
 const sf=t=>t&&(isN(t)||/^[A-FXYMπei]$|\($|^Ans$/.test(t));
 const add=()=>{let v=mul();while(pk()=='+'||pk()=='−'){const o=nx(),r=mul();v=o=='+'?ad(v,r):sb(v,r)}return v};
 const ag=()=>{let v=imp();while(pk()=='∠'){nx();const t=un()[0];v=[v[0]*tr('cos',t),v[0]*tr('sin',t)]}return v};
 const mul=()=>{let v=ag();while(pk()=='×'||pk()=='÷'){const o=nx(),r=ag();v=o=='×'?ml(v,r):dv(v,r)}return v};
 const imp=()=>{let v=un();while(sf(pk()))v=ml(v,un());return v};
 const un=()=>{if(pk()=='−'){nx();const v=pwr();return[-v[0],-v[1]]}if(pk()=='+')nx();return pwr()};
 const pwr=()=>{let v=po();if(pk()=='^'){nx();v=pw(v,un())}return v};
 const po=()=>{let v=pr();for(;;){const t=pk();if(t=='²')v=ml(v,v);else if(t=='³')v=ml(v,ml(v,v));else if(t=='⁻¹')v=dv([1,0],v);else if(t=='%')v=[v[0]/100,v[1]/100];else break;nx()}return v};
 const pr=()=>{const t=nx();if(t===undefined)SE();
  if(isN(t))return[num(t),0];if(t=='i')return[0,1];if(t=='π')return[PI,0];if(t=='e')return[Math.E,0];
  if(t=='Ans')return st.ansC||[st.ans,0];if(/^[A-FXYM]$/.test(t))return[st.mem[t],0];
  if(t=='('){const v=add();if(pk()==')')nx();return v}
  if(t.endsWith('(')){const f=F[t.slice(0,-1)];if(!f)SE();const v=f(add());if(pk()==')')nx();return v}
  SE()};
 const v=add();let fm=null;if(pk()=='▶r∠θ'){nx();fm=1}else if(pk()=='▶a+bi'){nx();fm=0}if(p<T.length)SE();if(!v.every(isFinite)||Math.abs(v[0])>=1e100||Math.abs(v[1])>=1e100)ER();
 const m=Math.max(Math.abs(v[0]),Math.abs(v[1])),cl=x=>Math.abs(x)<1e-13*m?0:Number(x.toPrecision(15))||0,c=[cl(v[0]),cl(v[1])];
 return{v:c[0],c,fm}}
function cfmt(c,S){const[a,b]=c;if(!a&&!b)return'0';
 if(S.ri){if(S.pol){const U=S.am=='D'?180:S.am=='G'?200:0,t=Math.atan2(b,a)*(U?U/Math.PI:1);return'∠'+fmt(Number(t.toPrecision(12))||0,S)}const q=Math.abs(b);return b?(b<0?'−':'')+(q==1?'':fmt(q,S))+'i':'0'}
 if(S.pol){const U=S.am=='D'?180:S.am=='G'?200:0,t=Math.atan2(b,a)*(U?U/Math.PI:1);return fmt(Number(Math.hypot(a,b).toPrecision(15)),S)+'∠'+fmt(Number(t.toPrecision(12))||0,S)}
 if(!b)return fmt(a,S);const q=Math.abs(b),co=q==1?'':fmt(q,S);
 return a?fmt(a,S)+(b<0?'−':'+')+co+'i':(b<0?'−':'')+co+'i'}
if(typeof module!='undefined')module.exports={cplx,cfmt};
