/**
 * Script that wil compile that contracts inside the Campaign contract and write its content
 * inside a build folder
 * */

const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); // This will remove everything in this path

/* Now we have to read everything from the Campaign.sol file */
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');
const output = solc.compile(source, 1).contracts;

/* Create the build folder */
// Create the build folder if does not exist
fs.ensureDirSync(buildPath);

// Iterate over the keys of the output object
for (let contract in output) {
    fs.outputJsonSync(
      path.resolve(buildPath, `${contract.replace(':', '')}.json`),
      output[contract]
    );
}
