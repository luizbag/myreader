angular.module('app', ['app.controllers', 'app.services', 'ui.router', 'ngSanitize'])
  .directive('repeatFinished', ['$rootScope', function($rootScope) {
    return {
      link: function(scope, element, attrs) {
        if(scope.$last && $rootScope.collapse !== 1) {
          $('.collapsible').collapsible();
          $rootScope.collapse = 1;
        }
      }
    };
  }])
  .config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise("/home/landing");

    $stateProvider
      .state('home', {
        url: "/home",
        templateUrl: "/html/home.html",
        data: {
          requireLogin: false
        }
      })
      .state('home.landing', {
        url: "/landing", 
        templateUrl: "/html/landing.html",
        data: {
          requireLogin: false
        }
      })
      .state('home.entrar', {
        url: "/entrar",
        templateUrl: "/html/entrar.html",
        controller: 'UserController',
        data: {
          requireLogin: false
        }
      })
      .state('home.cadastrar', {
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
        controller: 'UserController',
        data: {
          requireLogin: true
        }
      });
      $httpProvider.interceptors.push('AuthInterceptor');
  })
  .run(function($rootScope, $state, AuthToken) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
      var requireLogin = toState.data.requireLogin;
      if(requireLogin && !AuthToken.isAuthenticated()) {
        event.preventDefault();
        $state.go('home.entrar');
      }
    });
  });