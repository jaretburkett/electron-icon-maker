#!/usr/bin/env node

const Jimp = require("jimp");
const args = require('args');
const path = require('path');
const fs = require('fs');
const icongen = require( 'icon-gen' );

var pngSizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];

args
    .option('input', 'Input PNG file. Recommended (1024x1024)', './icon.png')
    .option('output', 'Folder to output new icons folder', './');

const flags = args.parse(process.argv);
console.log(flags);

// correct paths
var input = path.resolve(process.cwd(), flags.input);
var output = path.resolve(process.cwd(), flags.output);
var o = output;
var oSub = o.endsWith('/') ? o + 'icons/' : o + '/icons/';
var PNGoutputDir = oSub + 'png/';

// do it

const iconOptions = {
    type: 'png',
    report: true
};

createPNGs(0);


// calls itself recursivly
function createPNGs(position) {
    createPNG(pngSizes[position], function (err, info) {
        console.log(info);
        if (err) {
            if (err) throw new Error(err);
        } else if (position < pngSizes.length - 1) {
            // keep going
            createPNGs(position + 1);
        } else {
            // done
            icongen(PNGoutputDir, oSub + 'mac/', {type: 'png', names: {icns:'icon'}, modes:['icns'], report: true} )
                .then( ( results ) => {
                icongen(PNGoutputDir, oSub + 'win/', {type: 'png',names: {ico:'icon'}, modes:['ico'], report: true} )
        .then( ( results ) => {
                console.log('\n ALL DONE');
        } )
        .catch( ( err ) => {
                if (err) throw new Error(err);
        } );
        } )
        .catch( ( err ) => {
                if (err) throw new Error(err);
        } );
        }
    });
}

function createPNG(size, callback) {
    var fileName = size.toString() + '.png';

    // make dir if does not exist
    if (!fs.existsSync(output)) {
        fs.mkdirSync(output);
    }
    // make dir if does not exist
    if (!fs.existsSync(oSub)) {
        fs.mkdirSync(oSub);
    }
    // make dir if does not exist
    if (!fs.existsSync(PNGoutputDir)) {
        fs.mkdirSync(PNGoutputDir);
    }
    Jimp.read(input, function (err, image) {
        if (err) {
            callback(err, null);
        }
        image.resize(size, size)
            .write(PNGoutputDir + fileName, function (err) {
                var logger = 'Created ' + PNGoutputDir + fileName;
                callback(err, logger);
            });
    }).catch(function (err) {
        callback(err, null);
    });
}
