///<reference path="../App.ts"/>
///<reference path="model/GamePhase.enum.ts"/>
///<reference path="model/Game.model.ts"/>
///<reference path="model/GameResult.model.ts"/>

module Poker {

    import TablesService = Tables.TablesService;

    export class GameService {

        private tableId:number;
        private _isOwner:boolean;

        private _phase:GamePhase;

        results:GameResult[];

        private _game:Game;

        constructor(private $rootScope:ng.IRootScopeService, private TablesService:TablesService, private LoginService:Login.LoginService, private $q:ng.IQService, private $ws:WS.WebsocketService) {
            this._phase = GamePhase.NEW;
            this.results = [];
            this._isOwner = false;

            $rootScope.$on('GAME.UPDATE', (event:ng.IAngularEvent, data:any) => {
                if (this.isOwner()) return;

                this._game.newGame();
                data.players.forEach((player:Player, index:number) => {
                    this._game.addPlayer(new Player(index + 1, player.name));
                    player.cards.forEach((card:Card) => {
                        this._game.players[index].giveCard(new Card(card.rank, card.suit));
                    });
                });
                data.table.cards.forEach((card:Card) => {
                    this._game.table.giveCard(new Card(card.rank, card.suit));
                });
                angular.copy(data.results, this.results);
                //$rootScope.$apply(); // TODO why we need this here?
            });

        }

        get phase():GamePhase {
            return this._phase;
        }

        get game():Game {
            return this._game;
        }

        isOwner():boolean {
            return this._isOwner;
        }

        startGame(tableId?:number) {
            this._phase = GamePhase.NEW;
            this.results = [];
            this.tableId = tableId;
            this._game = new Game(tableId);
            return this.createGame();
        }

        public createGame() {
            var deferred = this.$q.defer();
            this.TablesService.get().then((tables) => {
                this.results.length = 0;
                this._phase = GamePhase.HANDS;
                this._game.newGame();
                var table = tables[this.tableId];
                if (this.LoginService.username === table.owner) {
                    this.sendVisibilityUpdate(false, false);

                    this.$rootScope.$on('TABLE.JOIN', (event:ng.IAngularEvent, data:any) => {
                        if (this.tableId !== data.tableId) return;

                        this.$ws.send({
                            type: 'COMMAND',
                            command: 'GAME.UPDATE',
                            data: {
                                tableId: this.tableId,
                                players: this._game.players,
                                table: this._game.table,
                                results: this.results
                            }
                        });
                    });

                    this._isOwner = true;
                    this._game.addPlayer(new Player(1, table.owner));
                    table.players.forEach((playerName, index) => this._game.addPlayer(new Player(index + 2, playerName)));
                    this.nextAction();
                }
                deferred.resolve();
            });
            return deferred.promise;
        }

        nextAction() {
            switch (this._phase) {
                //case GamePhase.NEW:
                //    this.sendVisibilityUpdate(false, false);
                //    //this.createGame();//.then(() => this.nextAction());
                //    break;
                case GamePhase.HANDS:
                    this._game.dealHands();
                    this._phase = GamePhase.FLOP;
                    break;
                case GamePhase.FLOP:
                    this._game.dealFlop();
                    this._phase = GamePhase.TURN;
                    break;
                case GamePhase.TURN:
                    this._game.dealTurn();
                    this._phase = GamePhase.RIVER;
                    break;
                case GamePhase.RIVER:
                    this._game.dealRiver();
                    this._phase = GamePhase.END;
                    break;
                case GamePhase.END:
                    this.sendVisibilityUpdate(true, true);
                    this._phase = GamePhase.NEW;
                    break;
            }
            this.calculateScore();

            this.$ws.send({
                type: 'COMMAND',
                command: 'GAME.UPDATE',
                data: {
                    tableId: this.tableId,
                    players: this._game.players,
                    table: this._game.table,
                    results: this.results
                }
            });
        }

        sendVisibilityUpdate(handsVisible:boolean, scoreVisible:boolean) {
            this.$ws.send({
                type: 'COMMAND',
                command: 'GAME.VISIBILITY',
                data: {
                    tableId: this.tableId,
                    handsVisible: handsVisible,
                    scoreVisible: scoreVisible
                }
            });
        }

        calculateScore() {
            var scores = this._game.players.map((player) => {
                return new HandEvaluator().calculate(player.cards.concat(this._game.table.cards));
            });
            angular.copy(WinnerEvaluator.calculate(scores), this.results);
            return this.results;
        }

        getResult(player:Player):GameResult {
            return this.results[player.id - 1];
        }
    }

    var app = AppModule.getModule();
    app.service("GameService", GameService);
}