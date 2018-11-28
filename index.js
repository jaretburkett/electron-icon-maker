#!/usr/bin/env node

const Jimp = require('jimp');
const args = require('args');
const path = require('path');
const fs = require('fs');
const icongen = require('icon-gen');

const pngSizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];

args
  .option('input', 'Input PNG file. Recommended (1024x1024)', './icon.png')
  .option('output', 'Folder to output new icons folder', './');

const flags = args.parse(process.argv);
console.log(flags);

// correct paths
const input = path.resolve(process.cwd(), flags.input);
const output = path.resolve(process.cwd(), flags.output);
const oSub = output.endsWith('/') ? output + 'icons/' : output + '/icons/';
const PNGoutputDir = oSub + 'png/';

// do it
createPNGs(0);

// calls itself recursivly
function createPNGs(position) {
  createPNG(pngSizes[position], (err, info) => {
    console.log(info);
    if (err) {
      if (err) throw new Error(err);
    } else if (position < pngSizes.length - 1) {
      // keep going
      createPNGs(position + 1);
    } else {
      // done, generate the icons
      icongen(PNGoutputDir, oSub + 'mac/', {
        type: 'png',
        names: { icns: 'icon' },
        modes: ['icns'],
        report: true
      })
        .then(results => {
          icongen(PNGoutputDir, oSub + 'win/', {
            type: 'png',
            names: { ico: 'icon' },
            modes: ['ico'],
            report: true
          })
            .then(results => {
              // rename the PNGs to electron format
              console.log('Renaming PNGs to Electron Format');
              renamePNGs(0);
            })
            .catch(err => {
              if (err) throw new Error(err);
            });
        })
        .catch(err => {
          if (err) throw new Error(err);
        });
    }
  });
}

function renamePNGs(position) {
  const startName = pngSizes[position] + '.png';
  const endName = pngSizes[position] + 'x' + pngSizes[position] + '.png';
  fs.rename(PNGoutputDir + startName, PNGoutputDir + endName, err => {
    console.log('Renamed ' + startName + ' to ' + endName);
    if (err) {
      throw err;
    } else if (position < pngSizes.length - 1) {
      // not done yet. Run the next one
      renamePNGs(position + 1);
    } else {
      console.log('\n All done');
    }
  });
}

function createPNG(size, callback) {
  const fileName = size.toString() + '.png';

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
  Jimp.read(input, (err, image) => {
    if (err) {
      callback(err, null);
    }
    image.resize(size, size).write(PNGoutputDir + fileName, err => {
      const logger = 'Created ' + PNGoutputDir + fileName;
      callback(err, logger);
    });
  }).catch(err => {
    callback(err, null);
  });
}
