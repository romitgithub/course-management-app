/**
 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 *
 * You should never commit this file to a public repository on GitHub!
 * All public code on GitHub can be searched, that means anyone can see your
 * uploaded secrets.js file.
 *
 * I did it for your convenience using "throw away" API keys and passwords so
 * that all features could work out of the box.
 *
 * Use config vars (environment variables) below for production API keys
 * and passwords. Each PaaS (e.g. Heroku, Nodejitsu, OpenShift, Azure) has a way
 * for you to set it up from the dashboard.
 *
 * Another added benefit of this approach is that you can use two different
 * sets of keys for local development and production mode without making any
 * changes to the code.

 * IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT  IMPORTANT
 */

module.exports = {

  // db: process.env.MONGODB || 'mongodb://osmos:password@apollo.modulusmongo.net:27017/n8uxoZix',

  db: process.env.MONGODB || 'mongodb://localhost:27017/shareiitk',

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  GCM_API_KEY : 'AIzaSyDyAzRmtoXfE96PS-1Cox6D2WU6NDFCIj8',

  AWSAccessKeyId : 'AKIAI3L7LAZDTNJSUPIA',

  AWSSecretKey : 'xYJE1Imvy7az7JMtol0gyj2wWc3EgvEvUIWup6H2'

};
