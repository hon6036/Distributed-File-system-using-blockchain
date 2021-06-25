/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

// Enumerate commercial paper state values
const cpState = {
    ISSUED: 1,
    UPLOAD: 2,
    DELETED: 3
};

/**
 * FileSystem class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class FileSystem extends State {

    constructor(obj) {
        super(FileSystem.getClass(), [obj.issuer, obj.fileName]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getIssuer() {
        return this.issuer;
    }

    setIssuer(newIssuer) {
        this.issuer = newIssuer;
    }

    getFilename() {
        return this.fileName;
    }
    setFilename(fileName) {
        this.fileName = fileName;
    }
    /**
     * Useful methods to encapsulate commercial paper states
     */
    setUpload() {
        this.currentState = cpState.UPLOAD;
    }

    isUploaded() {
        return this.currentState === cpState.UPLOAD;
    }

    static fromBuffer(buffer) {
        return FileSystem.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, FileSystem);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(issuer, fileName, fileSize, channel) {
        return new FileSystem({ issuer, fileName, fileSize, channel});
    }

    static getClass() {
        return 'org.file.filesystem';
    }
}

module.exports = FileSystem;
