module AppModule {

    export class runConfig {
        constructor(private $state:angular.ui.IStateService, private $ws:WS.WebsocketService, private LoginService:Login.LoginService) {

            $ws.connect().then(() => {
                if (!LoginService.isAuthenticated) {
                    $state.go('login');
                } else {
                    $ws.login(LoginService.username);
                }
            });

        };
    }

}