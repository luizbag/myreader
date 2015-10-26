angular.module('app.controllers', ['angular-md5', 'app.services'])
  .controller('UserController', ['UserService', 'AuthToken', '$scope', 'md5', '$state', function(UserService, AuthToken, $scope, md5, $state) {
    $scope.hash='0';
    $scope.valid=false;

    $scope.sign_in = function(email, password) {
      UserService.sign_in(email, password, function(token) {
        if(token !== 'Unauthorized') {
          AuthToken.setToken(token);
          $state.go("painel");
        } else {
          Materialize.toast('Unauthorized', 3000, 'rounded');
        }
      });
    };

    $scope.sign_up = function(email, password) {
      if($scope.valid) {
        UserService.sign_up(email, password, function(user) {
          $state.go("home.entrar");
        });
      } else {
        console.log('invalid');
      }
    };

    $scope.email_hash = function(email) {
      $scope.hash = md5.createHash($scope.email || '');
    };

    $scope.validate_password = function(password, confirmation) {
      if(password !== confirmation) {
        $scope.valid = false;
        $('#confirmation').removeClass('valid');
        $('#confirmation').addClass('invalid');
      } else {
        $scope.valid = true;
        $('#confirmation').removeClass('invalid');
        $('#confirmation').addClass('valid');
      }
    }

    $scope.logout = function() {
      AuthToken.removeToken();
      $state.go("home");
    };
  }]);