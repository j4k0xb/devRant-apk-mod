function NotificationsSettingsWindow() {
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
          barTitle: "Notifications",
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
        endpoint: "users/me/notifications",

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
              "We had trouble loading your notif settings. Please close this window and try again!"
            ));
    },
    buildOptionsFromResult = function (result) {
      var sections = [
        {
          id: "notif",
          title: "Push Notifications",
        },

        {
          id: "email",
          title: "Email Notifications",
        },
      ];

      if (result.settings)
        for (
          var result = result.settings,
            toggleSectionSize = 80,
            lblSectionSize = Ti.App.realWidth - toggleSectionSize - 8,
            padding = 10,
            i = 0;
          i < sections.length;
          ++i
        ) {
          var section_id = sections[i].id,
            section_title = sections[i].title,
            lblTitle = Ti.UI.createLabel({
              text: section_title,
              color: Ti.App.colorHint,
              left: padding,
              top: 10,
              font: {
                fontSize: Ti.App.fontS,
                fontWeight: "bold",
              },
            });

          me.contentContainer.add(lblTitle);
          for (var j = 0; j < result[section_id].length; ++j) {
            var toggleRow = Ti.UI.createView({
                width: Ti.App.realWidth,
                height: Ti.UI.SIZE,
              }),
              lblSetting = Ti.UI.createLabel({
                text: result[section_id][j].val,
                left: padding,
                width: lblSectionSize,
                height: Ti.UI.SIZE,
                color: Ti.App.colorDarkGrey,
              });

            toggleRow.add(lblSetting);
            var switchParams = {
                value: result[section_id][j].on,
                right: padding,
              },
              switchContainer = Ti.UI.createSwitch(switchParams);
            (switchContainer.setting_id = result[section_id][j].id),
              switchContainer.addEventListener("change", toggleChanged),
              toggleRow.add(switchContainer),
              me.contentContainer.add(toggleRow);
            var divider = Ti.UI.createView({
              width: Ti.App.realWidth - 20,
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
      (params = {}), (params[e.source.setting_id] = e.value);
      var apiArgs = {
        method: "POST",
        endpoint: "users/me/notifications",
        params: params,
        includeAuth: true,
      };

      Ti.App.api(apiArgs);
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
        Ti.App.tabBar.closedWindow("notif_settings"),
        noClose || me.window.close({ animated: animated }),
        (me = null);
    }),
    me
  );
}

module.exports = NotificationsSettingsWindow;
