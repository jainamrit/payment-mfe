const { shareAll } = require('@angular-architects/module-federation/webpack');

module.exports = {
  name: 'payment',

  exposes: {
    './routes': './src/app/app.routes.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true })
  }
};