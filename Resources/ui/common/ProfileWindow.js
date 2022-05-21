function ProfileWindow() {
  var me = this;
  (me.userId = null),
    (me.window = null),
    (me.container = null),
    (me.contentContainer = null),
    (me.loader = null),
    (me.listSectionContainer = null),
    (me.topBar = null),
    (me.useData = null),
    (me.profileContentContainer = null),
    (me.tempContainer = null),
    (me.lblScore = null),
    (me.rantList = null),
    (me.selectedTab = null),
    (me.noMoreResults = null),
    (me.numLoaded = 0),
    (me.tabElems = {}),
    (me.didInitialLoad = false),
    (me.currentApiRequest = null),
    (me.curRequestNum = 0),
    (me.calculatedTabBarHeight = null),
    (me.avatarSectionHeight = 686 * (Ti.App.realWidth / 1080)),
    (me.avatarContainer = null),
    (me.contentListCanScroll = false),
    (me.isMe = null),
    (me.selectedTabColor = Ti.App.colorTabTextHighlight),
    (me.unselectedTabColor = Ti.App.colorTabTextUnselected),
    (me.contentTabs = null);
  var _subscribeText = "Subscribe to User's Rants",
    _unsubscribeText = "Unsubscribe from User's Rants",
    _blockText = "Block User",
    _unblockText = "Unblock User",
    _androidClickToViewTabs = true;

  (me.init = function (userId) {
    (me.contentTabs = [
      {
        dataField: "rants",
        label: "Rants",
      },

      {
        dataField: "upvoted",
        label: "++'s",
      },

      {
        dataField: "comments",
        label: "Comments",
      },
    ]),
      (me.userId = userId),
      (me.isMe =
        Ti.App.isLoggedIn() &&
        Ti.App.Properties.getString("userId") == me.userId),
      me.createElements(),
      fetchData("rants");
  }),
    (me.destroy = function () {
      null != me.rantList &&
        me.rantList.destroySeries &&
        me.rantList.destroySeries(),
        (me.didInitialLoad = false),
        (me.rantList = null),
        (me.noMoreResults = null),
        (me.numLoaded = 0),
        me.window.remove(me.container);
    }),
    (me.getWindow = function () {
      return me.window;
    }),
    (me.createElements = function () {
      null == me.window &&
        ((me.window = Ti.UI.createWindow({
          navBarHidden: true,
          backgroundColor: Ti.App.colorBg,
          width: "100%",
          height: "100%",
          orientationModes: [Ti.UI.PORTRAIT],
        })),
        me.window.addEventListener("open", windowOpened),
        me.window.addEventListener("close", windowClosed)),
        (me.container = Ti.UI.createView({
          width: "100%",
          height: "100%",
        }));

      var imgBg = Ti.UI.createImageView({
        top: 0,
        image: Ti.App.loaderBg,
        width: Ti.App.realWidth,
        height: 2.165 * Ti.App.realWidth,
        backgroundColor: Ti.App.colorImgBg,
        defaultImage: "",
      });

      me.container.add(imgBg), me.window.add(me.container), createSubSections();
    });
  var windowOpened = function () {},
    createSubSections = function () {
      createTopBar(),
        (me.contentContainer = Ti.UI.createView({
          backgroundColor: "#00ffffff",
          top: Ti.App.topBarGenerator.topBarHeight,
          width: "100%",
          zIndex: 2,
          height:
            Ti.App.realHeight -
            Ti.App.topBarGenerator.topBarHeight -
            (Ti.App.isAndroid ? 0 : Ti.App.tabBarHeight),
        })),
        me.container.add(me.contentContainer),
        true
          ? ((me.profileContentContainer = Ti.UI.createScrollView({
              width: "100%",

              layout: "vertical",
              disableBounce: true,
            })),
            me.profileContentContainer.addEventListener("scroll", function (e) {
              var scrollY = e.y;
              return (
                Ti.App.isAndroid && (scrollY = Ti.App.pxToDip(scrollY)),
                me.rantListContainer.canScroll &&
                scrollY <
                  me.topSectionContainer.getRect().height +
                    me.avatarSectionHeight -
                    10
                  ? void (Ti.App.isAndroid
                      ? (_androidClickToViewTabs = true)
                      : ((me.rantListContainer.canScroll = false),
                        (me.contentListCanScroll = false)))
                  : void (
                      Ti.App.isAndroid ||
                      (scrollY >=
                        me.topSectionContainer.getRect().height -
                          10 +
                          me.avatarSectionHeight &&
                        (Ti.App.isAndroid &&
                          (me.profileContentContainer.canCancelEvents = false),
                        (me.rantListContainer.canScroll = true),
                        (me.contentListCanScroll = true)))
                    )
              );
            }))
          : (me.profileContentContainer = Ti.UI.createView({
              width: "100%",
              height: "100%",
              layout: "vertical",
            })),
        me.contentContainer.add(me.profileContentContainer);

      var ContentLoader = require("ui/common/ContentLoader");

      me.loader = new ContentLoader();
      var loaderElement = me.loader.getElem();
      (loaderElement.zIndex = 1),
        (loaderElement.top = 0),
        me.container.add(loaderElement);
    },
    createScoreContainer = function () {},
    createTopBar = function () {
      var isUser = me.isMe,
        topBarOptions = {
          leftBtnType: "back",
          rightBtnType: isUser ? "edit" : "actions",
          barTitle: isUser ? "Profile" : "",
          callbackLeftBtn: function () {
            me.closeWindow();
          },
          callbackRightBtn: function () {
            if (!isUser) showShareActions();
            else {
              var SignupLoginWindow = require("ui/common/SignupLoginWindow"),
                signupLoginWindow = new SignupLoginWindow();
              signupLoginWindow.init("profile_details", null, {
                loadData: true,
              });
            }
          },
        };

      isUser &&
        ((topBarOptions.rightSecondaryBtnType = "actions"),
        (topBarOptions.callbackRightSecondaryBtn = showShareActions)),
        (me.topBar = Ti.App.topBarGenerator.createBar(topBarOptions)),
        me.topBar.children[1].addEventListener("click", scrollToTop),
        me.container.add(me.topBar);
    },
    showShareActions = function () {
      var items = [];

      items.push("Copy Profile Link"),
        me.useData &&
          me.useData.subscribed != null &&
          items.push(
            me.useData.subscribed
              ? _unsubscribeText
              : "Subscribe to User's Rants"
          ),
        me.useData && me.useData.blocked != null,
        me.useData &&
          me.useData.profile &&
          me.useData.profile.avatar &&
          me.useData.profile.avatar.i &&
          items.push("Download Avatar"),
        me.isMe || items.push("Report Profile");

      var cancelIndex = -1;

      Ti.App.isAndroid || ((cancelIndex = items.length), items.push("Cancel"));

      var opts = {
        options: items,
      };

      -1 != cancelIndex && (opts.cancel = cancelIndex);

      var dialog = Ti.UI.createOptionDialog(opts);
      dialog.addEventListener("click", reportDialogClick), dialog.show();
    },
    scrollToTop = function (e) {
      (_androidClickToViewTabs = true),
        me.profileContentContainer.scrollTo(0, 0),
        me.rantListContainer.scrollToItem(0, 0);
    },
    scrollHitBottom = function () {
      !me ||
        me.noMoreResults ||
        (me.rantList.showLoadingRow(), fetchData(me.selectedTab));
    },
    fetchData = function (content) {
      (me.selectedTab = content),
        0 == me.numLoaded && me.loader.showLoader(),
        (params = {
          content: content,
          skip: me.numLoaded,
        }),
        ++me.curRequestNum;
      var checkRequestNum = me.curRequestNum,
        apiArgs = {
          method: "GET",
          endpoint: "users/" + me.userId,
          params: params,
          callback: function (result) {
            null == me ||
              me.curRequestNum != checkRequestNum ||
              getProfileComplete(result);
          },
          includeAuth: true,
        };

      Ti.App.api(apiArgs),
        "viewed" == content &&
          0 == Ti.App.Properties.getInt("seenViewedInfo", 0) &&
          (Ti.App.Properties.setInt("seenViewedInfo", 1),
          Ti.App.showDialog(
            "Viewed Rants",
            "Only you can see this list of the rants you've viewed. Other users will not see this tab when they go to your profile."
          ));
    },
    getProfileComplete = function (result) {
      if (null != me && (me.loader.hideLoader(), result.success)) {
        var n = result.profile.content.content[me.selectedTab].length;
        (me.numLoaded += n),
          15 > n && (me.noMoreResults = true),
          null == me.rantList
            ? buildFromResult(result)
            : (me.rantList.removeLoadingRow(),
              "comments" == me.selectedTab
                ? me.rantList.addCommentsToList(
                    result.profile.content.content[me.selectedTab]
                  )
                : me.rantList.addRantsToList(
                    result.profile.content.content[me.selectedTab]
                  ));
      }
    },
    buildFromResult = function (result) {
      me.useData = result;
      var tempDidInitialLoad = me.didInitialLoad;
      me.didInitialLoad ||
        (!me.isMe && me.topBar.setBarTitle(result.profile.username),
        buildAvatarSection(),
        buildInfoFields(),
        buildTabs(),
        buildListContainer(),
        (me.didInitialLoad = true)),
        buildRantList(me.selectedTab),
        tempDidInitialLoad &&
          true === me.contentListCanScroll &&
          ((me.rantListContainer.canScroll = true),
          (me.contentListCanScroll = true),
          (me.profileContentContainer.canCancelEvents = false));
    },
    buildAvatarSection = function () {
      me.avatarContainer = Ti.UI.createView({
        width: Ti.App.realWidth,
        height: me.avatarSectionHeight,
      });

      var backgroundImg = Ti.UI.createImageView({
        width: Ti.App.realWidth,
        height: me.avatarSectionHeight,
        image: "/ui/profile-banner-bg1b.png",
      });

      me.avatarContainer.add(backgroundImg);
      var useOverlayBgColor;

      me.useData.profile.avatar &&
        (useOverlayBgColor = "#" + me.useData.profile.avatar.b);

      var backgroundColorOverlay = Ti.UI.createView({
        backgroundColor: 3 == Ti.App.theme ? Ti.App.colorBg : useOverlayBgColor,
        opacity: 3 == Ti.App.theme ? 0.88 : 0.66,
        width: Ti.App.realWidth,
        height: Ti.App.realHeight,
      });

      me.avatarContainer.add(backgroundColorOverlay);
      var useAvatarImage = "",
        addBuildAvatarLbl = false;
      me.useData.profile.avatar &&
        (me.isMe
          ? me.useData.profile.avatar.i
            ? (useAvatarImage =
                Ti.App.avatarImageUrl + me.useData.profile.avatar.i)
            : ((useOverlayBgColor =
                3 == Ti.App.theme ? Ti.App.colorBg : "transparent"),
              (useAvatarImage = "/ui/profile-circle-dots1.png"),
              (addBuildAvatarLbl = true))
          : me.useData.profile.avatar.i &&
            (useAvatarImage =
              Ti.App.avatarImageUrl + me.useData.profile.avatar.i));
      var useAvatarSize = me.avatarSectionHeight - 22,
        avatarImg = Ti.UI.createImageView({
          width: useAvatarSize,
          height: useAvatarSize,
          defaultImage: "",
          borderRadius: useAvatarSize / 2,
          borderWidth: 0,
          backgroundColor: useOverlayBgColor,
          image: useAvatarImage,
        });

      if ((me.avatarContainer.add(avatarImg), addBuildAvatarLbl)) {
        var lblBuildAvatar = Ti.UI.createLabel({
          touchEnabled: false,
          text: "Build\nAvatar",
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
          color: "#fff",
          font: {
            fontSize: Ti.App.fontL,
            fontWeight: "bold",
          },
        });

        me.avatarContainer.add(lblBuildAvatar),
          avatarImg.addEventListener("click", function () {
            return 10 > me.useData.profile.score
              ? void Ti.App.showDialog(
                  "Whoops!",
                  "You need 10 points to create an avatar! Try posting some rants and comments and you should be able to create one in no time at all!"
                )
              : void Ti.App.openSelectAvatarWindow();
          });
      } else
        me.isMe
          ? avatarImg.addEventListener("click", function () {
              Ti.App.openBuildAvatarWindow(
                Ti.App.avatarImageUrl + me.useData.profile.avatar.i,
                me.useData.profile.avatar.b
              );
            })
          : me.useData.profile.avatar.i &&
            avatarImg.addEventListener("click", function () {
              Ti.App.showImageViewer({
                url: Ti.App.avatarImageUrl + me.useData.profile.avatar.i,
                width: 1400,
                height: 1400,
                backgroundColor: "#" + me.useData.profile.avatar.b,
              });
            });

      var scoreTop = 11;

      if (me.useData.profile.dpp) {
        var dppContainer = Ti.UI.createView({
            top: scoreTop,
            left: 11,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            backgroundColor: "#" + me.useData.profile.avatar.b,
            borderRadius: 4,
            borderWidth: 0,
          }),
          lblDpp = Ti.UI.createLabel({
            top: 2,
            left: 4,
            right: 4,
            bottom: 2,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            color: "#fff",
            text: "Supporter",
            font: {
              fontSize: Ti.App.fontS,
              fontWeight: "bold",
            },
          });

        dppContainer.add(lblDpp),
          dppContainer.addEventListener(
            "click",
            Ti.App.openSupporterInfoWindow
          ),
          me.avatarContainer.add(dppContainer),
          (scoreTop += 25);
      }
      var scoreContainer = Ti.UI.createView({
          top: scoreTop,
          left: 11,
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          backgroundColor: Ti.App.colorScoreContainer,
          borderRadius: 4,
          borderWidth: 0,
        }),
        lblScore = Ti.UI.createLabel({
          top: 2,
          left: 4,
          right: 4,
          bottom: 2,
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          color: "#fff",
          text:
            (0 < me.useData.profile.score ? "+" : "") +
            (Ti.App.binaryScores
              ? (+me.useData.profile.score).toString(2)
              : me.useData.profile.score),
          font: {
            fontSize: Ti.App.fontS,
            fontWeight: "bold",
          },
        });

      scoreContainer.add(lblScore),
        me.avatarContainer.add(scoreContainer),
        me.profileContentContainer.add(me.avatarContainer);
    },
    buildInfoFields = function () {
      var topCollapsedHeight = 100,
        container = Ti.UI.createView({
          top: 0,
          width: "100%",
          backgroundColor: Ti.App.colorBg,

          height: Ti.UI.SIZE,

          layout: "vertical",
        });

      me.topSectionContainer = container;

      var useLabelWidth = Ti.App.realWidth - 60;

      if (me.useData.profile.about != null && "" != me.useData.profile.about) {
        var profileFieldContainer = Ti.UI.createView({
          width: "100%",
          top: 10,
          height: Ti.UI.SIZE,

          left: 0,
        });

        container.add(profileFieldContainer);

        var profileFieldIcon = Ti.UI.createLabel({
          left: 12,
          top: 0,
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          color: Ti.App.colorFieldIcon,
          font: {
            fontSize: "32sp",
            fontFamily: "icomoon",
          },

          text: "\uE808",
        });

        profileFieldContainer.add(profileFieldIcon);

        var lblProfileField = Ti.UI.createLabel({
          top: 5,

          width: useLabelWidth,
          height: Ti.UI.SIZE,
          color: Ti.App.colorDarkGrey,
          font: {
            fontSize: Ti.App.fontBody,
          },

          text: me.useData.profile.about,
          right: 10,
        });

        profileFieldContainer.add(lblProfileField);
      }

      if (
        null != me.useData.profile.skills &&
        "" != me.useData.profile.skills
      ) {
        var skillsFieldContainer = Ti.UI.createView({
          top: 10,
          width: "100%",
          height: Ti.UI.SIZE,

          horizontalWrap: false,

          left: 0,
        });

        container.add(skillsFieldContainer);

        var skillsFieldIcon = Ti.UI.createLabel({
          left: 12,
          top: 0,
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          color: Ti.App.colorFieldIcon,
          font: {
            fontSize: "32sp",
            fontFamily: "icomoon",
          },

          text: "\uE809",
        });

        skillsFieldContainer.add(skillsFieldIcon);

        var lblSkillsField = Ti.UI.createLabel({
          top: 5,

          width: useLabelWidth,
          height: Ti.UI.SIZE,
          right: 10,
          color: Ti.App.colorDarkGrey,
          font: {
            fontSize: Ti.App.fontBody,
          },

          text: me.useData.profile.skills,
        });

        skillsFieldContainer.add(lblSkillsField);
      }

      if (
        null != me.useData.profile.location &&
        "" != me.useData.profile.location
      ) {
        var locationFieldContainer = Ti.UI.createView({
          top: 10,
          width: "100%",
          height: Ti.UI.SIZE,
          layout: "horizontal",
          horizontalWrap: false,

          left: 0,
        });

        container.add(locationFieldContainer);

        var locationFieldIcon = Ti.UI.createLabel({
          left: 18,
          top: 0,
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          color: Ti.App.colorFieldIcon,
          font: {
            fontSize: "32sp",
            fontFamily: "icomoon",
          },

          text: "\uE80A",
        });

        locationFieldContainer.add(locationFieldIcon);

        var lblLocationField = Ti.UI.createLabel({
          top: 5,
          left: 12,

          width: Ti.UI.FILL,
          height: Ti.UI.SIZE,
          color: Ti.App.colorDarkGrey,
          font: {
            fontSize: Ti.App.fontBody,
          },

          text: me.useData.profile.location,
        });

        locationFieldContainer.add(lblLocationField);
      }

      if (
        null != me.useData.profile.website &&
        "" != me.useData.profile.website
      ) {
        var websiteFieldContainer = Ti.UI.createView({
          top: 10,
          width: "100%",
          height: Ti.UI.SIZE,
          layout: "horizontal",
          horizontalWrap: false,

          left: 0,
        });

        container.add(websiteFieldContainer),
          websiteFieldContainer.addEventListener("click", function () {
            var useWebsite = me.useData.profile.website;
            "http://" != useWebsite.substr(0, 7) &&
              "https://" != useWebsite.substr(0, 8) &&
              (useWebsite = "http://" + useWebsite),
              Ti.Platform.openURL(useWebsite);
          });

        var websiteFieldIcon = Ti.UI.createLabel({
          left: 14,
          top: 0,
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          color: Ti.App.colorFieldIcon,
          font: {
            fontSize: "32sp",
            fontFamily: "icomoon",
          },

          text: "\uE91C",
        });

        websiteFieldContainer.add(websiteFieldIcon);

        var lblWebsiteField = Ti.UI.createLabel({
          top: 5,
          left: 10,
          right: 10,

          width: Ti.UI.FILL,
          height: Ti.UI.SIZE,
          color: Ti.App.colorDarkGrey,
          minimumFontSize: Ti.App.fontBody,
          font: {
            fontSize: Ti.App.fontBody,
          },

          text: me.useData.profile.website,
        });

        websiteFieldContainer.add(lblWebsiteField);
      }

      if (
        null != me.useData.profile.github &&
        "" != me.useData.profile.github
      ) {
        var githubFieldContainer = Ti.UI.createView({
          top: 10,
          width: "100%",
          height: Ti.UI.SIZE,
          layout: "horizontal",
          horizontalWrap: false,

          left: 0,
        });

        container.add(githubFieldContainer),
          githubFieldContainer.addEventListener("click", function () {
            Ti.Platform.openURL(
              "https://github.com/" + me.useData.profile.github
            );
          });

        var githubFieldIcon = Ti.UI.createLabel({
          left: 14,
          top: 0,
          width: Ti.UI.SIZE,
          height: Ti.UI.SIZE,
          color: Ti.App.colorFieldIcon,
          font: {
            fontSize: "32sp",
            fontFamily: "icomoon",
          },

          text: "\uE906",
        });

        githubFieldContainer.add(githubFieldIcon);

        var lblGithubField = Ti.UI.createLabel({
          top: 5,
          left: 10,

          width: Ti.UI.FILL,
          height: Ti.UI.SIZE,
          color: Ti.App.colorDarkGrey,
          font: {
            fontSize: Ti.App.fontBody,
          },

          text: me.useData.profile.github,
        });

        githubFieldContainer.add(lblGithubField);
      }
      var joinDate = new Date(1e3 * me.useData.profile.created_time),
        lblJoinedOn = Ti.UI.createLabel({
          bottom: 15,
          width: "70%",

          height: Ti.UI.SIZE,
          color: Ti.App.colorHint,
          font: {
            fontSize: Ti.App.fontS,
            fontWeight: "bold",
          },

          text:
            "Joined on " +
            (joinDate.getMonth() + 1) +
            "/" +
            joinDate.getDate() +
            "/" +
            joinDate.getFullYear(),
        });

      (me.useData.profile.about != null && "" != me.useData.profile.about) ||
      (me.useData.profile.skills != null && "" != me.useData.profile.skills) ||
      (me.useData.profile.location != null &&
        "" != me.useData.profile.location) ||
      (me.useData.profile.github != null && "" != me.useData.profile.github)
        ? ((lblJoinedOn.top = 0), (lblJoinedOn.left = 50))
        : ((lblJoinedOn.top = 10), (lblJoinedOn.left = 15)),
        container.add(lblJoinedOn),
        me.profileContentContainer.add(container);
    },
    buildTabs = function () {
      me.isMe &&
        me.contentTabs.push({
          dataField: "viewed",
          label: "Viewed",
        }),
        me.useData.profile.content.counts.favorites &&
          me.contentTabs.push({
            dataField: "favorites",
            label: "Favorites",
          });

      var container = Ti.UI.createScrollView({
        top: 0,
        width: "100%",
        backgroundColor: Ti.App.colorBg,
        height: Ti.UI.SIZE,
        layout: "horizontal",
        horizontalWrap: false,
        scrollType: "horizontal",
      });

      Ti.App.isAndroid &&
        container.addEventListener("touchstart", function () {
          me.profileContentContainer.canCancelEvents = true;
        }),
        me.profileContentContainer.add(container);
      var i,
        tabContainer,
        topDivider,
        lblCount,
        lblType,
        tabInfo,
        thisTabColor,
        spaceBetweenTabs = 6,
        spacingSize = 6 * (me.contentTabs.length + 1),
        tabSize = Math.floor(
          (Ti.App.realWidth - spacingSize) / Math.min(me.contentTabs.length, 4)
        ),
        endAt = me.contentTabs.length - 1;

      for (i = 0; i < me.contentTabs.length; ++i) {
        (tabInfo = me.contentTabs[i]),
          (me.tabElems[tabInfo.dataField] = {}),
          (thisTabColor = 0 == i ? me.selectedTabColor : me.unselectedTabColor),
          (tabContainer = Ti.UI.createView({
            width: tabSize,
            height: 57,
            left: 6,
          })),
          i == endAt && (tabContainer.right = 6),
          container.add(tabContainer);

        var buildCallback = function (field) {
          return function () {
            clearCurrentList(), switchHighlightedLabel(field), fetchData(field);
          };
        };

        tabContainer.addEventListener(
          "click",
          buildCallback(tabInfo.dataField)
        ),
          (topDivider = Ti.UI.createView({
            top: 0,
            width: "100%",
            height: 4,
            borderRadius: 3,
            borderWidth: 0,
            backgroundColor: thisTabColor,
          })),
          tabContainer.add(topDivider),
          (me.tabElems[tabInfo.dataField].topDivider = topDivider),
          (lblCount =
            "viewed" == tabInfo.dataField
              ? Ti.UI.createLabel({
                  top: 7,

                  width: Ti.UI.SIZE,
                  height: Ti.UI.SIZE,
                  color: thisTabColor,
                  font: {
                    fontSize: "28sp",
                    fontFamily: "icomoon",
                  },

                  text: "\uE91D",
                })
              : Ti.UI.createLabel({
                  top: 5,
                  width: Ti.UI.SIZE,
                  height: Ti.UI.SIZE,
                  color: thisTabColor,
                  font: { fontSize: Ti.App.fontL, fontWeight: "bold" },
                  text: Ti.App.toRoundedK(
                    me.useData.profile.content.counts[tabInfo.dataField],
                    1e4
                  ),
                })),
          tabContainer.add(lblCount),
          (me.tabElems[tabInfo.dataField].lblCount = lblCount),
          (lblType = Ti.UI.createLabel({
            bottom: 6,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            color: thisTabColor,
            font: {
              fontSize: Ti.App.fontS,
              fontWeight: "bold",
            },

            text: tabInfo.label,
          })),
          tabContainer.add(lblType),
          (me.tabElems[tabInfo.dataField].lblType = lblType);
      }

      (tabBtmDivider = Ti.UI.createView({
        top: 0,
        bottom: 0,
        width: "100%",
        height: 1,
        backgroundColor: Ti.App.colorLine,
      })),
        me.profileContentContainer.add(tabBtmDivider);
    },
    buildListContainer = function () {},
    clearCurrentList = function () {
      if (
        ((me.numLoaded = 0), (me.noMoreResults = false), null != me.rantList)
      ) {
        me.rantList.destroySeries();
        var rantListContainer = me.rantList.getView(),
          rect = rantListContainer.getRect();
        (me.tempContainer = Ti.UI.createView({
          width: 1,
          height: rect.height,
          top: rect.top,
        })),
          me.profileContentContainer.add(me.tempContainer),
          me.profileContentContainer.remove(rantListContainer),
          (me.rantList = null);
      }
    },
    switchHighlightedLabel = function (field) {
      (me.tabElems[me.selectedTab].topDivider.backgroundColor =
        me.unselectedTabColor),
        (me.tabElems[me.selectedTab].lblCount.color = me.unselectedTabColor),
        (me.tabElems[me.selectedTab].lblType.color = me.unselectedTabColor),
        (me.tabElems[field].topDivider.backgroundColor = me.selectedTabColor),
        (me.tabElems[field].lblCount.color = me.selectedTabColor),
        (me.tabElems[field].lblType.color = me.selectedTabColor);
    },
    buildRantList = function (type) {
      if (
        "rants" == type ||
        "upvoted" == type ||
        "favorites" == type ||
        "viewed" == type
      ) {
        var RantListView = require("ui/common/RantListView5");

        (me.rantList = new RantListView()),
          me.rantList.init({
            height:
              Ti.App.realHeight -
              Ti.App.topBarGenerator.topBarHeight -
              (Ti.App.isAndroid ? 0 : Ti.App.tabBarHeight) -
              59 -
              4,
            ref: "profile",
            scrollHitBottomCallback: scrollHitBottom,
          }),
          (me.rantListContainer = me.rantList.getView()),
          Ti.App.isAndroid &&
            me.rantListContainer.addEventListener("scrollend", function (e) {
              0 == e.firstVisibleItemIndex;
            }),
          Ti.App.isAndroid ||
            (me.rantListContainer.canScroll = me.contentListCanScroll),
          me.profileContentContainer.add(me.rantListContainer),
          me.rantList.addRantsToList(me.useData.profile.content.content[type]);
      } else {
        var CommentListView = require("ui/common/CommentListView");

        (me.rantList = new CommentListView()),
          me.rantList.init({
            height:
              Ti.App.realHeight -
              Ti.App.topBarGenerator.topBarHeight -
              (Ti.App.isAndroid ? 0 : Ti.App.tabBarHeight) -
              59 -
              4,
            commentsOnly: true,
            scrollHitBottomCallback: scrollHitBottom,
          }),
          (me.rantListContainer = me.rantList.getView()),
          me.profileContentContainer.add(me.rantListContainer),
          Ti.App.isAndroid ||
            (me.rantListContainer.canScroll = me.contentListCanScroll),
          me.rantList.addRantToList(
            null,
            me.useData.profile.content.content[type]
          );
      }
      Ti.App.isAndroid &&
        me.rantListContainer.addEventListener("scrollstart", function () {
          _androidClickToViewTabs &&
            ((_androidClickToViewTabs = false),
            me.profileContentContainer.scrollTo(0, 99999));
        }),
        null != me.tempContainer &&
          me.profileContentContainer.remove(me.tempContainer);
    };

  me.getContainer = function () {
    return me.container;
  };

  var windowClosed = function () {
    me.closeWindow(false, true);
  };

  me.closeWindow = function (animated, noClose) {
    null == me ||
      ((noClose = noClose || false),
      me.window.removeEventListener("close", windowClosed),
      null == animated && (animated = true),
      null != me.rantList &&
        me.rantList.destroySeries &&
        me.rantList.destroySeries(),
      Ti.App.tabBar.closedWindow("profile", me),
      !noClose &&
        me.window.close({
          animated: animated,
        }),
      (me = null));
  };
  var reportDialogClick = function (e) {
      var options = e.source.getOptions(),
        optionName = options[e.index];

      if ("Cancel" != optionName && null != optionName) {
        if ("Copy Profile Link" == optionName)
          return void Ti.UI.Clipboard.setText(
            "https://devrant.com/users/" + me.useData.profile.username
          );

        if ("Subscribe to User's Rants" == optionName)
          return void _doUserSub("subscribe");
        if (optionName == _unsubscribeText)
          return void _doUserSub("unsubscribe");

        if (optionName == _blockText) return void _doUserBlock("block");
        if (optionName == _unblockText) return void _doUserBlock("unblock");

        if ("Download Avatar" == optionName) {
          var BlockingLoader = require("ui/common/BlockingLoader"),
            blockingLoader = new BlockingLoader();

          return (
            me.window.add(blockingLoader.getElem()),
            blockingLoader.showLoader(),
            void Ti.App.saveRemoteImageToGallery(
              Ti.App.avatarImageUrl + me.useData.profile.avatar.i,
              function () {
                blockingLoader.hideLoader(),
                  me.window.remove(blockingLoader.getElem()),
                  Ti.App.showDialog(
                    "Success!",
                    "The image has been saved to the gallery on your device!"
                  ),
                  Ti.App.logStat("Profile Share", {
                    source: "app",
                    share_type: "save_avatar",
                    from: "profile",
                  });
              },
              function () {
                blockingLoader.hideLoader(),
                  me.window.remove(blockingLoader.getElem()),
                  Ti.App.showDialog(
                    "Whoops!",
                    "There was a problem saving the image. Please make sure you have a good connection and try again. If the issue persists, please contact info@devrant.io"
                  ),
                  Ti.App.logStat("Profile Share", {
                    source: "app",
                    platform: "savefail",
                    from: "rant",
                  });
              }
            )
          );
        }

        if (me.useData.profile.adm)
          return void Ti.App.admControls(me.useData.profile.adm);
        var params = {},
          apiArgs = {
            method: "POST",
            endpoint: "users/" + me.userId + "/report",
            params: params,
            callback: function (result) {
              var dialogMessage = "",
                dialogTitle = "";

              result.success
                ? ((dialogMessage =
                    "Thank you for reporting this profile. We will review the profile and remove it if we find it violates our terms."),
                  (dialogTitle = "Success!"))
                : ((dialogMessage =
                    "There was an error reporting this profile. Please try again."),
                  (dialogTitle = "Error"));

              var dialog = Ti.UI.createAlertDialog({
                message: dialogMessage,
                ok: "Ok",
                title: dialogTitle,
              });

              dialog.show();
            },
            includeAuth: true,
          };

        Ti.App.api(apiArgs);
      }
    },
    _doUserSub = function (type) {
      var BlockingLoader = require("ui/common/BlockingLoader");
      (me.blockingLoader = new BlockingLoader()),
        me.window.add(me.blockingLoader.getElem()),
        me.blockingLoader.showLoader();
      var endpoint = "users/" + me.userId + "/subscribe",
        apiArgs = {
          method: "unsubscribe" == type ? "DELETE" : "POST",
          endpoint: endpoint,
          params: {},
          callback: function (result) {
            _subDone(type, result);
          },
          includeAuth: true,
        };

      Ti.App.api(apiArgs);
    },
    _subDone = function (type, result) {
      return (
        me.blockingLoader.hideLoader(),
        result && result.success
          ? void ("subscribe" == type
              ? ((me.useData.subscribed = true),
                Ti.App.showDialog(
                  "Success!",
                  "You are now subscribed to " +
                    me.useData.profile.username +
                    "'s rants. You will be notified when they post."
                ))
              : ((me.useData.subscribed = false),
                Ti.App.showDialog(
                  "Success!",
                  "You are now unsubscribed from " +
                    me.useData.profile.username +
                    "'s rants. You will no longer receive notifications when they post."
                )))
          : void Ti.App.showDialog(
              "Whoops!",
              "There was an error completing your action. Please try again."
            )
      );
    },
    _doUserBlock = function (type) {
      var BlockingLoader = require("ui/common/BlockingLoader");
      (me.blockingLoader = new BlockingLoader()),
        me.window.add(me.blockingLoader.getElem()),
        me.blockingLoader.showLoader();
      var endpoint = "users/" + me.userId + "/block",
        apiArgs = {
          method: "unblock" == type ? "DELETE" : "POST",
          endpoint: endpoint,
          params: {},
          callback: function (result) {
            _blockDone(type, result);
          },
          includeAuth: true,
        };

      Ti.App.api(apiArgs);
    },
    _blockDone = function (type, result) {
      return (
        me.blockingLoader.hideLoader(),
        result && result.success
          ? void ("block" == type
              ? ((me.useData.blocked = true),
                Ti.App.showDialog(
                  "Success!",
                  "You have blocked " + me.useData.profile.username + "."
                ))
              : ((me.useData.blocked = false),
                Ti.App.showDialog(
                  "Success!",
                  "You have unblocked " + me.useData.profile.username + "."
                )))
          : void Ti.App.showDialog(
              "Whoops!",
              "There was an error completing your action. Please try again."
            )
      );
    };

  return me;
}

module.exports = ProfileWindow;
