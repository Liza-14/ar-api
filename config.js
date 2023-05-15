import fs from 'fs';

function getConfigFileForEnvironment(env) {
    switch (env) {
        case 'local':
            return 'config.local.json';
        case 'prod':
            return 'config.prod.json';
        default:
            return 'config.local.json';
    }
}

const env = process.argv.filter(x => x.startsWith('env='))[0]?.slice(4)
const configFilePath = getConfigFileForEnvironment(env);
const rawData = fs.readFileSync(configFilePath);
const config = JSON.parse(rawData);

console.log('config:', configFilePath)
export default config;
