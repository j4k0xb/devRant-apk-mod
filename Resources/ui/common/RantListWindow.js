function RantListWindow() {
  var me = this;
  me.rantSeries = {};
  var filterBarHeight = 100,
    topRangeHeight = 50,
    filterBarCreated = false,
    filterBarContainer = null,
    sortMethod = Ti.App.Properties.getString("sortMethod", "algo"),
    selectedSortButton = null,
    filterBarOpened = false,
    topRangeFilter = null,
    topRangeSortMethod = null,
    tabElems = null,
    newsBar = null,
    newsBarHeight = null,
    isGroupRant = null,
    isStories = null,
    isCollabs = null,
    selectedWeek = null,
    rantSetId = null,
    numRefreshes = 0,
    hasFreeCollab = false,
    _filters = [],
    _rantFetchApiCall = null;
  me.btnAddRant = null;
  var sortOptions = [
      {
        id: "algo",
        label: "Algo",
      },

      {
        id: "recent",
        label: "Recent",
      },

      {
        id: "top",
        label: "Top",
      },
    ],
    filterOptions = [
      {
        id: 1,
        label: "Rants",
      },

      {
        id: 3,
        label: "Jokes/Memes",
      },

      {
        id: 4,
        label: "Questions",
      },

      {
        id: 2,
        label: "Collabs",
      },

      {
        id: 5,
        label: "devRant",
      },

      {
        id: 6,
        label: "Random",
      },

      {
        id: 7,
        label: "Undefined",
      },
    ],
    timeOptions = [
      {
        id: "day",
        label: "Day",
      },

      {
        id: "week",
        label: "Week",
      },

      {
        id: "month",
        label: "Month",
      },

      {
        id: "all",
        label: "All",
      },
    ];

  (me.numSecondsPeriodicUpdate = 20),
    (me.numRantsFetchPerRequest = 20),
    (me.numRantsLoaded = 0),
    (me.noMoreResults = false),
    (me.window = null),
    (me.container = null),
    (me.listContainer = null),
    (me.rantList = null),
    (me.loader = null),
    (me.periodicUpdateTimer = null),
    (me.lastrantFetchTime = null),
    (me.notifIndicator = null),
    (me.inBackground = false),
    (me.init = function (group, week, stories, collabs) {
      (isGroupRant = group || false),
        (isStories = stories || false),
        (isCollabs = collabs || false),
        (me.isAndroidTabWindow = Ti.App.isAndroid && !isGroupRant),
        (me.topTabsOffset = me.isAndroidTabWindow ? Ti.App.tabBarHeight : 0),
        isGroupRant
          ? ((filterBarHeight = 50),
            (sortMethod = Ti.App.Properties.getString(
              "sortMethodGroupRant",
              "algo"
            )),
            (filtersKey = ""))
          : isStories
          ? ((filterBarHeight = 50),
            (sortMethod = Ti.App.Properties.getString(
              "sortMethodStories",
              "top"
            )),
            (filtersKey = ""))
          : isCollabs
          ? ((filterBarHeight = 50), (sortMethod = "recent"), (filtersKey = ""))
          : (_filters = Ti.App.Properties.getList("filters", [])),
        (selectedWeek = week),
        me.createElements();
    }),
    (me.getWindow = function () {
      return me.window;
    }),
    (me.createElements = function () {
      var firstCreate = null == me.window;
      (filterBarCreated = false),
        (topRangeFilter = null),
        firstCreate
          ? ((me.window = Ti.UI[
              me.isAndroidTabWindow ? "createView" : "createWindow"
            ]({
              top: 0,
              width: "100%",

              height: Ti.UI.FILL,
              backgroundColor: Ti.App.colorBg,
              navBarHidden: true,
              exitOnClose: false,
              swipeToClose: false,
              orientationModes: [Ti.UI.PORTRAIT],
            })),
            me.window.addEventListener("open", windowOpened),
            me.window.addEventListener("close", windowClosed))
          : (me.window.backgroundColor = Ti.App.colorBg),
        (me.container = Ti.UI.createView({
          top: 0,
          width: "100%",
          height: "100%",
        })),
        me.window.add(me.container),
        firstCreate &&
          !isCollabs &&
          ((me.btnAddRant = Ti.App.generateAddRantButton(
            isGroupRant,
            selectedWeek
          )),
          (me.btnAddRant.zIndex = 1),
          me.window.add(me.btnAddRant));

      var imgBg = Ti.UI.createImageView({
        top: 0,
        image: Ti.App.loaderBg,
        width: Ti.App.realWidth,
        height: 2.165 * Ti.App.realWidth,
      });

      me.container.add(imgBg),
        createTopBar(),
        createLoader(),
        createList(),
        firstCreate && me.fetchFeedData();
    });

  var windowOpened = function () {};

  (me.startUpdateTimer = function () {
    Ti.App.isAndroid ||
      null != me.periodicUpdateTimer ||
      isGroupRant ||
      isStories ||
      isCollabs ||
      (me.periodicUpdateTimer = setTimeout(
        doPeriodicUpdate,
        1e3 * me.numSecondsPeriodicUpdate
      ));
  }),
    (me.stopUpdateTimer = function () {
      null != me.periodicUpdateTimer &&
        (clearTimeout(me.periodicUpdateTimer), (me.periodicUpdateTimer = null));
    });
  var doPeriodicUpdate = function () {
      null == me || ((me.periodicUpdateTimer = null), me.updateRantDetails());
    },
    createTopBar = function () {
      var useTitle = "\uE903";

      isGroupRant
        ? (useTitle = "Weekly Rant")
        : isStories
        ? (useTitle = "Stories")
        : isCollabs && (useTitle = "Collabs");

      var useRightBtn = null;

      useRightBtn = isGroupRant ? "calendar" : isCollabs ? "add" : "filter";
      var topBarOptions = {
          leftBtnType: isGroupRant ? "back" : null,
          rightBtnType: useRightBtn,

          rightSecondaryBtnType: isGroupRant ? "filter" : "none",
          barTitle: useTitle,
          callbackLeftBtn: function () {
            (isGroupRant || isStories) && me.closeWindow();
          },
          callbackRightBtn: function () {
            isGroupRant || isStories || isCollabs
              ? isGroupRant
                ? Ti.App.openWeeklies()
                : isStories
                ? toggleFilterMenu()
                : isCollabs && Ti.App.openAddCollab(null, true)
              : toggleFilterMenu();
          },
          callbackRightSecondaryBtn: isGroupRant ? toggleFilterMenu : null,
        },
        topBar = Ti.App.topBarGenerator.createBar(topBarOptions);
      (topBar.zIndex = 30),
        isGroupRant ||
          topBar.children[0].addEventListener("click", me.doRefresh),
        me.container.add(topBar);
    },
    toggleFilterMenu = function () {
      var i;

      filterBarCreated || createFilterBar();

      var useHeight, params;

      if (
        (filterBarOpened
          ? ((useHeight =
              Ti.App.realHeight -
              Ti.App.topBarGenerator.topBarHeight -
              me.topTabsOffset),
            (filterBarOpened = false))
          : ((useHeight =
              Ti.App.realHeight -
              Ti.App.topBarGenerator.topBarHeight -
              me.topTabsOffset -
              filterBarHeight),
            (filterBarOpened = true)),
        filterBarOpened)
      ) {
        filterBarContainer.visible = true;
        var spaceOnTop = Ti.App.topBarGenerator.topBarHeight + filterBarHeight;

        newsBar && (spaceOnTop += newsBarHeight),
          (params = {
            top: spaceOnTop,
            duration: 300,
          }),
          topRangeFilter && topRangeFilter.animate({ top: 0, duration: 300 }),
          newsBar &&
            newsBar.animate({ top: spaceOnTop - newsBarHeight, duration: 300 }),
          Ti.App.isAndroid,
          me.listContainer.animate(params);
      } else {
        var spaceOnTop = Ti.App.topBarGenerator.topBarHeight;

        "top" != sortMethod || isGroupRant || (spaceOnTop += topRangeHeight),
          newsBar && (spaceOnTop += newsBarHeight),
          (params = {
            top: spaceOnTop,

            duration: 300,
          }),
          topRangeFilter &&
            topRangeFilter.animate({
              top: Ti.App.topBarGenerator.topBarHeight,
              duration: 300,
            }),
          newsBar &&
            newsBar.animate({ top: spaceOnTop - newsBarHeight, duration: 300 }),
          Ti.App.isAndroid,
          me.listContainer.animate(params, function () {
            isStories || (filterBarContainer.visible = false);
          });
      }
    },
    createFilterBar = function () {
      var createFilters = !isStories && !isCollabs && !isGroupRant;

      if (
        ((filterBarCreated = true),
        (filterBarContainer = Ti.UI.createView({
          zIndex: 0,
          top: Ti.App.topBarGenerator.topBarHeight,
          width: "100%",
          height: filterBarHeight,
          backgroundColor: Ti.App.colorBgTabs,
        })),
        me.container.add(filterBarContainer),
        createFilters)
      ) {
        var midLine = Ti.UI.createView({
          width: "100%",
          height: 1,
          backgroundColor:
            3 == Ti.App.theme ? Ti.App.colorBlack : Ti.App.colorLine,
          top: 50,
        });

        filterBarContainer.add(midLine);
      }

      var bottomLine = Ti.UI.createView({
        width: "100%",
        height: 1,
        backgroundColor:
          3 == Ti.App.theme ? Ti.App.colorBlack : Ti.App.colorLine,
        bottom: 0,
      });

      filterBarContainer.add(bottomLine);

      var innerContainer = Ti.UI.createView({
        top: 0,
        width: Ti.UI.SIZE,
        height: 50,
        layout: "horizontal",
      });

      if ((filterBarContainer.add(innerContainer), createFilters)) {
        var bottomContainer = Ti.UI.createScrollView({
          scrollType: "horizontal",
          top: topRangeHeight,
          width: "100%",
          height: topRangeHeight,
          layout: "horizontal",
        });

        bottomContainer.addEventListener("click", function (e) {
          var clickedBtn = e.source;

          if (clickedBtn.filterId) {
            clickedBtn.filterEnabled
              ? ((clickedBtn.filterContainer.borderColor =
                  Ti.App.colorUnselectable),
                (clickedBtn.filterLbl.color = Ti.App.colorHint))
              : ((clickedBtn.filterContainer.borderColor = Ti.App.colorLink),
                (clickedBtn.filterLbl.color = Ti.App.colorLink)),
              (clickedBtn.filterEnabled = !clickedBtn.filterEnabled);

            for (
              var thisBtn, selectedFilters = [], i = 0;
              i < bottomContainer.children.length;
              ++i
            )
              (thisBtn = bottomContainer.children[i]),
                thisBtn.filterEnabled && selectedFilters.push(thisBtn.filterId);

            selectedFilters.length == filterOptions.length &&
              (selectedFilters = []),
              (_filters = selectedFilters),
              Ti.App.Properties.setList("filters", selectedFilters),
              null != _rantFetchApiCall && _rantFetchApiCall.abort(),
              me.doRefresh();
          }
        });

        for (var btnTypeContainer, i = 0; i < filterOptions.length; ++i) {
          (btnTypeContainer = Ti.UI.createView({
            borderRadius: 7,
            borderWidth: 1,
            borderColor: Ti.App.colorLink,
            left: 0 == i ? 10 : 0,
            right: 5,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
          })),
            (btnTypeContainer.filterId = filterOptions[i].id),
            (btnTypeContainer.filterContainer = btnTypeContainer);

          var lblType = Ti.UI.createLabel({
            touchEnabled: false,
            top: 7,
            bottom: 7,
            left: 9,
            right: 9,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            color: Ti.App.colorLink,
            text: filterOptions[i].label,
            font: {
              fontSize: Ti.App.fontS,
              fontWeight: "bold",
            },
          });

          (btnTypeContainer.filterLbl = lblType),
            _filters.length && -1 === _filters.indexOf(filterOptions[i].id)
              ? ((btnTypeContainer.filterEnabled = false),
                (btnTypeContainer.borderColor = Ti.App.colorUnselectable),
                (lblType.color = Ti.App.colorHint))
              : (btnTypeContainer.filterEnabled = true),
            btnTypeContainer.add(lblType),
            bottomContainer.add(btnTypeContainer);
        }

        filterBarContainer.add(bottomContainer);
      }

      var lblSortBy = Ti.UI.createLabel({
        text: "Sort by:",
        right: -2,
        width: Ti.UI.SIZE,
        height: "100%",
        color: Ti.App.colorTabText,
        font: {
          fontSize: Ti.App.fontBody,
          fontWeight: "bold",
        },
      });

      for (innerContainer.add(lblSortBy), i = 0; i < sortOptions.length; ++i)
        if (!(isStories && 0 == i)) {
          var itemContainer = Ti.UI.createView({
            left: 12,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            layout: "horizontal",
          });

          innerContainer.add(itemContainer),
            itemContainer.addEventListener("click", sortMethodClicked),
            (itemContainer.sortMethodId = sortOptions[i].id);

          var circleContainer = Ti.UI.createView({
            touchEnabled: false,
            width: 16,
            height: 16,
            top: 8,
            bottom: 8,
            backgroundColor: Ti.App.colorSortCircle,
            borderRadius: 8,
            borderWidth: 0,
          });

          itemContainer.add(circleContainer);

          var circleContainerOutline = Ti.UI.createView({
            touchEnabled: false,
            width: 12,
            height: 12,
            top: 2,
            backgroundColor: Ti.App.colorSortCircleMiddle,
            borderRadius: 6,
            borderWidth: 0,
          });

          circleContainer.add(circleContainerOutline);

          var innerCircleContainer = Ti.UI.createView({
            touchEnabled: false,
            width: 6,
            height: 6,
            backgroundColor: Ti.App.colorTabHighlight,
            borderRadius: 3,
            borderWidth: 0,
            visible: sortMethod == sortOptions[i].id,
          });

          sortMethod == sortOptions[i].id &&
            (selectedSortButton = itemContainer),
            circleContainer.add(innerCircleContainer);

          var lblSortMethod = Ti.UI.createLabel({
            touchEnabled: false,
            left: 6,
            text: sortOptions[i].label,
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            color: Ti.App.colorTabText,
            font: {
              fontSize: "16sp",
              fontWeight: "bold",
            },
          });

          itemContainer.add(lblSortMethod);
        }
    },
    sortMethodClicked = function (e) {
      if (
        ((selectedSortButton.children[0].children[1].visible = false),
        (selectedSortButton = e.source),
        (selectedSortButton.children[0].children[1].visible = true),
        sortMethod != selectedSortButton.sortMethodId)
      ) {
        (sortMethod = selectedSortButton.sortMethodId),
          ("top" != sortMethod || isGroupRant) &&
            setTimeout(function () {
              filterBarOpened && toggleFilterMenu();
            }, 1200),
          me.doRefresh();
        var useSaveSuffix = "";
        isGroupRant
          ? (useSaveSuffix = "GroupRant")
          : isStories && (useSaveSuffix = "Stories"),
          Ti.App.Properties.setString("sortMethod" + useSaveSuffix, sortMethod);
      }
    },
    createList = function () {
      var RantListView = require("ui/common/RantListView5");

      (me.rantList = new RantListView()),
        me.rantList.init({
          ref: "feed",

          height: Ti.UI.FILL,
          scrollHitBottomCallback: scrollHitBottom,
          listParent: me.container,
          maxChrs: isStories ? 1e3 : 300,
          refreshCallback: function () {
            me.doRefresh(false);
          },
        }),
        (me.listContainer = me.rantList.getView()),
        (me.listContainer.zIndex = 100),
        Ti.App.isAndroid && (me.listContainer.height = Ti.UI.FILL),
        (me.listContainer.top = Ti.App.topBarGenerator.topBarHeight),
        Ti.App.isAndroid && (me.listContainer.bottom = Ti.App.tabBarHeight),
        me.container.add(me.listContainer);
    },
    scrollHitBottom = function () {
      me.noMoreResults || (me.rantList.showLoadingRow(), me.fetchFeedData());
    },
    createLoader = function () {
      var ContentLoader = require("ui/common/ContentLoader");

      me.loader = new ContentLoader();
      var loaderElement = me.loader.getElem();
      (loaderElement.zIndex = 0), me.container.add(loaderElement);
    },
    createTopRangeFilter = function () {
      var _Mathfloor = Math.floor,
        fromSortTap = filterBarContainer && filterBarContainer.visible;
      (fromSortTap = false),
        (tabElems = {}),
        (topRangeFilter = Ti.UI.createView({
          width: "100%",
          height: topRangeHeight,
          backgroundColor: Ti.App.colorBgTabs,
          top: filterBarOpened ? 0 : Ti.App.topBarGenerator.topBarHeight,
          zIndex: 20,
        }));
      var tab,
        tabContainer,
        tabWidth = _Mathfloor(Ti.App.realWidth / timeOptions.length);

      for (i = 0; i < timeOptions.length; ++i) {
        (tabInfo = timeOptions[i]),
          (tabElems[tabInfo.id] = {}),
          (tabContainer = Ti.UI.createView({
            width: tabWidth,
            height: "100%",
            left: i * tabWidth,
          }));

        var lblFilter = Ti.UI.createLabel({
          text: tabInfo.label,
          color: Ti.App.colorTabText,
          top: 13,
          font: {
            fontSize: Ti.App.fontBody,
            fontWeight: "bold",
          },
        });

        tabContainer.add(lblFilter);

        var bottomLine = Ti.UI.createView({
          width: tabWidth,
          height: 1,
          backgroundColor:
            3 == Ti.App.theme ? Ti.App.colorBlack : Ti.App.colorLine,
          bottom: 0,
        });

        tabContainer.add(bottomLine);

        var bottomIndicator = Ti.UI.createView({
          width: 0.85 * tabWidth,
          height: 4,
          borderRadius: 3,
          borderWidth: 0,
          bottom: 0,
          backgroundColor: Ti.App.colorTabText,
          visible: 1 == i,
        });

        tabContainer.add(bottomIndicator),
          (tabElems[tabInfo.id].bottomIndicator = bottomIndicator),
          topRangeFilter.add(tabContainer);

        var buildCallback = function (field) {
          return function () {
            switchHighlightedTab(field);
          };
        };

        tabContainer.addEventListener("click", buildCallback(tabInfo.id));
      }

      (me.listContainer.top =
        Ti.App.topBarGenerator.topBarHeight + topRangeHeight),
        me.container.add(topRangeFilter),
        filterBarOpened &&
          ((filterBarOpened = false),
          topRangeFilter.animate({
            top: Ti.App.topBarGenerator.topBarHeight,
            duration: 300,
          }));
    },
    switchHighlightedTab = function (field) {
      (tabElems[topRangeSortMethod].bottomIndicator.visible = false),
        (topRangeSortMethod = field),
        (tabElems[field].bottomIndicator.visible = true),
        me.doRefresh();
    };

  me.fetchFeedData = function () {
    me.stopUpdateTimer();
    var params = {
      limit: me.numRantsFetchPerRequest,
      skip: me.numRantsLoaded,
      sort: sortMethod,
    };

    "top" != sortMethod || isGroupRant
      ? null != topRangeFilter &&
        (me.container.remove(topRangeFilter), (topRangeFilter = null))
      : (null == topRangeFilter &&
          ((topRangeSortMethod = "week"), createTopRangeFilter()),
        (params.range = topRangeSortMethod)),
      0 == me.numRantsLoaded && me.loader.showLoader(),
      0 != me.numRantsLoaded ||
        Ti.App.isLoggedIn() ||
        isGroupRant ||
        (params.seen_news = JSON.stringify(
          Ti.App.Properties.getList("read_news_ids", [])
        )),
      isGroupRant && selectedWeek && (params.week = selectedWeek),
      (params.hide_reposts = Ti.App.Properties.getBool("hideReposts", false)
        ? 1
        : 0),
      _filters && _filters.length && (params.filters = _filters.join(",")),
      null != rantSetId && (params.prev_set = rantSetId);

    var useEndpoint = "rants";

    isGroupRant
      ? (useEndpoint = "weekly-rants")
      : isStories
      ? (useEndpoint = "story-rants")
      : isCollabs && (useEndpoint = "collabs");

    var apiArgs = {
      method: "GET",
      endpoint: "devrant/" + useEndpoint,
      params: params,
      callback: getRantsComplete,
      includeAuth: true,
    };

    (_rantFetchApiCall = Ti.App.api(apiArgs)),
      (me.lastRantFetchTime = Date.now() / 1e3);
  };
  var getRantsComplete = function (result) {
      if (null != me) {
        if (
          ((_rantFetchApiCall = null),
          me.loader.hideLoader(),
          me.rantList.removeLoadingRow(),
          result && result.set && (rantSetId = result.set),
          void 0 === result.rants)
        )
          me.rantList.addRantsToList([]),
            3 <= me.rantList.listSection.items.length &&
              (Ti.App.isAndroid
                ? me.rantList
                    .getView()
                    .scrollToItem(0, me.rantList.listSection.items.length - 3)
                : setTimeout(function () {
                    me.rantList
                      .getView()
                      .scrollToItem(
                        0,
                        me.rantList.listSection.items.length - 3
                      );
                  }, 50)),
            result.invalid_token ||
              Ti.App.showDialog(
                "Whoops!",
                "There was a connectivity issue while loading rants. Please scroll down/refresh to try again."
              );
        else if (
          (result.rants.length < me.numRantsFetchPerRequest &&
            (me.noMoreResults = true),
          (me.numRantsLoaded += result.rants.length),
          me.rantList.addRantsToList(result.rants),
          isCollabs &&
            null != result.has_free &&
            (hasFreeCollab = result.has_free),
          null != result.dpp)
        )
          if (result.dpp) Ti.App.dpp = true;
          else {
            Ti.App.dpp = false;
            var curTime = Date.now(),
              lastPopup = Ti.App.Properties.getDouble("dpp_modal_4", 0);
            0 == lastPopup
              ? Ti.App.Properties.setDouble("dpp_modal_4", curTime)
              : 0 < numRefreshes &&
                864e6 <= curTime - lastPopup &&
                (Ti.App.openSupporterModalWindow(),
                Ti.App.Properties.setDouble("dpp_modal_4", curTime)),
              3 == Ti.App.theme && Ti.App.Properties.setInt("theme", 2),
              Ti.App.binaryScores &&
                Ti.App.Properties.setBool("binaryScores", false);
          }

        isGroupRant ||
          isStories ||
          isCollabs ||
          me.setNotifIndicatorFromResult(result),
          result.wrw && (Ti.App.weeklyRantWeek = result.wrw),
          result.news && (newsBar && destroyNews(), showNews(result.news)),
          me.startUpdateTimer();
      }
    },
    destroyNews = function () {
      me.container.remove(newsBar), (newsBar = null);
    },
    showNews = function (news) {
      newsBarHeight = news.height;
      var topRangeFilterOffset = 0;

      filterBarOpened && (topRangeFilterOffset = filterBarHeight),
        (newsBar = Ti.UI.createView({
          width: Ti.App.realWidth,
          height: newsBarHeight,
          backgroundColor: Ti.App.colorBg,
          zIndex: 50,
          top: Ti.App.topBarGenerator.topBarHeight + topRangeFilterOffset,
        }));
      var newImgWidth = 350 < Ti.App.realWidth ? 100 : 80,
        newsImgRtMargin = 70 < newsBarHeight ? 18 : 32,
        newsImgBtmMargin = 70 < newsBarHeight ? 0 : -12,
        btmLine = Ti.UI.createView({
          width: "100%",
          height: 1,
          backgroundColor: Ti.App.colorLine,
          bottom: 0,
        });

      newsBar.add(btmLine);

      var textColumn = Ti.UI.createView({
        width: isGroupRant
          ? Ti.App.realWidth - 30
          : Ti.App.realWidth - newImgWidth - newsImgRtMargin - 15,
        height: Ti.UI.SIZE,
        layout: "vertical",
        touchEnabled: false,

        left: 15,
        top: 9,
      });

      if ((newsBar.add(textColumn), null != news.headline)) {
        var lblHeadline = Ti.UI.createLabel({
          width: "100%",
          height: Ti.UI.SIZE,
          text: news.headline,
          left: 0,
          touchEnabled: false,
          color: Ti.App.colorNewsText,
          font: {
            fontSize: Ti.App.fontBody,
            fontWeight: "bold",
          },
        });

        textColumn.add(lblHeadline);
      }

      if (null != news.body) {
        var lblBody = Ti.UI.createLabel({
          width: "100%",
          height: Ti.UI.SIZE,
          text: news.body,
          left: 0,
          touchEnabled: false,
          color: Ti.App.colorNewsText,
          font: {
            fontSize: Ti.App.fontBody,
          },
        });

        textColumn.add(lblBody);
      }

      if (null != news.footer) {
        var lblFooter = Ti.UI.createLabel({
          width: "100%",
          height: Ti.UI.SIZE,
          text: news.footer,
          left: 0,
          top: 5,
          touchEnabled: false,
          color: Ti.App.colorHint,
          font: {
            fontSize: Ti.App.fontS,
            fontWeight: "bold",
          },
        });

        textColumn.add(lblFooter);
      }

      if (!isGroupRant) {
        var image = Ti.UI.createImageView({
          image: "/ui/announcementbar-guy1.png",
          width: newImgWidth,
          height: 0.74 * newImgWidth,
          right: newsImgRtMargin,
          bottom: newsImgBtmMargin,
        });

        newsBar.add(image);
      }

      if (!isGroupRant) {
        var lblX = Ti.UI.createLabel({
          right: 0,
          top: 0,
          width: 40,
          height: 37,
          textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,

          text: "\uE90E",
          color: Ti.App.colorFieldIcon,
          font: {
            fontFamily: "icomoon",
            fontSize: "20sp",
          },
        });

        newsBar.add(lblX), lblX.addEventListener("click", closeNews);
      }

      (newsBar.newsInfo = {
        id: news.id,
        type: news.type,
        action: news.action,
      }),
        me.container.add(newsBar),
        (me.listContainer.top =
          Ti.App.topBarGenerator.topBarHeight +
          newsBarHeight +
          topRangeFilterOffset),
        Ti.App.isAndroid && me.rantList.fixRefreshControl(),
        isGroupRant || newsBar.addEventListener("click", goNews);
    },
    goNews = function () {
      if ("extlink" == newsBar.newsInfo.type)
        "" != newsBar.newsInfo.action &&
          Ti.Platform.openURL(newsBar.newsInfo.action);
      else if ("intlink" == newsBar.newsInfo.type)
        switch (newsBar.newsInfo.action) {
          case "grouprant":
            Ti.App.openGroupRantWindow();
            break;
          case "collabs":
            Ti.App.tabBar.navigateToTabById("collabs");
        }
      else if ("rant" == newsBar.newsInfo.type) {
        var parts = newsBar.newsInfo.action.split("-");
        Ti.App.openRantWindow(parts[1], false, "collab" == parts[0] ? 2 : 1);
      }
      closeNews();
    },
    closeNews = function (e) {
      e && (e.cancelBubble = true);

      var topRangeFilterOffset = 0;

      topRangeFilter && (topRangeFilterOffset = filterBarHeight),
        (me.listContainer.top =
          Ti.App.topBarGenerator.topBarHeight + topRangeFilterOffset);

      var news_id = newsBar.newsInfo.id;

      if ((destroyNews(), Ti.App.isLoggedIn())) {
        var apiArgs = {
          method: "POST",
          endpoint: "users/me/mark-news-read",
          params: {
            news_id: news_id,
          },

          includeAuth: true,
        };

        Ti.App.api(apiArgs);
      }

      var savedReadNewsIds = Ti.App.Properties.getList("read_news_ids", []);

      10 == savedReadNewsIds.length && savedReadNewsIds.shift(),
        savedReadNewsIds.push(news_id),
        Ti.App.Properties.setList("read_news_ids", savedReadNewsIds);
    };

  (me.setNotifIndicatorFromResult = function (result) {
    result &&
      result.unread &&
      "notifs" != Ti.App.tabBar.getCurrentTabId() &&
      (Ti.App.tabBar.setBadgeCount("notifs", result.unread.total),
      Ti.App.sendLocalNotifIfNeeded(result.unread.total));
  }),
    (me.updateRantDetails = function () {
      var rantsToUpdate = me.rantList.getItemIdsToCheckForUpdate();

      params = {
        ids: JSON.stringify(rantsToUpdate),
      };

      var apiArgs = {
        method: "GET",
        endpoint: "devrant/rants",
        params: params,
        callback: getUpdateRantsComplete,
        includeAuth: true,
      };

      Ti.App.api(apiArgs);
    });

  var getUpdateRantsComplete = function (result) {
    null == me ||
      (!Ti.App.isAndroid &&
        !me.rantList.listIsScrolling &&
        result &&
        result.rants &&
        result.rants.length &&
        me.rantList.updateRants(result.rants),
      me.startUpdateTimer(),
      me.setNotifIndicatorFromResult(result));
  };

  me.doRefresh = function () {
    if (
      ((me.noMoreResults = false),
      (rantSetId = null),
      (me.numRantsLoaded = 0),
      Ti.App.isAndroid && me.container.remove(me.listContainer),
      me.rantList.clearList(),
      Ti.App.isAndroid)
    ) {
      createList();
      var useOffset = 0;

      filterBarOpened
        ? (useOffset = filterBarHeight)
        : topRangeFilter && (useOffset = topRangeHeight),
        (me.listContainer.top =
          Ti.App.topBarGenerator.topBarHeight + useOffset);
    }
    me.fetchFeedData(),
      ++numRefreshes,
      7 == numRefreshes &&
        0 == Ti.App.Properties.getInt("showedAlgoInfo", 0) &&
        (Ti.App.Properties.setInt("showedAlgoInfo", 1),
        Ti.App.showDialog(
          "Helpful Tip #1",
          "The more rants you ++, the better our algo gets at showing you more rants you'll enjoy."
        ));
  };

  var windowClosed = function () {
    me.closeWindow(false, true);
  };

  (me.closeWindow = function (animated, noClose) {
    null == me ||
      ((noClose = noClose || false),
      me.window.removeEventListener("close", windowClosed),
      null == animated && (animated = true),
      null != me.rantList && me.rantList.destroySeries(),
      !noClose &&
        isGroupRant &&
        me.window.close({
          animated: animated,
        }),
      isGroupRant && Ti.App.tabBar.closedWindow("weekly_rant", me),
      (me = null));
  }),
    (me.getContainer = function () {
      return me.container;
    }),
    (me.onAppPause = function (is) {
      null == me ||
        isStories ||
        isGroupRant ||
        isCollabs ||
        me.stopUpdateTimer();
    });

  var doRefreshCheck = function () {
    var timeSinceLastFetch = Date.now() / 1e3 - me.lastRantFetchTime,
      rantListIsAtTop = 5 >= me.rantList.firstVisibleItem;
    return rantListIsAtTop && 500 <= timeSinceLastFetch
      ? (me.doRefresh(), true)
      : 10800 <= timeSinceLastFetch
      ? (me.doRefresh(), true)
      : void 0;
  };

  return (
    (me.onAppResume = function (isSelected) {
      null == me ||
        isStories ||
        isGroupRant ||
        (isSelected && doRefreshCheck()) ||
        me.startUpdateTimer();
    }),
    (me.onTabShow = function () {
      null == me || isStories || isGroupRant || doRefreshCheck();
    }),
    me
  );
}

module.exports = RantListWindow;
