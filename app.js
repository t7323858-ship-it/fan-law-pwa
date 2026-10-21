const initial = [
 {point:1,flow:0,pressure:59.3505852789,rpm:6615},
 {point:2,flow:8.6409021382,pressure:46.4684616934,rpm:6083},
 {point:3,flow:11.2849781796,pressure:41.1521211114,rpm:5781},
 {point:4,flow:17.5629270530,pressure:23.3224840149,rpm:5192},
 {point:5,flow:22.8504554771,pressure:0.1961343158,rpm:4857}
];
const defaultTargetBase = 4750;
let points = initial.map(p=>({...p,targetRpm:p.rpm*defaultTargetBase/initial[4].rpm}));
const $ = id => document.getElementById(id);
const fmt = (n,d=2) => Number.isFinite(n) ? n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d}) : '—';
const val = v => v === '' || v === null || v === undefined ? NaN : Number(v);
function renderRows(){
 $('dataRows').innerHTML = points.map((p,i)=>`<tr><td><b>${i+1}</b></td><td><input aria-label="點位${i+1}初始流量 Q CFM" data-i="${i}" data-field="flow" type="number" step="any" value="${Number.isFinite(p.flow)?p.flow:''}" class="source-input"></td><td><input aria-label="點位${i+1}初始靜壓 P mmAq" data-i="${i}" data-field="pressure" type="number" step="any" value="${Number.isFinite(p.pressure)?p.pressure:''}" class="source-input"></td><td><input aria-label="點位${i+1}初始轉速 N rpm" data-i="${i}" data-field="rpm" type="number" min="1" step="any" value="${Number.isFinite(p.rpm)?p.rpm:''}" class="source-input"></td><td><input aria-label="點位${i+1}目標轉速 rpm" data-i="${i}" data-field="targetRpm" type="number" min="1" step="any" value="${Number.isFinite(p.targetRpm)?Number(p.targetRpm.toFixed(2)):''}" class="target-rpm"></td><td class="pred" id="q${i}">—</td><td class="pred" id="p${i}">—</td><td class="pred" id="n${i}">—</td></tr>`).join('');
 $('pointCount').textContent = `${points.length} POINT${points.length===1?'':'S'}`;
 $('removePointBtn').disabled = points.length <= 1;
 $('dataRows').querySelectorAll('input').forEach(input=>input.addEventListener('input',e=>{const i=+e.target.dataset.i,field=e.target.dataset.field;points[i][field]=val(e.target.value);calculate();}));
 calculate();
}
function calculate(){
 const nr=val($('noiseRpm').value), nb=val($('noiseBase').value), noiseTarget=val($('noiseTargetRpm').value);
 $('noiseResult').textContent=nr>0&&noiseTarget>0&&Number.isFinite(nb)?fmt(nb+50*Math.log10(noiseTarget/nr),1):'—';
 points.forEach((p,i)=>{const target=val(p.targetRpm),baseRpm=val(p.rpm),flow=val(p.flow),pressure=val(p.pressure),ratio=target>0&&baseRpm>0?target/baseRpm:NaN;const q=$(`q${i}`),pr=$(`p${i}`),n=$(`n${i}`);if(!q)return;q.textContent=Number.isFinite(ratio)&&Number.isFinite(flow)?fmt(flow*ratio,2):'—';pr.textContent=Number.isFinite(ratio)&&Number.isFinite(pressure)?fmt(pressure*ratio*ratio,2):'—';n.textContent=Number.isFinite(target)&&target>0?fmt(target,0):'—';});
}
function summary(){let out='FAN LAW 推算摘要\n點位,初始流量Q(CFM),初始靜壓P(mmAq),初始轉速N(rpm),目標轉速(rpm),推算流量Q(CFM),推算靜壓P(mmAq),推算轉速N(rpm)\n';points.forEach((p,i)=>{const target=val(p.targetRpm),base=val(p.rpm),flow=val(p.flow),pressure=val(p.pressure),r=target>0&&base>0?target/base:NaN;out+=`${i+1},${p.flow??''},${p.pressure??''},${p.rpm??''},${p.targetRpm??''},${Number.isFinite(r)&&Number.isFinite(flow)?fmt(flow*r,2):'—'},${Number.isFinite(r)&&Number.isFinite(pressure)?fmt(pressure*r*r,2):'—'},${Number.isFinite(target)?fmt(target,0):'—'}\n`;});const nr=val($('noiseRpm').value),nb=val($('noiseBase').value),nt=val($('noiseTargetRpm').value);out+=`\n噪音基準：${nb} dB(A) @ ${nr} rpm\n噪音推算目標轉速：${nt} rpm\n噪音預估：${nr>0&&nt>0&&Number.isFinite(nb)?fmt(nb+50*Math.log10(nt/nr),1):'—'} dB(A)\n`;return out;}
$('resetBtn').addEventListener('click',()=>{points=initial.map(p=>({...p,targetRpm:p.rpm*defaultTargetBase/initial[4].rpm}));$('noiseBase').value=57;$('noiseRpm').value=4857;$('noiseTargetRpm').value=4750;renderRows();$('status').textContent='已還原 5 個範例 PQ 點位。';});
$('addPointBtn').addEventListener('click',()=>{points.push({flow:NaN,pressure:NaN,rpm:NaN,targetRpm:NaN});renderRows();$('status').textContent=`已新增第 ${points.length} 個 PQ 點位，請輸入初始 Q、P、N 與目標轉速。`;const inputs=$('dataRows').querySelectorAll('tr:last-child input');if(inputs[0])inputs[0].focus();});
$('removePointBtn').addEventListener('click',()=>{if(points.length<=1)return;const removed=points.length;points.pop();renderRows();$('status').textContent=`已刪除最後一個 PQ 點位（原第 ${removed} 點）。`;});
$('exportBtn').addEventListener('click',()=>{const csv='\ufeff'+summary();const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='FAN_LAW_result.csv';a.click();URL.revokeObjectURL(url);$('status').textContent='CSV 已匯出。';});
$('copyBtn').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(summary());$('status').textContent='結果摘要已複製。';}catch(e){$('status').textContent='此瀏覽器不允許直接複製，請使用「匯出 CSV」。';}});
['noiseBase','noiseRpm','noiseTargetRpm'].forEach(id=>$(id).addEventListener('input',calculate));
$('resetBtn').addEventListener('click',()=>{points=initial.map(p=>({...p,targetRpm:p.rpm*defaultTargetBase/initial[4].rpm}));$('noiseBase').value=57;$('noiseRpm').value=4857;$('noiseTargetRpm').value=4750;renderRows();calculate();$('status').textContent='已還原範例數據，可直接覆寫初始 PQN。';});
$('exportBtn').addEventListener('click',()=>{const csv='\ufeff'+summary();const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='FAN_LAW_result.csv';a.click();URL.revokeObjectURL(url);$('status').textContent='CSV 已匯出。';});
$('copyBtn').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(summary());$('status').textContent='結果摘要已複製。';}catch(e){$('status').textContent='此瀏覽器不允許直接複製，請使用「匯出 CSV」。';}});
renderRows();calculate();
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')) navigator.serviceWorker.register('./sw.js').catch(()=>{});
