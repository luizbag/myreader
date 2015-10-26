angular.module('app.services', ['ngResource'])
.factory('AuthToken', ['$window', function($window) {
  var storage = $window.localStorage;
  var cachedToken;
  return {
    setToken: function(token) {
      cachedToken = token;
      storage.setItem('token', token);
    },
    getToken: function() {
      if(!cachedToken)
        cachedToken = storage.getItem('token');
      return cachedToken;
    },
    removeToken: function() {
      cachedToken = null;
      storage.removeItem('token');
    },
    isAuthenticated: function() {
      return !!this.getToken();
    }
  };
}])
.factory('AuthInterceptor', function(AuthToken) {
  return {
    request: function(config) {
      var token = AuthToken.getToken();
      if(token)
        config.headers.Authorization = token;
      return config;
    },
    response: function(response) {
      return response;
    }
  }
})
.service('UserService', ['$http', function($http) {
  this.sign_in = function(email, password, callback) {
    $http.post('/users/sign_in', {"email": email, "password": password}).
    success(function(data, status, headers, config) {
      callback(data);
    }).
    error(function(data, status, headers, config) {
      var token = "Unauthorized";
      callback(token);
    });
  };

  this.sign_up = function(email, password, callback) {
    $http.post('/users/sign_up', {"email": email, "password": password}).
    success(function(data, status, headers, config) {
      callback(data);
    }).
    error(function(data, status, headers, config) {
      console.log(status);
    });
  };

  this.check_email = function(email, callback) {
    $http.get('/users/' + email).
    success(function(data, status, headers, config) {
      callback(data);
    });
  };
}]);
