export default {
  expo: {
    name: "Weebo",
    slug: "weebo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#fff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    // ...
    android: {
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "rgba(255, 255, 255, 0)",
      },
      package: "com.phantom.weebo",
      permissions: [
        "ACCESS_COARSE_LOCATION ",

        "ACCESS_FINE_LOCATION",

        "NOTIFICATIONS",
      ],
      useNextNotificationsApi: true,
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
    plugins: [
      [
        "react-native-fbsdk-next",
        {
          appID: "406752991548934",
          clientToken: "c837b0ef8171ff028b8c0da3b7e9f4d7",
          displayName: "Weebo App",
          advertiserIDCollectionEnabled: true,
          autoLogAppEventsEnabled: true,
          isAutoInitEnabled: true,
          iosUserTrackingPermission:
            "This identifier will be used to deliver personalized ads to you.",
        },
      ],
      "@react-native-google-signin/google-signin",
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
  },
};
