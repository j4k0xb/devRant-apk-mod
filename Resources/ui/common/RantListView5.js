function RantListView5() {
  var me = this;
  (me.circleVoteButtonSize = 30),
    (me.circleVoteButtonPadding = 10),
    (me.maxNumTagsShow = 6),
    (me.mainContentContainerWidth =
      Ti.App.realWidth -
      me.circleVoteButtonSize -
      2 * me.circleVoteButtonPadding -
      me.circleVoteButtonPadding),
    (me.listSection = null),
    (me.listContainer = null),
    (me.options = null),
    (me.templates = {}),
    (me.firstVisibleItem = 0),
    (me.numVisibleItems = 15),
    (me.rantsIdToIndex = {}),
    (me.listIsScrolling = false),
    (me.refreshControl = null),
    (me.tagTapped = false),
    (me.tagAttrs = {}),
    (me.rantSeriesId = null),
    (me.tapTimeout = null);
  var autoLoadImages = Ti.App.autoLoadImages;

  me.init = function (options) {
    (me.options = options), createList();
  };
  var hookScrollHitBottom = function () {
      me.options.scrollHitBottomCallback &&
        me.listContainer.setMarker({
          sectionIndex: 0,
          itemIndex: me.listSection.items.length - 1,
        });
    },
    markerCallback = function () {
      me.options.scrollHitBottomCallback &&
        me.options.scrollHitBottomCallback();
    };

  me.getView = function () {
    return 1 ? me.listContainer : me.swipeRefresh;
  };
  var generateListTemplate = function (type) {
      var lblScoreHeight = 17,
        commentsContainerWidth = 60,
        imageSection = null,
        usernameSection = null;

      me.options.showUsernames
        ? (usernameSection = {
            type: "Ti.UI.View",
            properties: {
              width: me.mainContentContainerWidth,
              height: Ti.UI.SIZE,
              bottom: 3,
              layout: "horizontal",
            },

            childTemplates: [
              {
                bindId: "lblUsername",
                type: "Ti.UI.Label",
                properties: {
                  width: Ti.UI.SIZE,
                  height: Ti.UI.SIZE,
                  text: "username",
                  color: Ti.App.colorLink,
                  font: {
                    fontSize: Ti.App.fontBody,
                    fontWeight: "bold",
                  },
                },
              },

              {
                bindId: "lblUserScoreContainer",
                type: "Ti.UI.View",
                properties: {
                  width: Ti.UI.SIZE,
                  height: Ti.UI.SIZE,
                  left: 4,
                  backgroundColor: Ti.App.colorBtnBgTwo,
                  borderRadius: 5,
                  borderWidth: 0,
                },

                childTemplates: [
                  {
                    bindId: "lblUserScore",
                    type: "Ti.UI.Label",
                    properties: {
                      width: Ti.UI.SIZE,
                      height: Ti.UI.SIZE,
                      left: 5,
                      right: 5,
                      text: "+210",
                      color: Ti.App.colorTextContrast,
                      font: {
                        fontSize: Ti.App.fontS,
                        fontWeight: "bold",
                      },
                    },
                  },
                ],
              },
            ],
          })
        : Ti.App.isAndroid &&
          (usernameSection = {
            type: "Ti.UI.View",
            properties: {
              height: 0,
            },
          }),
        "rantWithImage" == type || "firstRantWithImage" == type
          ? (imageSection = {
              type: "Ti.UI.View",
              bindId: "rantImageContainer",
              properties: {
                top: 9,
                bottom: 6,
                left: 0,
                width: "100%",
                height: 60,
                borderRadius: 5,
                borderWidth: 0,
              },

              childTemplates: [
                {
                  type: "Ti.UI.ImageView",
                  bindId: "rantImage",
                  properties: {
                    backgroundColor: Ti.App.colorImgBg,
                    defaultImage: "",
                  },
                },

                {
                  type: "Ti.UI.View",
                  bindId: "gifIndicator",
                  properties: {
                    visible: false,
                    top: 6,
                    left: 6,
                    width: Ti.UI.SIZE,
                    height: Ti.UI.SIZE,
                    backgroundColor:
                      3 == Ti.App.theme
                        ? Ti.App.colorBlackMidGrey
                        : Ti.App.colorPurple,
                    borderRadius: 3,
                    borderWidth: 0,
                    touchEnabled: false,
                  },

                  childTemplates: [
                    {
                      type: "Ti.UI.Label",
                      properties: {
                        top: 2,
                        bottom: 2,
                        left: 5,
                        right: 5,
                        text: "GIF",
                        color: Ti.App.colorTextContrast,
                        width: Ti.UI.SIZE,
                        height: Ti.UI.SIZE,
                        touchEnabled: false,
                        font: {
                          fontSize: Ti.App.fontS,
                          fontWeight: "bold",
                        },
                      },
                    },
                  ],
                },
              ],
            })
          : Ti.App.isAndroid &&
            (imageSection = {
              type: "Ti.UI.View",
              bindId: "rantImageContainer",
              properties: {
                backgroundColor: Ti.App.colorImgBg,
                height: 0,
              },
            }),
        (me.templates[type] = {
          childTemplates: [
            {
              type: "Ti.UI.View",
              bindId: "itemBg",
              properties: {
                width: Ti.App.realWidth,
                height: Ti.UI.SIZE,
                backgroundColor: Ti.App.colorBg,
              },

              childTemplates: [
                {
                  type: "Ti.UI.View",
                  properties: {
                    top: 0,
                    width: Ti.App.realWidth,
                    height: "rant" == type || "rantWithImage" == type ? 1 : 0,
                    backgroundColor: Ti.App.colorLine,
                  },
                },

                {
                  type: "Ti.UI.View",
                  bindId: "upVoteClickable",
                  properties: {
                    top: 0,
                    left: 0,
                    width:
                      me.circleVoteButtonSize + 2 * me.circleVoteButtonPadding,
                    height:
                      me.circleVoteButtonSize + 2 * me.circleVoteButtonPadding,
                  },
                },

                getUpDownCircleVoteButton(
                  "up",
                  me.circleVoteButtonPadding,
                  me.circleVoteButtonPadding
                ),
                {
                  type: "Ti.UI.Label",
                  bindId: "lblScore",
                  properties: {
                    top: me.circleVoteButtonPadding + me.circleVoteButtonSize,
                    bottom: 1,
                    left: 0,
                    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,

                    width:
                      me.circleVoteButtonSize + 2 * me.circleVoteButtonPadding,
                    height: 17,
                    color: Ti.App.colorHint,
                    text: "215",
                    font: {
                      fontSize: Ti.App.fontS,
                      fontWeight: "bold",
                    },
                  },
                },

                {
                  type: "Ti.UI.View",
                  bindId: "downVoteClickable",
                  properties: {
                    top:
                      me.circleVoteButtonPadding +
                      me.circleVoteButtonSize +
                      17 * 0.5,
                    left: 0,
                    width:
                      me.circleVoteButtonSize + 2 * me.circleVoteButtonPadding,
                    height:
                      me.circleVoteButtonSize +
                      1.5 * me.circleVoteButtonPadding,
                  },
                },

                getUpDownCircleVoteButton(
                  "down",
                  me.circleVoteButtonPadding,
                  me.circleVoteButtonPadding + me.circleVoteButtonSize + 17,
                  me.circleVoteButtonPadding
                ),
                {
                  type: "Ti.UI.View",
                  properties: {
                    left:
                      me.circleVoteButtonSize + 2 * me.circleVoteButtonPadding,
                    top: me.circleVoteButtonPadding,

                    width: me.mainContentContainerWidth,
                    height: Ti.UI.SIZE,
                    layout: "vertical",
                  },

                  childTemplates: [
                    usernameSection,
                    {
                      bindId: "lblRantText",
                      type: "Ti.UI.Label",
                      properties: {
                        top: 0,
                        left: 0,
                        width: me.mainContentContainerWidth,
                        height: Ti.UI.SIZE,

                        color: Ti.App.colorDarkGrey,
                        font: {
                          fontSize: Ti.App.fontBody,
                        },
                      },
                    },

                    imageSection,
                    {
                      type: "Ti.UI.View",
                      bindId: "lblTagsCommentsContainer",
                      properties: {
                        bottom: me.circleVoteButtonPadding,
                        width: me.mainContentContainerWidth,
                        height: Ti.UI.SIZE,
                      },

                      childTemplates: [
                        {
                          type: "Ti.UI.Label",
                          bindId: "lblTags",

                          properties: {
                            top: 0,
                            left: 0,
                            width:
                              me.mainContentContainerWidth -
                              commentsContainerWidth,

                            height: Ti.UI.SIZE,

                            color: Ti.App.colorHint,
                            text: "php mysql javascript",
                            font: {
                              fontSize: Ti.App.fontS,
                              fontWeight: "bold",
                            },
                          },
                        },

                        {
                          type: "Ti.UI.View",
                          properties: {
                            top: 0,
                            right: 0,
                            width: Ti.UI.SIZE,
                            height: Ti.UI.SIZE,
                            layout: "horizontal",
                          },

                          childTemplates: [
                            {
                              type: "Ti.UI.Label",
                              bindId: "lblCommentsIcon",
                              properties: {
                                width: Ti.UI.SIZE,
                                height: Ti.UI.SIZE,
                                color: Ti.App.colorHint,
                                text: "\uE806",
                                font: {
                                  fontFamily: "icomoon",
                                  fontSize: "13sp",
                                },
                              },
                            },

                            {
                              type: "Ti.UI.Label",
                              bindId: "lblNumComments",
                              properties: {
                                left: 2,
                                width: Ti.UI.SIZE,
                                height: Ti.UI.SIZE,
                                color: Ti.App.colorHint,
                                text: "29",
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
          ],
        });
    },
    getUpDownCircleVoteButton = function (type, left, top, bottom) {
      var label = "up" == type ? "\uE910" : "\uE911",
        template = {
          type: "Ti.UI.View",
          bindId: type + "Vote",
          properties: {
            width: me.circleVoteButtonSize,
            height: me.circleVoteButtonSize,
            backgroundColor: Ti.App.colorFieldIcon,
            borderRadius: 15,
            borderWidth: 0,
            top: top,
            bottom: bottom,
            left: left,
            touchEnabled: false,
          },

          childTemplates: [
            {
              type: "Ti.UI.Label",
              properties: {
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE,
                color: Ti.App.colorTextContrast,
                text: label,
                font: {
                  fontFamily: "icomoon",
                  fontSize: "13sp",
                },

                touchEnabled: false,
              },
            },
          ],
        };

      return (
        3 == Ti.App.theme &&
          (template.childTemplates[0].bindId = type + "Icon"),
        template
      );
    },
    createList = function () {
      (me.listSection = Ti.UI.createListSection()),
        generateListTemplate("rant"),
        generateListTemplate("firstRant"),
        generateListTemplate("rantWithImage"),
        generateListTemplate("firstRantWithImage"),
        (me.templates.loading = {
          childTemplates: [
            {
              type: "Ti.UI.View",
              properties: {
                width: Ti.App.realWidth,
                height: Ti.UI.SIZE,
                backgroundColor: Ti.App.colorFieldIcon,
              },

              childTemplates: [
                {
                  type: "Ti.UI.Label",
                  properties: {
                    top: 6,
                    bottom: 6,
                    width: Ti.UI.SIZE,
                    height: Ti.UI.SIZE,
                    color: Ti.App.colorTextContrast,
                    text: "Loading more rants...",
                    font: {
                      fontSize: Ti.App.fontS,
                      fontWeight: "bold",
                    },
                  },
                },
              ],
            },
          ],
        }),
        me.options.refreshCallback &&
          (me.refreshControl = Ti.UI.createRefreshControl({
            tintColor: Ti.App.colorHint,
          })),
        (me.listContainer = Ti.UI.createListView({
          width: Ti.App.realWidth,
          height: me.options.height,
          backgroundColor: "#00ffffff",
          willScrollOnStatusTap: me.options.height != Ti.UI.SIZE,
          sections: [me.listSection],
          templates: me.templates,
          defaultItemTemplate: "rant",
          separatorStyle: Ti.App.isAndroid
            ? null
            : Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE,
          lazyLoadingEnabled: false,
          refreshControl: me.refreshControl,
          scrollIndicatorStyle: Ti.App.scrollBarStyle,
          separatorHeight: 0,
        })),
        me.options.refreshCallback &&
          (0
            ? me.swipeRefresh.addEventListener("refreshing", function () {
                me.options.refreshCallback();
              })
            : me.refreshControl.addEventListener("refreshstart", function (e) {
                me.options.refreshCallback();
              })),
        me.listContainer.addEventListener("itemclick", listItemClicked),
        me.listContainer.addEventListener("marker", markerCallback),
        me.listContainer.addEventListener("scrollstart", listScrollStart),
        me.listContainer.addEventListener("scrollend", listScrollEnd);
    },
    listScrollStart = function () {
      me.listIsScrolling = true;
    },
    listScrollEnd = function (e) {
      (me.firstVisibleItem = e.firstVisibleItemIndex),
        (me.listIsScrolling = false);
    };

  me.getItemIdsToCheckForUpdate = function () {
    for (
      var i = me.firstVisibleItem,
        c = 0,
        listItemData = me.listSection.items,
        checkRantIds = [];
      i < listItemData.length && 8 > c;

    ) {
      if (null == listItemData[i]) {
        ++i;
        continue;
      }
      null != listItemData[i].rant &&
        (checkRantIds.push(listItemData[i].rant.id), ++c),
        ++i;
    }

    return checkRantIds;
  };

  var listItemClicked = function (e) {
    if (me.tagTapped) return void (me.tagTapped = false);

    var item = me.listSection.getItemAt(e.itemIndex);

    if (
      "upVote" == e.bindId ||
      "downVote" == e.bindId ||
      "upVoteClickable" == e.bindId ||
      "downVoteClickable" == e.bindId ||
      "upIcon" == e.bindId ||
      "downIcon" == e.bindId
    )
      return void Ti.App.voter.doVote({
        contentType: "rant",
        type: "up" == e.bindId.substr(0, 2) ? "upVote" : "downVote",
        content: item.rant,
        listSection: me.listSection,
        index: e.itemIndex,
      });
    if (
      "lblUsername" == e.bindId ||
      "lblUserScoreContainer" == e.bindId ||
      "lblUserScore" == e.bindId
    )
      return void Ti.App.openProfileWindow(item.rant.user_id);

    if ("rantImage" == e.bindId && item.rant.isAndroidGif)
      return (
        (item.rant.attached_image.type = "rant"),
        (item.rant.attached_image.id = item.rant.id),
        void Ti.App.showImageViewer(item.rant.attached_image)
      );
    if ("" == e.bindId);

    if (null != me.tapTimeout)
      return (
        clearTimeout(me.tapTimeout),
        (me.tapTimeout = null),
        void Ti.App.voter.doVote({
          contentType: "rant",
          type: "upVote",
          content: item.rant,
          listSection: me.listSection,
          index: e.itemIndex,
          fromDoubleTap: true,
        })
      );

    var vote_state = item.rant.vote_state;

    if (
      ((item.itemBg = { opacity: 1 == Ti.App.theme ? 0.75 : 0.9 }),
      1 == vote_state || -2 == vote_state)
    )
      me.listSection.updateItemAt(e.itemIndex, item),
        Ti.App.openRantWindow(item.rant.id, false, item.rant.rt),
        setTimeout(function () {
          (item.itemBg.opacity = 1),
            me.listSection.updateItemAt(e.itemIndex, item);
        }, 500);
    else {
      var useData = item;

      me.listSection.updateItemAt(e.itemIndex, item),
        (me.tapTimeout = setTimeout(function () {
          (me.tapTimeout = null),
            Ti.App.openRantWindow(item.rant.id, false, item.rant.rt),
            (item.itemBg.opacity = 1),
            me.listSection.updateItemAt(e.itemIndex, item);
        }, 250));
    }
  };

  (me.addRantsToList = function (rants) {
    var i,
      rantInfo,
      dataItem,
      useTemplate,
      dataItems = [],
      curIndex = me.listSection.items.length;

    if (0 == me.listSection.items.length) {
      me.rantSeriesId = Ti.App.rantSeriesId++;

      var savedTabs = Ti.App.savedTabs;
      (savedTabs.rants.obj.rantSeries[me.rantSeriesId] = {
        listSection: me.listSection,
        rants: {},
      }),
        (Ti.App.savedTabs = savedTabs);
    }
    var savedTabs = Ti.App.savedTabs,
      rantSeriesInfo = savedTabs.rants.obj.rantSeries[me.rantSeriesId].rants;
    for (i in rants)
      ((rantInfo = rants[i]), null == me.rantsIdToIndex[rantInfo.id]) &&
        ((dataItem = getTemplateFromRantInfo(rantInfo, curIndex)),
        dataItems.push(dataItem),
        (me.rantsIdToIndex[rantInfo.id] = curIndex),
        (rantSeriesInfo[rantInfo.id] = curIndex),
        ++curIndex);

    (Ti.App.savedTabs = savedTabs),
      me.listSection.appendItems(dataItems, {
        animated: true,
      }),
      hookScrollHitBottom();
  }),
    (me.updateRants = function (rants) {
      var i, dataItem, index;

      for (i = 0; i < rants.length; ++i)
        if (((index = me.rantsIdToIndex[rants[i].id]), null != index)) {
          if (
            null == me.listSection.items[index] ||
            null == me.listSection.items[index].rant ||
            me.listSection.items[index].rant.vote_state != rants[i].vote_state
          )
            continue;

          (dataItem = getTemplateFromRantInfo(rants[i], index)),
            me.listSection.updateItemAt(index, dataItem);
        }
    });

  var getTemplateFromRantInfo = function (rantInfo, curIndex) {
    var dataItem, useWidth, useHeight, ratio, useTemplate;

    (useTemplate = "rant"),
      0 == curIndex
        ? rantInfo.attached_image
          ? (useTemplate = "firstRantWithImage")
          : (useTemplate = "firstRant")
        : rantInfo.attached_image && (useTemplate = "rantWithImage");

    var dataItem = {
      template: useTemplate,

      rant: rantInfo,
      properties: {
        height: Ti.UI.SIZE,
        selectionStyle: Ti.App.isAndroid
          ? null
          : Ti.UI.iOS.ListViewCellSelectionStyle.NONE,
      },

      lblRantText: {
        text: Ti.App.formatRantText(rantInfo.text, me.options.maxChrs),
      },

      lblScore: {
        text:
          1e3 > rantInfo.score
            ? rantInfo.score
            : Ti.App.toRoundedK(rantInfo.score, 1e3),
        color:
          1 == rantInfo.vote_state || -1 == rantInfo.vote_state
            ? Ti.App.btnVoteColors.selected
            : Ti.App.colorHint,
      },

      lblNumComments: {
        visible: 0 != rantInfo.num_comments,
        text: rantInfo.num_comments,
      },

      lblCommentsIcon: {
        visible: 0 != rantInfo.num_comments,
      },

      lblTagsCommentsContainer: {
        height:
          "" != rantInfo.tags ||
          0 != rantInfo.num_comments ||
          rantInfo.c_type_long
            ? Ti.UI.SIZE
            : 0,
        top:
          "" != rantInfo.tags ||
          0 != rantInfo.num_comments ||
          rantInfo.c_type_long
            ? 4
            : 0,
      },

      upVote: {
        backgroundColor: Ti.App.getVoteButtonColor("up", rantInfo.vote_state),
      },

      downVote: {
        backgroundColor: Ti.App.getVoteButtonColor("down", rantInfo.vote_state),
      },
    };

    if (
      (3 == Ti.App.theme &&
        (1 == rantInfo.vote_state
          ? ((dataItem.upIcon = { color: Ti.App.colorBtnInverse }),
            (dataItem.downIcon = { color: Ti.App.colorTextContrast }))
          : -1 == rantInfo.vote_state &&
            ((dataItem.downIcon = { color: Ti.App.colorBtnInverse }),
            (dataItem.upIcon = { color: Ti.App.colorTextContrast }))),
      (dataItem.lblTags = rantInfo.c_type_long
        ? { text: rantInfo.c_type_long }
        : rantInfo.tags.length
        ? { text: rantInfo.tags.join(", ") }
        : { text: "" }),
      me.options.showUsernames &&
        ((dataItem.lblUsername = { text: rantInfo.user_username }),
        (dataItem.lblUserScore = {
          text:
            (0 < rantInfo.user_score ? "+" : "") +
            (Ti.App.binaryScores
              ? (+rantInfo.user_score).toString(2)
              : rantInfo.user_score) +
            "",
        })),
      rantInfo.attached_image)
    ) {
      (useWidth = rantInfo.attached_image.width),
        (useHeight = rantInfo.attached_image.height),
        (ratio = me.mainContentContainerWidth / useWidth),
        (useWidth = me.mainContentContainerWidth),
        (useHeight *= ratio),
        (dataItem.rantImageContainer = {
          height: useHeight,
        }),
        useHeight > Ti.App.realHeight / 2 &&
          (dataItem.rantImageContainer = {
            height: Ti.App.realHeight / 2,
          });

      var useImageSrc = rantInfo.attached_image.frame
        ? rantInfo.attached_image.frame
        : rantInfo.attached_image.url;

      autoLoadImages ||
        ((useWidth = 1200),
        (useHeight = 282),
        (ratio = me.mainContentContainerWidth / useWidth),
        (useWidth = me.mainContentContainerWidth),
        (useHeight *= ratio),
        (useImageSrc = Ti.App.hiddenImg),
        (dataItem.rantImageContainer.height = useHeight)),
        (dataItem.rantImage = {
          image: useImageSrc,
          width: useWidth,
          height: useHeight,
        }),
        "gif" == rantInfo.attached_image.url.toLowerCase().substr(-3)
          ? ((dataItem.gifIndicator = {
              visible: true,
            }),
            Ti.App.isAndroid && (dataItem.rant.isAndroidGif = true))
          : Ti.App.isAndroid &&
            ((dataItem.gifIndicator = {
              visible: false,
            }),
            (dataItem.rant.isAndroidGif = false));
    }

    return dataItem;
  };

  return (
    (me.showLoadingRow = function () {
      var dataItem = {
          template: "loading",
          properties: {
            height: Ti.UI.SIZE,
            selectionStyle: Ti.App.isAndroid
              ? null
              : Ti.UI.iOS.ListViewCellSelectionStyle.NONE,
          },
        },
        dataItems = [];
      dataItems.push(dataItem),
        me.listSection.appendItems(dataItems, { animated: true });
    }),
    (me.removeLoadingRow = function () {
      if (0 != me.listSection.items.length) {
        var lastItem = me.listSection.getItemAt(
          me.listSection.items.length - 1
        );
        "loading" == lastItem.template &&
          me.listSection.deleteItemsAt(me.listSection.items.length - 1, 1);
      }
    }),
    (me.destroy = function () {}),
    (me.fixRefreshControl = function () {
      me.listContainer.refreshControl = me.refreshControl;
    }),
    (me.destroySeries = function () {
      if (null != me.rantSeriesId) {
        var savedTabs = Ti.App.savedTabs;
        delete savedTabs.rants.obj.rantSeries[me.rantSeriesId],
          (Ti.App.savedTabs = savedTabs),
          (me.rantSeriesId = null);
      }
    }),
    (me.clearList = function (animate) {
      (autoLoadImages = Ti.App.autoLoadImages),
        (animate = animate || false),
        (me.firstVisibleItem = 0),
        (me.rantsIdToIndex = {}),
        me.destroySeries(),
        me.listSection.deleteItemsAt(0, me.listSection.items.length, {
          animated: animate,
        }),
        me.options.refreshCallback &&
          (0
            ? me.swipeRefresh.setRefreshing(false)
            : (me.refreshControl.endRefreshing(),
              Ti.App.isAndroid &&
                (me.listContainer.refreshControl = me.refreshControl))),
        (me.tagAttrs = []),
        Ti.App.isAndroid && (me = null);
    }),
    me
  );
}

module.exports = RantListView5;
