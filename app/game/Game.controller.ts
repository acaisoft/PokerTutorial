module Poker {

    import LoginService = Login.LoginService;
    class GameController {

        username:string;
        table:Table;
        players:Player[];
        results:GameResult[];
        handsVisible:boolean;
        scoreVisible:boolean;

        constructor(private $scope:ng.IScope, private GameService:GameService, private LoginService:Login.LoginService, private $state:angular.ui.IStateService) {
            this.results = this.GameService.results;
            this.handsVisible = false;
            this.scoreVisible = false;
            this.username = LoginService.username;

            var tableId:number = +this.$state.params['tableId'];
            this.GameService.startGame(tableId).then(() => {
                this.players = this.GameService.game.players;
                this.table = this.GameService.game.table;
            });

            this.$scope.$on('GAME.VISIBILITY', (event:ng.IAngularEvent, data:any) => {
                this.handsVisible = data.handsVisible;
                this.scoreVisible = data.scoreVisible;
            });

        }

        newGame() {
            this.GameService.createGame();
        }

        nextAction() {
            this.GameService.nextAction();
        }

        toggleHandsVisibility() {
            this.handsVisible = !this.handsVisible;
            this.GameService.sendVisibilityUpdate(this.handsVisible, this.scoreVisible);
        }

        toggleScoreVisibility() {
            this.scoreVisible = !this.scoreVisible;
            this.GameService.sendVisibilityUpdate(this.handsVisible, this.scoreVisible);
        }

        getPhase() {
            return this.GameService.phase;
        }

        isOwner() {
            return this.GameService.isOwner();
        }
    }

    var app = AppModule.getModule();
    app.controller("GameController", GameController);
}