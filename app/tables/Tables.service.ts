module Tables {

    export class TablesService {
        public tables:Table[];

        constructor(private $rootScope:ng.IRootScopeService, private $http:ng.IHttpService) {
            this.tables = [];

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
        }

        join(tableId:number) {
        }

    }

    var app = AppModule.getModule();
    app.service("TablesService", TablesService);
}
