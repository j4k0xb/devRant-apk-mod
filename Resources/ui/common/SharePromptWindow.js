function SharePromptWindow() {
  var me = this;
  (me.window = null),
    (me.addOn = null),
    (me.btnClose = null),
    (me.rant = null),
    (me.closing = false),
    (me.init = function (addOn, rant) {
      (me.addOn = addOn),
        (me.rant = rant),
        me.createElements(),
        Ti.App.isAndroid &&
          me.addOn.addEventListener("androidback", androidBackCallback),
        addOn.add(me.window),
        me.window.animate(
          {
            top: 0,
            duration: 300,
          },
          function () {
            me.btnClose.addEventListener("click", me.closeWindow);
          }
        ),
        Ti.App.logStat("Viewed Share Prompt");
    });

  var androidBackCallback = function (e) {
    (e.cancelBubble = true), me.closeWindow();
  };

  (me.getWindow = function () {
    return me.window;
  }),
    (me.createElements = function () {
      me.createWindow(),
        (me.btnClose = Ti.UI.createLabel({
          top: 15,
          left: 0,
          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
          width: 54,
          height: 50,
          color: "#fff",
          text: "\uE803",
          font: {
            fontSize: "32sp",
            fontFamily: "icomoon",
          },
        })),
        me.window.add(me.btnClose);

      var mainContentContainer = Ti.UI.createView({
        width: "86%",
        height: Ti.UI.SIZE,
        layout: "vertical",
      });

      me.window.add(mainContentContainer);

      var lblTitle = Ti.UI.createLabel({
        width: "100%",
        height: Ti.UI.SIZE,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        color: "#fff",
        font: {
          fontSize: Ti.App.fontXL,
          fontFamily: Ti.App.useFont,
        },

        text: "Rant Posted!",
      });

      mainContentContainer.add(lblTitle);

      var lblSubtitle = Ti.UI.createLabel({
        width: "80%",
        bottom: 18,
        height: Ti.UI.SIZE,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        color: "#c8c8d0",
        font: {
          fontSize: Ti.App.fontM,
        },

        text: "Collect more ++'s by sharing your rant with dev friends",
      });

      mainContentContainer.add(lblSubtitle);
      var fbTwitterButtonContainer = Ti.UI.createView({
          width: "100%",
          height: Ti.UI.SIZE,
        }),
        twitterButton = Ti.UI.createView({
          left: 0,
          width: "48%",
          height: Ti.UI.SIZE,
          backgroundColor: Ti.App.colorBtnTwitter,
          borderRadius: 10,
          borderWidth: 0,
        });

      twitterButton.addEventListener("click", function () {
        Ti.App.logStat("Rant Share", {
          source: "app",
          platform: "twitter",
          from: "prompt",
        }),
          Ti.App.shareTwitter(me.rant);
      }),
        fbTwitterButtonContainer.add(twitterButton),
        me.btnActiveState(twitterButton);

      var lblContainer = Ti.UI.createView({
        top: 12,
        bottom: 12,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        layout: "horizontal",
      });

      twitterButton.add(lblContainer);

      var lblIcon = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: Ti.App.colorBtnContrast,
        font: {
          fontSize: "32sp",
          fontFamily: "icomoon",
        },

        text: "\uE909",
      });

      lblContainer.add(lblIcon);

      var lblTwitter = Ti.UI.createLabel({
        left: 10,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        text: "Share",
        color: Ti.App.colorBtnContrast,
        font: {
          fontSize: Ti.App.fontBtn,
          fontWeight: "bold",
        },
      });

      lblContainer.add(lblTwitter),
        mainContentContainer.add(fbTwitterButtonContainer);

      var fbButton = Ti.UI.createView({
        right: 0,
        width: "48%",
        height: Ti.UI.SIZE,
        backgroundColor: Ti.App.colorBtnFb,

        borderRadius: 10,
        borderWidth: 0,
      });

      fbButton.addEventListener("click", function () {
        Ti.App.logStat("Rant Share", {
          source: "app",
          platform: "fb",
          from: "prompt",
        }),
          Ti.App.shareFb(me.rant);
      }),
        fbTwitterButtonContainer.add(fbButton),
        me.btnActiveState(fbButton),
        (lblContainer = Ti.UI.createView({
          top: 12,
          bottom: 12,
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          layout: "horizontal",
        })),
        fbButton.add(lblContainer),
        (lblIcon = Ti.UI.createLabel({
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          color: Ti.App.colorBtnContrast,
          font: {
            fontSize: "32sp",
            fontFamily: "icomoon",
          },

          text: "\uE915",
        })),
        lblContainer.add(lblIcon);

      var lblFb = Ti.UI.createLabel({
        left: 10,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        text: "Share",
        color: Ti.App.colorBtnContrast,
        font: {
          fontSize: Ti.App.fontBtn,
          fontWeight: "bold",
        },
      });

      lblContainer.add(lblFb);

      var shareButton = Ti.UI.createView({
        top: 12,
        bottom: 10,
        width: "100%",
        height: Ti.UI.SIZE,
        backgroundColor: Ti.App.colorBtnBgThree,
        borderRadius: 10,
        borderWidth: 0,
      });

      shareButton.addEventListener("click", function () {
        Ti.App.logStat("Rant Share", {
          source: "app",
          platform: "generic",
          from: "prompt",
        }),
          Ti.App.genericShare(me.rant);
      }),
        me.btnActiveState(shareButton),
        (lblContainer = Ti.UI.createView({
          top: 12,
          bottom: 12,
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          layout: "horizontal",
        })),
        shareButton.add(lblContainer),
        (lblIcon = Ti.UI.createLabel({
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          color: Ti.App.colorBtnContrast,
          font: {
            fontSize: "32sp",
            fontFamily: "icomoon",
          },

          text: "\uE901",
        })),
        lblContainer.add(lblIcon);

      var lblFb = Ti.UI.createLabel({
        left: 10,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        text: "Share",
        color: Ti.App.colorBtnContrast,
        font: {
          fontSize: Ti.App.fontBtn,
          fontWeight: "bold",
        },
      });

      lblContainer.add(lblFb), mainContentContainer.add(shareButton);
      var bottomText = "Don't show this share prompt again",
        attributes = [];
      attributes.push({
        type: Ti.UI.ATTRIBUTE_UNDERLINES_STYLE,
        value: Ti.UI.ATTRIBUTE_UNDERLINE_STYLE_SINGLE,
        range: [0, "Don't show this share prompt again".length],
      }),
        attributes.push({
          type: Ti.UI.ATTRIBUTE_UNDERLINE_COLOR,
          value: "#c8c8d0",
          range: [0, "Don't show this share prompt again".length],
        }),
        attributes.push({
          type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
          value: "#c8c8d0",
          range: [0, "Don't show this share prompt again".length],
        }),
        attributes.push({
          type: Ti.UI.ATTRIBUTE_FONT,
          value: { fontSize: Ti.App.fontS },
          range: [0, "Don't show this share prompt again".length],
        });

      var bottomTextUnder = Ti.UI.createLabel({
        width: "100%",
        top: 7,
        height: Ti.UI.SIZE,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,

        attributedString: Ti.UI.createAttributedString({
          text: "Don't show this share prompt again",
          attributes: attributes,
        }),
      });

      mainContentContainer.add(bottomTextUnder),
        bottomTextUnder.addEventListener("click", function () {
          Ti.App.Properties.setBool("showShareAfterPost", false),
            me.closeWindow();
        });
    }),
    (me.btnLearnMoreClicked = function () {
      Ti.Platform.openURL("https://devrant.com/free-stickers?ref=app");
    }),
    (me.btnActiveState = function (buttonName) {
      buttonName.addEventListener("touchstart", function () {
        buttonName.opacity = "0.7";
      }),
        buttonName.addEventListener("touchend", function () {
          var fadeOutBtn = Ti.UI.createAnimation({
            opacity: 1,
            duration: 350,
          });

          buttonName.animate(fadeOutBtn);
        });
    }),
    (me.createWindow = function () {
      me.window = Ti.UI.createView({
        top: Ti.App.realHeight,
        width: "100%",
        height: "100%",

        backgroundColor: "transparent",
        zIndex: 60,
      });

      var backgroundOverlay = Ti.UI.createView({
        width: "100%",
        height: "100%",
        backgroundColor: Ti.App.colorModalBg,
        opacity: 0.96,
      });

      me.window.add(backgroundOverlay);
    }),
    (me.closeWindow = function (animated) {
      Ti.App.isAndroid &&
        me.addOn.removeEventListener("androidback", androidBackCallback);

      me.closing ||
        (null == animated && (animated = true),
        (me.closing = true),
        animated
          ? me.window.animate(
              {
                top: Ti.App.realHeight,
                duration: 300,
              },
              destroyWindow
            )
          : destroyWindow());
    });

  var destroyWindow = function () {
    me.addOn.remove(me.window), (me = null);
  };

  return me;
}

module.exports = SharePromptWindow;
