const APP_ENV = process.env.APP_ENV || 'local';

const envConfig = {
  local: {
    name: '[DEV] FocusFlow',
    scheme: 'focusflow-dev',
  },
  preview: {
    name: '[STG] FocusFlow',
    scheme: 'focusflow-stg',
  },
  production: {
    name: 'FocusFlow',
    scheme: 'focusflow',
  },
};

const config = envConfig[APP_ENV] || envConfig.local;

export default {
  name: config.name,
  slug: 'focusflow',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  scheme: config.scheme,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#1A1A2E',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'brp.focusflow.app',
    buildNumber: '1',
    infoPlist: {
      UIBackgroundModes: ['audio'],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#1A1A2E',
    },
    package: 'brp.focusflow.app',
    versionCode: 1,
    edgeToEdgeEnabled: true,
    permissions: ['VIBRATE', 'RECEIVE_BOOT_COMPLETED'],
  },
  plugins: [
    'expo-notifications',
    [
      'expo-av',
      {
        microphonePermission: false,
      },
    ],
  ],
  extra: {
    APP_ENV,
  },
};
