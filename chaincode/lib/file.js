/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const State = require('../ledger-api/state.js');

const cpState = {
    ISSUED: 1,
    UPLOAD: 2,
    DELETED: 3
};


class FileSystem extends State {

    constructor(obj) {
        super(FileSystem.getClass(), [obj.issuer, obj.fileName]);
        Object.assign(this, obj);
    }

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
    static createInstance(issuer, fileName, fileSize, channel, filePath) {
        return new FileSystem({ issuer, fileName, fileSize, channel, filePath });
    }

    static getClass() {
        return 'org.filenet.filesystem';
    }
}

module.exports = FileSystem;
