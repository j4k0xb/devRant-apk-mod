function AccountDetailsWindow() {
  var me = this;

  (me.window = null),
    (me.container = null),
    (me.contentContainer = null),
    (me.blockingLoader = null),
    (me.inputEmail = null),
    (me.inputPassword = null),
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
        me.window.addEventListener("close", windowClosed),
        (me.container = Ti.UI.createView({
          width: "100%",
          height: "100%",
        })),
        me.window.add(me.container),
        createSubSections();

      var BlockingLoader = require("ui/common/BlockingLoader");

      (me.blockingLoader = new BlockingLoader()),
        me.container.add(me.blockingLoader.getElem()),
        fetchData();
    });
  var createSubSections = function () {
      createTopBar(),
        (me.contentContainer = Ti.UI.createView({
          top: Ti.App.topBarGenerator.topBarHeight,
          width: "90%",
          height: Ti.UI.FILL,
          layout: "vertical",
        })),
        me.container.add(me.contentContainer);
    },
    createTopBar = function () {
      var topBarOptions = {
          leftBtnType: "close",
          rightBtnType: "none",
          barTitle: "Account Info",
          callbackLeftBtn: function () {
            me.closeWindow();
          },
        },
        topBar = Ti.App.topBarGenerator.createBar(topBarOptions);
      me.container.add(topBar);
    },
    fetchData = function () {
      var apiArgs = {
        method: "GET",
        endpoint: "users/me/account-details",

        callback: getAccountDetailsComplete,
        includeAuth: true,
      };

      Ti.App.api(apiArgs);
    },
    getAccountDetailsComplete = function (result) {
      null == me ||
        (result.success
          ? buildOptionsFromResult(result)
          : Ti.App.showDialog(
              "Whoops!",
              "We had trouble loading your account settings. Please close this window and try again!"
            ));
    },
    buildOptionsFromResult = function (result) {
      if (result && result.details) {
        var lblwarning = Ti.UI.createLabel({
          top: 14,
          text: "IMPORTANT: Your username may only be changed once every 6 months, and your old username will become available for others to register right away. If you change your email address, you will need to confirm your new email.",
          textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
          color: Ti.App.colorHint,
          font: {
            fontSize: Ti.App.fontS,
            fontWeight: "bold",
          },
        });

        (me.inputUsername = Ti.App.createBigInputField(
          "\uE808",
          "Username",
          false,
          500
        )),
          (me.inputUsername.top = 12),
          (me.inputUsername.input.value = result.details.username),
          (me.inputUsername.input.autocapitalization =
            Ti.UI.TEXT_AUTOCAPITALIZATION_NONE),
          (me.inputUsername.input.autocorrect = false),
          me.contentContainer.add(me.inputUsername),
          (me.inputEmail = Ti.App.createBigInputField(
            "\uE813",
            "Email",
            false,
            500
          )),
          (me.inputEmail.top = 7),
          (me.inputEmail.input.value = result.details.email),
          (me.inputEmail.input.autocapitalization =
            Ti.UI.TEXT_AUTOCAPITALIZATION_NONE),
          (me.inputEmail.input.keyboardType = Ti.UI.KEYBOARD_TYPE_EMAIL),
          (me.inputEmail.input.autocorrect = false),
          me.contentContainer.add(me.inputEmail);

        var cta = Ti.App.createBigRoundedButton("Save Changes", "red");
        (cta.top = 14),
          cta.addEventListener("click", doEdit),
          me.contentContainer.add(cta),
          me.contentContainer.add(lblwarning);
      }
    },
    doEdit = function () {
      me.blockingLoader.showLoader();
      var emailVal = me.inputEmail.input.value,
        usernameVal = me.inputUsername.input.value;

      params = {
        username: usernameVal,
        email: emailVal,
      };

      var apiArgs = {
        method: "POST",
        endpoint: "users/me/account-details",
        params: params,
        includeAuth: true,
        callback: editComplete,
      };

      Ti.App.api(apiArgs);
    },
    editComplete = function (result) {
      me.blockingLoader.hideLoader();
      var useMessage;

      result.success
        ? ((useMessage =
            "Your account details have been successfully changed!"),
          !result.email_changed ||
            (useMessage +=
              " You will need to verify your new email address (we've sent a confirmation email) in order to continue posting and voting with your account."),
          Ti.App.showDialog("Success!", useMessage))
        : ((useMessage = result.error
            ? result.error
            : "There was an error updating your account details. Please try again. If you continue to have issues, please email info@devrant.io and we will help you!"),
          Ti.App.showDialog("Whoops!", useMessage));
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

module.exports = AccountDetailsWindow;
