const envFile =
  process.env.APP_ENV === 'production'
    ? '.env.production'
    : '.env.development';

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: envFile,
      },
    ],
    'react-native-reanimated/plugin', // THIS MUST BE THE LAST PLUGIN IN THE ARRAY
  ],
};