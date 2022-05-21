function ImageViewerWindow() {
  var me = this;
  (me.imageInfo = null),
    (me.window = null),
    (me.container = null),
    (me.imageView = null),
    (me.blockingLoader = null),
    (me.init = function (imageInfo) {
      (me.imageInfo = imageInfo), me.createElements();
    }),
    (me.getWindow = function () {
      return me.window;
    }),
    (me.createElements = function () {
      var _Mathfloor = Math.floor;
      (me.window = Ti.UI.createWindow({
        navBarHidden: true,
        backgroundColor: me.imageInfo.backgroundColor
          ? me.imageInfo.backgroundColor
          : "#000",
        width: "100%",
        height: "100%",
        orientationModes: [Ti.UI.PORTRAIT],
      })),
        me.window.addEventListener("close", windowClosed);
      var imgWrapper;
      (imgWrapper = Ti.App.isAndroid
        ? Ti.UI.createView({ width: "100%", height: "100%" })
        : Ti.UI.createScrollView({
            minZoomScale: 1,
            maxZoomScale: 4,
            zoomScale: 1,
            disableBounce: true,
          })),
        me.window.add(imgWrapper);
      var useWidth = Ti.App.realWidth,
        ratio = useWidth / me.imageInfo.width,
        useHeight = _Mathfloor(me.imageInfo.height * ratio);

      useHeight > Ti.App.realHeight &&
        ((useHeight = Ti.App.realHeight),
        (ratio = useHeight / me.imageInfo.height),
        (useWidth = _Mathfloor(me.imageInfo.width * ratio)));
      var options = {
          canScale: true,
          width: useWidth,
          height: useHeight,
          image: me.imageInfo.url,
        },
        isGif = "gif" == me.imageInfo.url.toLowerCase().substr(-3);

      if (
        (Ti.App.isAndroid && (options.enableZoomControls = true),
        Ti.App.isAndroid && isGif)
      )
        (me.imageView = require("com.miga.gifview").createGifView({
          width: useWidth,
          height: useHeight,
          image: me.imageInfo.url,
          autoStart: false,
        })),
          setTimeout(function () {
            me.imageView.start();
          }, 500);
      else if (
        (isGif &&
          (delete options.image,
          Ti.App.loadImage(me.imageInfo.url, function (data) {
            (me.imageView.gif = data),
              (me.imageView.width = useWidth - 1),
              (me.imageView.height = useHeight - 1);
          })),
        !Ti.App.isAndroid)
      )
        me.imageView = Ti.UI.createImageView(options);
      else {
        var TiTouchImageView = require("org.iotashan.TiTouchImageView");
        (me.imageView = TiTouchImageView.createView({
          minZoom: 1,
          maxZoom: 4,
          zoom: 1,
        })),
          Ti.App.loadImage(me.imageInfo.url, function (e) {
            (me.imageView.image = e), (me.imageView.zoom = 1);
          });
      }

      me.imageView.addEventListener("longpress", imageLongPress),
        imgWrapper.add(me.imageView);
      var closeBtnContainer = Ti.UI.createView({
          width: 42,
          height: 42,
          left: 7,
          top: Ti.App.isIphoneX ? 34 : 15,
        }),
        btnBg = Ti.UI.createView({
          width: 42,
          height: 42,
          borderRadius: 21,
          borderWidth: 0,
          backgroundColor: "#000",
          opacity: 0.3,
        });

      closeBtnContainer.add(btnBg),
        me.window.add(closeBtnContainer),
        closeBtnContainer.addEventListener("click", function () {
          me.closeWindow();
        });

      var closeBtnLabel = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,

        color: Ti.App.colorBtnContrast,

        text: "\uE803",
        font: {
          fontFamily: "icomoon",
          fontSize: "32sp",
        },
      });

      closeBtnContainer.add(closeBtnLabel);
    });
  var imageLongPress = function () {
      var items = ["Save Image"],
        opts = {
          options: items,
        };

      Ti.App.isAndroid ||
        (items.push("Cancel"), (opts.cancel = items.length - 1));

      var dialog = Ti.UI.createOptionDialog(opts);
      dialog.addEventListener("click", optionsClick), dialog.show();
    },
    optionsClick = function (e) {
      var options = e.source.getOptions();
      if ("Cancel" != options[e.index] && "Save Image" == options[e.index]) {
        showBlockingLoader();
        var useImageUrl = me.imageInfo.url;
        "rant" == me.imageInfo.type &&
          null != me.imageInfo.id &&
          (useImageUrl =
            "https://devrant.com/rants/" + me.imageInfo.id + "/download"),
          Ti.App.saveRemoteImageToGallery(
            useImageUrl,
            function () {
              removeBlockingLoader(),
                Ti.App.showDialog(
                  "Success!",
                  "The image has been saved to the gallery on your device!"
                ),
                Ti.App.logStat("Image Share", {
                  source: "app",
                  platform: "save",
                  from: "imageviewer",
                });
            },
            function () {
              removeBlockingLoader(),
                Ti.App.showDialog(
                  "Whoops!",
                  "There was a problem saving the image. Please make sure you have a good connection and try again. If the issue persists, please contact info@devrant.io"
                ),
                Ti.App.logStat("Image Share", {
                  source: "app",
                  platform: "savefail",
                  from: "imageviewer",
                });
            }
          );
      }
    },
    showBlockingLoader = function () {
      var BlockingLoader = require("ui/common/BlockingLoader");
      (me.blockingLoader = new BlockingLoader()),
        me.window.add(me.blockingLoader.getElem()),
        me.blockingLoader.showLoader();
    },
    removeBlockingLoader = function () {
      me.blockingLoader.hideLoader(),
        me.window.remove(me.blockingLoader.getElem()),
        (me.blockingLoader = null);
    };

  me.getContainer = function () {
    return me.container;
  };

  var windowClosed = function () {
    me.closeWindow(true);
  };

  return (
    (me.closeWindow = function (noClose) {
      me.window.removeEventListener("close", windowClosed),
        (noClose = noClose || false),
        noClose || me.window.close(),
        (me = null);
    }),
    me
  );
}

module.exports = ImageViewerWindow;
