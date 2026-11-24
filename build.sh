set -e
cd ~
if [ ! -d jdk ]; then curl -sL https://api.adoptium.net/v3/binary/latest/17/ga/linux/x64/jdk/hotspot/normal/eclipse -o jdk.tgz && mkdir jdk && tar xzf jdk.tgz -C jdk --strip-components=1; fi
export JAVA_HOME=~/jdk PATH=~/jdk/bin:$PATH
if [ ! -d sdk ]; then curl -sLo t.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && mkdir -p sdk/cmdline-tools && unzip -q t.zip -d sdk/cmdline-tools && mv sdk/cmdline-tools/cmdline-tools sdk/cmdline-tools/latest; yes | sdk/cmdline-tools/latest/bin/sdkmanager --sdk_root=$HOME/sdk "platforms;android-34" "build-tools;34.0.0" >/dev/null; fi
if [ ! -d gradle-8.7 ]; then curl -sLo g.zip https://services.gradle.org/distributions/gradle-8.7-bin.zip && unzip -q g.zip; fi
cd ~/twa && echo "sdk.dir=$HOME/sdk" > local.properties
~/gradle-8.7/bin/gradle -q assembleRelease --no-daemon
ls -la app/build/outputs/apk/release/
