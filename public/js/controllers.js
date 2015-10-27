angular.module('app.controllers', ['angular-md5', 'app.services'])
  .controller('UserController', ['UserService', 'AuthToken', '$scope', 'md5', '$state', function(UserService, AuthToken, $scope, md5, $state) {
    $scope.hash='0';
    $scope.valid=false;

    $scope.sign_in = function(email, password) {
      if($scope.valid) {
        UserService.sign_in(email, password, function(token) {
          if(token !== 'Unauthorized') {
            AuthToken.setToken(token);
            $state.go("painel");
          } else {
            Materialize.toast('Unauthorized', 3000, 'rounded');
          }
        });
      }
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

    $scope.email_hash = function(email, is_sign_up) {
      $scope.hash = md5.createHash($scope.email || '');
      UserService.check_email(email, function(exists) {
        if(is_sign_up) {
          if(exists) {
            $('#email').removeClass('valid ng-valid');
            $('#email').addClass('invalid ng-invalid');
            $scope.valid = false;
          } else {
            $('#email').removeClass('invalid ng-invalid');
            $('#email').addClass('valid ng-valid');
            $scope.valid = true;
          }
        } else {
          if(exists) {
            $('#email').removeClass('invalid ng-invalid');
            $('#email').addClass('valid ng-valid');
            $scope.valid = true;
          } else {
            $('#email').removeClass('valid ng-valid');
            $('#email').addClass('invalid ng-invalid');
            $scope.valid = false;
          }
        }
      });
    };

    $scope.validate_password = function(password, confirmation) {
      if(password !== confirmation) {
        $scope.valid = false;
        $('#confirmation').removeClass('valid ng-valid');
        $('#confirmation').addClass('invalid ng-invalid');
      } else {
        $scope.valid = true;
        $('#confirmation').removeClass('invalid ng-invalid');
        $('#confirmation').addClass('valid ng-valid');
      }
    }

    $scope.sign_out = function() {
      AuthToken.removeToken();
      $state.go("home");
    };
  }]);