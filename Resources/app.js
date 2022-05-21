!(function () {
  var _Mathround = Math.round;
  var osname = "android";
  var version = Ti.Platform.version;
  var height = Ti.Platform.displayCaps.platformHeight;
  var width = Ti.Platform.displayCaps.platformWidth;
  Ti.App.appId = 3;
  Ti.App.useFont = "Comfortaa-Bold";
  Ti.App.isAndroid = true;
  Ti.App.platform = Ti.App.isAndroid ? 2 : 1;
  Ti.App.sessionEventId = 1;
  Ti.App.sessionStartTime = Date.now().toString();
  Ti.App.userSettings = {};
  Ti.App.rantsLoaded = 0;
  Ti.App.colorLightTheme = Ti.App.Properties.getBool("isLightTheme", true);
  Ti.App.theme =
    Ti.App.Properties.getInt("theme", 0) ||
    (Ti.App.Properties.getBool("isLightTheme", true) ? 1 : 2);
  Ti.App.autoLoadImages = Ti.App.Properties.getBool("autoLoadImages", true);
  Ti.App.rantAvatarImages = Ti.App.Properties.getBool("rantAvatarImages", true);
  Ti.App.notifsAvatarImages = Ti.App.Properties.getBool(
    "notifsAvatarImages",
    true
  );
  Ti.App.binaryScores = Ti.App.Properties.getBool("binaryScores", false);
  Ti.App.weeklyRantWeek = 0;
  Ti.App.weeklyRantOpen = false;
  Ti.App.rantSeriesId = 1;
  Ti.App.numVotes = 0;
  Ti.App.lastNotifCount = -1;
  Ti.App.savedTabs = {};
  Ti.App.mainAppWindow = null;
  Ti.App.tabBar = null;
  Ti.App.splashWindow = null;
  Ti.App.loginWindow = null;
  Ti.App.signupWindow = null;
  Ti.App.forgotPasswordWindow = null;
  Ti.App.profileDetailsWindow = null;
  Ti.App.inAppPurchases = null;
  Ti.App.dpp = false;
  Ti.App.collabTypes = [
    { id: "c_type_long", label: "Project Type" },
    { id: "text", label: "Summary" },
    { id: "c_description", label: "Description" },
    { id: "c_tech_stack", label: "Tech Stack" },
    { id: "c_team_size", label: "Current Team Size" },
    { id: "c_url", label: "Project URL" },
  ];
  var logAddRantBtnTest = -1;
  if (
    ((Ti.App.avatarImageUrl = "https://avatars.devrant.com/"),
    Ti.App.isAndroid || require("com.enouvo.tigif"),
    (Ti.App.pxToDip = function (pixelData) {
      return Ti.App.isAndroid
        ? pixelData / Ti.Platform.displayCaps.logicalDensityFactor
        : pixelData / (Titanium.Platform.displayCaps.dpi / 160);
    }),
    (Ti.App.dipToPx = function (dip) {
      return Ti.App.isAndroid
        ? dip * Ti.Platform.displayCaps.logicalDensityFactor
        : dip * (Titanium.Platform.displayCaps.dpi / 160);
    }),
    Ti.App.isAndroid)
  ) {
    var navHeight = _Mathround(
      25 * Ti.Platform.displayCaps.logicalDensityFactor
    );
    (Ti.App.realWidth = Ti.App.pxToDip(width)),
      (Ti.App.realHeight = Ti.App.pxToDip(height - navHeight)),
      (Ti.App.navBarHeight = _Mathround(
        (25 * Ti.Platform.displayCaps.dpi) / 160
      )),
      (Ti.App.navStatusBarHeight = Ti.App.navBarHeight),
      (Ti.App.androidHeader = 14);
  } else
    (Ti.App.realWidth = width),
      (Ti.App.realHeight = height),
      375 == width && 812 == height && (Ti.App.isIphoneX = true),
      (Ti.App.navBarHeight = 44),
      (Ti.App.navStatusBarHeight =
        Ti.App.navBarHeight + (Ti.App.isIphoneX ? 44 : 20)),
      (Ti.App.androidHeader = 0),
      console.log("rw", width, "rh", height);

  (Ti.App.colorMidBlue = "#54556e"),
    (Ti.App.colorDarkBlue = "#40415a"),
    (Ti.App.colorDarkerBlue = "#383952"),
    (Ti.App.colorMidGrey = "#aaaab8"),
    (Ti.App.colorMidMonoGrey = "#7f7f7f"),
    (Ti.App.colorLightGrey = "#e3e3e3"),
    (Ti.App.colorLtMidGrey = "#c8c8d0"),
    (Ti.App.colorRed = "#d55161"),
    (Ti.App.colorOrange = "#f99a66"),
    (Ti.App.colorPurple = "#a973a2"),
    (Ti.App.colorGreen = "#7bc8a4"),
    (Ti.App.colorDarkGreen = "#2a8b9d"),
    (Ti.App.colorTeal = "#69c9cd"),
    (Ti.App.colorYellow = "#e6c653"),
    (Ti.App.colorBlack = "#000"),
    (Ti.App.colorBlackMidGrey = "#3a3a3a"),
    (Ti.App.colorBlackDarkGrey = "#202020"),
    (Ti.App.colorFb = "#355ca7"),
    (Ti.App.colorTwitter = "#00a7ea"),
    (Ti.App.scrollBarStyle = null),
    (Ti.App.parseColors = function () {
      1 == Ti.App.theme
        ? ((Ti.App.colorDarkGrey = "#2f2f32"),
          (Ti.App.colorBg = "#fff"),
          (Ti.App.colorTextContrast = "#fff"),
          (Ti.App.colorTextContrastSubtle = "#fff"),
          (Ti.App.colorBtnContrast = "#fff"),
          (Ti.App.colorBtnInverse = "#fff"),
          (Ti.App.colorLink = Ti.App.colorMidBlue),
          (Ti.App.colorUrl = Ti.App.colorMidBlue),
          (Ti.App.colorTermLink = Ti.App.colorMidBlue),
          (Ti.App.colorBgMain = Ti.App.colorMidBlue),
          (Ti.App.colorScoreContainer = Ti.App.colorMidBlue),
          (Ti.App.colorBgSecond = Ti.App.colorDarkBlue),
          (Ti.App.colorBgThird = Ti.App.colorLightGrey),
          (Ti.App.colorBgTabs = "#fff"),
          (Ti.App.colorTabHighlight = Ti.App.colorMidBlue),
          (Ti.App.colorTabTextHighlight = Ti.App.colorRed),
          (Ti.App.colorIcon = Ti.App.colorLightGrey),
          (Ti.App.colorTabText = Ti.App.colorMidBlue),
          (Ti.App.colorTabTextUnselected = Ti.App.colorMidBlue),
          (Ti.App.colorNewsText = Ti.App.colorMidBlue),
          (Ti.App.colorSortCircle = Ti.App.colorLightGrey),
          (Ti.App.colorSortCircleMiddle = "#fff"),
          (Ti.App.colorTopTabText = "#fff"),
          (Ti.App.colorBgTopTabs = Ti.App.colorDarkBlue),
          (Ti.App.colorLine = Ti.App.colorLightGrey),
          (Ti.App.colorField = "#fff"),
          (Ti.App.colorFieldFooter = Ti.App.colorMidGrey),
          (Ti.App.colorFieldIcon = Ti.App.colorMidGrey),
          (Ti.App.colorHint = Ti.App.colorMidGrey),
          (Ti.App.colorCommentContainer = Ti.App.colorLightGrey),
          (Ti.App.colorUnselectable = Ti.App.colorLightGrey),
          (Ti.App.colorImgBg = Ti.App.colorLightGrey),
          (Ti.App.colorSubtitle = Ti.App.colorLtMidGrey),
          (Ti.App.colorBtnHighlight = Ti.App.colorRed),
          (Ti.App.colorBtnSelectable = Ti.App.colorMidGrey),
          (Ti.App.colorBtnText = "#fff"),
          (Ti.App.colorBtnBgOne = Ti.App.colorRed),
          (Ti.App.colorBtnBgTwo = Ti.App.colorMidBlue),
          (Ti.App.colorBtnBgThree = Ti.App.colorDarkBlue),
          (Ti.App.colorBtnBgFour = Ti.App.colorOrange),
          (Ti.App.colorBtnFb = Ti.App.colorFb),
          (Ti.App.colorBtnTwitter = Ti.App.colorTwitter),
          (Ti.App.colorNotif = Ti.App.colorGreen),
          (Ti.App.colorModalBg = Ti.App.colorMidBlue),
          (Ti.App.hiddenImg = "/ui/hidden-rant-image-light1.png"),
          (Ti.App.loaderImg = "/ui/loader-icon-border2.png"),
          (Ti.App.loaderBg = "/ui/empty-screen-full.gif"),
          (Ti.App.loaderGif = "/ui/loader-icon-gif.gif"),
          !Ti.App.isAndroid &&
            (Ti.App.scrollBarStyle = Ti.UI.iOS.ScrollIndicatorStyle.DEFAULT))
        : 2 == Ti.App.theme
        ? ((Ti.App.colorDarkGrey = Ti.App.colorLightGrey),
          (Ti.App.colorTextContrast = "#fff"),
          (Ti.App.colorTextContrastSubtle = Ti.App.colorMidGrey),
          (Ti.App.colorBtnContrast = "#fff"),
          (Ti.App.colorBtnInverse = "#fff"),
          (Ti.App.colorLink = "#fff"),
          (Ti.App.colorUrl = "#fff"),
          (Ti.App.colorTermLink = Ti.App.colorMidGrey),
          (Ti.App.colorBg = Ti.App.colorDarkBlue),
          (Ti.App.colorBgMain = Ti.App.colorMidBlue),
          (Ti.App.colorScoreContainer = Ti.App.colorMidBlue),
          (Ti.App.colorBgSecond = Ti.App.colorDarkerBlue),
          (Ti.App.colorBgThird = Ti.App.colorMidBlue),
          (Ti.App.colorBgTabs = Ti.App.colorDarkBlue),
          (Ti.App.colorTabHighlight = Ti.App.colorRed),
          (Ti.App.colorTabTextHighlight = Ti.App.colorRed),
          (Ti.App.colorIcon = Ti.App.colorMidGrey),
          (Ti.App.colorTabText = "#fff"),
          (Ti.App.colorTabTextUnselected = Ti.App.colorMidGrey),
          (Ti.App.colorNewsText = Ti.App.colorLightGrey),
          (Ti.App.colorSortCircle = "#fff"),
          (Ti.App.colorSortCircleMiddle = "#fff"),
          (Ti.App.colorTopTabText = "#fff"),
          (Ti.App.colorBgTopTabs = Ti.App.colorDarkBlue),
          (Ti.App.colorLine = Ti.App.colorMidBlue),
          (Ti.App.colorField = Ti.App.colorDarkBlue),
          (Ti.App.colorFieldFooter = Ti.App.colorDarkerBlue),
          (Ti.App.colorFieldIcon = Ti.App.colorMidGrey),
          (Ti.App.colorHint = Ti.App.colorMidGrey),
          (Ti.App.colorCommentContainer = Ti.App.colorDarkerBlue),
          (Ti.App.colorUnselectable = Ti.App.colorMidBlue),
          (Ti.App.colorImgBg = Ti.App.colorDarkerBlue),
          (Ti.App.colorSubtitle = Ti.App.colorLtMidGrey),
          (Ti.App.colorBtnHighlight = Ti.App.colorRed),
          (Ti.App.colorBtnSelectable = Ti.App.colorMidGrey),
          (Ti.App.colorBtnText = "#fff"),
          (Ti.App.colorBtnBgOne = Ti.App.colorRed),
          (Ti.App.colorBtnBgTwo = Ti.App.colorMidBlue),
          (Ti.App.colorBtnBgThree = Ti.App.colorDarkBlue),
          (Ti.App.colorBtnBgFour = Ti.App.colorOrange),
          (Ti.App.colorBtnFb = Ti.App.colorFb),
          (Ti.App.colorBtnTwitter = Ti.App.colorTwitter),
          (Ti.App.colorNotif = Ti.App.colorGreen),
          (Ti.App.colorModalBg = Ti.App.colorMidBlue),
          (Ti.App.hiddenImg = "/ui/hidden-rant-image-dark1.png"),
          (Ti.App.loaderImg = "/ui/loader-icon-border-dark1.png"),
          (Ti.App.loaderBg = "/ui/empty-screen-full-dark1.gif"),
          (Ti.App.loaderGif = "/ui/loader-icon-gif-dark1.gif"),
          !Ti.App.isAndroid &&
            (Ti.App.scrollBarStyle = Ti.UI.iOS.ScrollIndicatorStyle.DEFAULT))
        : ((Ti.App.colorDarkGrey = Ti.App.colorLightGrey),
          (Ti.App.colorTextContrast = "#fff"),
          (Ti.App.colorTextContrastSubtle = Ti.App.colorMidMonoGrey),
          (Ti.App.colorBtnContrast = "#fff"),
          (Ti.App.colorBtnInverse = Ti.App.colorBlack),
          (Ti.App.colorLink = "#fff"),
          (Ti.App.colorUrl = "#fff"),
          (Ti.App.colorTermLink = Ti.App.colorMidMonoGrey),
          (Ti.App.colorBg = Ti.App.colorBlack),
          (Ti.App.colorBgMain = Ti.App.colorBlack),
          (Ti.App.colorScoreContainer = Ti.App.colorBlackMidGrey),
          (Ti.App.colorBgSecond = Ti.App.colorBlack),
          (Ti.App.colorBgThird = Ti.App.colorBlackMidGrey),
          (Ti.App.colorBgTabs = Ti.App.colorBlack),
          (Ti.App.colorTabHighlight = "#fff"),
          (Ti.App.colorTabTextHighlight = "#fff"),
          (Ti.App.colorIcon = Ti.App.colorBlackMidGrey),
          (Ti.App.colorTabText = "#fff"),
          (Ti.App.colorTabTextUnselected = Ti.App.colorMidMonoGrey),
          (Ti.App.colorNewsText = Ti.App.colorLightGrey),
          (Ti.App.colorSortCircle = Ti.App.colorBlackMidGrey),
          (Ti.App.colorSortCircleMiddle = Ti.App.colorBlack),
          (Ti.App.colorTopTabText = "#fff"),
          (Ti.App.colorBgTopTabs = Ti.App.colorBlack),
          (Ti.App.colorLine = Ti.App.colorBlackDarkGrey),
          (Ti.App.colorField = Ti.App.colorBlackDarkGrey),
          (Ti.App.colorFieldFooter = Ti.App.colorBlackMidGrey),
          (Ti.App.colorFieldIcon = Ti.App.colorBlackMidGrey),
          (Ti.App.colorHint = Ti.App.colorMidMonoGrey),
          (Ti.App.colorCommentContainer = Ti.App.colorBlack),
          (Ti.App.colorUnselectable = Ti.App.colorBlackDarkGrey),
          (Ti.App.colorImgBg = Ti.App.colorBlackDarkGrey),
          (Ti.App.colorSubtitle = Ti.App.colorLtMidGrey),
          (Ti.App.colorBtnHighlight = "#fff"),
          (Ti.App.colorBtnSelectable = Ti.App.colorBlackMidGrey),
          (Ti.App.colorBtnText = Ti.App.colorBlack),
          (Ti.App.colorBtnBgOne = "#fff"),
          (Ti.App.colorBtnBgTwo = Ti.App.colorBlackMidGrey),
          (Ti.App.colorBtnBgThree = Ti.App.colorBlackDarkGrey),
          (Ti.App.colorBtnBgFour = Ti.App.colorOrange),
          (Ti.App.colorBtnFb = Ti.App.colorBlackMidGrey),
          (Ti.App.colorBtnTwitter = Ti.App.colorBlackMidGrey),
          (Ti.App.colorNotif = "#fff"),
          (Ti.App.colorModalBg = Ti.App.colorBlack),
          (Ti.App.hiddenImg = "/ui/hidden-rant-image-black1.png"),
          (Ti.App.loaderImg = "/ui/loader-icon-border-black1.png"),
          (Ti.App.loaderBg = "/ui/empty-screen-full-black1.gif"),
          (Ti.App.loaderGif = "/ui/loader-icon-gif-black1.gif"),
          !Ti.App.isAndroid &&
            (Ti.App.scrollBarStyle = Ti.UI.iOS.ScrollIndicatorStyle.WHITE)),
        (Ti.App.btnVoteColors = {
          unselectable: Ti.App.colorUnselectable,
          selected: Ti.App.colorBtnHighlight,
          selectable: Ti.App.colorBtnSelectable,
        });
    }),
    Ti.App.parseColors(),
    (Ti.App.fontS = "13sp"),
    (Ti.App.fontBody = "16sp"),
    (Ti.App.fontM = "18sp"),
    (Ti.App.fontBtn = "22sp"),
    (Ti.App.fontL = "24sp"),
    (Ti.App.fontXL = "32sp"),
    (Ti.App.tabBarHeight = Ti.App.isAndroid ? 48 : Ti.App.isIphoneX ? 69 : 49),
    (Ti.App.btnActiveState = function (buttonName) {
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
    (Ti.App.isLoggedIn = function () {
      return null != Ti.App.Properties.getString("userId", null);
    }),
    (Ti.App.loadImage = function (image, callback, failCallback) {
      var xhr = Titanium.Network.createHTTPClient();

      return (
        (xhr.cache = true),
        (xhr.onload = function (e) {
          callback(e.source.responseData);
        }),
        (xhr.onerror = function (e) {
          failCallback && failCallback();
        }),
        xhr.setTimeout(8e3),
        xhr.open("GET", image),
        xhr.send(),
        xhr
      );
    }),
    (Ti.App.api = function (args) {
      var xhr = Ti.Network.createHTTPClient();
      var method = args.method || "POST";
      var params = args.params || {};
      var callback = args.callback || function () {};
      var includeAuth = null != args.includeAuth && args.includeAuth;

      (params.app = Ti.App.appId),
        (params.guid = Ti.App.Properties.getString("guid", "")),
        (params.sid = Ti.App.sessionStartTime),
        (params.seid = Ti.App.sessionEventId++),
        (params.plat = Ti.App.platform),
        (params.ver = "1.17.0.6"),
        (params.nari = -1),
        includeAuth &&
          Ti.App.isLoggedIn() &&
          ((params.user_id = Ti.App.Properties.getString("userId", 0)),
          (params.token_id = Ti.App.Properties.getString("tokenId", 0)),
          (params.token_key = Ti.App.Properties.getString("tokenKey", "")));

      var parseJsonResult = function (json) {
        var result;

        try {
          result = JSON.parse(json);
        } catch (e) {
          result = {};
        }

        return result;
      };

      (xhr.onload = function (e) {
        var notification_state_changed = true;
        var result = parseJsonResult(this.responseText);

        result.settings &&
          (Ti.App.userSettings.notif_state == result.settings.notif_state &&
            (notification_state_changed = false),
          (Ti.App.userSettings = result.settings),
          notification_state_changed &&
            !Ti.App.isAndroid &&
            Ti.App.deviceNotificationsEnabled() &&
            ((token = Ti.App.getCurrentDeviceToken()),
            "" == token
              ? Ti.App.getNotifTokenFromPrompt()
              : ("" == Ti.App.userSettings.notif_token ||
                  Ti.App.userSettings.notif_token != token) &&
                Ti.App.syncNotificationToken())),
          callback(result);
      }),
        (xhr.onerror = function (e) {
          var result = parseJsonResult(this.responseText);

          result.error &&
            false === result.confirmed &&
            Ti.App.showNeedToConfirmEmailDialog(),
            result.error &&
              result.invalid_token &&
              Ti.App.showDialog("Whoops!", result.error),
            callback(result);
        });

      var param;
      var urlParams = [];

      if ((urlParams.push("cb=" + Date.now()), "POST" != method && params)) {
        for (param in params)
          urlParams.push(param + "=" + encodeURIComponent(params[param]));

        params = {};
      }

      var useUrl =
        "https://devrant.com/api/" + args.endpoint + "?" + urlParams.join("&");

      return (
        xhr.open(method, useUrl), xhr.setTimeout(14e3), xhr.send(params), xhr
      );
    }),
    (Ti.App.saveAuthInfo = function (user_id, token, accountType) {
      Ti.App.Properties.setString("userId", user_id),
        Ti.App.Properties.setString("tokenId", token.id),
        Ti.App.Properties.setString("tokenKey", token.key),
        Ti.App.Properties.setString("tokenExpireTime", token.expire_time),
        Ti.App.Properties.setInt("accountType", accountType);
    }),
    (Ti.App.toRoundedK = function (num, min) {
      return num < min ? num : (num / 1e3).toFixed(1) + "K";
    }),
    (Ti.App.logout = function () {
      Ti.App.Properties.removeProperty("userId"),
        Ti.App.Properties.removeProperty("tokenId"),
        Ti.App.Properties.removeProperty("tokenKey"),
        Ti.App.Properties.removeProperty("tokenExpireTime"),
        Ti.App.Properties.removeProperty("accountType"),
        Ti.App.tabBar.setBadgeCount("notifs", 0);
    }),
    (Ti.App.generateTagsAttributedString = function (tags) {
      var i;
      var attributes = [];
      var text = "";
      var endTagNum = tags.length - 1;
      var curText = "";

      for (i = 0; i < tags.length; ++i)
        (curText = tags[i] + ""),
          attributes.push({
            type: Ti.UI.ATTRIBUTE_LINK,
            value: curText,
            range: [text.length, curText.length],
          }),
          attributes.push({
            type: Ti.UI.ATTRIBUTE_UNDERLINES_STYLE,
            value: Ti.UI.ATTRIBUTE_UNDERLINE_STYLE_SINGLE,
            range: [text.length, curText.length],
          }),
          attributes.push({
            type: Ti.UI.ATTRIBUTE_UNDERLINE_COLOR,
            value: Ti.App.colorHint,
            range: [text.length, curText.length],
          }),
          i != endTagNum && (curText += ", "),
          (text += curText);

      return (
        Ti.App.isAndroid && (text += " "),
        attributes.push({
          type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
          value: Ti.App.colorHint,
          range: [0, text.length],
        }),
        attributes.push({
          type: Ti.UI.ATTRIBUTE_FONT,
          value: { fontSize: Ti.App.fontS, fontWeight: "bold" },
          range: [0, text.length],
        }),
        Ti.UI.createAttributedString({
          text: text,
          attributes: attributes,
        })
      );
    }),
    (Ti.App.actedOnSplashScreen = function () {
      return 1 == Ti.App.Properties.getInt("actedOnSplashScreen", 0);
    }),
    (Ti.App.setActedOnSplashScreen = function (acted) {
      Ti.App.Properties.setInt("actedOnSplashScreen", acted);
    }),
    (Ti.App.getErrorMessageFromResult = function (error) {
      return "object" == typeof error
        ? error.length
          ? error[0]
          : "An unknown error occured. Please try again."
        : error;
    }),
    (Ti.App.createBigRoundedButton = function (text, color) {
      var colors = {
        red: Ti.App.colorBtnBgOne,
        blue: Ti.App.colorBtnBgTwo,
        dark_blue: Ti.App.colorBtnBgThree,
        orange: Ti.App.colorBtnBgFour,
      };

      var container = Ti.UI.createView({
        height: Ti.UI.SIZE,
        backgroundColor: colors[color],
        borderRadius: 10,
        borderWidth: 0,
      });

      var label = Ti.UI.createLabel({
        width: "90%",
        height: Ti.UI.SIZE,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        top: 12,
        bottom: 12,
        color: Ti.App.colorBtnText,
        font: {
          fontSize: Ti.App.fontBtn,
          fontWeight: "bold",
        },

        text: text,
      });

      return container.add(label), container;
    }),
    (Ti.App.openGroupRantWindow = function (week) {
      var RantListWindow = require("ui/common/RantListWindow");
      var rantListWindow = new RantListWindow();
      rantListWindow.init(true, week),
        Ti.App.tabBar.openWindow(
          rantListWindow.getWindow(),
          rantListWindow,
          "weekly_rant"
        ),
        (Ti.App.weeklyRantOpen = true);
    }),
    (Ti.App.openDiscussionsWindow = function () {
      var DiscussionsWindow = require("ui/common/DiscussionsWindow");
      var discussionsWindow = new DiscussionsWindow();
      discussionsWindow.init(),
        Ti.App.tabBar.openWindow(
          discussionsWindow.getWindow(),
          discussionsWindow,
          "discussions"
        );
    }),
    (Ti.App.openSupporterInfoWindow = function () {
      var SupporterInfoWindow = require("ui/common/SupporterInfoWindow");
      var supporterInfoWindow = new SupporterInfoWindow();
      supporterInfoWindow.init(),
        Ti.App.tabBar.openWindow(
          supporterInfoWindow.getWindow(),
          supporterInfoWindow,
          "supporter_info"
        );
    }),
    (Ti.App.openMainFeed = function (animated) {
      var TabBar = require("ui/common/TabBar");

      if (((Ti.App.tabBar = new TabBar()), !Ti.App.isAndroid)) {
        Ti.App.tabBar.init(),
          (Ti.App.mainAppWindow = Ti.UI.createWindow({
            bottom: 0,
            width: "100%",
            height: Ti.App.tabBarHeight,
          })),
          Ti.App.tabBar.setAppPauseResumeListeners();
        var tabBar = Ti.App.tabBar.getView();
        (tabBar.zIndex = 100),
          Ti.App.mainAppWindow.add(tabBar),
          Ti.App.mainAppWindow.open();
      } else {
        (Ti.App.mainAppWindow = Ti.UI.createWindow({
          width: "100%",
          height: "100%",
          exitOnClose: true,
          orientationModes: [Ti.UI.PORTRAIT],

          navBarHidden: false,
          fullscreen: false,
        })),
          Ti.App.tabBar.init(),
          Ti.App.tabBar.setAppPauseResumeListeners();

        var tabBar = Ti.App.tabBar.getView();

        return (
          (tabBar.bottom = 0),
          Ti.App.isAndroid && (tabBar.zIndex = 5),
          Ti.App.mainAppWindow.add(tabBar),
          void Ti.App.mainAppWindow.open()
        );
      }
    }),
    (Ti.App.openSplashScreen = function () {
      var SplashWindow = require("ui/common/SplashWindow");
      var splashWindow = new SplashWindow();
      splashWindow.init(), (Ti.App.splashWindow = splashWindow);
    }),
    (Ti.App.openSignupWindow = function (source) {
      var SignupLoginWindow = require("ui/common/SignupLoginWindow");
      var signupLoginWindow = new SignupLoginWindow();
      signupLoginWindow.init("signup", source),
        (Ti.App.signupWindow = signupLoginWindow);
    }),
    (Ti.App.openAddCollab = function (rantId, hasFreeCollab) {
      var PostCollabWindow = require("ui/common/PostCollabWindow");
      var postCollabWindow = new PostCollabWindow();
      postCollabWindow.init({ has_free: hasFreeCollab, rantId: rantId });
    }),
    (Ti.App.openProfileDetailsWindow = function () {
      var SignupLoginWindow = require("ui/common/SignupLoginWindow");
      var signupLoginWindow = new SignupLoginWindow();
      signupLoginWindow.init("profile_details"),
        (Ti.App.profileDetailsWindow = signupLoginWindow);
    }),
    (Ti.App.openSelectAvatarWindow = function () {
      var SelectAvatarWindow = require("ui/common/SelectAvatarWindow");
      var selectAvatarWindow = new SelectAvatarWindow();
      selectAvatarWindow.init();
    }),
    (Ti.App.openSupporterModalWindow = function () {
      var SupporterModalWindow = require("ui/common/SupporterModalWindow");
      var supporterModalWindow = new SupporterModalWindow();
      supporterModalWindow.init();
    }),
    (Ti.App.openLoginWindow = function () {
      var SignupLoginWindow = require("ui/common/SignupLoginWindow");
      var signupLoginWindow = new SignupLoginWindow();
      signupLoginWindow.init("login"), (Ti.App.loginWindow = signupLoginWindow);
    }),
    (Ti.App.openForgotPasswordWindow = function () {
      var SignupLoginWindow = require("ui/common/SignupLoginWindow");
      var signupLoginWindow = new SignupLoginWindow();
      signupLoginWindow.init("forgot_password"),
        (Ti.App.forgotPasswordWindow = signupLoginWindow);
    }),
    (Ti.App.openPostRantWindow = function (
      type,
      id,
      successHandler,
      prepop,
      prepopTags,
      commentId,
      rt
    ) {
      if (!Ti.App.isLoggedIn() && "feedback" != type)
        return void Ti.App.openSignupWindow("post_rant");

      var openPostWindowFunc = function (useType) {
        (prepop = prepop || ""), (prepopTags = prepopTags || "");
        var PostRantWindow = require("ui/common/PostRantWindow");
        var postRantWindow = new PostRantWindow();
        postRantWindow.init(
          type,
          id,
          successHandler,
          prepop,
          prepopTags,
          commentId,
          useType
        );
      };

      if ("rant" == type) {
        if (
          "" != Ti.App.Properties.getString("rant_wip", "") ||
          "" != Ti.App.Properties.getString("rant_wip_tags", "")
        )
          return void openPostWindowFunc(
            Ti.App.Properties.getInt("rant_rt", 1)
          );
        var PostTypeWindow = require("ui/common/PostTypeWindow");
        var postTypeWindow = new PostTypeWindow();

        return void postTypeWindow.init({
          typeSelectedFunc: function (type) {
            return 2 == type
              ? void Ti.App.openAddCollab(null, true)
              : void openPostWindowFunc(type);
          },
        });
      }

      openPostWindowFunc(rt || 1);
    }),
    (Ti.App.openSearchWindow = function (term, source) {
      if (
        ((term = null == term ? "" : term),
        (source = source || ""),
        term && "wk" == term.substr(0, 2) && 2 < term.length)
      ) {
        var lastPart = term.substr(2);

        if (+lastPart == lastPart)
          return void Ti.App.openGroupRantWindow(lastPart);
      }
      var SearchWindow = require("ui/common/SearchWindow");
      var searchWindow = new SearchWindow();
      searchWindow.init(term, source),
        Ti.App.tabBar.openWindow(
          searchWindow.getWindow(),
          searchWindow,
          "search"
        );
    }),
    (Ti.App.openStickersWindow = function (inWindow) {
      var StickersWindow = require("ui/common/StickersWindow");
      var stickersWindow = new StickersWindow();
      stickersWindow.init(inWindow);
    }),
    (Ti.App.openSharePromptWindow = function (inWindow, rant) {
      var SharePromptWindow = require("ui/common/SharePromptWindow");
      var sharePromptWindow = new SharePromptWindow();
      sharePromptWindow.init(inWindow, rant);
    }),
    (Ti.App.openStickersWindowIfNeeded = function (inWindow) {
      1 == Ti.App.Properties.getInt("stickersPromoSeen", 0) ||
        (Ti.App.Properties.setInt("stickersPromoSeen", 1),
        Ti.App.openStickersWindow(inWindow));
    }),
    (Ti.App.openRantWindow = function (
      rantId,
      wasJustPosted,
      rantType,
      commentId
    ) {
      var RantWindow = require("ui/common/RantWindow");
      var rantWindow = new RantWindow();
      rantWindow.init(rantId, wasJustPosted, rantType, commentId),
        Ti.App.tabBar.openWindow(rantWindow.getWindow(), rantWindow, "rant");
    }),
    (Ti.App.openWeeklies = function () {
      var WeekliesWindow = require("ui/common/WeekliesWindow");
      var weekliesWindow = new WeekliesWindow();
      weekliesWindow.init(),
        Ti.App.tabBar.openWindow(
          weekliesWindow.getWindow(),
          weekliesWindow,
          "weeklies"
        );
    }),
    (Ti.App.openProfileWindow = function (profileId) {
      var ProfileWindow = require("ui/common/ProfileWindow");
      var profileWindow = new ProfileWindow();
      profileWindow.init(profileId),
        Ti.App.tabBar.openWindow(
          profileWindow.getWindow(),
          profileWindow,
          "profile"
        );
    }),
    (Ti.App.openSettingsWindow = function () {
      var SettingsWindow = require("ui/common/SettingsWindow");
      var settingsWindow = new SettingsWindow();
      settingsWindow.init(),
        Ti.App.tabBar.openWindow(
          settingsWindow.getWindow(),
          settingsWindow,
          "settings"
        );
    }),
    (Ti.App.openSupporterListWindow = function () {
      var SupporterListWindow = require("ui/common/SupporterListWindow");
      var supporterListWindow = new SupporterListWindow();
      supporterListWindow.init(),
        Ti.App.tabBar.openWindow(
          supporterListWindow.getWindow(),
          supporterListWindow,
          "supporter_list"
        );
    }),
    (Ti.App.openSwagWindow = function () {
      var SwagWindow = require("ui/common/SwagWindow");
      var swagWindow = new SwagWindow();
      swagWindow.init(),
        Ti.App.tabBar.openWindow(swagWindow.getWindow(), swagWindow, "swag");
    }),
    (Ti.App.openBuildAvatarWindow = function (imageId, imageBg) {
      var BuildAvatarWindow = require("ui/common/BuildAvatarWindow");
      var buildAvatarWindow = new BuildAvatarWindow();
      buildAvatarWindow.init(imageId, imageBg),
        Ti.App.tabBar.openWindow(
          buildAvatarWindow.getWindow(),
          buildAvatarWindow,
          "build_avatar"
        );
    }),
    (Ti.App.showDialog = function (title, message) {
      var dialog = Ti.UI.createAlertDialog({
        message: message,
        ok: "Got it",
        title: title,
      });

      dialog.show();
    }),
    (Ti.App.createBigInputField = function (
      icon,
      placeholder,
      isPassword,
      maxLength,
      small
    ) {
      (small = small || false),
        (isPassword = isPassword || false),
        (maxLength = null == maxLength ? -1 : maxLength);

      var container = Ti.UI.createView({
        width: "100%",
        height: Ti.UI.SIZE,
        backgroundColor:
          small && Ti.App.isAndroid ? "transparent" : Ti.App.colorField,
        borderRadius: small && Ti.App.isAndroid ? 0 : 12,
        borderWidth: 0,
        top: small && Ti.App.isAndroid ? 5 : 0,
      });

      if (small && Ti.App.isAndroid) {
        var whiteField = Ti.UI.createView({
          width: "100%",
          height: "32sp",
          backgroundColor: Ti.App.colorField,
          borderRadius: 12,
          borderWidth: 0,
          top: 3,
        });

        container.add(whiteField);
      }

      var iconAndFieldContainer = Ti.UI.createView({
        width: small && Ti.App.isAndroid ? "86%" : "90%",
        height: small && Ti.App.isAndroid ? "38sp" : Ti.UI.SIZE,
        layout: "horizontal",
        horizontalWrap: false,
        top: small ? (Ti.App.isAndroid ? 0 : 5) : Ti.App.isAndroid ? 5 : 10,
        bottom: small ? (Ti.App.isAndroid ? 0 : 5) : Ti.App.isAndroid ? 5 : 10,
        left: small ? 6 : 15,
      });

      container.add(iconAndFieldContainer);

      var lblIcon = Ti.UI.createLabel({
        width: small ? 24 : 32,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        height: Ti.UI.SIZE,
        text: icon,
        color: Ti.App.colorFieldIcon,
        font: {
          fontFamily: "icomoon",
          fontSize: small ? "22sp" : "32sp",
        },
      });

      iconAndFieldContainer.add(lblIcon);

      var params = {
        left: small ? 4 : 10,
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        hintText: placeholder,
        hintTextColor: Ti.App.colorHint,
        passwordMask: isPassword,
        color: Ti.App.colorDarkGrey,
        maxLength: maxLength,
        font: {
          fontSize: small ? Ti.App.fontBody : Ti.App.fontM,
        },
      };

      return (
        1 != Ti.App.theme &&
          placeholder &&
          (delete params.hintTextColor,
          delete params.hintText,
          (params.attributedHintText = Ti.UI.createAttributedString({
            text: placeholder,
            attributes: [
              {
                type: Ti.UI.ATTRIBUTE_FOREGROUND_COLOR,
                value: Ti.App.colorHint,
                range: [0, placeholder.length],
              },
            ],
          }))),
        (container.input = Ti.UI.createTextField(params)),
        iconAndFieldContainer.add(container.input),
        container
      );
    }),
    (Ti.App.createCounterInputArea = function (
      height,
      icon,
      placeholder,
      startCount
    ) {
      var container = Ti.UI.createView({
        width: "100%",
        height: height,
        backgroundColor: Ti.App.colorField,
        borderRadius: 12,
        borderWidth: 0,
      });

      var subcontainer = Ti.UI.createView({
        width: "92%",
        height: "87%",
        layout: "horizontal",
        horizontalWrap: false,
      });

      container.add(subcontainer);

      var iconAndCountContainer = Ti.UI.createView({
        width: 40,
        height: "100%",
      });

      if ((subcontainer.add(iconAndCountContainer), icon)) {
        var lblIcon = Ti.UI.createLabel({
          width: 32,
          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
          height: Ti.UI.SIZE,
          top: 0,
          left: 0,
          text: icon,
          color: Ti.App.colorFieldIcon,
          font: {
            fontFamily: "icomoon",
            fontSize: "32sp",
          },
        });

        iconAndCountContainer.add(lblIcon);
      }

      (container.count = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        bottom: 0,
        left: 0,
        text: startCount,
        color: Ti.App.colorHint,
        font: {
          fontSize: Ti.App.fontS,
        },
      })),
        iconAndCountContainer.add(container.count);

      var inputAndHint = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: "100%",
      });

      subcontainer.add(inputAndHint);

      var lblHint = Ti.UI.createLabel({
        top: 0,
        left: 6,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: Ti.App.colorHint,
        text: placeholder,
        font: {
          fontSize: Ti.App.fontM,
        },
      });

      inputAndHint.add(lblHint),
        (container.input = Ti.UI.createTextArea({
          width: "100%",
          height: "100%",
          top: -10,

          backgroundColor: "transparent",
          color: Ti.App.colorDarkGrey,
          font: {
            fontSize: Ti.App.fontM,
          },
        })),
        inputAndHint.add(container.input);

      var recalculateChrs = function (e) {
        (container.count.text = startCount - e.value.length),
          e.value.length
            ? lblHint.visible && (lblHint.visible = false)
            : !lblHint.visible && (lblHint.visible = true);
      };

      return (
        (container.setInputText = function (text) {
          (container.input.value = text),
            recalculateChrs({ value: container.input.value });
        }),
        container.input.addEventListener("change", recalculateChrs),
        recalculateChrs(container.input),
        container
      );
    }),
    (Ti.App.generateAddRantButton = function (isGroupRant, selectedWeek) {
      var size = 44;
      var useOffset = 0;

      Ti.App.isAndroid && !isGroupRant && (useOffset = Ti.App.tabBarHeight);

      var container = Ti.UI.createView({
        bottom: 14 + useOffset,
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 0,
        backgroundColor: Ti.App.colorBtnHighlight,
      });

      var lblPlus = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: Ti.App.colorBtnInverse,
        text: "\uE800",
        font: {
          fontFamily: "icomoon",
          fontSize: "24sp",
        },
      });

      return (
        container.add(lblPlus),
        container.addEventListener("click", function () {
          var useWeek;
          if (!isGroupRant) Ti.App.openPostRantWindow("rant");
          else {
            useWeek = selectedWeek ? selectedWeek : Ti.App.weeklyRantWeek;
            var callback = function () {
              Ti.App.tabBar.refreshWeeklyRant();
            };
            Ti.App.openPostRantWindow(
              "rant",
              null,
              callback,
              "",
              "wk" + (0 == useWeek ? "wk?" : useWeek) + ", "
            );
          }
        }),
        container.addEventListener("touchstart", function () {
          container.opacity = "0.7";
        }),
        container.addEventListener("touchend", function () {
          var fadeOutBtn = Ti.UI.createAnimation({ opacity: 1, duration: 350 });
          container.animate(fadeOutBtn);
        }),
        container
      );
    }),
    (Ti.App.timeAgo = function (previous, showFullDate) {
      showFullDate = null != showFullDate;
      var current = Date.now();
      previous *= 1e3;
      var previousDate;
      var currentDate;
      var pubDay;
      var pubMonth;
      var pubYearWhole;
      var pubYear;
      var msPerMinute = 60000;
      var msPerHour = 3600000;
      var msPerDay = 24 * msPerHour;
      var msPerMonth = 30 * msPerDay;
      var msPerYear = 365 * msPerDay;
      var elapsed = current - previous;
      return 60000 > elapsed
        ? ((elapsed = _Mathround(elapsed / 1e3)),
          (0 <= elapsed ? elapsed : 1) + "s")
        : elapsed < msPerHour
        ? _Mathround(elapsed / 60000) + "m"
        : elapsed < msPerDay
        ? _Mathround(elapsed / msPerHour) + "h"
        : elapsed < msPerMonth
        ? _Mathround(elapsed / msPerDay) + "d"
        : ((previousDate = new Date(previous)),
          (currentDate = new Date(current)),
          (pubDay = previousDate.getDate()),
          (pubMonth = previousDate.getMonth() + 1),
          (pubYearWhole = previousDate.getFullYear()),
          (pubYear = pubYearWhole.toString().substring(2)),
          showFullDate
            ? pubMonth + "/" + pubDay + "/" + pubYear
            : pubMonth + "/" + pubYear);
    }),
    (Ti.App.getVoteButtonColor = function (button, voteState) {
      return -2 == voteState
        ? Ti.App.btnVoteColors.unselectable
        : 0 == voteState
        ? Ti.App.btnVoteColors.selectable
        : 1 == voteState
        ? Ti.App.btnVoteColors["up" == button ? "selected" : "selectable"]
        : Ti.App.btnVoteColors["down" == button ? "selected" : "selectable"];
    }),
    (Ti.App.getVoteIconColor = function (button, voteState) {
      return 0 == voteState
        ? Ti.App.colorTextContrast
        : 1 == voteState
        ? "up" == button
          ? Ti.App.colorBtnInverse
          : Ti.App.colorTextContrast
        : "down" == button
        ? Ti.App.colorBtnInverse
        : Ti.App.colorTextContrast;
    }),
    (Ti.App.showImageViewer = function (image) {
      var ImageViewerWindow = require("ui/common/ImageViewerWindow");
      var imageViewerWindow = new ImageViewerWindow();
      imageViewerWindow.init(image);
      var window = imageViewerWindow.getWindow();

      var params = {
        modal: !Ti.App.isAndroid,
      };

      Ti.App.isAndroid ||
        (params.modalTransitionStyle =
          Ti.UI.iOS.MODAL_TRANSITION_STYLE_COVER_VERTICAL),
        window.open(params);
    }),
    (Ti.App.showNeedToConfirmEmailDialog = function () {
      var dialog = Ti.UI.createAlertDialog({
        cancel: 0,
        buttonNames: ["Ok", "Resend Email"],
        message:
          "In order to vote, comment or post rants, you need to confirm your email address. You should have received a welcome email with a confirm link when you signed up. If you can't find the email, you can tap resend below.",
        title: "Please confirm your account",
      });

      dialog.addEventListener("click", function (e) {
        if (1 == e.index) {
          var apiArgs = {
            method: "POST",
            endpoint: "users/me/resend-confirm",
            includeAuth: true,
          };

          Ti.App.api(apiArgs);
        }
      }),
        dialog.show();
    }),
    (Ti.App.actionFromUrlScheme = function (url) {
      (url = url.replace("http://", "")), (url = url.replace("https://", ""));

      var parts = url.split("/");

      3 <= parts.length &&
        ("rants" == parts[1]
          ? Ti.App.openRantWindow(parts[2])
          : "users" == parts[1]
          ? Ti.App.openRantWindow(parts[2])
          : "collabs" == parts[1] && Ti.App.openRantWindow(parts[2], false, 2));
    }),
    (Ti.App.logStat = function (event_type, event_props) {
      var apiArgs = {
        method: "POST",
        endpoint: "stats",
        params: {
          et: event_type,
          ep: JSON.stringify(event_props),
        },

        includeAuth: true,
      };

      Ti.App.api(apiArgs);
    }),
    (Ti.App.getPromptForPushNotifs = function () {
      return Ti.App.Properties.getInt("promptForPushNotifs", 1);
    }),
    (Ti.App.setPromptForPushNotifs = function (val) {
      Ti.App.Properties.setInt("promptForPushNotifs", val);
    }),
    (Ti.App.getCurrentDeviceToken = function () {
      var currentToken = Ti.App.Properties.getString("currentPushToken", "");

      return currentToken;
    });

  var receivePush = function (e) {
    Ti.App.isAndroid && (e.data = e),
      Ti.App.isAndroid || true
        ? e.inBackground &&
          ((null == e.data.pt || "rant" == e.data.pt) && e.data.rant_id
            ? Ti.App.openRantWindow(
                e.data.rant_id,
                false,
                e.data && e.data.rt && 2 == e.data.rt ? 2 : 1,
                e.data && e.data.comment_id ? e.data.comment_id : null
              )
            : "user" == e.data.pt
            ? Ti.App.openProfileWindow(e.data.user_id)
            : "avatars" == e.data.pt
            ? Ti.App.isLoggedIn() &&
              Ti.App.openProfileWindow(Ti.App.Properties.getString("userId"))
            : "collabs" == e.data.pt &&
              Ti.App.tabBar.navigateToTabById("collabs"))
        : setTimeout(function () {
            (null == e.data.pt || "rant" == e.data.pt) && e.data.rant_id
              ? Ti.App.openRantWindow(
                  e.data.rant_id,
                  false,
                  e.data && e.data.rt && 2 == e.data.rt ? 2 : 1,
                  e.data && e.data.comment_id ? e.data.comment_id : null
                )
              : "user" == e.data.pt
              ? Ti.App.openProfileWindow(e.data.user_id)
              : "avatars" == e.data.pt
              ? Ti.App.isLoggedIn() &&
                Ti.App.openProfileWindow(Ti.App.Properties.getString("userId"))
              : "collabs" == e.data.pt &&
                Ti.App.tabBar.navigateToTabById("collabs");
          }, 50);
  };

  var deviceTokenSuccess = function (e) {
    Ti.App.Properties.setString("currentPushToken", e.deviceToken),
      Ti.App.syncNotificationToken();
  };

  var deviceTokenError = function (e) {
    Ti.App.showDialog(
      "Whoops!",
      "Looks like we couldn't enable push notifs. Please make sure they are enabled in your iOS settings for devRant."
    );
  };

  var registerForPush = function () {
    Ti.App.iOS.removeEventListener("usernotificationsettings", registerForPush),
      Ti.Network.registerForPushNotifications({
        success: deviceTokenSuccess,
        error: deviceTokenError,
        callback: receivePush,
      });
  };

  (Ti.App.getNotifTokenFromPrompt = function () {
    if (Ti.App.isAndroid) {
      var ver = Ti.Platform.version;
      ver && ((ver = ver.split(".")), (ver = ver[0]), "8" == ver);

      var core = require("firebase.core");
      core.configure({
        APIKey: "AIzaSyDU7FwTjsSFf8lK6tM74jua_VPcKB_C1M0",
        ApiKey: "AIzaSyDU7FwTjsSFf8lK6tM74jua_VPcKB_C1M0",
        GCMSenderID: "117331229271",
        applicationID: "1:117331229271:android:3fcc8de96de8826e",
        googleAppID: "1:117331229271:android:3fcc8de96de8826e",
      });
      var fcm = require("firebase.cloudmessaging");
      var last_data = fcm.getLastData();

      return (
        last_data && receivePush(last_data),
        fcm.addEventListener("didRefreshRegistrationToken", function (e) {
          deviceTokenSuccess({ deviceToken: e.fcmToken });
        }),
        fcm.addEventListener("didReceiveMessage", function (e) {}),
        void fcm.registerForPushNotifications()
      );

      return void TiGoosh.registerForPushNotifications({
        callback: function (e) {
          receivePush(e);
        },
        success: function (e) {
          e &&
            e.deviceToken &&
            deviceTokenSuccess({ deviceToken: e.deviceToken });
        },
        error: function (err) {},
      });
    }
    8 <= parseInt(Ti.Platform.version.split(".")[0])
      ? (Ti.App.iOS.addEventListener(
          "usernotificationsettings",
          registerForPush
        ),
        Ti.App.iOS.registerUserNotificationSettings({
          types: [
            Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE,
          ],
        }))
      : Ti.Network.registerForPushNotifications({
          types: [
            Ti.Network.NOTIFICATION_TYPE_BADGE,
            Ti.Network.NOTIFICATION_TYPE_ALERT,
            Ti.Network.NOTIFICATION_TYPE_SOUND,
          ],

          success: deviceTokenSuccess,
          error: deviceTokenError,
          callback: receivePush,
        });
  }),
    (Ti.App.syncNotificationToken = function () {
      var token = Ti.App.getCurrentDeviceToken();

      "" == token ||
        Ti.App.api({
          method: "POST",
          endpoint: "users/me/notifications",
          params: {
            token: token,
          },

          includeAuth: true,
        });
    }),
    (Ti.App.deviceNotificationsEnabled = function () {
      return Ti.Network.remoteNotificationsEnabled;
    }),
    (Ti.App.promtForNotificationPermIfNeeded = function () {
      -1 == Ti.App.userSettings.notif_state
        ? showNotificationPrepromt()
        : 1 == Ti.App.userSettings.notif_state &&
          ("" != Ti.App.getCurrentDeviceToken() || showNotificationPrepromt());
    }),
    (Ti.App.setNotifState = function (state) {
      Ti.App.api({
        method: "POST",
        endpoint: "users/me/notifications",
        params: {
          notif_state: state,
        },

        includeAuth: true,
      });
    }),
    (Ti.App.formatRantText = function (text, maxChars) {
      return ((maxChars = maxChars || 300), text.length <= maxChars)
        ? text
        : ((text = text.substr(0, maxChars - 10) + "... [read more]"), text);
    }),
    (Ti.App.shareTwitter = function (rant) {
      var useUrl = "https://devrant.com/rants/" + rant.id;
      if (!Ti.App.isAndroid) {
        var Social = require("dk.napp.social");
        var useImage = rant.attached_image
          ? rant.attached_image.url
          : "https://devrant.com/rants/" + rant.id + "/image.png";
        if (Social.isTwitterSupported())
          return void Social.twitter({
            text: "Check out this devRant: " + useUrl,
            image: useImage,
          });
      } else;

      Ti.Platform.openURL(
        "https://twitter.com/intent/tweet?via=devRantApp&text=" +
          encodeURIComponent("Check out this devRant: " + useUrl)
      );
    }),
    (Ti.App.shareFb = function (rant) {
      var useUrl = "https://devrant.com/" + rant.link;
      if (!Ti.App.isAndroid) {
        var Social = require("dk.napp.social");
        if (Social.isFacebookSupported())
          return void Social.facebook({ url: useUrl });
      } else
        try {
          var intFB = Ti.Android.createIntent({
            action: Ti.Android.ACTION_SEND,
            packageName: "com.facebook.katana",
            className:
              "com.facebook.composer.shareintent.ImplicitShareIntentHandlerDefaultAlias",

            type: "text/plain",
          });

          return (
            intFB.putExtra(Ti.Android.EXTRA_TEXT, useUrl),
            intFB.addCategory(Ti.Android.CATEGORY_LAUNCHER),
            void Ti.Android.currentActivity.startActivity(intFB)
          );
        } catch (x) {}

      Ti.Platform.openURL(
        "https://m.facebook.com/sharer.php?u=" + encodeURIComponent(useUrl)
      );
    }),
    (Ti.App.genericShare = function (rant) {
      var useUrl = "https://devrant.com/rants/" + rant.id;
      if (!Ti.App.isAndroid) {
        var Social = require("dk.napp.social");

        -1 == "android".indexOf("ipad")
          ? Social.activityView({
              text: "Check out this devRant:",
              url: useUrl,
              subject: "Check out this devRant",
              emailIsHTML: false,
            })
          : Social.activityPopover({
              text: "Check out this devRant:",
              url: useUrl,
              view: me.topBar.children[3],
              subject: "Check out this devRant",
              emailIsHTML: false,
            });
      } else {
        var activity = Ti.Android.currentActivity;

        var intent = Ti.Android.createIntent({
          action: Ti.Android.ACTION_SEND,
          type: "text/plain",
        });

        intent.putExtra(
          Ti.Android.EXTRA_TEXT,
          "Check out this devRant: " + useUrl
        ),
          intent.addCategory(Ti.Android.CATEGORY_DEFAULT),
          activity.startActivity(
            Ti.Android.createIntentChooser(intent, "Share rant")
          );
      }
    }),
    (Ti.App.saveRemoteImageToGallery = function (
      imageUrl,
      successCallback,
      failCallback
    ) {
      if (
        Ti.App.isAndroid &&
        !Ti.Android.hasPermission("android.permission.WRITE_EXTERNAL_STORAGE")
      )
        return void Ti.Android.requestPermissions(
          ["android.permission.WRITE_EXTERNAL_STORAGE"],
          function (e) {
            return e.success
              ? void Ti.App.saveRemoteImageToGallery(
                  imageUrl,
                  successCallback,
                  failCallback
                )
              : void failCallback();
          }
        );

      var xhr = Ti.Network.createHTTPClient();
      (xhr.onload = function (e) {
        Ti.Media.saveToPhotoGallery(e.source.responseData), successCallback();
      }),
        (xhr.onerror = function (e) {
          failCallback();
        }),
        xhr.open("GET", imageUrl),
        xhr.setTimeout(15e3),
        xhr.send();
    }),
    (Ti.App.createNotifIndicator = function () {
      var indicatorContainer = Ti.UI.createView({
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 0,
        backgroundColor: Ti.App.colorBgMain,
        touchEnabled: false,
        visible: false,
      });

      var innerCircle = Ti.UI.createView({
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 0,
        touchEnabled: false,
        backgroundColor: Ti.App.colorNotif,
      });

      indicatorContainer.add(innerCircle);

      var lblCount = Ti.UI.createLabel({
        width: "100%",
        height: "100%",
        text: "",
        color: Ti.App.colorBtnInverse,
        touchEnabled: false,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
          fontSize: Ti.App.fontS,
          fontWeight: "bold",
        },
      });

      return (
        indicatorContainer.add(lblCount),
        (indicatorContainer.setIndicator = function (count) {
          0 == count
            ? (indicatorContainer.visible = false)
            : ((lblCount.font = {
                fontSize: 10 > count ? Ti.App.fontBody : Ti.App.fontS,
                fontWeight: "bold",
              }),
              (lblCount.text = 100 > count ? count : "99"),
              (indicatorContainer.visible = true));
        }),
        indicatorContainer
      );
    }),
    (Ti.App.sendLocalNotifIfNeeded = function (notifCount) {
      Ti.App.lastNotifCount != notifCount &&
        ((Ti.App.lastNotifCount = notifCount),
        !Ti.App.isAndroid && Ti.UI.iOS.setAppBadge(notifCount));
    }),
    (Ti.App.getCollabRowTemplate = function (useContainerWidth) {
      for (
        childTemplates = [], i = 0, void 0;
        i < Ti.App.collabTypes.length;
        ++i
      ) {
        var childTemplates;
        var i;
        childTemplates.push({
          type: "Ti.UI.Label",
          bindId: Ti.App.collabTypes[i].id + "_l",
          properties: {
            top: 5,
            text: Ti.App.collabTypes[i].label,
            width: "100%",

            height: Ti.UI.SIZE,
            color: Ti.App.colorHint,
            font: {
              fontWeight: "bold",
              fontSize: Ti.App.fontS,
            },
          },
        }),
          childTemplates.push({
            type: "Ti.UI.Label",
            bindId: Ti.App.collabTypes[i].id,
            properties: {
              color: Ti.App.colorDarkGrey,
              top: 0,

              width: "100%",
              height: Ti.UI.SIZE,
              font: {
                fontSize: Ti.App.fontBody,
              },
            },
          });
      }

      var template = {
        type: "Ti.UI.View",
        events: {},

        properties: {
          width: useContainerWidth,
          height: Ti.UI.SIZE,
          layout: "vertical",
        },

        childTemplates: childTemplates,
      };

      return template;
    }),
    (Ti.App.admControls = function (adm) {
      for (items = [], i = 0, void 0; i < adm.length; ++i) {
        var items;
        var i;
        items.push(adm[i].label);
      }

      var opts = {
        options: items,
      };

      Ti.App.isAndroid ||
        (items.push("Cancel"), (opts.cancel = items.length - 1));

      var dialog = Ti.UI.createOptionDialog(opts);
      dialog.addEventListener("click", function (e) {
        if (!(0 > e.index || e.index > adm.length - 1)) {
          var thisItem = adm[e.index];

          var actionFunc = function () {
            var apiArgs = {
              method: thisItem.method,
              endpoint: thisItem.api,
              params: {},
              callback: function (result) {
                result.success
                  ? Ti.App.showDialog(
                      "Success!",
                      "The action has been completed!"
                    )
                  : Ti.App.showDialog(
                      "Whoops!",
                      "Something went wrong while trying to complete the action."
                    );
              },
              includeAuth: true,
            };

            Ti.App.api(apiArgs);
          };

          if (thisItem.confirm) {
            var confirmDialog = Ti.UI.createAlertDialog({
              cancel: 1,
              buttonNames: ["Ok", "Cancel"],
              message:
                "Are you sure you want to perform this action (" +
                thisItem.label +
                ")?",
              title: "Are you sure?",
            });

            confirmDialog.addEventListener("click", function (e) {
              if (0 == e.index)
                if (thisItem.double_confirm) {
                  var doubleConfirmDialog = Ti.UI.createAlertDialog({
                    cancel: 1,
                    buttonNames: ["Ok", "Cancel"],
                    message:
                      "Are you POSITIVE you want to perform this action (" +
                      thisItem.label +
                      ")? Last check!!",
                    title: "Are you double sure?",
                  });

                  doubleConfirmDialog.addEventListener("click", function (e) {
                    0 == e.index && actionFunc();
                  }),
                    doubleConfirmDialog.show();
                } else actionFunc();
            }),
              confirmDialog.show();
          } else actionFunc();
        }
      }),
        dialog.show();
    });

  var showNotificationPrepromt = function () {
    if (!Ti.App.isAndroid) {
      var dialog = Ti.UI.createAlertDialog({
        cancel: 1,
        buttonNames: ["Yes!", "Not now"],
        message:
          "Receive notifications for engagement on your rants, and updates on new content from the community? (once enabled, you can turn on/off each type of notif from menu -> settings -> notifications)",
        title: "Stay updated?",
      });

      dialog.addEventListener("click", function (e) {
        Ti.App.setPromptForPushNotifs(-1),
          e.index === e.source.cancel ||
            (Ti.App.setNotifState(1), Ti.App.getNotifTokenFromPrompt());
      }),
        dialog.show();
    }
  };

  Ti.App.deviceNotificationsEnabled() && registerForPush();

  var s4;

  if ("" == Ti.App.Properties.getString("guid", "")) {
    s4 = function () {
      var _Mathfloor = Math.floor;
      return _Mathfloor(65536 * (1 + Math.random()))
        .toString(16)
        .substring(1);
    };

    var guid =
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4();
    Ti.App.Properties.setString("guid", guid);
  }

  var parseLaunchArgs = function (timerStuff) {
    var args;
    var feed;
    var curTime;

    Ti.App.isAndroid
      ? ((args = {}),
        Ti.Android.currentActivity.intent &&
          Ti.Android.currentActivity.intent.data &&
          (args.url = Ti.Android.currentActivity.intent.data))
      : (args = Ti.App.getArguments()),
      args.url &&
        (Ti.App.actionFromUrlScheme(args.url),
        Ti.App.isAndroid &&
          Ti.Android.currentActivity &&
          Ti.Android.currentActivity.intent &&
          Ti.Android.currentActivity.intent.data);
  };

  !Ti.App.isAndroid;

  var TopBar = require("ui/common/TopBar");
  Ti.App.topBarGenerator = new TopBar();

  var Voter = require("ui/common/Voter");
  (Ti.App.voter = new Voter()), Ti.UI.setBackgroundColor(Ti.App.colorBg);
  var intialWindow;

  Ti.App.actedOnSplashScreen()
    ? Ti.App.openMainFeed(false)
    : Ti.App.openSplashScreen(),
    Ti.App.isAndroid ||
      Ti.App.iOS.addEventListener("continueactivity", function (e) {
        if ("NSUserActivityTypeBrowsingWeb" === e.activityType) {
          var url = e.webpageURL;

          Ti.App.actionFromUrlScheme(url);
        }
      }),
    Ti.App.isAndroid && parseLaunchArgs(false),
    Ti.App.logStat("Start Session"),
    Ti.App.isAndroid && Ti.App.isLoggedIn() && Ti.App.getNotifTokenFromPrompt();
})();
