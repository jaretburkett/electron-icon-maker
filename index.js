#!/usr/bin/env node

const Jimp = require("jimp");
const args = require('args');
const path = require('path');
const fs = require('fs');
const icongen = require( 'icon-gen' );

const pngSizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];

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

const iconOptions = {
    type: 'png',
    report: true
};

// do it
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
            // done, generate the icons
            const macDir = path.join(oSub, 'mac');
            // make dir if does not exist
            if (!fs.existsSync(macDir)) {
                fs.mkdirSync(macDir);
            }
            const winDir = path.join(oSub, 'win');
            // make dir if does not exist
            if (!fs.existsSync(winDir)) {
                fs.mkdirSync(winDir);
            }
            icongen(PNGoutputDir, macDir, {
                report: true,
                icns: {
                    name: 'icon',
                    sizes:  [16, 32, 64, 128, 256, 512, 1024]
                },
            } ).then( ( results ) => {
                icongen(PNGoutputDir, winDir, {
                    report: true,
                    ico: {
                        name: 'icon',
                        sizes: [16, 24, 32, 48, 64, 128, 256]
                    },
                } )
        .then( ( results ) => {
                // console.log('\n ALL DONE');
            // rename the PNGs to electron format
            console.log('Renaming PNGs to Electron Format');
            renamePNGs(0);
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

function renamePNGs(position){
    var startName = pngSizes[position] + '.png';
    var endName = pngSizes[position] + 'x' + pngSizes[position] + '.png';
    fs.rename(PNGoutputDir + startName, PNGoutputDir + endName, function (err) {
        console.log('Renamed '+ startName + ' to '+endName);
        if (err) {
            throw err;
        } else if (position < pngSizes.length - 1){
            // not done yet. Run the next one
            renamePNGs(position + 1);
        } else {
            console.log('\n ALL DONE');
        }
    });

}

function createPNG(size, callback) {
    var fileName = size.toString() + '.png';

    // make dir if does not exist
    if (!fs.existsSync(output)) {
        fs.mkdirSync(output);
    }
    // make sub dir if does not exist
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
