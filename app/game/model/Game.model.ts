module Poker {

    export class Game {

        public table:Table;
        public players:Player[];
        public deck:Deck;

        constructor(tableId:number) {
            this.players = [];

            this.table = new Table(tableId);

            this.deck = new Deck();
            this.deck.shuffle();
        }

        newGame() {
            this.table.clear();
            this.players.length = 0;
            this.deck = new Deck();
            this.deck.shuffle();
        }

        addPlayer(player:Player) {
            this.players.push(player);
        }

        dealHands() {
            this.players.forEach((player) => {
                player.giveCard(this.deck.popCard());
                player.giveCard(this.deck.popCard());
            });
        }

        dealFlop() {
            this.table.giveCard(this.deck.popCard());
            this.table.giveCard(this.deck.popCard());
            this.table.giveCard(this.deck.popCard());
        }

        dealTurn() {
            this.table.giveCard(this.deck.popCard());
        }

        dealRiver() {
            this.table.giveCard(this.deck.popCard());
        }

    }

}