// Patch para react-native-camera - substituir jcenter()
sed -i 's/jcenter()/maven { url \"https:\\/\\/jitpack.io\" }\n        maven { url \"https:\\/\\/maven.google.com\" }/g' node_modules/react-native-camera/android/build.gradle
