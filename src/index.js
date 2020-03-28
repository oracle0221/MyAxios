import axios from './axios';

(async ()=>{
  let {data}=await axios('/data/1.json');

  console.log(data);
})();

//
// Axios.interceptors.request.use(function (config){
//   config.headers.i=999999;
//   return config;
// });
//
// Axios.interceptors.response.use(function (res){
//   return res.data;
// });
//
// // Axios.default.transformRequest=config=>{
// //   config.headers.token=6;
// //
// //   return config;
// // };
// //
// (async ()=>{
//   let res=await Axios('data/1.json', {
//     // baseUrl: 'http://www.zhinengshe.com/',
//     headers: {
//       a: 12,
//       b: 'asdf sdfa ; : dfasdewrrt'
//     }
//   });
//
//   console.log(res);
// })();
// //
// //
// // Axios('data/1.json', {
// //   headers: {
// //     a: 12,
// //     b: 'asdf sdfa ; : dfasdewrrt'
// //   }
// // }).then(data=>{
// //   console.log(data);
// // });
