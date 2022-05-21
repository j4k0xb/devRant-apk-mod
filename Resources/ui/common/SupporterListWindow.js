function SupporterListWindow() {
  var me = this,
    _window = null,
    _container = null,
    _contentContainer = null,
    _listSection = null,
    _listContainer = null,
    _loader = null;

  (me.init = function (options) {
    (_options = options), _createElements(), _getSupporters();
  }),
    (me.getWindow = function () {
      return _window;
    });
  var _getSupporters = function () {
      var apiArgs = {
        method: "GET",
        endpoint: "devrant/supporters",
        params: {},
        callback: _getSupportersComplete,
        includeAuth: true,
      };

      _loader.showLoader(), Ti.App.api(apiArgs);
    },
    _getSupportersComplete = function (result) {
      var addItems = [];

      if ((_loader.hideLoader(), !result || !result.items))
        return void Ti.App.showDialog(
          "Whoops!",
          "There was an issue connecting/loading the supporter list. Please try again!"
        );

      for (var i = 0; i < result.items.length; ++i) {
        var thisItem = result.items[i],
          avatarInfo = {
            backgroundColor: "#" + thisItem.user.avatar.b,
          };

        thisItem.user.avatar.i &&
          (avatarInfo.image = Ti.App.avatarImageUrl + thisItem.user.avatar.i);

        var dataItem = {
          properties: {
            height: Ti.UI.SIZE,
            selectionStyle: Ti.App.isAndroid
              ? null
              : Ti.UI.iOS.ListViewCellSelectionStyle.NONE,
          },

          imgAvatar: avatarInfo,
          lblUsername: {
            text: thisItem.user.name,
          },

          lblSupporterSince: {
            text: "Supporter since " + _formatTimestampAsDate(thisItem.start),
          },

          userId: thisItem.user.id,
        };

        addItems.push(dataItem);
      }

      _listSection.insertItemsAt(0, addItems);
    },
    _formatTimestampAsDate = function (ts) {
      var date = new Date(1e3 * ts);

      return date.toLocaleDateString();
    },
    _createElements = function () {
      (_window = Ti.UI.createWindow({
        navBarHidden: true,
        backgroundColor: Ti.App.colorBg,
        width: "100%",
        height: "100%",

        orientationModes: [Ti.UI.PORTRAIT],
      })),
        _window.addEventListener("close", _windowClosed),
        (_container = Ti.UI.createView({
          width: "100%",
          height: "100%",
        }));

      var imgBg = Ti.UI.createImageView({
        top: 0,
        image: Ti.App.loaderBg,
        width: Ti.App.realWidth,
        height: 2.165 * Ti.App.realWidth,
        backgroundColor: Ti.App.colorImgBg,
        defaultImage: "",
      });

      _container.add(imgBg);

      var ContentLoader = require("ui/common/ContentLoader");

      _loader = new ContentLoader();
      var loaderElement = _loader.getElem();

      _container.add(loaderElement),
        _window.add(_container),
        _createSubSections();
    },
    _createSubSections = function () {
      _createTopBar(),
        (_contentContainer = Ti.UI.createView({
          top: Ti.App.topBarGenerator.topBarHeight,
          width: "100%",
          height: Ti.UI.FILL,
          layout: "vertical",
        })),
        _container.add(_contentContainer),
        Ti.App.dpp || _createSupporterBar(),
        _createList();
    },
    _createSupporterBar = function () {
      var MenuWindow = require("ui/common/MenuWindow"),
        menuWindow = new MenuWindow();

      _contentContainer.add(menuWindow.generateSupporterBar());
    },
    _createTopBar = function () {
      var topBarOptions = {
          leftBtnType: "back",
          rightBtnType: "none",
          barTitle: "Supporters",
          callbackLeftBtn: function () {
            me.closeWindow();
          },
        },
        topBar = Ti.App.topBarGenerator.createBar(topBarOptions);

      _container.add(topBar);
    },
    _createList = function () {
      var paddingTop = 10,
        paddingLeft = 12,
        supporterTemplate = {
          properties: {
            backgroundColor: Ti.App.colorBg,
          },

          childTemplates: [
            {
              type: "Ti.UI.View",
              properties: {
                width: "100%",
                height: Ti.UI.SIZE,
                layout: "vertical",
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
                        left: paddingLeft,
                        right: paddingLeft,
                        top: 10,
                        bottom: 10,

                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        borderWidth: 0,
                      },
                    },

                    {
                      type: "Ti.UI.View",
                      properties: {
                        left: 50 + 2 * paddingLeft,
                        width: Ti.UI.FILL,
                        height: Ti.UI.SIZE,

                        layout: "vertical",
                      },

                      childTemplates: [
                        {
                          type: "Ti.UI.Label",
                          bindId: "lblUsername",
                          properties: {
                            left: 0,
                            width: Ti.UI.SIZE,
                            height: Ti.UI.SIZE,
                            text: "username",
                            color: Ti.App.colorLink,
                            font: {
                              fontWeight: "bold",
                              fontSize: Ti.App.fontM,
                            },
                          },
                        },

                        {
                          type: "Ti.UI.Label",
                          bindId: "lblSupporterSince",
                          properties: {
                            left: 0,
                            width: Ti.UI.SIZE,
                            height: Ti.UI.SIZE,
                            text: "Supporter since ",
                            color: Ti.App.colorHint,
                            font: {
                              fontWeight: "bold",
                              fontSize: Ti.App.fontS,
                            },
                          },
                        },
                      ],
                    },
                  ],
                },

                {
                  type: "Ti.UI.View",
                  properties: {
                    width: "100%",
                    height: 1,
                    backgroundColor: Ti.App.colorLine,
                  },
                },
              ],
            },
          ],
        },
        templates = {
          supporter: supporterTemplate,
        };

      (_listSection = Ti.UI.createListSection()),
        (_listContainer = Ti.UI.createListView({
          backgroundColor: "orange",
          top: 0,

          width: Ti.App.realWidth,
          height: Ti.UI.FILL,
          sections: [_listSection],
          backgroundColor: "#00ffffff",
          templates: templates,
          defaultItemTemplate: "supporter",
          separatorStyle: Ti.App.isAndroid
            ? null
            : Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE,
          scrollIndicatorStyle: Ti.App.scrollBarStyle,
          separatorHeight: 0,
        })),
        _contentContainer.add(_listContainer),
        _listContainer.addEventListener("itemclick", _listItemClicked);
    },
    _listItemClicked = function (e) {
      var clickedItem = _listSection.getItemAt(e.itemIndex);
      Ti.App.openProfileWindow(clickedItem.userId);
    };

  me.getContainer = function () {
    return _container;
  };

  var _windowClosed = function () {
    me.closeWindow(false, true);
  };

  return (
    (me.closeWindow = function (animated, noClose) {
      _window.removeEventListener("close", _windowClosed),
        (noClose = noClose || false),
        null == animated && (animated = true),
        Ti.App.tabBar.closedWindow("supporter_list", me),
        noClose || _window.close({ animated: animated }),
        (me = null);
    }),
    me
  );
}

module.exports = SupporterListWindow;
