module Login {

    export class LoginService {
        private _username:string;

        constructor(private $window:ng.IWindowService, private $ws:WS.WebsocketService) {
            this._username = this.isAuthenticated ? this.$window.sessionStorage.getItem('username') : null;
        }

        get isAuthenticated() {
            return this.$window.sessionStorage.getItem('username') !== 'null';
        }

        get username() {
            return this._username;
        }

        login(username:string) {
            this._username = username;
            this.$ws.login(this._username);
        }

    }

    var app = AppModule.getModule();
    app.service("LoginService", LoginService);
}