module Poker {

    interface IPlayerScope extends ng.IScope {
        player: Player;
        result: GameResult;
        cardsVisible: boolean;
        scoreVisible: boolean;
        isVisible():boolean;
    }

    class PlayerDirectiveController {

        constructor(private $scope:IPlayerScope, private LoginService:Login.LoginService) {

        }

        isVisible() {
            return (this.$scope.player.name === this.LoginService.username) || this.$scope.cardsVisible;
        }

    }

    class PlayerDirective implements ng.IDirective {
        restrict = 'E';
        templateUrl = 'game/directive/Player.directive.html';
        replace = true;
        scope = {
            player: '=',
            cardsVisible: '=',
            scoreVisible: '='
        };
        controller = PlayerDirectiveController;
        controllerAs = 'pc';

        constructor(private GameService:GameService, private LoginService:Login.LoginService) {
        }

        link:ng.IDirectiveLinkFn = (scope:IPlayerScope, element:ng.IAugmentedJQuery, attributes:ng.IAttributes) => {

            //scope.isVisible = () => {
            //    return (scope.player.name === this.LoginService.username) || scope.cardsVisible;
            //};

            scope.$watch(() => {
                return this.GameService.getResult(scope.player);
            }, (result) => {
                scope.result = result;
            })
        };

        static factory():ng.IDirectiveFactory {
            return (GameService:GameService, LoginService:Login.LoginService) => new PlayerDirective(GameService, LoginService);
        }
    }
    var app = AppModule.getModule();
    app.directive('player', PlayerDirective.factory());
}