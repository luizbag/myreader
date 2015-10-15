angular.module('app', ['app.controllers', 'app.services', 'ui.router'])
  .config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise("/home");

    $stateProvider
      .state('home', {
        url: "/home",
        templateUrl: "/html/home.html",
        data: {
          requireLogin: false
        }
      })
      .state('entrar', {
        url: "/entrar",
        templateUrl: "/html/entrar.html",
        controller: 'UserController',
        data: {
          requireLogin: false
        }
      })
      .state('cadastrar', {
        url: "/cadastrar",
        templateUrl: "/html/cadastrar.html",
        controller: 'UserController',
        data: {
          requireLogin: false
        }
      })
      .state('painel', {
        url: "/painel",
        templateUrl: "/html/painel.html",
        data: {
          requireLogin: false
        }
      });
      $httpProvider.interceptors.push('AuthInterceptor');
  })
  .run(function($rootScope, $state, AuthToken) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
      var requireLogin = toState.data.requireLogin;
      if(requireLogin && !AuthToken.isAuthenticated()) {
        event.preventDefault();
        $state.go('entrar');
      }
    });
  });