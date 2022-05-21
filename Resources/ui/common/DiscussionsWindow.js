function DiscussionsWindow() {
  var me = this,
    _window = null,
    _container = null,
    _contentContainer = null,
    _listSection = null,
    _listContainer = null,
    _loader = null,
    _options = null,
    _refreshControl = null,
    _requestInProgress = false;

  (me.init = function (options) {
    (_options = options), _createElements(), _fetchData();
  }),
    (me.getWindow = function () {
      return _window;
    });
  var _fetchData = function () {
      (_requestInProgress = true),
        _loader.showLoader(),
        _listSection.items.length && _listSection.setItems([]);
      var params = {},
        apiArgs = {
          method: "GET",
          endpoint: "devrant/rant-discussions",
          params: params,
          callback: _getRantsComplete,
          includeAuth: true,
        };

      Ti.App.api(apiArgs);
    },
    _getRantsComplete = function (result) {
      return (
        (_requestInProgress = false),
        _loader.hideLoader(),
        result && null != result.rants
          ? void _createListItemsFromResults(result.rants)
          : void Ti.App.showDialog(
              "Whoops!",
              "There was an error while trying to load recent rant discussions. Please try again!"
            )
      );
    },
    _createListItemsFromResults = function (rants) {
      for (var thisRant, dataItems = [], i = 0; i < rants.length; ++i) {
        thisRant = rants[i];

        var dataItem = {
          template: "rant",
          rantId: thisRant.id,
          properties: {
            height: Ti.UI.SIZE,
            selectionStyle: Ti.App.isAndroid
              ? null
              : Ti.UI.iOS.ListViewCellSelectionStyle.NONE,
          },

          lblUsername: {
            text: thisRant.author.name,
          },

          lblTime: {
            text: Ti.App.timeAgo(thisRant.comment_time),
          },

          lblRantText: {
            text: Ti.App.formatRantText(thisRant.text, 90),
          },

          lblRecentComments: {
            text:
              thisRant.num_new_comments +
              " recent comment" +
              (1 == thisRant.num_new_comments ? "" : "s"),
          },

          lblTotalComments: {
            text:
              thisRant.num_comments +
              " total comment" +
              (1 == thisRant.num_comments ? "" : "s"),
          },

          imgAvatar: {
            backgroundColor: "#" + thisRant.author.avatar.b,
          },
        };

        if (
          (thisRant.author.avatar.i &&
            (dataItem.imgAvatar.image =
              Ti.App.avatarImageUrl + thisRant.author.avatar.i),
          thisRant.image)
        ) {
          var targetWidth = 0.16 * Ti.App.realWidth,
            targetHeight = 0.2 * Ti.App.realHeight,
            useWidth = thisRant.image.width,
            useHeight = thisRant.image.height,
            ratio = targetWidth / useWidth;
          (useWidth = targetWidth),
            (useHeight *= ratio),
            (dataItem.rantImageContainer = {
              width: useWidth,
              height: useHeight,
              right: 11,
            }),
            useHeight > targetHeight &&
              (dataItem.rantImageContainer = {
                height: targetHeight,
                width: useWidth,
              });

          var useImageSrc = thisRant.image.frame
            ? thisRant.image.frame
            : thisRant.image.url;

          dataItem.imgRantImage = {
            image: useImageSrc,
            width: useWidth,
            height: useHeight,
          };
        } else;

        if (Ti.App.isAndroid) {
          var rantLabelSize = Ti.App.realWidth - 61;

          thisRant.image && (rantLabelSize -= useWidth + 11),
            (dataItem.lblRantText.width = rantLabelSize);
        }

        for (var curImage, j = 0; j < thisRant.commenters.length && 2 >= j; ++j)
          (curImage = "imgCommenterAvatar" + j),
            (dataItem[curImage] = {
              backgroundColor: "#" + thisRant.commenters[j].avatar.b,
            }),
            0 < j &&
              ((dataItem[curImage].width = 30), (dataItem[curImage].left = -7)),
            thisRant.commenters[j].avatar.i &&
              (dataItem[curImage].image =
                Ti.App.avatarImageUrl + thisRant.commenters[j].avatar.i);

        dataItems.push(dataItem);
      }

      _listSection.setItems(dataItems);
    };

  me.doRefresh = function () {
    _requestInProgress || _fetchData();
  };
  var _createElements = function () {
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

      _container.add(imgBg), _window.add(_container);

      var ContentLoader = require("ui/common/ContentLoader");

      _loader = new ContentLoader();
      var loaderElement = _loader.getElem();
      (loaderElement.zIndex = 5),
        _container.add(loaderElement),
        _createSubSections(),
        _createListView();
    },
    _createListView = function () {
      var leftRightMargin = 10,
        rantTemplate = {
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
              },

              childTemplates: [
                {
                  type: "Ti.UI.View",
                  properties: {
                    top: 10,
                    width: "100%",
                    height: Ti.UI.SIZE,
                  },

                  childTemplates: [
                    {
                      type: "Ti.UI.ImageView",
                      bindId: "imgAvatar",
                      properties: {
                        left: 10,
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        borderWidth: 0,
                        backgroundColor: Ti.App.colorImgBg,
                        defaultImage: "",
                      },
                    },

                    {
                      type: "Ti.UI.Label",
                      bindId: "lblUsername",
                      properties: {
                        left: 49,
                        text: "test",
                        color: Ti.App.colorLink,
                        font: {
                          fontSize: Ti.App.fontBody,
                          fontWeight: "bold",
                        },
                      },
                    },

                    {
                      type: "Ti.UI.View",
                      properties: {
                        right: 10,
                        layout: "horizontal",
                        width: Ti.UI.SIZE,
                        height: Ti.UI.SIZE,
                      },

                      childTemplates: [
                        {
                          type: "Ti.UI.Label",
                          properties: {
                            right: 0,
                            text: "\uE806",
                            color: Ti.App.colorHint,
                            font: {
                              fontFamily: "icomoon",
                              fontSize: "13sp",
                            },
                          },
                        },

                        {
                          type: "Ti.UI.Label",
                          bindId: "lblTime",
                          properties: {
                            left: 3,
                            text: "2m",
                            color: Ti.App.colorHint,
                            font: {
                              fontSize: Ti.App.fontS,
                              fontWeight: "bold",
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
                    top: -2,
                    width: "100%",
                    height: Ti.UI.SIZE,
                    layout: "horizontal",
                    horizontalWrap: false,
                  },

                  childTemplates: [
                    {
                      type: "Ti.UI.View",
                      bindId: "rantImageContainer",
                      properties: {
                        left: 50,
                        width: 0,
                        height: 0,
                        top: 5,
                        borderRadius: 7,
                        borderWidth: 0,
                      },

                      childTemplates: [
                        {
                          type: "Ti.UI.ImageView",
                          bindId: "imgRantImage",
                          properties: {
                            top: 0,
                            backgroundColor: Ti.App.colorImgBg,
                            defaultImage: "",
                            width: 0,
                            height: 0,
                          },
                        },
                      ],
                    },

                    {
                      type: "Ti.UI.Label",
                      bindId: "lblRantText",
                      properties: {
                        top: 0,

                        left: 0,
                        right: 10,
                        width: Ti.UI.FILL,
                        text: "2m",
                        color: Ti.App.colorDarkGrey,
                        font: {
                          fontSize: Ti.App.fontBody,
                        },
                      },
                    },
                  ],
                },

                {
                  type: "Ti.UI.View",
                  properties: {
                    top: 10,
                    left: 50,
                    layout: "horizontal",
                    width: Ti.UI.SIZE,
                    height: Ti.UI.SIZE,
                  },

                  childTemplates: [
                    {
                      type: "Ti.UI.View",
                      properties: {
                        width: 3,
                        height: 32,
                        borderRadius: 4,
                        borderWidth: 0,
                        backgroundColor: Ti.App.colorBgThird,
                        right: 7,
                      },
                    },

                    {
                      type: "Ti.UI.ImageView",
                      bindId: "imgCommenterAvatar0",
                      properties: {
                        zIndex: 3,
                        left: 0,
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        borderWidth: 0,

                        defaultImage: "",
                      },
                    },

                    {
                      type: "Ti.UI.ImageView",
                      bindId: "imgCommenterAvatar1",
                      properties: {
                        zIndex: 2,
                        width: 0,
                        height: 30,
                        borderRadius: 15,
                        borderWidth: 0,

                        defaultImage: "",
                      },
                    },

                    {
                      type: "Ti.UI.ImageView",
                      bindId: "imgCommenterAvatar2",
                      properties: {
                        zIndex: 1,
                        width: 0,
                        height: 30,
                        borderRadius: 15,
                        borderWidth: 0,

                        defaultImage: "",
                      },
                    },

                    {
                      type: "Ti.UI.View",
                      properties: {
                        left: 8,
                        layout: "vertical",
                        width: Ti.UI.SIZE,
                        height: Ti.UI.SIZE,
                      },

                      childTemplates: [
                        {
                          type: "Ti.UI.Label",
                          bindId: "lblRecentComments",
                          properties: {
                            left: 0,
                            text: "3 recent comments",
                            color: Ti.App.colorHint,
                            font: {
                              fontSize: Ti.App.fontS,
                              fontWeight: "bold",
                            },
                          },
                        },

                        {
                          type: "Ti.UI.Label",
                          bindId: "lblTotalComments",
                          properties: {
                            left: 0,
                            text: "12 total comments",
                            color: Ti.App.colorHint,
                            font: {
                              fontSize: Ti.App.fontS,
                              fontWeight: "bold",
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
                    top: 10,
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
          rant: rantTemplate,
        };

      if (
        ((_refreshControl = Ti.UI.createRefreshControl({
          tintColor: Ti.App.colorHint,
        })),
        _refreshControl.addEventListener("refreshstart", function (e) {
          _refreshControl.endRefreshing(), me.doRefresh();
        }),
        (_listSection = Ti.UI.createListSection()),
        (_listContainer = Ti.UI.createListView({
          top: 0,
          width: Ti.App.realWidth,
          height: "100%",
          sections: [_listSection],
          templates: templates,
          defaultItemTemplate: "rant",
          separatorStyle: Ti.App.isAndroid
            ? null
            : Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE,
          refreshControl: _refreshControl,
          backgroundColor: "transparent",
          scrollIndicatorStyle: Ti.App.scrollBarStyle,
          separatorHeight: 0,
        })),
        false)
      ) {
        var swipeRefreshModule = require("com.rkam.swiperefreshlayout"),
          swipeRefresh = swipeRefreshModule.createSwipeRefresh({
            width: Ti.App.realWidth,
            height: "100%",
          });

        swipeRefresh.add(_listContainer),
          swipeRefresh.addEventListener("refreshing", function () {
            swipeRefresh.setRefreshing(false), me.doRefresh();
          });
      }

      _listContainer.addEventListener("itemclick", _listItemClicked),
        _contentContainer.add(_listContainer);
    },
    _listItemClicked = function (item) {
      var itemData = _listSection.getItemAt(item.itemIndex);
      Ti.App.openRantWindow(itemData.rantId);
    },
    _createSubSections = function () {
      _createTopBar(),
        (_contentContainer = Ti.UI.createView({
          top: Ti.App.topBarGenerator.topBarHeight,
          width: "100%",
          height: Ti.UI.FILL,
          layout: "vertical",
        })),
        _container.add(_contentContainer);
    },
    _createTopBar = function () {
      var topBarOptions = {
          leftBtnType: "back",
          rightBtnType: "none",
          barTitle: "Discussions",
          callbackLeftBtn: function () {
            me.closeWindow();
          },
        },
        topBar = Ti.App.topBarGenerator.createBar(topBarOptions);
      topBar.children[1].addEventListener("click", me.doRefresh),
        _container.add(topBar);
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
        Ti.App.tabBar.closedWindow("discussions", me),
        noClose || _window.close({ animated: animated }),
        (me = null);
    }),
    me
  );
}

module.exports = DiscussionsWindow;
