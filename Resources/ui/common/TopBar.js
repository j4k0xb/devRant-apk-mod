function TopBar() {
  var me = this;
  (me.topBarHeight = 64 - Ti.App.androidHeader),
    Ti.App.isIphoneX && (me.topBarHeight = 84),
    (me.createBar = function (options) {
      return createElements(options);
    });

  var createElements = function (options) {
    var useBtnLft,
      useBtnRt,
      useBtnRtSec,
      container = Ti.UI.createView({
        width: "100%",
        height: me.topBarHeight,
        top: 0,

        backgroundColor: Ti.App.colorBgMain,
      });

    if (options.leftBtnType) {
      switch (options.leftBtnType) {
        case "close":
          useBtnLft = Ti.UI.createLabel({
            bottom: 0,
            left: 0,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            width: 54,
            height: 50,
            color: "#fff",
            text: "\uE803",
            font: {
              fontSize: "32sp",
              fontFamily: "icomoon",
            },
          });

          break;
        case "back":
          useBtnLft = Ti.UI.createLabel({
            bottom: 0,
            left: 0,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            width: 54,
            height: 50,
            color: "#fff",
            text: "\uE807",
            font: {
              fontSize: "32sp",
              fontFamily: "icomoon",
            },
          });

          break;
        case "menu":
          useBtnLft = Ti.UI.createLabel({
            bottom: 0,
            left: 0,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            width: 54,
            height: 50,
            color: "#fff",
            text: "\uE802",
            font: {
              fontSize: "32sp",
              fontFamily: "icomoon",
            },
          });
      }

      container.add(useBtnLft),
        options.callbackLeftBtn &&
          useBtnLft.addEventListener("click", function () {
            options.callbackLeftBtn();
          }),
        useBtnLft.addEventListener("touchstart", function () {
          useBtnLft.opacity = "0.7";
        }),
        useBtnLft.addEventListener("touchend", function () {
          var fadeOutBtn = Ti.UI.createAnimation({
            opacity: 1,
            duration: 350,
          });

          useBtnLft.animate(fadeOutBtn);
        });
    }

    if (void 0 !== options.barTitle || options.showOptionArrow) {
      var lblTitle = Ti.UI.createLabel({
        top:
          "\uE903" == options.barTitle
            ? Ti.App.isIphoneX
              ? 48
              : 27 - Ti.App.androidHeader
            : Ti.App.isIphoneX
            ? 42
            : 20 - Ti.App.androidHeader,
        width: "55%",
        height: Ti.UI.SIZE,
        color: "#fff",
        text: options.barTitle,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        minimumFontSize: 6,
        font: {
          fontFamily: "\uE903" == options.barTitle ? "icomoon" : Ti.App.useFont,
          fontSize: "\uE903" == options.barTitle ? "22sp" : "28sp",
        },
      });

      if (!options.showOptionArrow) container.add(lblTitle);
      else {
        var titleContainer = Ti.UI.createView({
          top: Ti.App.isIphoneX ? 42 : 20 - Ti.App.androidHeader,
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          layout: "horizontal",
        });

        (lblTitle.width = Ti.UI.SIZE),
          (lblTitle.top = 0),
          (lblTitle.minimumFontSize = null),
          titleContainer.add(lblTitle);

        var arrowContainer = Ti.UI.createLabel({
          left: 5,
          top: 6,
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          text: "\uE921",
          color: Ti.App.colorHint,

          font: {
            fontFamily: "icomoon",
            fontSize: "32sp",
          },
        });

        titleContainer.add(arrowContainer),
          options.optionArrowCallback &&
            titleContainer.addEventListener("click", function () {
              options.optionArrowCallback();
            }),
          container.add(titleContainer);
      }
    }

    if (
      ((container.setBarTitle = function (title) {
        lblTitle.text = title;
      }),
      options.rightBtnType)
    ) {
      switch (options.rightBtnType) {
        case "none":
          useBtnRt = Ti.UI.createLabel({
            width: 0,
            height: 0,
            text: "",
          });

          break;
        case "notifs":
          useBtnRt = Ti.UI.createLabel({
            bottom: 0,
            right: 0,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            width: 54,
            height: 50,
            color: "#fff",
            text: "\uE908",
            font: {
              fontSize: "26sp",
              fontFamily: "icomoon",
            },
          });

          break;
        case "calendar":
          useBtnRt = Ti.UI.createLabel({
            bottom: 0,
            right: 0,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            width: 54,
            height: 50,
            color: "#fff",
            text: "\uE90F",
            font: {
              fontSize: "32sp",
              fontFamily: "icomoon",
            },
          });

          break;
        case "actions":
          useBtnRt = Ti.UI.createLabel({
            bottom: 0,
            right: 0,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            width: 54,
            height: 50,
            color: "#fff",
            text: "\uE812",
            font: {
              fontSize: "32sp",
              fontFamily: "icomoon",
            },
          });

          break;

        case "refresh":
          useBtnRt = Ti.UI.createLabel({
            bottom: 0,
            right: 0,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            width: 48,
            height: 50,
            color: "#fff",
            text: "\uE902",
            font: {
              fontSize: "32sp",
              fontFamily: "icomoon",
            },
          });

          break;
        case "post":
          useBtnRt = Ti.UI.createView({
            bottom: 10,
            right: 15,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            backgroundColor: Ti.App.colorBtnBgOne,
            borderRadius: 12,
            borderWidth: 0,
          });

          var lblPost = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            left: 12,
            right: 12,
            top: 4,
            bottom: 4,
            color: Ti.App.colorBtnText,
            text: "Post",
            font: {
              fontSize: Ti.App.fontM,
              fontWeight: "bold",
            },
          });

          useBtnRt.add(lblPost);
          break;
        case "searchCta":
          useBtnRt = Ti.UI.createView({
            bottom: 10,
            right: 15,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            backgroundColor: Ti.App.colorBtnBgOne,
            borderRadius: 12,
            borderWidth: 0,
          });

          var lblPost = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            left: 12,
            right: 12,
            top: 5,
            bottom: 5,
            color: Ti.App.colorBtnText,
            text: "\uE801",
            font: {
              fontSize: "22sp",
              fontFamily: "icomoon",
            },
          });

          useBtnRt.add(lblPost);
          break;
        case "send":
          useBtnRt = Ti.UI.createView({
            bottom: 10,
            right: 15,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            backgroundColor: Ti.App.colorBtnBgOne,
            borderRadius: 12,
            borderWidth: 0,
          });

          var lblPost = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            left: 12,
            right: 12,
            top: 4,
            bottom: 4,
            color: Ti.App.colorBtnText,
            text: "Send",
            font: {
              fontSize: Ti.App.fontM,
              fontWeight: "bold",
            },
          });

          useBtnRt.add(lblPost);
          break;
        case "edit":
          useBtnRt = Ti.UI.createView({
            bottom: 10,
            right: 15,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            backgroundColor: Ti.App.colorBtnBgOne,
            borderRadius: 12,
            borderWidth: 0,
          });

          var lblPost = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            left: 12,
            right: 11,
            top: 6,
            bottom: 6,
            color: Ti.App.colorBtnText,
            text: "\uE918",
            font: {
              fontSize: "20sp",
              fontFamily: "icomoon",
            },
          });

          useBtnRt.add(lblPost);
          break;
        case "done":
          useBtnRt = Ti.UI.createView({
            bottom: 10,
            right: 15,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            backgroundColor: Ti.App.colorBtnBgOne,
            borderRadius: 12,
            borderWidth: 0,
          });

          var lblPost = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            left: 12,
            right: 12,
            top: 4,
            bottom: 4,
            color: Ti.App.colorBtnText,
            text: "Done",
            font: {
              fontSize: Ti.App.fontM,
              fontWeight: "bold",
            },
          });

          useBtnRt.add(lblPost);
          break;
        case "add":
          useBtnRt = Ti.UI.createView({
            bottom: 10,
            right: 15,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            backgroundColor: Ti.App.colorBtnBgOne,
            borderRadius: 12,
            borderWidth: 0,
          });

          var lblPost = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            left: 12,
            right: 12,
            top: 4,
            bottom: 4,
            color: Ti.App.colorBtnText,
            text: "Add",
            font: {
              fontSize: Ti.App.fontM,
              fontWeight: "bold",
            },
          });

          useBtnRt.add(lblPost);
          break;
        case "save":
          useBtnRt = Ti.UI.createView({
            bottom: 10,
            right: 15,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            backgroundColor: Ti.App.colorBtnBgOne,
            borderRadius: 12,
            borderWidth: 0,
          });

          var lblPost = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            left: 12,
            right: 12,
            top: 4,
            bottom: 4,
            color: Ti.App.colorBtnText,
            text: "Save",
            font: {
              fontSize: Ti.App.fontM,
              fontWeight: "bold",
            },
          });

          useBtnRt.add(lblPost);
          break;
        case "clear":
          useBtnRt = Ti.UI.createView({
            bottom: 10,
            right: 15,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            backgroundColor: Ti.App.colorBtnBgOne,
            borderRadius: 12,
            borderWidth: 0,
            visible: false,
          });

          var lblClear = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            left: 12,
            right: 12,
            top: 4,
            bottom: 4,
            color: Ti.App.colorBtnText,
            text: "Clear",
            font: {
              fontSize: Ti.App.fontM,
              fontWeight: "bold",
            },
          });

          useBtnRt.add(lblClear);
          break;
        case "filter":
          useBtnRt = Ti.UI.createLabel({
            bottom: 0,
            right: 5,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            width: 42,
            height: 50,
            color: Ti.App.colorBtnContrast,
            text: "\uE905",
            font: {
              fontSize: "32sp",
              fontFamily: "icomoon",
            },
          });
      }

      container.add(useBtnRt),
        options.callbackRightBtn &&
          useBtnRt.addEventListener("click", function () {
            options.callbackRightBtn();
          }),
        useBtnRt.addEventListener("touchstart", function () {
          useBtnRt.opacity = "0.7";
        }),
        useBtnRt.addEventListener("touchend", function () {
          var fadeOutBtn = Ti.UI.createAnimation({
            opacity: 1,
            duration: 350,
          });

          useBtnRt.animate(fadeOutBtn);
        });
    }

    if (options.rightSecondaryBtnType) {
      switch (options.rightSecondaryBtnType) {
        case "none":
          useBtnRtSec = Ti.UI.createLabel({
            width: 0,
            height: 0,
            text: "",
          });

          break;
        case "filter":
          useBtnRtSec = Ti.UI.createLabel({
            bottom: 0,
            right: 44,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            width: 42,
            height: 50,
            color: Ti.App.colorBtnContrast,
            text: "\uE905",
            font: {
              fontSize: "32sp",
              fontFamily: "icomoon",
            },
          });

          break;
        case "share":
          useBtnRtSec = Ti.UI.createLabel({
            bottom: 0,
            right: 44,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            width: 54,
            height: 50,
            color: "#fff",
            text: Ti.App.isAndroid ? "\uE900" : "\uE901",
            font: {
              fontSize: "32sp",
              fontFamily: "icomoon",
            },
          });

          break;
        case "actions":
          useBtnRtSec = Ti.UI.createLabel({
            bottom: 0,
            right: 58,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            width: 54,
            height: 50,
            color: "#fff",
            text: "\uE812",
            font: {
              fontSize: "32sp",
              fontFamily: "icomoon",
            },
          });

          break;
        case "refresh":
          useBtnRtSec = Ti.UI.createLabel({
            bottom: 0,
            right: 48,
            textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
            width: 48,
            height: 50,
            color: "#fff",
            text: "\uE902",
            font: {
              fontSize: "32sp",
              fontFamily: "icomoon",
            },
          });
      }

      container.add(useBtnRtSec),
        options.callbackRightSecondaryBtn &&
          useBtnRtSec.addEventListener("click", function () {
            options.callbackRightSecondaryBtn();
          }),
        useBtnRtSec.addEventListener("touchstart", function () {
          useBtnRtSec.opacity = "0.7";
        }),
        useBtnRtSec.addEventListener("touchend", function () {
          var fadeOutBtn = Ti.UI.createAnimation({
            opacity: 1,
            duration: 350,
          });

          useBtnRtSec.animate(fadeOutBtn);
        });
    }

    return container;
  };

  return me;
}

module.exports = TopBar;
