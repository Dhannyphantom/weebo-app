module.exports = {
  expo: {
    name: "Weebo",
    slug: "weebo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon512.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#5B4EC7",
    },
    android: {
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#5B4EC7",
      },
      package: "com.phantom.weebo",
      permissions: [
        "ACCESS_COARSE_LOCATION ",

        "ACCESS_FINE_LOCATION",

        "NOTIFICATIONS",
      ],
      // useNextNotificationsApi: true,
      // ...
    },
    ios: {
      googleServicesFile: process.env.GOOGLE_SERVICES_PLIST_JSON,
      supportsTablet: true,
      infoPlist: {
        NSUserTrackingUsageDescription:
          "This identifier will be used to deliver personalized ads to you.",
        SKAdNetworkItems: [
          {
            SKAdNetworkIdentifier: "cstr6suwn9.skadnetwork",
          },
        ],
      },
      // ...
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "@react-native-community/datetimepicker",
      "@react-native-google-signin/google-signin",
      "expo-asset",
    ],
    extra: {
      eas: {
        projectId: "a6378b43-7106-4c59-a10a-94224fff1c10",
      },
    },
  },

  "react-native-google-mobile-ads": {
    android_app_id: "ca-app-pub-3603875446667492~4709489944",
    ios_app_id: "ca-app-pub-3603875446667492~7241419988",
    user_tracking_usage_description:
      "This identifier will be used to deliver personalized ads to you.",
  },
};
