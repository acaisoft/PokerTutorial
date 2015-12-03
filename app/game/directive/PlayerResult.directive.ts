module Poker {

    interface IPlayerResultScope extends ng.IScope {
        result: GameResult;
    }

    class PlayerResultDirective implements ng.IDirective {
        restrict = 'E';
        templateUrl = 'game/directive/PlayerResult.directive.html';
        replace = true;
        scope = {
            result: '='
        };

        constructor() {

        }

        link:ng.IDirectiveLinkFn = (scope:IPlayerResultScope, element:ng.IAugmentedJQuery, attributes:ng.IAttributes) => {

        };

        static factory():ng.IDirectiveFactory {
            return () => new PlayerResultDirective();
        }
    }
    var app = AppModule.getModule();
    app.directive('playerResult', PlayerResultDirective.factory());

}