function SupporterModalWindow() {
  var me = this;

  (me.window = null),
    (me.container = null),
    (me.contentContainer = null),
    (me.blockingLoader = null);
  var _options = {},
    _typeOptions = [
      {
        id: 1,
        label: "Rant/Story",
        icon: "\uE80C",
        bgColor:
          3 == Ti.App.theme ? Ti.App.colorBlackDarkGrey : Ti.App.colorRed,
        iconSize: "80",
        title: "Rant/Story Posts",
        description:
          "Vent your programming/work frustrations with a rant or share a dev-related story (which might also be a rant).",
      },

      {
        id: 3,
        label: "Joke/Meme",
        icon: "\uE917",
        bgColor:
          3 == Ti.App.theme ? Ti.App.colorBlackDarkGrey : Ti.App.colorDarkGreen,
        iconSize: "25",
        title: "Joke/Meme Posts",
        description:
          "Share a good dev joke or funny meme. Original content is encouraged but not required.",
      },

      {
        id: 4,
        label: "Question",
        icon: "\uE922",
        bgColor:
          3 == Ti.App.theme ? Ti.App.colorBlackDarkGrey : Ti.App.colorPurple,
        iconSize: "27",
        title: "Question Posts",
        description:
          "Ask questions about dev concepts, career advice, opinions on development stacks, etc. Please avoid questions on specific code (use SO for that) or anything that is easily googleable.",
      },

      {
        id: 2,
        label: "Collab",
        icon: "\uE91E",
        bgColor:
          3 == Ti.App.theme ? Ti.App.colorBlackDarkGrey : Ti.App.colorYellow,
        iconSize: "25",
        title: "Collab Posts",
        description:
          "Post a collab to get your idea or existing project in front of other devs for help or feedback. Company job postings are not allowed.",
      },

      {
        id: 5,
        label: "devRant",
        icon: "\uE914",
        bgColor:
          3 == Ti.App.theme ? Ti.App.colorBlackDarkGrey : Ti.App.colorOrange,
        iconSize: "25",
        title: "devRant Posts",
        description:
          "Talk about devRant: the community, the app, our business, stickers, balls, shirts, etc.",
      },

      {
        id: 6,
        label: "Random",
        icon: "\uE811",
        bgColor:
          3 == Ti.App.theme ? Ti.App.colorBlackDarkGrey : Ti.App.colorGreen,
        iconSize: "25",
        title: "Random Posts",
        description:
          "Ideally every post is dev-related, but sometimes you get married / have a baby or you need to vent about life in general.",
      },
    ];

  (me.init = function (options) {
    (_options = options),
      me.createElements(),
      me.window.open({
        modal: !Ti.App.isAndroid,
      });
  }),
    (me.getWindow = function () {
      return me.window;
    }),
    (me.createElements = function () {
      (me.window = Ti.UI.createWindow({
        navBarHidden: true,
        backgroundColor: Ti.App.colorModalBg,
        width: "100%",
        height: "100%",
        orientationModes: [Ti.UI.PORTRAIT],
      })),
        me.window.addEventListener("close", _windowClosed),
        (me.container = Ti.UI.createView({
          width: "100%",
          height: "100%",
          backgroundColor: Ti.App.colorModalBg,
        })),
        me.window.add(me.container),
        createSubSections();
    });
  var createSubSections = function () {
      createTopBar();

      var contentContainerHeight =
        Ti.App.realHeight -
        Ti.App.topBarGenerator.topBarHeight -
        (Ti.App.isAndroid ? 0 : 60);

      me.contentContainer = Ti.UI.createView({
        top: Ti.App.topBarGenerator.topBarHeight,
        width: Ti.App.realWidth - 20,
        height: contentContainerHeight,
        layout: "vertical",
      });
      var vPadding = 10,
        smallBtnHeight = 60,
        totalPaddingSpace = 10 * (_typeOptions.length + 1),
        bigButtonSize =
          contentContainerHeight -
          totalPaddingSpace -
          smallBtnHeight * (_typeOptions.length - 1),
        btn = _generateBigButton(
          bigButtonSize,
          _typeOptions[0].bgColor,
          _typeOptions[0].icon,
          _typeOptions[0].iconSize,
          _typeOptions[0].label
        );
      (btn.top = 10), (btn.buttonId = 0), me.contentContainer.add(btn);

      for (var i = 1; i < _typeOptions.length; ++i)
        (btn = _generateButton(
          smallBtnHeight,
          _typeOptions[i].bgColor,
          _typeOptions[i].icon,
          _typeOptions[i].iconSize,
          _typeOptions[i].label
        )),
          (btn.top = 10),
          (btn.buttonId = i),
          me.contentContainer.add(btn);

      me.contentContainer.addEventListener("click", _btnClicked),
        me.container.add(me.contentContainer);
    },
    _btnClicked = function (e) {
      if (void 0 !== e.source.buttonId) {
        var thisTypeInfo = _typeOptions[e.source.buttonId],
          executeFunc = function () {
            null == me ||
              (me.closeWindow(), _options.typeSelectedFunc(thisTypeInfo.id));
          };

        if (
          void 0 !== thisTypeInfo.description &&
          !Ti.App.Properties.getBool("saw_type_desc_" + thisTypeInfo.id, false)
        ) {
          var dialog = Ti.UI.createAlertDialog({
            message: thisTypeInfo.description,
            ok: "Got it!",
            title: thisTypeInfo.title,
          });

          return (
            dialog.addEventListener("click", executeFunc),
            Ti.App.Properties.setBool("saw_type_desc_" + thisTypeInfo.id, true),
            void dialog.show()
          );
        }

        executeFunc();
      }
    },
    _generateBigButton = function (height, bgColor, icon, iconSize, text) {
      var container = Ti.UI.createView({
          width: "100%",
          height: height,
          backgroundColor: bgColor,
          borderRadius: 12,
          borderWidth: 0,
        }),
        labelContainer = Ti.UI.createView({
          layout: "vertical",
          height: Ti.UI.SIZE,
          width: Ti.UI.SIZE,
          touchEnabled: false,
        }),
        lblIcon = Ti.UI.createLabel({
          text: icon,
          color: "#fff",
          font: {
            fontFamily: "icomoon",
            fontSize: iconSize + "sp",
          },

          touchEnabled: false,
        });

      labelContainer.add(lblIcon);

      var lblText = Ti.UI.createLabel({
        top: 5,
        text: text,
        color: "#fff",
        font: {
          fontSize: "20sp",
          fontWeight: "bold",
        },

        touchEnabled: false,
      });

      return (
        labelContainer.add(lblText), container.add(labelContainer), container
      );
    },
    _generateButton = function (height, bgColor, icon, iconSize, text) {
      var container = Ti.UI.createView({
          width: "100%",
          height: height,
          backgroundColor: bgColor,
          borderRadius: 12,
          borderWidth: 0,
          layout: "horizontal",
        }),
        lblIcon = Ti.UI.createLabel({
          left: 14,
          height: "100%",
          width: Ti.UI.SIZE,
          text: icon,
          color: "#fff",
          touchEnabled: false,
          font: {
            fontFamily: "icomoon",
            fontSize: "30sp",
          },
        });

      container.add(lblIcon);

      var lblText = Ti.UI.createLabel({
        left: 10,
        height: "100%",
        width: Ti.UI.SIZE,
        top: 0,
        text: text,
        color: "#fff",
        touchEnabled: false,
        font: {
          fontSize: "20sp",
          fontWeight: "bold",
        },
      });

      return container.add(lblText), container;
    },
    createTopBar = function () {
      var topBarOptions = {
          leftBtnType: "close",
          rightBtnType: "none",
          barTitle: "New Post",
          callbackLeftBtn: function () {
            me.closeWindow();
          },
        },
        topBar = Ti.App.topBarGenerator.createBar(topBarOptions);
      me.container.add(topBar);
    };

  me.getContainer = function () {
    return me.container;
  };

  var _windowClosed = function () {
    me.closeWindow(false, true);
  };

  return (
    (me.closeWindow = function (animated, noClose) {
      me.window.removeEventListener("close", _windowClosed),
        (noClose = noClose || false),
        null == animated && (animated = true),
        noClose || me.window.close({ animated: animated }),
        (me = null);
    }),
    me
  );
}

module.exports = SupporterModalWindow;
