// MAT mode: MatA/MatB/MatC (up to 4x4), expression evaluator, entry/edit/dim screens (needs RE, fmt)
function mcalc(s,st){const T=s.match(RE)||[],MT=st.mt;let p=0;const pk=()=>T[p],nx=()=>T[p++],ER=()=>{throw'Math ERROR'},SE=()=>{throw'Syntax ERROR'},DE=()=>{throw'Dimension ERROR'};
 if(T.join('')!==s)SE();
 const isM=Array.isArray,isN=t=>t&&/^[\d.]/.test(t),mk=(r,c,f)=>Array.from({length:r},(_,i)=>Array.from({length:c},(_,j)=>f(i,j))),dm=x=>[x.length,x[0].length],cl=x=>{const t=Number(x.toPrecision(15));return t||0};
 const add=(a,b,g)=>{if(!isM(a)&&!isM(b))return a+g*b;if(!isM(a)||!isM(b))SE();const[r,c]=dm(a),[r2,c2]=dm(b);if(r!=r2||c!=c2)DE();return mk(r,c,(i,j)=>a[i][j]+g*b[i][j])};
 const mul=(a,b)=>{if(!isM(a)&&!isM(b))return a*b;if(!isM(a))return b.map(r=>r.map(x=>a*x));if(!isM(b))return a.map(r=>r.map(x=>x*b));
  const[r,k]=dm(a),[k2,c]=dm(b);if(k!=k2)DE();return mk(r,c,(i,j)=>{let t=0;for(let q=0;q<k;q++)t+=a[i][q]*b[q][j];return t})};
 const inv=m=>{const[n,c]=dm(m);if(n!=c)DE();const sc=Math.max(...m.flat().map(Math.abs))||1,A=m.map((r,i)=>[...r,...Array.from({length:n},(_,j)=>+(i==j))]);
  for(let i=0;i<n;i++){let b=i;for(let r=i+1;r<n;r++)if(Math.abs(A[r][i])>Math.abs(A[b][i]))b=r;if(Math.abs(A[b][i])<=1e-12*sc)ER();[A[i],A[b]]=[A[b],A[i]];const d=A[i][i];A[i]=A[i].map(x=>x/d);
   for(let r=0;r<n;r++)if(r!=i){const f=A[r][i];if(f)A[r]=A[r].map((x,k)=>x-f*A[i][k])}}return A.map(r=>r.slice(n))};
 const det=m=>{const[n,c]=dm(m);if(n!=c)DE();const A=m.map(r=>r.slice());let sg=1,pv=1;
  for(let k=0;k<n-1;k++){let b=k;for(let i=k+1;i<n;i++)if(Math.abs(A[i][k])>Math.abs(A[b][k]))b=i;if(A[b][k]==0)return 0;if(b!=k){[A[k],A[b]]=[A[b],A[k]];sg=-sg}
   for(let i=k+1;i<n;i++)for(let j=k+1;j<n;j++)A[i][j]=(A[i][j]*A[k][k]-A[i][k]*A[k][j])/pv;pv=A[k][k]}
  return sg*A[n-1][n-1]};
 const trn=m=>mk(m[0].length,m.length,(i,j)=>m[j][i]);
 const pw=(a,b)=>{if(isM(b))SE();if(!isM(a)){const r=Math.pow(a,b);if(!isFinite(r))ER();return r}
  if(!Number.isInteger(b)||Math.abs(b)>99)ER();const[n,c]=dm(a);if(n!=c)DE();let base=b<0?inv(a):a,e=Math.abs(b),r=mk(n,n,(i,j)=>+(i==j));while(e){if(e&1)r=mul(r,base);base=mul(base,base);e=Math.floor(e/2)}return r};
 const sf=t=>t&&(isN(t)||/^(?:[A-FXYMπe(]|Ans|MatA|MatB|MatC|MatAns|Det\(|Trn\()$/.test(t));
 const ad=()=>{let v=ml();while(pk()=='+'||pk()=='−'){const o=nx(),r=ml();v=add(v,r,o=='+'?1:-1)}return v};
 const ml=()=>{let v=im();while(pk()=='×'||pk()=='÷'){const o=nx(),r=im();if(o=='×')v=mul(v,r);else{if(isM(r))SE();if(r==0)ER();v=isM(v)?v.map(q=>q.map(x=>x/r)):v/r}}return v};
 const im=()=>{let v=un();while(sf(pk()))v=mul(v,un());return v};
 const un=()=>{if(pk()=='−'){nx();return mul(-1,pwr())}if(pk()=='+')nx();return pwr()};
 const pwr=()=>{let v=po();if(pk()=='^'){nx();v=pw(v,un())}return v};
 const po=()=>{let v=pr();for(;;){const t=pk();if(t=='²')v=pw(v,2);else if(t=='³')v=pw(v,3);else if(t=='⁻¹'){if(isM(v))v=inv(v);else{if(!v)ER();v=1/v}}else break;nx()}return v};
 const cp=()=>{if(pk()==')')nx()};
 const pr=()=>{const t=nx();if(t===undefined)SE();
  if(isN(t))return parseFloat(t.replace('ᴇ','e').replace('−','-'));if(t=='π')return Math.PI;if(t=='e')return Math.E;if(t=='Ans')return st.ans;
  if(/^[A-FXYM]$/.test(t))return st.mem[t];
  if(/^Mat[ABC]$/.test(t)){const o=MT.M['ABC'.indexOf(t[3])];return mk(o.r,o.c,(i,j)=>o.d[i][j])}
  if(t=='MatAns'){if(!MT.ans)ER();return MT.ans.map(r=>r.slice())}
  if(t=='('){const v=ad();cp();return v}
  if(t=='Det('||t=='Trn('){const v=ad();cp();if(!isM(v))SE();return t=='Det('?det(v):trn(v)}
  SE()};
 const v=ad();if(p<T.length)SE();
 if(isM(v)){const sc=Math.max(...v.flat().map(Math.abs)),m=v.map(r=>r.map(x=>Math.abs(x)<1e-13*sc?0:Number(x.toPrecision(13))||0));if(!m.flat().every(isFinite))ER();MT.ans=m;MT.ph='res';MT.i=MT.j=0;return{v:st.ans}}
 if(!isFinite(v))ER();return{v:cl(v)}}
function startMat(){S.mt={ph:'calc',M:[0,1,2].map(()=>({r:3,c:3,d:[[0,0,0],[0,0,0],[0,0,0]]})),ans:null,i:0,j:0,b:[],mi:0,r:0};
 S.vc=0;S.eq=0;S.cm=0;S.bn=0;S.sm=0;S.sd=[];S.pol=0;S.menu=null;S.E=[];S.c=0;S.res=null;S.resC=null;S.err=null;S.done=0;S.sl=0}
function mtKeyA(a){const T=S.mt,ph=T.ph;if(ph=='calc')return false;
 if(ph=='res'){const m=T.ans,R=m.length,C=m[0].length;if(a=='@U')T.i=(T.i+R-1)%R;else if(a=='@D')T.i=(T.i+1)%R;else if(a=='@L')T.j=(T.j+C-1)%C;else if(a=='@R')T.j=(T.j+1)%C;else{T.ph='calc';return false}return true}
 S.err=null;if(a=='@MODE'){T.ph='calc';cmd(a);return true}
 if(a=='@AC'){if(T.b.length)T.b=[];else T.ph='calc';return true}
 if(ph=='pickD'||ph=='pickE'){if(/^[1-3]$/.test(a)){T.mi=+a-1;T.ph=ph=='pickD'?'dimR':'edit';T.i=T.j=0;T.b=[]}return true}
 const o=T.M[T.mi];
 if(a=='@DEL'){T.b.pop();return true}
 if(ph=='edit'&&(a=='@U'||a=='@D')){let k=T.i*o.c+T.j+(a=='@D'?1:-1);k=Math.max(0,Math.min(o.r*o.c-1,k));T.i=Math.floor(k/o.c);T.j=k%o.c;T.b=[];return true}
 if(a=='@EXE'){if(ph=='edit'){if(T.b.length)o.d[T.i][T.j]=calc(T.b.join(''),S).v;T.b=[];if(++T.j==o.c){T.j=0;T.i++}if(T.i==o.r)T.ph='calc';return true}
  const v=calc(T.b.join(''),S).v;if(!Number.isInteger(v)||v<1||v>4)throw'Math ERROR';T.b=[];
  if(ph=='dimR')T.r=v,T.ph='dimC';else{T.M[T.mi]={r:T.r,c:v,d:Array.from({length:T.r},(_,i)=>Array.from({length:v},(_,j)=>(o.d[i]&&o.d[i][j])||0))};T.ph='calc'}return true}
 if(a[0]!='@'&&a!='=')T.b.push(a);return true}
function mtR(){const T=S.mt,L=$('l1'),O=$('l2'),n='ABC'[T.mi],o=T.M[T.mi],ph=T.ph;
 if(ph=='pickD'||ph=='pickE'){L.innerHTML=(ph=='pickD'?'Dim':'Edit')+' 1:A 2:B 3:C';O.innerHTML=S.err?'<span class="er">'+S.err+'</span>':'';return}
 if(ph=='res'){L.innerHTML='MatAns '+(T.i+1)+','+(T.j+1)+' ('+T.ans.length+'×'+T.ans[0].length+')';O.innerHTML=fmt(T.ans[T.i][T.j],S);return}
 L.innerHTML=ph=='edit'?'Mat'+n+' '+(T.i+1)+','+(T.j+1)+' ?':'Mat'+n+(ph=='dimR'?' Row? (1-4)':' Col? (1-4)');
 O.innerHTML=S.err?'<span class="er">'+S.err+'</span>':T.b.length?T.b.join(''):ph=='edit'?fmt(o.d[T.i][T.j],S):'0'}
if(typeof module!='undefined')module.exports={mcalc};
