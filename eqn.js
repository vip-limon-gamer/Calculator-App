// EQN mode: 2/3-unknown linear systems, quadratic, cubic (real + complex roots)
const EQ={L2:{n:6,t:'a1X+b1Y=c1',nm:[1,2].flatMap(i=>['a','b','c'].map(c=>c+i)),o:['X','Y']},
 L3:{n:12,t:'a1X+b1Y+c1Z=d1',nm:[1,2,3].flatMap(i=>['a','b','c','d'].map(c=>c+i)),o:['X','Y','Z']},
 Q:{n:3,t:'aX²+bX+c=0',nm:['a','b','c'],o:['X1','X2']},C:{n:4,t:'aX³+bX²+cX+d=0',nm:['a','b','c','d'],o:['X1','X2','X3']}};
function gaussEq(M){const n=M.length,sc=Math.max(...M.flat().map(Math.abs))||1;
 for(let i=0;i<n;i++){let p=i;for(let r=i+1;r<n;r++)if(Math.abs(M[r][i])>Math.abs(M[p][i]))p=r;if(Math.abs(M[p][i])<=1e-12*sc)throw'Math ERROR';[M[i],M[p]]=[M[p],M[i]];
  for(let r=0;r<n;r++)if(r!=i){const f=M[r][i]/M[i][i];for(let c=i;c<=n;c++)M[r][c]-=f*M[i][c]}}
 return M.map((r,i)=>[Number((r[n]/r[i]).toPrecision(15))||0,0])}
function eqQuad(a,b,c){if(a==0)throw'Math ERROR';const d=b*b-4*a*c,s=b*b+Math.abs(4*a*c);
 if(Math.abs(d)<=4e-16*s){const x=-b/(2*a);return[[x,0],[x,0]]}
 if(d>0){const sq=Math.sqrt(d);let xp,xm;if(b>=0){const q=-(b+sq)/2;xm=q/a;xp=q?c/q:0}else{const q=(-b+sq)/2;xp=q/a;xm=q?c/q:0}return[[xp,0],[xm,0]]}
 const re=-b/(2*a),im=Math.sqrt(-d)/(2*Math.abs(a));return[[re,im],[re,-im]]}
function eqCubic(a,b,c,d){if(a==0)throw'Math ERROR';const p=b/a,q=c/a,r=d/a,P=q-p*p/3,Q=2*p**3/27-p*q/3+r,sh=-p/3,hQ=Q/2,t3=P/3,D=hQ*hQ+t3**3,sc=hQ*hQ+Math.abs(t3**3);let z;
 if(Math.abs(D)<=1e-13*sc){if(P==0&&Q==0)z=[[0,0],[0,0],[0,0]];else{const t1=3*Q/P,t2=-3*Q/(2*P);z=[[t1,0],[t2,0],[t2,0]]}}
 else if(D>0){const s=Math.sqrt(D),u=Math.cbrt(-hQ+s),v=Math.cbrt(-hQ-s),t=u+v,w=Math.sqrt(3)/2*(u-v);z=[[t,0],[-t/2,w],[-t/2,-w]]}
 else{const m=2*Math.sqrt(-t3),th=Math.acos(Math.max(-1,Math.min(1,3*Q/(P*m))))/3;z=[0,1,2].map(k=>[m*Math.cos(th-2*Math.PI*k/3),0])}
 z=z.map(w=>[w[0]+sh,w[1]]);
 const cm=(x,y)=>[x[0]*y[0]-x[1]*y[1],x[0]*y[1]+x[1]*y[0]],f=w=>{let t=[a,0];for(const k of[b,c,d]){t=cm(t,w);t[0]+=k}return t},
  df=w=>{const w2=cm(w,w);return[3*a*w2[0]+2*b*w[0]+c,3*a*w2[1]+2*b*w[1]]};
 z=z.map(w=>{for(let i=0;i<4;i++){const y=f(w),e=df(w),den=e[0]*e[0]+e[1]*e[1];if(den<1e-300)break;const s=[(y[0]*e[0]+y[1]*e[1])/den,(y[1]*e[0]-y[0]*e[1])/den],n=[w[0]-s[0],w[1]-s[1]];if(Math.hypot(...f(n))<=Math.hypot(...y))w=n;else break}return w});
 const R=1+Math.max(Math.abs(p),Math.abs(q),Math.abs(r)),cl=x=>Math.abs(x)<1e-13*R?0:Number(x.toPrecision(15));
 z=z.map(w=>[cl(w[0]),cl(w[1])]);const re=z.filter(w=>!w[1]).sort((u,v)=>v[0]-u[0]),cp=z.filter(w=>w[1]).sort((u,v)=>v[1]-u[1]);return re.concat(cp)}
function eqSolve(k,v){let r;
 if(k=='L2')r=gaussEq([[v[0],v[1],v[2]],[v[3],v[4],v[5]]]);else if(k=='L3')r=gaussEq([v.slice(0,4),v.slice(4,8),v.slice(8,12)]);
 else if(k=='Q')r=eqQuad(...v);else r=eqCubic(...v);
 return r.map((c,i)=>({n:EQ[k].o[i],c}))}
function startEq(k){S.mt=0;S.vc=0;S.eq={k,i:0,v:[],b:[],sol:null,si:0};S.cm=0;S.bn=0;S.sm=0;S.sd=[];S.pol=0;S.menu=null;S.E=[];S.c=0;S.res=null;S.resC=null;S.err=null;S.done=0;S.sl=0}
function eqKeyA(a){const E=S.eq,N=EQ[E.k].n;S.err=null;
 if(a=='@MODE'||a=='@CLR'){cmd(a);return}
 if(E.sol){const L=E.sol.length;if(a=='@EXE'||a=='@D'||a=='@R')E.si=(E.si+1)%L;else if(a=='@U'||a=='@L')E.si=(E.si+L-1)%L;else if(a=='@AC'){E.sol=null;E.i=0;E.b=[]}return}
 if(a=='@AC'){E.b=[];return}if(a=='@DEL'){E.b.pop();return}
 if(a=='@U'){if(E.i>0){E.i--;E.b=[]}return}if(a=='@D'){if(E.i<E.v.length){E.i++;E.b=[]}return}
 if(a=='@EXE'){let x;if(E.b.length)x=calc(E.b.join(''),S).v;else if(E.i<E.v.length)x=E.v[E.i];else return;
  E.v[E.i]=x;E.b=[];E.i++;if(E.i==N){try{E.sol=eqSolve(E.k,E.v);E.si=0}catch(e){E.i=N-1;throw e}}return}
 if(a[0]!='@'&&a!='=')E.b.push(a)}
function eqR(){const E=S.eq,Q=EQ[E.k],L=$('l1'),O=$('l2');
 if(S.err){L.innerHTML=Q.t;O.innerHTML='<span class="er">'+S.err+'</span>';return}
 if(E.sol){const s=E.sol[E.si];L.innerHTML=s.n+' ='+(E.sol.length>1?' ▼':'');O.innerHTML=cfmt(s.c,{...S,pol:0});return}
 L.innerHTML=Q.t+'<br>'+Q.nm[E.i]+'?';O.innerHTML=E.b.length?E.b.join(''):E.i<E.v.length?fmt(E.v[E.i],S):'0'}
if(typeof module!='undefined')module.exports={eqSolve};
