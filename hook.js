// frida -U -l hook.js -n devRant
// frida -U -l hook.js --no-pause -f com.hexicallabs.devrant

Java.perform(() => {
  // decodeResources();
  hookReadAssetBytes();
});

function hookReadAssetBytes() {
  const String = Java.use('java.lang.String');
  const KrollAssetHelper = Java.use('org.appcelerator.kroll.util.KrollAssetHelper');

  KrollAssetHelper.readAssetBytes.implementation = function(path) {
    const ret = this.readAssetBytes(path);

    if (ret !== null && path === 'Resources/ui/common/RantListWindow.js') {
      const source = String.$new(ret);
      const patched = source.replaceAll('result.dpp', 'true');
      return String.$new(patched).getBytes();
    }

    return ret;
  };
}

function decodeResources() {
  const assets = [
    'Resources/ti.main.js',
    'Resources/app.js',
    'Resources/ui/common/AboutWindow.js',
    'Resources/ui/common/AccountDetailsWindow.js',
    'Resources/ui/common/AvatarItemLockedWindow.js',
    'Resources/ui/common/BlockingLoader.js',
    'Resources/ui/common/BonusSettingsWindow.js',
    'Resources/ui/common/BuildAvatarWindow.js',
    'Resources/ui/common/CommentListView.js',
    'Resources/ui/common/ContentLoader.js',
    'Resources/ui/common/DiscussionsWindow.js',
    'Resources/ui/common/ImageViewerWindow.js',
    'Resources/ui/common/InAppPurchases.js',
    'Resources/ui/common/MenuWindow.js',
    'Resources/ui/common/NotifWindow.js',
    'Resources/ui/common/NotificationsSettingsWindow.js',
    'Resources/ui/common/PostCollabWindow.js',
    'Resources/ui/common/PostRantWindow.js',
    'Resources/ui/common/PostTextArea.js',
    'Resources/ui/common/PostTypeWindow.js',
    'Resources/ui/common/ProfileWindow.js',
    'Resources/ui/common/RantListView5.js',
    'Resources/ui/common/RantListWindow.js',
    'Resources/ui/common/RantWindow.js',
    'Resources/ui/common/SearchWindow.js',
    'Resources/ui/common/SelectAvatarWindow.js',
    'Resources/ui/common/SettingsWindow.js',
    'Resources/ui/common/SharePromptWindow.js',
    'Resources/ui/common/SignupLoginWindow.js',
    'Resources/ui/common/SplashWindow.js',
    'Resources/ui/common/StickersWindow.js',
    'Resources/ui/common/SubscribedListView.js',
    'Resources/ui/common/SubscribedWindow.js',
    'Resources/ui/common/SupporterInfoWindow.js',
    'Resources/ui/common/SupporterListWindow.js',
    'Resources/ui/common/SupporterModalWindow.js',
    'Resources/ui/common/SwagWindow.js',
    'Resources/ui/common/TabBar.js',
    'Resources/ui/common/TagSelector.js',
    'Resources/ui/common/TopBar.js',
    'Resources/ui/common/Voter.js',
    'Resources/ui/common/WeekliesWindow.js',
    'Resources/ti.playservices/ti.playservices.bootstrap.js',
    'Resources/_app_props_.json',
    'Resources/ti.internal/bootstrap.json',
  ];

  Java.choose('com.hexicallabs.devrant.AssetCryptImpl', {
    onMatch(instance) {
      for (const asset of assets) {
        console.log('######', asset);
        console.log(instance.readAsset(asset));
      }
    },
    onComplete() { },
  });
}
