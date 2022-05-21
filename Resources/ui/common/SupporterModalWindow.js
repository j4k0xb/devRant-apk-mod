function SupporterModalWindow() {
  var me = this;

  (me.window = null),
    (me.container = null),
    (me.contentContainer = null),
    (me.blockingLoader = null),
    (me.init = function () {
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
        })),
        me.window.add(me.container),
        createSubSections();
    });
  var createSubSections = function () {
      createTopBar(),
        (me.contentContainer = Ti.UI.createView({
          width: "90%",
          height: Ti.UI.SIZE,
          layout: "vertical",
        }));

      var lblTitle = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        text: "Support devRant",
        color: Ti.App.colorTextContrast,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
          fontSize: Ti.App.fontXL,
          fontFamily: Ti.App.useFont,
        },
      });

      me.contentContainer.add(lblTitle);

      var lblSubtext = Ti.UI.createLabel({
        width: "100%",
        height: Ti.UI.SIZE,
        text: "Join the devRant++ supporter program to help with our monthly server expenses\n(plus get some cool benefits)",
        color: Ti.App.colorSubtitle,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
          fontSize: Ti.App.fontM,
        },
      });

      me.contentContainer.add(lblSubtext);
      var imageWidth = 0.6 * Ti.App.realWidth,
        imageHeight = 814 * (imageWidth / 927),
        imgServer = Ti.UI.createImageView({
          top: 20,
          image: "/ui/supporter-modal1.png",
          width: imageWidth,
          height: imageHeight,
        });

      me.contentContainer.add(imgServer);

      var btnLearnMore = Ti.App.createBigRoundedButton("Learn More", "red");
      (btnLearnMore.top = 20),
        (btnLearnMore.width = "100%"),
        btnLearnMore.addEventListener("click", function () {
          Ti.App.openSupporterInfoWindow(), me.closeWindow();
        }),
        me.contentContainer.add(btnLearnMore),
        me.container.add(me.contentContainer);
    },
    createTopBar = function () {
      var topBarOptions = {
          leftBtnType: "close",
          rightBtnType: "none",

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
