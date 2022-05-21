function InAppPurchase() {
  var _storekit,
    _options,
    me = this,
    _androidListenersCreated = false,
    _androidKey =
      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlWdyyv+RO2xvEclvqjzc0GkuF7iOxlx8CQMuBbfyjifLI9qMa9NoA0LozvPhW5fTeTCzQa9kw5x626c2ERfaOeK0iWjHpnSUjAXnzVv3DfwY8CLIeGqInb8CTsC006Ctfn42OnEtDTCrzP/g0UXL/Z5DMCdN4/JGFY5a2QxbDlTJG7vgpM20d4SpJeDR+53mmtpGbQ00YBdKt0hwg8nzxLqVTJzSx0N12yH4CsnoNm+uUTI3r/uLF3yrDMvh3LE4hSENhGLYM9Lwgp9vXl8Z5yks+kUMcWqpbMIsL+mZPTJbCpf1MuJa6J+x3HVrK/XnHtbXCP86/at5SeD6AydFpQIDAQAB";

  me.purchaseItem = function (options) {
    (_options = options), _getPurchaseReceiptAndContinue();
  };
  var _getPurchaseReceiptAndContinue = function () {
      var savedReceipt = Ti.App.Properties.getString(_options.product, null);
      return savedReceipt &&
        "com.hexicallabs.devrant.pp.1monthsub" != _options.product
        ? (_destroyStoreStuff(), void _options.successHandler(savedReceipt))
        : void (Ti.App.isAndroid
            ? (null == Ti.App.inAppBilling &&
                (Ti.App.inAppBilling = require("ti.inappbilling")),
              Ti.App.inAppBilling.addEventListener(
                "setupcomplete",
                _androidBillingSetupComplete
              ),
              Ti.App.inAppBilling.addEventListener(
                "purchasecomplete",
                _androidBillingPurchaseComplete
              ),
              Ti.App.inAppBilling.addEventListener(
                "consumecomplete",
                _androidBillingConsumeComplete
              ),
              Ti.App.inAppBilling.addEventListener(
                "queryinventorycomplete",
                _androidBillingInventoryComplete
              ),
              Ti.App.androidSetupCallbackSuccess
                ? _androidBillingSetupComplete({ success: true })
                : Ti.App.inAppBilling.startSetup({ publicKey: _androidKey }))
            : ((_storekit = require("ti.storekit")),
              (_storekit.receiptVerificationSandbox = false),
              (_storekit.bundleVersion = "1.7"),
              (_storekit.bundleIdentifier = "com.hexicallabs.devrant"),
              _storekit.addEventListener(
                "transactionState",
                _transactionStateChanged
              ),
              _storekit.addTransactionObserver(),
              _storekit.requestProducts([_options.product], function (evt) {
                return !evt.success || evt.invalid
                  ? (_destroyStoreStuff(),
                    _options.errorHandler(),
                    void Ti.App.showDialog(
                      "Whoops!",
                      "There was a problem trying to reach the App Store. Please try again. (Error requesting product)"
                    ))
                  : void _storekit.purchase({ product: evt.products[0] });
              })));
    },
    _transactionStateChanged = function (evt) {
      switch (evt.state) {
        case _storekit.TRANSACTION_STATE_FAILED:
          evt.transaction && evt.transaction.finish(),
            _destroyStoreStuff(),
            _options.errorHandler(),
            Ti.App.showDialog(
              "Whoops!",
              "It looks like the purchase didn't go through. Please try again."
            );
          break;
        case _storekit.TRANSACTION_STATE_PURCHASED:
          evt.transaction && evt.transaction.finish();
          var receipt = "" + Ti.Utils.base64encode(_storekit.receipt) + "";
          _destroyStoreStuff(),
            _saveReceipt(receipt),
            _options.successHandler(receipt);
      }
    },
    _saveReceipt = function (receipt) {
      Ti.App.Properties.setString(_options.product, "" + receipt + "");
    },
    _androidBillingSetupComplete = function (e) {
      return e.success
        ? void ((Ti.App.androidSetupCallbackSuccess = true),
          Ti.App.inAppBilling.purchase({
            productId: _options.product,
            type:
              "com.hexicallabs.devrant.pp.1monthsub" == _options.product
                ? Ti.App.inAppBilling.ITEM_TYPE_SUBSCRIPTION
                : Ti.App.inAppBilling.ITEM_TYPE_INAPP,
          }))
        : (_destroyStoreStuff(),
          _options.errorHandler(),
          void Ti.App.showDialog(
            "Whoops!",
            "There was a problem trying to reach the Play Store. Please try again. (Error in billing setup)"
          ));
    },
    _androidBillingPurchaseComplete = function (e) {
      return e.success
        ? void (_destroyStoreStuff(),
          "com.hexicallabs.devrant.pp.1monthsub" != _options.product &&
            Ti.App.inAppBilling.consume({
              purchases: [e.purchase],
            }),
          _saveReceipt(e.purchase.token),
          _options.successHandler("" + e.purchase.token + ""))
        : (Ti.App.logStat("Android billing failure", {
            rc: e.responseCode,
            s: e.success,
            v: 2,
          }),
          7 == e.responseCode)
        ? void Ti.App.inAppBilling.queryInventory({
            moreItems: [_options.product],
            queryDetails: true,
          })
        : (_destroyStoreStuff(),
          _options.errorHandler(),
          void Ti.App.showDialog(
            "Whoops!",
            "There was a problem trying to reach the Play Store. Please try again. (Error in billing complete)"
          ));
    },
    _androidBillingConsumeComplete = function (e) {},
    _androidBillingInventoryComplete = function (e) {
      if (
        e.success &&
        e.inventory &&
        e.inventory.hasPurchase(_options.product)
      ) {
        var purchase = e.inventory.getPurchase(_options.product);

        "com.hexicallabs.devrant.pp.1monthsub" == _options.product
          ? (_destroyStoreStuff(),
            _saveReceipt(purchase.token),
            _options.successHandler("" + purchase.token + ""))
          : Ti.App.inAppBilling.consume({
              purchases: [purchase],
            });
      }
    };

  me.deleteReceipt = function (product) {
    Ti.App.Properties.removeProperty(product);
  };

  var _destroyStoreStuff = function () {
    Ti.App.isAndroid
      ? Ti.App.inAppBilling &&
        (Ti.App.inAppBilling.removeEventListener(
          "setupcomplete",
          _androidBillingSetupComplete
        ),
        Ti.App.inAppBilling.removeEventListener(
          "purchasecomplete",
          _androidBillingPurchaseComplete
        ),
        Ti.App.inAppBilling.removeEventListener(
          "consumecomplete",
          _androidBillingConsumeComplete
        ),
        Ti.App.inAppBilling.removeEventListener(
          "queryinventorycomplete",
          _androidBillingInventoryComplete
        ))
      : _storekit &&
        (_storekit.removeTransactionObserver(),
        _storekit.removeEventListener(
          "transactionState",
          _transactionStateChanged
        ),
        (_storekit = null));
  };

  return me;
}

module.exports = InAppPurchase;
