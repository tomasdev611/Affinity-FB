const pm2 = require('pm2');
const path = require('path');
const confit = require('confit');
const _ = require('lodash');
const Q = require('q');

//  const config = null;
const procCount = 0;

/**
 * @return {config} config
 */
function getConfig() {
    const basedir = path.join(__dirname, 'config');
    return Q.ninvoke(confit(basedir), 'create');
}

Q()
    .then(getConfig)
    .then(((config) => {
        const pm2Config = {
            apps: []
        };
        console.info('Configuration Environment: %s', config.get('env:env'));

// Add any other preconfig method here

// turn the object structure into an array using the key as the app name
        _.each(config.get('pm2'), ((obj, appName) => {
            if (obj !== null) {
                obj.name = appName;
                pm2Config.apps.push(obj);
            }
        }));

        return Q.ninvoke(pm2, 'start', pm2Config);
    }))
    .then(((procs) => {
        if (procCount > 0 && (!procs || !procs.length > 0)) {
            console.warn('\n"pm2.start()" did not return process info. It is likely that none of the configured processes started.\n');
        } else if (procs.length < procCount) {
            console.warn('\nof %d processes configured only %d started\n', procCount, procs.length);
        }

        _.each(procs, ((proc) => {
            const status = proc.status || proc.pm2_env.status;
            console.info(`Started: ${status}   port: ${proc.pm2_env.env.PORT}   name: ${proc.pm2_env.name}`);
        }));

        console.info('*** all processes have started behind the scenes. To kill them, run npm stop ***');
    }))
    .catch(((err) => {
        console.error(err);
        console.info(err.stack);
    }))
    .finally((() => {
        pm2.disconnect((() => {
            process.exit(0);
        }));
    }));
