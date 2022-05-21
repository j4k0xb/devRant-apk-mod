# devRant++ apk mod

Based on the `1.17.0.4` apk.

Unlocks the black theme and bonus settings.

## Install

Download and install the prebuilt [apk](dpp-aligned-debugSigned.apk?raw=1)

## Development

All [js resources](Resources) were extracted using frida.
The patch was also initially tested by hooking `KrollAssetHelper.readAssetBytes` with frida.

### Download

Download the apk from e.g. [APKPure](https://apkpure.com/devrant/com.hexicallabs.devrant) and rename it to `stock.apk`.

### Decode

```sh
apktool decode --no-res --output decoded stock.apk 
```

### Smali patch

1. Open [KrollAssetHelper.java](src/org/appcelerator/kroll/util/KrollAssetHelper.java) in IntelliJ
2. Click on `Build` -> `Compile to smali`
3. Rename the `readAssetBytes` method in [KrollAssetHelper.smali](src/org/appcelerator/kroll/util/KrollAssetHelper.smali) to `readAssetBytesOriginal`
4. Copy-paste `readAssetBytes` from the previously compiled smali

### Build

```sh
apktool build decoded --output dpp.apk && uber-apk-signer --apks dpp.apk
```

### Install

```sh
adb install dpp-aligned-debugSigned.apk
```

## Used resources/tools

- https://github.com/ollide/intellij-java2smali
- https://github.com/skylot/jadx
- https://github.com/iBotPeaches/Apktool
- https://github.com/patrickfav/uber-apk-signer
- https://github.com/frida/frida