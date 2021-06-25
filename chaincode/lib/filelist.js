/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const FileSystem = require('./file.js');

class FileList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.file.filesystemlist');
        this.use(FileSystem);
    }

    async addFile(file) {
        return this.addState(file);
    }

    async getFile(fileKey) {
        return this.getState(fileKey);
    }

    async updateFile(file) {
        return this.updateState(file);
    }
}


module.exports = FileList;