// Selecting a photo prepares and publishes it; credentials stay on Cloudflare.
window.FiveMinderPhoto = {
  async upload(file,endpoint,onProgress) {
    if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>10*1024*1024)throw new Error('Choose a PNG, JPEG or WebP photo smaller than 10 MB.');
    onProgress('Preparing photo…');
    const objectUrl=URL.createObjectURL(file);let png;
    try {
      const image=new Image();image.src=objectUrl;await image.decode();
      const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
      const context=canvas.getContext('2d');context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';
      const side=Math.min(image.naturalWidth,image.naturalHeight);
      context.drawImage(image,(image.naturalWidth-side)/2,(image.naturalHeight-side)/2,side,side,0,0,512,512);
      png=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
      if(!png||png.size>1024*1024)throw new Error('That photo could not be prepared. Try another image.');
    }finally{URL.revokeObjectURL(objectUrl);}
    onProgress('Uploading photo…');
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'image/png'},body:png,signal:AbortSignal.timeout(30000)});
    const result=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(result.error||'The upload could not finish. Please try again.');
    const url=new URL(result.url);
    if(url.protocol!=='https:'||url.origin!==new URL(endpoint).origin||!/^\/profile-images\/[a-f0-9]{64}\.png$/.test(url.pathname))throw new Error('Photo hosting returned an invalid image URL.');
    onProgress('Checking published photo…');
    // KV may need time to propagate. Never copy a signature until its public photo actually loads.
    for(let attempt=0;attempt<16;attempt++) {
      const image=new Image();image.src=url.href;let timer;
      try {await Promise.race([image.decode(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Image load timeout')),4000);})]);return url.href;}
      catch {if(attempt===15)throw new Error('Your photo was uploaded, but is still becoming available. Choose the photo again in a minute.');await new Promise(resolve=>setTimeout(resolve,4000));}
      finally{clearTimeout(timer);}
    }
  }
};
