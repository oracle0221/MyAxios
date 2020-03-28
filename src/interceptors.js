import {assert} from './common';

export default class Interceptors{
  constructor(){
    this._list=[];
  }

  use(fn){
    this._list.push(fn);
  }

  list(){
    return this._list;
  }
}
