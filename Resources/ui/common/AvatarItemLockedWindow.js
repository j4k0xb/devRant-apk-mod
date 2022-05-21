function AvatarItemLockedWindow() {
  var me = this;

  (me.window = null),
    (me.container = null),
    (me.contentContainer = null),
    (me.blockingLoader = null);
  var _options = null,
    _price = null,
    _pointsRemaining = null,
    _pointsRemainingRounded = null,
    _buyItem = null;

  (me.init = function (options) {
    var _Mathceil = Math.ceil,
      _Mathabs = Math.abs;
    if (
      ((_options = options),
      (_price = "0.99"),
      (_pointsRemaining = _Mathabs(options.itemPoints - options.myScore)),
      2e4 >= _pointsRemaining)
    ) {
      var packsNeeded = _Mathceil(_pointsRemaining / 400);
      (_pointsRemainingRounded = 400 * packsNeeded),
        (_buyItem =
          "com.hexicallabs.devrant.points." + _pointsRemainingRounded),
        (_price = packsNeeded - 1 + ".99");
    } else {
      var packsNeeded = _Mathceil(_pointsRemaining / 1e4);
      (_pointsRemainingRounded = 1e4 * packsNeeded),
        (_buyItem =
          "com.hexicallabs.devrant.points." + _pointsRemainingRounded),
        (_price = 30 + 10 * packsNeeded - 0.01),
        99.99 < _price && (_price = 99.99);
    }

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
        me.window.addEventListener("close", windowClosed),
        (me.container = Ti.UI.createView({
          width: "100%",
          height: "100%",
        })),
        me.window.add(me.container),
        createSubSections();

      var BlockingLoader = require("ui/common/BlockingLoader");

      (me.blockingLoader = new BlockingLoader()),
        me.container.add(me.blockingLoader.getElem());
    });
  var createSubSections = function () {
      var _StringformatDecimal = String.formatDecimal;
      createTopBar(),
        (me.contentContainer = Ti.UI.createView({
          width: "90%",
          height: Ti.UI.SIZE,
          layout: "vertical",
        }));
      var useImageWidth = 500 > Ti.App.realWidth ? 260 : 420,
        itemContainer = Ti.UI.createView({
          width: Ti.UI.SIZE,
          height: useImageWidth + 10,
        }),
        imageContainer = Ti.UI.createImageView({
          top: 0,
          width: useImageWidth,
          height: useImageWidth,
          borderRadius: 0.5 * useImageWidth,
          preventDefaultImage: true,
          backgroundColor: "#" + _options.itemBg,
          image: Ti.App.avatarImageUrl + _options.itemImage,
          borderWidth: 6,
          borderColor: Ti.App.colorOrange,
        });
      itemContainer.add(imageContainer);
      var pointsContainer = Ti.UI.createView({
          bottom: 0,
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          backgroundColor: Ti.App.colorOrange,
          borderRadius: 8,
          borderWidth: 0,
        }),
        lblPoints = Ti.UI.createLabel({
          top: 2,
          bottom: 2,
          left: 10,
          right: 8,
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          text: _StringformatDecimal(_options.itemPoints) + "++",
          color: "#fff",
          font: {
            fontSize: Ti.App.fontBtn,
            fontWeight: "bold",
          },
        });

      pointsContainer.add(lblPoints),
        itemContainer.add(pointsContainer),
        me.contentContainer.add(itemContainer);

      var lblTitle = Ti.UI.createLabel({
        top: 8,
        text: "Item Locked",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        height: Ti.UI.SIZE,
        width: "100%",
        color: "#fff",
        font: {
          fontSize: Ti.App.fontXL,
          fontFamily: Ti.App.useFont,
        },
      });

      me.contentContainer.add(lblTitle);

      var lblDescription = Ti.UI.createLabel({
        top: 3,
        text:
          "You need " +
          _StringformatDecimal(_pointsRemaining) +
          " more ++'s to unlock this item. Don't want to wait? Get it now for $" +
          _price,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        height: Ti.UI.SIZE,
        width: "100%",
        color: Ti.App.colorLightGrey,
        font: {
          fontSize: Ti.App.fontM,
        },
      });

      me.contentContainer.add(lblDescription);

      var ctaBtn = Ti.App.createBigRoundedButton("Buy Now", "orange");
      ctaBtn.addEventListener("click", doItemPurchase),
        (ctaBtn.top = 22),
        me.contentContainer.add(ctaBtn);
      var termsText = "By buying you agree to the Terms of Service",
        lblTerms = Ti.UI.createLabel({
          width: "100%",
          height: Ti.UI.SIZE,
          top: 12,
          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
          attributedString: Ti.UI.createAttributedString({
            text: "By buying you agree to the Terms of Service",
            attributes: [
              {
                type: Ti.UI.ATTRIBUTE_FONT,
                value: { fontSize: Ti.App.fontS },
                range: [0, 43],
              },

              {
                type: Ti.UI.ATTRIBUTE_UNDERLINES_STYLE,
                value: Ti.UI.ATTRIBUTE_UNDERLINE_STYLE_SINGLE,
                range: [27, 16],
              },

              {
                type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
                value: Ti.App.colorLightGrey,
                range: [0, 43],
              },
            ],
          }),
        });

      lblTerms.addEventListener("click", function () {
        Ti.Platform.openURL("https://devrant.com/avatar-item-tos");
      }),
        me.contentContainer.add(lblTerms),
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
    },
    doItemPurchase = function () {
      me.blockingLoader.showLoader();
      var params = {
          item_id: _buyItem,
          part_id: _options.itemPartId,
        },
        apiArgs = {
          method: "POST",
          endpoint: "devrant/avatars/buy-intent",
          params: params,
          callback: buyIntentComplete,
          includeAuth: true,
        };

      Ti.App.api(apiArgs);
    },
    buyIntentComplete = function (result) {
      if (true != result.success)
        return (
          me.blockingLoader.hideLoader(),
          void (result.error
            ? Ti.App.showDialog("Whoops!", result.error)
            : Ti.App.showDialog(
                "Whoops!",
                "There was an error communicating with the devRant server during the purchase. Please try again."
              ))
        );

      if (!Ti.App.inAppPurchases) {
        var InAppPurchases = require("ui/common/InAppPurchases");
        Ti.App.inAppPurchases = new InAppPurchases();
      }

      Ti.App.inAppPurchases.purchaseItem({
        product: _buyItem,
        successHandler: purchaseSuccess,
        errorHandler: purchaseError,
      });
    },
    purchaseSuccess = function (receipt) {
      var params = {
          item_id: _buyItem,
          part_id: _options.itemPartId,
          platform: Ti.App.isAndroid ? "android" : "ios",
          receipt: receipt,
        },
        apiArgs = {
          method: "POST",
          endpoint: "devrant/avatars/buy-item",
          params: params,
          callback: buyItemComplete,
          includeAuth: true,
        };

      Ti.App.api(apiArgs);
    },
    purchaseError = function () {
      me.blockingLoader.hideLoader();
    },
    buyItemComplete = function (result) {
      if (
        (result &&
          result.receipt &&
          Ti.App.inAppPurchases.deleteReceipt(_buyItem),
        !result || !result.success)
      )
        me.blockingLoader.hideLoader(),
          Ti.App.showDialog(
            "Whoops!",
            "Sorry, something went wrong while purchasing the avatar item :/ Please try again, and if the problem persists, please contact info@devrant.io for help."
          );
      else {
        unlockItem(), me.blockingLoader.hideLoader();
        var dialog = Ti.UI.createAlertDialog({
          message:
            "Your brand new, shiny avatar item has been unlocked! Just select it to use it!",
          ok: "Got it",
          title: "Success!",
        });

        dialog.addEventListener("click", function () {
          me.closeWindow();
        }),
          dialog.show();
      }
    },
    unlockItem = function () {
      (_options.img.imageLocked = false),
        (_options.img.pointsContainer.visible = false);
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
        null == animated && (animated = true),
        noClose || me.window.close({ animated: animated }),
        (me = null);
    }),
    me
  );
}

module.exports = AvatarItemLockedWindow;
