function NotifWindow() {
  var me = this;

  (me.window = null),
    (me.container = null),
    (me.contentContainer = null),
    (me.listContainer = null),
    (me.listSection = null),
    (me.stopBubble = false),
    (me.lastCheckTime = null),
    (me.refreshTimer = null),
    (me.unreadCount = 0),
    (me.topBar = null),
    (me.didInitialFetch = false),
    (me.notifRequest = null);
  var _showAvatarImages,
    _selectedTabUnread = null,
    _tabBarHeight = 50,
    _tabUnderlineHeight = 4,
    _lastUnreadData = {},
    _tabsInfo = [
      {
        label: "All",
        id: "all",
        path: "",
      },

      {
        label: "++'s",
        id: "upvotes",
        path: "/upvotes",
      },

      {
        label: "Mentions",
        id: "mentions",
        path: "/mentions",
      },

      {
        label: "Comments",
        id: "comments",
        path: "/comments",
      },

      {
        label: "Subscriptions",
        id: "subs",
        path: "/subs",
      },
    ],
    _tabObjs = [],
    _selectedTab = 0,
    _tabPadding = 15.5,
    _tabIndicatorDotSize = 7,
    _indicatorDotRight = 5.5;

  me.init = function () {
    (_showAvatarImages = Ti.App.notifsAvatarImages),
      me.createElements(),
      setTimeout(function () {
        _setSelectedTab(0);
      }, 100),
      me.fetchNotifs();
  };

  var _setSelectedTab = function (tabId) {
    var tab;
    tab = _tabObjs[tabId];

    var removeTab = _tabObjs[_selectedTab];

    removeTab.tabUnderline &&
      (removeTab.remove(removeTab.tabUnderline), delete removeTab.tabUnderline),
      (_selectedTab = tabId),
      (tab.tabUnderline = Ti.UI.createView({
        width: tab.getRect().width - 10,
        borderRadius: 4,
        borderWidth: 0,
        height: _tabUnderlineHeight,
        backgroundColor: Ti.App.colorTabText,
        bottom: 0,
      })),
      tab.add(tab.tabUnderline);
  };

  (me.fetchNotifs = function () {
    var params = {
        last_time: null == me.lastCheckTime ? 0 : me.lastCheckTime,
        ext_prof: 1,
      },
      apiArgs = {
        method: "GET",
        endpoint: "users/me/notif-feed" + _tabsInfo[_selectedTab].path,
        params: params,
        callback: getItemsComplete,
        includeAuth: true,
      };

    me.notifRequest = Ti.App.api(apiArgs);
  }),
    (me.getWindow = function () {
      return me.window;
    }),
    (me.createElements = function () {
      (me.window = Ti.UI[Ti.App.isAndroid ? "createView" : "createWindow"]({
        navBarHidden: true,

        top: 0,
        backgroundColor: Ti.App.colorBg,
        width: "100%",
        height: Ti.UI.FILL,
        bottom: Ti.App.isAndroid ? Ti.App.tabBarHeight : 0,
        orientationModes: [Ti.UI.PORTRAIT],
      })),
        createSubSections();
    });
  var windowOpened = function () {},
    _createTabBar = function () {
      var outerTabContainer = Ti.UI.createView({
          width: "100%",
          top: Ti.App.topBarGenerator.topBarHeight,
          height: _tabBarHeight,
          zIndex: 30,
          backgroundColor: Ti.App.colorBg,
        }),
        borderBottom = Ti.UI.createView({
          width: "100%",
          height: 1,
          bottom: 0,
          backgroundColor: Ti.App.colorLine,
        });

      outerTabContainer.add(borderBottom);

      for (
        var tab,
          tabContents,
          tabInfo,
          tabUnderline,
          tabContainer = Ti.UI.createScrollView({
            top: 0,
            width: "100%",
            height: _tabBarHeight - 1,
            layout: "horizontal",
            horizontalWrap: false,
            scrollType: "horizontal",
          }),
          tabHeight = _tabBarHeight - 1,
          i = 0;
        i < _tabsInfo.length;
        ++i
      )
        (tabInfo = _tabsInfo[i]),
          (tab = Ti.UI.createView({
            top: 0,
            width: Ti.UI.SIZE,
            height: tabHeight,
          })),
          (tab.tabId = i),
          (tabContents = Ti.UI.createView({
            width: Ti.UI.SIZE,
            height: tabHeight - _tabUnderlineHeight,
            layout: "horizontal",
            horizontalWrap: false,
            touchEnabled: false,
          })),
          (tab.indicatorDot = Ti.UI.createView({
            width: 0,
            height: _tabIndicatorDotSize,
            borderRadius: 3.5,
            borderWidth: 0,
            backgroundColor: Ti.App.colorNotif,
            visible: false,
            touchEnabled: false,
          })),
          tabContents.add(tab.indicatorDot),
          (tab.lblTabTitle = Ti.UI.createLabel({
            left: _tabPadding,
            right: _tabPadding,
            color: Ti.App.colorTabText,
            text: tabInfo.label,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            font: {
              fontWeight: "bold",
              fontSize: Ti.App.fontBody,
            },

            touchEnabled: false,
          })),
          tabContents.add(tab.lblTabTitle),
          (tab.tabId = i),
          tab.add(tabContents),
          _tabObjs.push(tab),
          tabContainer.add(tab);

      tabContainer.addEventListener("click", _tabSelected),
        outerTabContainer.add(tabContainer),
        me.window.add(outerTabContainer);
    },
    _tabSelected = function (e) {
      _setSelectedTab(e.source.tabId),
        _clearNotifs(),
        me.loader.showLoader(),
        me.fetchNotifs(),
        console.log("tab selected!!", e.source.tabId);
    },
    _clearNotifs = function () {
      (_selectedTabUnread = null),
        me.stopRefreshTimer(),
        me.notifRequest && (me.notifRequest.abort(), (me.notifRequest = null)),
        (me.topBar.children[1].visible = false),
        (me.lastCheckTime = null),
        me.listSection.setItems([]);
    },
    _toggleIndicatorDot = function (tab, visible) {
      if (visible) {
        tab.indicatorDot.width = _tabIndicatorDotSize;
        var newPadding = _tabPadding - _tabIndicatorDotSize;
        (tab.indicatorDot.left = _tabPadding - _tabIndicatorDotSize),
          (tab.indicatorDot.right = _indicatorDotRight),
          (tab.indicatorDot.width = _tabIndicatorDotSize),
          (tab.lblTabTitle.left = 0),
          (tab.lblTabTitle.right = newPadding);
      } else
        (tab.indicatorDot.width = 0),
          (tab.indicatorDot.left = 0),
          (tab.indicatorDot.right = 0),
          (tab.lblTabTitle.left = _tabPadding),
          (tab.lblTabTitle.right = _tabPadding);

      tab.indicatorDot.visible = visible;
    },
    createSubSections = function () {
      createTopBar(), _createTabBar();

      var imgBg = Ti.UI.createImageView({
        top: 0,
        image: Ti.App.loaderBg,
        width: Ti.App.realWidth,
        height: 2.165 * Ti.App.realWidth,
        backgroundColor: Ti.App.colorImgBg,
        defaultImage: "",
      });

      me.window.add(imgBg);

      var ContentLoader = require("ui/common/ContentLoader");

      me.loader = new ContentLoader();
      var loaderElement = me.loader.getElem();

      me.loader.showLoader(), me.window.add(loaderElement), createList();
    },
    createList = function () {
      var notifTemplate = {
          properties: {
            backgroundColor: Ti.App.colorBg,
          },

          childTemplates: [
            {
              type: "Ti.UI.View",
              properties: {
                width: Ti.App.realWidth,
                height: Ti.UI.SIZE,
                layout: "vertical",
                backgroundColor: "#00000000",
              },

              childTemplates: [
                {
                  type: "Ti.UI.View",
                  properties: {
                    width: "100%",
                    height: Ti.UI.SIZE,
                  },

                  childTemplates: [
                    {
                      type: "Ti.UI.ImageView",
                      bindId: "imgAvatar",
                      properties: {
                        top: 8,
                        bottom: 8,
                        left: 8,
                        width: 45,
                        height: 45,
                        defaultImage: "",
                      },
                    },

                    {
                      type: "Ti.UI.View",
                      properties: {
                        left: 35,
                        top: 3,
                        backgroundColor: Ti.App.colorBg,
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        borderWidth: 0,
                      },

                      childTemplates: [
                        {
                          type: "Ti.UI.View",
                          bindId: "iconBg",
                          properties: {
                            width: 21,
                            height: 21,
                            borderRadius: 10,
                            borderWidth: 0,
                          },

                          childTemplates: [
                            {
                              type: "Ti.UI.Label",
                              bindId: "lblIcon",
                              properties: {
                                color: Ti.App.colorTextContrast,
                                width: Ti.UI.SIZE,
                                height: Ti.UI.SIZE,
                              },
                            },
                          ],
                        },
                      ],
                    },

                    {
                      type: "Ti.UI.Label",
                      bindId: "lblNotifText",
                      properties: {
                        width: Ti.App.realWidth - 119,
                        height: Ti.UI.SIZE,
                        color: Ti.App.colorDarkGrey,
                        left: 67,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                        font: {
                          fontSize: Ti.App.fontBody,
                        },
                      },

                      events: {
                        link: notifLinkClick,
                      },
                    },

                    {
                      type: "Ti.UI.Label",
                      bindId: "lblTime",
                      properties: {
                        color: Ti.App.colorHint,
                        width: Ti.UI.SIZE,
                        height: Ti.UI.SIZE,
                        right: 10,

                        font: {
                          fontSize: Ti.App.fontS,
                          fontWeight: "bold",
                        },
                      },
                    },
                  ],
                },

                {
                  type: "Ti.UI.View",
                  properties: {
                    backgroundColor: Ti.App.colorLine,
                    width: "100%",
                    height: 1,
                  },
                },
              ],
            },
          ],
        },
        templates = {
          notif: notifTemplate,
        };

      (me.listSection = Ti.UI.createListSection()),
        (me.listContainer = Ti.UI.createListView({
          backgroundColor: "orange",
          top: _tabBarHeight + Ti.App.topBarGenerator.topBarHeight,

          width: Ti.App.realWidth,

          height: Ti.UI.FILL,
          sections: [me.listSection],
          backgroundColor: "#00ffffff",
          templates: templates,
          defaultItemTemplate: "notif",
          separatorStyle: Ti.App.isAndroid
            ? null
            : Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE,
          scrollIndicatorStyle: Ti.App.scrollBarStyle,
          separatorHeight: 0,
        })),
        me.window.add(me.listContainer),
        me.listContainer.addEventListener("itemclick", listItemClicked);
    },
    notifLinkClick = function (e) {
      (me.stopBubble = true), Ti.App.openProfileWindow(e.url);
    },
    listItemClicked = function (e) {
      if (me.stopBubble) return void (me.stopBubble = false);

      var clickedItem = me.listSection.getItemAt(e.itemIndex);
      Ti.App.openRantWindow(
        clickedItem.info.rant_id,
        false,
        2 == clickedItem.info.rt ? 2 : 1,
        clickedItem.info.comment_id
      );
      var i,
        items = me.listSection.items,
        newItems = [];

      for (i = 0; i < items.length; ++i)
        if (items[i].info.rant_id == clickedItem.info.rant_id)
          if (0 == items[i].info.read)
            --me.unreadCount,
              --_selectedTabUnread,
              (items[i].info.read = 1),
              3 == Ti.App.theme &&
                (items[i].lblIcon.color = Ti.App.colorMidMonoGrey),
              (items[i].iconBg.backgroundColor = Ti.App.colorIcon),
              (items[i].lblNotifText.attributedString =
                makeAttributedStringRead(
                  items[i].lblNotifText.attributedString
                ));
          else continue;

      me.listSection.setItems(items),
        0 >= _selectedTabUnread &&
          ((_selectedTabUnread = 0),
          (me.topBar.children[1].visible = false),
          _toggleIndicatorDot(_tabObjs[_selectedTab], false)),
        0 > me.unreadCount && (me.unreadCount = 0),
        updateOutsideNotifCounts();
    },
    makeAttributedStringRead = function (attributedString) {
      var attributes = attributedString.getAttributes();

      attributes.push({
        type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
        value: Ti.App.colorHint,
        range: [0, attributedString.text.length],
      }),
        attributedString.setAttributes(attributes);

      var newAttributedString = Ti.UI.createAttributedString({
        text: attributedString.text,
        attributes: attributes,
      });

      return newAttributedString;
    },
    updateOutsideNotifCounts = function () {
      Ti.App.tabBar.setBadgeCount("notifs", me.unreadCount),
        Ti.App.sendLocalNotifIfNeeded(me.unreadCount);
    },
    createTopBar = function () {
      var topBarOptions = {
        leftBtnType: null,
        rightBtnType: "clear",
        barTitle: "Notifs",
        callbackRightBtn: function () {
          clearAllNotifs();
        },
      };

      (me.topBar = Ti.App.topBarGenerator.createBar(topBarOptions)),
        (me.topBar.zIndex = 20),
        me.window.add(me.topBar);
    },
    clearAllNotifs = function () {
      me.stopRefreshTimer(),
        me.notifRequest && (me.notifRequest.abort(), (me.notifRequest = null));

      var apiArgs = {
        method: "DELETE",
        endpoint: "users/me/notif-feed" + _tabsInfo[_selectedTab].path,
        params: {},
        includeAuth: true,
        callback: function () {
          me.startRefreshTimer();
        },
      };

      Ti.App.api(apiArgs);

      var items = me.listSection.items;

      for (i = 0; i < items.length; ++i)
        0 == items[i].info.read &&
          ((items[i].info.read = 1),
          (items[i].iconBg.backgroundColor = Ti.App.colorIcon),
          3 == Ti.App.theme &&
            (items[i].lblIcon.color = Ti.App.colorMidMonoGrey),
          (items[i].lblNotifText.attributedString = makeAttributedStringRead(
            items[i].lblNotifText.attributedString
          )));

      me.listSection.setItems(items),
        (me.unreadCount = 0),
        (me.topBar.children[1].visible = false),
        _toggleIndicatorDot(_tabObjs[_selectedTab], false),
        updateOutsideNotifCounts();
    },
    getItemsComplete = function (result) {
      if (null != me) {
        (me.notifRequest = null),
          0 == me.listSection.items.length && me.loader.hideLoader();
        var i,
          thisTabUnread,
          addItems = [];

        if (result.data && result.data.unread) {
          me.unreadCount = result.data.unread.total;

          for (var i = 1; i < _tabsInfo.length; ++i)
            void 0 !== result.data.unread[_tabsInfo[i].id] &&
              ((thisTabUnread = result.data.unread[_tabsInfo[i].id]),
              _toggleIndicatorDot(_tabObjs[i], 0 < thisTabUnread));
        }

        if (result && result.data && null != result.data.items) {
          for (i = 0; i < result.data.items.length; ++i) {
            var thisItem = result.data.items[i];
            0 == thisItem.read;
            var templateDataForItem = getTemplateDataForItem(
                thisItem,
                result.data.username_map
              ),
              dataItem = {
                template: "notif",

                info: {
                  rant_id: thisItem.rant_id,
                  read: thisItem.read,
                },

                properties: {
                  height: Ti.UI.SIZE,
                  selectionStyle: Ti.App.isAndroid
                    ? null
                    : Ti.UI.iOS.ListViewCellSelectionStyle.NONE,
                },

                iconBg: templateDataForItem.iconBg,
                lblIcon: templateDataForItem.icon,
                lblNotifText: templateDataForItem.notif,
                lblTime: {
                  text: Ti.App.timeAgo(thisItem.created_time),
                },
              };

            (dataItem.imgAvatar = templateDataForItem.avatar
              ? templateDataForItem.avatar
              : { image: "" }),
              thisItem.comment_id &&
                (dataItem.info.comment_id = thisItem.comment_id),
              2 == thisItem.rt && (dataItem.info.rt = 2),
              addItems.push(dataItem);
          }

          if (
            null !== _selectedTabUnread &&
            null != result.data.unread &&
            result.data.unread[_tabsInfo[_selectedTab].id] != _selectedTabUnread
          )
            return (
              (_selectedTabUnread = null),
              (me.didInitialFetch = false),
              (me.unreadCount = 0),
              (me.lastCheckTime = null),
              void me.fetchNotifs()
            );

          (_selectedTabUnread = result.data.unread[_tabsInfo[_selectedTab].id]),
            me.didInitialFetch
              ? me.listSection.insertItemsAt(0, addItems)
              : me.listSection.setItems(addItems);
        }

        result.data &&
          result.data.check_time &&
          (me.lastCheckTime = result.data.check_time),
          _selectedTabUnread && (me.topBar.children[1].visible = true),
          updateOutsideNotifCounts(),
          !me.didInitialFetch &&
            result &&
            result.data &&
            null != result.data.items &&
            (me.didInitialFetch = true),
          me.startRefreshTimer(!me.didInitialFetch);
      }
    };

  (me.startRefreshTimer = function (force) {
    (force = force || false),
      null != me &&
        null == me.refreshTimer &&
        (me.didInitialFetch || force) &&
        (me.refreshTimer = setTimeout(
          doRefresh,
          Ti.App.isAndroid ? 17500 : 5e3
        ));
  }),
    (me.stopRefreshTimer = function () {
      null == me ||
        null == me.refreshTimer ||
        (clearTimeout(me.refreshTimer), (me.refreshTimer = null));
    });
  var doRefresh = function () {
      null == me || ((me.refreshTimer = null), me.fetchNotifs());
    },
    getTemplateDataForItem = function (item, username_map) {
      var useIcon,
        fontSize,
        useText = "";

      switch (item.type) {
        case "comment_discuss":
        case "comment_content":
        case "comment_mention":
          (useIcon = "\uE811"), (fontSize = "14sp");
          break;
        case "comment_vote":
        case "content_vote":
          (useIcon = "\uE910"), (fontSize = "8.5sp");
          break;
        case "rant_sub":
          (useIcon = "\uE80C"), (fontSize = "14sp");
      }

      var templateData = {
        iconBg: {
          backgroundColor: item.read ? Ti.App.colorIcon : Ti.App.colorNotif,
        },

        icon: {
          text: useIcon,
          color: item.read ? Ti.App.colorBtnContrast : Ti.App.colorBtnInverse,
          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
          font: {
            fontSize: fontSize,
            fontFamily: "icomoon",
          },
        },
      };

      item.read &&
        3 == Ti.App.theme &&
        (templateData.icon.color = Ti.App.colorMidMonoGrey);
      var user_info = username_map[item.uid],
        withUsername = false,
        noun = 2 == item.rt ? "collab" : "rant";

      "content_vote" == item.type
        ? ((useText = user_info.name + " ++'d your " + noun + "!"),
          (withUsername = true))
        : "comment_discuss" == item.type
        ? (useText =
            "One (or more) new comments on a " + noun + " you commented on!")
        : "comment_vote" == item.type
        ? ((useText = user_info.name + " ++'d your comment!"),
          (withUsername = true))
        : "comment_content" == item.type
        ? ((useText = user_info.name + " commented on your " + noun + "!"),
          (withUsername = true))
        : "comment_mention" == item.type
        ? ((useText = user_info.name + " mentioned you in a comment!"),
          (withUsername = true))
        : "rant_sub" == item.type &&
          ((useText = user_info.name + " posted a new " + noun + "!"),
          (withUsername = true));
      var textLen = useText.length,
        attributes = [
          {
            type: Ti.UI.ATTRIBUTE_FONT,
            value: { fontSize: Ti.App.fontBody },
            range: [0, textLen],
          },
        ];

      return (
        withUsername &&
          (attributes.push({
            type: Ti.UI.ATTRIBUTE_FONT,
            value: { fontWeight: "bold", fontSize: Ti.App.fontBody },
            range: [0, user_info.name.length],
          }),
          attributes.push({
            type: Ti.UI.ATTRIBUTE_LINK,
            value: item.uid,
            range: [0, user_info.name.length],
          }),
          attributes.push({
            type: Ti.UI.ATTRIBUTE_UNDERLINES_STYLE,
            value: Ti.UI.ATTRIBUTE_UNDERLINE_STYLE_NONE,
            range: [0, user_info.name.length],
          }),
          !item.read &&
            attributes.push({
              type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
              value: Ti.App.colorLink,
              range: [0, user_info.name.length],
            })),
        item.read &&
          attributes.push({
            type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
            value: Ti.App.colorHint,
            range: [0, textLen],
          }),
        (templateData.notif = {
          attributedString: Ti.UI.createAttributedString({
            text: useText,
            attributes: attributes,
          }),
        }),
        user_info &&
          user_info.avatar &&
          ((templateData.avatar = {
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 0,
            backgroundColor: "#" + user_info.avatar.b,
          }),
          _showAvatarImages &&
            user_info.avatar.i &&
            (templateData.avatar.image =
              Ti.App.avatarImageUrl + user_info.avatar.i)),
        templateData
      );
    };

  return (
    (me.getContainer = function () {
      return me.container;
    }),
    (me.closeWindow = function (animated, noClose) {
      null != me.refreshTimer &&
        (clearTimeout(me.refreshTimer), (me.refreshTimer = null)),
        null == animated && (animated = true),
        (me = null);
    }),
    (me.onTabShow = function () {
      null == me || me.fetchNotifs();
    }),
    (me.onTabHide = function () {
      null == me || me.stopRefreshTimer();
    }),
    (me.onAppResume = function (isSelected) {
      null == me || ((isSelected || Ti.App.isAndroid) && me.fetchNotifs());
    }),
    (me.onAppPause = function (isSelected) {
      null == me || ((isSelected || Ti.App.isAndroid) && me.stopRefreshTimer());
    }),
    me
  );
}

module.exports = NotifWindow;
