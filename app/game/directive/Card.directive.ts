module Poker {

    interface ICardScope extends ng.IScope {
        card: Card;
        visible: boolean;
    }

    class CardDirective implements ng.IDirective {
        restrict = 'E';
        templateUrl = 'game/directive/Card.directive.html';
        replace = true;
        scope = {
            card: '=',
            visible: '='
        };

        constructor() {

        }

        link:ng.IDirectiveLinkFn = (scope:ICardScope, element:ng.IAugmentedJQuery, attributes:ng.IAttributes) => {

            scope.$watch('visible', (newValue:boolean) => {
                element.toggleClass('_' + scope.card.toString(), newValue);
            });

        };

        static factory():ng.IDirectiveFactory {
            return () => new CardDirective();
        }
    }
    var app = AppModule.getModule();
    app.directive('card', CardDirective.factory());
}