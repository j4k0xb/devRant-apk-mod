function SupporterInfoWindow() {
  var me = this,
    _window = null,
    _container = null,
    _contentContainer = null,
    _blockingLoader = null;

  (me.init = function (options) {
    (_options = options), _createElements();
  }),
    (me.getWindow = function () {
      return _window;
    });
  var _createElements = function () {
      (_window = Ti.UI.createWindow({
        navBarHidden: true,
        backgroundColor: Ti.App.colorBg,
        width: "100%",
        height: "100%",

        orientationModes: [Ti.UI.PORTRAIT],
      })),
        _window.addEventListener("close", _windowClosed),
        (_container = Ti.UI.createView({
          width: "100%",
          height: "100%",
        })),
        _window.add(_container);

      var BlockingLoader = require("ui/common/BlockingLoader");

      _blockingLoader = new BlockingLoader();
      var loaderElem = _blockingLoader.getElem();
      (loaderElem.height = Ti.App.realHeight + 300),
        (loaderElem.top = 0),
        _window.add(_blockingLoader.getElem()),
        _createSubSections();
    },
    _createSubSections = function () {
      _createTopBar(),
        (_contentContainer = Ti.UI.createScrollView({
          top: Ti.App.topBarGenerator.topBarHeight,
          width: "100%",
          height: Ti.UI.FILL,
          layout: "vertical",
        })),
        _container.add(_contentContainer);

      var imageHeight = Ti.App.realWidth / 1125;
      imageHeight = 270 * imageHeight;

      var topImgBar = Ti.UI.createImageView({
        width: "100%",
        height: imageHeight,
        image: "/ui/supporter-banner1.png",
      });

      _contentContainer.add(topImgBar), _createInfo();
    },
    _createInfo = function () {
      var infoContainer = Ti.UI.createView({
          top: 5,
          bottom: 15,
          width: "90%",
          height: Ti.UI.SIZE,
          layout: "vertical",
        }),
        lblHeader = Ti.UI.createLabel({
          top: 7,
          width: "100%",
          height: Ti.UI.SIZE,
          textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
          text: Ti.App.dpp
            ? "Thanks for Your Support!"
            : "Help Support devRant",
          color: Ti.App.colorTabText,
          font: {
            fontFamily: Ti.App.useFont,
            fontSize: Ti.App.fontL,
          },
        });

      infoContainer.add(lblHeader);
      var nonSupporterText =
          "devRant is a project self-funded by @dfox and @trogus, and as the community gets more popular, our server costs continue to rise. Help the community by joining our new supporter program, devRant++ and get these awesome benefits:",
        supporterText =
          "As a supporting subscriber to devRant++ you have these exclusive benefits:",
        lblBody = Ti.UI.createLabel({
          top: 7,
          bottom: 6,
          width: "100%",
          height: Ti.UI.SIZE,
          textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
          color: Ti.App.colorDarkGrey,
          font: {
            fontSize: Ti.App.fontBody,
          },

          text: Ti.App.dpp ? supporterText : nonSupporterText,
        });

      infoContainer.add(lblBody);

      var bullet = _generateBullet("Feel good supporting devRant!");

      if (
        (infoContainer.add(bullet),
        (bullet = _generateBullet("Supporter badge in rant threads")),
        infoContainer.add(bullet),
        (bullet = _generateBullet("Edit rants & comments for up to 30 mins")),
        infoContainer.add(bullet),
        (bullet = _generateBullet("Reserved position on supporters list")),
        infoContainer.add(bullet),
        (bullet = _generateBullet("Exclusive black app theme")),
        infoContainer.add(bullet),
        (bullet = _generateBullet("More cool benefits coming soon!")),
        infoContainer.add(bullet),
        (nonSupporterText = "Subscribe to devRant++ for only:"),
        (supporterText =
          "Your monthly support of USD $1.99 will automatically be billed until you cancel your subscription."),
        (lblBody = Ti.UI.createLabel({
          top: 15,
          width: "100%",
          height: Ti.UI.SIZE,
          textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
          color: Ti.App.colorDarkGrey,
          font: { fontSize: Ti.App.fontBody },
          text: Ti.App.dpp ? supporterText : nonSupporterText,
        })),
        infoContainer.add(lblBody),
        Ti.App.dpp)
      ) {
        var lblSubLink = Ti.UI.createLabel({
          top: 10,
          text: "View devRant++ Terms of Service",
          width: "100%",
          height: Ti.UI.SIZE,
          textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
          color: Ti.App.colorHint,
          font: {
            fontWeight: "bold",
            fontSize: Ti.App.fontS,
          },
        });

        lblSubLink.addEventListener("click", _openTos),
          infoContainer.add(lblSubLink),
          (lblSubLink = Ti.UI.createLabel({
            top: 10,
            text: "Manage/cancel your devRant++ subscription",
            width: "100%",
            height: Ti.UI.SIZE,
            textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
            color: Ti.App.colorHint,
            font: {
              fontWeight: "bold",
              fontSize: Ti.App.fontS,
            },
          })),
          lblSubLink.addEventListener("click", function () {
            Ti.Platform.openURL(
              Ti.App.isAndroid
                ? "https://play.google.com/store/apps/details?id=com.hexicallabs.devrant"
                : "https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions"
            );
          }),
          infoContainer.add(lblSubLink);
      }

      if (!Ti.App.dpp) {
        var lblPrice = Ti.UI.createLabel({
          top: 3,
          width: "100%",
          height: Ti.UI.SIZE,
          textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
          color: Ti.App.colorDarkGrey,
          font: {
            fontSize: Ti.App.fontBody,
            fontWeight: "bold",
          },

          text: "$1.99 USD/month",
        });

        infoContainer.add(lblPrice);

        var lblSubBody = Ti.UI.createLabel({
          top: 7,
          bottom: 7,
          width: "100%",
          height: Ti.UI.SIZE,
          textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
          color: Ti.App.colorHint,
          text: "By subscribing, you agree to the devRant++ Terms of Service. Cancel anytime.",
          font: {
            fontSize: Ti.App.fontS,
            fontWeight: "bold",
          },
        });

        lblSubBody.addEventListener("click", _openTos),
          infoContainer.add(lblSubBody);

        var btnSubscribe = Ti.App.createBigRoundedButton(
          "Subscribe Now",
          "red"
        );
        (btnSubscribe.top = 10),
          btnSubscribe.addEventListener("click", _subscribeClick),
          infoContainer.add(btnSubscribe);
      }

      _contentContainer.add(infoContainer);
    },
    _generateBullet = function (text) {
      var bulletContainer = Ti.UI.createView({
          top: 4,
          width: "100%",
          height: Ti.UI.SIZE,
          layout: "horizontal",
          horizontalWrap: false,
        }),
        bullet = Ti.UI.createView({
          top: 7,
          width: 6,
          height: 6,
          borderRadius: 3,
          borderWidth: 0,
          backgroundColor: Ti.App.colorHint,
        });

      bulletContainer.add(bullet);

      var lblBulletText = Ti.UI.createLabel({
        left: 9,
        text: text,
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        color: Ti.App.colorDarkGrey,
        font: {
          fontSize: Ti.App.fontBody,
        },
      });

      return bulletContainer.add(lblBulletText), bulletContainer;
    },
    _createTopBar = function () {
      var topBarOptions = {
          leftBtnType: "back",
          rightBtnType: "none",
          barTitle: "devRant++",
          callbackLeftBtn: function () {
            me.closeWindow();
          },
        },
        topBar = Ti.App.topBarGenerator.createBar(topBarOptions);

      _container.add(topBar);
    };

  me.getContainer = function () {
    return _container;
  };
  var _subscribeClick = function () {
      if (!Ti.App.isLoggedIn())
        return void Ti.App.openSignupWindow("supporter_info");

      if (
        (Ti.App.tabBar.setLocked(true),
        _blockingLoader.showLoader(),
        !Ti.App.inAppPurchases)
      ) {
        var InAppPurchases = require("ui/common/InAppPurchases");
        Ti.App.inAppPurchases = new InAppPurchases();
      }

      Ti.App.inAppPurchases.purchaseItem({
        product: "com.hexicallabs.devrant.pp.1monthsub",
        successHandler: _purchaseSuccess,
        errorHandler: _purchaseError,
      });
    },
    _purchaseSuccess = function (receipt) {
      var params = {
          platform: Ti.App.isAndroid ? "android" : "ios",
          receipt: receipt,
        },
        apiArgs = {
          method: "POST",
          endpoint: "users/me/dpp",
          params: params,
          callback: _buyItemComplete,
          includeAuth: true,
        };

      Ti.App.api(apiArgs);
    },
    _buyItemComplete = function (result) {
      Ti.App.tabBar.setLocked(false), _blockingLoader.hideLoader();

      var dialog = Ti.UI.createAlertDialog({
        message:
          "Thanks for becoming a member of the devRant supporter program (devRant++)! We appreciate the support. Feel free to let us know if you have any questions (info@devrant.io)",
        ok: "Sounds good!",
        title: "Success!",
      });

      dialog.addEventListener("click", function () {
        Ti.App.tabBar.destroyAllTabs();
      }),
        dialog.show();
    },
    _openTos = function () {
      Ti.Platform.openURL("https://devrant.com/supporter-tos");
    },
    _purchaseError = function () {
      _blockingLoader.hideLoader(), Ti.App.tabBar.setLocked(false);
    },
    _windowClosed = function () {
      me.closeWindow(false, true);
    };

  return (
    (me.closeWindow = function (animated, noClose) {
      _window.removeEventListener("close", _windowClosed),
        (noClose = noClose || false),
        null == animated && (animated = true),
        Ti.App.tabBar.closedWindow("supporter_info", me),
        noClose || _window.close({ animated: animated }),
        (me = null);
    }),
    me
  );
}

module.exports = SupporterInfoWindow;
