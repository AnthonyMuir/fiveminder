// Cloudflare Pages advanced mode. Only API and profile-image routes invoke this worker.
const MAX_BYTES = 1024 * 1024;
const IMAGE_PATH = /^\/profile-images\/([a-f0-9]{64})\.png$/;
function allowedOrigin(origin, url) {
  return origin === url.origin || origin === 'https://fiveminder.pages.dev' || origin === 'null' || /^http:\/\/(localhost|127\.0\.0\.1):8765$/.test(origin || '');
}
function cors(origin) {return {'Access-Control-Allow-Origin':origin,'Vary':'Origin','Cache-Control':'no-store'};}
function json(value,status=200,origin='') {return Response.json(value,{status,headers:origin?cors(origin):{'Cache-Control':'no-store'}});}
function validPng(bytes) {
  const signature=[137,80,78,71,13,10,26,10];
  if(bytes.length<45||!signature.every((v,i)=>bytes[i]===v))return false;
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  let pos=8, hasImage=false;
  while(pos+12<=bytes.length) {
    const length=view.getUint32(pos),type=String.fromCharCode(...bytes.subarray(pos+4,pos+8));
    if(length>MAX_BYTES||pos+12+length>bytes.length)return false;
    if(pos===8&&(type!=='IHDR'||length!==13||view.getUint32(pos+8)!==512||view.getUint32(pos+12)!==512))return false;
    if(type==='IDAT')hasImage=true;
    if(type==='IEND')return hasImage&&length===0&&pos+12===bytes.length;
    pos+=12+length;
  }
  return false;
}
export default {
  async fetch(request,env) {
    const url=new URL(request.url),origin=request.headers.get('Origin');
    if(url.pathname==='/api/photos') {
      if(!allowedOrigin(origin,url))return json({error:'Upload from the signature editor.'},403);
      if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...cors(origin),'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'86400'}});
      if(request.method!=='POST')return json({error:'Use POST.'},405,origin);
      if(!env.SIGNATURE_PHOTOS)return json({error:'Photo hosting is not configured yet.'},503,origin);
      if(request.headers.get('Content-Type')!=='image/png')return json({error:'Choose a PNG, JPEG or WebP in the editor.'},415,origin);
      if(Number(request.headers.get('Content-Length'))>MAX_BYTES)return json({error:'The prepared photo is too large.'},413,origin);
      try {
        const reader=request.body?.getReader(); if(!reader)return json({error:'No photo was received.'},400,origin);
        const chunks=[];let size=0;
        for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>MAX_BYTES){await reader.cancel();return json({error:'The prepared photo is too large.'},413,origin);}chunks.push(value);}
        const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
        if(!validPng(bytes))return json({error:'The photo must be a prepared 512-pixel PNG.'},400,origin);
        // Content-addressed images avoid duplicate writes and never overwrite existing email photos.
        const digest=await crypto.subtle.digest('SHA-256',bytes);
        const id=Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('');
        const key='photo:'+id;
        if(!await env.SIGNATURE_PHOTOS.get(key,'arrayBuffer')) {
          const ip=request.headers.get('CF-Connecting-IP')||'unknown';
          const ipDigest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip));
          const ipKey='limit:'+Array.from(new Uint8Array(ipDigest),v=>v.toString(16).padStart(2,'0')).join('')+':'+Math.floor(Date.now()/3600000);
          const count=Number(await env.SIGNATURE_PHOTOS.get(ipKey)||0);
          if(count>=10)return json({error:'Too many photo changes. Try again in an hour.'},429,origin);
          const stored=await env.SIGNATURE_PHOTOS.list({prefix:'photo:',limit:1000});
          if(stored.keys.length>=900||!stored.list_complete)return json({error:'Photo storage is full. Contact your team administrator.'},507,origin);
          await env.SIGNATURE_PHOTOS.put(ipKey,String(count+1),{expirationTtl:7200});
          await env.SIGNATURE_PHOTOS.put(key,bytes);
        }
        return json({url:new URL('/profile-images/'+id+'.png',url.origin).href},201,origin);
      } catch {return json({error:'Photo hosting is temporarily unavailable. Your previous photo is still saved. Please try again.'},503,origin);}
    }
    const match=url.pathname.match(IMAGE_PATH);
    if(match) {
      if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405});
      if(!env.SIGNATURE_PHOTOS)return new Response(null,{status:503,headers:{'Cache-Control':'no-store'}});
      try {
        const photo=await env.SIGNATURE_PHOTOS.get('photo:'+match[1],'arrayBuffer');
        if(!photo)return new Response(null,{status:404,headers:{'Cache-Control':'no-store'}});
        return new Response(request.method==='HEAD'?null:photo,{headers:{'Content-Type':'image/png','Cache-Control':'public, max-age=31536000, immutable','X-Content-Type-Options':'nosniff','Content-Length':String(photo.byteLength)}});
      }catch{return new Response(null,{status:503,headers:{'Cache-Control':'no-store'}});}
    }
    return env.ASSETS.fetch(request);
  }
};
