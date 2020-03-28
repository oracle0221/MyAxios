export default function request(options){
  //
  let xhr=new XMLHttpRequest();

  xhr.open(options.method, options.url, true);

  for(let name in options.headers){
    xhr.setRequestHeader(encodeURIComponent(name), encodeURIComponent(options.headers[name]));
  }

  xhr.send(options.data);

  return new Promise((resolve, reject)=>{
    xhr.onreadystatechange=function (){
      if(xhr.readyState==4){
        if(xhr.status>=200 && xhr.status<300){  //?
          resolve(xhr);
        }else{
          reject(xhr);
        }
      }
    };
  });
}
