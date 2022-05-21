function BuildAvatarWindow() {
  var me = this;

  (me.window = null), (me.container = null), (me.contentContainer = null);
  var blockingLoader,
    imageId,
    imageBg,
    selectedTabId,
    optionTabsContainer,
    avatarOptionsContainer,
    mainImage,
    prevImage,
    bigImgContainer,
    selectedSubType,
    selectedTab,
    currentRequest,
    bottomSelectorHeight = 163,
    circleImageSize = 93,
    myScore = 0;

  (me.init = function (imageIdParam, imageBgParam) {
    (imageId = imageIdParam),
      (imageBg = imageBgParam),
      (selectedTabId = "g"),
      me.createElements(),
      updateFromSelectedImageId();
  }),
    (me.getWindow = function () {
      return me.window;
    });
  var updateFromSelectedImageId = function (getFeatures) {
      null != currentRequest && currentRequest.abort(),
        null == getFeatures && (getFeatures = true);

      var params = {
        option: selectedTabId,
        image_id: imageId,
        features: getFeatures ? 1 : 0,
      };

      selectedSubType && (params.sub_option = selectedSubType);

      var apiArgs = {
        method: "GET",
        endpoint: "devrant/avatars/build",
        params: params,
        callback: buildComplete,
        includeAuth: true,
      };

      currentRequest = Ti.App.api(apiArgs);
    },
    buildComplete = function (result) {
      null == me ||
        ((currentRequest = null),
        result && result.me && result.me.score && (myScore = result.me.score),
        result &&
          result.options &&
          (setTabs(result.options),
          setTimeout(function () {
            addTabUnderline(optionTabsContainer.children[0]);
          }, 100)),
        result && result.avatars && setShownAvatars(result.avatars));
    },
    setShownAvatars = function (avatars) {
      for (
        var _StringformatDecimal = String.formatDecimal,
          usePadding = 9,
          endIndex = avatars.length - 1,
          i = 0;
        i < avatars.length;
        ++i
      ) {
        var imgContainer = Ti.UI.createView({
            width: Ti.UI.SIZE,
            height: circleImageSize + 8,
            imageId: avatars[i].img.full,
            imageBg: avatars[i].bg || avatars[i].img.b,
            imageLocked: avatars[i].locked,
            imagePoints: avatars[i].points,
            partId: avatars[i].id,
          }),
          img = Ti.UI.createImageView({
            left: usePadding,
            right: i == endIndex ? usePadding : 0,
            defaultImage: "",
            backgroundColor: "#" + avatars[i].img.b,
            image: Ti.App.avatarImageUrl + avatars[i].img.mid,
            width: circleImageSize,
            height: circleImageSize,
            borderRadius: 0.5 * circleImageSize,
            touchEnabled: false,
            borderWidth: 0,
          });
        if (
          ((imgContainer.img = img),
          avatars[i].selected && setSelectedAvatar(imgContainer),
          imgContainer.add(img),
          avatars[i].points &&
            (avatars[i].selected ||
              ((img.borderWidth = 4), (img.borderColor = Ti.App.colorOrange)),
            !avatars[i].purchased))
        ) {
          var pointsOuterContainer = Ti.UI.createView({
            left: usePadding,
            width: circleImageSize,
            height: Ti.UI.SIZE,
            bottom: 0,
          });
          imgContainer.pointsContainer = pointsOuterContainer;
          var pointsContainer = Ti.UI.createView({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            backgroundColor: Ti.App.colorOrange,
            borderRadius: 4,
            borderWidth: 0,
          });
          pointsOuterContainer.add(pointsContainer);
          var lblPoints = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            left: 6,
            right: 5,
            top: 2,
            bottom: 2,
            color: "#fff",
            text: _StringformatDecimal(avatars[i].points) + "++",
            font: {
              fontSize: Ti.App.fontS,
              fontWeight: "bold",
            },
          });

          pointsContainer.add(lblPoints),
            imgContainer.add(pointsOuterContainer);
        }

        avatarOptionsContainer.add(imgContainer);
      }
    },
    setSelectedAvatar = function (avatar) {
      (avatar.img.borderWidth = 4),
        (avatar.img.borderColor = Ti.App.colorBtnBgOne);
      var checkContainer = Ti.UI.createView({
          top: 5,
          right: 5,
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 0,
          zIndex: 2,
          backgroundColor: Ti.App.colorBtnBgOne,
        }),
        lblCheck = Ti.UI.createLabel({
          color: Ti.App.colorBtnInverse,
          text: "\uE916",
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          font: {
            fontFamily: "icomoon",
            fontSize: "12sp",
          },
        });

      checkContainer.add(lblCheck),
        avatar.add(checkContainer),
        (avatar.check = checkContainer),
        (prevImage = avatar);
    },
    openItemLockedWindow = function (sourceItem) {
      var AvatarItemLockedWindow = require("ui/common/AvatarItemLockedWindow"),
        avatarItemLockedWindow = new AvatarItemLockedWindow();
      avatarItemLockedWindow.init({
        myScore: myScore,
        itemPoints: sourceItem.imagePoints,
        itemImage: sourceItem.imageId,
        itemBg: sourceItem.imageBg,
        itemPartId: sourceItem.partId,
        img: sourceItem,
      });
    },
    avatarSelected = function (e) {
      return e.source.imageId
        ? e.source.imageLocked
          ? void openItemLockedWindow(e.source)
          : void (null != prevImage &&
              (prevImage.imagePoints
                ? (prevImage.img.borderColor = Ti.App.colorOrange)
                : (prevImage.img.borderWidth = 0),
              prevImage.remove(prevImage.check)),
            (imageId = e.source.imageId),
            Ti.App.isAndroid
              ? ((mainImage.image = ""),
                Ti.App.loadImage(
                  Ti.App.avatarImageUrl + e.source.imageId,
                  function (e) {
                    mainImage.image = e;
                  }
                ))
              : (mainImage.image = Ti.App.avatarImageUrl + e.source.imageId),
            e.source.imageBg &&
              (bigImgContainer.backgroundColor = "#" + e.source.imageBg),
            setSelectedAvatar(e.source))
        : void 0;
    },
    setTabs = function (options) {
      for (var padding = 10, i = 0; i < options.length; ++i) {
        var tab = Ti.UI.createView({
            left: 0 == i ? padding : 0,

            width: Ti.UI.SIZE,
            height: "100%",
            optionId: options[i].id,
            optionSubType: options[i].sub_type,
          }),
          lblTab = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            left: padding,
            right: padding,
            text: options[i].label,
            touchEnabled: false,
            color: Ti.App.colorTabText,
            font: {
              fontWeight: "bold",
              fontSize: Ti.App.fontS,
            },
          });

        tab.add(lblTab),
          0 == i && (selectedTab = tab),
          optionTabsContainer.add(tab);
      }
    },
    addTabUnderline = function (tab) {
      var underline = Ti.UI.createView({
        width: tab.getRect().width,
        height: 3,
        backgroundColor: Ti.App.colorTabText,
        bottom: 0,
        borderRadius: 2,
        borderWidth: 0,
      });

      (tab.selectedUnderline = underline), tab.add(underline);
    },
    tabSelected = function (e) {
      (selectedTabId == e.source.optionId &&
        selectedSubType == e.source.optionSubType) ||
        (clearCurrentTab(),
        selectedTab && selectedTab.remove(selectedTab.selectedUnderline),
        (selectedTab = e.source),
        (selectedTabId = e.source.optionId),
        (selectedSubType = e.source.optionSubType),
        updateFromSelectedImageId(false),
        addTabUnderline(e.source));
    },
    clearCurrentTab = function () {
      Ti.App.isAndroid && avatarOptionsContainer.scrollTo(0, 0);
      for (
        var items = avatarOptionsContainer.children, n = items.length - 1;
        0 <= n;

      )
        avatarOptionsContainer.remove(items[n]), --n;
    };

  me.createElements = function () {
    (me.window = Ti.UI.createWindow({
      navBarHidden: true,
      backgroundColor: Ti.App.colorBg,
      width: "100%",
      height: "100%",
      orientationModes: [Ti.UI.PORTRAIT],
    })),
      me.window.addEventListener("open", windowOpened),
      me.window.addEventListener("close", windowClosed),
      (me.container = Ti.UI.createView({
        width: "100%",
        height: "100%",
      })),
      me.window.add(me.container),
      createSubSections();

    var BlockingLoader = require("ui/common/BlockingLoader");

    (blockingLoader = new BlockingLoader()),
      me.window.add(blockingLoader.getElem());
  };
  var windowOpened = function () {
      var selectorWindow = Ti.App.tabBar.getTopWindowOfType("select_avatar");
      null != selectorWindow && selectorWindow.obj.closeWindow(false);
    },
    createSubSections = function () {
      createTopBar(),
        (me.contentContainer = Ti.UI.createView({
          top: Ti.App.topBarGenerator.topBarHeight,
          width: "100%",
          height: Ti.UI.FILL,
        })),
        me.container.add(me.contentContainer),
        createImageSection(),
        createOptionSection();
    },
    createImageSection = function () {
      if (
        ((bigImgContainer = Ti.UI.createView({
          top: 0,
          width: Ti.App.realWidth,
          height:
            Ti.App.realHeight -
            Ti.App.topBarGenerator.topBarHeight -
            bottomSelectorHeight,
          backgroundColor: "#" + imageBg,
        })),
        !Ti.App.isAndroid)
      )
        var imgWrapper = Ti.UI.createScrollView({
          width: "100%",
          height: "100%",
          minZoomScale: 1,
          maxZoomScale: 4,
          zoomScale: 1,
          disableBounce: true,
        });

      if (!Ti.App.isAndroid)
        (mainImage = Ti.UI.createImageView({
          width: Ti.App.realWidth,
          height: Ti.App.realWidth,
          image: imageId,
          defaultImage: "",
          canScale: true,
        })),
          imgWrapper.add(mainImage),
          bigImgContainer.add(imgWrapper);
      else {
        var TiTouchImageView = require("org.iotashan.TiTouchImageView");
        (mainImage = TiTouchImageView.createView({
          maxZoom: 4,
          minZoom: 1,
          zoom: 1,
        })),
          bigImgContainer.add(mainImage),
          Ti.App.loadImage(imageId, function (e) {
            (mainImage.image = e), (mainImage.zoom = 1);
          });
      }

      me.contentContainer.add(bigImgContainer);
    },
    createOptionSection = function () {
      var container = Ti.UI.createView({
          bottom: 0,
          width: Ti.App.realWidth,
          height: bottomSelectorHeight,
        }),
        tabHeight = 42,
        dividerHeight = 1;

      (optionTabsContainer = Ti.UI.createScrollView({
        top: 0,
        width: "100%",
        height: tabHeight,
        backgroundColor: Ti.App.colorBg,
        layout: "horizontal",
        horizontalWrap: false,
        scrollType: "horizontal",
      })),
        optionTabsContainer.addEventListener("click", tabSelected),
        container.add(optionTabsContainer);

      var divider = Ti.UI.createView({
        top: tabHeight,
        width: "100%",
        height: dividerHeight,
        backgroundColor: Ti.App.colorLine,
      });

      container.add(divider),
        (avatarOptionsContainer = Ti.UI.createScrollView({
          top: tabHeight + dividerHeight,
          width: "100%",
          height: bottomSelectorHeight - (tabHeight + dividerHeight),
          backgroundColor: Ti.App.colorBg,

          layout: "horizontal",
          horizontalWrap: false,
          scrollType: "horizontal",
        })),
        container.add(avatarOptionsContainer),
        avatarOptionsContainer.addEventListener("click", avatarSelected),
        me.contentContainer.add(container);
    },
    createTopBar = function () {
      var topBarOptions = {
          leftBtnType: "back",
          rightBtnType: "save",
          barTitle: "Builder",
          callbackLeftBtn: function () {
            me.closeWindow();
          },
          callbackRightBtn: saveAvatar,
        },
        topBar = Ti.App.topBarGenerator.createBar(topBarOptions);
      me.container.add(topBar);
    },
    saveAvatar = function () {
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
        ? (Ti.App.tabBar.refreshProfile(), me.closeWindow())
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
        Ti.App.tabBar.closedWindow("build_avatar"),
        noClose || me.window.close({ animated: animated }),
        (me = null);
    }),
    me
  );
}

module.exports = BuildAvatarWindow;
