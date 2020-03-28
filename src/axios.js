import defaultOptions from './default';
import request from './request';
import {assert, merge, clone} from './common';
const urllib=require('url');
import createResponse from './response';
import createError from './error';
import Interceptors from './interceptors';

class Axios{
  constructor(){
    let _this=this;

    this.interceptors={
      request: new Interceptors(),
      response: new Interceptors()
    };

    return new Proxy(request, {
      get(data, name){
        return _this[name];
      },
      set(data, name, val){
        _this[name]=val;

        return true;
      },
      apply(fn, thisArg, args){
        let options=_this._preprocessArgs(undefined, args);

        if(!options){
          if(args.length==2){
            assert(typeof args[0]=='string', 'args[0] must is string');
            assert(typeof args[1]=='object' && args[1] && args[1].constructor==Object, 'args[1] must is json');

            //...
            options={
              ...args[1],
              url: args[0],
            };
          }else{
            assert(false, 'invaild args');
          }
        }

        return _this.request(options);
      }
    });
  }

  request(options){
    let _headers=this.default.headers;
    delete this.default.headers;

    let result=clone(this.default);
    merge(result, this.default);
    merge(result, options);
    this.default.headers=_headers;

    options=result;

    //1.合并头
    let headers={};
    merge(headers, this.default.headers.common);
    merge(headers, this.default.headers[options.method.toLowerCase()]);
    merge(headers, options.headers);
    options.headers=headers;

    //2.检测参数是否正确
    checkOptions(options);

    //3.baseurl合并进来
    options.url=urllib.resolve(options.baseUrl, options.url);
    delete options.baseUrl;

    //4.变换一下请求
    const {transformRequest, transformResponse}=options;
    delete options.transformRequest;
    delete options.transformResponse;

    options=transformRequest(options);
    checkOptions(options);

    let list=this.interceptors.request.list();
    list.forEach(fn=>{
      options=fn(options);
      checkOptions(options);
    });

    //5.正式调用request(options)
    return new Promise((resolve, reject)=>{
      request(options).then(xhr=>{
        //包装结果
        let res=createResponse(xhr);
        res.data=transformResponse(res.data);

        let list=this.interceptors.response.list();
        list.forEach(fn=>{
          res=fn(res);
        });

        resolve(res);
      }, xhr=>{
        ///包装错误
        let err=createError(xhr);
        reject(err);
      });
    });

  }

  _preprocessArgs(method, args){
    let options;

    if(args.length==1 && typeof args[0]=='string'){
      options={method, url: args[0]};
    }else if(args.length==1 && args[0].constructor==Object){
      options={
        ...args[0],
        method
      }
    }else{
      return undefined;
    }

    return options;
  }

  get(...args){
    let options=this._preprocessArgs('get', args);

    if(!options){
      if(args.length==2){
        assert(typeof args[0]=='string', 'args[0] must is string');
        assert(typeof args[1]=='object' && args[1] && args[1].constructor==Object, 'args[1] must is json');

        //...
        options={
          ...args[1],
          url: args[0],
          method: 'get',
        };
      }else{
        assert(false, 'invaild args');
      }
    }

    return this.request(options);
  }
  post(...args){
    let options=this._preprocessArgs('post', args);

    if(!options){
      if(args.length==2){
        assert(typeof args[0]=='string', 'args[0] must is string');

        options={
          url: args[0],
          data: args[1],
          method: 'post',
        };
      }else if(args.length==3){
        assert(typeof args[0]=='string', 'args[0] must is string');
        assert(typeof args[2]=='object' && args[2] && args[2].constructor==Object, 'args[2] must is json');

        options={
          ...args[2],
          url: args[0],
          data: args[1],
          method: 'post',
        };
      }else{
        assert(false, 'invaild argments');
      }
    }

    return this.request(options);
  }
  delete(...args){
    let options=this._preprocessArgs('delete', args);

    if(!options){
      if(args.length==2){
        assert(typeof args[0]=='string', 'args[0] must is string');
        assert(typeof args[1]=='object' && args[1] && args[1].constructor==Object, 'args[1] must is json');

        //...
        options={
          ...args[1],
          url: args[0],
          method: 'delete',
        };
      }else{
        assert(false, 'invaild arguments');
      }
    }


    return this.request(options);
  }
}

Axios.create=Axios.prototype.create=function (options){
  let axios=new Axios();

  //default
  let res=clone(defaultOptions);
  merge(res, options);

  axios.default=res;

  return axios;
};













function checkOptions(options){
  assert(options, 'options is required');
  assert(options.method, 'no method');
  assert(typeof options.method=='string', 'method must be string');
  assert(options.url, 'no url');
  assert(typeof options.url=='string', 'url must be string');
}



export default Axios.create();
