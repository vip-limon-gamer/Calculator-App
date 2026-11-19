// Calc engine: expression parser, number formatting, fractions (no DOM)
// ---------- ENGINE ----------
const P=Math.PI;
const EP={'ᵏ':1e3,'ᴹ':1e6,'ᴳ':1e9,'ᵀ':1e12,'ᵐ':1e-3,'μ':1e-6,'ⁿ':1e-9,'ᵖ':1e-12,'ᶠ':1e-15};
const DSP={'ᵏ':'k','ᴹ':'M','ᴳ':'G','ᵀ':'T','ᵐ':'m','ⁿ':'n','ᵖ':'p','ᶠ':'f'};
function ncdf(t){const a=Math.abs(t);let u;if(a<3){let s=a,m=a,k=0;while(Math.abs(m)>1e-18*s&&k<400){k++;m*=a*a/(2*k+1);s+=m}u=.5-s*Math.exp(-a*a/2)/Math.sqrt(2*Math.PI)}else{let f=0;for(let k=80;k>=1;k--)f=k/(a+f);u=Math.exp(-a*a/2)/Math.sqrt(2*Math.PI)/(a+f)}return t>=0?1-u:u}
const RE=/∫\(|▶r∠θ|▶a\+bi|▶t\(|Pol\(|Rec\(|Rnd\(|Log\(|Σ\(|Ran#\(|P\(|Q\(|R\(|mod|VctAns|Vct[ABC]|Dot|Ang\(|MatAns|MatA|MatB|MatC|Det\(|Trn\(|xnor|xor|and|or|Not\(|Neg\(|Shl\(|Shr\(|Σx²|Σy²|Σxy|Σx|Σy|x\u0304|y\u0304|xσn−1|xσn|yσn−1|yσn|x\u0302\(|y\u0302\(|d\/dx\(|(?:sin|cos|tan)h?(?:⁻¹)?\(|log\(|ln\(|√\(|∛\(|Abs\(|Int\(|Frac\(|Arg\(|Conj\(|Ran#|Ans|ˣ√|nPr|nCr|\d+\.?\d*(?:ᴇ[−+]?\d+)?|\.\d+(?:ᴇ[−+]?\d+)?|[A-FXYMπeiᴀʙᴄrn]|[+−×÷^()!²³°′″%⌟,=:∠ᵏᴹᴳᵀᵐμⁿᵖᶠᵒʳᵍ]|⁻¹/g;
function calc(s,st){
 const T=s.match(RE)||[];let p=0;const pk=()=>T[p],nx=()=>T[p++],ER=()=>{throw'Math ERROR'},SE=()=>{throw'Syntax ERROR'};
 if(T.join('')!==s)SE();
 const U=st.am=='D'?180:st.am=='G'?200:0,toR=x=>U?x*P/U:x,fromR=x=>U?x*U/P:x,isN=t=>t&&/^[\d.]/.test(t),num=t=>parseFloat(t.replace('ᴇ','e').replace('−','-'));
 const fact=n=>{if(n<0||n>69||n%1)ER();let r=1;for(let i=2;i<=n;i++)r*=i;return r};
 const trig=(f,x)=>{if(U){const k=x%U,h=U/2;if(f=='sin'&&k==0)return 0;if(f=='cos'&&Math.abs(k)==h)return 0;if(f=='tan'){if(k==0)return 0;if(Math.abs(k)==h)ER()}}else{const q=x/(P/2),n=Math.round(q);if(Math.abs(q-n)<1e-13){const m=((n%4)+4)%4;if(f=='sin')return[0,1,0,-1][m];if(f=='cos')return[1,0,-1,0][m];if(m%2)ER();return 0}}return Math[f](toR(x))};
 const pow=(b,e)=>{if(b==0&&e<=0)ER();if(b<0&&e%1){const r=1/e;if(Math.abs(r%2)==1&&Math.abs(r-Math.round(r))<1e-12)return-Math.pow(-b,e);ER()}return Math.pow(b,e)};
 const FN={sin:x=>trig('sin',x),cos:x=>trig('cos',x),tan:x=>trig('tan',x),'sin⁻¹':x=>{if(Math.abs(x)>1)ER();return fromR(Math.asin(x))},'cos⁻¹':x=>{if(Math.abs(x)>1)ER();return fromR(Math.acos(x))},'tan⁻¹':x=>fromR(Math.atan(x)),sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh,'sinh⁻¹':Math.asinh,'cosh⁻¹':x=>{if(x<1)ER();return Math.acosh(x)},'tanh⁻¹':x=>{if(Math.abs(x)>=1)ER();return Math.atanh(x)},log:x=>{if(x<=0)ER();return Math.log10(x)},ln:x=>{if(x<=0)ER();return Math.log(x)},'√':x=>{if(x<0)ER();return Math.sqrt(x)},'∛':Math.cbrt,Abs:Math.abs,'x\u0302':x=>SPR(st,0,x),'y\u0302':x=>SPR(st,1,x),Conj:x=>x,Arg:x=>x>=0?0:fromR(P),Rnd:x=>st.dm=='F'?Number(x.toFixed(st.dn)):st.dm=='S'?Number(x.toPrecision(st.dn)):Number(x.toPrecision(10)),Int:Math.floor,Frac:x=>x-Math.trunc(x)};
 const add=()=>{let v=mul();while(pk()=='+'||pk()=='−'){const o=nx(),r=mul();v=o=='+'?v+r:v-r}return v};
 const mul=()=>{let v=prm();while(pk()=='×'||pk()=='÷'||pk()=='mod'){const o=nx(),r=prm();if((o=='÷'||o=='mod')&&r==0)ER();v=o=='×'?v*r:o=='÷'?v/r:v-r*Math.floor(v/r)}return v};
 const prm=()=>{let v=imp();while(pk()=='nPr'||pk()=='nCr'){const o=nx(),r=imp();if(v%1||r%1||v<0||r<0||r>v)ER();let x=1;if(o=='nCr'){const k=Math.min(r,v-r);for(let i=1;i<=k;i++)x=x*(v-k+i)/i;x=Math.round(x)}else for(let i=0;i<r;i++)x*=v-i;if(!isFinite(x))ER();v=x}return v};
 const sf=t=>t&&(isN(t)||SV.has(t)||/^[A-FXYMπe(]$|\($|^Ans$|^Ran#$/.test(t));
 const imp=()=>{let v=un();while(sf(pk()))v*=un();return v};
 const un=()=>{if(pk()=='−'){nx();return-pw()}if(pk()=='+')nx();return pw()};
 const pw=()=>{let v=po();if(pk()=='^'){nx();v=pow(v,un())}else if(pk()=='ˣ√'){nx();const e=un();if(v==0)ER();v=pow(e,1/v)}return v};
 const po=()=>{let v=pr();for(;;){const t=pk();if(t=='²')v*=v;else if(t=='³')v=v*v*v;else if(t=='⁻¹'){if(v==0)ER();v=1/v}else if(t=='!')v=fact(v);else if(t=='%')v/=100;else if(t=='ᵒ'||t=='ʳ'||t=='ᵍ')v=v*(U||P)/({'ᵒ':180,'ʳ':P,'ᵍ':200})[t];else break;nx()}return v};
 const pr=()=>{const t=nx();if(t===undefined)SE();let v;
  if(isN(t)){v=num(t);
   if(EP[pk()]){const e=EP[nx()];v=e<1?v/Math.round(1/e):v*e}
   if(pk()=='⌟'){nx();let b=nx();if(!isN(b))SE();b=num(b);if(pk()=='⌟'){nx();let c=nx();if(!isN(c))SE();c=num(c);if(c==0)ER();v+=b/c}else{if(b==0)ER();v/=b}}
   else if(pk()=='°'){nx();let m=0;if(isN(pk())&&T[p+1]=='′'){m=num(nx())/60;nx();if(isN(pk())&&T[p+1]=='″'){m+=num(nx())/3600;nx()}}v+=m}
   return v}
  if(t=='π')return P;if(t=='e')return Math.E;if(t=='Ans')return st.ans;if(t=='Ran#')return Math.floor(Math.random()*1000)/1000;if(SV.has(t))return statVal(t,st);if(/^[A-FXYM]$/.test(t))return st.mem[t];
  if(t=='Pol('||t=='Rec('||t=='Log('||t=='Ran#('){const a=add();if(pk()!=',')SE();nx();const b=add();if(pk()==')')nx();
   if(t=='Pol('){const r=Math.hypot(a,b);st.mem.X=Number(r.toPrecision(15));st.mem.Y=Number(fromR(Math.atan2(b,a)).toPrecision(15));return r}
   if(t=='Rec('){const x=a*trig('cos',b),y=a*trig('sin',b);st.mem.X=Number(x.toPrecision(15))||0;st.mem.Y=Number(y.toPrecision(15))||0;return x}
   if(t=='Log('){if(a<=0||a==1||b<=0)ER();return Math.log(b)/Math.log(a)}
   if(a%1||b%1||b<a)ER();return a+Math.floor(Math.random()*(b-a+1))}
  if(t=='Σ('){const f=[];let d=0;while(p<T.length&&!(d==0&&T[p]==',')){const q=T[p];if(q=='('||q.endsWith('('))d++;else if(q==')')d--;f.push(nx())}
   if(pk()!=',')SE();nx();const a=add();if(pk()!=',')SE();nx();const b=add();if(pk()==')')nx();
   const fs=f.join('');if(!fs)SE();if(a%1||b%1||b<a||b-a>100000)ER();let s=0;for(let i=a;i<=b;i++)s+=calc(fs,{...st,mem:{...st.mem,X:i}}).v;return s}
  if(t=='P('||t=='Q('||t=='R('||t=='▶t('){const x=add();if(pk()==')')nx();
   if(t=='▶t('){if(st.sm!='SD')SE();const o=stSums(st.sd);if(!o.sxn)ER();return(x-o.mx)/o.sxn}
   const c=Number((t=='P('?ncdf(x):t=='Q('?ncdf(x)-.5:ncdf(-x)).toFixed(5));return c}
  if(t=='∫('||t=='d/dx('){const f=[];let d=0;while(p<T.length&&!(d==0&&T[p]==',')){const q=T[p];if(q=='('||q.endsWith('('))d++;else if(q==')')d--;f.push(nx())}
   if(pk()!=',')SE();nx();const a=add();let b=0;if(t=='∫('){if(pk()!=',')SE();nx();b=add()}if(pk()==')')nx();
   const fs=f.join('');if(!fs)SE();const g=x=>calc(fs,{...st,mem:{...st.mem,X:x}}).v;
   if(t=='∫('){if(a==b)return 0;const sg=a>b?-1:1,lo=Math.min(a,b),hi=Math.max(a,b),sp=(a,fa,b,fb)=>{const m=(a+b)/2,fm=g(m);return[m,fm,(b-a)/6*(fa+4*fm+fb)]},ad=(a,fa,b,fb,m,fm,w,e,d)=>{const[l,fl,wl]=sp(a,fa,m,fm),[r,fr,wr]=sp(m,fm,b,fb),dl=wl+wr-w;if(d<=0||Math.abs(dl)<=15*e)return wl+wr+dl/15;return ad(a,fa,m,fm,l,fl,wl,e/2,d-1)+ad(m,fm,b,fb,r,fr,wr,e/2,d-1)},fa=g(lo),fb=g(hi),[m,fm,w]=sp(lo,fa,hi,fb);return sg*ad(lo,fa,hi,fb,m,fm,w,1e-11*Math.max(1,Math.abs(w)),12)}
   const hh=1e-3*(Math.abs(a)||1);return(-g(a+2*hh)+8*g(a+hh)-8*g(a-hh)+g(a-2*hh))/(12*hh)}
  if(t=='('){v=add();if(pk()==')')nx();return v}
  if(t.endsWith('(')){const f=FN[t.slice(0,-1)];if(!f)SE();v=f(add());if(pk()==')')nx();return v}
  SE()};
 let v=add();if(p<T.length)SE();if(!isFinite(v)||Math.abs(v)>=1e100)ER();
 return{v:Number(v.toPrecision(15))||0,f:s.includes('⌟')};
}
function sci(v,d){let[m,e]=v.toExponential(d).split('e');if(d>0)m=m.replace(/\.?0+$/,'');return m+'<small>×10</small><sup>'+(+e)+'</sup>'}
function fmt(v,S){if(v===0)return'0';const a=Math.abs(v);
 if(S.eng){const e0=Math.floor(Math.log10(a)/3)*3,e=S.eng>0?e0+3*(S.eng-1):e0+3*S.eng;return Number((e>=0?v/10**e:v*10**-e).toPrecision(10))+'<small>×10</small><sup>'+e+'</sup>'}
 if(S.dm=='S')return sci(v,S.dn-1);
 if(S.dm=='F')return a>=1e10?sci(v,9):v.toFixed(S.dn);
 if(a>=1e10||a<(S.dn==1?1e-2:1e-9))return sci(v,9);
 const n=Number(v.toPrecision(10));let s=String(n);if(/e/.test(s))s=n.toFixed(Math.min(20,9-Math.floor(Math.log10(a)))).replace(/\.?0+$/,'');return s}
function frac(v,imp){const g=Math.sign(v)<0?'-':'',a=Math.abs(v),w=Math.floor(a),f=a-w;if(f<1e-12)return String(v);
 let x=f,q=Math.floor(x),h0=1,h1=q,k0=0,k1=1,i=0;
 while(Math.abs(f-h1/k1)>1e-10*f&&i++<40){x=1/(x-q);q=Math.floor(x);[h0,h1]=[h1,q*h1+h0];[k0,k1]=[k1,q*k1+k0];if(k1>9999)return null}
 return imp?g+(w*k1+h1)+'⌟'+k1:g+(w?w+'⌟':'')+h1+'⌟'+k1}

function dms(v){const g=v<0?'−':'',ts=Math.round(Math.abs(v)*3600*1e4)/1e4,d=Math.floor(ts/3600),m=Math.floor((ts-d*3600)/60),s=+(ts-d*3600-m*60).toFixed(4);return g+d+'°'+m+'′'+s+'″'}
function slv(g,x0){const fin=Number.isFinite,cl=x=>Number(x.toPrecision(12)),G=x=>{try{const y=g(x);return fin(y)?y:NaN}catch(e){return NaN}};
 let x=x0;for(let i=0;i<80;i++){const y=G(x);if(isNaN(y))break;if(Math.abs(y)<1e-13)return cl(x);const h=1e-6*Math.max(1,Math.abs(x)),d=(G(x+h)-G(x-h))/(2*h);if(!d||!fin(d))break;const n=x-y/d;if(!fin(n))break;if(Math.abs(n-x)<1e-14*Math.max(1,Math.abs(x))){x=n;if(Math.abs(G(x))<1e-8)return cl(x);break}x=n}
 const P=[x0];for(let j=0;j<170;j++){const r=.01*Math.pow(1.15,j);P.push(x0+r,x0-r)}P.sort((a,b)=>a-b);const Y=P.map(G);
 for(let i=0;i<P.length-1;i++){if(isNaN(Y[i])||isNaN(Y[i+1])||Y[i]*Y[i+1]>0)continue;let a=P[i],b=P[i+1],fa=Y[i];for(let k=0;k<200;k++){const m=(a+b)/2,fm=G(m);if(isNaN(fm))break;if(fa*fm<=0)b=m;else{a=m;fa=fm}}const r=(a+b)/2;if(Math.abs(G(r))<1e-6)return cl(r)}
 throw"Can't Solve"}
if(typeof module!='undefined')module.exports={calc,fmt,dms,slv,engSym,ncdf};
function engSym(v){const a=Math.abs(v);if(!a)return'0';let e=Math.floor(Math.log10(a)/3)*3;if(e>12)e=12;if(e<-15)e=-15;const y={12:'T',9:'G',6:'M',3:'k',0:'','-3':'m','-6':'μ','-9':'n','-12':'p','-15':'f'};return Number((e>=0?v/10**e:v*10**-e).toPrecision(10))+y[e]}
