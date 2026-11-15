const $=s=>document.querySelector(s),D=Decimal;D.set({precision:30,rounding:4});
const PI=D.acos(-1),red=(x,p)=>{const r=x.mod(p);return r.isNeg()?r.plus(p):r},z=r=>r.abs().lt('1e-25')?D(0):r;
const F={
sin:(x,d)=>{if(d){const r=red(x,360);if(r.mod(180).isZero())return D(0);if(r.eq(90))return D(1);if(r.eq(270))return D(-1);x=r.times(PI).div(180)}return z(D.sin(x))},
cos:(x,d)=>{if(d){const r=red(x,360);if(r.eq(90)||r.eq(270))return D(0);if(r.isZero())return D(1);if(r.eq(180))return D(-1);x=r.times(PI).div(180)}return z(D.cos(x))},
tan:(x,d)=>{if(d){const r=red(x,180);if(r.eq(90))throw Error('tan: Undefined');if(r.isZero())return D(0);x=r.times(PI).div(180)}else if(z(D.cos(x)).isZero())throw Error('tan: Undefined');return z(D.tan(x))},
asin:(x,d)=>{if(x.abs().gt(1))throw Error('asin: out of range');const r=D.asin(x);return d?r.times(180).div(PI):r},
acos:(x,d)=>{if(x.abs().gt(1))throw Error('acos: out of range');const r=D.acos(x);return d?r.times(180).div(PI):r},
atan:(x,d)=>{const r=D.atan(x);return d?r.times(180).div(PI):r},
ln:x=>{if(x.lte(0))throw Error('ln: positive numbers only');return D.ln(x)},
log:x=>{if(x.lte(0))throw Error('log: positive numbers only');return D.log10(x)},
sqrt:x=>{if(x.isNeg())throw Error('√: negative number');return D.sqrt(x)},cbrt:x=>D.cbrt(x),abs:x=>x.abs(),exp:x=>D.exp(x)};
function fact(x){if(!x.isInt()||x.isNeg()||x.gt(170))throw Error('n!: whole number 0 to 170');let r=D(1);for(let i=2;i<=x.toNumber();i++)r=r.times(i);return r}
function ev(src,deg,ans){
const t=src.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/π/g,'pi').match(/(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?|[a-zA-Z]+|\S/g)||[];let i=0;const pk=()=>t[i];
const ex=()=>{let v=tm();while(pk()=='+'||pk()=='-'){const o=t[i++],r=tm();v=o=='+'?v.plus(r):v.minus(r)}return v};
const tm=()=>{let v=un();for(;;){const p=pk();if(p=='*'||p=='/'){i++;const r=un();if(p=='/'){if(r.isZero())throw Error('Divide by zero');v=v.div(r)}else v=v.times(r)}else if(p!==undefined&&/^[\d.a-zA-Z(]/.test(p))v=v.times(un());else return v}};
const un=()=>{if(pk()=='-'){i++;return un().neg()}if(pk()=='+'){i++;return un()}return pw()};
const pw=()=>{const b=pf();if(pk()=='^'){i++;const e=un(),r=D.pow(b,e);if(!r.isFinite())throw Error('Result out of range');return r}return b};
const pf=()=>{let v=pr();while(pk()=='!'||pk()=='%'){v=t[i++]=='!'?fact(v):v.div(100)}return v};
const pr=()=>{const k=t[i++];if(k===undefined)throw Error('Incomplete expression');
if(/^[\d.]/.test(k))return new D(k);
if(k=='('){const v=ex();if(pk()==')')i++;else if(i<t.length)throw Error('Syntax error');return v}
if(k=='pi')return PI;if(k=='e')return D.exp(1);if(k=='ans')return ans;
if(F[k]){if(pk()!='(')throw Error('Syntax error');i++;const v=ex();if(pk()==')')i++;return F[k](v,deg)}
throw Error('Syntax error')};
const r=ex();if(i<t.length)throw Error('Syntax error');if(!r.isFinite())throw Error('Result out of range');return r}
function fmt(d){const s=d.toSignificantDigits(12),a=s.abs();return a.gte('1e15')||(!s.isZero()&&a.lt('1e-9'))?s.toExponential():s.toFixed()}
const B=[['MC','MC','f'],['MR','MR','f'],['M+','M+','f'],['M−','M-','f'],['AC','AC','o'],['⌫','DEL','o'],['%','%','o'],['÷','÷','o'],['7'],['8'],['9'],['×','×','o'],['4'],['5'],['6'],['−','−','o'],['1'],['2'],['3'],['+','+','o'],['±','NEG','o'],['0'],['.'],['=','=','e']];
const S=[['sin','sin('],['cos','cos('],['tan','tan('],['(','('],[')',')'],['sin⁻¹','asin('],['cos⁻¹','acos('],['tan⁻¹','atan('],['ln','ln('],['log','log('],['x²','^2'],['xʸ','^'],['√x','sqrt('],['∛x','cbrt('],['1/x','^(-1)'],['π','π'],['e','e'],['n!','!'],['|x|','abs('],['×10ˣ','×10^'],['eˣ','exp('],['Ans','ans'],['10ˣ','10^'],['EXP','×10^']];
function mk(root,sci){
const st={e:'',deg:true,ans:D(0),mem:D(0),m:false,done:false,h:[]};
root.innerHTML=`<div class="bar">${sci?'<button class="tg" type="button" aria-pressed="true" data-t="1">DEG</button>':''}<span class="m" aria-label="Memory in use"></span></div><div class="disp" tabindex="0" aria-label="Calculator display"><div class="ex"></div><div class="rs" aria-live="polite" aria-atomic="true"></div></div><div class="er" role="alert" aria-live="assertive"></div>${sci?'<div class="pad c5" data-p="s"></div>':''}<div class="pad c4" data-p="b"></div><details class="hist"><summary>History</summary><div></div></details>`;
const ex=root.querySelector('.ex'),rs=root.querySelector('.rs'),er=root.querySelector('.er');
const draw=()=>{ex.textContent=st.e;root.querySelector('.m').textContent=st.m?'M':'';};
const run=()=>{try{return ev(st.e,st.deg,st.ans)}catch(x){return null}};
const hist=()=>{const h=root.querySelector('.hist div');h.innerHTML='';st.h.slice(-8).reverse().forEach(([a,b])=>{const k=document.createElement('button');k.type='button';k.textContent=a+' = '+b;k.onclick=()=>{st.e=a;st.done=false;draw()};h.append(k)})};
function key(k){er.textContent='';
const isOp=/^[+\-×÷^%!]$|^\^/.test(k);
if(!['AC','DEL','=','NEG','MC','MR','M+','M-'].includes(k)&&st.done){st.e=isOp?fmt(st.ans):'';st.done=false;if(!isOp)rs.textContent=''}
if(k=='AC'){st.e='';rs.textContent='';st.done=false}
else if(k=='DEL'){st.e=st.e.replace(/(asin\(|acos\(|atan\(|sin\(|cos\(|tan\(|ln\(|log\(|sqrt\(|cbrt\(|abs\(|exp\(|ans|.)$/,'')}
else if(k=='NEG'){if(st.e)st.e='−('+st.e+')'}
else if(k=='='){if(!st.e)return;try{const r=ev(st.e,st.deg,st.ans);st.ans=r;rs.textContent=fmt(r);st.h.push([st.e,fmt(r)]);st.done=true;hist()}catch(x){er.textContent=x.message;rs.textContent=''}}
else if(k=='MC'){st.mem=D(0);st.m=false}
else if(k=='MR'){st.e+=fmt(st.mem)}
else if(k=='M+'||k=='M-'){const v=st.e?run():st.ans;if(!v){er.textContent='Fix the expression first';return}st.mem=k=='M+'?st.mem.plus(v):st.mem.minus(v);st.m=true}
else st.e+=k;
draw()}
const fill=(sel,keys)=>{const p=root.querySelector(`[data-p=${sel}]`);keys.forEach(([l,k,c])=>{const b=document.createElement('button');b.type='button';b.textContent=l;b.className=c||'';b.setAttribute('aria-label',{'÷':'divide','×':'multiply','−':'minus','⌫':'backspace','±':'change sign'}[l]||l);b.onclick=()=>key(k||l);p.append(b)})};
if(sci)fill('s',S);fill('b',B);
const tg=root.querySelector('[data-t]');if(tg)tg.onclick=()=>{st.deg=!st.deg;tg.textContent=st.deg?'DEG':'RAD';tg.setAttribute('aria-pressed',st.deg)};
root.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key;
if(/^[0-9.+()^%!]$/.test(k))key(k);else if(k=='-')key('−');else if(k=='*')key('×');else if(k=='/')key('÷');
else if(k=='Backspace')key('DEL');else if(k=='Escape')key('AC');else if((k=='Enter'||k=='=')&&e.target.tagName!='BUTTON')key('=');else return;e.preventDefault()})}
mk($('#cb'),0);mk($('#cs'),1);

// routing
const secs=['basic','scientific','bmi','gni','age'];
function route(){const h=(location.hash||'#basic').slice(1),id=secs.includes(h)?h:'basic';
secs.forEach(s=>{$('#'+s).hidden=s!=id});document.querySelectorAll('nav a').forEach(a=>a.toggleAttribute('aria-current',a.getAttribute('href')=='#'+id)||a.removeAttribute('aria-current'));
document.querySelectorAll('nav a').forEach(a=>{if(a.getAttribute('href')=='#'+id)a.setAttribute('aria-current','page')});
document.title=$('#'+id+' h2').textContent+' | Calc Hub'}
addEventListener('hashchange',route);route();
const n2=(x,m=2)=>(+x).toLocaleString(undefined,{maximumFractionDigits:m});

// BMI
const STD={who:{n:'WHO international',c:[18.5,25,30,35,40],l:['Underweight','Normal','Overweight','Obese class I','Obese class II','Obese class III'],up:25},
asia:{n:'WHO Asia-Pacific',c:[18.5,23,25,30],l:['Underweight','Normal','Overweight (at risk)','Obese class I','Obese class II'],up:23},
china:{n:'China 2024',c:[18.5,24,28],l:['Underweight','Normal','Overweight','Obese'],up:24}};
const cl=(b,s)=>{let i=0;while(i<s.c.length&&b>=s.c[i])i++;return s.l[i]};
function bmi(){const im=$('#bu').value=='i';$('#bhl').textContent=im?'Height (ft)':'Height (cm)';$('#bil').hidden=!im;$('#bwl').textContent=im?'Weight (lb)':'Weight (kg)';$('#bxl').textContent=im?'Waist, optional (in)':'Waist, optional (cm)';
let h=+$('#bh').value,w=+$('#bw').value,wa=+$('#bx').value,a=+$('#ba').value;const o=$('#bo');
if(im){h=(h*12+(+$('#bh2').value||0))*2.54;w*=0.45359237;wa*=2.54}
if(!(h>0&&w>0)){o.textContent='Enter height and weight.';return}
if(a<20){o.innerHTML='<p><b>Adult BMI categories apply from age 20.</b> For children and teens, use age- and sex-specific percentile charts (CDC or WHO) with a health professional.</p>';return}
const m=h/100,b=w/(m*m),s=STD[$('#bs').value],lo=18.5*m*m,hi=s.up*m*m,u=x=>im?n2(x/0.45359237,1)+' lb':n2(x,1)+' kg';
let d=w<lo?'You are '+u(lo-w)+' below this range.':w>hi?'You are '+u(w-hi)+' above this range.':'You are within this range.';
let r=`<p><b>BMI ${n2(b,1)} kg/m²</b></p><p>${STD.who.n}: <b>${cl(b,STD.who)}</b></p><p>${s.n}: <b>${cl(b,s)}</b></p><p>Healthy weight range (${s.n}): <b>${u(lo)} to ${u(hi)}</b>. ${d}</p><p>BMI Prime: <b>${n2(b/s.up,2)}</b> (1.00 is the upper limit of normal)</p>`;
if(wa>0){const q=wa/h;r+=`<p>Waist-to-height ratio: <b>${n2(q,2)}</b> (${q<0.5?'under 0.50, lower central-fat risk':q<0.6?'0.50 to 0.59, increased central-fat risk':'0.60 or more, higher risk'})</p>`}
o.innerHTML=r}
['bu','ba','bh','bh2','bw','bx','bs'].forEach(i=>$('#'+i).addEventListener('input',bmi));

// GNI
const cls=v=>v<=1175?'Low income':v<=4635?'Lower-middle income':v<=14375?'Upper-middle income':'High income';
function gni(){const m=$('#gm').value;$('#gn').hidden=m!='n';$('#ga').hidden=m!='a';$('#gc').hidden=m!='c';const v=i=>+$('#'+i).value,o=$('#go');
if(m=='n'){const g=v('n1')+v('n2')-v('n3'),p=v('n5');o.innerHTML=`<p>GNI: <b>${n2(g)}</b></p><p>Net national income: <b>${n2(g-v('n4'))}</b></p><p>GNI per capita: <b>${p>0?n2(g/p,3):'enter population'}</b></p>`}
else if(m=='a'){const e1=v('a1'),e2=v('a2'),e3=v('a3'),P=[v('a4'),v('a5'),v('a6')],Q=[v('a7'),v('a8'),v('a9')];
if(![e1,e2,e3,...P,...Q,v('a10'),v('a11')].every(x=>x>0)){o.textContent='Enter positive values in every field.';return}
const r1=(P[2]/P[1])/(Q[2]/Q[1]),r2=(P[2]/P[0])/(Q[2]/Q[0]),es=(e3+e2*r1+e1*r2)/3,g=v('a10')/es,pc=g/v('a11');
o.innerHTML=`<p>Atlas exchange rate: <b>${n2(es,4)}</b></p><p>Atlas GNI: <b>US$ ${n2(g/1e9,2)} billion</b></p><p>Atlas GNI per capita: <b>US$ ${n2(pc,0)}</b></p><p>At the raw market rate: US$ ${n2(v('a10')/e3/v('a11'),0)} per person</p><p>${cls(pc)} (World Bank FY2027)</p>`}
else{const x=v('c1');if(!(x>0)){o.textContent='Enter a value.';return}const p=v('c2');
o.innerHTML=`<p><b>${cls(x)}</b></p><table><tr><th>Group</th><th>FY2027 Atlas GNI per capita</th></tr><tr><td>Low</td><td>$1,175 or less</td></tr><tr><td>Lower-middle</td><td>$1,176 to $4,635</td></tr><tr><td>Upper-middle</td><td>$4,636 to $14,375</td></tr><tr><td>High</td><td>Above $14,375</td></tr></table>${p>0?`<p>PPP is ${n2(p/x,2)}× the Atlas figure, so local prices stretch ${p>x?'further':'less far'} than exchange rates suggest.</p>`:''}`}}
document.querySelectorAll('#gni input,#gm').forEach(e=>e.addEventListener('input',gni));gni();
$('#gg').addEventListener('input',()=>{const g=+$('#gg').value;$('#gmo').innerHTML=g>0?`GMI ≈ <b>${n2(3.31+0.02392*g,1)}%</b>. Informational only, not medical advice.`:'GMI % = 3.31 + 0.02392 × mean glucose. Needs 12 or more days of CGM data. Informational only, not medical advice.'});

// Age
const lp=y=>y%4==0&&(y%100!=0||y%400==0),dim=(y,m)=>[31,lp(y)?29:28,31,30,31,30,31,31,30,31,30,31][m-1],pd=s=>s.split('-').map(Number),U=(y,m,d)=>Date.UTC(y,m-1,d);
const today=new Date();$('#at').value=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],iso=t=>new Date(t).toISOString().slice(0,10);
function age(){const o=$('#ao');if(!$('#ab').value||!$('#at').value){o.textContent='Pick a date of birth.';return}
let [by,bm,bd]=pd($('#ab').value);const [ty0,tm0,td0]=pd($('#at').value);let ty=ty0,tm=tm0,td=td0;
if(U(ty,tm,td)<U(by,bm,bd)){o.textContent='The “as of” date is before the date of birth.';return}
const f=$('#af').value,leap=bm==2&&bd==29;let cm=bm,cd=bd;if(leap&&!lp(ty)){if(f=='1'){cm=3;cd=1}else cd=28}
let d=td-cd;if(d<0){tm--;if(tm<1){tm=12;ty--}d+=dim(ty,tm)}
let m=tm-cm;if(m<0){ty--;m+=12}const y=ty-by;
const days=Math.round((U(ty0,tm0,td0)-U(by,bm,bd))/864e5),bt=U(by,bm,bd);
let ny=ty0,nm=bm,nd=bd;const nb=yy=>leap&&!lp(yy)?(f=='1'?[yy,3,1]:[yy,2,28]):[yy,bm,bd];
let nx=nb(ny);if(U(...nx)<U(ty0,tm0,td0))nx=nb(ny+1);const dn=Math.round((U(...nx)-U(ty0,tm0,td0))/864e5);
o.innerHTML=`<p><b>${y} years, ${m} months, ${d} days</b></p><p>Total months: <b>${n2(y*12+m,0)}</b> · Weeks: <b>${n2(Math.floor(days/7),0)}</b> + ${days%7} days · Days: <b>${n2(days,0)}</b></p><p>Hours: ${n2(days*24,0)} · Minutes: ${n2(days*1440,0)} · Seconds: ${n2(days*86400,0)}</p><p>Born on a <b>${DAYS[new Date(bt).getUTCDay()]}</b></p><p>Next birthday: <b>${dn==0?'today':dn+' days'}</b> (${iso(U(...nx))})</p><p>10,000 days old on <b>${iso(bt+1e4*864e5)}</b> · 1 billion seconds on <b>${iso(bt+Math.floor(1e9/86400)*864e5)}</b></p>${leap?`<p>Leap-day rule in use: birthday falls on ${f=='1'?'1 March':'28 February'} in common years.</p>`:''}`}
['ab','at','af'].forEach(i=>$('#'+i).addEventListener('input',age));
