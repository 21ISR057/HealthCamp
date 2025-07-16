const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add platform-specific extensions
config.resolver.platforms = ["native", "web", "ios", "android"];

// Custom resolver to handle maps on web
const originalResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && moduleName === "react-native-maps") {
    return {
      filePath: require.resolve("./web-mocks/react-native-maps.js"),
      type: "sourceFile",
    };
  }

  if (platform === "web" && moduleName === "expo-maps") {
    return {
      filePath: require.resolve("./web-mocks/expo-maps.js"),
      type: "sourceFile",
    };
  }

  if (originalResolver) {
    return originalResolver(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
