function SubscribedListView() {
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
    (me.listIsScrolling = false),
    (me.refreshControl = null),
    (me.tagTapped = false),
    (me.tagAttrs = {});
  var _recStartPosition = null,
    _numRecsLoaded = 0,
    _recUsersData = [],
    _numRecsToShow = 3;

  me.tapTimeout = null;
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
        subscribeInfoHeight = 50,
        imageSection = null,
        usernameSection = null;

      Ti.App.isAndroid &&
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
                layout: "vertical",
                backgroundColor: Ti.App.colorBg,
              },

              childTemplates: [
                {
                  type: "Ti.UI.View",
                  properties: {
                    top: 10,
                    left: 10,
                    width: Ti.UI.FILL,
                    height: Ti.UI.SIZE,

                    layout: "horizontal",
                    horizontalWrap: false,
                  },

                  childTemplates: [
                    {
                      type: "Ti.UI.ImageView",
                      bindId: "imgUserAvatar0",
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
                      bindId: "imgUserAvatar1",
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
                      bindId: "imgUserAvatar2",
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
                      type: "Ti.UI.Label",
                      bindId: "lblActions",
                      properties: {
                        left: 10,
                        right: 4,

                        width: Ti.App.isAndroid
                          ? Ti.App.realWidth - 105
                          : Ti.UI.FILL,
                        height: Ti.UI.SIZE,
                      },
                    },
                  ],
                },

                {
                  type: "Ti.UI.View",
                  properties: {
                    width: Ti.App.realWidth,
                    height: Ti.UI.SIZE,
                  },

                  childTemplates: [
                    {
                      type: "Ti.UI.View",
                      bindId: "upVoteClickable",
                      properties: {
                        top: 0,
                        left: 0,
                        width:
                          me.circleVoteButtonSize +
                          2 * me.circleVoteButtonPadding,
                        height:
                          me.circleVoteButtonSize +
                          2 * me.circleVoteButtonPadding,
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
                        top:
                          me.circleVoteButtonPadding + me.circleVoteButtonSize,
                        bottom: 1,
                        left: 0,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,

                        width:
                          me.circleVoteButtonSize +
                          2 * me.circleVoteButtonPadding,
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
                          me.circleVoteButtonSize +
                          2 * me.circleVoteButtonPadding,
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
                          me.circleVoteButtonSize +
                          2 * me.circleVoteButtonPadding,
                        top: me.circleVoteButtonPadding,

                        width: me.mainContentContainerWidth,
                        height: Ti.UI.SIZE,
                        layout: "vertical",
                      },

                      childTemplates: [
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

                {
                  type: "Ti.UI.View",
                  properties: {
                    bottom: 0,
                    width: Ti.App.realWidth,
                    height: 1,
                    backgroundColor: Ti.App.colorLine,
                  },
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
        generateListTemplate("firstRantWithImage");
      var useBgColor = "#F3F3F3",
        useBubbleColor = Ti.App.colorBg;

      2 == Ti.App.theme
        ? ((useBgColor = Ti.App.colorMidBlue),
          (useBubbleColor = Ti.App.colorDarkBlue))
        : 3 == Ti.App.theme &&
          ((useBgColor = Ti.App.colorBlackDarkGrey),
          (useBubbleColor = Ti.App.colorBlack)),
        (me.templates.recHeader = {
          childTemplates: [
            {
              type: "Ti.UI.View",
              properties: {
                backgroundColor: useBgColor,
                width: Ti.App.realWidth,
                height: Ti.UI.SIZE,
              },

              childTemplates: [
                {
                  type: "Ti.UI.Label",
                  properties: {
                    left: 10,
                    top: 10,
                    bottom: 10,
                    width: Ti.UI.SIZE,
                    height: Ti.UI.SIZE,
                    color: Ti.App.colorLink,
                    text: "Ranters You May Appreciate",
                    font: {
                      fontSize: "14sp",
                      fontWeight: "bold",
                    },
                  },
                },
              ],
            },
          ],
        }),
        (me.templates.viewMoreRecs = {
          childTemplates: [
            {
              type: "Ti.UI.View",
              properties: {
                backgroundColor: useBgColor,
                width: Ti.App.realWidth,
                height: Ti.UI.SIZE,
              },

              childTemplates: [
                {
                  type: "Ti.UI.Label",
                  properties: {
                    left: 10,
                    top: 8,
                    bottom: 10,
                    width: Ti.UI.SIZE,
                    height: Ti.UI.SIZE,
                    color: Ti.App.colorLink,
                    text: "View more suggested users",
                    font: {
                      fontSize: "14sp",
                    },
                  },
                },
              ],
            },
          ],
        }),
        (me.templates.empty = {
          childTemplates: [
            {
              type: "Ti.UI.View",
              properties: {
                backgroundColor: Ti.App.colorBg,
                width: Ti.App.realWidth,
                height: 310,
              },

              childTemplates: [
                {
                  type: "Ti.UI.View",
                  properties: {
                    width: Ti.UI.SIZE,
                    height: Ti.UI.SIZE,

                    layout: "vertical",
                  },

                  childTemplates: [
                    {
                      type: "Ti.UI.Label",
                      properties: {
                        text: "\uE91E",
                        color: Ti.App.colorHint,
                        font: {
                          fontSize: "115sp",
                          fontFamily: "icomoon",
                        },
                      },
                    },

                    {
                      type: "Ti.UI.Label",
                      properties: {
                        top: 12,
                        text: "Your Subscribed Feed",
                        color: Ti.App.colorLink,
                        font: {
                          fontSize: Ti.App.fontBody,
                          fontWeight: "bold",
                        },
                      },
                    },

                    {
                      type: "Ti.UI.Label",
                      properties: {
                        top: 7,
                        width: 0.75 * Ti.App.realWidth,
                        color: Ti.App.colorDarkGrey,
                        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
                        text: "Subscribe to some fellow ranters to see an activity feed of rants they post, comment on and like.",
                        font: {
                          fontSize: Ti.App.fontBody,
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        }),
        (me.templates.recUser = {
          childTemplates: [
            {
              type: "Ti.UI.View",
              properties: {
                width: Ti.App.realWidth,
                height: Ti.UI.SIZE,
                backgroundColor: useBgColor,
              },

              childTemplates: [
                {
                  type: "Ti.UI.View",
                  properties: {
                    width: Ti.App.realWidth - 20,
                    height: 70,
                    backgroundColor: useBubbleColor,
                    borderRadius: 10,
                    bottom: 5,
                  },

                  childTemplates: [
                    {
                      type: "Ti.UI.ImageView",
                      bindId: "imgAvatar",
                      properties: {
                        left: 10,
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        borderWidth: 0,

                        defaultImage: "",
                      },
                    },

                    {
                      type: "Ti.UI.View",
                      properties: {
                        left: 70,
                        width: Ti.UI.SIZE,
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
                            color: Ti.App.colorLink,
                            text: "",
                            font: {
                              fontSize: Ti.App.fontBody,
                              fontWeight: "bold",
                            },
                          },
                        },

                        {
                          bindId: "lblScoreContainer",
                          type: "Ti.UI.View",
                          properties: {
                            top: 2,

                            left: 0,
                            width: Ti.UI.SIZE,
                            height: 16,
                            backgroundColor: Ti.App.colorScoreContainer,
                            borderRadius: 5,
                            borderWidth: 0,
                          },

                          childTemplates: [
                            {
                              bindId: "lblScore",
                              type: "Ti.UI.Label",
                              properties: {
                                top: Ti.App.isAndroid ? -1.5 : null,

                                width: Ti.UI.SIZE,
                                height: Ti.UI.SIZE,
                                left: 5,
                                right: 5,
                                text: "",
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
                    },

                    {
                      type: "Ti.UI.View",
                      properties: {
                        top: 8,
                        bottom: 8,

                        right: 31,
                        width: 1,
                        height: Ti.UI.FILL,
                        backgroundColor: Ti.App.colorLine,
                      },
                    },

                    {
                      type: "Ti.UI.Label",
                      bindId: "lblSubscribe",
                      properties: {
                        right: 40,
                        width: Ti.UI.SIZE,
                        height: Ti.UI.FILL,
                        text: "Subscribe",
                        color: Ti.App.colorHint,
                        font: {
                          fontSize: "14sp",
                          fontWeight: "bold",
                        },
                      },
                    },

                    {
                      type: "Ti.UI.Label",
                      bindId: "lblDismiss",
                      properties: {
                        right: 10,

                        width: Ti.UI.SIZE,
                        height: Ti.UI.FILL,
                        color: Ti.App.colorHint,
                        text: "\uE803",
                        font: {
                          fontSize: "16sp",
                          fontFamily: "icomoon",
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        }),
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

    if ("recUser" == item.template) {
      if ("lblSubscribe" == e.bindId) {
        var endpoint = "users/" + item.userId + "/subscribe",
          apiArgs = {
            method: item.subscribed ? "DELETE" : "POST",
            endpoint: endpoint,
            params: {},
            callback: function (result) {},
            includeAuth: true,
          };

        Ti.App.api(apiArgs),
          (item.lblSubscribe = {
            text: item.subscribed ? "Subscribe" : "Subscribed",
            color: item.subscribed ? Ti.App.colorHint : Ti.App.colorLink,
          }),
          (item.subscribed = !item.subscribed),
          me.listSection.updateItemAt(e.itemIndex, item);
      } else if ("lblDismiss" == e.bindId) {
        --_numRecsLoaded;

        var apiArgs = {
          method: "POST",
          endpoint: "me/dismiss-rec-user",
          params: {
            dismiss_user_id: item.userId,
          },

          includeAuth: true,
        };

        Ti.App.api(apiArgs),
          _recUsersData.splice(e.itemIndex - _recStartPosition, 1),
          me.listSection.deleteItemsAt(e.itemIndex, 1, {
            animated: true,
          });
      } else Ti.App.openProfileWindow(item.userId);

      return;
    }
    if ("viewMoreRecs" == item.template) {
      var addUsers = _recUsersData.slice(
        _numRecsLoaded,
        _numRecsLoaded + _numRecsToShow
      );

      return (
        me.listSection.insertItemsAt(
          _recStartPosition + _numRecsLoaded,
          addUsers,
          { animated: true }
        ),
        (_numRecsLoaded += addUsers.length),
        void (
          _numRecsLoaded >= _recUsersData.length &&
          me.listSection.deleteItemsAt(_recStartPosition + _numRecsLoaded, 1)
        )
      );
    }
    if ("recHeader" != item.template && "empty" != item.template) {
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
    }
  };

  me.addRantsToList = function (rants, users, rec_users) {
    var i,
      rantInfo,
      dataItem,
      useTemplate,
      _Mathmin = Math.min,
      dataItems = [],
      curIndex = me.listSection.items.length;
    for (i in (0 == rants.length && dataItems.push({ template: "empty" }),
    rants)) {
      (rantInfo = rants[i].rant),
        (dataItem = getTemplateFromRantInfo(rantInfo, curIndex));
      for (
        var thisAction,
          actions = rants[i].actions,
          postedAction = null,
          useActions = [],
          actedUsers = [],
          hasLiked = false,
          hasCommented = false,
          j = 0;
        j < actions.length;
        ++j
      )
        (thisAction = actions[j]),
          "posted" == thisAction.action && (postedAction = thisAction);
      for (var thisAction, j = 0; j < actions.length; ++j)
        (thisAction = actions[j]),
          "posted" != thisAction.action &&
            (null == postedAction || thisAction.uid != postedAction.uid) &&
            (-1 === actedUsers.indexOf(thisAction.uid) &&
              actedUsers.push(thisAction.uid),
            "liked" == thisAction.action
              ? (hasLiked = true)
              : ((thisAction.action = "commented on"), (hasCommented = true)),
            useActions.push(thisAction));
      var actionText = "",
        boldParts = [];
      if (null != postedAction) {
        if (
          ((dataItem.imgUserAvatar0 = _getAvatarImageTemplateInfo(
            users[postedAction.uid].avatar,
            true
          )),
          boldParts.push(users[postedAction.uid].username),
          (actionText = users[postedAction.uid].username + " posted this rant"),
          useActions.length)
        )
          if (
            ((actionText += " that "),
            1 == useActions.length || 1 == actedUsers.length)
          ) {
            (actionText += users[useActions[0].uid].username + " "),
              boldParts.push(users[useActions[0].uid].username);
            var useActionTexts = [];
            hasCommented && useActionTexts.push("commented on"),
              hasLiked && useActionTexts.push("liked"),
              (actionText += useActionTexts.join(" & ")),
              (dataItem.imgUserAvatar1 = _getAvatarImageTemplateInfo(
                users[useActions[0].uid].avatar
              ));
          } else if (2 == actedUsers.length) {
            (actionText +=
              users[actedUsers[0]].username +
              " & " +
              users[actedUsers[1]].username +
              " "),
              boldParts.push(
                users[actedUsers[0]].username +
                  " & " +
                  users[actedUsers[1]].username
              ),
              (dataItem.imgUserAvatar1 = _getAvatarImageTemplateInfo(
                users[actedUsers[0]].avatar
              )),
              (dataItem.imgUserAvatar2 = _getAvatarImageTemplateInfo(
                users[actedUsers[1]].avatar
              ));
            var useActionTexts = [];
            hasCommented && useActionTexts.push("commented on"),
              hasLiked && useActionTexts.push("liked"),
              (actionText += useActionTexts.join(" & "));
          } else {
            var numUsersToShow = actedUsers.length - 2;
            (actionText +=
              users[actedUsers[0]].username +
              ", " +
              users[actedUsers[1]].username +
              " & " +
              numUsersToShow +
              " " +
              (1 < numUsersToShow ? "others" : "other") +
              " you subscribe to "),
              boldParts.push(
                users[actedUsers[0]].username +
                  ", " +
                  users[actedUsers[1]].username
              ),
              (dataItem.imgUserAvatar1 = _getAvatarImageTemplateInfo(
                users[actedUsers[0]].avatar
              )),
              (dataItem.imgUserAvatar2 = _getAvatarImageTemplateInfo(
                users[actedUsers[1]].avatar
              ));
            var useActionTexts = [];
            hasCommented && useActionTexts.push("commented on"),
              hasLiked && useActionTexts.push("liked"),
              (actionText += useActionTexts.join(" or "));
          }
      } else if (1 == useActions.length)
        (actionText =
          users[useActions[0].uid].username +
          " " +
          useActions[0].action +
          " this rant"),
          boldParts.push(users[useActions[0].uid].username),
          (dataItem.imgUserAvatar0 = _getAvatarImageTemplateInfo(
            users[useActions[0].uid].avatar,
            true
          ));
      else if (1 == actedUsers.length)
        (actionText =
          users[useActions[0].uid].username +
          " " +
          useActions[0].action +
          " and " +
          useActions[1].action +
          " this rant"),
          boldParts.push(users[useActions[0].uid].username),
          (dataItem.imgUserAvatar0 = _getAvatarImageTemplateInfo(
            users[useActions[0].uid].avatar,
            true
          ));
      else if (2 == actedUsers.length) {
        (actionText =
          users[actedUsers[0]].username +
          " & " +
          users[actedUsers[1]].username),
          boldParts.push(
            users[actedUsers[0]].username +
              " & " +
              users[actedUsers[1]].username
          ),
          (dataItem.imgUserAvatar0 = _getAvatarImageTemplateInfo(
            users[actedUsers[0]].avatar,
            true
          )),
          (dataItem.imgUserAvatar1 = _getAvatarImageTemplateInfo(
            users[actedUsers[1]].avatar
          ));
        var useActionTexts = [];
        hasCommented && useActionTexts.push("commented on"),
          hasLiked && useActionTexts.push("liked"),
          (actionText += " " + useActionTexts.join(" & ") + " this rant");
      } else {
        var numUsersToShow = actedUsers.length - 2;
        (actionText =
          users[actedUsers[0]].username +
          ", " +
          users[actedUsers[1]].username +
          " & " +
          numUsersToShow +
          " " +
          (1 < numUsersToShow ? "others" : "other") +
          " you subscribe to "),
          boldParts.push(
            users[actedUsers[0]].username + ", " + users[actedUsers[1]].username
          ),
          (dataItem.imgUserAvatar0 = _getAvatarImageTemplateInfo(
            users[actedUsers[0]].avatar,
            true
          )),
          (dataItem.imgUserAvatar1 = _getAvatarImageTemplateInfo(
            users[actedUsers[1]].avatar
          )),
          (dataItem.imgUserAvatar2 = _getAvatarImageTemplateInfo(
            users[actedUsers[2]].avatar
          ));
        var useActionTexts = [];
        hasCommented && useActionTexts.push("commented on"),
          hasLiked && useActionTexts.push("liked"),
          (actionText += useActionTexts.join(" or ") + " this rant"),
          console.log("action text is", actionText);
      }
      for (
        var attributes = [
            {
              type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
              value: Ti.App.colorLink,
              range: [0, actionText.length],
            },
            {
              type: Ti.UI.ATTRIBUTE_FONT,
              value: { fontSize: "14sp" },
              range: [0, actionText.length],
            },
          ],
          k = 0;
        k < boldParts.length;
        ++k
      ) {
        var part = boldParts[k],
          startPos = actionText.indexOf(part);
        attributes.push({
          type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
          value: Ti.App.colorLink,
          range: [startPos, part.length],
        }),
          attributes.push({
            type: Ti.UI.ATTRIBUTE_FONT,
            value: { fontWeight: "bold", fontSize: "14sp" },
            range: [startPos, part.length],
          });
      }
      var attr = Ti.UI.createAttributedString({
        text: actionText,
        attributes: attributes,
      });
      (dataItem.lblActions = { attributedString: attr }),
        dataItems.push(dataItem),
        ++curIndex;
    }
    if (rec_users && rec_users.length) {
      (_recStartPosition = _Mathmin(3, rants.length)),
        0 == rants.length && ++_recStartPosition,
        dataItems.splice(_recStartPosition, 0, {
          template: "recHeader",
        }),
        ++_recStartPosition;

      for (var m = 0; m < rec_users.length; ++m) {
        var thisUser = users[rec_users[m].uid],
          avatarInfo = {
            backgroundColor: "#" + thisUser.avatar.b,
          };

        thisUser.avatar.i &&
          (avatarInfo.image = Ti.App.avatarImageUrl + thisUser.avatar.i),
          _recUsersData.push({
            template: "recUser",
            subscribed: false,
            userId: rec_users[m].uid,
            imgAvatar: avatarInfo,
            lblUsername: {
              text: thisUser.username,
            },

            lblScore: {
              text:
                (0 < thisUser.score ? "+" : "") +
                (Ti.App.binaryScores
                  ? (+thisUser.score).toString(2)
                  : thisUser.score) +
                "",
            },
          });
      }

      for (m = 0; m < _numRecsToShow && m < _recUsersData.length; ++m)
        dataItems.splice(_recStartPosition + m, 0, _recUsersData[m]);

      (_numRecsLoaded += m),
        dataItems.splice(_recStartPosition + m, 0, {
          template: "viewMoreRecs",
        });
    }

    dataItems.length &&
      me.listSection.appendItems(dataItems, {
        animated: true,
      }),
      hookScrollHitBottom();
  };
  var _getAvatarImageTemplateInfo = function (avatar, first) {
      var item = {
        backgroundColor: "#" + avatar.b,
      };

      return (
        (item.width = 30),
        true !== first && (item.left = -7),
        avatar.i && (item.image = Ti.App.avatarImageUrl + avatar.i),
        item
      );
    },
    getTemplateFromRantInfo = function (rantInfo, curIndex) {
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
          backgroundColor: Ti.App.getVoteButtonColor(
            "down",
            rantInfo.vote_state
          ),
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
    (me.clearList = function (animate) {
      (autoLoadImages = Ti.App.autoLoadImages),
        (animate = animate || false),
        (me.firstVisibleItem = 0),
        (_numRecsLoaded = 0),
        (_recStartPosition = null),
        (_recUsersData = []),
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

module.exports = SubscribedListView;
