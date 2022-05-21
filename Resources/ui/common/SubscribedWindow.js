function SubscribedWindow() {
  var me = this,
    filterBarHeight = 50,
    topRangeHeight = 50,
    filterBarCreated = false,
    filterBarContainer = null,
    selectedSortButton = null,
    filterBarOpened = false,
    topRangeFilter = null,
    topRangeSortMethod = null,
    _filters = [],
    _endCursor = null,
    _rantFetchApiCall = null,
    filterOptions = [
      {
        id: "posted",
        label: "Rants Posted",
      },

      {
        id: "commentedOn",
        label: "Rants Commented On",
      },

      {
        id: "liked",
        label: "Rants Liked",
      },
    ];

  (me.numRantsLoaded = 0),
    (me.noMoreResults = false),
    (me.window = null),
    (me.container = null),
    (me.listContainer = null),
    (me.rantList = null),
    (me.loader = null),
    (me.inBackground = false),
    (me.init = function (group, week, stories, collabs) {
      (me.topTabsOffset = Ti.App.isAndroid ? Ti.App.tabBarHeight : 0),
        (_filters = Ti.App.Properties.getList("subscribed_filters", [])),
        me.createElements();
    }),
    (me.getWindow = function () {
      return me.window;
    }),
    (me.createElements = function () {
      var firstCreate = null == me.window;
      (filterBarCreated = false),
        firstCreate
          ? (me.window = Ti.UI[
              Ti.App.isAndroid ? "createView" : "createWindow"
            ]({
              top: 0,
              width: "100%",
              height: Ti.UI.FILL,
              backgroundColor: Ti.App.colorBg,
              navBarHidden: true,
              exitOnClose: false,
              swipeToClose: false,
              orientationModes: [Ti.UI.PORTRAIT],
            }))
          : (me.window.backgroundColor = Ti.App.colorBg),
        (me.container = Ti.UI.createView({
          top: 0,
          width: "100%",
          height: "100%",
        })),
        me.window.add(me.container);

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
  var createTopBar = function () {
      var useTitle = "Subscribed",
        useRightBtn = "filter",
        topBarOptions = {
          leftBtnType: null,
          rightBtnType: useRightBtn,
          rightSecondaryBtnType: "none",
          barTitle: "Subscribed",
          callbackRightBtn: function () {
            toggleFilterMenu();
          },
          callbackRightSecondaryBtn: null,
        },
        topBar = Ti.App.topBarGenerator.createBar(topBarOptions);
      (topBar.zIndex = 30),
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

        (params = {
          top: spaceOnTop,
          duration: 300,
        }),
          Ti.App.isAndroid,
          me.listContainer.animate(params);
      } else {
        var spaceOnTop = Ti.App.topBarGenerator.topBarHeight;

        (params = {
          top: spaceOnTop,

          duration: 300,
        }),
          Ti.App.isAndroid,
          me.listContainer.animate(params, function () {
            filterBarContainer.visible = false;
          });
      }
    },
    createFilterBar = function () {
      (filterBarCreated = true),
        (filterBarContainer = Ti.UI.createView({
          zIndex: 0,
          top: Ti.App.topBarGenerator.topBarHeight,
          width: "100%",
          height: filterBarHeight,
          backgroundColor: Ti.App.colorBgTabs,
        })),
        me.container.add(filterBarContainer);

      var midLine = Ti.UI.createView({
        width: "100%",
        height: 1,
        backgroundColor:
          3 == Ti.App.theme ? Ti.App.colorBlack : Ti.App.colorLine,
        top: 50,
      });

      filterBarContainer.add(midLine);

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

      filterBarContainer.add(innerContainer);

      var bottomContainer = Ti.UI.createScrollView({
        scrollType: "horizontal",
        top: 0,
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
            Ti.App.Properties.setList("subscribed_filters", selectedFilters),
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
    },
    createList = function () {
      var SubscribedListView = require("ui/common/SubscribedListView");

      (me.rantList = new SubscribedListView()),
        me.rantList.init({
          ref: "feed",
          height: Ti.UI.FILL,
          scrollHitBottomCallback: scrollHitBottom,
          listParent: me.container,
          maxChrs: 300,
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
      console.log("ready to load more"),
        me.noMoreResults || (me.rantList.showLoadingRow(), me.fetchFeedData());
    },
    createLoader = function () {
      var ContentLoader = require("ui/common/ContentLoader");

      me.loader = new ContentLoader();
      var loaderElement = me.loader.getElem();
      (loaderElement.zIndex = 0), me.container.add(loaderElement);
    };

  me.fetchFeedData = function () {
    var params = {};

    0 == me.numRantsLoaded && me.loader.showLoader(),
      _filters && _filters.length && (params.filter = _filters.join(",")),
      null != _endCursor && (params.activity_before = _endCursor);

    var apiArgs = {
      method: "GET",
      endpoint: "me/subscribed-feed",
      params: params,
      callback: getRantsComplete,
      includeAuth: true,
    };

    _rantFetchApiCall = Ti.App.api(apiArgs);
  };

  var getRantsComplete = function (result) {
    null == me ||
      ((_rantFetchApiCall = null),
      me.loader.hideLoader(),
      me.rantList.removeLoadingRow(),
      void 0 === result.feed
        ? (me.rantList.addRantsToList([]),
          3 <= me.rantList.listSection.items.length &&
            (Ti.App.isAndroid
              ? me.rantList
                  .getView()
                  .scrollToItem(0, me.rantList.listSection.items.length - 3)
              : setTimeout(function () {
                  me.rantList
                    .getView()
                    .scrollToItem(0, me.rantList.listSection.items.length - 3);
                }, 50)),
          !result.invalid_token &&
            Ti.App.showDialog(
              "Whoops!",
              "There was a connectivity issue while loading rants. Please scroll down/refresh to try again."
            ))
        : (result.feed.activity.page_info.has_next_page
            ? (_endCursor = result.feed.activity.page_info.end_cursor)
            : (me.noMoreResults = true),
          (me.numRantsLoaded += result.feed.activity.items.length),
          me.rantList.addRantsToList(
            result.feed.activity.items,
            result.feed.users,
            result.feed.rec_users.items
          )));
  };

  (me.doRefresh = function () {
    if (
      ((me.noMoreResults = false),
      (_endCursor = null),
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
    me.fetchFeedData();
  }),
    (me.closeWindow = function (animated, noClose) {
      null == me ||
        ((noClose = noClose || false),
        null == animated && (animated = true),
        (me = null));
    }),
    (me.getContainer = function () {
      return me.container;
    }),
    (me.onAppPause = function (is) {
      null == me;
    });

  var doRefreshCheck = function () {};

  return (
    (me.onAppResume = function (isSelected) {
      null == me;
    }),
    (me.onTabShow = function () {
      null == me;
    }),
    me
  );
}

module.exports = SubscribedWindow;
