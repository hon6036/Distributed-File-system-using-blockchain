/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const FileSystem = require('./file.js');
const FileList = require('./filelist.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class FileSystemContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.fileList = new FileList(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class FileSystemContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.filenet.filesystem');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new FileSystemContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    async search(ctx, issuer, fileName, fileSize, channel) {

        let fileKey = FileSystem.makeKey([issuer, fileName]);
        let file = await ctx.FileList.getFile(fileKey);

        if (file.getFilename() !== fileName) {
            throw new Error( fileName  + ' is not exist ');
        }

        if (file.isUploaded()) {
            await ctx.FileList.updateFile(file)
            return file
        }
    }

    async queryAll(ctx) {

        let queryString = {
            selector: {}
        };

        let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        return queryResults;

    }

    async queryWithQueryString(ctx, queryString) {

        console.log('query String');
        console.log(JSON.stringify(queryString));

        let resultsIterator = await ctx.stub.getQueryResult(queryString);

        let allResults = [];

        while (true) {
            let res = await resultsIterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};

                console.log(res.value.value.toString('utf8'));

                jsonRes.Key = res.value.key;

                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }

                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await resultsIterator.close();
                console.info(allResults);
                console.log(JSON.stringify(allResults));
                return JSON.stringify(allResults);
            }
        }

    }

}

module.exports = FileSystemContract;
