var glob = require("glob")
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');

console.log("running script copy-static-files.js");

if (process.argv.length < 4) {
    console.log('Usage: node copy-static-files.js src dest');
    return;
}

var src = path.join(process.cwd(), process.argv[2]);
var dest = path.join(process.cwd(), process.argv[3]);

const globOptions = {
    cwd: src,
};

const staticFilePattern = '**/*.!(*js|*jsx|less)';

glob(staticFilePattern, globOptions, (er, files) => {
    if (files && files.length) {
        files.forEach(f => {
            var destFile = path.join(dest, f);
            mkdirp(path.dirname(destFile), (err) => {
                if (err) {
                    throw err;
                }
                fs.createReadStream(path.join(src, f)).pipe(fs.createWriteStream(destFile));
            });
        });
    }
});

console.log("done running script copy-static-files.js");
