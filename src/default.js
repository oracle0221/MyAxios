export default {
  baseUrl: '',
  method: 'get',
  headers: {
    common: {
      'X-Request-By': 'XMLHttpRequest',
    },
    get: {},
    post: {},
  },
  transformRequest(config){
    return config;
  },
  transformResponse(response){
    return JSON.parse(response);
  }
};
