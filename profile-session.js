(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SignatureProfiles=factory();})(typeof window==='object'?window:this,function(){
  const validId=id=>typeof id==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id);
  const textKeys=['name','title','photo','phonePrimary','phoneSecondary','email','website','x','linkedin','instagram','youtube','headlinePrimary','headlineSecondary'];
  const booleanKeys=['xEnabled','linkedinEnabled','instagramEnabled','youtubeEnabled'];
  function clean(value){
    if(!value||typeof value!=='object'||!value.profiles||typeof value.profiles!=='object')return null;
    const profiles={};
    for(const brand of ['fiveminder','vidaloops']){
      const source=value.profiles[brand];if(!source||typeof source.values!=='object')continue;
      const values={};for(const key of textKeys)if(typeof source.values[key]==='string')values[key]=source.values[key].slice(0,key==='photo'?4096:1000);
      for(const key of booleanKeys)if(typeof source.values[key]==='boolean')values[key]=source.values[key];
      // Never carry a device-local preview image into a portable profile.
      if(values.photo&&!/^https:\/\//i.test(values.photo))values.photo='';
      profiles[brand]={values,logo:typeof source.logo==='string'?source.logo.slice(0,200):''};
    }
    if(!Object.keys(profiles).length)return null;
    return {selected:value.selected==='vidaloops'?'vidaloops':'fiveminder',profiles,updatedAt:Number.isFinite(value.updatedAt)?value.updatedAt:0};
  }
  function encode(value){const cleanValue=clean(value);if(!cleanValue)throw new Error('No profile');const bytes=new TextEncoder().encode(JSON.stringify(cleanValue));return btoa(Array.from(bytes,b=>String.fromCharCode(b)).join('')).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
  function decode(value){try{if(typeof value!=='string'||value.length>32000||!/^[\w-]+$/.test(value))return null;const bytes=Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));return clean(JSON.parse(new TextDecoder().decode(bytes)));}catch{return null;}}
  function fromHash(hash){const params=new URLSearchParams(hash.replace(/^#/,'')),id=params.get('profile');return validId(id)?{id,data:decode(params.get('data'))}:null;}
  function newest(local,linked){const a=clean(local),b=clean(linked);return a&&(!b||a.updatedAt>=b.updatedAt)?a:b;}
  function link(base,id,data){if(!validId(id))throw new Error('Invalid profile ID');const url=new URL(base);url.hash=new URLSearchParams({profile:id,data:encode(data)}).toString();return url.href;}
  return {validId,clean,encode,decode,fromHash,newest,link};
});
