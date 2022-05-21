function PostTextArea() {
  var me = this;
  (me.container = null),
    (me.input = null),
    (me.attachedImage = null),
    (me.lblAttach = null),
    (me.options = null),
    (me.type = null),
    (me.init = function (placeholderText, showAttach, type, options) {
      (me.options = options || {}),
        (me.type = type),
        (me.container = Ti.UI.createView({
          width: "100%",
          height: Ti.UI.SIZE,
        }));

      var maxLen;

      maxLen = me.options.maxLen
        ? options.maxLen
        : "comment" == type
        ? Ti.App.dpp
          ? 2e3
          : 1e3
        : 5e3;

      var textarea = createInputArea(placeholderText, maxLen, showAttach, type);

      me.container.add(textarea);
    }),
    (me.getElem = function () {
      return me.container;
    }),
    (me.getValue = function () {
      return me.input.value;
    });
  var createInputArea = function (placeholder, startCount, showAttach, type) {
      var useHeight,
        footerHeight = 35;

      useHeight = me.options.height
        ? me.options.height
        : Ti.App.isAndroid
        ? (Ti.App.realHeight - Ti.App.androidHeader) *
          ("comment" == type ? 0.4 : 0.3)
        : "rant" == type
        ? Ti.App.realHeight - 35 - 116 - 90
        : Ti.App.realHeight - 35 - 60 - 90 + Ti.App.androidHeader;
      var container = Ti.UI.createView({
          width: "100%",

          height: useHeight,
          top: 15,
          backgroundColor: Ti.App.colorField,
          borderRadius: 12,
          borderWidth: 0,
        }),
        inputAndHint = Ti.UI.createView({
          top: 0,
          bottom: 35,
          width: "95%",
          height: Ti.UI.FILL,
        });

      container.add(inputAndHint);

      var useLeft = 6;

      if (me.options.icon) {
        var lblHintIcon = Ti.UI.createLabel({
          top: 8,
          left: 6,
          width: 40,
          height: Ti.UI.SIZE,
          color: Ti.App.colorFieldIcon,

          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
          text: me.options.icon,
          font: {
            fontSize: "28sp",
            fontFamily: "icomoon",
          },
        });

        inputAndHint.add(lblHintIcon), (useLeft = 50);
      }

      var lblHint = Ti.UI.createLabel({
        top: 8,
        left: useLeft,
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: Ti.App.colorHint,
        text: placeholder,
        font: {
          fontSize: Ti.App.fontM,
        },
      });

      (me.setPlaceholder = function (text) {
        lblHint.text = text;
      }),
        inputAndHint.add(lblHint),
        (container.input = Ti.UI.createTextArea({
          left: me.options.icon ? 46 : 0,
          width: me.options.icon ? Ti.UI.FILL : "100%",
          height: "100%",

          backgroundColor: "transparent",

          color: Ti.App.colorDarkGrey,
          autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_SENTENCES,
          font: {
            fontSize: Ti.App.fontM,
          },

          suppressReturn: false,
        })),
        (me.input = container.input),
        inputAndHint.add(container.input);

      var footer = Ti.UI.createView({
        bottom: 0,
        width: "100%",
        height: 35,
        backgroundColor: me.options.whiteBottom
          ? Ti.App.colorField
          : Ti.App.colorFieldFooter,
      });

      if (
        (container.add(footer),
        (container.count = Ti.UI.createLabel({
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          left: 10,
          text: startCount,
          color: me.options.whiteBottom
            ? Ti.App.colorHint
            : Ti.App.colorTextContrastSubtle,
          font: { fontSize: Ti.App.fontS, fontWeight: "bold" },
        })),
        footer.add(container.count),
        me.options.panelText)
      ) {
        var lblBottomText = Ti.UI.createLabel({
          right: 10,
          color: Ti.App.colorTextContrastSubtle,
          text: me.options.panelText,
          font: {
            fontSize: Ti.App.fontS,
            fontWeight: "bold",
          },
        });

        footer.add(lblBottomText);
      }

      if (showAttach) {
        var btnAttach = Ti.UI.createView({
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          layout: "horizontal",
          right: 10,
        });

        footer.add(btnAttach),
          btnAttach.addEventListener("click", promptAttachImage);

        var lblIcon = Ti.UI.createLabel({
          color: Ti.App.colorTextContrastSubtle,
          font: {
            fontSize: "19sp",
            fontFamily: "icomoon",
          },

          text: "\uE805",
        });

        btnAttach.add(lblIcon),
          (me.lblAttach = Ti.UI.createLabel({
            left: 5,
            color: Ti.App.colorTextContrastSubtle,
            text: "Attach img/gif",
            font: {
              fontSize: Ti.App.fontS,
              fontWeight: "bold",
            },
          })),
          btnAttach.add(me.lblAttach);
      }

      var recalculateChrs = function (e) {
        (container.count.text = startCount - e.value.length),
          e.value.length
            ? lblHint.visible && (lblHint.visible = false)
            : !lblHint.visible && (lblHint.visible = true);
      };

      return (
        Ti.App.keyboardFrameChangedListener &&
          "collab" != me.type &&
          Ti.App.removeEventListener(
            "keyboardframechanged",
            Ti.App.keyboardFrameChangedListener
          ),
        (Ti.App.keyboardFrameChangedListener = function (e) {
          container.height =
            "rant" == type
              ? Ti.App.realHeight - e.keyboardFrame.height - 35 - 170
              : Ti.App.realHeight - e.keyboardFrame.height - 35 - 100 - 25;
        }),
        "collab" != me.type &&
          Ti.App.addEventListener(
            "keyboardframechanged",
            Ti.App.keyboardFrameChangedListener
          ),
        container.input.addEventListener("change", recalculateChrs),
        recalculateChrs(container.input),
        container
      );
    },
    promptAttachImage = function () {
      if (null != me.attachedImage)
        return (
          (me.attachedImage = null), void (me.lblAttach.text = "Attach img/gif")
        );

      if (
        Ti.App.isAndroid &&
        !Ti.Android.hasPermission("android.permission.READ_EXTERNAL_STORAGE")
      )
        return void Ti.Android.requestPermissions(
          ["android.permission.READ_EXTERNAL_STORAGE"],
          function (e) {
            e.success
              ? promptAttachImage()
              : Ti.App.showDialog(
                  "Whoops!",
                  "It seems like sometihng went wrong with the gallery permissions. Please try again."
                );
          }
        );

      var params = {
        mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
        allowEditing: false,
        success: photoSelected,
      };

      Ti.Media.openPhotoGallery(params);
    },
    photoSelected = function (e) {
      (me.attachedImage =
        e.isGIF ||
        (Ti.App.isAndroid &&
          e.media &&
          e.media.file &&
          e.media.file.name &&
          e.media.file &&
          "gif" == e.media.file.name.toLowerCase().substr(-3))
          ? e.isGIF
            ? e.gifmedia
            : e.media
          : scalePhoto(e.media)),
        5242880 < me.attachedImage.length
          ? ((me.attachedImage = null),
            Ti.App.showDialog(
              "Whoops!",
              "The image you're trying to upload is too big. Please try one that's less than 5mb."
            ))
          : (me.lblAttach.text = "Remove image");
    },
    scalePhoto = function (photo) {
      var maxBigDimen = 1400,
        width = photo.getWidth(),
        height = photo.getHeight(),
        ratio = 0;

      return (
        width >= height
          ? 1400 < width &&
            ((ratio = 1400 / width),
            (width = 1400),
            (height *= ratio),
            (photo = photo.imageAsResized(width, height)))
          : 1400 < height &&
            ((ratio = 1400 / height),
            (height = 1400),
            (width *= ratio),
            (photo = photo.imageAsResized(width, height))),
        photo
      );
    };

  return me;
}

module.exports = PostTextArea;
