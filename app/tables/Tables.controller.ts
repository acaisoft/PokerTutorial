module Tables {

    class TablesController {
        username:string;
        tables:Table[];

        constructor(private TablesService:TablesService, private $state:angular.ui.IStateService, private LoginService:Login.LoginService) {
            this.tables = this.TablesService.tables;
            this.username = LoginService.username;
        }

        newTable() {
            this.TablesService.create();
        }

        play(tableId:number) {
            this.TablesService.join(tableId);
            this.$state.go('game', {
                tableId: tableId
            });
        }

        join(tableId:number) {
            this.TablesService.join(tableId);
            this.$state.go('game', {
                tableId: tableId
            });
        }

        alreadyHasTable() {
            return this.tables.filter((table) => table.owner === this.LoginService.username).length > 0;
        }

        alreadyJoined(tableId:number) {
            var table = this.tables[tableId];
            return table.owner === this.LoginService.username || table.players.filter((player) => player === this.LoginService.username).length > 0;
        }
    }

    var app = AppModule.getModule();
    app.controller("TablesController", TablesController);
}



