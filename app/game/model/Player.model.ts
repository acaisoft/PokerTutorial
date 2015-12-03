module Poker {

    export class Player {

        public cards:Card[];

        constructor(public id:number, public name:string) {
            this.cards = [];
        }

        giveCard(card:Card) {
            this.cards.push(card);
        }

    }

}
