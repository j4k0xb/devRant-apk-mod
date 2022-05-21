function RantWindow() {
  var me = this;
  (me.addCommentSectionHeight = 46),
    (me.shareSectionHeight = 40),
    (me.rantId = null),
    (me.rantType = null),
    (me.commentId = null),
    (me.wasJustPosted = null),
    (me.window = null),
    (me.container = null),
    (me.contentContainer = null),
    (me.addCommentContainer = null),
    (me.btnAddComment = null),
    (me.loader = null),
    (me.commentList = null),
    (me.listContainer = null),
    (me.didInitialLoad = false),
    (me.loadedData = null),
    (me.blockingLoader = null),
    (me.topBar = null),
    (me.muteRantString = " Notifs for this Rant (except @mentions)");
  var _scrollToBottomAfterFetch = false,
    _subscribeText = "Subscribe to User's Rants",
    _unsubscribeText = "Unsubscribe from User's Rants";

  (me.init = function (rantId, wasJustPosted, rantType, commentId) {
    (me.rantId = rantId),
      (me.rantType = rantType || 1),
      (me.commentId = commentId),
      (me.wasJustPosted = wasJustPosted),
      me.createElements(),
      fetchData();
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
        })),
        me.window.add(me.container),
        createSubSections(),
        createList();
    }),
    (me.refresh = function (scrollToBottom) {
      (_scrollToBottomAfterFetch = scrollToBottom || false),
        (me.commentId = null),
        me.contentContainer.remove(me.listContainer),
        (me.didInitialLoad = false),
        createList(),
        me.loader.showLoader(),
        fetchData();
    });
  var windowOpened = function () {},
    createSubSections = function () {
      var imgBg = Ti.UI.createImageView({
        top: 0,
        image: Ti.App.loaderBg,
        width: Ti.App.realWidth,
        height: 2.165 * Ti.App.realWidth,
        backgroundColor: Ti.App.colorImgBg,
        defaultImage: "",
      });

      me.container.add(imgBg),
        createTopBar(),
        (me.contentContainer = Ti.UI.createView({
          top: Ti.App.topBarGenerator.topBarHeight,
          width: "100%",
          height: Ti.UI.FILL,
          bottom: 0,
        })),
        me.container.add(me.contentContainer);
      var leftRightPadding = 10,
        btnMargin = 5,
        marginTotal = 20,
        shareBtnWidth = 44;

      me.addCommentContainer = Ti.UI.createView({
        bottom: 10,
        height: me.addCommentSectionHeight,
        width: Ti.App.realWidth - marginTotal,
      });
      var addCommentBtn = Ti.UI.createView({
          right: 0,
          borderRadius: 14,
          borderWidth: 0,
          width:
            Ti.App.realWidth - 3 * (shareBtnWidth + btnMargin) - marginTotal,
          height: "100%",
          backgroundColor: Ti.App.colorBtnBgOne,
        }),
        lblAddComment = Ti.UI.createLabel({
          text: "Comment",
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          color: Ti.App.colorBtnInverse,
          font: {
            fontSize: Ti.App.fontL,
            fontWeight: "bold",
          },
        });

      addCommentBtn.add(lblAddComment),
        addCommentBtn.addEventListener("click", btnAddCommentClicked),
        Ti.App.btnActiveState(addCommentBtn),
        me.addCommentContainer.add(addCommentBtn);

      var btnTwitter = makeShareButton(
        "\uE909",
        24,
        shareBtnWidth,
        Ti.App.colorBtnTwitter
      );
      (btnTwitter.left = 0),
        me.addCommentContainer.add(btnTwitter),
        btnTwitter.addEventListener("click", function () {
          return me.loadedData
            ? void (Ti.App.logStat("Rant Share", {
                source: "app",
                platform: "twitter",
                from: "bar",
              }),
              Ti.App.shareTwitter(me.loadedData.rant))
            : void Ti.App.showDialog(
                "Whoops!",
                "The rant must be loaded before it can be shared."
              );
        }),
        Ti.App.btnActiveState(btnTwitter);

      var btnFb = makeShareButton(
        "\uE90A",
        28,
        shareBtnWidth,
        Ti.App.colorBtnFb
      );
      (btnFb.left = shareBtnWidth + btnMargin),
        me.addCommentContainer.add(btnFb),
        btnFb.addEventListener("click", function () {
          return me.loadedData
            ? void (Ti.App.logStat("Rant Share", {
                source: "app",
                platform: "facebook",
                from: "bar",
              }),
              Ti.App.shareFb(me.loadedData.rant))
            : void Ti.App.showDialog(
                "Whoops!",
                "The rant must be loaded before it can be shared."
              );
        }),
        Ti.App.btnActiveState(btnFb);

      var btnShare = makeShareButton(
        Ti.App.isAndroid ? "\uE900" : "\uE901",
        24,
        shareBtnWidth,
        Ti.App.colorBtnBgTwo
      );
      (btnShare.left = 2 * shareBtnWidth + 2 * btnMargin),
        me.addCommentContainer.add(btnShare),
        btnShare.addEventListener("click", me.openSharer),
        Ti.App.btnActiveState(btnShare),
        me.container.add(me.addCommentContainer);

      var ContentLoader = require("ui/common/ContentLoader");

      me.loader = new ContentLoader();
      var loaderElement = me.loader.getElem();
      (loaderElement.zIndex = -1),
        me.contentContainer.add(loaderElement),
        me.loader.showLoader();
    },
    addTopBanner = function (info) {
      var useHeight = info.height,
        bannerContainer = Ti.UI.createView({
          top: Ti.App.topBarGenerator.topBarHeight,
          height: useHeight,
          width: "100%",
          backgroundColor: Ti.App.colorBg,
        }),
        btmLine = Ti.UI.createView({
          width: "100%",
          height: 1,
          backgroundColor: Ti.App.colorLine,
          bottom: 0,
        });

      bannerContainer.add(btmLine);

      var lblHeadline = Ti.UI.createLabel({
        top: 5,

        width: Ti.App.realWidth - 24,
        height: Ti.UI.SIZE,
        text: info.topic,

        color: Ti.App.colorNewsText,
        font: {
          fontSize: Ti.App.fontBody,
          fontWeight: "bold",
        },
      });

      bannerContainer.add(lblHeadline);

      var lblFooter = Ti.UI.createLabel({
        width: Ti.App.realWidth - 24,
        height: Ti.UI.SIZE,
        text: "Week " + info.week + " Group Rant",

        bottom: 7,

        color: Ti.App.colorHint,
        font: {
          fontSize: Ti.App.fontS,
          fontWeight: "bold",
        },
      });

      bannerContainer.add(lblFooter),
        me.container.add(bannerContainer),
        me.contentContainer.animate({
          top: Ti.App.topBarGenerator.topBarHeight + useHeight,
          duration: 300,
        });
    },
    makeShareButton = function (shareText, iconSize, width, bgColor) {
      var btnContainer = Ti.UI.createView({
          width: width,
          height: "100%",
          backgroundColor: bgColor,
          borderRadius: 14,
          borderWidth: 0,
        }),
        lbl = Ti.UI.createLabel({
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          color: "#fff",
          text: shareText,
          font: {
            fontFamily: "icomoon",
            fontSize: iconSize,
          },
        });

      return btnContainer.add(lbl), btnContainer;
    },
    btnAddCommentClicked = function () {
      return Ti.App.isLoggedIn()
        ? void Ti.App.openPostRantWindow("comment", me.rantId, me.commentPosted)
        : void Ti.App.openSignupWindow("post_comment");
    };

  (me.commentPosted = function () {
    fetchData();
  }),
    (me.openSharer = function () {
      if (!me.loadedData)
        return void Ti.App.showDialog(
          "Whoops!",
          "The rant must be loaded before it can be shared."
        );

      var items = [];

      me.loadedData.rant.attached_image && items.push("Save Image"),
        items.push(
          "Share on Facebook",
          "Share on Twitter",
          "Copy " + (2 == me.rantType ? "Collab" : "Rant") + " Link",
          "More Sharing Options"
        );

      var opts = {
        options: items,
      };

      Ti.App.isAndroid ||
        (items.push("Cancel"), (opts.cancel = items.length - 1));

      var dialog = Ti.UI.createOptionDialog(opts);
      dialog.addEventListener("click", shareOptionsClick),
        dialog.show(),
        Ti.App.logStat("Rant Share Button", {
          source: "app",
        });
    });
  var shareOptionsClick = function (e) {
      var options = e.source.getOptions();
      if ("Cancel" != options[e.index])
        switch (options[e.index]) {
          case "Share on Facebook":
            Ti.App.logStat("Rant Share", {
              source: "app",
              platform: "fb",
              from: "rant",
            }),
              Ti.App.shareFb(me.loadedData.rant);
            break;
          case "Share on Twitter":
            Ti.App.logStat("Rant Share", {
              source: "app",
              platform: "twitter",
              from: "rant",
            }),
              Ti.App.shareTwitter(me.loadedData.rant);
            break;
          case "Copy " + (2 == me.rantType ? "Collab" : "Rant") + " Link":
            Ti.UI.Clipboard.setText(
              "https://devrant.com/" + me.loadedData.rant.link
            ),
              Ti.App.logStat("Rant Share", {
                source: "app",
                platform: "copy",
                from: "rant",
              });

            break;
          case "Save Image":
            me.showBlockingLoader(),
              Ti.App.saveRemoteImageToGallery(
                "https://devrant.com/rant-download/" + me.loadedData.rant.id,
                function () {
                  me.removeBlockingLoader(),
                    Ti.App.showDialog(
                      "Success!",
                      "The image has been saved to the gallery on your device!"
                    ),
                    Ti.App.logStat("Rant Share", {
                      source: "app",
                      platform: "save",
                      from: "rant",
                    });
                },
                function () {
                  me.removeBlockingLoader(),
                    Ti.App.showDialog(
                      "Whoops!",
                      "There was a problem saving the image. Please make sure you have a good connection and try again. If the issue persists, please contact info@devrant.io"
                    ),
                    Ti.App.logStat("Rant Share", {
                      source: "app",
                      platform: "savefail",
                      from: "rant",
                    });
                }
              );
            break;
          case "More Sharing Options":
            Ti.App.genericShare(me.loadedData.rant),
              Ti.App.logStat("Rant Share", {
                source: "app",
                platform: "generic",
                from: "prompt",
              });
        }
    },
    createTopBar = function () {
      var topBarOptions = {
        leftBtnType: "back",
        rightBtnType: "actions",
        rightSecondaryBtnType: "refresh",
        barTitle: 2 == me.rantType ? "Collab" : "Rant",
        callbackLeftBtn: function () {
          me.closeWindow();
        },
        callbackRightSecondaryBtn: function () {
          me.refresh(true);
        },
        callbackRightBtn: function () {
          var useWord = 2 == me.rantType ? "Collab" : "Rant",
            useOptions = {},
            items = ["Copy " + useWord + " Link"],
            cancel = 2;

          me.loadedData &&
            me.loadedData.comments &&
            10 <= me.loadedData.comments.length &&
            (items.push("Scroll to Bottom"), ++cancel),
            me.loadedData.rant.attached_image &&
              (items.push("Save Image"), ++cancel),
            Ti.App.isLoggedIn() &&
              me.loadedData &&
              me.loadedData.rant &&
              (null != me.loadedData.subscribed &&
                (items.push(
                  me.loadedData.subscribed ? _unsubscribeText : _subscribeText
                ),
                ++cancel),
              items.push(
                (me.loadedData.rant.muted ? "Unmute" : "Mute") +
                  me.muteRantString
              ),
              ++cancel),
            items.push("Report " + useWord, "Cancel");
          var opts = {
              cancel: cancel,
              options: items,
            },
            dialog = Ti.UI.createOptionDialog(opts);
          dialog.addEventListener("click", optionMenuClick), dialog.show();
        },
      };

      (me.topBar = Ti.App.topBarGenerator.createBar(topBarOptions)),
        me.topBar.children[1].addEventListener("click", function () {
          me.refresh();
        }),
        me.container.add(me.topBar);
    },
    optionMenuClick = function (e) {
      var options = e.source.getOptions();
      if ("Cancel" != options[e.index]) {
        if (0 == e.index)
          return (
            Ti.UI.Clipboard.setText(
              "https://devrant.com/" + me.loadedData.rant.link
            ),
            void Ti.App.logStat("Rant Copy Link", { source: "app" })
          );

        var useWord = 2 == me.rantType ? "Collab" : "Rant";

        if ("Save Image" == options[e.index]) return void shareOptionsClick(e);

        if ("Scroll to Bottom" == options[e.index]) {
          var params = {
            animated: !Ti.App.isAndroid,
          };

          return void me.commentList.scrollToBottom(!Ti.App.isAndroid);
        }

        if (options[e.index] == "Report " + useWord)
          return me.loadedData.rant.adm
            ? void Ti.App.admControls(me.loadedData.rant.adm)
            : void me.commentList.reportItem(
                me.commentList.listSection.getItems()[0],
                0
              );

        if (options[e.index] == _subscribeText)
          return void _doUserSub("subscribe");
        if (options[e.index] == _unsubscribeText)
          return void _doUserSub("unsubscribe");

        if (
          -1 != options[e.index].indexOf(me.muteRantString) &&
          me.loadedData &&
          me.loadedData.rant
        ) {
          me.loadedData.rant.muted = me.loadedData.rant.muted ? 0 : 1;
          var endpoint =
              "devrant/rants/" +
              me.loadedData.rant.id +
              "/" +
              (me.loadedData.rant.muted ? "mute" : "unmute"),
            apiArgs = {
              method: "POST",
              endpoint: endpoint,
              params: {},
              callback: function (result) {},
              includeAuth: true,
            };

          Ti.App.api(apiArgs);
        }
      }
    },
    _doUserSub = function (type) {
      me.showBlockingLoader();
      var endpoint = "users/" + me.loadedData.rant.user_id + "/subscribe",
        apiArgs = {
          method: "unsubscribe" == type ? "DELETE" : "POST",
          endpoint: endpoint,
          params: {},
          callback: function (result) {
            _subDone(type, result);
          },
          includeAuth: true,
        };

      Ti.App.api(apiArgs);
    },
    _subDone = function (type, result) {
      return (
        me.removeBlockingLoader(),
        result && result.success
          ? void ("subscribe" == type
              ? ((me.loadedData.subscribed = true),
                Ti.App.showDialog(
                  "Success!",
                  "You are now subscribed to " +
                    me.loadedData.rant.user_username +
                    "'s rants. You will be notified when they post."
                ))
              : ((me.loadedData.subscribed = false),
                Ti.App.showDialog(
                  "Success!",
                  "You are now unsubscribed from " +
                    me.loadedData.rant.user_username +
                    "'s rants. You will no longer receive notifications when they post."
                )))
          : void Ti.App.showDialog(
              "Whoops!",
              "There was an error completing your action. Please try again."
            )
      );
    },
    createList = function () {
      var CommentListView = require("ui/common/CommentListView");

      (me.commentList = new CommentListView()),
        me.commentList.init({
          parent: me,
        }),
        (me.listContainer = me.commentList.getView()),
        me.contentContainer.add(me.listContainer);
    };

  (me.showBlockingLoader = function () {
    var BlockingLoader = require("ui/common/BlockingLoader");
    (me.blockingLoader = new BlockingLoader()),
      me.window.add(me.blockingLoader.getElem()),
      me.blockingLoader.showLoader();
  }),
    (me.removeBlockingLoader = function () {
      me.blockingLoader.hideLoader(),
        me.window.remove(me.blockingLoader.getElem()),
        (me.blockingLoader = null);
    });
  var fetchData = function () {
      params = {
        last_comment_id: me.commentList.lastCommentId,
      };

      var apiArgs = {
        method: "GET",
        endpoint: "devrant/rants/" + me.rantId,
        params: params,
        callback: getRantComplete,
        includeAuth: true,
      };

      Ti.App.api(apiArgs);
    },
    getRantComplete = function (result) {
      null == me ||
        (me.loader.hideLoader(),
        true != result.success,
        me.didInitialLoad
          ? (me.commentList.addRantToList(null, result.comments),
            result.comments.length && me.commentList.addBottomRefreshBar())
          : ((me.didInitialLoad = true),
            (me.loadedData = result),
            result &&
              result.rant &&
              result.rant.weekly &&
              addTopBanner(result.rant.weekly),
            me.commentList.addRantToList(
              result.rant,
              result.comments,
              me.commentId
            ),
            result.comments &&
              result.comments.length &&
              _scrollToBottomAfterFetch &&
              me.commentList.scrollToBottom(false)),
        ++Ti.App.rantsLoaded,
        2 == Ti.App.rantsLoaded &&
        0 == Ti.App.Properties.getInt("stickersPromoSeen", 0)
          ? Ti.App.openStickersWindowIfNeeded(me.getWindow())
          : me.wasJustPosted &&
            Ti.App.Properties.getBool("showShareAfterPost", true) &&
            Ti.App.openSharePromptWindow(me.window, me.loadedData.rant),
        (me.wasJustPosted = false),
        (_scrollToBottomAfterFetch = false));
    };

  me.getContainer = function () {
    return me.container;
  };

  var windowClosed = function () {
    me.closeWindow(false, true);
  };

  return (
    (me.closeWindow = function (animated, noClose) {
      null == me ||
        (me.window.removeEventListener("close", windowClosed),
        (noClose = noClose || false),
        null == animated && (animated = true),
        Ti.App.tabBar.closedWindow("rant", me),
        me.commentList.destroySeries(),
        !noClose && me.window.close({ animated: animated }),
        (me = null));
    }),
    me
  );
}

module.exports = RantWindow;
