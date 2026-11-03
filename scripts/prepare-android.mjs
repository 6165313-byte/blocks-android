import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const run=(...args)=>execFileSync(process.execPath,['node_modules/@capacitor/cli/bin/capacitor',...args],{stdio:'inherit'});
if(!existsSync('android'))run('add','android');
run('sync','android');
function patch(file,re,value){const s=readFileSync(file,'utf8');if(!re.test(s))throw Error(`Missing template field: ${file} ${re}`);writeFileSync(file,s.replace(re,value));}
patch('android/build.gradle',/com\.android\.tools\.build:gradle:[^'"\s]+/,'com.android.tools.build:gradle:8.7.2');
patch('android/gradle/wrapper/gradle-wrapper.properties',/gradle-[\d.]+-(?:all|bin)\.zip/,'gradle-8.11.1-all.zip');
patch('android/variables.gradle',/minSdkVersion\s*=\s*\d+/,'minSdkVersion = 23');
patch('android/variables.gradle',/compileSdkVersion\s*=\s*\d+/,'compileSdkVersion = 35');
patch('android/variables.gradle',/targetSdkVersion\s*=\s*\d+/,'targetSdkVersion = 35');
const style='android/app/src/main/res/values/styles.xml';
patch(style,/<style\s+name="AppTheme.NoActionBar"[^>]*>/,'$&\n        <item name="android:windowOptOutEdgeToEdgeEnforcement">true</item>');
for(const p of ['android/gradlew','android/gradle/wrapper/gradle-wrapper.jar','android/app/src/main/assets/public/index.html','android/app/src/main/assets/public/game.js','android/app/src/main/AndroidManifest.xml'])if(!existsSync(p))throw Error(`Missing generated file: ${p}`);
console.log('Android project configured; compilation is the next separate step.');
