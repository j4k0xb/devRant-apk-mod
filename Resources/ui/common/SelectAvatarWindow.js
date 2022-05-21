function SelectAvatarWindow() {
  var me = this;

  (me.window = null), (me.container = null), (me.contentContainer = null);
  var numAvatarsFetch = 14,
    thumbContainer = null,
    blockingLoader = null,
    thumbSize = 93,
    thumbPaddingX = 12,
    thumbPaddingY = 12,
    firstThumbPadding = 18,
    selectedAvatar = null;

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
        backgroundColor: Ti.App.colorBgMain,
        width: "100%",
        height: "100%",
        orientationModes: [Ti.UI.PORTRAIT],
      })),
        me.window.addEventListener("close", windowClosed),
        createSubSections();

      var BlockingLoader = require("ui/common/BlockingLoader");

      (blockingLoader = new BlockingLoader()),
        me.window.add(blockingLoader.getElem()),
        fetchThumbs();
    });
  var windowOpened = function () {},
    createSubSections = function () {
      (me.btnClose = Ti.UI.createLabel({
        top: 10,
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
      })),
        me.window.add(me.btnClose),
        me.btnClose.addEventListener("click", me.closeWindow);
      var contentContainer = Ti.UI.createView({
          width: Ti.App.realWidth,
          height: Ti.UI.SIZE,
          layout: "vertical",
        }),
        lblYourAvatar = Ti.UI.createLabel({
          width: "60%",
          height: Ti.UI.SIZE,
          text: "Your Avatar",
          color: Ti.App.colorTextContrast,
          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
          font: {
            fontSize: Ti.App.fontXL,
            fontFamily: Ti.App.useFont,
          },
        });

      contentContainer.add(lblYourAvatar);

      var lblSubtext = Ti.UI.createLabel({
        width: "60%",
        height: Ti.UI.SIZE,
        text: "Pick a pre-made avatar or build your own",
        color: Ti.App.colorSubtitle,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: {
          fontSize: Ti.App.fontM,
        },
      });

      contentContainer.add(lblSubtext);

      var useWidth =
        7 * thumbSize +
        7 * thumbPaddingX +
        thumbPaddingX +
        0.075 * Ti.App.realWidth -
        0.5 * thumbPaddingX;

      Ti.App.isAndroid && (useWidth = Ti.App.dipToPx(useWidth)),
        (thumbContainer = Ti.UI.createScrollView({
          top: 20,
          width: Ti.App.realWidth,
          height: 2 * thumbSize + 2 * thumbPaddingY,

          layout: "horizontal",

          verticalBounce: false,
          horizontalBounce: true,
          scrollType: "horizontal",
          contentWidth: useWidth,
        })),
        contentContainer.add(thumbContainer);
      var buttonContainer = Ti.UI.createView({
          top: 21,
          width: "85%",
          height: Ti.UI.SIZE,
          layout: "vertical",
        }),
        btnEdit = Ti.App.createBigRoundedButton("Customize", "red");
      (btnEdit.width = "100%"),
        btnEdit.addEventListener("click", ctaEditClick),
        buttonContainer.add(btnEdit);
      var lowerBtnContainer = Ti.UI.createView({
          top: 12,
          width: "100%",
          height: Ti.UI.SIZE,
        }),
        btnDone = Ti.App.createBigRoundedButton("Done", "dark_blue");
      (btnDone.width = 0.85 * (0.5 * Ti.App.realWidth) - 5),
        (btnDone.left = 0),
        btnDone.addEventListener("click", ctaDoneClick),
        lowerBtnContainer.add(btnDone);

      var btnBuild = Ti.App.createBigRoundedButton("Build", "dark_blue");
      (btnBuild.width = 0.85 * (0.5 * Ti.App.realWidth) - 5),
        (btnBuild.right = 0),
        btnBuild.addEventListener("click", function () {
          Ti.App.openBuildAvatarWindow(
            Ti.App.avatarImageUrl + "default.png",
            "#7bc8a4"
          ),
            me.closeWindow();
        }),
        lowerBtnContainer.add(btnBuild),
        buttonContainer.add(lowerBtnContainer),
        contentContainer.add(buttonContainer),
        me.window.add(contentContainer),
        Ti.App.btnActiveState(btnDone),
        Ti.App.btnActiveState(btnEdit),
        Ti.App.btnActiveState(btnBuild);
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
    },
    fetchThumbs = function () {
      var params = {},
        apiArgs = {
          method: "GET",
          endpoint: "devrant/avatars/random",
          params: params,
          callback: getThumbsComplete,
          includeAuth: true,
        };

      Ti.App.api(apiArgs);
    },
    getThumbsComplete = function (result) {
      if (null != me) {
        if (result.avatars) {
          for (
            var num_avatars = result.avatars.length,
              firstBottom = num_avatars / 2,
              paddingTop = thumbPaddingY,
              paddingLeft = 0.075 * Ti.App.realWidth - 0.5 * thumbPaddingX,
              i = 0;
            i < num_avatars;
            ++i
          ) {
            var imageContainer = Ti.UI.createView({
                left: 0 == i || i == firstBottom ? paddingLeft : 0,
                width: thumbSize + thumbPaddingX,
                height: thumbSize + thumbPaddingY,

                imageId: result.avatars[i].full,
                imageBg: result.avatars[i].bg,
                imageNum: i,
              }),
              img = Ti.UI.createImageView({
                defaultImage: "",
                backgroundColor: "#" + result.avatars[i].bg,
                touchEnabled: false,
                image: result.avatars[i].mid,
                width: thumbSize,
                height: thumbSize,
                borderRadius: 0.5 * thumbSize,
                borderWidth: 0,
              });

            (imageContainer.img = img),
              imageContainer.add(img),
              thumbContainer.add(imageContainer);
          }
          avatarSelected(thumbContainer.children[0]);
        }

        thumbContainer.addEventListener("click", function (e) {
          avatarSelected(e.source);
        });
      }
    },
    avatarSelected = function (img) {
      if (
        selectedAvatar &&
        ((selectedAvatar.img.borderWidth = 0),
        selectedAvatar.remove(selectedAvatar.check),
        selectedAvatar == img)
      )
        return void (selectedAvatar = null);

      (selectedAvatar = img),
        (img.img.borderColor = Ti.App.colorRed),
        (img.img.borderWidth = 4);
      var checkContainer = Ti.UI.createView({
          top: 9,
          right: 9,
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 0,
          backgroundColor: Ti.App.colorRed,
        }),
        lblCheck = Ti.UI.createLabel({
          color: "#fff",
          text: "\uE916",
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          font: {
            fontFamily: "icomoon",
            fontSize: "12sp",
          },
        });

      checkContainer.add(lblCheck),
        (img.check = checkContainer),
        img.add(checkContainer);
    },
    ctaEditClick = function () {
      if (null == selectedAvatar)
        return void Ti.App.showDialog(
          "Whoops!",
          'Please select the avatar you want to edit. If you\'d like to start from scratch, tap "Build".'
        );

      var imageId = selectedAvatar.imageId;
      Ti.App.openBuildAvatarWindow(imageId, selectedAvatar.imageBg),
        me.closeWindow();
    },
    ctaDoneClick = function () {
      if (null == selectedAvatar)
        return void Ti.App.showDialog(
          "Whoops!",
          'Please select the avatar you want. If you\'d like to start from scratch, tap "Build".'
        );

      var imageId = selectedAvatar.imageId;

      blockingLoader.showLoader();
      var params = {
          image_id: imageId,
        },
        apiArgs = {
          method: "POST",
          endpoint: "users/me/avatar",
          params: params,
          callback: avatarSaved,
          includeAuth: true,
        };

      Ti.App.api(apiArgs);
    },
    avatarSaved = function (result) {
      result.success
        ? (Ti.App.tabBar.refreshProfileByUserId(null), me.closeWindow())
        : (blockingLoader.hideLoader(),
          Ti.App.showDialog(
            "Whoops!",
            "There was a problem saving your avatar, sorry about that! Please try again."
          ));
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
        Ti.App.isAndroid && Ti.App.tabBar.scrollProfileToTop(),
        noClose || me.window.close({ animated: animated }),
        (me = null);
    }),
    me
  );
}

module.exports = SelectAvatarWindow;
