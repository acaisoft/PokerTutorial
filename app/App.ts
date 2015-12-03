/// <reference path="config/App.config.ts" />

module AppModule {
    'use strict';
    angular.module('Poker', ['ui.router']);

    export var getModule:() => ng.IModule = () => {
        return angular.module('Poker');
    };

    var app = getModule();

    // run
    app.run(runConfig);
}
