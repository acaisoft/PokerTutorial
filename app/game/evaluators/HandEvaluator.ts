module Poker {

    class HandResult {
        flush:any;
        four:any;
        full:any;
        kickers:any;
        pairs:any;
        straight:any;
        three:any;
    }

    export class HandEvaluator {

        calculate(cards:Card[]):Score {
            var ranks = HandEvaluator.getRanksMap(cards);
            var suits = HandEvaluator.getSuitsMap(cards);

            var three = this.sameRank(ranks, 3);
            var pairs = this.sameRank(ranks, 2);
            var full = three.concat(pairs);
            full = full.length === 5 ? full : [];

            var kickers = this.sameRank(ranks, 1);
            kickers.sort(function (a, b) {
                return Deck.ranks.indexOf(a) - Deck.ranks.indexOf(b);
            });

            var handResult = {
                flush: this.isFlush,
                four: this.sameRank(ranks, 4),
                three: three,
                pairs: pairs,
                full: full,
                straight: this.isStraight(ranks),
                kickers: kickers
            };
            return this.calculateScore(handResult);
        }

        private static getRanksMap(cards:Card[]) {
            return cards.reduce(function (acc:any, card:Card) {
                acc[card.rank] = acc[card.rank] ? acc[card.rank] + 1 : 1;
                return acc;
            }, {});
        }

        private static getSuitsMap(cards:Card[]) {
            return cards.reduce(function (acc:any, card:Card) {
                acc[card.suit] = acc[card.suit] ? acc[card.suit] + 1 : 1;
                return acc;
            }, {});
        }

        private isFlush(suits:any, cards:Card[]) {
            return Object.keys(suits).reduce(function (acc, suit) {
                if (suits[suit] >= 5) {
                    acc.flush = true;
                    acc.suit = suit;
                    acc.cards = cards;
                }
                return acc;
            }, {
                flush: false,
                suit: '',
                cards: []
            });
        }

        private isStraight(ranks:any) {
            var initial = ranks['A'] > 0 ? {count: 1, ranks: ['A']} : {count: 0, ranks: []};
            return Deck.ranks.reduce(function (acc, rank) {
                if (ranks[rank] && ranks[rank] > 0) {
                    acc.count++;
                    acc.ranks.push('' + rank);
                } else if (acc.count < 5) {
                    acc.count = 0;
                    acc.ranks.length = 0;
                }
                return acc;
            }, initial);
        }

        sameRank(ranks:any, howMany:number) {
            return Object.keys(ranks).filter(function (rank) {
                return ranks[rank] === howMany;
            });
        }

        calculateScore(result:HandResult) {
            var score:Score = {
                score: 0,
                bestHand: [],
                message: ''
            };
            if (result.straight.count >= 5 && result.flush.flush) {
                score.message = 'straight flush';
                score.bestHand = result.straight.ranks.slice(0, 5);
                score.score = 0x800000;
            } else if (result.four.length > 0) {
                score.message = 'four of a kind';
                score.bestHand = result.kickers.slice(-1).concat(result.four).concat(result.four).concat(result.four).concat(result.four);
                score.score = 0x700000;
            } else if (result.three.length > 0 && result.pairs.length > 0) {
                score.message = 'full house';
                score.bestHand = result.pairs.slice(-1).concat(result.pairs.slice(-1)).concat(result.three).concat(result.three).concat(result.three);
                score.score = 0x600000;
            } else if (result.flush.flush) {
                score.message = 'flush';
                score.bestHand = result.flush.cards.filter(function (card:Card) {
                    return card.suit === result.flush.suit;
                }).slice(-5).map(function (card:Card) {
                    return card.rank;
                }).sort(function (a:string, b:string) {
                    return Deck.ranks.indexOf(a) - Deck.ranks.indexOf(b);
                });
                score.score = 0x500000;
            } else if (result.straight.count >= 5) {
                score.message = 'straight';
                score.bestHand = result.straight.ranks.slice(0, 5);
                score.score = 0x400000;
            } else if (result.three.length > 0) {
                score.message = 'three of a kind';
                score.bestHand = result.kickers.slice(-2).concat(result.three).concat(result.three).concat(result.three);
                score.score = 0x300000;
            } else if (result.pairs.length >= 2) {
                score.message = 'two pairs';
                result.pairs.sort(function (a:string, b:string) {
                    return Deck.ranks.indexOf(a) - Deck.ranks.indexOf(b);
                });
                var higherPair = result.pairs.slice(-2)[1];
                var lowerPair = result.pairs.slice(-2)[0];
                score.bestHand = result.kickers.slice(-1).concat([lowerPair, lowerPair]).concat([higherPair, higherPair]);
                score.score = 0x200000;
            } else if (result.pairs.length === 1) {
                score.message = 'one pair';
                var higherPair = result.pairs.slice(-1)[0];
                score.bestHand = result.kickers.slice(-3).concat([higherPair, higherPair]);
                score.score = 0x100000;
            } else {
                score.message = 'high card';
                score.bestHand = result.kickers.slice(-5);
                score.score = 0x000000;
            }
            score.score = score.bestHand.reduce(function (acc, rank, index) {
                return acc + (Deck.ranks.indexOf(rank) + 2) * Math.pow(0x10, index);
            }, score.score);
            return score;
        }


    }

}
