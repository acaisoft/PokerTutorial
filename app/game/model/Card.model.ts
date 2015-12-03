module Poker {

    export class Card {

        constructor(public rank:string, public suit:string) {

        }

        toString() {
            return this.rank + this.suit;
        }
    }

}