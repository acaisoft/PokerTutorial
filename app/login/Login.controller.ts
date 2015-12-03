module Login {

    class LoginController {
        private username:string;

        constructor(private $state:angular.ui.IStateService, private LoginService:LoginService) {
            this.username = LoginService.username;
        }

        login() {
            this.LoginService.login(this.username);
            this.$state.go('tables');
        }
    }

    var app = AppModule.getModule();
    app.controller("LoginController", LoginController);
}



