function SwagWindow() {
  var me = this;

  (me.window = null),
    (me.container = null),
    (me.contentContainer = null),
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
        me.window.addEventListener("close", windowClosed),
        (me.container = Ti.UI.createView({
          width: "100%",
          height: "100%",
        })),
        me.window.add(me.container),
        createSubSections();
    });
  var windowOpened = function () {},
    createSubSections = function () {
      var _Mathfloor = Math.floor;
      createTopBar(),
        (me.contentContainer = Ti.UI.createScrollView({
          top: Ti.App.topBarGenerator.topBarHeight,
          width: "100%",
          height: Ti.UI.FILL,
          layout: "vertical",
        })),
        me.container.add(me.contentContainer);
      var topPadding = 18,
        leftPadding = 20,
        rightPadding = 25,
        descriptionTop = 5,
        btnCtaTop = 18,
        subTextTop = 6,
        contentWidth = 0.6 * Ti.App.realWidth - leftPadding,
        outerSection = Ti.UI.createView({
          top: 18,
          width: "100%",
          height: Ti.UI.SIZE,
        }),
        mainSection = Ti.UI.createView({
          top: 0,
          left: leftPadding,
          width: contentWidth,
          height: Ti.UI.SIZE,
          layout: "vertical",
        }),
        lblTitle = Ti.UI.createLabel({
          width: "100%",
          height: Ti.UI.SIZE,
          left: 0,
          text: "Free Swag!",
          color: Ti.App.colorTabText,
          font: { fontFamily: Ti.App.useFont, fontSize: Ti.App.fontL },
        });
      mainSection.add(lblTitle);
      var lblDescription = Ti.UI.createLabel({
        top: descriptionTop,
        width: "100%",
        height: Ti.UI.SIZE,
        left: 0,
        color: Ti.App.colorDarkGrey,
        font: { fontSize: Ti.App.fontBody },
        text: "Get a free stress ball if a rant you post gets 750 ++'s",
      });
      mainSection.add(lblDescription);
      var btnCta = Ti.App.createBigRoundedButton("Learn More", "red");
      btnCta.addEventListener("click", function () {
        Ti.Platform.openURL("https://devrant.com/free-stickers?ref=appswag");
      }),
        (btnCta.width = "100%"),
        (btnCta.top = btnCtaTop),
        mainSection.add(btnCta);
      var lblSubtext = Ti.UI.createLabel({
        top: subTextTop,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: Ti.App.colorHint,
        text: "*Some restrictions apply",
        font: { fontSize: Ti.App.fontS, fontWeight: "bold" },
      });
      mainSection.add(lblSubtext), outerSection.add(mainSection);
      var imgWidth = 372,
        imgHeight = 633,
        useWidth = Ti.App.realWidth - contentWidth - rightPadding - leftPadding,
        ratio = useWidth / imgWidth,
        useHeight = _Mathfloor(imgHeight * ratio),
        img = Ti.UI.createImageView({
          top: 0,
          right: 0,
          width: useWidth,
          height: useHeight,
          image: "/ui/swag-stickers1.png",
        });

      outerSection.add(img), me.contentContainer.add(outerSection);

      var divider = Ti.UI.createView({
        top: 18,
        height: 1,
        width: Ti.App.realWidth,
        backgroundColor: Ti.App.colorLine,
      });

      me.contentContainer.add(divider),
        (outerSection = Ti.UI.createView({
          top: 18,
          width: "100%",
          bottom: 18,

          height: Ti.UI.SIZE,
        })),
        (mainSection = Ti.UI.createView({
          top: 0,
          left: leftPadding,
          width: contentWidth,
          height: Ti.UI.SIZE,
          layout: "vertical",
        })),
        (lblTitle = Ti.UI.createLabel({
          width: "100%",
          height: Ti.UI.SIZE,
          left: 0,
          text: "Swag Store",
          color: Ti.App.colorTabText,
          font: {
            fontFamily: Ti.App.useFont,
            fontSize: Ti.App.fontL,
          },
        })),
        mainSection.add(lblTitle),
        (lblDescription = Ti.UI.createLabel({
          top: descriptionTop,
          width: "100%",
          height: Ti.UI.SIZE,
          left: 0,
          color: Ti.App.colorDarkGrey,
          font: {
            fontSize: Ti.App.fontBody,
          },

          text: "Visit the devRant swag store for T-shirts, laptop stickers and stress balls",
        })),
        mainSection.add(lblDescription),
        (btnCta = Ti.App.createBigRoundedButton("Visit Store", "red")),
        btnCta.addEventListener("click", function () {
          Ti.Platform.openURL("https://swag.devrant.io");
        }),
        (btnCta.width = "100%"),
        (btnCta.top = btnCtaTop),
        mainSection.add(btnCta),
        (lblSubtext = Ti.UI.createLabel({
          top: subTextTop,
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          color: Ti.App.colorHint,
          text: "Or tap store items below",
          font: {
            fontSize: Ti.App.fontS,
            fontWeight: "bold",
          },
        })),
        mainSection.add(lblSubtext),
        outerSection.add(mainSection),
        (imgWidth = 372),
        (imgHeight = 553);
      var useHeight = _Mathfloor(imgHeight * ratio),
        img = Ti.UI.createImageView({
          top: 0,
          right: 0,
          width: useWidth,
          height: useHeight,
          image: "/ui/swag-store1.png",
        });

      outerSection.add(img), me.contentContainer.add(outerSection);

      var storeItemsWebview = Titanium.UI.createWebView({
        top: 0,
        left: 0,
        width: "100%",
        height: 0,
        backgroundColor: Ti.App.colorModalBg,
        scalesPageToFit: false,
        enableZoomControls: false,
      });

      me.contentContainer.add(storeItemsWebview);

      var xhr = Ti.Network.createHTTPClient();
      Ti.App.addEventListener("openLinkUrl", openUrlFromLink),
        (xhr.onload = function (e) {
          if (null != me) {
            var count = (this.responseText.match(/product-list/g) || []).length;
            (storeItemsWebview.height = (Ti.App.realWidth / 3) * count),
              storeItemsWebview.setHtml(this.responseText),
              Ti.App.isAndroid &&
                (me.contentContainer.scrollTo(0, 0),
                setTimeout(function () {
                  me.contentContainer.scrollTo(0, 0);
                }, 500));
          }
        }),
        xhr.open("GET", "https://devrant.com/app-pages/store-products"),
        xhr.setTimeout(5e3),
        xhr.send();
    },
    openUrlFromLink = function (e) {
      Ti.Platform.openURL(e.url);
    },
    createTopBar = function () {
      var topBarOptions = {
          leftBtnType: "back",
          rightBtnType: "none",
          barTitle: "Swag",
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

  var windowClosed = function () {
    me.closeWindow(false, true);
  };

  return (
    (me.closeWindow = function (animated, noClose) {
      me.window.removeEventListener("close", windowClosed),
        (noClose = noClose || false),
        Ti.App.removeEventListener("openLinkUrl", openUrlFromLink),
        null == animated && (animated = true),
        Ti.App.tabBar.closedWindow("swag"),
        noClose || me.window.close({ animated: animated }),
        (me = null);
    }),
    me
  );
}

module.exports = SwagWindow;
