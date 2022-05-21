function StickersWindow() {
  var me = this;
  (me.window = null),
    (me.addOn = null),
    (me.btnClose = null),
    (me.init = function (addOn) {
      (me.addOn = addOn),
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
        Ti.App.logStat("Viewed Stickers");
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
          top: 10,
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

        text: "Free Swag!",
      });

      mainContentContainer.add(lblTitle);

      var lblSubtitle = Ti.UI.createLabel({
        width: "100%",
        height: Ti.UI.SIZE,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        color: "#c8c8d0",
        font: {
          fontSize: Ti.App.fontM,
        },

        text: "Get a free stress ball if a rant you post gets 750 ++'s",
      });

      mainContentContainer.add(lblSubtitle);

      var img = Ti.UI.createImageView({
        top: 20,
        image: "/ui/stickers-laptop2.png",
        width: "85%",
        defaultImage: "",
      });

      mainContentContainer.add(img);

      var btnLearnMore = Ti.App.createBigRoundedButton("Learn More", "red");
      (btnLearnMore.width = "100%"),
        (btnLearnMore.top = 25),
        mainContentContainer.add(btnLearnMore),
        btnLearnMore.addEventListener("click", me.btnLearnMoreClicked),
        btnLearnMore.addEventListener("touchstart", function () {
          btnLearnMore.opacity = "0.7";
        }),
        btnLearnMore.addEventListener("touchend", function () {
          var fadeOutBtn = Ti.UI.createAnimation({
            opacity: 1,
            duration: 350,
          });

          btnLearnMore.animate(fadeOutBtn);
        });

      var bottomTextUnder = Ti.UI.createLabel({
        width: "100%",
        top: 7,
        height: Ti.UI.SIZE,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        color: "#c8c8d0",
        font: {
          fontSize: Ti.App.fontS,
        },

        text: '*Some restrictions apply, tap "Learn More"',
      });

      mainContentContainer.add(bottomTextUnder);
    }),
    (me.btnLearnMoreClicked = function () {
      Ti.Platform.openURL("https://devrant.com/free-stickers?ref=app");
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
      null == animated && (animated = true),
        Ti.App.isAndroid &&
          me.addOn.removeEventListener("androidback", androidBackCallback),
        animated
          ? me.window.animate(
              {
                top: Ti.App.realHeight,
                duration: 300,
              },
              destroyWindow
            )
          : destroyWindow();
    });

  var destroyWindow = function () {
    me.addOn.remove(me.window), (me = null);
  };

  return me;
}

module.exports = StickersWindow;
