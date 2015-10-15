angular.module('app.controllers', ['app.services'])
  .controller('UserController', ['UserService', 'AuthToken', '$scope', '$state', function(UserService, AuthToken, $scope, $state) {
    $scope.login = function(email, password) {
      UserService.login(email, password, function(token) {
        if(token !== 'Unauthorized') {
          AuthToken.setToken(token);
          $state.go("painel");
        } else {
          $scope.error = "Usuario não encontrado";
        }
      });
    };

    $scope.register = function(email, password) {
      UserService.register(email, password, function(user) {
        $state.go("entrar");
      });
    };

    $scope.logout = function() {
      AuthToken.removeToken();
      $state.go("home");
    };
  }]);