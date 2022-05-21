function SplashWindow() {
  var me = this;

  return (
    (me.window = null),
    (me.init = function () {
      me.createElements(), me.window.open(), Ti.App.logStat("Viewed Splash");
    }),
    (me.getWindow = function () {
      return me.window;
    }),
    (me.createElements = function () {
      me.createWindow();
      var topSection = Ti.UI.createView({
        top: 0,
        width: "100%",
        height: Ti.App.realHeight - 160,
      });
      me.window.add(topSection);
      var imgHeader = Ti.UI.createImageView({
        top: 375 <= Ti.App.realWidth ? 40 : 30,
        image: "/ui/cartoon-landing1.png",
        height: Ti.App.realHeight - (375 <= Ti.App.realWidth ? 330 : 290),
        defaultImage: "",
      });
      topSection.add(imgHeader);
      var titleAndSubtitleContainer = Ti.UI.createView({
        bottom: 375 <= Ti.App.realWidth ? 30 : 20,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        layout: "vertical",
      });
      topSection.add(titleAndSubtitleContainer);
      var lblTitle = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#fff",
        text: "\uE903",
        font: {
          fontSize: 375 <= Ti.App.realWidth ? "44sp" : "35sp",
          fontFamily: "icomoon",
        },
      });
      titleAndSubtitleContainer.add(lblTitle);
      var lblSubtitle = Ti.UI.createLabel({
        top: 6,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#c8c8d0",
        text: 'new Rant("fml");',
        font: {
          fontSize: 375 <= Ti.App.realWidth ? Ti.App.fontBtn : Ti.App.fontM,
          fontFamily: Ti.App.useFont,
        },
      });
      titleAndSubtitleContainer.add(lblSubtitle);
      var bottomSection = Ti.UI.createView({
        bottom: 0,
        width: "100%",
        height: 160,
        backgroundColor: Ti.App.colorDarkBlue,
      });
      me.window.add(bottomSection);
      var buttonContainer = Ti.UI.createView({
        width: "85%",
        height: Ti.UI.SIZE,
        layout: "vertical",
      });
      bottomSection.add(buttonContainer);
      var btnSignUp = Ti.App.createBigRoundedButton("Sign Up", "red");
      (btnSignUp.width = "100%"),
        buttonContainer.add(btnSignUp),
        btnSignUp.addEventListener("click", me.btnSignUpClicked),
        btnSignUp.addEventListener("touchstart", function () {
          btnSignUp.opacity = "0.7";
        }),
        btnSignUp.addEventListener("touchend", function () {
          var fadeOutBtn = Ti.UI.createAnimation({ opacity: 1, duration: 350 });
          btnSignUp.animate(fadeOutBtn);
        });
      var bottomButtonContainer = Ti.UI.createView({
        top: 10,
        width: "100%",
        height: Ti.UI.SIZE,
      });
      buttonContainer.add(bottomButtonContainer);
      var btnLogIn = Ti.App.createBigRoundedButton("Login", "blue");
      (btnLogIn.width = 0.85 * (0.5 * Ti.App.realWidth) - 5),
        (btnLogIn.left = 0),
        bottomButtonContainer.add(btnLogIn),
        btnLogIn.addEventListener("click", me.btnLogInClicked),
        btnLogIn.addEventListener("touchstart", function () {
          btnLogIn.opacity = "0.7";
        }),
        btnLogIn.addEventListener("touchend", function () {
          var fadeOutBtn = Ti.UI.createAnimation({ opacity: 1, duration: 350 });
          btnLogIn.animate(fadeOutBtn);
        });
      var btnSkip = Ti.App.createBigRoundedButton("Skip", "blue");
      (btnSkip.width = 0.85 * (0.5 * Ti.App.realWidth) - 5),
        (btnSkip.right = 0),
        bottomButtonContainer.add(btnSkip),
        btnSkip.addEventListener("click", me.btnSkipClicked),
        btnSkip.addEventListener("touchstart", function () {
          btnSkip.opacity = "0.7";
        }),
        btnSkip.addEventListener("touchend", function () {
          var fadeOutBtn = Ti.UI.createAnimation({ opacity: 1, duration: 350 });
          btnSkip.animate(fadeOutBtn);
        });
    }),
    (me.btnLogInClicked = function () {
      Ti.App.openLoginWindow();
    }),
    (me.btnSkipClicked = function () {
      Ti.App.setActedOnSplashScreen(1),
        Ti.App.savedTabs.rants ||
          (Ti.App.openMainFeed(),
          (me.window.exitOnClose = false),
          setTimeout(function () {
            me.closeWindow(false);
          }, 1e3)),
        Ti.App.logStat("Sign Up Skip");
    }),
    (me.btnSignUpClicked = function () {
      Ti.App.openSignupWindow("splash");
    }),
    (me.createWindow = function () {
      me.window = Ti.UI.createWindow({
        navBarHidden: true,
        backgroundColor: Ti.App.colorModalBg,
        exitOnClose: true,
        orientationModes: [Ti.UI.PORTRAIT],
      });
    }),
    (me.closeWindow = function (animated) {
      null == animated && (animated = true),
        (Ti.App.splashWindow = null),
        me.window.close({ animated: animated }),
        (me = null);
    }),
    me
  );
}

module.exports = SplashWindow;
