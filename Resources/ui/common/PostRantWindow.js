function PostRantWindow() {
  var me = this;
  (me.type = null),
    (me.window = null),
    (me.container = null),
    (me.postTextArea = null),
    (me.blockingLoader = null),
    (me.tagsInput = null),
    (me.rantId = null),
    (me.successHandler = null),
    (me.prepop = null),
    (me.prepopTags = null);
  var _autoSaveTimer,
    topBar = null,
    commentId = null,
    contentSaved = false,
    tagSelector = null,
    _autoSaveInterval = 5e3,
    _rt = null,
    _rantTypeTitles = {
      1: { title: "Rant/Story", prompt: "The rant starts here..." },
      2: { title: "Collab" },
      3: { title: "Joke/Meme", prompt: "Bring the funny..." },
      4: { title: "Question", prompt: "Ask your question..." },
      5: { title: "devRant", prompt: "Talk about devRant..." },
      6: { title: "Random", prompt: "Words and stuff go here..." },
    };

  (me.init = function (
    type,
    rantId,
    successHandler,
    prepop,
    prepopTags,
    paramCommentId,
    rt
  ) {
    if (
      ((me.type = type),
      (me.rantId = rantId),
      (me.successHandler = successHandler),
      (me.prepop = prepop || ""),
      (me.prepopTags = prepopTags || ""),
      (_rt = rt),
      7 == _rt && (_rt = 1),
      (commentId = paramCommentId),
      me.createElements(),
      "comment" == me.type)
    ) {
      var savedData = Ti.App.Properties.getString(
        "comment_wip_" + me.rantId,
        ""
      );

      "" !== savedData &&
        ((me.postTextArea.input.value = savedData + me.prepop),
        me.postTextArea.input.fireEvent("change", {
          value: savedData,
        }));
    } else if ("rant" == me.type) {
      var savedData = Ti.App.Properties.getString("rant_wip", ""),
        savedTags = Ti.App.Properties.getString("rant_wip_tags", "");
      ("" !== savedData || "" !== savedTags) &&
        ((me.postTextArea.input.value = savedData),
        me.postTextArea.input.fireEvent("change", {
          value: savedData,
        }),
        null == rt &&
          ((_rt = Ti.App.Properties.getInt("rant_rt", 1)),
          topBar.setBarTitle(_rantTypeTitles[_rt].title)),
        "" != savedTags && (me.tagsInput.input.value = savedTags)),
        (_autoSaveTimer = setTimeout(_saveContent, _autoSaveInterval));
    }

    me.window.open({
      modal: !Ti.App.isAndroid,
    }),
      Ti.App.logStat(
        "Post " + me.type[0].toUpperCase() + me.type.slice(1) + " Viewed"
      );
  }),
    (me.getWindow = function () {
      return me.window;
    }),
    (me.createElements = function () {
      me.createWindow(), createTopBar(), createMainSection();

      var BlockingLoader = require("ui/common/BlockingLoader");

      (me.blockingLoader = new BlockingLoader()),
        me.window.add(me.blockingLoader.getElem()),
        ("edit_rant" == me.type || "edit_comment" == me.type) && loadEditData();
    });
  var loadEditData = function () {
      me.blockingLoader.showLoader();

      var params = {
        links: 0,
      };

      "edit_rant" == me.type && (params.last_comment_id = 999999999999);

      var useEndpoint = "";

      useEndpoint =
        "edit_rant" == me.type
          ? "devrant/rants/" + me.rantId
          : "comments/" + commentId;

      var apiArgs = {
        method: "GET",
        endpoint: useEndpoint,
        params: params,
        callback: getEditInfoComplete,
        includeAuth: true,
      };

      Ti.App.api(apiArgs);
    },
    getEditInfoComplete = function (result) {
      var useBodyText = "";

      result.rant
        ? (useBodyText = result.rant.text)
        : result.comment && (useBodyText = result.comment.body),
        (me.postTextArea.input.value = useBodyText),
        me.postTextArea.input.fireEvent("change", {
          value: useBodyText,
        }),
        "edit_rant" == me.type &&
          (me.tagsInput.input.value = result.rant.tags.join(", ")),
        (topBar.children[2].visible = true),
        me.blockingLoader.hideLoader();
    },
    _topBarOptionArrowClicked = function () {
      var PostTypeWindow = require("ui/common/PostTypeWindow"),
        postTypeWindow = new PostTypeWindow();
      postTypeWindow.init({
        typeSelectedFunc: function (type) {
          return 2 == type
            ? (me.closeWindow(), void Ti.App.openAddCollab(null, true))
            : void ((_rt = type),
              topBar.setBarTitle(_rantTypeTitles[_rt].title),
              me.postTextArea.setPlaceholder(_rantTypeTitles[_rt].prompt));
        },
      });
    },
    createTopBar = function () {
      var barTitle = "",
        showOptionArrow = false;

      "rant" == me.type
        ? ((barTitle = _rantTypeTitles[_rt || 1].title),
          (showOptionArrow = true))
        : "comment" == me.type
        ? (barTitle = "Comment")
        : ("edit_rant" == me.type || "edit_comment" == me.type) &&
          (barTitle = "Edit");

      var btnRightType = "";

      btnRightType =
        "edit_rant" != me.type && "edit_comment" != me.type ? "post" : "save";

      var topBarOptions = {
        leftBtnType: "close",
        rightBtnType: btnRightType,
        barTitle: barTitle,
        callbackLeftBtn: function () {
          me.closeWindow();
        },
        callbackRightBtn: doPostRant,
        showOptionArrow: showOptionArrow,
      };

      showOptionArrow &&
        (topBarOptions.optionArrowCallback = _topBarOptionArrowClicked),
        (topBar = Ti.App.topBarGenerator.createBar(topBarOptions)),
        ("edit_rant" == me.type || "edit_comment" == me.type) &&
          (topBar.children[2].visible = false),
        me.container.add(topBar);
    },
    doPostRant = function () {
      me.blockingLoader.showLoader(), me.postTextArea.input.blur();
      var rantText = me.postTextArea.getValue(),
        params = {},
        endpoint = "";

      if ("rant" == me.type) {
        if (
          ((endpoint = "devrant/rants"),
          6 > rantText.length || 5e3 < rantText.length)
        )
          return (
            Ti.App.showDialog(
              "Whoops!",
              "Your rant must be between 6 and 5000 characters."
            ),
            void me.blockingLoader.hideLoader()
          );

        params = {
          rant: rantText,
          tags: me.tagsInput.input.value,
          type: _rt,
        };

        var rantImage = me.postTextArea.attachedImage;

        null != rantImage && (params.image = rantImage);
      } else if ("comment" == me.type) {
        if (
          ((endpoint = "devrant/rants/" + me.rantId + "/comments"),
          1 > rantText.length || rantText.length > (Ti.App.dpp ? 2e3 : 1e3))
        )
          return (
            Ti.App.showDialog(
              "Whoops!",
              "Your comment must be between 1 and 1,000 characters (2,000 characters for devRant++ subscribers)."
            ),
            void me.blockingLoader.hideLoader()
          );

        params = {
          comment: rantText,
        };

        var rantImage = me.postTextArea.attachedImage;

        null != rantImage && (params.image = rantImage);
      } else if ("edit_rant" == me.type) {
        if (
          ((endpoint = "devrant/rants/" + me.rantId),
          6 > rantText.length || 5e3 < rantText.length)
        )
          return (
            Ti.App.showDialog(
              "Whoops!",
              "Your rant must be between 6 and 5000 characters."
            ),
            void me.blockingLoader.hideLoader()
          );

        params = {
          rant: rantText,
          tags: me.tagsInput.input.value,
          type: _rt,
        };

        var rantImage = me.postTextArea.attachedImage;

        null != rantImage && (params.image = rantImage);
      } else if ("edit_comment" == me.type) {
        if (
          ((endpoint = "comments/" + commentId),
          1 > rantText.length || rantText.length > (Ti.App.dpp ? 2e3 : 1e3))
        )
          return (
            Ti.App.showDialog(
              "Whoops!",
              "Your comment must be between 1 and 1,000 characters (2,000 characters for devRant++ subscribers)."
            ),
            void me.blockingLoader.hideLoader()
          );

        params = {
          comment: rantText,
        };
      }

      var apiArgs = {
        method: "POST",
        endpoint: endpoint,
        params: params,
        callback:
          "edit_rant" != me.type && "edit_comment" != me.type
            ? rantPostComplete
            : contentEditComplete,
        includeAuth: true,
      };

      Ti.App.api(apiArgs);
    },
    contentEditComplete = function (result) {
      if ((me.blockingLoader.hideLoader(), result.success))
        Ti.App.openRantWindow(me.rantId), me.closeWindow();
      else {
        var useReason = "";

        result.fail_reason && (useReason = result.fail_reason),
          Ti.App.showDialog("Whoops!", useReason);
      }
    },
    rantPostComplete = function (result) {
      var type = me.type,
        rant_id = me.rantId;

      result.success
        ? ((contentSaved = true),
          me.successHandler && me.successHandler(),
          me.closeWindow(),
          "rant" == type
            ? (Ti.App.Properties.removeProperty("rant_wip"),
              Ti.App.Properties.removeProperty("rant_wip_tags"),
              Ti.App.openRantWindow(result.rant_id, true),
              Ti.App.tabBar.refreshMainFeed(),
              "stories" == Ti.App.tabBar.getCurrentTabId() &&
                Ti.App.tabBar.refreshStoriesFeed())
            : "comment" == type &&
              Ti.App.Properties.removeProperty("comment_wip_" + rant_id),
          ("rant" == type || "comment" == type) &&
            0 < Ti.App.getPromptForPushNotifs() &&
            Ti.App.promtForNotificationPermIfNeeded(),
          Ti.App.openStickersWindowIfNeeded(
            Ti.App.isAndroid
              ? Ti.App.mainAppWindow
              : Ti.App.savedTabs.rants.obj.getWindow()
          ))
        : (me.blockingLoader.hideLoader(),
          result &&
            result.error &&
            false !== result.confirmed &&
            Ti.App.showDialog("Whoops!", result.error));
    },
    createMainSection = function () {
      var container = Ti.UI.createView({
        width: "90%",
        height: Ti.UI.FILL,

        layout: "vertical",
      });

      me.container.add(container);

      var PostTextArea = require("ui/common/PostTextArea");
      me.postTextArea = new PostTextArea();
      var showAttach,
        usePlaceholder = "";

      "rant" == me.type || "edit_rant" == me.type
        ? ((usePlaceholder = _rantTypeTitles[_rt].prompt), (showAttach = true))
        : ("comment" == me.type || "edit_comment" == me.type) &&
          ((usePlaceholder = "Add your 2 cents..."), (showAttach = true)),
        me.postTextArea.init(
          usePlaceholder,
          showAttach,
          "rant" == me.type || "edit_rant" == me.type ? "rant" : "comment"
        ),
        me.prepop &&
          ((me.postTextArea.input.value = me.prepop),
          me.postTextArea.input.fireEvent("change", {
            value: me.prepop,
          }),
          setTimeout(function () {
            me.postTextArea.input.focus();
          }, 650));

      var postTextAreaElem = me.postTextArea.getElem();

      if (
        (container.add(postTextAreaElem),
        "rant" == me.type || "edit_rant" == me.type)
      ) {
        var useSymbol = "\uE804",
          useLabel = "Tags (comma separated)";

        (me.tagsInput = Ti.App.createBigInputField("\uE804", useLabel)),
          (me.tagsInput.top = 6),
          me.prepopTags && (me.tagsInput.input.value = me.prepopTags),
          container.add(me.tagsInput);
        var TagSelector = require("ui/common/TagSelector");
        (tagSelector = new TagSelector()),
          tagSelector.init(
            me.tagsInput.input,
            0.9 * Ti.App.realWidth - 18,
            me.window,
            function () {
              var rect = me.tagsInput.getRect();
              return (
                rect.y +
                Ti.App.topBarGenerator.topBarHeight -
                tagSelector.selectorHeight +
                8
              );
            }
          );
      }
    };

  me.createWindow = function () {
    (me.window = Ti.UI.createWindow({
      width: "100%",
      height: "100%",
      navBarHidden: true,
      backgroundColor: Ti.App.colorModalBg,
      orientationModes: [Ti.UI.PORTRAIT],
    })),
      me.window.addEventListener("close", windowClosed),
      (me.container = Ti.UI.createView({
        width: "100%",
        height: "100%",
        layout: "vertical",
      })),
      me.window.add(me.container);
  };
  var windowClosed = function () {
      me.closeWindow(true);
    },
    _saveContent = function (terminate) {
      contentSaved ||
        ("comment" != me.type && "rant" != me.type) ||
        (Ti.App.Properties.setString(
          "comment" == me.type ? "comment_wip_" + me.rantId : "rant_wip",
          me.postTextArea.getValue() + ""
        ),
        "rant" == me.type &&
          (console.log("in save auto is", terminate),
          Ti.App.Properties.setString(
            "rant_wip_tags",
            me.tagsInput.input.value
          ),
          Ti.App.Properties.setInt("rant_rt", _rt),
          true === terminate
            ? _autoSaveTimer && clearTimeout(_autoSaveTimer)
            : (_autoSaveTimer = setTimeout(_saveContent, _autoSaveInterval))));
    };

  return (
    (me.closeWindow = function (noClose) {
      me.window.removeEventListener("close", windowClosed),
        (noClose = noClose || false),
        _saveContent(true),
        noClose || me.window.close(),
        (me = null);
    }),
    me
  );
}

module.exports = PostRantWindow;
