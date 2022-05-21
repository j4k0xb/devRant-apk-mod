function CommentListView() {
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
    (me.lastCommentId = 0),
    (me.gifDimens = null),
    (me.linkTapped = false),
    (me.tagAttrs = {}),
    (me.rantSeriesId = {}),
    (me.textAttrs = {}),
    (me.tapTimeout = null);
  var autoLoadImages = Ti.App.autoLoadImages,
    _hasRefreshRow = false;

  (me.init = function (options) {
    (me.options = options || {}),
      Ti.App.rantAvatarImages || (me.hideAvatarImages = true),
      createList();
  }),
    (me.getView = function () {
      return me.listContainer;
    });
  var generateListTemplate = function (type) {
      var lblScoreHeight = 17,
        commentsContainerWidth = 60,
        imageSection = null,
        useContainerWidth = me.mainContentContainerWidth,
        leftMargin = 0,
        bottomLeftSection = null;

      "rant" == type || "rantWithImage" == type
        ? (bottomLeftSection = {
            type: "Ti.UI.Label",
            bindId: "lblTags",
            properties: {
              top: 0,
              left: 0,
              width: me.mainContentContainerWidth - commentsContainerWidth,
              height: Ti.UI.SIZE,

              verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
            },

            events: {
              link: tagLinkClick,
            },
          })
        : Ti.App.isAndroid &&
          (bottomLeftSection = {
            type: "Ti.UI.View",
            bindId: "lblTags",
            properties: {
              height: 0,
            },
          }),
        ("comment" == type || "commentWithImage" == type) &&
          true != me.options.commentsOnly &&
          ((bottomLeftSection = {
            type: "Ti.UI.Label",
            bindId: "lblReply",
            properties: {
              left: 0,
              top: 0,

              width: Ti.UI.SIZE,
              height: Ti.UI.SIZE,
              color: Ti.App.colorHint,
              text: "Reply",
              font: {
                fontSize: Ti.App.fontS,
                fontWeight: "bold",
              },
            },
          }),
          (leftMargin = 26),
          (useContainerWidth -= leftMargin)),
        "rantWithImage" == type || "commentWithImage" == type
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

              events: {
                longpress: imageLongPressed,
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
                height: 0,
              },
            });

      var useCommentFeatures = "comment" == type || "commentWithImage" == type;
      me.templates[type] = {
        childTemplates: [
          {
            type: "Ti.UI.View",
            properties: {
              width: Ti.App.realWidth,
              height: Ti.UI.SIZE,
              bindId: "itemBg",
              backgroundColor: Ti.App.colorBg,
            },

            childTemplates: [
              {
                type: "Ti.UI.View",
                bindId: "sideBar",
                properties: {
                  top: useCommentFeatures ? me.circleVoteButtonPadding : 0,
                  left: useCommentFeatures ? leftMargin - 4 : 0,
                  width: useCommentFeatures ? 4 : 0,
                  height: useCommentFeatures ? 78 : 0,
                  borderRadius: 2,
                  borderWidth: 0,
                  backgroundColor: Ti.App.colorBgThird,
                  layout: "vertical",
                },
              },

              {
                type: "Ti.UI.View",
                properties: {
                  top: 0,
                  width: Ti.App.realWidth,
                  height: useCommentFeatures ? 1 : 0,
                  backgroundColor: Ti.App.colorLine,
                },
              },

              {
                type: "Ti.UI.View",
                bindId: "upVoteClickable",
                properties: {
                  top: 0,
                  left: useCommentFeatures ? leftMargin : 0,
                  width:
                    me.circleVoteButtonSize + 2 * me.circleVoteButtonPadding,
                  height:
                    me.circleVoteButtonSize + 2 * me.circleVoteButtonPadding,
                },
              },

              getUpDownCircleVoteButton(
                "up",
                me.circleVoteButtonPadding + leftMargin,
                me.circleVoteButtonPadding
              ),
              {
                type: "Ti.UI.Label",
                bindId: "lblScore",
                properties: {
                  top: me.circleVoteButtonPadding + me.circleVoteButtonSize,
                  left: leftMargin,
                  bottom: 1,
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
                    0.5 * 17,
                  left: useCommentFeatures ? leftMargin : 0,
                  width:
                    me.circleVoteButtonSize + 2 * me.circleVoteButtonPadding,
                  height:
                    me.circleVoteButtonSize + 2 * me.circleVoteButtonPadding,
                },
              },

              getUpDownCircleVoteButton(
                "down",
                me.circleVoteButtonPadding + leftMargin,
                me.circleVoteButtonPadding + me.circleVoteButtonSize + 17
              ),
              {
                type: "Ti.UI.View",
                properties: {
                  left:
                    me.circleVoteButtonSize +
                    2 * me.circleVoteButtonPadding +
                    leftMargin,
                  top: me.circleVoteButtonPadding,

                  width: useContainerWidth,
                  height: Ti.UI.SIZE,
                  layout: "vertical",
                },

                childTemplates: [
                  {
                    type: "Ti.UI.View",
                    properties: {
                      width: useContainerWidth,
                      height: 45,
                      bottom: 3,
                    },

                    childTemplates: [
                      {
                        bindId: "imgAvatar",
                        type: "Ti.UI.ImageView",
                        properties: {
                          defaultImage: "",
                          left: 0,
                          width: 45,
                          height: 45,
                          borderRadius: 22.5,
                          borderWidth: 0,

                          image: "",
                        },
                      },

                      {
                        bindId: "lblUsername",
                        type: "Ti.UI.Label",
                        properties: {
                          top: 1,
                          left: 53,
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
                        type: "Ti.UI.View",
                        properties: {
                          top: 23,
                          left: 53,
                          width: Ti.UI.SIZE,
                          height: 16,

                          layout: "horizontal",
                          horizontalWrap: false,
                          zIndex: 5,
                        },

                        childTemplates: [
                          {
                            bindId: "lblUserScoreContainer",
                            type: "Ti.UI.View",
                            properties: {
                              top: 0,

                              width: Ti.UI.SIZE,
                              height: 16,
                              backgroundColor: Ti.App.colorScoreContainer,
                              borderRadius: 5,
                              borderWidth: 0,
                            },

                            childTemplates: [
                              {
                                bindId: "lblUserScore",
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

                          {
                            bindId: "lblDppContainer",
                            type: "Ti.UI.View",
                            properties: {
                              top: 0,

                              left: 4,
                              width: Ti.UI.SIZE,
                              height: 16,

                              borderRadius: 5,
                              borderWidth: 0,
                              visible: false,
                            },

                            childTemplates: [
                              {
                                bindId: "lblDpp",
                                type: "Ti.UI.Label",
                                properties: {
                                  width: Ti.UI.SIZE,
                                  height: Ti.UI.SIZE,
                                  left: 5,
                                  right: 5,

                                  color: Ti.App.colorTextContrast,
                                  font: {
                                    fontSize: "10sp",
                                    fontFamily: "icomoon",
                                  },
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },

                  me.options.parent &&
                  2 == me.options.parent.rantType &&
                  "comment" != type &&
                  "commentWithImage" != type
                    ? Ti.App.getCollabRowTemplate(useContainerWidth)
                    : {
                        bindId: "lblRantText",
                        type: "Ti.UI.Label",
                        events: { link: linkClick },
                        properties: {
                          width: useContainerWidth,
                          height: Ti.UI.SIZE,
                        },
                      },
                  imageSection,
                  {
                    type: "Ti.UI.View",
                    bindId: "bottomContainer",
                    properties: {
                      top: 4,
                      width: useContainerWidth,
                      height: Ti.UI.SIZE,
                      bottom: 10,
                    },

                    childTemplates: [
                      bottomLeftSection,
                      {
                        type: "Ti.UI.Label",
                        bindId: "lblReport",
                        properties: {
                          top: 0,
                          right: 0,
                          width: Ti.UI.SIZE,
                          height: Ti.UI.SIZE,
                          color: Ti.App.colorHint,
                          text: "Report",
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
                type: "Ti.UI.Label",
                bindId: "lblTime",
                properties: {
                  right: me.circleVoteButtonPadding,
                  top: me.circleVoteButtonPadding + 1,
                  width: Ti.UI.SIZE,
                  height: Ti.UI.SIZE,
                  color: Ti.App.colorHint,
                  text: "",
                  font: {
                    fontSize: Ti.App.fontS,
                    fontWeight: "bold",
                  },
                },
              },
            ],
          },
        ],
      };
    },
    tagLinkClick = function (e) {
      (me.linkTapped = true), Ti.App.openSearchWindow(e.url, "rant");
    },
    imageLongPressed = function (e) {
      if (
        ((me.linkTapped = true),
        me.options.parent && me.options.parent.openSharer)
      )
        if (0 == e.itemIndex) me.options.parent.openSharer();
        else {
          var item = e.section.getItemAt(e.itemIndex),
            items = ["Save Image"],
            opts = {
              options: items,
            };

          Ti.App.isAndroid ||
            (items.push("Cancel"), (opts.cancel = items.length - 1));

          var dialog = Ti.UI.createOptionDialog(opts);
          dialog.addEventListener("click", function (e) {
            if (!(e.index == e.cancel || (Ti.App.isAndroid && 0 > e.index))) {
              var useUrl = item.comment.attached_image.url;
              me.options.parent.showBlockingLoader(),
                Ti.App.saveRemoteImageToGallery(
                  useUrl,
                  function () {
                    me.options.parent.removeBlockingLoader(),
                      Ti.App.showDialog(
                        "Success!",
                        "The image has been saved to the gallery on your device!"
                      ),
                      Ti.App.logStat("Comment Share", {
                        source: "app",
                        platform: "save",
                        from: "rant",
                      });
                  },
                  function () {
                    me.options.parent.removeBlockingLoader(),
                      Ti.App.showDialog(
                        "Whoops!",
                        "There was a problem saving the image. Please make sure you have a good connection and try again. If the issue persists, please contact info@devrant.io"
                      ),
                      Ti.App.logStat("Comment Share", {
                        source: "app",
                        platform: "savefail",
                        from: "rant",
                      });
                  }
                );
            }
          }),
            dialog.show();
        }
    },
    getUpDownCircleVoteButton = function (type, left, top) {
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
        generateListTemplate("comment"),
        generateListTemplate("commentWithImage"),
        generateListTemplate("rantWithImage"),
        (me.templates.loading = {
          childTemplates: [
            {
              type: "Ti.UI.View",
              properties: {
                width: Ti.App.realWidth,
                height: Ti.UI.SIZE,
                backgroundColor: Ti.App.colorHint,
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
                    text: "Loading more comments...",
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
        (me.templates.refresh = {
          childTemplates: [
            {
              type: "Ti.UI.View",
              bindId: "btnRefresh",
              properties: {
                width: Ti.App.realWidth,
                height: 74,
                backgroundColor: Ti.App.colorBg,
              },
            },
          ],
        }),
        (me.listContainer = Ti.UI.createListView({
          top: 0,
          width: Ti.App.realWidth,
          height: me.options.height == null ? "100%" : me.options.height,
          sections: [me.listSection],
          backgroundColor: "#00ffffff",
          willScrollOnStatusTap: me.options.height != Ti.UI.SIZE,
          templates: me.templates,
          defaultItemTemplate: "rant",
          lazyLoadingEnabled: false,
          separatorStyle: Ti.App.isAndroid
            ? null
            : Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE,
          scrollIndicatorStyle: Ti.App.scrollBarStyle,
          separatorHeight: 0,
        })),
        me.listContainer.addEventListener("itemclick", listItemClicked),
        me.options.scrollHitBottomCallback &&
          me.listContainer.addEventListener("marker", markerCallback);
    };

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
      me.listSection.appendItems(dataItems, {
        animated: true,
      });
  }),
    (me.removeLoadingRow = function () {
      if (0 != me.listSection.items.length) {
        var lastItem = me.listSection.getItemAt(
          me.listSection.items.length - 1
        );

        "loading" == lastItem.template &&
          me.listSection.deleteItemsAt(me.listSection.items.length - 1, 1);
      }
    });
  var linkClick = function (e) {
      me.linkTapped = true;
      var item = me.listSection.getItemAt(e.itemIndex),
        type = 0 != e.itemIndex || me.options.commentsOnly ? "comment" : "rant";

      if (null != me.tapTimeout)
        return (
          clearTimeout(me.tapTimeout),
          (me.tapTimeout = null),
          (item.itemBg = { opacity: 1 }),
          me.listSection.updateItemAt(e.itemIndex, item),
          void Ti.App.voter.doVote({
            contentType: type,
            type: "upVote",
            content: item[type],
            listSection: me.listSection,
            index: e.itemIndex,
            fromDoubleTap: true,
          })
        );
      var useFunc = function () {
          if ("url_" == e.url.substring(0, 4)) {
            e.url = e.url.substr(4).replace("Http", "http");

            for (
              var devrantUrls = [
                  "https://www.devrant.com",
                  "https://devrant.com",
                  "www.devrant.com",
                  "http://www.devrant.com",
                  "http://devrant.com",
                  "devrant.com",
                  "https://www.devrant.io",
                  "https://devrant.io",
                  "www.devrant.io",
                  "http://www.devrant.io",
                  "http://devrant.io",
                  "devrant.io",
                ],
                i = 0;
              i < devrantUrls.length;
              ++i
            ) {
              var thisUrl = devrantUrls[i],
                urlLen = thisUrl.length;

              if (thisUrl == e.url.substr(0, urlLen)) {
                var isRant = "/rants/" == e.url.substr(urlLen, 7);
                if (isRant || "/collabs/" == e.url.substr(urlLen, 9)) {
                  (e.url = e.url.replace("http://", "")),
                    (e.url = e.url.replace("https://", ""));

                  var parts = e.url.split("/");
                  if (2 <= parts.length) {
                    var idPart = parts[2];
                    if (!isNaN(parseFloat(idPart)) && isFinite(idPart))
                      return void Ti.App.openRantWindow(
                        idPart,
                        false,
                        isRant ? 1 : 2
                      );
                  }
                }
              }
            }

            Ti.Platform.openURL(e.url);
          } else Ti.App.openProfileWindow(e.url.substr(8));
        },
        vote_state = 0;

      Ti.App.isAndroid ||
        ((vote_state = item[type].vote_state),
        (item.itemBg = {
          opacity: 0.75,
        }),
        me.listSection.updateItemAt(e.itemIndex, item)),
        1 == vote_state || -2 == vote_state
          ? (useFunc(),
            setTimeout(function () {
              (item.itemBg.opacity = 1),
                me.listSection.updateItemAt(e.itemIndex, item);
            }, 500))
          : (me.tapTimeout = setTimeout(function () {
              (me.tapTimeout = null),
                Ti.App.isAndroid ||
                  ((item.itemBg.opacity = 1),
                  me.listSection.updateItemAt(e.itemIndex, item)),
                useFunc();
            }, 200));
    },
    hookScrollHitBottom = function () {
      me.options.scrollHitBottomCallback &&
        me.listContainer.setMarker({
          sectionIndex: 0,
          itemIndex: me.listSection.items.length - 1,
        });
    },
    markerCallback = function () {
      me.options.scrollHitBottomCallback &&
        me.options.scrollHitBottomCallback();
    },
    listItemClicked = function (e) {
      if (me.linkTapped) return void (me.linkTapped = false);
      var item = me.listSection.getItemAt(e.itemIndex),
        type = 0 != e.itemIndex || me.options.commentsOnly ? "comment" : "rant";

      if (null != me.tapTimeout)
        return (
          clearTimeout(me.tapTimeout),
          (me.tapTimeout = null),
          (item.itemBg = { opacity: 1 }),
          void Ti.App.voter.doVote({
            contentType: type,
            type: "upVote",
            content: item[type],
            listSection: me.listSection,
            index: e.itemIndex,
          })
        );
      var useFunc = function () {},
        doHighlight = false;

      "lblUsername" == e.bindId ||
      "lblUserScoreContainer" == e.bindId ||
      "lblUserScore" == e.bindId ||
      "imgAvatar" == e.bindId
        ? ((doHighlight = true),
          (useFunc = function () {
            Ti.App.openProfileWindow(item[type].user_id);
          }))
        : "upVote" == e.bindId ||
          "downVote" == e.bindId ||
          "upVoteClickable" == e.bindId ||
          "downVoteClickable" == e.bindId ||
          "upIcon" == e.bindId ||
          "downIcon" == e.bindId
        ? (useFunc = function () {
            Ti.App.voter.doVote({
              contentType: type,
              type: "up" == e.bindId.substr(0, 2) ? "upVote" : "downVote",
              content: item[type],
              listSection: me.listSection,
              index: e.itemIndex,
            });
          })
        : "lblReport" == e.bindId
        ? ((doHighlight = true),
          (useFunc = function () {
            if (
              !(item[type].user_id != Ti.App.Properties.getString("userId", ""))
            )
              selectModifyAction(item, e.itemIndex);
            else if (item.rant)
              Ti.App.isLoggedIn()
                ? favoriteItem(item, e.itemIndex)
                : Ti.App.openSignupWindow("favorite");
            else {
              if (item.comment.adm)
                return void Ti.App.admControls(item.comment.adm);
              confirmReportItem(item, e.itemIndex);
            }
          }))
        : "rantImage" == e.bindId
        ? (useFunc = function () {
            var useObj;
            "rant" == type
              ? ((useObj = item.rant.attached_image),
                (useObj.type = "rant"),
                (useObj.id = item.rant.id))
              : ((useObj = item.comment.attached_image),
                (useObj.type = "comment")),
              Ti.App.showImageViewer(
                "rant" == type
                  ? item.rant.attached_image
                  : item.comment.attached_image
              );
          })
        : me.options.commentsOnly && item.comment
        ? ((doHighlight = true),
          (useFunc = function () {
            Ti.App.openRantWindow(
              item.comment.rant_id,
              false,
              2 == item.comment.rt ? 2 : 1
            );
          }))
        : "lblReply" == e.bindId
        ? ((doHighlight = true),
          (useFunc = function () {
            Ti.App.openPostRantWindow(
              "comment",
              me.options.parent.rantId,
              me.options.parent.commentPosted,
              "@" + item.comment.user_username + " "
            );
          }))
        : "c_url" == e.bindId
        ? ((doHighlight = true),
          (useFunc = function () {
            var url = item.rant.c_url.replace("Http", "http");
            Ti.Platform.openURL(url);
          }))
        : ("lblDppContainer" == e.bindId || "lblDpp" == e.bindId) &&
          ((doHighlight = true),
          (useFunc = function () {
            Ti.App.openSupporterInfoWindow();
          })),
        doHighlight &&
          ((item.itemBg = {
            opacity: 0.75,
          }),
          me.listSection.updateItemAt(e.itemIndex, item));

      var vote_state = item[type].vote_state;
      1 == vote_state || -2 == vote_state
        ? (useFunc(),
          setTimeout(function () {
            var item = me.listSection.getItemAt(e.itemIndex);
            (item.itemBg = { opacity: 1 }),
              me.listSection.updateItemAt(e.itemIndex, item);
          }, 500))
        : (me.tapTimeout = setTimeout(function () {
            (me.tapTimeout = null),
              item.itemBg || (item.itemBg = {}),
              (item.itemBg.opacity = 1),
              me.listSection.updateItemAt(e.itemIndex, item),
              useFunc();
          }, 200));
    },
    selectModifyAction = function (item, itemIndex) {
      var items = [],
        editable = false;

      item.rant
        ? item.rant.editable && (editable = true)
        : item.comment && item.comment.editable && (editable = true),
        items.push("Edit"),
        items.push("Delete");

      var opts = {
        options: items,
      };

      Ti.App.isAndroid ||
        (items.push("Cancel"), (opts.cancel = items.length - 1));

      var dialog = Ti.UI.createOptionDialog(opts);
      dialog.addEventListener("click", function (e) {
        modifyOptionsClick(
          e,
          item.comment ? item.comment.id : 0,
          item,
          itemIndex,
          editable
        );
      }),
        dialog.show();
    },
    modifyOptionsClick = function (e, commentId, item, index, editable) {
      var options = e.source.getOptions();
      if ("Cancel" != options[e.index])
        switch (options[e.index]) {
          case "Edit":
            editable
              ? 0 == commentId
                ? 2 == me.options.parent.rantType
                  ? Ti.App.openAddCollab(me.options.parent.rantId)
                  : Ti.App.openPostRantWindow(
                      "edit_rant",
                      me.options.parent.rantId,
                      null,
                      null,
                      null,
                      null,
                      me.options.parent.loadedData.rant.rc
                    )
                : Ti.App.openPostRantWindow(
                    "edit_comment",
                    me.options.parent.rantId,
                    null,
                    "",
                    "",
                    commentId
                  )
              : Ti.App.showDialog(
                  "Editing Disabled",
                  "Rants and comments can only be edited for 5 mins (30 mins for devRant++ subscribers) after they are posted."
                );

            break;
          case "Delete":
            confirmDeleteItem(item, index);
        }
    },
    favoriteItem = function (item, index) {
      (item.lblReport = {
        color: Ti.App.colorLightGrey,
        text: "Favorite",
      }),
        me.listSection.updateItemAt(index, item);
      var endpoint = "",
        params = {},
        thisAction = item.rant.favorited ? 0 : 1;

      endpoint =
        "devrant/rants/" +
        item.rant.id +
        "/" +
        (1 == thisAction ? "favorite" : "unfavorite");

      var apiArgs = {
        method: "POST",
        endpoint: endpoint,
        params: params,
        callback: function (result) {
          if (null != me) {
            var dialogMessage = "",
              dialogTitle = "";

            if (result.success) {
              var useItem = me.listSection.getItemAt(index);
              (useItem.rant.favorited = thisAction),
                (useItem.lblReport = {
                  color: Ti.App.colorHint,
                  text: 1 == thisAction ? "Unfavorite" : "Favorite",
                }),
                me.listSection.updateItemAt(index, useItem);
            } else
              (item.lblReport = {
                color: Ti.App.colorHint,
                text: 1 == thisAction ? "Favorite" : "Unfavorite",
              }),
                me.listSection.updateItemAt(index, item),
                (dialogMessage =
                  "There was an error saving your action. Please try again and if the issue persists, contact info@devrant.io"),
                (dialogTitle = "Error");

            if ("" != dialogMessage) {
              var dialog = Ti.UI.createAlertDialog({
                message: dialogMessage,
                ok: "Ok",
                title: dialogTitle,
              });

              dialog.show();
            }
          }
        },
        includeAuth: true,
      };

      Ti.App.api(apiArgs),
        1 == thisAction &&
          1 != item.rant.vote_state &&
          Ti.App.voter.doVote({
            contentType: "rant",
            type: "upVote",
            content: item.rant,
            listSection: me.listSection,
            index: 0,
            doBrowseUpdate: true,
          });
    };

  me.reportItem = function (item, index) {
    (item.lblReport = {
      color: Ti.App.colorLightGrey,
      text: "Report",
    }),
      me.listSection.updateItemAt(index, item);
    var contentType = item.rant ? "rant" : "comment",
      endpoint = "",
      params = {};

    endpoint =
      "rant" == contentType
        ? "devrant/rants/" + item.rant.id + "/report"
        : "comments/" + item.comment.id + "/report";

    var apiArgs = {
      method: "POST",
      endpoint: endpoint,
      params: params,
      callback: function (result) {
        var dialogMessage = "",
          dialogTitle = "";

        result.success
          ? ((item.lblReport = {
              visible: false,
            }),
            me.listSection.updateItemAt(index, item),
            (dialogMessage =
              "Thank you for reporting this " +
              contentType +
              ". We will review it and remove it if we find it violates our terms."),
            (dialogTitle = "Success!"))
          : ((dialogMessage =
              "There was an error reporting this " +
              contentType +
              ". Please try again."),
            (dialogTitle = "Error"));

        var dialog = Ti.UI.createAlertDialog({
          message: dialogMessage,
          ok: "Ok",
          title: dialogTitle,
        });

        dialog.show();
      },
      includeAuth: true,
    };

    Ti.App.api(apiArgs);
  };
  var confirmDeleteItem = function (item, index) {
      var contentType = item.rant ? "rant" : "comment",
        dialog = Ti.UI.createAlertDialog({
          cancel: 1,
          buttonNames: ["Ok", "Cancel"],
          message: "Are you sure you want to delete this " + contentType + "?",
          title: "Delete?",
        });

      dialog.addEventListener("click", function (e) {
        0 == e.index && deleteItem(item, index);
      }),
        dialog.show();
    },
    confirmReportItem = function (item, index) {
      var dialog = Ti.UI.createAlertDialog({
        cancel: 1,
        buttonNames: ["Ok", "Cancel"],
        message: "Are you sure you want to report this comment?",
        title: "Report?",
      });

      dialog.addEventListener("click", function (e) {
        0 == e.index && me.reportItem(item, index);
      }),
        dialog.show();
    },
    deleteItem = function (item, index) {
      me.options.parent.showBlockingLoader(),
        (item.lblReport = {
          color: Ti.App.colorLightGrey,
        }),
        me.listSection.updateItemAt(index, item);
      var endpoint = "",
        params = {},
        contentType = item.rant ? "rant" : "comment";

      endpoint =
        "rant" == contentType
          ? "devrant/rants/" + item.rant.id
          : "comments/" + item.comment.id;

      var apiArgs = {
        method: "DELETE",
        endpoint: endpoint,
        params: params,
        callback: function (result) {
          var dialogMessage = "",
            dialogTitle = "";

          result.success
            ? ((item.lblReport = {
                visible: false,
              }),
              me.listSection.updateItemAt(index, item),
              "comment" == contentType &&
                (me.listSection.deleteItemsAt(index, 1, {
                  animated: true,
                }),
                me.options.parent.blockingLoader.hideLoader()),
              (dialogMessage = "Your " + contentType + " has been deleted!"),
              (dialogTitle = "Success!"))
            : ((dialogMessage =
                "There was an error deleting this " +
                contentType +
                ". Please try again."),
              (dialogTitle = "Error"),
              me.options.parent.blockingLoader.hideLoader());

          var dialog = Ti.UI.createAlertDialog({
            message: dialogMessage,
            ok: "Ok",
            title: dialogTitle,
          });

          dialog.show(),
            result.success &&
              "rant" == contentType &&
              (me.options.parent.closeWindow(),
              me.options && me.options.parent && 2 == me.options.parent.rantType
                ? Ti.App.tabBar.refreshCollabs()
                : (Ti.App.tabBar.refreshMainFeed(),
                  Ti.App.weeklyRantOpen
                    ? Ti.App.tabBar.refreshWeeklyRant()
                    : Ti.App.savedTabs.stories &&
                      Ti.App.tabBar.refreshStories()));
        },
        includeAuth: true,
      };

      Ti.App.api(apiArgs);
    };

  (me.destroySeries = function () {
    if (null != me.rantSeriesId) {
      var savedTabs = Ti.App.savedTabs;
      delete savedTabs.rants.obj.rantSeries[me.rantSeriesId],
        (Ti.App.savedTabs = savedTabs),
        (me.rantSeriesId = null);
    }
  }),
    (me.addRantToList = function (rantInfo, rantComments, commentId) {
      var i,
        rantInfo,
        dataItem,
        useTemplate,
        useWidth,
        useHeight,
        ratio,
        textAttr,
        dataItems = [];

      if (null != rantInfo) {
        (me.rantSeriesId = Ti.App.rantSeriesId++),
          rantInfo.rantType && (me.options.parent.rantType = rantInfo.rantType);

        var useRantMap = {};
        useRantMap[rantInfo.id] = 0;

        var savedTabs = Ti.App.savedTabs;

        (savedTabs.rants.obj.rantSeries[me.rantSeriesId] = {
          listSection: me.listSection,
          rants: useRantMap,
        }),
          (Ti.App.savedTabs = savedTabs),
          (useTemplate = "rant"),
          rantInfo.attached_image && (useTemplate = "rantWithImage");

        var avatarInfo = {
          backgroundColor: "#" + rantInfo.user_avatar.b,
        };

        rantInfo.user_avatar.i &&
          !me.hideAvatarImages &&
          (avatarInfo.image = Ti.App.avatarImageUrl + rantInfo.user_avatar.i);

        var useTime = Ti.App.timeAgo(rantInfo.created_time, true);

        if (
          (rantInfo.edited && (useTime = "(Edited) " + useTime),
          (dataItem = {
            template: useTemplate,
            rant: rantInfo,
            properties: {
              height: Ti.UI.SIZE,
              selectionStyle: Ti.App.isAndroid
                ? null
                : Ti.UI.iOS.ListViewCellSelectionStyle.NONE,
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
            lblTags: { text: rantInfo.tags.join(", ") },
            imgAvatar: avatarInfo,
            lblUsername: { text: rantInfo.user_username },
            lblUserScore: {
              text:
                (0 < rantInfo.user_score ? "+" : "") +
                (Ti.App.binaryScores
                  ? (+rantInfo.user_score).toString(2)
                  : rantInfo.user_score) +
                "",
            },
            upVote: {
              backgroundColor: Ti.App.getVoteButtonColor(
                "up",
                rantInfo.vote_state
              ),
            },
            downVote: {
              backgroundColor: Ti.App.getVoteButtonColor(
                "down",
                rantInfo.vote_state
              ),
            },
            lblTime: { text: useTime },
            lblReport: { visible: false },
          }),
          3 == Ti.App.theme &&
            (1 == rantInfo.vote_state
              ? (dataItem.upIcon = { color: Ti.App.colorBtnInverse })
              : -1 == rantInfo.vote_state &&
                (dataItem.downIcon = { color: Ti.App.colorBtnInverse })),
          (dataItem.bottomContainer = {}),
          rantInfo.special && (dataItem.bottomContainer = { top: -3 }),
          rantInfo.user_dpp &&
            ((dataItem.lblDppContainer = {
              visible: true,
              backgroundColor: "#" + rantInfo.user_avatar.b,
            }),
            (dataItem.lblDpp = { text: "\uE910" })),
          rantComments.length ||
            true == me.options.commentsOnly ||
            (dataItem.bottomContainer.bottom = 62),
          2 != rantInfo.rt)
        )
          rantInfo.links
            ? ((textAttr = generateAttributedString(
                rantInfo.text,
                rantInfo.links,
                rantInfo.special
              )),
              !Ti.App.isAndroid,
              (dataItem.lblRantText = {
                attributedString: textAttr,
              }))
            : (dataItem.lblRantText = {
                text: rantInfo.text,
                color: Ti.App.colorDarkGrey,
                font: { fontSize: Ti.App.fontBody },
              });
        else {
          for (var curItem, i = 0; i < Ti.App.collabTypes.length; ++i)
            (curItem = Ti.App.collabTypes[i]),
              "" == rantInfo[curItem.id]
                ? ((dataItem[curItem.id] = {
                    top: 0,

                    height: 0,
                    visible: false,
                  }),
                  (dataItem[curItem.id + "_l"] = {
                    top: 0,
                    height: 0,

                    visible: false,
                  }))
                : (dataItem[curItem.id] = { text: rantInfo[curItem.id] });

          "" != rantInfo.c_url &&
            (dataItem.c_url = {
              attributedString: Ti.UI.createAttributedString({
                text: rantInfo.c_url,
                attributes: [
                  {
                    type: Ti.UI.ATTRIBUTE_FONT,
                    value: { fontSize: Ti.App.fontBody },
                    range: [0, rantInfo.c_url.length],
                  },

                  {
                    type: Ti.UI.ATTRIBUTE_UNDERLINES_STYLE,
                    value: Ti.UI.ATTRIBUTE_UNDERLINE_STYLE_SINGLE,
                    range: [0, rantInfo.c_url.length],
                  },
                ],
              }),
            });
        }
        var isMine =
          rantInfo.user_id == Ti.App.Properties.getString("userId", "");

        if (
          ((dataItem.lblReport = {
            text: isMine
              ? "Modify"
              : rantInfo.favorited
              ? "Unfavorite"
              : "Favorite",
          }),
          (textAttr = rantInfo.tags.length
            ? Ti.App.generateTagsAttributedString(rantInfo.tags)
            : Ti.UI.createAttributedString({ text: "" })),
          !Ti.App.isAndroid,
          (dataItem.lblTags = { attributedString: textAttr }),
          rantInfo.attached_image &&
            ((useWidth = rantInfo.attached_image.width),
            (useHeight = rantInfo.attached_image.height),
            (ratio = me.mainContentContainerWidth / useWidth),
            (useWidth = me.mainContentContainerWidth),
            (useHeight *= ratio),
            (dataItem.rantImageContainer = {
              height: useHeight,
            }),
            (dataItem.rantImage = {
              image: rantInfo.attached_image.url,
              width: useWidth,
              height: useHeight,
            }),
            "gif" == rantInfo.attached_image.url.toLowerCase().substr(-3)))
        )
          if (!Ti.App.isAndroid) {
            me.gifDimens = [useWidth, useHeight];
            var file = Ti.Filesystem.getFile(
                Ti.Filesystem.resourcesDirectory,
                Ti.App.loaderGif
              ),
              blob = file.read();
            delete dataItem.rantImage.image,
              (dataItem.rantImageContainer.backgroundColor = Ti.App.colorImgBg),
              (dataItem.rantImage.width =
                useHeight > useWidth ? 0.5 * useWidth : 0.5 * useHeight),
              (dataItem.rantImage.height = 1.164 * dataItem.rantImage.width),
              (dataItem.rantImage.gif = blob),
              Ti.App.loadImage(rantInfo.attached_image.url, gifLoaded);
          } else
            (dataItem.rant.isAndroidGif = true),
              (dataItem.gifIndicator = {
                visible: true,
              });

        dataItems.push(dataItem);
      }

      me.addCommentsToList(rantComments, dataItems, commentId);
    }),
    (me.addCommentsToList = function (rantComments, dataItems, commentId) {
      dataItems = dataItems || [];
      var commentInfo,
        isUpdate = 0 == dataItems.length,
        scrollToComment = null;

      if (rantComments && rantComments.length) {
        var lastCommentIndex = rantComments.length - 1;
        for (i = 0; i <= lastCommentIndex; ++i) {
          (commentInfo = rantComments[i]), (me.lastCommentId = commentInfo.id);
          var avatarInfo = {
            backgroundColor: "#" + commentInfo.user_avatar.b,
          };

          rantComments[i].user_avatar.i && !me.hideAvatarImages
            ? (avatarInfo.image =
                Ti.App.avatarImageUrl + commentInfo.user_avatar.i)
            : Ti.App.isAndroid && (avatarInfo.image = "");

          var useTime = Ti.App.timeAgo(rantComments[i].created_time);

          if (
            (commentInfo.edited && (useTime = "(Edited) " + useTime),
            commentInfo.id == commentId && (scrollToComment = i + 1),
            (dataItem = {
              template: commentInfo.attached_image
                ? "commentWithImage"
                : "comment",
              comment: commentInfo,
              properties: {
                height: Ti.UI.SIZE,
                selectionStyle: Ti.App.isAndroid
                  ? null
                  : Ti.UI.iOS.ListViewCellSelectionStyle.NONE,
              },
              lblScore: { text: commentInfo.score },
              imgAvatar: avatarInfo,
              lblUsername: { text: commentInfo.user_username },
              lblUserScore: {
                text:
                  (0 < commentInfo.user_score ? "+" : "") +
                  (Ti.App.binaryScores
                    ? (+commentInfo.user_score).toString(2)
                    : commentInfo.user_score) +
                  "",
              },
              lblTime: { text: useTime },
              upVote: {
                backgroundColor: Ti.App.getVoteButtonColor(
                  "up",
                  commentInfo.vote_state
                ),
              },
              downVote: {
                backgroundColor: Ti.App.getVoteButtonColor(
                  "down",
                  commentInfo.vote_state
                ),
              },
            }),
            3 == Ti.App.theme &&
              (1 == commentInfo.vote_state
                ? (dataItem.upIcon = { color: Ti.App.colorBtnInverse })
                : -1 == commentInfo.vote_state &&
                  (dataItem.downIcon = { color: Ti.App.colorBtnInverse })),
            commentInfo.user_dpp
              ? ((dataItem.lblDppContainer = {
                  visible: true,
                  backgroundColor: "#" + commentInfo.user_avatar.b,
                }),
                (dataItem.lblDpp = { text: "\uE910" }))
              : Ti.App.isAndroid &&
                (dataItem.lblDppContainer = { visible: false }),
            commentInfo.attached_image)
          ) {
            var containerWidth =
              me.mainContentContainerWidth - (me.options.commentsOnly ? 0 : 26);
            (useWidth = commentInfo.attached_image.width),
              (useHeight = commentInfo.attached_image.height),
              (ratio = containerWidth / useWidth),
              (useWidth = containerWidth),
              (useHeight *= ratio),
              (dataItem.rantImageContainer = {
                height: useHeight,
              }),
              useHeight > Ti.App.realHeight / 3 &&
                (dataItem.rantImageContainer = {
                  height: Ti.App.realHeight / 3,
                });

            var useImageSrc = commentInfo.attached_image.frame
              ? commentInfo.attached_image.frame
              : commentInfo.attached_image.url;

            autoLoadImages ||
              ((useWidth = 1200),
              (useHeight = 282),
              (ratio = containerWidth / useWidth),
              (useWidth = containerWidth),
              (useHeight *= ratio),
              (useImageSrc = Ti.App.hiddenImg),
              (dataItem.rantImageContainer.height = useHeight)),
              (dataItem.rantImage = {
                image: useImageSrc,
                width: useWidth,
                height: useHeight,
              }),
              "gif" ==
                commentInfo.attached_image.url.toLowerCase().substr(-3) &&
                (dataItem.gifIndicator = {
                  visible: true,
                });
          }

          (textAttr = generateAttributedString(
            rantComments[i].body,
            rantComments[i].links || [],
            rantComments[i].special
          )),
            !Ti.App.isAndroid,
            (dataItem.lblRantText = {
              attributedString: textAttr,
            }),
            rantComments[i].user_id ==
              Ti.App.Properties.getString("userId", "") &&
              (dataItem.lblReport = {
                text: "Modify",
                visible: null != me.options.parent,
              }),
            dataItems.push(dataItem);
        }
      }

      if (
        (isUpdate && _hasRefreshRow
          ? me.listSection.insertItemsAt(
              me.listSection.items.length - 1,
              dataItems
            )
          : me.listSection.appendItems(dataItems),
        !isUpdate &&
          true != me.options.commentsOnly &&
          rantComments &&
          rantComments.length &&
          me.addBottomRefreshBar(),
        hookScrollHitBottom(),
        scrollToComment)
      ) {
        var params = {
          animated: !Ti.App.isAndroid,
        };

        Ti.App.isAndroid ||
          (params.position = Ti.UI.iOS.ListViewScrollPosition.TOP),
          Ti.App.isAndroid
            ? me.listContainer.scrollToItem(0, scrollToComment, params)
            : setTimeout(function () {
                me.listContainer.scrollToItem(0, scrollToComment, params);
              }, 50);
      }
    }),
    (me.scrollToBottom = function (animated) {
      var params = {
        animated: !(animated != null) || animated,
      };

      Ti.App.isAndroid
        ? me.listContainer.scrollToItem(
            0,
            me.listSection.items.length - 1,
            params
          )
        : setTimeout(function () {
            me.listContainer.scrollToItem(
              0,
              me.listSection.items.length - 1,
              params
            );
          }, 50);
    }),
    (me.addBottomRefreshBar = function () {
      if ((console.log("add bottom bar!"), !_hasRefreshRow)) {
        _hasRefreshRow = true;
        var dataItem = {
            template: "refresh",
            properties: {
              height: Ti.UI.SIZE,
              selectionStyle: Ti.App.isAndroid
                ? null
                : Ti.UI.iOS.ListViewCellSelectionStyle.NONE,
            },
          },
          dataItems = [];
        dataItems.push(dataItem),
          me.listSection.appendItems(dataItems, {
            animated: false,
          });
      }
    });
  var gifLoaded = function (data) {
      var item = me.listSection.getItemAt(0);

      (item.rantImage = {
        gif: data,
        width: me.gifDimens[0],
        height: me.gifDimens[1],
      }),
        me.listSection.updateItemAt(0, item);
    },
    generateAttributedString = function (text, links, special) {
      var i,
        foundPos,
        linkLen,
        go,
        attributes = [],
        linksProcessed = {},
        useOffset = 0;

      special && (text += "\n "),
        attributes.push({
          type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
          value: Ti.App.colorDarkGrey,
          range: [0, text.length],
        }),
        attributes.push({
          type: Ti.UI.ATTRIBUTE_FONT,
          value: { fontSize: Ti.App.fontBody },
          range: [0, text.length],
        });

      var linkInfo;

      for (i = 0; i < links.length; ++i)
        if (
          ((linkInfo = links[i]),
          "mention" != linkInfo.type || null == linksProcessed[linkInfo.title])
        ) {
          for (
            foundPos =
              "mention" == linkInfo.type
                ? text.indexOf(linkInfo.title)
                : text.indexOf(
                    linkInfo.title,
                    null == linksProcessed[linkInfo.title]
                      ? 0
                      : linksProcessed[linkInfo.title]
                  ),
              go = -1 != foundPos;
            go;

          )
            (linkLen = linkInfo.title.length),
              attributes.push({
                type: Ti.UI.ATTRIBUTE_LINK,
                value: linkInfo.type + "_" + linkInfo.url,
                range: [foundPos, linkLen],
              }),
              attributes.push({
                type: Ti.UI.ATTRIBUTE_UNDERLINES_STYLE,
                value: Ti.UI.ATTRIBUTE_UNDERLINE_STYLE_NONE,
                range: [foundPos, linkLen],
              }),
              attributes.push({
                type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
                value: Ti.App.colorUrl,
                range: [foundPos, linkLen],
              }),
              "mention" == linkInfo.type
                ? ((foundPos = text.indexOf(
                    linkInfo.title,
                    foundPos + linkLen
                  )),
                  (go = -1 != foundPos))
                : ((go = false),
                  (linksProcessed[linkInfo.title] = foundPos + linkLen));

          "mention" == linkInfo.type && (linksProcessed[linkInfo.title] = 1);
        }

      return (
        special &&
          attributes.push({
            type: Ti.UI.ATTRIBUTE_FONT,
            value: { fontFamily: "icomoon", fontSize: 0.1 },
            range: [text.length - 1, 1],
          }),
        Ti.UI.createAttributedString({
          text: text,
          attributes: attributes,
        })
      );
    };

  return me;
}

module.exports = CommentListView;
