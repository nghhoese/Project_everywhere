# App

Mobile app for school project.

## Installation

### Add the following environment variables
- ANDROID_HOME=C:\%USER%\AppData\Local\Android\Sdk
- JAVA_HOME=C:\Program Files\Android\Android Studio\jre
- PATH add %LOCALAPPDATA%\Android\Sdk\platform-tools
- PATH add C:\Program Files\Android\Android Studio\jre

### Setup firebase
Add your firebase credentials to */android/app/google-services.json*.

### Run the following commands:
```
cd <project folder>

cp src/config/config-example.js /src/config/config.js

npm i

npx react-native run-android
```
