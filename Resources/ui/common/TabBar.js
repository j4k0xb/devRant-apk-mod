function TabBar() {
  var me = this;

  me.locked = false;
  var container,
    selectedTabIndex,
    tabViews,
    tabIdsToIndex,
    openWindows = {},
    contentMaxes = {
      rant: 2,
    },
    tabInfo = [
      {
        id: "rants",
        labelText: "\uE80C",
        labelSize: 28,
      },

      {
        id: "stories",
        labelText: "\uE810",
        labelSize: 28,
      },

      {
        id: "subscribed",
        labelText: "\uE91E",
        labelSize: 28,
        loggedInOnly: true,
      },

      {
        id: "notifs",
        labelText: "\uE908",
        labelSize: 28,
        hasBadge: true,
        loggedInOnly: true,
      },

      {
        id: "more",
        labelText: "\uE802",
        labelSize: 28,
      },
    ];

  (me.init = function () {
    (selectedTabIndex = 0),
      createElements(),
      showIndicatorOnSelectedTab(),
      me.callbackRants();
  }),
    (me.getOpenWindows = function () {
      return openWindows;
    }),
    (me.getView = function () {
      return container;
    }),
    (me.saveTab = function (id, window, obj) {
      var currentTabs = Ti.App.savedTabs;

      (currentTabs[id] = {
        window: window,
        obj: obj,
      }),
        (Ti.App.savedTabs = currentTabs);
    }),
    (me.getTopWindowOfType = function (type) {
      var tabId = Ti.App.isAndroid ? "global" : tabInfo[selectedTabIndex].id;
      return openWindows[tabId] &&
        openWindows[tabId][type] &&
        openWindows[tabId][type].length
        ? openWindows[tabId][type][openWindows[tabId][type].length - 1]
        : null;
    }),
    (me.rebuild = function () {
      for (
        var children = container.children, i = children.length - 1;
        0 <= i;
        --i
      )
        container.remove(children[i]);

      createElements(), showIndicatorOnSelectedTab();
    }),
    (me.openWindow = function (window, obj, type) {
      var tabId = Ti.App.isAndroid ? "global" : tabInfo[selectedTabIndex].id;

      null == openWindows[tabId] && (openWindows[tabId] = {}),
        null == openWindows[tabId][type] && (openWindows[tabId][type] = []),
        openWindows[tabId][type].push({ window: window, obj: obj }),
        Ti.App.isAndroid
          ? window.open()
          : Ti.App.savedTabs[tabId].window.openWindow(window);

      var maxWindows = 1;
      void 0 !== contentMaxes[type] && (maxWindows = contentMaxes[type]),
        openWindows[tabId][type].length > maxWindows &&
          openWindows[tabId][type][0].obj.closeWindow();
    });

  var closeOpenWindows = function () {
    var tabId = tabInfo[selectedTabIndex].id,
      closed = false;

    for (var winType in openWindows[tabId]) {
      var n = openWindows[tabId][winType].length,
        toClose = [];

      if (0 != n) {
        closed = true;
        for (var i = 0; i < n; ++i)
          toClose.push(openWindows[tabId][winType][i].obj);

        for (i = 0; i < n; ++i) toClose[i].closeWindow();
      }
    }
    return closed;
  };

  me.closedWindow = function (type, winObj) {
    var tabId = Ti.App.isAndroid ? "global" : tabInfo[selectedTabIndex].id;
    if (null != openWindows[tabId]) {
      var openedWindows = openWindows[tabId][type];
      if (null != openedWindows) {
        if (null == winObj) openedWindows.pop();
        else
          for (var i = 0; i < openedWindows.length; ++i)
            if (openedWindows[i].obj == winObj) {
              openedWindows.splice(i, 1);
              break;
            }

        openWindows[tabId][type] = openedWindows;
      }
    }
  };
  var showIndicatorOnSelectedTab = function () {
      var indicator = Ti.UI.createView({
        top: 1,
        width: "60%",
        height: 4,
        backgroundColor: Ti.App.colorTabText,
        borderRadius: 3,
        borderWidth: 0,
        touchEnabled: false,
      });

      (tabViews[selectedTabIndex].icon.color = Ti.App.colorTabText),
        (tabViews[selectedTabIndex].indicator = indicator),
        tabViews[selectedTabIndex].add(indicator);
    },
    removeIndicatorFromSelectedTab = function () {
      tabViews[selectedTabIndex].remove(tabViews[selectedTabIndex].indicator),
        delete tabViews[selectedTabIndex].indicator,
        (tabViews[selectedTabIndex].icon.color = Ti.App.colorFieldIcon);
    };

  me.setLocked = function (locked) {
    me.locked = locked;
  };
  var tabClicked = function (e) {
      if (!(me.locked || e.cancelBuble || !e.source.touchEnabled)) {
        e.cancelBubble = true;
        var tabIndex = e.source.tabIndex,
          selectedTabInfo = tabInfo[tabIndex];

        if (selectedTabInfo.loggedInOnly && !Ti.App.isLoggedIn())
          return void Ti.App.openSignupWindow("tab");

        var isSameTab = selectedTabIndex == tabIndex;

        if (isSameTab) {
          var doRefresh = true;

          if (
            (Ti.App.isAndroid || (doRefresh = !closeOpenWindows()), doRefresh)
          )
            if ("rants" == selectedTabInfo.id) me.refreshMainFeed();
            else if ("subscribed" == selectedTabInfo.id) me.refreshSubscribed();
            else if ("stories" == selectedTabInfo.id) me.refreshStories();
            else if ("notifs" == selectedTabInfo.id) {
              var notifsObj = Ti.App.savedTabs.notifs.obj;
              notifsObj &&
                notifsObj.listSection &&
                notifsObj.listSection.items.length &&
                notifsObj.listContainer.scrollToItem(0, 0);
            } else "collabs" == selectedTabInfo.id && me.refreshCollabs();

          return;
        }
        hideCurrentTab(),
          removeIndicatorFromSelectedTab(),
          (selectedTabIndex = tabIndex),
          showIndicatorOnSelectedTab();
        var tabId = selectedTabInfo.id;
        return Ti.App.savedTabs[tabId]
          ? (Ti.App.savedTabs[tabId].window.show(),
            (Ti.App.savedTabs[tabId].window.zIndex = 2),
            void (
              Ti.App.savedTabs[tabId].obj.onTabShow &&
              Ti.App.savedTabs[tabId].obj.onTabShow()
            ))
          : void me[
              "callback" + tabId.charAt(0).toUpperCase() + tabId.slice(1)
            ]();
      }
    },
    hideCurrentTab = function () {
      var tabId = tabInfo[selectedTabIndex].id;
      if (Ti.App.savedTabs[tabId]) {
        var window = Ti.App.savedTabs[tabId].window;
        (window.zIndex = 1),
          Ti.App.isAndroid
            ? setTimeout(function () {
                window.hide();
              }, 300)
            : window.hide(),
          Ti.App.savedTabs[tabId].obj.onTabHide &&
            Ti.App.savedTabs[tabId].obj.onTabHide();
      }
    },
    createElements = function () {
      var _Mathceil = Math.ceil;
      (tabViews = []),
        (tabIdsToIndex = {}),
        null == container
          ? ((container = Ti.UI.createView({
              width: Ti.App.realWidth,
              height: Ti.App.tabBarHeight + (Ti.App.isAndroid ? 1 : 0),
              backgroundColor: Ti.App.colorBgTabs,
            })),
            container.addEventListener("touchstart", tabClicked))
          : (container.backgroundColor = Ti.App.colorBgTabs);
      var divider = Ti.UI.createView({
        top: 0,
        width: Ti.App.realWidth,
        height: 1,
        backgroundColor:
          3 == Ti.App.theme ? Ti.App.colorBlack : Ti.App.colorLine,
        zIndex: 1,
      });
      container.add(divider);

      for (
        var useTabWidth = _Mathceil(Ti.App.realWidth / tabInfo.length), i = 0;
        i < tabInfo.length;
        ++i
      ) {
        var thisTabInfo = tabInfo[i],
          thisTab = Ti.UI.createView({
            tabIndex: i,
            width: useTabWidth,
            height: Ti.App.tabBarHeight,
            backgroundColor: Ti.App.colorBgTabs,
            left: useTabWidth * i,
          });

        tabViews.push(thisTab),
          (tabIdsToIndex[thisTabInfo.id] = i),
          container.add(thisTab);

        var lblTabIcon = Ti.UI.createLabel({
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          color: Ti.App.colorFieldIcon,
          font: {
            fontFamily: "icomoon",
            fontSize: thisTabInfo.labelSize + "sp",
          },

          tabIndex: i,
          text: thisTabInfo.labelText,
          touchEnabled: false,
        });

        if (
          ((thisTab.icon = lblTabIcon),
          thisTab.add(lblTabIcon),
          thisTabInfo.hasBadge)
        ) {
          var indicatorContainer = Ti.UI.createView({
              top: Ti.App.isIphoneX ? 10 : 5,
              left: 0.5 * useTabWidth,
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 0,
              backgroundColor: Ti.App.colorBgTabs,
              touchEnabled: false,
              visible: false,
              tabIndex: i,
            }),
            innerCircle = Ti.UI.createView({
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 0,
              touchEnabled: false,
              backgroundColor: Ti.App.colorNotif,
              tabIndex: i,
            });

          indicatorContainer.add(innerCircle);

          var lblCount = Ti.UI.createLabel({
            width: "100%",
            height: "100%",
            text: "6",
            color: Ti.App.colorBtnInverse,
            touchEnabled: false,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            font: {
              fontSize: Ti.App.fontS,
              fontWeight: "bold",
            },

            tabIndex: i,
          });

          (indicatorContainer.lblCount = lblCount),
            indicatorContainer.add(lblCount),
            (thisTab.badgeContainer = indicatorContainer),
            thisTab.add(indicatorContainer);
        }
      }
    };

  (me.setBadgeCount = function (tabId, count) {
    var badgeContainer = tabViews[tabIdsToIndex[tabId]].badgeContainer;

    0 == count
      ? (badgeContainer.visible = false)
      : ((badgeContainer.lblCount.font = {
          fontSize: 10 > count ? Ti.App.fontBody : Ti.App.fontS,
          fontWeight: "bold",
        }),
        (badgeContainer.lblCount.text = 100 > count ? count : "99"),
        (badgeContainer.visible = true));
  }),
    (me.callbackRants = function (reset) {
      var RantListWindow = require("ui/common/RantListWindow"),
        rantListWindow = new RantListWindow();

      if ((rantListWindow.init(false, null, false), !Ti.App.isAndroid)) {
        var window = Titanium.UI.createNavigationWindow({
          top: 0,

          window: rantListWindow.getWindow(),
          height: Ti.UI.FILL,
          bottom: Ti.App.tabBarHeight,
        });

        me.saveTab("rants", window, rantListWindow), window.open();
      } else {
        var window = rantListWindow.getWindow();
        me.saveTab("rants", window, rantListWindow),
          Ti.App.mainAppWindow.add(window);
      }
    }),
    (me.callbackStories = function (reset) {
      var RantListWindow = require("ui/common/RantListWindow"),
        rantListWindow = new RantListWindow();

      if ((rantListWindow.init(false, null, true), !Ti.App.isAndroid)) {
        var window = Titanium.UI.createNavigationWindow({
          top: 0,
          window: rantListWindow.getWindow(),
          height: Ti.UI.FILL,
          bottom: Ti.App.tabBarHeight,
        });

        me.saveTab("stories", window, rantListWindow), window.open();
      } else {
        var window = rantListWindow.getWindow();
        me.saveTab("stories", window, rantListWindow),
          Ti.App.mainAppWindow.add(window);
      }
    }),
    (me.callbackSubscribed = function () {
      var SubscribedWindow = require("ui/common/SubscribedWindow"),
        subscribedWindow = new SubscribedWindow();

      if (
        (subscribedWindow.init(false, null, false, true), !Ti.App.isAndroid)
      ) {
        var window = Titanium.UI.createNavigationWindow({
          top: 0,
          window: subscribedWindow.getWindow(),
          height: Ti.UI.FILL,
          bottom: Ti.App.tabBarHeight,
        });

        me.saveTab("subscribed", window, subscribedWindow), window.open();
      } else {
        var window = subscribedWindow.getWindow();
        me.saveTab("subscribed", window, subscribedWindow),
          Ti.App.mainAppWindow.add(window);
      }
    });

  var callbackCollabs = function (reset) {};

  return (
    (me.callbackNotifs = function (reset) {
      var NotifWindow = require("ui/common/NotifWindow"),
        notifWindow = new NotifWindow();
      if ((notifWindow.init(), !Ti.App.isAndroid)) {
        var window = Titanium.UI.createNavigationWindow({
          top: 0,
          window: notifWindow.getWindow(),
          height: Ti.UI.FILL,
          bottom: Ti.App.tabBarHeight,
        });
        me.saveTab("notifs", window, notifWindow), window.open();
      } else {
        var window = notifWindow.getWindow();
        me.saveTab("notifs", window, notifWindow),
          Ti.App.mainAppWindow.add(window);
      }
    }),
    (me.refreshMainFeed = function () {
      Ti.App.savedTabs.rants && Ti.App.savedTabs.rants.obj.doRefresh();
    }),
    (me.refreshSubscribed = function () {
      Ti.App.savedTabs.subscribed &&
        Ti.App.savedTabs.subscribed.obj.doRefresh();
    }),
    (me.refreshStories = function () {
      Ti.App.savedTabs.stories && Ti.App.savedTabs.stories.obj.doRefresh();
    }),
    (me.refreshWeeklyRant = function () {
      if (Ti.App.savedTabs.more) {
        var weeklyWindow = me.getTopWindowOfType("weekly_feed");
        weeklyWindow && weeklyWindow.obj.doRefresh();
      }
    }),
    (me.refreshCollabs = function () {
      Ti.App.savedTabs.collabs && Ti.App.savedTabs.collabs.obj.doRefresh();
    }),
    (me.refreshProfile = function () {
      me.refreshProfileByUserId(null);
    }),
    (me.refreshProfileByUserId = function (userId) {
      for (var tabId in openWindows) {
        var openProfiles = openWindows[tabId].profile;
        if (openProfiles)
          for (var thisProfile, i = 0; i < openProfiles.length; ++i)
            (thisProfile = openProfiles[i].obj),
              (null == userId || userId == thisProfile.userId) &&
                (thisProfile.destroy(), thisProfile.init(thisProfile.userId));
      }
    }),
    (me.callbackMore = function (reset) {
      var MenuWindow = require("ui/common/MenuWindow"),
        menuWindow = new MenuWindow();
      if ((menuWindow.init(), !Ti.App.isAndroid)) {
        var window = Titanium.UI.createNavigationWindow({
          top: 0,
          window: menuWindow.getWindow(),
          height: Ti.UI.FILL,
          bottom: Ti.App.tabBarHeight,
        });
        me.saveTab("more", window, menuWindow), window.open();
      } else {
        var window = menuWindow.getWindow();
        me.saveTab("more", window, menuWindow),
          Ti.App.mainAppWindow.add(window);
      }
    }),
    (me.destroyTab = function (tabId) {
      var currentTabs = Ti.App.savedTabs,
        tabIdForWindows = Ti.App.isAndroid ? "global" : tabId;
      if (openWindows[tabIdForWindows])
        for (var winType in openWindows[tabIdForWindows])
          for (
            var i = openWindows[tabIdForWindows][winType].length - 1;
            0 <= i;
            --i
          )
            openWindows[tabIdForWindows][winType][i].obj.closeWindow();
      currentTabs[tabId] &&
        (currentTabs[tabId].obj.closeWindow(false, false),
        Ti.App.isAndroid
          ? Ti.App.mainAppWindow.remove(currentTabs[tabId].window)
          : currentTabs[tabId].window.close(),
        delete currentTabs[tabId]),
        (Ti.App.savedTabs = currentTabs);
    }),
    (me.destroyAllTabsExceptMore = function () {
      me.destroyTab("stories"),
        me.destroyTab("subscribed"),
        me.destroyTab("notifs"),
        me.destroyTab("more"),
        me.destroyTab("rants"),
        me.navigateToTabByIndex(0);
    }),
    (me.destroyAllTabs = function () {
      me.destroyTab("stories"),
        me.destroyTab("subscribed"),
        me.destroyTab("notifs"),
        me.destroyTab("more"),
        me.destroyTab("rants"),
        me.navigateToTabByIndex(0);
    }),
    (me.navigateToTabById = function (navigateToTabId) {
      for (var foundAtIndex = -1, i = 0; i < tabInfo.length; ++i)
        if (tabInfo[i].id == navigateToTabId) {
          foundAtIndex = i;
          break;
        }
      -1 != foundAtIndex &&
        tabClicked({ source: { tabIndex: foundAtIndex, touchEnabled: true } });
    }),
    (me.navigateToTabByIndex = function (index) {
      tabClicked({ source: { tabIndex: index, touchEnabled: true } });
    }),
    (me.mainWindowPaused = function () {
      null == me || me.callFuncOnTabs("onAppPause");
    }),
    (me.mainWindowResumed = function () {
      null == me || me.callFuncOnTabs("onAppResume");
    }),
    (me.callFuncOnTabs = function (func) {
      var currentTabs = Ti.App.savedTabs,
        currentTabId = me.getCurrentTabId();
      for (var tabId in currentTabs) {
        var tabObj = currentTabs[tabId].obj;
        tabObj[func] && tabObj[func](tabId == currentTabId);
      }
    }),
    (me.getCurrentTabId = function () {
      return tabInfo[selectedTabIndex].id;
    }),
    (me.setAppPauseResumeListeners = function () {
      if (!Ti.App.isAndroid)
        Ti.App.addEventListener("paused", me.mainWindowPaused),
          Ti.App.addEventListener("resumed", me.mainWindowResumed);
      else {
        var mainWindow = Ti.App.mainAppWindow;
        mainWindow.addEventListener("open", function () {
          mainWindow.activity.addEventListener("pause", me.mainWindowPaused),
            mainWindow.activity.addEventListener(
              "resume",
              me.mainWindowResumed
            );
        }),
          mainWindow.addEventListener("androidback", function (e) {
            "rants" == me.getCurrentTabId()
              ? mainWindow.close()
              : me.navigateToTabByIndex(0);
          });
      }
    }),
    (me.scrollProfileToTop = function () {
      setTimeout(function () {
        var curProfile = me.getTopWindowOfType("profile");
        null != curProfile &&
          curProfile.obj.rantListContainer &&
          (curProfile.obj.profileContentContainer.scrollTo(0, 0),
          curProfile.obj.rantListContainer.scrollToItem(0, 0));
      }, 200);
    }),
    me
  );
}

module.exports = TabBar;
