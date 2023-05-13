export default () => ({

  name: 'ecom-micro-warehouse',
  version: '1.0.0',
  host: process.env.APP_HOST || '',
  port: +(process.env.APP_PORT || '0'),
  urlPrefix: process.env.APP_URL_PREFIX || '',
  environment: process.env.NODE_ENV || 'development',
  project_dir: __dirname

});
