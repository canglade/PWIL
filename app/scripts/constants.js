angular.module('pwilApp')

  .constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated'
  })

  .constant('SERVER', {
    url: 'http://localhost:3000/',
    ml: 'http://localhost:3001/'
  })

  .constant('TAG', {
    length: 10,
    number: 10
  })

  .constant('HISTORICAL', {
    number: 10
  })

  .constant('API_ENDPOINT', {
    url: 'http://localhost:3000/api'
  });
