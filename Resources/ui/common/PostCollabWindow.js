function PostCollabWindow() {
  var blockingLoader,
    contentContainer,
    storekit,
    me = this,
    inputControls = {},
    androidListenersCreated = false,
    androidSetupCallbackSuccess = false,
    androidKey =
      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlWdyyv+RO2xvEclvqjzc0GkuF7iOxlx8CQMuBbfyjifLI9qMa9NoA0LozvPhW5fTeTCzQa9kw5x626c2ERfaOeK0iWjHpnSUjAXnzVv3DfwY8CLIeGqInb8CTsC006Ctfn42OnEtDTCrzP/g0UXL/Z5DMCdN4/JGFY5a2QxbDlTJG7vgpM20d4SpJeDR+53mmtpGbQ00YBdKt0hwg8nzxLqVTJzSx0N12yH4CsnoNm+uUTI3r/uLF3yrDMvh3LE4hSENhGLYM9Lwgp9vXl8Z5yks+kUMcWqpbMIsL+mZPTJbCpf1MuJa6J+x3HVrK/XnHtbXCP86/at5SeD6AydFpQIDAQAB";
  me.options = null;
  var COLLAB_SAVE_NAME = "saved_collab",
    SAVED_RECEIPTS_NAME = "saved_receips",
    FIELDS = [
      {
        id: "project_type",
        res: "c_type",
        required: true,
        requiredError: "You must select a project type",
        type: "select",
        placeholder: "Project Type",
        icon: "\uE804",
        iconSize: "",
        options: [
          {
            id: 1,
            label: "Open source idea",
          },

          {
            id: 2,
            label: "Existing open source project",
          },

          {
            id: 3,
            label: "Project idea",
          },

          {
            id: 4,
            label: "Existing project",
          },
        ],
      },

      {
        id: "summary",
        res: "text",
        required: true,
        requiredError: "You must provide a summary of your project",
        lengthError:
          "Your project summary can't be longer than 250 characters.",
        type: "textarea",
        placeholder: "Summary",
        panelText: "Type & Summary show on Collabs list",
        icon: "\uE920",
        maxLen: 250,
      },

      {
        id: "description",
        res: "c_description",
        lengthError:
          "Your project description can't be longer than 10,000 characters.'",
        type: "textarea",
        placeholder: "Description",
        icon: "\uE810",
        maxLen: 1e4,
      },

      {
        id: "tech_stack",
        res: "c_tech_stack",
        type: "textfield",
        placeholder: "Tech Stack",
        icon: "\uE809",
        maxLen: 1e3,
      },

      {
        id: "team_size",
        res: "c_team_size",
        type: "textfield",
        placeholder: "Current Team Size",
        icon: "\uE91E",
        maxLen: 1e3,
      },

      {
        id: "project_url",
        res: "c_url",
        type: "textfield",
        placeholder: "Project URL",
        icon: "\uE91C",
        maxLen: 2500,
        noAutoCorrect: true,
      },
    ];

  (me.window = null),
    (me.init = function (options) {
      (me.options = options || {}),
        createElements(),
        me.options.rantId && fetchCollabData(),
        me.window.open({
          modal: !Ti.App.isAndroid,
        }),
        Ti.App.logStat("Collab Post View", {
          has_free: me.options.has_free ? 1 : 0,
        });
    });
  var fetchCollabData = function () {
      blockingLoader.showLoader();
      var params = {
          links: 0,
        },
        apiArgs = {
          method: "GET",
          endpoint: "devrant/rants/" + me.options.rantId,
          params: params,
          callback: getEditInfoComplete,
          includeAuth: true,
        };

      Ti.App.api(apiArgs);
    },
    getEditInfoComplete = function (result) {
      if (result && result.rant && 2 == result.rant.rt) {
        for (var i = 0; i < FIELDS.length; ++i) {
          fieldInfo = FIELDS[i];
          var savedValue = result.rant[fieldInfo.res];

          switch (fieldInfo.type) {
            case "select":
              null != savedValue &&
                ((inputControls[fieldInfo.id].input.value =
                  fieldInfo.options[parseInt(savedValue) - 1].label),
                (inputControls[fieldInfo.id].value = savedValue + ""));

              break;
            case "textfield":
              null != savedValue &&
                (inputControls[fieldInfo.id].value = savedValue + "");

              break;
            case "textarea":
              null != savedValue &&
                ((inputControls[fieldInfo.id].value = savedValue + ""),
                inputControls[fieldInfo.id].fireEvent("change", {
                  value: savedValue,
                }));
          }
        }
        blockingLoader.hideLoader();
      }
    },
    createElements = function () {
      (me.window = Ti.UI.createWindow({
        navBarHidden: true,
        backgroundColor: Ti.App.colorModalBg,
        orientationModes: [Ti.UI.PORTRAIT],
      })),
        me.window.addEventListener("close", windowClosed);

      var btnClose = Ti.UI.createLabel({
        top: 10,
        left: 0,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        width: 54,
        height: 50,
        color: "#fff",
        text: "\uE803",
        zIndex: 2,
        font: {
          fontSize: "32sp",
          fontFamily: "icomoon",
        },
      });

      me.window.add(btnClose),
        btnClose.addEventListener("click", function () {
          me.closeWindow();
        });

      var BlockingLoader = require("ui/common/BlockingLoader");

      blockingLoader = new BlockingLoader();
      var blockingLoaderElem = blockingLoader.getElem();
      (blockingLoaderElem.zIndex = 10),
        me.window.add(blockingLoaderElem),
        (contentContainer = Ti.UI.createScrollView({
          width: "90%",
          height: "100%",
          scrollType: "vertical",
          layout: "vertical",
        }));

      var lblTitle = Ti.UI.createLabel({
        top: Ti.App.navStatusBarHeight - 5,
        width: "100%",
        height: Ti.UI.SIZE,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        color: "#fff",
        font: {
          fontSize: Ti.App.fontXL,
          fontFamily: Ti.App.useFont,
        },

        text: "Collab Listing",
      });

      contentContainer.add(lblTitle);

      var lblSubtitle = Ti.UI.createLabel({
        width: "100%",
        height: Ti.UI.SIZE,
        bottom: 8,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        color: Ti.App.colorSubtitle,
        font: {
          fontSize: Ti.App.fontM,
        },

        text: "Tell us about your project",
      });

      contentContainer.add(lblSubtitle),
        me.window.add(contentContainer),
        createFields();

      var btnAddListing = Ti.App.createBigRoundedButton(
        (me.options.rantId ? "Edit" : "Add") + " Listing",
        "red"
      );
      (btnAddListing.top = 16),
        (btnAddListing.bottom = 16),
        btnAddListing.addEventListener("click", doCreateCollab),
        contentContainer.add(btnAddListing);
    },
    doCreateCollab = function () {
      blockingLoader.showLoader(), saveCollabDataLocally();

      for (var fieldInfo, i = 0; i < FIELDS.length; ++i) {
        fieldInfo = FIELDS[i];
        var fieldId = fieldInfo.id,
          fieldVal = inputControls[fieldId].value;

        if (null != fieldInfo.maxLen && fieldVal.length > fieldInfo.maxLen)
          return (
            Ti.App.showDialog("Whoops!", fieldInfo.lengthError),
            void blockingLoader.hideLoader()
          );

        if (
          ((fieldVal = fieldVal.trim()), fieldInfo.required && "" == fieldVal)
        )
          return (
            Ti.App.showDialog("Whoops!", fieldInfo.requiredError),
            void blockingLoader.hideLoader()
          );
      }

      getPurchaseReceiptAndContinue();
    },
    getPurchaseReceiptAndContinue = function () {
      var savedReceipts = Ti.App.Properties.getList(SAVED_RECEIPTS_NAME, []);

      if (savedReceipts.length || me.options.has_free || me.options.rantId)
        return void gotPurchaseReceipt();

      if (!Ti.App.isAndroid)
        (storekit = require("ti.storekit")),
          (storekit.receiptVerificationSandbox = false),
          (storekit.bundleVersion = "1.7"),
          (storekit.bundleIdentifier = "com.hexicallabs.devrant"),
          storekit.addEventListener(
            "transactionState",
            transactionStateChanged
          ),
          storekit.addTransactionObserver(),
          storekit.requestProducts(
            ["com.hexicallabs.devrant.collab.1"],
            function (evt) {
              return !evt.success || evt.invalid
                ? (Ti.App.showDialog(
                    "Whoops!",
                    "There was a problem trying to reach the App Store. Please try again."
                  ),
                  void blockingLoader.hideLoader())
                : void storekit.purchase({ product: evt.products[0] });
            }
          );
      else {
        var didSetup = false;
        null == Ti.App.inAppBilling &&
          ((didSetup = true),
          (Ti.App.inAppBilling = require("ti.inappbilling"))),
          androidListenersCreated ||
            ((androidListenersCreated = true),
            Ti.App.inAppBilling.addEventListener(
              "setupcomplete",
              androidBillingSetupComplete
            ),
            Ti.App.inAppBilling.addEventListener(
              "purchasecomplete",
              androidBillingPurchaseComplete
            ),
            Ti.App.inAppBilling.addEventListener(
              "consumecomplete",
              androidBillingConsumeComplete
            ),
            Ti.App.inAppBilling.addEventListener(
              "queryinventorycomplete",
              androidBillingInventoryComplete
            )),
          androidSetupCallbackSuccess
            ? androidBillingSetupComplete({ success: true })
            : Ti.App.inAppBilling.startSetup({ publicKey: androidKey });
      }
    },
    androidBillingSetupComplete = function (e) {
      return e.success
        ? void ((androidSetupCallbackSuccess = true),
          Ti.App.inAppBilling.purchase({
            productId: "collab1",
            type: Ti.App.inAppBilling.ITEM_TYPE_INAPP,
          }))
        : (Ti.App.showDialog(
            "Whoops!",
            "There was a problem trying to reach the Play Store. Please try again."
          ),
          void blockingLoader.hideLoader());
    },
    androidBillingPurchaseComplete = function (e) {
      return e.success
        ? void (Ti.App.inAppBilling.consume({
            purchases: [e.purchase],
          }),
          saveReceipt(e.purchase.token),
          gotPurchaseReceipt())
        : (7 == e.responseCode &&
            Ti.App.inAppBilling.queryInventory({ moreItems: ["collab1"] }),
          Ti.App.showDialog(
            "Whoops!",
            "There was a problem trying to reach the Play Store. Please try again."
          ),
          void blockingLoader.hideLoader());
    },
    androidBillingConsumeComplete = function (e) {
      console.log("consumed", e);
    },
    androidBillingInventoryComplete = function (e) {
      e.success &&
        e.inventory &&
        e.inventory.hasPurchase("collab1") &&
        Ti.App.inAppBilling.consume({
          purchases: [e.inventory.getPurchase("collab1")],
        });
    },
    transactionStateChanged = function (evt) {
      switch ((console.log("state changed", evt), evt.state)) {
        case storekit.TRANSACTION_STATE_FAILED:
          evt.transaction && evt.transaction.finish(),
            Ti.App.showDialog(
              "Whoops!",
              "It looks like the collab purchase didn't go through. Please try again."
            ),
            blockingLoader.hideLoader();
          break;
        case storekit.TRANSACTION_STATE_PURCHASED:
          evt.transaction && evt.transaction.finish(),
            saveReceipt(Ti.Utils.base64encode(storekit.receipt)),
            gotPurchaseReceipt();
      }
    },
    gotPurchaseReceipt = function () {
      var allReceipts = Ti.App.Properties.getList(SAVED_RECEIPTS_NAME, []),
        useReceipt = "";

      allReceipts.length &&
        !me.options.has_free &&
        (useReceipt = allReceipts[0]);

      for (
        var fieldInfo,
          params = {
            receipt: useReceipt,
            platform: Ti.App.isAndroid ? "android" : "ios",
          },
          i = 0;
        i < FIELDS.length;
        ++i
      ) {
        fieldInfo = FIELDS[i];
        var fieldId = fieldInfo.id,
          fieldVal = inputControls[fieldId].value.trim();

        params[fieldId] = fieldVal;
      }

      var apiArgs = {
        method: "POST",
        endpoint: me.options.rantId
          ? "devrant/rants/" + me.options.rantId
          : "devrant/collabs",
        params: params,
        callback: me.options.rantId ? editCollabResponse : postCollabResponse,
        includeAuth: true,
      };

      console.log("api args are", apiArgs), Ti.App.api(apiArgs);
    },
    editCollabResponse = function (result) {
      if (result.success) {
        var topRant = Ti.App.tabBar.getTopWindowOfType("rant");

        null != topRant && topRant.obj.closeWindow(),
          Ti.App.openRantWindow(me.options.rantId, false, 2),
          me.closeWindow(),
          console.log("GOOD");
      }
    },
    postCollabResponse = function (result) {
      return result.success
        ? void (result.receipt && deleteReceipt(result.receipt),
          Ti.App.Properties.removeProperty("saved_collab"),
          Ti.App.tabBar.refreshCollabs(),
          Ti.App.tabBar.refreshMainFeed(),
          Ti.App.openRantWindow(result.rant_id, false, 2),
          me.closeWindow(false, true))
        : true === result.receipt_invalid && result.receipt
        ? (deleteReceipt(result.receipt), void getPurchaseReceiptAndContinue())
        : (false !== result.confirmed &&
            Ti.App.showDialog(
              "Whoops!",
              "There was a problem creating your collab. Please try again."
            ),
          void blockingLoader.hideLoader());
    },
    deleteReceipt = function (receipt) {
      var currentReceipts = Ti.App.Properties.getList(SAVED_RECEIPTS_NAME, []),
        loc = currentReceipts.indexOf(receipt);

      -1 == loc ||
        (currentReceipts.splice(loc, 1),
        Ti.App.Properties.setList(SAVED_RECEIPTS_NAME, currentReceipts));
    },
    saveReceipt = function (receipt) {
      var currentReceipts = Ti.App.Properties.getList(SAVED_RECEIPTS_NAME, []);

      currentReceipts.push("" + receipt + ""),
        Ti.App.Properties.setList(SAVED_RECEIPTS_NAME, currentReceipts);
    },
    saveCollabDataLocally = function () {
      if (!me.options.rantId) {
        for (
          var fieldInfo, dataToSave = {}, fieldExists = false, i = 0;
          i < FIELDS.length;
          ++i
        ) {
          fieldInfo = FIELDS[i];
          var fieldId = fieldInfo.id,
            fieldVal = inputControls[fieldId].value.trim();

          "" != fieldVal &&
            ((fieldExists = true), (dataToSave[fieldId] = fieldVal));
        }

        fieldExists
          ? Ti.App.Properties.setObject("saved_collab", dataToSave)
          : Ti.App.Properties.removeProperty("saved_collab");
      }
    },
    createFields = function () {
      var fieldInfo,
        savedData = me.options.rantId
          ? {}
          : Ti.App.Properties.getObject("saved_collab", {});
      console.log("saved data is", savedData);

      for (var i = 0; i < FIELDS.length; ++i) {
        fieldInfo = FIELDS[i];
        var savedValue = savedData[fieldInfo.id];

        switch (fieldInfo.type) {
          case "select":
            var input = Ti.App.createBigInputField(
              fieldInfo.icon,
              fieldInfo.placeholder,
              false,
              void 0,
              false
            );
            createSelectorFromInput(fieldInfo.id, input, fieldInfo.options),
              (input.top = 7),
              contentContainer.add(input),
              (inputControls[fieldInfo.id] = { value: "", input: input.input }),
              null != savedValue &&
                (console.log("SET IN SELECT"),
                (input.input.value =
                  fieldInfo.options[parseInt(savedValue) - 1].label),
                (inputControls[fieldInfo.id].value = savedValue));

            break;
          case "textfield":
            var input = Ti.App.createBigInputField(
              fieldInfo.icon,
              fieldInfo.placeholder
            );
            (input.top = 7),
              (input.input.maxLength = fieldInfo.maxLen),
              fieldInfo.noAutoCorrect &&
                ((input.input.autocapitalization =
                  Ti.UI.TEXT_AUTOCAPITALIZATION_NONE),
                (input.input.autocorrect = false),
                (input.input.keyboardType = Ti.UI.KEYBOARD_TYPE_URL)),
              contentContainer.add(input),
              (inputControls[fieldInfo.id] = input.input),
              null != savedValue && (input.input.value = savedValue);

            break;
          case "textarea":
            var PostTextArea = require("ui/common/PostTextArea"),
              textArea = new PostTextArea();
            (textArea.top = 7),
              textArea.init(fieldInfo.placeholder, false, "collab", {
                height: fieldInfo.panelText ? 130 : 185,
                icon: fieldInfo.icon,
                maxLen: fieldInfo.maxLen,
                whiteBottom: null == fieldInfo.panelText,
                panelText: fieldInfo.panelText,
              });

            var postTextAreaElem = textArea.getElem();
            (inputControls[fieldInfo.id] = textArea.input),
              null != savedValue &&
                ((textArea.input.value = savedValue),
                textArea.input.fireEvent("change", {
                  value: savedValue,
                })),
              contentContainer.add(postTextAreaElem);
        }
      }
    },
    createSelectorFromInput = function (id, input, options) {
      (input.input.editable = false),
        input.addEventListener("click", function () {
          for (var items = [], i = 0; i < options.length; ++i)
            items.push(options[i].label);

          var opts = {
            options: items,
          };

          Ti.App.isAndroid ||
            (items.push("Cancel"), (opts.cancel = items.length - 1));

          var dialog = Ti.UI.createOptionDialog(opts);
          dialog.addEventListener("click", function (e) {
            var itemIndex = e.index;
            console.log("item index is", itemIndex, e),
              itemIndex >= options.length ||
                0 > itemIndex ||
                ((input.input.value = items[itemIndex]),
                (inputControls[id] = { value: itemIndex + 1 + "" }),
                console.log("e is", e));
          }),
            dialog.show();
        });
    },
    windowClosed = function () {
      me.closeWindow(true);
    };

  return (
    (me.closeWindow = function (noClose, noSave) {
      null == me ||
        (me.window.removeEventListener("close", windowClosed),
        !noSave && saveCollabDataLocally(),
        (noClose = noClose || false),
        storekit &&
          (storekit.removeTransactionObserver(),
          storekit.removeEventListener(
            "transactionState",
            transactionStateChanged
          ),
          (storekit = null)),
        Ti.App.inAppBilling &&
          (Ti.App.inAppBilling.removeEventListener(
            "setupcomplete",
            androidBillingSetupComplete
          ),
          Ti.App.inAppBilling.removeEventListener(
            "purchasecomplete",
            androidBillingPurchaseComplete
          ),
          Ti.App.inAppBilling.removeEventListener(
            "consumecomplete",
            androidBillingConsumeComplete
          ),
          Ti.App.inAppBilling.removeEventListener(
            "queryinventorycomplete",
            androidBillingInventoryComplete
          )),
        !noClose && me.window.close({ animated: true }));
    }),
    me
  );
}

module.exports = PostCollabWindow;
