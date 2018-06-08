let env = process.env.NODE_ENV || 'development';


if (env === 'development' || env === 'test') {
  const config = require('./config.json');
  let envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}

// Environmental Variables defined in config-example.json need to be set for Production
