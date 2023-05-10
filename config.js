import fs from 'fs';

function getConfigFileForEnvironment(env) {
    switch (env) {
        case 'local':
            return 'config.local.json';
        case 'production':
            return 'config.prod.json';
    }
}

const configFilePath = getConfigFileForEnvironment(process.env.NODE_ENV);
const rawData = fs.readFileSync(configFilePath);
const config = JSON.parse(rawData);

export default config;
