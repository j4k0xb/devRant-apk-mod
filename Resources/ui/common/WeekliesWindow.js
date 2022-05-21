function WeekliesWindow() {
  var me = this;

  (me.window = null),
    (me.container = null),
    (me.contentContainer = null),
    (me.listContainer = null),
    (me.listSection = null),
    (me.refreshControl = null),
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
        me.window.addEventListener("open", windowOpened),
        me.window.addEventListener("close", windowClosed),
        (me.container = Ti.UI.createView({
          width: "100%",
          height: "100%",
          layout: "vertical",
        })),
        me.window.add(me.container),
        createTopBar(),
        createList(),
        fetchData();
    });
  var windowOpened = function () {},
    createTopBar = function () {
      var topBarOptions = {
          leftBtnType: "back",
          rightBtnType: "none",
          barTitle: "All Weeklies",
          callbackLeftBtn: function () {
            me.closeWindow();
          },
        },
        topBar = Ti.App.topBarGenerator.createBar(topBarOptions);
      me.container.add(topBar);
    },
    fetchData = function () {
      me.loader.showLoader(),
        me.listSection.items.length &&
          me.listSection.deleteItemsAt(0, me.listSection.items.length, {
            animated: false,
          }),
        (params = {});

      var apiArgs = {
        method: "GET",
        endpoint: "devrant/weekly-list",
        params: params,
        callback: getWeeksComplete,
        includeAuth: true,
      };

      Ti.App.api(apiArgs);
    },
    getWeeksComplete = function (result) {
      if (null != me) {
        if (
          (me.loader.hideLoader(),
          0
            ? me.swipeRefresh.setRefreshing(false)
            : (me.refreshControl.endRefreshing(),
              (me.listContainer.refreshControl = me.refreshControl)),
          result.success && result.weeks && result.weeks.length)
        )
          for (var dataItem, addItems = [], i = 0; i < result.weeks.length; ++i)
            (dataItem = {
              template: "week",
              lblPrompt: {
                text: result.weeks[i].prompt,
              },

              lblNumRants: {
                text: result.weeks[i].num_rants,
              },

              lblWeek: {
                text:
                  "Week " + result.weeks[i].week + " - " + result.weeks[i].date,
              },

              info: {
                week: result.weeks[i].week,
              },

              properties: {
                height: Ti.UI.SIZE,
                selectionStyle: Ti.App.isAndroid
                  ? null
                  : Ti.UI.iOS.ListViewCellSelectionStyle.NONE,
              },
            }),
              addItems.push(dataItem);

        me.listSection.insertItemsAt(0, addItems);
      }
    };

  me.getContainer = function () {
    return me.container;
  };

  var windowClosed = function () {
    me.closeWindow(false, true);
  };

  me.closeWindow = function (animated, noClose) {
    me.window.removeEventListener("close", windowClosed),
      (noClose = noClose || false),
      null == animated && (animated = true),
      animated && (Ti.App.weeklyRantOpen = false),
      Ti.App.tabBar.closedWindow("weeklies", me),
      noClose ||
        me.window.close({
          animated: animated,
        }),
      (me = null);
  };
  var createList = function () {
      (me.contentContainer = Ti.UI.createView({
        width: "100%",
        height: Ti.UI.FILL,
        backgroundColor: "#00000000",
      })),
        me.container.add(me.contentContainer);

      var imgBg = Ti.UI.createImageView({
        top: 0,
        image: Ti.App.loaderBg,
        width: Ti.App.realWidth,
        height: 2.165 * Ti.App.realWidth,
        backgroundColor: Ti.App.colorImgBg,
        defaultImage: "",
      });

      me.contentContainer.add(imgBg);

      var ContentLoader = require("ui/common/ContentLoader");

      me.loader = new ContentLoader();
      var loaderElement = me.loader.getElem();

      me.contentContainer.add(loaderElement);
      var iconColWidth = 54,
        weekTemplate = {
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
                    width: Ti.App.realWidth,
                    height: Ti.UI.SIZE,
                  },

                  childTemplates: [
                    {
                      type: "Ti.UI.View",
                      properties: {
                        top: 7,

                        width: Ti.App.realWidth,
                        height: Ti.UI.SIZE,
                      },

                      childTemplates: [
                        {
                          type: "Ti.UI.View",
                          properties: {
                            width: 54,
                            height: Ti.UI.SIZE,

                            left: 0,
                          },

                          childTemplates: [
                            {
                              type: "Ti.UI.Label",
                              properties: {
                                text: "\uE90F",
                                color: Ti.App.colorIcon,
                                right: 12,
                                font: {
                                  fontFamily: "icomoon",
                                  fontSize: "32sp",
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
                        top: 7,
                        left: 54,
                        width: Ti.App.realWidth - 54,
                        height: Ti.UI.SIZE,

                        layout: "vertical",
                      },

                      childTemplates: [
                        {
                          bindId: "lblPrompt",
                          type: "Ti.UI.Label",
                          properties: {
                            color: Ti.App.colorLink,
                            font: {
                              fontSize: Ti.App.fontBody,
                              fontWeight: "bold",
                            },

                            width: Ti.App.realWidth - 54 - 10,
                            right: 10,
                            textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
                          },
                        },

                        {
                          type: "Ti.UI.View",
                          properties: {
                            top: 3,
                            width: Ti.App.realWidth - 54,
                            height: Ti.UI.SIZE,
                            bottom: 3,
                          },

                          childTemplates: [
                            {
                              bindId: "lblWeek",
                              type: "Ti.UI.Label",
                              properties: {
                                left: 0,
                                text: "test 123",
                                color: Ti.App.colorHint,
                                font: {
                                  fontSize: Ti.App.fontS,
                                  fontWeight: "bold",
                                },
                              },
                            },

                            {
                              type: "Ti.UI.View",
                              properties: {
                                right: 5,
                                width: Ti.UI.SIZE,
                                height: Ti.UI.SIZE,
                                layout: "horizontal",
                              },

                              childTemplates: [
                                {
                                  type: "Ti.UI.Label",
                                  properties: {
                                    left: 0,
                                    text: "\uE80C",
                                    color: Ti.App.colorHint,
                                    font: {
                                      fontSize: "15sp",
                                      fontFamily: "icomoon",
                                    },
                                  },
                                },

                                {
                                  bindId: "lblNumRants",
                                  type: "Ti.UI.Label",
                                  properties: {
                                    left: 2,

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
                      ],
                    },
                  ],
                },

                {
                  type: "Ti.UI.View",
                  properties: {
                    top: 5,
                    backgroundColor: Ti.App.colorLine,
                    width: Ti.App.realWidth,
                    height: 1,
                  },
                },
              ],
            },
          ],
        },
        templates = {
          week: weekTemplate,
        };

      if (
        ((me.listSection = Ti.UI.createListSection()),
        (me.refreshControl = Ti.UI.createRefreshControl({
          tintColor: Ti.App.colorHint,
        })),
        me.refreshControl.addEventListener("refreshstart", function (e) {
          fetchData();
        }),
        (me.listContainer = Ti.UI.createListView({
          backgroundColor: "orange",
          top: 0,
          width: Ti.App.realWidth,
          height: "100%",
          sections: [me.listSection],
          backgroundColor: "#00ffffff",
          templates: templates,
          defaultItemTemplate: "week",
          separatorStyle: Ti.App.isAndroid
            ? null
            : Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE,
          refreshControl: me.refreshControl,
          scrollIndicatorStyle: Ti.App.scrollBarStyle,
          separatorHeight: 0,
        })),
        false)
      ) {
        var swipeRefreshModule = require("com.rkam.swiperefreshlayout");
        (me.swipeRefresh = swipeRefreshModule.createSwipeRefresh({
          width: Ti.App.realWidth,
          height: "100%",
        })),
          me.swipeRefresh.add(me.listContainer),
          me.swipeRefresh.addEventListener("refreshing", function () {
            fetchData();
          });
      }

      me.contentContainer.add(me.listContainer),
        me.listContainer.addEventListener("itemclick", listItemClicked);
    },
    listItemClicked = function (e) {
      var clickedItem = me.listSection.getItemAt(e.itemIndex);
      Ti.App.openGroupRantWindow(clickedItem.info.week);
    };

  return me;
}

module.exports = WeekliesWindow;
