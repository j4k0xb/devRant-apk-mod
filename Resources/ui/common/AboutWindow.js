function AboutWindow() {
  var me = this;

  (me.window = null), (me.container = null), (me.contentContainer = null);

  var _loader = null;

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
        me.window.add(me.container);

      var ContentLoader = require("ui/common/ContentLoader");

      _loader = new ContentLoader();
      var loaderElement = _loader.getElem();
      (loaderElement.zIndex = 1),
        me.container.add(loaderElement),
        createSubSections();
    });
  var windowOpened = function () {},
    createSubSections = function () {
      var _Mathround = Math.round;
      createTopBar(),
        (me.contentContainer = Ti.UI.createView({
          top: Ti.App.topBarGenerator.topBarHeight,
          width: "100%",
          height: Ti.UI.FILL,
        })),
        me.container.add(me.contentContainer);
      var webview = Titanium.UI.createWebView({
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: Ti.App.colorBg,
        enableZoomControls: false,
      });
      me.contentContainer.add(webview);
      var xhr = Ti.Network.createHTTPClient();
      Ti.App.addEventListener("openLinkUrl", openUrlFromLink),
        _loader.showLoader(),
        (xhr.onload = function (e) {
          null == me ||
            (_loader.hideLoader(), webview.setHtml(this.responseText));
        }),
        (xhr.onerror = function (e) {
          Ti.App.showDialog(
            "Whoops!",
            "There was an error loading the about page. Please try again!"
          );
        });
      var date = new Date();
      date.setHours(date.getHours() + _Mathround(date.getMinutes() / 60)),
        date.setMinutes(0),
        date.setSeconds(0),
        date.setMilliseconds(0),
        xhr.open(
          "GET",
          "https://devrant.com/app-pages/about?theme=" +
            (1 == Ti.App.theme ? "light" : "dark") +
            "&cb=" +
            date.getTime()
        ),
        xhr.setTimeout(5e3),
        xhr.send();
    },
    openUrlFromLink = function (e) {
      if (e.isEmail) {
        var emailDialog = Ti.UI.createEmailDialog();

        return (
          (emailDialog.subject = "devRant question/feedback"),
          (emailDialog.toRecipients = ["info@devrant.io"]),
          void emailDialog.open()
        );
      }
      Ti.Platform.openURL(e.url);
    },
    createTopBar = function () {
      var topBarOptions = {
          leftBtnType: "close",
          rightBtnType: "none",
          barTitle: "About",
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
        noClose || me.window.close({ animated: animated }),
        (me = null);
    }),
    me
  );
}

module.exports = AboutWindow;
