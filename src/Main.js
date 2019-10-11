const core = require('cyberway-core-service');
const { BasicMain, MongoDB } = core.services;
const Connector = require('./services/Connector');
const env = require('./data/env');

class Main extends BasicMain {
    constructor() {
        super(env);

        this.addNested(new MongoDB(), new Connector());
    }
}

module.exports = Main;
