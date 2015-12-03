module Poker {

    export class Table {

        public cards:Card[];

        constructor(public id:number) {
            this.cards = [];
        }

        giveCard(card:Card) {
            this.cards.push(card);
        }

        clear() {
            this.cards.length = 0;
        }

    }

}
