module Poker {

    export class WinnerEvaluator {

        static calculate(scores:Score[]):GameResult[] {
            var winner = scores.reduce(function (acc:any, result:Score, index:number) {
                if (result.score > acc.result.score) {
                    acc.index = index;
                    acc.result = result;
                }
                return acc;
            }, {
                index: -1,
                result: {
                    score: -1
                }
            });

            var results:GameResult[] = [];
            scores.forEach(function (score, index) {
                results.push({
                    score: score.score,
                    message: score.message,
                    bestHand: score.bestHand,
                    winner: (index === winner.index)
                });
            });
            return results;
        }

    }

}

