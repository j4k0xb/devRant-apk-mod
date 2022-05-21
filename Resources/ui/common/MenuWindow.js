function MenuWindow() {
  var window,
    container,
    me = this,
    menuItems = [
      {
        id: "signup",
        icon: "\uE808",
        iconSize: 28,
        mainLabel: "Sign Up",
        subLabel: "Personalized feed, notifs & more!",
        loggedOutOnly: true,
      },

      {
        id: "login",
        icon: "\uE80B",
        iconSize: 28,
        mainLabel: "Log In",
        subLabel: "Welcome back!",
        loggedOutOnly: true,
      },

      {
        id: "profile",
        icon: "\uE808",
        iconSize: 28,
        mainLabel: "Profile",
        subLabel: "Edit your profile",
        loggedInOnly: true,
      },

      {
        id: "discussions",
        icon: "\uE806",
        iconSize: 25,
        mainLabel: "Discussions",
        subLabel: "Rants with active commenting",
      },

      {
        id: "weekly",
        icon: "\uE90F",
        iconSize: 28,
        mainLabel: "Weekly Rant",
        subLabel: "A new topic each week",
      },

      {
        id: "search",
        icon: "\uE801",
        iconSize: 28,
        mainLabel: "Search",
        subLabel: "Find rants by keywords",
      },

      {
        id: "swag",
        icon: "\uE914",
        iconSize: 28,
        mainLabel: "Swag!",
        subLabel: "Free tastes great!",
      },

      {
        id: "settings",
        icon: "\uE80F",
        iconSize: 28,
        mainLabel: "Settings",
        subLabel: "Notifs, dark theme & more",
      },

      {
        id: "supporters",
        icon: "\uE910",
        iconTop: 8,
        iconSize: 16,
        mainLabel: "Supporters",
        subLabel: "devRant++ current supporters",
      },

      {
        id: "cartoons",
        icon: "\uE91B",
        iconSize: 28,
        mainLabel: "Cartoons",
        subLabel: "Rants brought to life",
      },

      {
        id: "podcasts",
        icon: "\uE91F",
        iconSize: 28,
        mainLabel: "Podcasts",
        subLabel: "Interviews with world-class devs",
      },

      {
        id: "twitter",
        icon: "\uE909",
        iconSize: 28,
        mainLabel: "Twitter",
        subLabel: "Follow us on Twitter",
      },

      {
        id: "facebook",
        icon: "\uE915",
        iconSize: 28,
        mainLabel: "Facebook",
        subLabel: "Follow us on Facebook",
      },

      {
        id: "tracker",
        icon: "\uE906",
        iconSize: 28,
        mainLabel: "Issue Tracker",
        subLabel: "Report bugs or suggest features",
      },

      {
        id: "about",
        icon: "\uE811",
        iconSize: 28,
        mainLabel: "About",
        subLabel: "Who, what, where",
      },
    ];

  (me.init = function (options) {
    createElements();
  }),
    (me.getWindow = function () {
      return window;
    });

  var createElements = function () {
    var iconSectionWidth = 40;

    window = Ti.UI[Ti.App.isAndroid ? "createView" : "createWindow"]({
      top: 0,
      width: "100%",

      backgroundColor: Ti.App.colorBg,

      navBarHidden: true,
      height: Ti.UI.FILL,
      bottom: Ti.App.isAndroid ? Ti.App.tabBarHeight : 0,
    });
    var topBarOptions = {
        leftBtnType: null,
        rightBtnType: null,
        barTitle: "More",
      },
      topBar = Ti.App.topBarGenerator.createBar(topBarOptions);

    if (
      (window.add(topBar),
      (container = Ti.UI.createScrollView({
        top: Ti.App.topBarGenerator.topBarHeight,
        width: "100%",
        height: Ti.UI.FILL,
        layout: "vertical",
        scrollType: "vertical",
      })),
      window.add(container),
      !Ti.App.dpp)
    ) {
      var supporterBannerContainer = me.generateSupporterBar();

      container.add(supporterBannerContainer);
    }

    for (
      var thisMenuItem, loggedIn = Ti.App.isLoggedIn(), i = 0;
      i < menuItems.length;
      ++i
    )
      if (
        ((thisMenuItem = menuItems[i]),
        !thisMenuItem.loggedInOnly || loggedIn) &&
        !(thisMenuItem.loggedOutOnly && loggedIn)
      ) {
        var itemContainer = Ti.UI.createView({
            top: 4,
            width: "100%",
            height: Ti.UI.SIZE,
            layout: "vertical",
            menuOptionIndex: i,
          }),
          innerContainer = Ti.UI.createView({
            width: "100%",
            height: Ti.UI.SIZE,
            touchEnabled: false,
          });

        itemContainer.add(innerContainer);

        var lblIcon = Ti.UI.createLabel({
          top: 2,
          width: 40,
          height: Ti.UI.SIZE,
          left: 5,

          color: Ti.App.colorFieldIcon,
          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
          font: {
            fontFamily: "icomoon",
            fontSize: thisMenuItem.iconSize + "sp",
          },

          text: thisMenuItem.icon,
          touchEnabled: false,
        });

        thisMenuItem.iconTop && (lblIcon.top = thisMenuItem.iconTop),
          innerContainer.add(lblIcon);
        var textContainer = Ti.UI.createView({
            top: 0,
            left: 50,
            width: Ti.App.realWidth - 40 - 15,

            height: Ti.UI.SIZE,
            layout: "vertical",
            touchEnabled: false,
          }),
          lblMainLabel = Ti.UI.createLabel({
            left: 0,
            width: "97%",
            height: Ti.UI.SIZE,
            text: thisMenuItem.mainLabel,
            color: Ti.App.colorTabText,
            font: {
              fontFamily: Ti.App.useFont,
              fontSize: Ti.App.fontL,
              fontWeight: "bold",
            },

            touchEnabled: false,
          });

        textContainer.add(lblMainLabel);

        var lblSubLabel = Ti.UI.createLabel({
          top: -1,
          bottom: 4,
          left: 0,
          width: "97%",
          height: Ti.UI.SIZE,
          text: thisMenuItem.subLabel,
          color: Ti.App.colorHint,
          font: {
            fontSize: "13sp",
            fontWeight: "bold",
          },

          touchEnabled: false,
        });

        textContainer.add(lblSubLabel), innerContainer.add(textContainer);

        var dividerLine = Ti.UI.createView({
          top: 4,
          width: "100%",
          height: 1,
          backgroundColor: Ti.App.colorLine,
          touchEnabled: false,
        });

        itemContainer.add(dividerLine), container.add(itemContainer);
      }

    container.addEventListener("click", menuOptionClicked);
  };

  me.generateSupporterBar = function () {
    var supporterBarHeight = 65,
      supporterBannerContainer = Ti.UI.createView({
        width: Ti.App.realWidth,
        height: 65,
        backgroundColor: Ti.App.colorBgTopTabs,
      });

    supporterBannerContainer.addEventListener("click", function () {
      Ti.App.openSupporterInfoWindow();
    });

    var supporterImageBarWidth;

    (supporterImageBarWidth = 65 / 298),
      (supporterImageBarWidth = 371 * supporterImageBarWidth);

    var supporterBarImage = Ti.UI.createImageView({
      left: 0,
      top: 0,
      width: supporterImageBarWidth,
      height: 65,
      image: "/ui/supporter-menu-banner1.png",
    });

    supporterBannerContainer.add(supporterBarImage);

    var supporterBtmLine = Ti.UI.createImageView({
      bottom: 0,
      width: "100%",
      height: 1,
      backgroundColor: Ti.App.colorLine,
    });

    supporterBannerContainer.add(supporterBtmLine);
    var supporterTextContainer = Ti.UI.createView({
        right: 0,
        width: Ti.App.realWidth - supporterImageBarWidth - 10,
        height: Ti.UI.SIZE,
        layout: "vertical",
      }),
      lblSupporterBannerText = Ti.UI.createLabel({
        left: 0,
        text: "Help Support devRant",
        width: "100%",
        height: Ti.UI.SIZE,
        color: "#fff",
        font: {
          fontWeight: "bold",
          fontSize: Ti.App.fontM,
        },
      });

    return (
      supporterTextContainer.add(lblSupporterBannerText),
      (lblSupporterBannerText = Ti.UI.createLabel({
        top: 2,
        left: 0,
        width: "100%",
        height: Ti.UI.SIZE,
        text: "Join the devRant++ supporter program",
        color: Ti.App.colorHint,
        font: { fontWeight: "bold", fontSize: Ti.App.fontS },
      })),
      supporterTextContainer.add(lblSupporterBannerText),
      supporterBannerContainer.add(supporterTextContainer),
      supporterBannerContainer
    );
  };

  var menuOptionClicked = function (e) {
    var clickedItem = menuItems[e.source.menuOptionIndex];
    null == clickedItem ||
      me[
        "callback" +
          clickedItem.id.charAt(0).toUpperCase() +
          clickedItem.id.slice(1)
      ]();
  };

  return (
    (me.callbackLogin = function () {
      Ti.App.openLoginWindow();
    }),
    (me.callbackSignup = function () {
      Ti.App.openSignupWindow("more");
    }),
    (me.callbackProfile = function () {
      Ti.App.openProfileWindow(Ti.App.Properties.getString("userId"));
    }),
    (me.callbackDiscussions = function () {
      Ti.App.openDiscussionsWindow();
    }),
    (me.callbackWeekly = function () {
      Ti.App.openGroupRantWindow();
    }),
    (me.callbackSwag = function () {
      Ti.App.openSwagWindow();
    }),
    (me.callbackSearch = function () {
      Ti.App.openSearchWindow();
    }),
    (me.callbackSettings = function () {
      Ti.App.openSettingsWindow();
    }),
    (me.callbackSupporters = function () {
      Ti.App.openSupporterListWindow();
    }),
    (me.callbackCartoons = function () {
      Ti.Platform.openURL(
        "https://www.youtube.com/channel/UCyJ69RzSnzXayyp-UOoZytg/search?query=cartoon"
      );
    }),
    (me.callbackPodcasts = function () {
      Ti.Platform.openURL(
        "https://devrant.com/podcasts/episode-2-yevgeniy-brikman"
      );
    }),
    (me.callbackTwitter = function () {
      Ti.Platform.openURL("https://twitter.com/devrantapp");
    }),
    (me.callbackFacebook = function () {
      Ti.Platform.openURL("https://www.facebook.com/devrantapp/");
    }),
    (me.callbackTracker = function () {
      Ti.Platform.openURL("https://github.com/devRant/devRant");
    }),
    (me.callbackAbout = function () {
      var AboutWindow = require("ui/common/AboutWindow"),
        aboutWindow = new AboutWindow();
      aboutWindow.init();
    }),
    (me.closeWindow = function () {}),
    me
  );
}

module.exports = MenuWindow;
