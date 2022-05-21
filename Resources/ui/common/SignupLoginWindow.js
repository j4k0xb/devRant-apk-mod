function SignupLoginWindow() {
  var me = this,
    signupBottomCopy =
      'By tapping "Sign Up", you agree to the Terms of Service & Privacy Policy. FYI we never show your email to other members.',
    loginBottomCopy = "Forgot password?",
    forgotPasswordBottomCopy = "Try logging in again";

  (me.copies = {
    signup: {
      title: "Join devRant",
      subtitle: "Post your own rants. Vote and comment on others' rants.",
      cta: "Sign Up",
      subdescription:
        'By tapping "Sign Up", you agree to the Terms of Service & Privacy Policy. FYI no other member can ever see your email.',
      leftCta: {
        type: "login",
        label: "Login",
      },

      rightCta: {
        type: "skip",
        label: "Skip",
      },

      bottomTextUnder: {
        text: signupBottomCopy,
        attributes: [
          {
            type: Ti.UI.ATTRIBUTE_FONT,
            value: {
              fontSize: Ti.App.fontS,
            },

            range: [0, 120],
          },

          {
            type: Ti.UI.ATTRIBUTE_LINK,
            value: "https://devrant.com/terms",
            range: [39, 16],
          },

          {
            type: Ti.UI.ATTRIBUTE_LINK,
            value: "https://devrant.com/privacy",
            range: [58, 14],
          },

          {
            type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
            value: Ti.App.colorTextContrast,
            range: [0, 120],
          },

          {
            type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
            value: Ti.App.colorLightGrey,
            range: [39, 16],
          },

          {
            type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
            value: Ti.App.colorLightGrey,
            range: [58, 14],
          },

          {
            type: Ti.UI.ATTRIBUTE_UNDERLINES_STYLE,
            value: Titanium.UI.ATTRIBUTE_UNDERLINE_STYLE_NONE,
            range: [39, 16],
          },

          {
            type: Ti.UI.ATTRIBUTE_UNDERLINES_STYLE,
            value: Ti.UI.ATTRIBUTE_UNDERLINE_STYLE_NONE,
            range: [58, 14],
          },
        ],
      },
    },

    login: {
      title: "Login",
      subtitle: "You know the deal",
      cta: "Login",
      subdescription: "Forgot Password?",
      leftCta: {
        type: "signup",
        label: "Sign Up",
      },

      rightCta: {
        type: "skip",
        label: "Skip",
      },

      bottomTextUnder: {
        text: loginBottomCopy,
        attributes: [
          {
            type: Ti.UI.ATTRIBUTE_FONT,
            value: {
              fontSize: Ti.App.fontS,
            },

            range: [0, 16],
          },

          {
            type: Ti.UI.ATTRIBUTE_LINK,
            value: "forgot_password",
            range: [0, 16],
          },

          {
            type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
            value: Ti.App.colorLightGrey,
            range: [0, 16],
          },

          {
            type: Ti.UI.ATTRIBUTE_UNDERLINES_STYLE,
            value: Ti.UI.ATTRIBUTE_UNDERLINE_STYLE_NONE,
            range: [0, 16],
          },
        ],
      },
    },

    forgot_password: {
      title: "Forgot?",
      subtitle: "It happens to the best of us",
      cta: "Send Reset Email",
      subdescription: "Forgot Password?",
      leftCta: {
        type: "signup",
        label: "Sign Up",
      },

      rightCta: {
        type: "skip",
        label: "Skip",
      },

      bottomTextUnder: {
        text: forgotPasswordBottomCopy,
        attributes: [
          {
            type: Ti.UI.ATTRIBUTE_FONT,
            value: {
              fontSize: Ti.App.fontS,
            },

            range: [0, 20],
          },

          {
            type: Ti.UI.ATTRIBUTE_LINK,
            value: "back_to_login",
            range: [0, 20],
          },

          {
            type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
            value: Ti.App.colorLightGrey,
            range: [0, 20],
          },

          {
            type: Ti.UI.ATTRIBUTE_UNDERLINES_STYLE,
            value: Ti.UI.ATTRIBUTE_UNDERLINE_STYLE_NONE,
            range: [0, 20],
          },
        ],
      },
    },

    profile_details: {
      title: "Profile Details",
      subtitle: "Tell us a little about yourself",
      cta: "Done!",
      subdescription: "Fill out later",
      leftCta: {
        type: "none",
      },

      rightCta: {
        type: "none",
      },
    },
  }),
    (me.window = null),
    (me.type = null),
    (me.fieldEmail = null),
    (me.fieldUsername = null),
    (me.fieldPassword = null),
    (me.fieldAbout = null),
    (me.fieldSkills = null),
    (me.fieldLocation = null),
    (me.fieldWebsite = null),
    (me.fieldGithub = null),
    (me.blockingLoader = null),
    (me.options = null),
    (me.source = null),
    (me.init = function (type, source, options) {
      (me.options = options || {}),
        (me.type = type),
        (me.source = source),
        me.createElements(),
        me.window.open({
          modal: !Ti.App.isAndroid,
        }),
        "signup" == me.type
          ? Ti.App.logStat("Sign Up Viewed", {
              source: source,
            })
          : "forgot_password" == me.type &&
            Ti.App.logStat("Forgot Password Viewed");
    }),
    (me.getWindow = function () {
      return me.window;
    }),
    (me.createElements = function () {
      me.createWindow(),
        me.createContent(),
        me.createBasicControls(),
        "profile_details" == me.type &&
          me.options.loadData &&
          (me.blockingLoader.showLoader(), fetchProfileInfo());
    });
  var fetchProfileInfo = function () {
      params = {};

      var apiArgs = {
        method: "GET",
        endpoint: "users/" + Ti.App.Properties.getString("userId"),
        params: params,
        callback: getProfileComplete,
        includeAuth: true,
      };

      Ti.App.api(apiArgs);
    },
    getProfileComplete = function (result) {
      result.success &&
        (me.fieldAbout.setInputText(result.profile.about),
        me.fieldSkills.setInputText(result.profile.skills),
        (me.fieldWebsite.input.value = result.profile.website),
        (me.fieldGithub.input.value = result.profile.github),
        (me.fieldLocation.input.value = result.profile.location)),
        me.blockingLoader.hideLoader();
    };

  me.createContent = function () {
    var includeBottomSection = "none" != me.copies[me.type].leftCta.type,
      container = Ti.UI.createScrollView({
        width: "100%",
        height: "100%",
      });

    me.window.add(container);

    var topSection = Ti.UI.createView({
      top: Ti.App.navStatusBarHeight,
      bottom: 15,
      width: "100%",
      height: Ti.UI.SIZE,
    });

    container.add(topSection);

    var mainElementContainer = Ti.UI.createView({
      width: "86%",
      height: Ti.UI.SIZE,
      layout: "vertical",
    });

    topSection.add(mainElementContainer);

    var lblTitle = Ti.UI.createLabel({
      width: "100%",
      height: Ti.UI.SIZE,
      textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
      color: "#fff",
      font: {
        fontSize: Ti.App.fontXL,
        fontFamily: Ti.App.useFont,
      },

      text: me.copies[me.type].title,
    });

    mainElementContainer.add(lblTitle);

    var lblSubtitle = Ti.UI.createLabel({
      width: "100%",
      height: Ti.UI.SIZE,
      textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
      color: Ti.App.colorSubtitle,
      font: {
        fontSize: Ti.App.fontM,
      },

      text: me.copies[me.type].subtitle,
    });

    mainElementContainer.add(lblSubtitle),
      me.createFormFields(mainElementContainer);

    var btnMainCta = Ti.App.createBigRoundedButton(
      me.copies[me.type].cta,
      "red"
    );

    if (
      ((btnMainCta.width = "100%"),
      (btnMainCta.top = 14),
      mainElementContainer.add(btnMainCta),
      btnMainCta.addEventListener("click", me.submitForm),
      btnMainCta.addEventListener("touchstart", function () {
        btnMainCta.opacity = "0.7";
      }),
      btnMainCta.addEventListener("touchend", function () {
        var fadeOutBtn = Ti.UI.createAnimation({ opacity: 1, duration: 350 });
        btnMainCta.animate(fadeOutBtn);
      }),
      me.copies[me.type].bottomTextUnder)
    ) {
      var bottomTextContainer = Ti.UI.createView({
        top: 20,
        width: "90%",
        height: Ti.UI.SIZE,
      });

      mainElementContainer.add(bottomTextContainer);

      var bottomTextUnder = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,

        attributedString: Ti.UI.createAttributedString(
          me.copies[me.type].bottomTextUnder
        ),
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
      });

      bottomTextUnder.addEventListener("link", textLinkClicked),
        bottomTextContainer.add(bottomTextUnder);
    }
  };

  var textLinkClicked = function (e) {
    return "forgot_password" == e.url
      ? void Ti.App.openForgotPasswordWindow()
      : "back_to_login" == e.url
      ? void me.closeWindow()
      : void Ti.Platform.openURL(e.url);
  };

  (me.createFormFields = function (container) {
    var fieldSpacing = 7;
    ("signup" == me.type ||
      "login" == me.type ||
      "forgot_password" == me.type) &&
      ((me.fieldEmail = Ti.App.createBigInputField(
        "\uE813",
        "signup" == me.type ? "Email" : "Email or Username"
      )),
      (me.fieldEmail.top = 16),
      (me.fieldEmail.input.returnKeyType =
        "forgot_password" == me.type
          ? Ti.UI.RETURNKEY_GO
          : Ti.UI.RETURNKEY_NEXT),
      (me.fieldEmail.input.autocapitalization =
        Ti.UI.TEXT_AUTOCAPITALIZATION_NONE),
      (me.fieldEmail.input.keyboardType = Ti.UI.KEYBOARD_TYPE_EMAIL),
      (me.fieldEmail.input.autocorrect = false),
      me.fieldEmail.input.addEventListener("return", function () {
        "signup" == me.type
          ? me.fieldUsername.input.focus()
          : "login" == me.type
          ? me.fieldPassword.input.focus()
          : "forgot_password" == me.type && me.submitForm();
      }),
      container.add(me.fieldEmail)),
      "signup" == me.type &&
        ((me.fieldUsername = Ti.App.createBigInputField("\uE808", "Username")),
        (me.fieldUsername.top = 7),
        (me.fieldUsername.input.returnKeyType = Ti.UI.RETURNKEY_NEXT),
        (me.fieldUsername.input.autocapitalization =
          Ti.UI.TEXT_AUTOCAPITALIZATION_NONE),
        (me.fieldUsername.input.autocorrect = false),
        me.fieldUsername.input.addEventListener("return", function () {
          me.fieldPassword.input.focus();
        }),
        container.add(me.fieldUsername)),
      ("signup" == me.type || "login" == me.type) &&
        ((me.fieldPassword = Ti.App.createBigInputField(
          "\uE80B",
          "Password",
          true
        )),
        (me.fieldPassword.top = 7),
        (me.fieldPassword.input.returnKeyType = Ti.UI.RETURNKEY_GO),
        me.fieldPassword.input.addEventListener("return", function () {
          me.submitForm();
        }),
        container.add(me.fieldPassword)),
      "profile_details" == me.type &&
        ((me.fieldAbout = Ti.App.createCounterInputArea(
          100,
          "\uE808",
          "About",
          250
        )),
        (me.fieldAbout.top = 16),
        container.add(me.fieldAbout),
        (me.fieldSkills = Ti.App.createCounterInputArea(
          100,
          "\uE809",
          "Skills (js, xcode, etc.)",
          250
        )),
        (me.fieldSkills.top = 7),
        container.add(me.fieldSkills),
        (me.fieldWebsite = Ti.App.createBigInputField(
          "\uE91C",
          "Website",
          false,
          250
        )),
        (me.fieldWebsite.top = 7),
        (me.fieldWebsite.input.autocapitalization =
          Ti.UI.TEXT_AUTOCAPITALIZATION_NONE),
        (me.fieldWebsite.input.autocorrect = false),
        container.add(me.fieldWebsite),
        (me.fieldGithub = Ti.App.createBigInputField(
          "\uE906",
          "GitHub",
          false,
          30
        )),
        (me.fieldGithub.top = 7),
        (me.fieldGithub.input.autocorrect = false),
        container.add(me.fieldGithub),
        (me.fieldLocation = Ti.App.createBigInputField(
          "\uE80A",
          "Location",
          false,
          30
        )),
        (me.fieldLocation.top = 7),
        container.add(me.fieldLocation));
  }),
    (me.submitForm = function () {
      me.blockingLoader.showLoader();
      var endpoint = "",
        params = {
          source: me.source,
        },
        method = "POST",
        includeAuth = false;

      if ("signup" == me.type)
        (endpoint = "users"),
          (params.type = 1),
          (params.email = me.fieldEmail.input.value.trim()),
          (params.username = me.fieldUsername.input.value.trim()),
          (params.password = me.fieldPassword.input.value);
      else if ("login" == me.type)
        (endpoint = "users/auth-token"),
          (params.username = me.fieldEmail.input.value.trim()),
          (params.password = me.fieldPassword.input.value);
      else if ("forgot_password" == me.type)
        (endpoint = "users/forgot-password"),
          (params.username = me.fieldEmail.input.value.trim());
      else if ("profile_details" == me.type) {
        if (
          ((endpoint = "users/me/edit-profile"),
          (includeAuth = true),
          (params.profile_about = me.fieldAbout.input.value),
          (params.profile_skills = me.fieldSkills.input.value),
          (params.profile_location = me.fieldLocation.input.value),
          (params.profile_website = me.fieldWebsite.input.value),
          (params.profile_github = me.fieldGithub.input.value),
          250 < params.profile_about.length)
        )
          return (
            me.showDialog(
              "Whoops!",
              'Your entry for the "about" field is too long. Please shorten it and try again.'
            ),
            void me.blockingLoader.hideLoader()
          );

        if (250 < params.profile_skills.length)
          return (
            me.showDialog(
              "Whoops!",
              'Your entry for the "skills" field is too long. Please shorten it and try again.'
            ),
            void me.blockingLoader.hideLoader()
          );

        if (250 < params.profile_location.length)
          return (
            me.showDialog(
              "Whoops!",
              'Your entry for the "skills" field is too long. Please shorten it and try again.'
            ),
            void me.blockingLoader.hideLoader()
          );

        if (250 < params.profile_website.length)
          return (
            me.showDialog(
              "Whoops!",
              'Your entry for the "website" field is too long. Please shorten it and try again.'
            ),
            void me.blockingLoader.hideLoader()
          );

        if (250 < params.profile_github.length)
          return (
            me.showDialog(
              "Whoops!",
              'Your entry for the "GitHub" field is too long. Please shorten it and try again.'
            ),
            void me.blockingLoader.hideLoader()
          );
      }

      var apiArgs = {
        method: method,
        endpoint: endpoint,
        params: params,
        callback: me.submitResultReceived,
        includeAuth: includeAuth,
      };

      Ti.App.api(apiArgs);
    }),
    (me.submitResultReceived = function (result) {
      var errorMessage = "";

      if (result.success) {
        if ((Ti.App.setActedOnSplashScreen(1), "signup" == me.type))
          return (
            Ti.App.saveAuthInfo(
              result.auth_token.user_id,
              result.auth_token,
              1
            ),
            Ti.App.tabBar &&
              ("more" == Ti.App.tabBar.getCurrentTabId()
                ? Ti.App.tabBar.destroyAllTabs()
                : Ti.App.tabBar.destroyTab("more")),
            me.closeWindow(true, false),
            Ti.App.openProfileDetailsWindow(),
            void (Ti.App.isAndroid && Ti.App.getNotifTokenFromPrompt())
          );
        if ("login" == me.type) {
          if (
            (Ti.App.saveAuthInfo(
              result.auth_token.user_id,
              result.auth_token,
              1
            ),
            Ti.App.splashWindow &&
              ((Ti.App.splashWindow.window.exitOnClose = false),
              Ti.App.splashWindow.closeWindow(false)),
            Ti.App.tabBar)
          )
            return (
              Ti.App.tabBar.destroyAllTabs(),
              me.closeWindow(),
              void (Ti.App.isAndroid && Ti.App.getNotifTokenFromPrompt())
            );

          Ti.App.openMainFeed(),
            me.closeWindow(),
            Ti.App.isAndroid && Ti.App.getNotifTokenFromPrompt();
        } else if ("profile_details" == me.type) {
          if (
            (Ti.App.splashWindow &&
              ((Ti.App.splashWindow.window.exitOnClose = false),
              Ti.App.splashWindow.closeWindow(false)),
            Ti.App.savedTabs && Ti.App.tabBar)
          )
            return (
              true != me.options.loadData &&
                ("more" == Ti.App.tabBar.getCurrentTabId()
                  ? Ti.App.tabBar.destroyAllTabs()
                  : Ti.App.tabBar.destroyTab("more")),
              Ti.App.tabBar.refreshProfileByUserId(null),
              void me.closeWindow()
            );

          Ti.App.openMainFeed(), me.closeWindow();
        } else
          "forgot_password" == me.type &&
            me.showDialog(
              "Success!",
              "If the username/email you entered belongs to an account, you will receive instructions to reset your password shortly.",
              true
            );
      } else
        (errorMessage = Ti.App.getErrorMessageFromResult(result.error)),
          me.showDialog("An error occured", errorMessage);

      null != me && me.blockingLoader.hideLoader();
    }),
    (me.showDialog = function (title, message, closeOnOk) {
      var dialog = Ti.UI.createAlertDialog({
        message: message,
        ok: "Got it",
        title: title,
      });

      closeOnOk &&
        dialog.addEventListener("click", function () {
          me.closeWindow();
        }),
        dialog.show();
    }),
    (me.createBasicControls = function () {
      var topBarOptions = {
          leftBtnType: "close",
          callbackLeftBtn: function () {
            Ti.App.splashWindow &&
              "profile_details" == me.type &&
              setTimeout(function () {
                (Ti.App.splashWindow.exitOnClose = false),
                  Ti.App.splashWindow.closeWindow(false);
              }, 2e3),
              Ti.App.savedTabs.rants ||
              ("profile_details" != me.type && Ti.App.splashWindow)
                ? me.closeWindow()
                : (Ti.App.openMainFeed(),
                  "profile_details" == me.type &&
                    Ti.App.logStat("Profile Details Skip"),
                  me.closeWindow());
          },
        },
        topBar = Ti.App.topBarGenerator.createBar(topBarOptions);

      me.window.add(topBar);

      var BlockingLoader = require("ui/common/BlockingLoader");

      (me.blockingLoader = new BlockingLoader()),
        me.window.add(me.blockingLoader.getElem());
    }),
    (me.createWindow = function () {
      (me.window = Ti.UI.createWindow({
        navBarHidden: true,
        backgroundColor: Ti.App.colorModalBg,
        orientationModes: [Ti.UI.PORTRAIT],
      })),
        me.window.addEventListener("close", windowClosed);
    });

  var windowClosed = function () {
    me.closeWindow(false, true, true);
  };

  me.closeWindow = function (animated, nullRightAway, noClose) {
    null == me ||
      (me.window.removeEventListener("close", windowClosed),
      (noClose = noClose || false),
      null == animated && (animated = true),
      null == nullRightAway && (nullRightAway = true),
      "signup" == me.type ||
        ("login" == me.type
          ? (Ti.App.loginWindow = null)
          : "profile_details" == me.type
          ? ((Ti.App.profileDetailsWindow = null),
            Ti.App.isAndroid && Ti.App.tabBar.scrollProfileToTop())
          : "forgot_password" == me.type &&
            (Ti.App.forgotPasswordWindow = null)),
      !noClose &&
        me.window.close({
          animated: animated,
        }),
      nullRightAway
        ? nullWindow()
        : me.window &&
          me.window.addEventListener &&
          me.window.addEventListener("close", nullWindow));
  };

  var nullWindow = function () {
    me = null;
  };
  return me;
}

module.exports = SignupLoginWindow;
