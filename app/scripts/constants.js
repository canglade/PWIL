angular.module('pwilApp')

  .constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated'
  })

  .constant('SERVER', {
    url: 'http://localhost:3000/'
  })

  .constant('TAG', {
    length: 10
  })

  .constant('HISTORICAL', {
    length: 10
  })

  .constant('API_ENDPOINT', {
    url: 'http://localhost:3000/api'
  });
