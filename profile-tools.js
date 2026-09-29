(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.FiveMinderProfile=factory();})(typeof window==='object'?window:this,function(){
  const validRepo = value => /^[A-Za-z0-9_-][A-Za-z0-9_.-]*\/[A-Za-z0-9_.-]+$/.test(value) && !value.split('/').some(p=>p==='.'||p==='..');
  function repository(config,location){
    if(config.repository)return validRepo(config.repository)?config.repository:'';
    const match=location.hostname.match(/^([a-z0-9-]+)\.github\.io$/i);
    if(!match)return '';
    const project=location.pathname.split('/').filter(Boolean)[0];
    const repo=project && !project.includes('.') ? project : match[1]+'.github.io';
    return match[1]+'/'+repo;
  }
  function uploadUrl(repo,branch,directory){
    if(!validRepo(repo)||!directory||directory.split('/').some(p=>p==='.'||p==='..'||!p))return '';
    return 'https://github.com/'+repo+'/upload/'+encodeURIComponent(branch||'main')+'/'+directory.split('/').map(encodeURIComponent).join('/');
  }
  function photoFilename(name,stamp){
    const slug=String(name||'profile').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,50)||'profile';
    return 'fiveminder-'+slug+'-'+Number(stamp).toString(36)+'.png';
  }
  function isPublicHttps(value){
    try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password&&!/^(localhost|127\.|0\.|\[::1\])/.test(url.hostname);}catch{return false;}
  }
  return {repository,uploadUrl,photoFilename,isPublicHttps};
});
