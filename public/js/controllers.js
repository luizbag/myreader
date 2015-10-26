angular.module('app.controllers', ['angular-md5', 'app.services'])
  .controller('UserController', ['UserService', 'AuthToken', '$scope', 'md5', '$state', function(UserService, AuthToken, $scope, md5, $state) {
    $scope.hash='0';

    $scope.login = function(email, password) {
      UserService.login(email, password, function(token) {
        if(token !== 'Unauthorized') {
          AuthToken.setToken(token);
          $state.go("painel");
        } else {
          Materialize.toast('Usuário Inválido', 6000, 'rounded');
        }
      });
    };

    $scope.register = function(email, password) {
      UserService.register(email, password, function(user) {
        $state.go("entrar");
      });
    };

    $scope.email_hash = function(email) {
      $scope.hash = md5.createHash($scope.email || '');
    };

    $scope.logout = function() {
      AuthToken.removeToken();
      $state.go("home");
    };
  }]);