function SettingsWindow() {
  var me = this;

  (me.window = null),
    (me.container = null),
    (me.contentContainer = null),
    (me.blockingLoader = null),
    (me.btnDarkTheme = null),
    (me.abortNextDarkToggle = false),
    (me.init = function () {
      me.createElements();
    }),
    (me.getWindow = function () {
      return me.window;
    }),
    (me.createElements = function () {
      null == me.window
        ? ((me.window = Ti.UI.createWindow({
            navBarHidden: true,
            backgroundColor: Ti.App.colorBg,
            width: "100%",
            height: "100%",
            orientationModes: [Ti.UI.PORTRAIT],
          })),
          me.window.addEventListener("close", windowClosed))
        : (me.window.backgroundColor = Ti.App.colorBg),
        (me.container = Ti.UI.createView({
          width: "100%",
          height: "100%",
        })),
        me.window.add(me.container),
        createSubSections(),
        createMenuItems();

      var BlockingLoader = require("ui/common/BlockingLoader");

      (me.blockingLoader = new BlockingLoader()),
        me.window.add(me.blockingLoader.getElem());
    });
  var windowOpened = function () {},
    createMenuItems = function () {
      var btnEditTheme = generateMenuItem("Change theme (join the dark side)");

      if (
        (me.contentContainer.add(btnEditTheme),
        btnEditTheme.addEventListener("click", _btnEditThemeClicked),
        Ti.App.isLoggedIn())
      ) {
        var btnNotifications = generateMenuItem("Notifications");
        me.contentContainer.add(btnNotifications),
          btnNotifications.addEventListener("click", btnNotificationsClicked);

        var btnAccountDetails = generateMenuItem("Edit username or email");

        if (
          (me.contentContainer.add(btnAccountDetails),
          btnAccountDetails.addEventListener("click", btnAccountDetailsClicked),
          Ti.App.dpp)
        ) {
          var btnDpp = generateMenuItem("devRant++ (supporter program)");
          me.contentContainer.add(btnDpp),
            btnDpp.addEventListener("click", Ti.App.openSupporterInfoWindow);
        }
      }

      var btnHideReposts = generateMenuItem(
        "Hide rants voted 'repost'?",
        true,
        "hideReposts",
        false,
        true
      );
      me.contentContainer.add(btnHideReposts),
        btnHideReposts.addEventListener("change", btnHideRepostsChanged);

      var btnShowShare = generateMenuItem(
        "Show share options\nafter posting rant?",
        true,
        "showShareAfterPost",
        true,
        true
      );
      me.contentContainer.add(btnShowShare),
        btnShowShare.addEventListener("change", btnShowShareChanged);

      var btnAutoLoadImages = generateMenuItem(
        "Auto load feed images?",
        true,
        "autoLoadImages",
        true,
        true
      );
      me.contentContainer.add(btnAutoLoadImages),
        btnAutoLoadImages.addEventListener("change", btnAutoLoadImagesChanged);

      var btnRantAvatarImages = generateMenuItem(
        "Avatar images on rants?",
        true,
        "rantAvatarImages",
        true,
        true
      );
      me.contentContainer.add(btnRantAvatarImages),
        btnRantAvatarImages.addEventListener(
          "change",
          btnRantAvatarImagesChanged
        );

      var btnNotifAvatarImages = generateMenuItem(
        "Avatar images on notifs?",
        true,
        "notifsAvatarImages",
        true,
        true
      );
      me.contentContainer.add(btnNotifAvatarImages),
        btnNotifAvatarImages.addEventListener(
          "change",
          btnNotifsAvatarImagesChanged
        );

      var btnBonusSettings = generateMenuItem("Bonus settings");
      me.contentContainer.add(btnBonusSettings),
        btnBonusSettings.addEventListener("click", btnBonusSettingsClicked);

      var btnClearCache = generateMenuItem("Clear image cache");

      if (
        (me.contentContainer.add(btnClearCache),
        btnClearCache.addEventListener("click", clearCache),
        Ti.App.isLoggedIn())
      ) {
        var btnLogout = generateMenuItem("Log out");
        (btnLogout.top = 30),
          me.contentContainer.add(btnLogout),
          btnLogout.addEventListener("click", btnLogoutClicked);

        var btnDeleteAccount = generateMenuItem("Delete account");
        me.contentContainer.add(btnDeleteAccount),
          btnDeleteAccount.addEventListener("click", btnDeleteAccountClicked);
      }
    },
    _btnEditThemeClicked = function () {
      var items = [
          "Go Towards the Light",
          "Hello Darkness, My Old Friend",
          "Blackest Black (devRant++ only)",
        ],
        cancelIndex = -1;

      Ti.App.isAndroid || ((cancelIndex = items.length), items.push("Cancel"));

      var opts = {
        options: items,
        title: "Please select your theme choice",
      };

      -1 != cancelIndex && (opts.cancel = cancelIndex);

      var dialog = Ti.UI.createOptionDialog(opts);
      dialog.addEventListener("click", themeChanged), dialog.show();
    },
    themeChanged = function (e) {
      if (!(2 < e.index || 0 > e.index)) {
        if (!Ti.App.isLoggedIn())
          return void Ti.App.openSignupWindow("theme_change");

        var useTheme = e.index + 1;

        if (useTheme == Ti.App.theme)
          return void Ti.App.showDialog(
            "Whoops!",
            "It looks like you already have that theme selected. Please select another theme if you want to change it."
          );

        if (3 == useTheme && !Ti.App.dpp) {
          var dialog = Ti.UI.createAlertDialog({
            message:
              "Sorry, you need to be a devRant++ member to use the black theme.",
            title: "Whoops!",
            buttonNames: ["Ok", "Learn about devRant++"],
          });

          return (
            dialog.addEventListener("click", function (e) {
              1 == e.index && Ti.App.openSupporterInfoWindow();
            }),
            void dialog.show()
          );
        }

        (Ti.App.theme = useTheme),
          Ti.App.Properties.setInt("theme", Ti.App.theme),
          Ti.App.parseColors(),
          Ti.App.tabBar.destroyAllTabs(),
          Ti.UI.setBackgroundColor(Ti.App.colorBg),
          Ti.App.tabBar.rebuild();
      }
    },
    btnHideRepostsChanged = function (e) {
      Ti.App.Properties.setBool("hideReposts", e.value);
    },
    btnShowShareChanged = function (e) {
      Ti.App.Properties.setBool("showShareAfterPost", e.value);
    },
    btnAutoLoadImagesChanged = function (e) {
      Ti.App.Properties.setBool("autoLoadImages", e.value),
        (Ti.App.autoLoadImages = e.value),
        Ti.App.logStat("Setting Auto Load Images", {
          new_value: e.value ? 1 : 0,
        });
    },
    btnRantAvatarImagesChanged = function (e) {
      Ti.App.Properties.setBool("rantAvatarImages", e.value),
        (Ti.App.rantAvatarImages = e.value),
        Ti.App.logStat("Setting Rant Avatar Images", {
          new_value: e.value ? 1 : 0,
        });
    },
    btnNotifsAvatarImagesChanged = function (e) {
      Ti.App.Properties.setBool("notifsAvatarImages", e.value),
        (Ti.App.notifsAvatarImages = e.value),
        Ti.App.tabBar.destroyTab("notifs"),
        Ti.App.logStat("Setting Notifs Avatar Images", {
          new_value: e.value ? 1 : 0,
        });
    },
    btnNotificationsClicked = function () {
      var NotificationsSettingsWindow = require("ui/common/NotificationsSettingsWindow"),
        notificationsSettingsWindow = new NotificationsSettingsWindow();
      notificationsSettingsWindow.init(),
        Ti.App.tabBar.openWindow(
          notificationsSettingsWindow.getWindow(),
          notificationsSettingsWindow,
          "notif_settings"
        ),
        "" == Ti.App.getCurrentDeviceToken() &&
          Ti.App.promtForNotificationPermIfNeeded();
    },
    btnBonusSettingsClicked = function () {
      if (!Ti.App.isLoggedIn()) return void Ti.App.openSignupWindow();
      var BonusSettingsWindow = require("ui/common/BonusSettingsWindow"),
        bonusSettingsWindow = new BonusSettingsWindow();
      bonusSettingsWindow.init(),
        Ti.App.tabBar.openWindow(
          bonusSettingsWindow.getWindow(),
          bonusSettingsWindow,
          "bonus_settings"
        );
    },
    btnAccountDetailsClicked = function () {
      var AccountDetailsWindow = require("ui/common/AccountDetailsWindow"),
        accountDetailsWindow = new AccountDetailsWindow();
      accountDetailsWindow.init();
    },
    btnLogoutClicked = function () {
      Ti.App.logout(),
        Ti.App.logStat("Logout"),
        me.closeWindow(),
        Ti.App.tabBar.destroyAllTabs();
      var dialog = Ti.UI.createAlertDialog({
        message: "You are now logged out of your account.",
        ok: "Ok",
        title: "Success!",
      });

      dialog.show();
    },
    doubleConfirmAccountDelete = function () {
      var dialog = Ti.UI.createAlertDialog({
        cancel: 1,
        buttonNames: ["Ok", "Cancel"],
        message:
          "Are you sure you want to do this? It can't be undone, last warning!",
        title: "Really delete account?",
      });

      dialog.addEventListener("click", function (e) {
        0 == e.index && deleteAccount();
      }),
        dialog.show();
    },
    btnDeleteAccountClicked = function () {
      var dialog = Ti.UI.createAlertDialog({
        cancel: 1,
        buttonNames: ["Ok", "Cancel"],
        message:
          "Are you sure you want to delete your account? This cannot be undone, and all of the rants, comments and votes you've added will be removed completely.",
        title: "Delete account?",
      });

      dialog.addEventListener("click", function (e) {
        0 == e.index && doubleConfirmAccountDelete();
      }),
        dialog.show();
    },
    deleteAccount = function () {
      me.blockingLoader.showLoader();
      var params = {},
        apiArgs = {
          method: "DELETE",
          endpoint: "users/me",
          params: params,
          callback: function (result) {
            var dialogMessage = "",
              dialogTitle = "";

            result.success
              ? ((dialogMessage = "Your account has been deleted!"),
                (dialogTitle = "Success!"))
              : ((dialogMessage =
                  "There was an error deleting your account. Please try again."),
                (dialogTitle = "Error"),
                me.blockingLoader.hideLoader());

            var dialog = Ti.UI.createAlertDialog({
              message: dialogMessage,
              ok: "Ok",
              title: dialogTitle,
            });

            dialog.show(),
              result.success &&
                (Ti.App.logout(), Ti.App.tabBar.destroyAllTabs());
          },
          includeAuth: true,
        };

      Ti.App.api(apiArgs);
    },
    generateMenuItem = function (
      title,
      toggle,
      toggleField,
      toggleDefault,
      toggleOnValue
    ) {
      var useContainer,
        container = Ti.UI.createView({
          width: "94%",
          height: Ti.UI.SIZE,
          layout: "vertical",
        });

      toggle
        ? ((useContainer = Ti.UI.createView({
            width: "100%",
            height: Ti.UI.SIZE,
          })),
          container.add(useContainer))
        : (useContainer = container);

      var lblTitle = Ti.UI.createLabel({
        top: 10,
        bottom: 10,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        left: 0,
        color: Ti.App.colorDarkGrey,
        text: title,
        font: {
          fontSize: Ti.App.fontBtn,
        },
      });

      if (
        (toggle ? useContainer.add(lblTitle) : container.add(lblTitle), toggle)
      ) {
        var switchParams = {
            value:
              Ti.App.Properties.getBool(toggleField, toggleDefault) ==
              toggleOnValue,
            right: 0,
          },
          switchContainer = Ti.UI.createSwitch(switchParams);
        useContainer.add(switchContainer),
          (container.switchContainer = switchContainer);
      }

      var dividerLine = Ti.UI.createView({
        width: "100%",
        height: 1,
        backgroundColor: Ti.App.colorLine,
      });

      return container.add(dividerLine), container;
    },
    createSubSections = function () {
      createTopBar(),
        (me.contentContainer = Ti.UI.createScrollView({
          top: Ti.App.topBarGenerator.topBarHeight,
          width: "100%",
          height: Ti.UI.FILL,
          layout: "vertical",
        })),
        me.container.add(me.contentContainer);
    },
    createTopBar = function () {
      var topBarOptions = {
          leftBtnType: "back",
          rightBtnType: "none",
          barTitle: "Settings",
          callbackLeftBtn: function () {
            me.closeWindow();
          },
        },
        topBar = Ti.App.topBarGenerator.createBar(topBarOptions);
      me.container.add(topBar);
    },
    clearCache = function () {
      try {
        var temp = Ti.Filesystem.getApplicationCacheDirectory(),
          cacheDir = Titanium.Filesystem.getFile(temp);
        cacheDir.deleteDirectory(true),
          Ti.App.showDialog("Done!", "The image cache has been cleared!");
      } catch (exc) {}
    };

  me.showBlockingLoader = function () {
    var BlockingLoader = require("ui/common/BlockingLoader");
    (me.blockingLoader = new BlockingLoader()),
      me.window.add(me.blockingLoader.getElem()),
      me.blockingLoader.showLoader();
  };
  var fetchData = function () {
      params = {
        last_comment_id: me.commentList.lastCommentId,
      };

      var apiArgs = {
        method: "GET",
        endpoint: "devrant/rants/" + me.rantId,
        params: params,
        callback: getRantComplete,
        includeAuth: true,
      };

      Ti.App.api(apiArgs);
    },
    getRantComplete = function (result) {};

  me.getContainer = function () {
    return me.container;
  };

  var windowClosed = function () {
    me.closeWindow(false, true);
  };

  return (
    (me.closeWindow = function (animated, noClose) {
      me.window.removeEventListener("close", windowClosed),
        (noClose = noClose || false),
        null == animated && (animated = true),
        Ti.App.tabBar.closedWindow("settings"),
        noClose || me.window.close({ animated: animated }),
        (me = null);
    }),
    me
  );
}

module.exports = SettingsWindow;
