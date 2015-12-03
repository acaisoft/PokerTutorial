module Tables {

    export class TablesService {
        public tables:Table[];

        constructor(private $rootScope:ng.IRootScopeService, private $http:ng.IHttpService, private $ws:WS.WebsocketService) {
            this.tables = [];

            ['TABLE.CREATE', 'TABLE.JOIN'].forEach((event) => $rootScope.$on(event, () => {
                this.get();
            }));
            this.get();
        }

        get():ng.IPromise<Table[]> {
            var promise:ng.IHttpPromise<Table[]> = this.$http.get('/api/table');
            return promise.then((success)=> {
                angular.copy(success.data, this.tables);
                return this.tables;
            });
        }

        create() {
            this.$ws.send({
                type: 'COMMAND',
                command: 'TABLE.CREATE',
                data: {
                }
            });
        }

        join(tableId:number) {
            this.$ws.send({
                type: 'COMMAND',
                command: 'TABLE.JOIN',
                data: {
                    tableId: tableId
                }
            });
        }

    }

    var app = AppModule.getModule();
    app.service("TablesService", TablesService);
}
