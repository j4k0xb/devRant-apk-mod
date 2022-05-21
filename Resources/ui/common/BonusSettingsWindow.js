function BonusSettingsWindow() {
  var me = this;

  (me.window = null),
    (me.container = null),
    (me.contentContainer = null),
    (me.blockingLoader = null),
    (me.init = function () {
      me.createElements();
    }),
    (me.getWindow = function () {
      return me.window;
    }),
    (me.createElements = function () {
      (me.window = Ti.UI.createWindow({
        navBarHidden: true,
        backgroundColor: Ti.App.colorBg,
        width: "100%",
        height: "100%",
        orientationModes: [Ti.UI.PORTRAIT],
      })),
        me.window.addEventListener("close", windowClosed),
        (me.container = Ti.UI.createView({
          width: "100%",
          height: "100%",
        })),
        me.window.add(me.container),
        createSubSections(),
        fetchData();
    });
  var windowOpened = function () {},
    createSubSections = function () {
      createTopBar(),
        (me.contentContainer = Ti.UI.createView({
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
          barTitle: "Bonus Settings (devRant++)",
          callbackLeftBtn: function () {
            me.closeWindow();
          },
        },
        topBar = Ti.App.topBarGenerator.createBar(topBarOptions);
      me.container.add(topBar);
    },
    fetchData = function () {
      var apiArgs = {
        method: "GET",
        endpoint: "users/me/bonus-settings",

        callback: getNotificationSettingsComplete,
        includeAuth: true,
      };

      Ti.App.api(apiArgs);
    },
    getNotificationSettingsComplete = function (result) {
      null == me ||
        (result.success
          ? buildOptionsFromResult(result)
          : Ti.App.showDialog(
              "Whoops!",
              "We had trouble loading your bonus settings. Please close this window and try again!"
            ));
    },
    buildOptionsFromResult = function (result) {
      if (result.settings) {
        var result = result.settings,
          toggleSectionSize = 80,
          lblSectionSize = Ti.App.realWidth - toggleSectionSize - 8,
          padding = 10,
          toggleRow = Ti.UI.createView({
            top: 8,
            width: Ti.App.realWidth,
            height: Ti.UI.SIZE,
          }),
          lblSetting = Ti.UI.createLabel({
            text: "Binary user scores",
            left: padding,
            width: lblSectionSize,
            height: Ti.UI.SIZE,
            color: Ti.App.colorDarkGrey,
          });

        toggleRow.add(lblSetting);
        var switchParams = {
            value: Ti.App.binaryScores,
            right: padding,
          },
          switchContainer = Ti.UI.createSwitch(switchParams);
        (switchContainer.setting_id = "binaryScores"),
          switchContainer.addEventListener("change", localSettingToggleChanged),
          toggleRow.add(switchContainer),
          me.contentContainer.add(toggleRow);
        var divider = Ti.UI.createView({
          width: Ti.App.realWidth - 2 * padding,
          height: 1,
          backgroundColor: Ti.App.colorLine,
          top: 10,
          bottom: 8,
        });

        me.contentContainer.add(divider);

        for (var j = 0; j < result.length; ++j) {
          var toggleRow = Ti.UI.createView({
              top: 8,
              width: Ti.App.realWidth,
              height: Ti.UI.SIZE,
            }),
            lblSetting = Ti.UI.createLabel({
              text: result[j].val,
              left: padding,
              width: lblSectionSize,
              height: Ti.UI.SIZE,
              color: Ti.App.colorDarkGrey,
            });

          toggleRow.add(lblSetting);
          var switchParams = {
              value: result[j].on,
              right: padding,
            },
            switchContainer = Ti.UI.createSwitch(switchParams);
          (switchContainer.setting_id = result[j].id),
            switchContainer.addEventListener("change", toggleChanged),
            toggleRow.add(switchContainer),
            me.contentContainer.add(toggleRow);
          var divider = Ti.UI.createView({
            width: Ti.App.realWidth - 2 * padding,
            height: 1,
            backgroundColor: Ti.App.colorLine,
            top: 10,
            bottom: 8,
          });

          me.contentContainer.add(divider);
        }
      }
    },
    toggleChanged = function (e) {
      if (true == e.value && !Ti.App.dpp)
        return (e.source.value = false), void Ti.App.openSupporterInfoWindow();

      (params = {}), (params[e.source.setting_id] = e.value);

      var apiArgs = {
        method: "POST",
        endpoint: "users/me/bonus-settings",
        params: params,
        includeAuth: true,
      };

      Ti.App.api(apiArgs), e.value && showSuccessMessage();
    },
    localSettingToggleChanged = function (e) {
      return true != e.value || Ti.App.dpp
        ? void ((Ti.App[e.source.setting_id] = e.value),
          e.value && showSuccessMessage())
        : ((e.source.value = false), void Ti.App.openSupporterInfoWindow());
    },
    showSuccessMessage = function () {
      Ti.App.showDialog(
        "Success!",
        "Bonus setting turned on! Note: you might have to reload the screen you were on to see the change reflected."
      );
    };

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
        Ti.App.tabBar.closedWindow("bonus_settings"),
        noClose || me.window.close({ animated: animated }),
        (me = null);
    }),
    me
  );
}

module.exports = BonusSettingsWindow;
