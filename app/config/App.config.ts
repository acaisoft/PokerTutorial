module AppModule {

    export class runConfig {
        constructor(private $state:angular.ui.IStateService, private LoginService:Login.LoginService) {

            if (!LoginService.isAuthenticated) {
                $state.go('login');
            }

        };
    }

}