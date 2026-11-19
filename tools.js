// Tools panels: currency, units, loan, BMI, Age Calculator , percent, base-N, statistics (SD/REG), equation solver
(()=>{
'use strict';
const D=id=>document.getElementById(id);
const nf=(x,d=2)=>Number.isFinite(x)?x.toLocaleString('en-US',{maximumFractionDigits:d}):'—';
const row=(l,v)=>'<div class="row"><span>'+l+'</span><b>'+v+'</b></div>';
const big=t=>'<div class="big">'+t+'</div>';
const SUM=a=>a.reduce((p,c)=>p+c,0);
const nums=s=>s.split(/[\s,;]+/).filter(Boolean).map(Number);

// ---------- pure math (also exported for tests) ----------
function gauss(M){const n=M.length;for(let i=0;i<n;i++){let p=i;for(let r=i+1;r<n;r++)if(Math.abs(M[r][i])>Math.abs(M[p][i]))p=r;if(Math.abs(M[p][i])<1e-12)throw'No unique solution';[M[i],M[p]]=[M[p],M[i]];for(let r=0;r<n;r++)if(r!=i){const f=M[r][i]/M[i][i];for(let c=i;c<=n;c++)M[r][c]-=f*M[i][c]}}return M.map((r,i)=>r[n]/r[i])}
function roots(c){c=c.slice();while(c.length&&c[0]==0)c.shift();const n=c.length-1;if(n<1)throw'Need a polynomial of degree 1 or more';if(n>8)throw'Degree 8 maximum';
 const a=c.map(x=>x/c[0]),cm=(p,q)=>[p[0]*q[0]-p[1]*q[1],p[0]*q[1]+p[1]*q[0]],cd=(p,q)=>{const d=q[0]*q[0]+q[1]*q[1];return[(p[0]*q[0]+p[1]*q[1])/d,(p[1]*q[0]-p[0]*q[1])/d]};
 const R=1+Math.max(...a.slice(1).map(Math.abs));let z=[],q=[R*.5,0];for(let k=0;k<n;k++){z.push(q);q=cm(q,[.4,.9])}
 for(let it=0;it<2000;it++){let mx=0;z=z.map((zi,i)=>{let p=[1,0];for(let k=1;k<=n;k++){p=cm(p,zi);p[0]+=a[k]}let d=[1,0];z.forEach((zj,j)=>{if(j!=i)d=cm(d,[zi[0]-zj[0],zi[1]-zj[1]])});if(d[0]*d[0]+d[1]*d[1]<1e-300)return zi;const s=cd(p,d);mx=Math.max(mx,Math.hypot(s[0],s[1]));return[zi[0]-s[0],zi[1]-s[1]]});if(mx<1e-14)break}
 return z.map(([re,im])=>[Math.abs(re)<1e-9?0:re,Math.abs(im)<1e-9*(1+Math.abs(re))?0:im]).sort((u,v)=>u[0]-v[0]||u[1]-v[1])}
const f6=x=>nf(x,6);
function reg(i,X,Y,px){const n=X.length;if(n<2)throw'Need at least 2 points';
 if(i==6){if(n<3)throw'Quadratic needs at least 3 points';const Sx=k=>SUM(X.map(x=>x**k)),Ty=k=>SUM(X.map((x,j)=>x**k*Y[j]));
  const[a,b,c]=gauss([[n,Sx(1),Sx(2),Ty(0)],[Sx(1),Sx(2),Sx(3),Ty(1)],[Sx(2),Sx(3),Sx(4),Ty(2)]]);const m=SUM(Y)/n,e=SUM(X.map((x,j)=>(Y[j]-a-b*x-c*x*x)**2)),t=SUM(Y.map(y=>(y-m)**2));
  return{eq:'y = A + Bx + Cx²',r:'R² = '+(t>0?nf(1-e/t,8):'undefined (all y equal)'),p:a+b*px+c*px*px,co:[a,b,c]}}
 const lg=i==3||i==4,lx=i==2||i==4;if((lx&&X.some(x=>x<=0))||(lg&&Y.some(y=>y<=0)))throw'This model needs positive data';
 const tx=X.map(x=>lx?Math.log(x):i==5?1/x:x),ty=Y.map(y=>lg?Math.log(y):y);
 const sx=SUM(tx),sy=SUM(ty),sxy=SUM(tx.map((x,j)=>x*ty[j])),sxx=SUM(tx.map(x=>x*x)),syy=SUM(ty.map(y=>y*y)),d=n*sxx-sx*sx;if(!d)throw'All x values are equal';
 const b=(n*sxy-sx*sy)/d,a=(sy-b*sx)/n,vy=n*syy-sy*sy,r=vy<=1e-12*Math.max(1,n*syy)?NaN:(n*sxy-sx*sy)/Math.sqrt(d*vy),A=lg?Math.exp(a):a;
 const p=i==1?a+b*px:i==2?a+b*Math.log(px):i==3?A*Math.exp(b*px):i==4?A*Math.pow(px,b):a+b/px;
 return{eq:['','y = A + Bx','y = A + B·ln x','y = A·e^(Bx)','y = A·x^B','y = A + B/x'][i],r:'r = '+(isNaN(r)?'undefined (all y equal)':nf(r,8)),p,co:[A,b]}}
if(typeof module!='undefined')module.exports={gauss,roots,reg};
if(typeof document=='undefined')return;

// ---------- generic panel builder ----------
function tool(id,title,fields,run,note){const s=D(id);
 s.innerHTML='<h2>'+title+'</h2><div class="tf">'+fields.map(f=>'<label>'+f.l+(f.o?'<select data-k="'+f.k+'">'+f.o.map(o=>'<option>'+o+'</option>').join('')+'</select>':f.ta?'<textarea data-k="'+f.k+'" spellcheck="false">'+(f.v||'')+'</textarea>':'<input data-k="'+f.k+'" type="'+(f.t||'number')+'" step="any" inputmode="'+(f.t=='text'?'text':'decimal')+'" value="'+(f.v??'')+'">')+'</label>').join('')+'</div><div class="out" aria-live="polite"></div>'+(note?'<p class="nt" id="'+id+'n">'+note+'</p>':'');
 const go=()=>{const v={};s.querySelectorAll('[data-k]').forEach(e=>v[e.dataset.k]=e.type=='number'?parseFloat(e.value):e.value);let h;try{h=run(v)}catch(x){h='<span class="er">'+(x&&x.message||x)+'</span>'}s.querySelector('.out').innerHTML=h};
 s.addEventListener('input',go);s.addEventListener('change',go);go();return s}
const K=(s,k)=>s.querySelector('[data-k='+k+']');

// ---------- Currency ----------
const RT={USD:1,EUR:.92,GBP:.79,INR:83.5,BDT:120,JPY:150,CNY:7.2,AUD:1.52,CAD:1.36,CHF:.88,SAR:3.75,AED:3.67,PKR:278,SGD:1.34,MYR:4.7,KRW:1350,TRY:32};
const cur=tool('cur','Currency converter',[{k:'a',l:'Amount',v:100},{k:'f',l:'From',o:Object.keys(RT)},{k:'t',l:'To',o:[...Object.keys(RT).slice(1),'USD']}],
 v=>{if(!(v.a>=0))throw'Enter an amount';const r=RT[v.t]/RT[v.f];return big(nf(v.a*r,4)+' '+v.t)+row('1 '+v.f,nf(r,6)+' '+v.t)+row('1 '+v.t,nf(1/r,6)+' '+v.f)},
 'Offline sample rates (approximate). Live rates load automatically when online.');
fetch('https://open.er-api.com/v6/latest/USD').then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>{if(!j.rates||j.result=='error')throw 0;for(const k in RT)if(j.rates[k]>0)RT[k]=j.rates[k];D('curn').textContent='Live rates – updated '+String(j.time_last_update_utc||'').slice(0,16);cur.dispatchEvent(new Event('input'))}).catch(()=>{D('curn').textContent='Offline – using approximate sample rates.'});

// ---------- Units ----------
const UN={Length:{mm:.001,cm:.01,m:1,km:1e3,in:.0254,ft:.3048,yd:.9144,mile:1609.344},Mass:{mg:1e-6,g:1e-3,kg:1,t:1e3,oz:.028349523125,lb:.45359237},Area:{'cm²':1e-4,'m²':1,ha:1e4,'km²':1e6,'ft²':.09290304,acre:4046.8564224},Volume:{mL:.001,L:1,'m³':1e3,'gal US':3.785411784,'gal UK':4.54609,cup:.2365882365},Speed:{'m/s':1,'km/h':1/3.6,mph:.44704,knot:.514444},Time:{s:1,min:60,h:3600,day:86400,week:604800},Data:{B:1,KB:1024,MB:1048576,GB:1073741824,TB:1099511627776},Energy:{J:1,kJ:1e3,cal:4.184,kcal:4184,Wh:3600,kWh:3.6e6},Pressure:{Pa:1,kPa:1e3,bar:1e5,atm:101325,psi:6894.757,mmHg:133.322},Temperature:{'°C':0,'°F':0,K:0}};
const us=tool('uni','Unit converter',[{k:'c',l:'Category',o:Object.keys(UN)},{k:'v',l:'Value',v:1},{k:'f',l:'From',o:[]},{k:'t',l:'To',o:[]}],
 v=>{const U=UN[v.c];if(!U||!(v.f in U)||!(v.t in U))return'';if(isNaN(v.v))throw'Enter a value';let r;
  if(v.c=='Temperature'){const k=v.f=='°C'?v.v:v.f=='°F'?(v.v-32)/1.8:v.v-273.15;if(k<-273.15-1e-9)throw'Below absolute zero';r=v.t=='°C'?k:v.t=='°F'?k*1.8+32:k+273.15}else r=v.v*U[v.f]/U[v.t];
  return big(nf(r,8)+' '+v.t)+row(nf(v.v,8)+' '+v.f,nf(r,8)+' '+v.t)});
const fillU=()=>{const ks=Object.keys(UN[K(us,'c').value]);['f','t'].forEach((k,i)=>K(us,k).innerHTML=ks.map((u,j)=>'<option'+(j==(i?1:0)?' selected':'')+'>'+u+'</option>').join(''))};
K(us,'c').addEventListener('change',fillU);fillU();us.dispatchEvent(new Event('change'));

// ---------- Loan ----------
tool('loan','Loan / EMI calculator',[{k:'p',l:'Loan amount',v:100000},{k:'r',l:'Annual interest rate (%)',v:8.5},{k:'n',l:'Term',v:5},{k:'u',l:'Term unit',o:['Years','Months']}],
 v=>{const n=v.u=='Years'?v.n*12:v.n,i=v.r/1200;if(!(v.p>0&&n>0&&v.r>=0))throw'Enter valid loan values';if(Math.abs(n-Math.round(n))>1e-9)throw'Term must be a whole number of months';if(n>1200)throw'Maximum term is 100 years';
  const e=i?v.p*i*Math.pow(1+i,n)/(Math.pow(1+i,n)-1):v.p/n,t=e*n,it=t-v.p;
  return big(nf(e)+' / month')+'<div class="bar" title="Principal vs interest"><i style="width:'+(v.p/t*100)+'%"></i></div>'+row('Total payment',nf(t))+row('Total interest',nf(it))+row('Interest share',nf(it/t*100,1)+'%')+row('Number of payments',nf(n,0))});

// ---------- BMI ----------
tool('bmi','BMI calculator',[{k:'u',l:'Units',o:['Metric (kg, cm)','Imperial (lb, in)']},{k:'w',l:'Weight',v:70},{k:'h',l:'Height',v:170}],
 v=>{const m=v.u[0]=='M',b=m?v.w/Math.pow(v.h/100,2):703*v.w/(v.h*v.h);if(!(b>0&&isFinite(b)))throw'Enter weight and height';
  const c=b<18.5?'Underweight':b<25?'Normal':b<30?'Overweight':'Obese',hm=m?v.h/100:v.h*.0254,lo=18.5*hm*hm,hi=24.9*hm*hm;
  return big(nf(b,1)+' · '+c)+row('Healthy weight range',m?nf(lo,1)+' – '+nf(hi,1)+' kg':nf(lo*2.20462,1)+' – '+nf(hi*2.20462,1)+' lb')},
 'WHO adult categories. Informational only – not medical advice.');

// ---------- Age Calculator ----------

const iso=d=>d.toISOString().slice(0,10),td=new Date();
tool('dat','Date calculator',[{k:'a',l:'From date',t:'date',v:iso(td)},{k:'b',l:'To date',t:'date',v:iso(new Date(td.getTime()+864e5))},{k:'n',l:'Add days to “From” (negative to subtract)',v:0}],
 v=>{if(!v.a||!v.b)throw'Pick both dates';const U=s=>new Date(s+'T00:00:00Z');let A=U(v.a),B=U(v.b);if(B<A)[A,B]=[B,A];
  const days=Math.round((B-A)/864e5);let y=B.getUTCFullYear()-A.getUTCFullYear(),m=B.getUTCMonth()-A.getUTCMonth(),d=B.getUTCDate()-A.getUTCDate();
  if(d<0){m--;d+=new Date(Date.UTC(B.getUTCFullYear(),B.getUTCMonth(),0)).getUTCDate()}if(m<0){y--;m+=12}
  const n=Number.isFinite(v.n)?v.n:0,Rd=new Date(U(v.a).getTime()+n*864e5);
  return big(nf(days,0)+' days')+row('Years · months · days',y+'y '+m+'m '+d+'d')+row('Weeks',nf(days/7,2))+row('Weekday of “From”',U(v.a).toUTCString().slice(0,3))+row('From '+(n<0?'−':'+')+' '+Math.abs(n)+' days',Rd.toUTCString().slice(0,16))});

// ---------- Percent ----------
tool('pct','Percentage, discount & tax',[{k:'a',l:'Percent (%)',v:15},{k:'b',l:'Amount',v:200},{k:'c',l:'Second value (for % change)',v:250}],
 v=>row(v.a+'% of '+v.b,nf(v.a*v.b/100,4))+row(v.b+' + '+v.a+'%',nf(v.b*(1+v.a/100),4))+row(v.b+' − '+v.a+'%',nf(v.b*(1-v.a/100),4))+row(v.b+' is what % of '+v.c,v.c==0?'undefined (÷ 0)':nf(v.b/v.c*100,4)+'%')+row('Change from '+v.b+' to '+v.c,v.b==0?'undefined (÷ 0)':nf((v.c-v.b)/v.b*100,4)+'%'));

// ---------- Base-N ----------
tool('bas','Number base (DEC · HEX · BIN · OCT)',[{k:'s',l:'Value',t:'text',v:'255'},{k:'b',l:'Input base',o:['DEC','HEX','BIN','OCT']}],
 v=>{const B={DEC:10,HEX:16,BIN:2,OCT:8}[v.b],t=v.s.trim(),s=t.replace(/^-/,'').toUpperCase();
  if(!s||!/^[0-9A-F]+$/.test(s)||[...s].some(c=>parseInt(c,16)>=B))throw'Invalid '+v.b+' number';
  let n=0n;for(const c of s)n=n*BigInt(B)+BigInt(parseInt(c,16));if(t[0]=='-')n=-n;
  return[['DEC',10],['HEX',16],['BIN',2],['OCT',8]].map(([l,b])=>row(l,n.toString(b).toUpperCase())).join('')});

// ---------- Statistics: SD + REG ----------
const MODES=['SD – one variable','Linear: y = A + Bx','Logarithmic: y = A + B·ln x','Exponential: y = A·e^(Bx)','Power: y = A·x^B','Inverse: y = A + B/x','Quadratic: y = A + Bx + Cx²'];
const st=tool('sta','Statistics (SD / REG)',[{k:'m',l:'Mode',o:MODES},{k:'d',l:'Data – SD: numbers; REG: one “x y” pair per line',ta:1,v:'12\n15\n9\n20\n14\n18'},{k:'p',l:'Predict ŷ at x (REG modes)',v:10}],
 v=>{const L=v.d.split('\n').map(nums).filter(r=>r.length),i=MODES.indexOf(v.m);if(!L.length)throw'Enter data';
  if(i==0){const x=L.flat();if(x.some(isNaN))throw'Numbers only';const n=x.length,sx=SUM(x),sx2=SUM(x.map(a=>a*a)),mu=sx/n,ss=sx2-n*mu*mu,o=[...x].sort((a,b)=>a-b),md=n%2?o[(n-1)/2]:(o[n/2-1]+o[n/2])/2;
   return row('n',n)+row('Σx',f6(sx))+row('Σx²',f6(sx2))+row('Mean x̄',nf(mu,8))+row('Population σx',nf(Math.sqrt(Math.max(ss,0)/n),8))+row('Sample s (σn−1)',n>1?nf(Math.sqrt(Math.max(ss,0)/(n-1)),8):'—')+row('Median',f6(md))+row('Min / Max',f6(o[0])+' / '+f6(o[n-1]))}
  if(L.some(r=>r.length<2||r.some(isNaN)))throw'Each line needs two numbers: x y';
  const R=reg(i,L.map(r=>r[0]),L.map(r=>r[1]),v.p);
  return big(R.eq)+R.co.map((c,k)=>row('ABC'[k],nf(c,8))).join('')+row('Fit',R.r)+row('ŷ at x = '+v.p,Number.isFinite(R.p)?nf(R.p,8):'—')+row('Points',L.length)},
 'Edit the data in each mode; REG lines look like “1 2.1”.');
K(st,'m').addEventListener('change',()=>{K(st,'d').value=K(st,'m').value==MODES[0]?'12\n15\n9\n20\n14\n18':'1 2.1\n2 3.9\n3 6.2\n4 7.8\n5 10.1'});

// ---------- Equation solver ----------
const SOL=['Polynomial (highest power first)','Linear system (rows: coefficients, then constant)'];
const so=tool('sol','Equation solver',[{k:'t',l:'Type',o:SOL},{k:'d',l:'Coefficients',ta:1,v:'1 -3 2'}],
 v=>{if(v.t==SOL[0]){const c=nums(v.d.replace(/\n/g,' '));if(c.length<2||c.some(isNaN))throw'Enter coefficients, e.g. 1 -3 2 for x² − 3x + 2';
   const cx=([a,b])=>b==0?nf(a,8):nf(a,8)+(b<0?' − ':' + ')+nf(Math.abs(b),8)+'i';
   return roots(c).map((r,i)=>row('x'+(i+1),cx(r))).join('')}
  const M=v.d.split('\n').map(nums).filter(r=>r.length),n=M.length;if(n<2||n>5||M.some(r=>r.length!=n+1||r.some(isNaN)))throw'Need n rows of n coefficients + 1 constant (2–5 unknowns)';
  return gauss(M).map((x,i)=>row('x'+(i+1),nf(x,8))).join('')},
 'Polynomial: “1 -3 2” = x² − 3x + 2 (real and complex roots, up to degree 8). Linear system: “2 1 5” = 2x + y = 5.');
K(so,'t').addEventListener('change',()=>{K(so,'d').value=K(so,'t').value==SOL[0]?'1 -3 2':'2 1 5\n1 -1 1'});
})();
