module AppModule {
    'use strict';

    export class stateConfig {
        constructor(private $stateProvider:ng.ui.IStateProvider, private $urlRouterProvider:ng.ui.IUrlRouterProvider) {
            this.init();
        }

        private init():void {
            this.$stateProvider.state('login', <ng.ui.IState>{
                url: '/login',
                templateUrl: 'login/Login.html',
                controller: 'LoginController as lc'
            }).state('tables', <ng.ui.IState>{
                url: '/tables',
                templateUrl: 'tables/Tables.html',
                controller: 'TablesController as tc'
            });

            this.$urlRouterProvider.otherwise('/login');
        }

    }
    var app = getModule();
    app.config(["$stateProvider", "$urlRouterProvider", // more dependencies
        ($stateProvider:any, $urlRouterProvider:any) => {
            return new stateConfig($stateProvider, $urlRouterProvider);
        }
    ]);
}

