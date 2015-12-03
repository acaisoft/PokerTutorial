module WS {

    interface Message {
        type: string,
        command: string,
        data: any
    }

    export class WebsocketService {

        private sockjs:SockJS;

        constructor(private $rootScope:ng.IRootScopeService, private $window:ng.IWindowService, private $q:ng.IQService) {
        }

        connect() {
            var deferred = this.$q.defer();
            this.sockjs = new SockJS('/ws');
            this.sockjs.onopen = function () {
                deferred.resolve();
            };

            this.sockjs.onmessage = (event:SJSMessageEvent) => {
                var message:Message = JSON.parse(event.data);
                console.log(message);
                this.$rootScope.$apply(() => {
                    this.$rootScope.$broadcast(message.command, message.data);
                });
            };
            return deferred.promise;
        }

        login(username:string) {
            this.$window.sessionStorage.setItem('username', username);
            this.send({
                type: 'COMMAND',
                command: 'USER.CREATE',
                data: {
                    username: username
                }
            });
        }

        send(message:Message) {
            if (this.sockjs.readyState > 0) {
                this.sockjs.send(JSON.stringify(message));
            } else {
                console.log('warning: connection not yet opened');
            }
        }

    }

    var app = AppModule.getModule();
    app.service("$ws", WebsocketService);
}