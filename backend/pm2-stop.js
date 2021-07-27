const pm2 = require('pm2');
const path = require('path');
const confit = require('confit');
const Q = require('q');
const _ = require('lodash');

/**
 * @return {config} config
 */
function getConfig() {
    const basedir = path.join(__dirname, 'config');
    return Q.ninvoke(confit(basedir), 'create');
}

console.log('\npm2-stop starting\n');

getConfig()
// Obtain a list of applicatios in JSON
    .then(((config) => {
        const appNames = [];
        _.each(config.get('pm2'), ((obj, appName) => {
            if (appName !== null && appName !== 'redirect') {
                appNames.push(appName);
            }
        }));
        if (appNames.length === 0) {
            console.log('No applications found in JSON, exiting');
            process.exit(0);
        }
        return appNames;
    }))
    .then((list) => {
        const deferred = Q.defer();
        let cntr = 0;
        list.forEach((proc) => {
            Q.ninvoke(pm2, 'delete', proc)
                .then(() => {
                    console.log(`Process ${proc} stopped`);
                    cntr += 1;
                    if (cntr === list.length) {
                        deferred.resolve(true);
                    }
                })
                .catch((err) => {
                    console.log(`Process ${proc} did not stop, error: ${err}`);
                    cntr += 1;
                    if (cntr === list.length) {
                        deferred.resolve(true);
                    }
                });
        });
        return deferred.promise;
    })
    .finally(() => {
        console.log('\npm2-stop complete');
        pm2.disconnect(() => {
            process.exit(0);
        });
    });

