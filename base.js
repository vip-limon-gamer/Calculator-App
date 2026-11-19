// BASE-N mode: 32-bit two's complement integers, logic ops, shifts (needs RE from engine.js)
const LG=['and','or','xor','xnor','Not(','Neg(','Shl(','Shr('],BR={DEC:10,HEX:16,BIN:2,OCT:8};
function bcalc(s,st){const T=s.match(RE)||[];let p=0;const pk=()=>T[p],nx=()=>T[p++],ER=()=>{throw'Math ERROR'},SE=()=>{throw'Syntax ERROR'};
 if(T.join('')!==s)SE();const B=BR[st.bn],MX=2n**31n-1n,MN=-(2n**31n),u=x=>BigInt.asUintN(32,x),g=x=>BigInt.asIntN(32,x),ck=x=>{if(x>MX||x<MN)ER();return x};
 const lit=neg=>{let d='';while(pk()&&/^[0-9A-F]+$/.test(pk()))d+=nx();let v=0n;for(const c of d){const k=parseInt(c,16);if(k>=B)SE();v=v*BigInt(B)+BigInt(k)}
  if(B==10){if(v>(neg?MX+1n:MX))ER();return v}if(v>0xFFFFFFFFn)ER();return g(v)};
 const lo=()=>{let v=an();while(pk()=='or'||pk()=='xor'||pk()=='xnor'){const o=nx(),r=an(),a=u(v),b=u(r);v=g(o=='or'?a|b:o=='xor'?a^b:~(a^b))}return v};
 const an=()=>{let v=ad();while(pk()=='and'){nx();v=g(u(v)&u(ad()))}return v};
 const ad=()=>{let v=mu();while(pk()=='+'||pk()=='−'){const o=nx(),r=mu();v=ck(o=='+'?v+r:v-r)}return v};
 const mu=()=>{let v=un();while(pk()=='×'||pk()=='÷'){const o=nx(),r=un();if(o=='÷'&&r==0n)ER();v=ck(o=='×'?v*r:v/r)}return v};
 const un=()=>{if(pk()=='−'){nx();if(B==10&&pk()&&/^[0-9A-F]+$/.test(pk()))return-lit(1);return ck(-un())}if(pk()=='+')nx();return pr()};
 const cl=()=>{if(pk()==')')nx()};
 const pr=()=>{const t=pk();if(t===undefined)SE();
  if(t=='Ans'){nx();const a=st.ans;if(!Number.isInteger(a))ER();return ck(BigInt(a))}
  if(t=='('){nx();const v=lo();cl();return v}
  if(t=='Not('){nx();const v=lo();cl();return g(~v)}
  if(t=='Neg('){nx();const v=lo();cl();return ck(-v)}
  if(t=='Shl('||t=='Shr('){nx();const a=lo();if(pk()!=',')SE();nx();const n=lo();cl();if(n<0n||n>31n)ER();return t=='Shl('?g(u(a)<<n):g(u(a)>>n)}
  if(/^[0-9A-F]+$/.test(t))return lit();SE()};
 const v=lo();if(p<T.length)SE();return{v:Number(v)}}
function bfmt(v,b){return b=='DEC'?String(v):BigInt.asUintN(32,BigInt(v)).toString(BR[b]).toUpperCase()}
function bwrap(v,b){const t=bfmt(v,b);return t.length>12?'<span style="font-size:'+(t.length>24?'1rem':'1.5rem')+'">'+t+'</span>':t}
function bok(t,b){if(/^[0-9A-F]$/.test(t))return parseInt(t,16)<BR[b];return/^(?:[+−×÷(),]|and|or|xor|xnor|Not\(|Neg\(|Shl\(|Shr\(|Ans)$/.test(t)}
if(typeof module!='undefined')module.exports={bcalc,bfmt};
