// SD / REG calculator modes: data sums, regression, prediction (used by engine tokens)
const SV=new Set(['Σx²','Σy²','Σxy','Σx','Σy','x\u0304','y\u0304','xσn−1','xσn','yσn−1','yσn','n','ᴀ','ʙ','ᴄ','r']);
const stER=()=>{throw'Math ERROR'};
function stSums(D){const n=D.reduce((s,d)=>s+d.f,0);if(!n)stER();const S=g=>D.reduce((s,d)=>s+d.f*g(d),0),mx=S(d=>d.x)/n,my=S(d=>d.y)/n,
 vx=S(d=>(d.x-mx)**2),vy=S(d=>(d.y-my)**2),k=a=>n>1?Math.sqrt(a/(n-1)):NaN;
 return{n,Sx:S(d=>d.x),Sx2:S(d=>d.x*d.x),Sy:S(d=>d.y),Sy2:S(d=>d.y*d.y),Sxy:S(d=>d.x*d.y),mx,my,sxn:Math.sqrt(vx/n),sxn1:k(vx),syn:Math.sqrt(vy/n),syn1:k(vy)}}
function stReg(D,m){const tx=x=>m=='LOG'||m=='PWR'?Math.log(x):m=='INV'?1/x:x,ty=y=>m=='EXP'||m=='PWR'?Math.log(y):y;
 const P=D.map(d=>({x:tx(d.x),y:ty(d.y),f:d.f}));if(!P.length||P.some(p=>!isFinite(p.x)||!isFinite(p.y)))stER();
 const n=P.reduce((s,p)=>s+p.f,0),S=g=>P.reduce((s,p)=>s+p.f*g(p),0);
 if(m=='QUAD'){const q=k=>S(p=>p.x**k),t=k=>S(p=>p.x**k*p.y),M=[[n,q(1),q(2),t(0)],[q(1),q(2),q(3),t(1)],[q(2),q(3),q(4),t(2)]],sc=Math.max(...M.flat().map(Math.abs));
  for(let i=0;i<3;i++){let b=i;for(let r=i+1;r<3;r++)if(Math.abs(M[r][i])>Math.abs(M[b][i]))b=r;if(Math.abs(M[b][i])<1e-12*sc)stER();[M[i],M[b]]=[M[b],M[i]];for(let r=0;r<3;r++)if(r!=i){const f=M[r][i]/M[i][i];for(let c=i;c<4;c++)M[r][c]-=f*M[i][c]}}
  return{A:M[0][3]/M[0][0],B:M[1][3]/M[1][1],C:M[2][3]/M[2][2]}}
 const mx=S(p=>p.x)/n,my=S(p=>p.y)/n,xx=S(p=>(p.x-mx)**2),yy=S(p=>(p.y-my)**2),xy=S(p=>(p.x-mx)*(p.y-my));
 if(xx<=1e-20*Math.max(S(p=>p.x*p.x),1e-300))stER();
 const B=xy/xx,a=my-B*mx,r=yy<=1e-20*Math.max(S(p=>p.y*p.y),1e-300)?NaN:xy/Math.sqrt(xx*yy);
 return{A:m=='EXP'||m=='PWR'?Math.exp(a):a,B,r}}
function statVal(t,st){if(!st.sm)throw'Syntax ERROR';if(st.sm=='SD'&&/y/.test(t))throw'Syntax ERROR';let v;
 if('ᴀʙᴄr'.includes(t)){if(st.sm=='SD')throw'Syntax ERROR';const o=stReg(st.sd,st.sm);v={'ᴀ':o.A,'ʙ':o.B,'ᴄ':o.C,r:o.r}[t]}
 else{const o=stSums(st.sd);v={'Σx²':o.Sx2,'Σx':o.Sx,n:o.n,'x\u0304':o.mx,'xσn':o.sxn,'xσn−1':o.sxn1,'Σy²':o.Sy2,'Σy':o.Sy,'Σxy':o.Sxy,'y\u0304':o.my,'yσn':o.syn,'yσn−1':o.syn1}[t]}
 if(typeof v!='number'||!isFinite(v))stER();return v}
function SPR(st,w,v){if(!st.sm||st.sm=='SD')throw'Syntax ERROR';const o=stReg(st.sd,st.sm),m=st.sm,A=o.A,B=o.B;let r;
 if(w){r=m=='LIN'?A+B*v:m=='LOG'?A+B*Math.log(v):m=='EXP'?A*Math.exp(B*v):m=='PWR'?A*Math.pow(v,B):m=='INV'?A+B/v:A+B*v+o.C*v*v}
 else{if(m=='QUAD')stER();r=m=='LIN'?(v-A)/B:m=='LOG'?Math.exp((v-A)/B):m=='EXP'?Math.log(v/A)/B:m=='PWR'?Math.pow(v/A,1/B):B/(v-A)}
 if(!isFinite(r))stER();return r}
if(typeof module!='undefined')module.exports={stSums,stReg,statVal,SPR,SV};
