const moment = require('moment');
const execSync = require('child_process').execSync;
const replace = require('replace-in-file');
const fs = require('fs');

const dateTime = moment().format('YYYY/MM/DD HH:mm:ss');

fs.copyFile('build/static/js/bundle.min.js', 'docs/travian.js', err => {
    if (err) {
        console.log(err)
    }
});

replace.sync({
    files: 'docs/travian.js',
    from: /@@BUILD_TIME@@/g,
    to: dateTime,
})

execSync('git add . && git commit -am Deploy && git push');