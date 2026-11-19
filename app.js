// UI: Standard calculator, Casio fx-100MS emulator, mode switching, keyboard
// ---------- UI ----------
const $=i=>document.getElementById(i);
const S={am:'D',dm:'N',dn:1,mem:{A:0,B:0,C:0,D:0,E:0,F:0,X:0,Y:0,M:0},ans:0,E:[],c:0,sh:0,al:0,pd:0,hyp:0,mt:0,eq:0,bn:0,sm:0,sd:[],cm:0,pol:0,resC:null,dms:0,sl:0,menu:null,ins:1,hist:[],hi:0,res:null,err:null,done:0,fr:0,eng:0,imp:0,und:[],off:0,es:0,ri:0,fmo:null};
const KS=['SHIFT|||@SH|||cr','ALPHA|||@AL|||cr','PAD','MODE|CLR||@MODE|@CLR||cr','ON|||@ON|||cr',
'CALC|SOLVE|=|@CALC|@SOLVE|=|','∫dx|d/dx|:|@INT|@DIFF|:|','x⁻¹|x!|LOGIC|⁻¹|!|@LOGICA|','CONST|CONV|Log(|@CONST|@CONV|Log(|',
'a b/c|d/c||@AB|@DC||','√|∛||√(|∛(||','x²|x³||²|³||','^|ˣ√||^|ˣ√||','log|10ˣ||log(|10^(||','ln|eˣ||ln(|e^(||',
'(−)|∠|A|−|@ANG|A|','°′″|←DMS|B|@DMS|@TODMS|B|','hyp|BASE|C|@HYP|@BASEM|C|','sin|sin⁻¹|D|sin(|sin⁻¹(|D|','cos|cos⁻¹|E|cos(|cos⁻¹(|E|','tan|tan⁻¹|F|tan(|tan⁻¹(|F|',
'RCL|STO||@RCL|@STO||','ENG|←|i|@ENG|@ENGB|i|','(|arg||(|Arg(||',')|Abs|X|)|Abs(|X|',',|Conj|Y|,|Conj(|Y|','M+|M−|M|@MP|@MM|M|'];
const KN=['7|M|Σ(|7|ᴹ|Σ(|n','8|G||8|ᴳ||n','9|T|PREFIX|9|ᵀ|@PFX|n','DEL|INS|UNDO|@DEL|@INS|@UNDO|r','AC|OFF||@AC|@OFF||r','4|MAT|μ|4|@MAT|μ|n','5|VCT|m|5|@VCT|ᵐ|n','6|k||6|ᵏ||n','×|nPr|Int|×|nPr|Int(|n','÷|nCr|mod|÷|nCr|mod|n','1|S-SUM|f|1|@SSUM|ᶠ|n','2|S-VAR|p|2|@SVAR|ᵖ|n','3|DISTR|n|3|@REG|ⁿ|n','+|Pol(||+|@PLUS||n','−|Rec(||−|@MINUS||n','0|Rnd|Rnd(|0|Rnd(|Rnd(|n','·|Ran#|Ran#(|.|Ran#|Ran#(|n','EXP|π|e|ᴇ|π|e|n','Ans|DRG▶||Ans|@DRG||n','=|Re↔Im|%|@EXE|@REIM|%|n'];
const KM=[];
function mk(list,host){list.forEach(r=>{
 if(r=='PAD'){const d=document.createElement('div');d.className='pad';[['▲','@U','pu'],['◀','@L','pl'],['▶','@R','pr2'],['▼','@D','pd2']].forEach(([l,M,c])=>{const i=KM.length;KM.push({M});const b=document.createElement('button');b.className='pb '+c;b.textContent=l;b.setAttribute('aria-label','Replay '+l);b.onclick=()=>press(i);d.appendChild(b)});d.insertAdjacentHTML('beforeend','<i>REPLAY</i>');host.appendChild(d);return}
 const[l,sl,al,M,s,a,c]=r.split('|'),i=KM.length;KM.push({M,S:s,A:a});const b=document.createElement('button');b.className='ck '+(c||'');b.innerHTML=(sl?'<span class="s">'+sl+'</span>':'')+(al?'<span class="a">'+al+'</span>':'')+l;b.onclick=()=>press(i);if(M=='@SH')b.id='bSH';if(M=='@AL')b.id='bAL';host.appendChild(b)})}
mk(KS,$('g6'));mk(KN,$('g5'));
const CN=[['mp','1.672621777ᴇ−27'],['mn','1.674927351ᴇ−27'],['me','9.10938291ᴇ−31'],['mμ','1.883531475ᴇ−28'],['a0','5.2917721092ᴇ−11'],['h','6.62606957ᴇ−34'],['μN','5.05078353ᴇ−27'],['μB','9.27400968ᴇ−24'],['ħ','1.054571726ᴇ−34'],['α','7.2973525698ᴇ−3'],['re','2.8179403267ᴇ−15'],['λc','2.4263102389ᴇ−12'],['γp','2.675222005ᴇ8'],['λcp','1.32140985623ᴇ−15'],['λcn','1.3195909064ᴇ−15'],['R∞','10973731.568539'],['u','1.660538921ᴇ−27'],['μp','1.410606743ᴇ−26'],['μe','−9.2847643ᴇ−24'],['μn','−9.6623647ᴇ−27'],['μμ','−4.49044807ᴇ−26'],['F','96485.3365'],['e','1.602176565ᴇ−19'],['NA','6.02214129ᴇ23'],['k','1.3806488ᴇ−23'],['Vm','0.022413968'],['R','8.3144621'],['C0','299792458'],['C1','3.74177153ᴇ−16'],['C2','0.01438777'],['σ','5.670373ᴇ−8'],['ε0','8.854187817ᴇ−12'],['μ0','1.256637061ᴇ−6'],['Φ0','2.067833758ᴇ−15'],['g','9.80665'],['G0','7.7480917346ᴇ−5'],['Z0','376.730313461'],['t','273.15'],['G','6.67384ᴇ−11'],['atm','101325']];
const PR=[['in','cm',2.54],['ft','m',.3048],['yd','m',.9144],['mile','km',1.609344],['n mile','m',1852],['acre','m²',4046.8564224],['gal(US)','ℓ',3.785411784],['gal(UK)','ℓ',4.54609],['pc','km',3.08567782e13],['km/h','m/s',1/3.6],['oz','g',28.349523125],['lb','kg',.45359237],['atm','Pa',101325],['mmHg','Pa',133.322387415],['hp','kW',.74569987158],['kgf/cm²','Pa',98066.5],['kgf·m','J',9.80665],['lbf/in²','kPa',6.8947572932],['°F','°C',0],['J','cal',1/4.1855]];
const CVL=PR.flatMap(p=>[p[0]+'▶'+p[1],p[1]+'▶'+p[0]]);
function cv(n,v){const[a,,k]=PR[(n-1)>>1],r=(n-1)&1;const x=a=='°F'?(r?v*1.8+32:(v-32)/1.8):(r?v/k:v*k);return Number(x.toPrecision(15))}
const MP=['1:COMP 2:COMPLX','1:SD 2:REG 3:BASE','1:EQN 2:MAT 3:VCT','1:Deg 2:Rad 3:Gra','1:Fix 2:Sci 3:Norm','Disp<br>1:a b/c 2:d/c','Disp<br>1:EngON 2:EngOFF','Disp<br>1:a+bi 2:r∠θ'];
const MT={fix:'Fix 0~9?',sci:'Sci 1~9? (0=10)',norm:'Norm 1~2?',clr:'1:Mcl 2:Mode 3:All',bm:'1:DEC 2:HEX 3:BIN 4:OCT',lg:'1:and 2:or 3:xor 4:xnor 5:Not 6:Neg 7:Shl 8:Shr',eqt:'EQN 1:aX+bY=c 2:aX+bY+cZ=d 3:Quad 4:Cubic',mm:'1:Dim 2:Edit 3:MatA 4:MatB 5:MatC 6:MatAns 7:Det 8:Trn',vm:'1:Dim 2:Edit 3:VctA 4:VctB 5:VctC 6:VctAns 7:Dot 8:Abs 9:Ang',regm:'REG 1:Lin 2:Log 3:Exp 4:Pwr 5:Inv 6:Quad',drg:'DRG▶ 1:° 2:ʳ 3:ᵍ',ds:'DISTR 1:P( 2:Q( 3:R( 4:▶t'};
function mh(){const m=S.menu,t=m.t;
 if(t=='mode')return MP[m.p]+(m.m?'<br>'+m.m:'');
 if(t=='const')return'<div class="tb">'+CN.map((c,i)=>'<div>'+('0'+(i+1)).slice(-2)+' '+c[0]+'</div>').join('')+'</div>';
 if(t=='conv')return'<div class="tb">'+CVL.map((c,i)=>'<div>'+('0'+(i+1)).slice(-2)+' '+c+'</div>').join('')+'</div>';
 if(t=='ss'||t=='sv'||t=='rg')return SM(t).map((x,i)=>(i+1)+':'+x).join(' ');if(t=='calc')return S.E.join('');return MT[t]}
function mo(){const m=S.menu;return m.t=='calc'?m.v+'='+m.b+'_':(m.t=='const'||m.t=='conv')?'<small>'+(m.t=='const'?'CONST':'CONV')+' '+m.b+'_</small>':''}
function setBase(b){const w=S.bn;S.eq=0;S.mt=0;S.vc=0;S.bn=b;S.sm=0;S.cm=0;S.pol=0;S.sd=[];S.menu=null;S.err=null;S.sl=0;S.resC=null;S.fr=0;S.eng=0;S.dms=0;if(!(S.done&&S.res!=null&&w)){S.E=[];S.c=0;S.res=null;S.done=0}}
function setStat(m){S.eq=0;S.mt=0;S.vc=0;S.bn=0;S.sm=m;S.sd=[];S.cm=0;S.pol=0;S.menu=null;S.E=[];S.c=0;S.res=null;S.resC=null;S.err=null;S.done=0;S.sl=0}
function SM(t){const r=S.sm!='SD';return t=='ss'?['Σx²','Σx','n'].concat(r?['Σy²','Σy','Σxy']:[]):t=='sv'?['x\u0304','xσn','xσn−1'].concat(r?['y\u0304','yσn','yσn−1']:[]):S.sm=='QUAD'?['ᴀ','ʙ','ᴄ','y\u0302(']:['ᴀ','ʙ','r','x\u0302(','y\u0302(']}
function statEdit(del){if(S.done||!S.E.length)throw'Syntax ERROR';const g=[[]];let d=0;
 S.E.forEach(t=>{if(t==','&&!d){g.push([]);return}if(t=='('||t.endsWith('('))d++;else if(t==')')d--;g[g.length-1].push(t)});
 const rg=S.sm!='SD',v=g.map(s=>calc(s.join(''),S).v),nd=rg?2:1;if(v.length<nd||v.length>nd+1)throw'Syntax ERROR';
 const x=v[0],y=rg?v[1]:0,f=v.length>nd?v[nd]:1;if(!(f>=1&&Number.isInteger(f)))throw'Math ERROR';
 if(del){const m=S.sd.filter(q=>q.x==x&&q.y==y);if(m.reduce((s,q)=>s+q.f,0)<f)throw'Math ERROR';let r=f;for(let i=S.sd.length-1;i>=0&&r>0;i--){const q=S.sd[i];if(q.x!=x||q.y!=y)continue;const k=Math.min(q.f,r);q.f-=k;r-=k}S.sd=S.sd.filter(q=>q.f>0)}else S.sd.push({x,y,f});
 S.E=[];S.c=0;S.res=S.sd.reduce((s,q)=>s+q.f,0);S.sl='n';S.done=1;S.err=null;S.resC=null;S.fr=0;S.eng=0;S.dms=0}
function cur(){return S.E.length&&!S.done?calc(S.E.join(''),S).v:S.ans}
function snap(){S.und.push([S.E.slice(),S.c]);if(S.und.length>60)S.und.shift()}
function ins(t){if(S.bn&&!bok(t,S.bn))return;snap();
if(S.hyp&&/^(sin|cos|tan)/.test(t)){t=t.replace(/^(sin|cos|tan)/,'$1h');S.hyp=0}
 S.err=null;S.res=null;
 if(S.done){S.done=0;S.fr=0;S.eng=0;S.dms=0;S.sl=0;S.resC=null;if(/^(?:[+−×÷^²³!%]|⁻¹|ˣ√|nPr|nCr|mod|ᵒ|ʳ|ᵍ|▶r∠θ|▶a\+bi|and|or|xor|xnor|Dot)/.test(t)){S.E=[S.vc&&S.vc.show?'VctAns':'Ans'];S.c=1}else{S.E=[];S.c=0}}
 if(S.ins)S.E.splice(S.c,0,t);else S.E.splice(S.c,1,t);S.c++;S.hi=S.hist.length}
function load(){S.E=S.hist[S.hi].slice();S.c=S.E.length;S.done=0;S.res=null;S.err=null}
function cmd(a){
 switch(a){
 case'@L':if(S.done){S.done=0;S.res=null;S.c=S.E.length}else S.c=Math.max(0,S.c-1);S.err=null;break;
 case'@R':if(S.done){S.done=0;S.res=null;S.c=0}else S.c=Math.min(S.E.length,S.c+1);S.err=null;break;
 case'@U':if(S.hist.length){if(S.hi>0)S.hi--;load()}break;
 case'@D':if(S.hi<S.hist.length-1){S.hi++;load()}break;
 case'@DEL':if(S.done){S.done=0;S.res=null;S.c=S.E.length}if(S.c>0){snap();S.E.splice(S.c-1,1);S.c--}S.err=null;break;
 case'@UNDO':if(S.und.length){const u=S.und.pop();S.E=u[0];S.c=u[1];S.done=0;S.res=null;S.resC=null;S.err=null}break;
 case'@OFF':S.off=1;S.menu=null;S.sh=S.al=0;break;
 case'@INS':S.ins^=1;break;
 case'@AC':S.und=[];S.ri=0;S.E=[];S.c=0;S.res=null;S.err=null;S.done=0;S.fr=0;S.eng=0;S.dms=0;S.sl=0;S.resC=null;S.hyp=0;S.hi=S.hist.length;break;
 case'@MODE':S.menu={t:'mode',p:0,m:''};break;case'@CLR':S.menu={t:'clr'};break;case'@ON':S.off=0;return cmd('@AC');
 case'@CONST':S.menu={t:'const',b:''};break;case'@CONV':S.menu={t:'conv',b:''};break;case'@DC':S.imp^=1;break;
 case'@INT':ins('∫(');break;case'@DIFF':ins('d/dx(');break;
 case'@CALC':{if(!S.E.length||S.done)break;const vs=[...new Set(S.E.filter(q=>/^[A-FXYM]$/.test(q)))];if(!vs.length)return cmd('@EXE');S.menu={t:'calc',vs,i:0,v:vs[0],b:''};break}
 case'@HYP':S.hyp=1;break;case'@STO':S.pd='STO';break;case'@RCL':S.pd='RCL';break;
 case'@MP':case'@MM':{if(S.sm){statEdit(a=='@MM');break}const v=cur();S.mem.M=Number((S.mem.M+(a=='@MP'?v:-v)).toPrecision(15));S.ans=v;S.res=v;S.done=1;S.err=null;break}
 case'@TODMS':if(S.res!=null&&S.done)S.dms^=1;break;
 case'@SOLVE':{if(!S.E.length||S.done)break;if(S.E.filter(q=>q=='=').length!=1)throw'Syntax ERROR';const vs=[...new Set(S.E.filter(q=>/^[A-FXYM]$/.test(q)))];if(!vs.length)throw'Syntax ERROR';S.menu={t:'calc',vs,i:0,v:vs[0],b:'',sv:1};break}
 case'@SLV':{const q=S.E.join('').split('='),vs=[...new Set(S.E.filter(z=>/^[A-FXYM]$/.test(z)))],tv=vs.includes('X')?'X':vs[0],g=x=>{const st={...S,mem:{...S.mem,[tv]:x}};return calc(q[0],st).v-calc(q[1],st).v},r=slv(g,S.mem[tv]);S.mem[tv]=r;S.ans=r;S.res=r;S.done=1;S.err=null;S.fr=0;S.eng=0;S.dms=0;S.sl=tv;if(!S.hist.length||S.hist[S.hist.length-1].join('')!=q.join('='))S.hist.push(S.E.slice());S.hi=S.hist.length;break}
 case'@SSUM':case'@SVAR':case'@REG':{if(!S.sm)throw'Syntax ERROR';if(a=='@REG'&&S.sm=='SD'){S.menu={t:'ds'};break}S.menu={t:{'@SSUM':'ss','@SVAR':'sv','@REG':'rg'}[a]};break}
 case'@LOGIC':case'@BASEM':if(!S.bn)throw'Syntax ERROR';S.menu={t:a=='@LOGIC'?'lg':'bm'};break;
 case'@VCT':if(!S.vc)throw'Syntax ERROR';S.menu={t:'vm'};break;
 case'@MAT':if(!S.mt)throw'Syntax ERROR';S.menu={t:'mm'};break;
 case'@ENG':if(S.cm&&S.resC&&S.done)S.pol^=1;else if(S.res!=null)S.eng++;break;
 case'@ENGB':if(S.res!=null&&!S.cm)S.eng--;break;
 case'@ANG':if(S.cm)ins('∠');else if(S.bn)cmd('@LOGIC');break;
 case'@LOGICA':if(S.bn)cmd('@LOGIC');break;
 case'@PLUS':ins(S.cm?'▶r∠θ':'Pol(');break;
 case'@MINUS':ins(S.cm?'▶a+bi':'Rec(');break;
 case'@REIM':if(S.cm&&S.resC&&S.done)S.ri^=1;break;
 case'@DRG':S.menu={t:'drg'};break;
 case'@PFX':S.es^=1;break;
 case'@AB':if(S.done&&S.res!=null)S.fr^=1;else ins('⌟');break;
 case'@DMS':{const t=S.E.slice(0,S.c).join('');ins(/°\d+$/.test(t)?'′':/′\d+$/.test(t)?'″':'°');break}
 case'@EXE':{if(!S.E.length)break;const s=S.E.join(''),ev=S.vc?vcalc:S.mt?mcalc:S.bn?bcalc:S.cm?cplx:calc,r=multi(ev,s);S.fmo=r.fm!=null?r.fm:null;S.ri=0;S.ans=r.v;S.ansC=r.c||null;S.resC=r.c||null;S.res=r.v;S.fr=r.f?1:0;S.eng=0;S.dms=0;S.sl=0;S.err=null;S.done=1;if(!S.hist.length||S.hist[S.hist.length-1].join('')!=s)S.hist.push(S.E.slice());if(S.hist.length>40)S.hist.shift();S.hi=S.hist.length;break}
 }}
function multi(f,s){if(!s.includes(':'))return f(s,S);const a0=S.ans,c0=S.ansC;let r;try{for(const q of s.split(':')){if(!q)continue;r=f(q,S);S.ans=r.v;S.ansC=r.c||null}}catch(e){S.ans=a0;S.ansC=c0;throw e}if(!r)throw'Syntax ERROR';return r}
function act(a){if(S.off&&a!='@ON')return;try{if(S.eq)eqKeyA(a);else if(S.mt&&mtKeyA(a));else if(S.vc&&vcKeyA(a));else if(a[0]=='@')cmd(a);else ins(a)}catch(e){S.err=typeof e=='string'?e:'Syntax ERROR';S.done=0}R()}
function menuKey(k){const m=k.M,d=/^\d$/.test(m)?+m:-1,M=S.menu,t=M.t;
 if(m=='@AC'){S.menu=null;return R()}
 if(t=='mode'){if(m=='@MODE')M.p=(M.p+1)%8;
  else if(M.p==3&&d>=1&&d<=3){S.am='DRG'[d-1];S.menu=null}
  else if(M.p==4&&d>=1&&d<=3)S.menu={t:['fix','sci','norm'][d-1]};
  else if(M.p==5&&(d==1||d==2)){S.imp=d-1;S.menu=null}
  else if(M.p==6&&(d==1||d==2)){S.es=d==1?1:0;S.menu=null}
  else if(M.p==7&&(d==1||d==2)){S.pol=d==2?1:0;S.menu=null}
  else if(M.p==0&&(d==1||d==2)){S.cm=d-1;S.eq=0;S.mt=0;S.vc=0;S.bn=0;S.sm=0;S.sd=[];S.pol=0;S.menu=null;S.E=[];S.c=0;S.res=null;S.resC=null;S.err=null;S.done=0}
  else if(M.p==2&&d==1)S.menu={t:'eqt'}
  else if(M.p==2&&d==2)startMat()
  else if(M.p==2&&d==3)startVct()
  else if(M.p==1&&d==3)setBase('DEC')
  else if(M.p==1&&(d==1||d==2)){if(d==1)setStat('SD');else S.menu={t:'regm'}}
  else if(M.p<3&&d>=1)M.m='Not available yet'}
 else if(t=='drg'&&d>=1&&d<=3){S.menu=null;ins(['ᵒ','ʳ','ᵍ'][d-1])}
 else if(t=='ds'&&d>=1&&d<=4){S.menu=null;ins(['P(','Q(','R(','▶t('][d-1])}
 else if(t=='regm'&&d>=1&&d<=6)setStat(['LIN','LOG','EXP','PWR','INV','QUAD'][d-1])
 else if((t=='ss'||t=='sv'||t=='rg')&&d>=1&&d<=SM(t).length){const k=SM(t)[d-1];S.menu=null;ins(k)}
 else if(t=='bm'&&d>=1&&d<=4)setBase(['DEC','HEX','BIN','OCT'][d-1])
 else if(t=='lg'&&d>=1&&d<=8){S.menu=null;ins(LG[d-1])}
 else if(t=='eqt'&&d>=1&&d<=4)startEq(['L2','L3','Q','C'][d-1])
 else if(t=='vm'&&d>=1&&d<=9){S.menu=null;if(d<=2){S.vc.ph=d==1?'pickD':'pickE';S.vc.b=[]}else ins(['VctA','VctB','VctC','VctAns','Dot','Abs(','Ang('][d-3])}
 else if(t=='mm'&&d>=1&&d<=8){S.menu=null;if(d<=2){S.mt.ph=d==1?'pickD':'pickE';S.mt.b=[]}else ins(['MatA','MatB','MatC','MatAns','Det(','Trn('][d-3])}
 else if(t=='fix'&&d>=0){S.dm='F';S.dn=d;S.menu=null}
 else if(t=='sci'&&d>=0){S.dm='S';S.dn=d||10;S.menu=null}
 else if(t=='norm'&&(d==1||d==2)){S.dm='N';S.dn=d;S.menu=null}
 else if(t=='clr'&&d>=1&&d<=3){if(d!=2){Object.keys(S.mem).forEach(x=>S.mem[x]=0);S.sd=[]}if(d>=2){S.cm=0;S.eq=0;S.mt=0;S.vc=0;S.bn=0;S.sm=0;S.am='D';S.dm='N';S.dn=1}if(d==3){S.ans=0;S.hist=[];S.E=[];S.c=0;S.res=null;S.err=null;S.done=0}S.menu=null}
 else if((t=='const'||t=='conv')&&d>=0){M.b+=d;if(M.b.length==2){const n=+M.b;if(n<1||n>40)M.b='';else{S.menu=null;try{if(t=='const')ins(CN[n-1][1]);else{const v=cv(n,cur());S.ans=v;S.res=v;S.done=1;S.err=null}}catch(e){S.err=typeof e=='string'?e:'Syntax ERROR'}}}}
 else if(t=='calc'){if(d>=0||m=='.'||m=='−')M.b+=d>=0?d:m=='.'?'.':'-';else if(m=='@DEL')M.b=M.b.slice(0,-1);
  else if(m=='@EXE'){const x=parseFloat(M.b);if(isNaN(x))return;S.mem[M.v]=x;M.i++;if(M.i<M.vs.length){M.v=M.vs[M.i];M.b=''}else{const sv=M.sv;S.menu=null;act(sv?'@SLV':'@EXE');return}}}
 R()}
function press(i){const k=KM[i];if(S.off){if(k.M=='@ON'){S.off=0;S.sh=S.al=0;cmd('@AC')}return R()}if(S.menu)return menuKey(k);
 if(k.M=='@SH'){S.sh^=1;S.al=0;return R()}if(k.M=='@AL'){S.al^=1;S.sh=0;return R()}
 if(S.pd){const p=S.pd,a=k.A;S.pd=0;S.sh=S.al=0;if(/^[A-FXYM]$/.test(a)){try{if(p=='STO')S.mem[a]=cur();else ins(a)}catch(e){S.err=typeof e=='string'?e:'Syntax ERROR'}}return R()}
 const a=S.sh?k.S:S.al?k.A:k.M,bk=S.bn&&!S.sh&&({'²':'DEC','^':'HEX','log(':'BIN','ln(':'OCT'})[k.M];S.sh=S.al=0;if(bk){setBase(bk);return R()}if(!a)return R();act(a)}
function R(){
 const A=(i,o)=>$(i).classList.toggle('on',!!o);
 A('aS',S.sh);A('aA',S.al);A('aM',S.mem.M!=0);A('aH',S.hyp);A('aT',S.pd=='STO');A('aR',S.pd=='RCL');A('aD',S.am=='D');A('aRa',S.am=='R');A('aG',S.am=='G');A('aF',S.dm=='F');A('aSc',S.dm=='S');A('aE',S.eng||S.es);A('aI',!S.ins);A('aC',S.cm);A('aSD',S.sm);A('aBN',S.bn);A('aEQ',S.eq);A('aMT',S.mt);A('aVC',S.vc);$('aBN').textContent=S.bn||'BASE';$('aSD').textContent=S.sm&&S.sm!='SD'?'REG':'SD';
 $('bSH').classList.toggle('act',!!S.sh);$('bAL').classList.toggle('act',!!S.al);
 const L=$('l1'),O=$('l2');
 if(S.off){L.innerHTML='';O.innerHTML='';document.querySelectorAll('.ann span').forEach(e=>e.classList.remove('on'));return}
 if(S.menu){L.innerHTML=mh();O.innerHTML=mo();return}
 if(S.eq){eqR();return}
 if(S.mt&&S.mt.ph!='calc'){mtR();return}
 if(S.vc&&S.vc.ph!='calc'){vcR();return}
 const cu='<span class="cu'+(S.ins?'':' ov')+'"></span>';let h='';
 S.E.forEach((t,i)=>{if(!S.done&&i==S.c)h+=cu;h+=DSP[t]||t});if(!S.done&&S.c>=S.E.length)h+=cu;
 L.innerHTML=h;const c=L.querySelector('.cu');L.scrollLeft=c?Math.max(0,c.offsetLeft-L.clientWidth+30):0;
 O.innerHTML=S.err?'<span class="er">'+S.err+'</span>':S.res!=null&&S.vc&&S.vc.show&&S.done?vwrap(S.vc.ans):S.res!=null&&S.bn?bwrap(S.res,S.bn)+(S.bn=='DEC'?'.':'')+BI():S.res!=null&&S.cm&&S.resC?cfmt(S.resC,{...S,pol:S.fmo!=null?S.fmo:S.pol}):S.res!=null?(S.sl?'<small>'+S.sl+'=</small>':'')+(S.dms?dms(S.res):S.fr&&frac(S.res,S.imp)||(S.es&&!S.eng&&S.dm=='N'?engSym(S.res):dot(fmt(S.res,S)))):(S.bn?'0'+BI():'0.')}
function BI(){return'<sup style="font-size:.45em;margin-left:.2em">'+{DEC:'d',HEX:'H',BIN:'b',OCT:'o'}[S.bn]+'</sup>'}
function dot(x){return/^-?\d+$/.test(x)?x+'.':x}
// ---------- STANDARD ----------
const T={t:'',prev:'',eq:0,h:[]};
const sf=v=>{const n=Number(v.toPrecision(12));return Math.abs(n)>=1e15||(n!=0&&Math.abs(n)<1e-9)?n.toExponential(6):n.toLocaleString('en-US',{maximumFractionDigits:12})};
const ex=v=>{let s=String(Number(v.toPrecision(12)));return s.replace('e+','ᴇ').replace('e-','ᴇ−').replace(/^-/,'−')};
function sR(err){
 $('sx').textContent=T.eq?T.prev+' =':T.t;let v=T.t||'0';
 if(err)v=err;else if(T.eq)v=sf(calc(T.t,{am:'D',ans:0,mem:S.mem}).v);
 else{try{if(/[+−×÷%]/.test(T.t.slice(1))&&!/[+−×÷]$/.test(T.t))v=sf(calc(T.t,{am:'D',ans:0,mem:S.mem}).v)}catch(e){}}
 $('sv').textContent=v;
 $('hl').innerHTML=T.h.slice(0,8).map(x=>'<li><span>'+x[0]+'</span><b>'+x[1]+'</b></li>').join('')}
function sP(x){let err='';try{
 if(/^[\d.]$/.test(x)){if(T.eq){T.t='';T.eq=0}if(x=='.'&&(T.t.match(/[\d.]*$/)[0]).includes('.'))return;T.t+=x}
 else if('+−×÷'.includes(x)){if(T.eq)T.eq=0;if(!T.t){if(x=='−')T.t='−';return sR()}if(/[+−×÷]$/.test(T.t)){if(T.t.length>1)T.t=T.t.slice(0,-1)+x}else T.t+=x}
 else if(x=='AC'){T.t='';T.eq=0;T.prev=''}
 else if(x=='⌫'){if(T.eq){T.eq=0;T.t='';}else T.t=T.t.slice(0,-1)}
 else if(x=='±'){if(T.eq)T.eq=0;if(/\(−[\d.]+\)$/.test(T.t))T.t=T.t.replace(/\(−([\d.]+)\)$/,'$1');else if(/[\d.]$/.test(T.t)){if(/^[\d.]+$/.test(T.t))T.t='−'+T.t;else if(/^−[\d.]+$/.test(T.t))T.t=T.t.slice(1);else T.t=T.t.replace(/([\d.]+)$/,'(−$1)')}}
 else if(x=='%'){if(T.eq)T.eq=0;const m=T.t.match(/^(.*[^\d.])([+−])([\d.]+)$/);if(m){const b=calc(m[1].replace(/[+−×÷]$/,''),{am:'D',ans:0,mem:S.mem}).v;if(m[1].slice(-1)=='+'||m[1].slice(-1)=='−')T.t=m[1]+ex(b*parseFloat(m[3])/100);else T.t+='%'}else if(/[\d.]$/.test(T.t))T.t+='%'}
 else if(x=='='){if(!T.t||T.eq)return;const v=calc(T.t,{am:'D',ans:0,mem:S.mem}).v;T.h.unshift([T.t,sf(v)]);T.prev=T.t;T.t=ex(v);T.eq=1}
 }catch(e){err=typeof e=='string'?e:'Error';T.t='';T.eq=0}
 sR(err)}
(function(){const g=$('sg');[['AC','⌫','%','÷'],['7','8','9','×'],['4','5','6','−'],['1','2','3','+'],['±','0','.','=']].flat().forEach(x=>{const b=document.createElement('button');b.textContent=x;if('÷×−+%⌫AC'.includes(x)||x=='AC')b.className='op';if(x=='=')b.className='eq';b.onclick=()=>sP(x);g.appendChild(b)})})();
// ---------- MODE SWITCH + KEYBOARD ----------
let mode='std';
const NT={std:'Keyboard works here. Percent: 200 + 10% = 220.',sci:'fx-100MS style: SHIFT (gold) / ALPHA (red), MODE (press repeatedly for pages), CONST and Shift+CONST (CONV) then a two-digit number, CALC, ∫dx. MAT: MODE ×2 then 2; SHIFT+4 (MAT) → Dim/Edit/MatA/MatB/MatC/MatAns/Det/Trn; x⁻¹ inverts, x² squares, ^n powers, = evaluates, ▲▼◀▶ browse a matrix result. EQN: MODE ×2 then 1, pick type, enter each coefficient then =; = / ▼ next root, ▲ previous, AC to edit coefficients. BASE: MODE 1 then 3 (starts DEC); x² / ^ / log / ln pick DEC/HEX/BIN/OCT (SHIFT+hyp also works), ALPHA+A…F types hex digits, SHIFT+(−) (LOGIC) inserts and/or/xor/xnor/Not/Neg/Shl/Shr. SD/REG: MODE 1 then 1 (SD) or 2 (REG, then pick Lin…Quad); type x (or x,y; add ,freq) then M+ to add, SHIFT+M+ to delete; SHIFT+1 S-SUM, SHIFT+2 S-VAR, SHIFT+3 REG insert results. CMPLX: MODE 1 then 2; ALPHA+ENG types i, SHIFT+(−) types ∠ (polar input), SHIFT+( arg, SHIFT+) Abs, SHIFT+, Conj, SHIFT++ ▶r∠θ, SHIFT+− ▶a+bi, SHIFT+= Re↔Im, ENG toggles rectangular ↔ polar result. SOLVE: type an equation using ALPHA+CALC for “=”, press SHIFT+CALC, enter a starting guess and other values. SHIFT+° ′ ″ (←DMS) toggles the result between decimal and degrees-minutes-seconds.',cur:'',uni:'',loan:'',bmi:'Informational only – not medical advice.',dat:'',pct:'',bas:'',sta:'',sol:''};
function setMode(m){mode=m;document.querySelectorAll('.dev>section').forEach(s=>s.hidden=s.id!=m);document.querySelectorAll('#tabs button').forEach(b=>{b.classList.toggle('on',b.dataset.m==m);b.setAttribute('aria-pressed',b.dataset.m==m)});$('note').textContent=NT[m]||''}
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>setMode(b.dataset.m));
const KB={Enter:'@EXE','=':'@EXE',Backspace:'@DEL',Escape:'@AC',ArrowLeft:'@L',ArrowRight:'@R',ArrowUp:'@U',ArrowDown:'@D','+':'+','-':'−','*':'×','/':'÷','(':'(',')':')','^':'^','!':'!','%':'%','.':'.',p:'π',i:'i'};
addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||(mode!='std'&&mode!='sci'))return;const k=e.key;
 if(mode=='std'){const m={'*':'×','/':'÷','-':'−',Enter:'=',Backspace:'⌫',Escape:'AC'},x=m[k]||k;if(/^[\d.+−×÷%=]$|^⌫$|^AC$/.test(x)){e.preventDefault();sP(x)}}
 else{const a=/^\d$/.test(k)?k:KB[k];if(!a)return;e.preventDefault();if(S.menu){const i=KM.findIndex(q=>q.M==a);if(i>=0)menuKey(KM[i]);return}S.sh=S.al=0;act(a)}});
R();sR();
