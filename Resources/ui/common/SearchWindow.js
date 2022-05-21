function SearchWindow() {
  var me = this;

  (me.window = null),
    (me.container = null),
    (me.contentContainer = null),
    (me.popularTermListContainer = null),
    (me.popularTermListSection = null),
    (me.topBar = null),
    (me.term = null),
    (me.searchBox = null),
    (me.rantList = null),
    (me.rantListContainer = null),
    (me.btnX = null),
    (me.loader = null),
    (me.ref = null),
    (me.init = function (term, ref) {
      (me.term = term), (me.ref = ref || ""), createElements();
    });
  var createElements = function () {
      var winProps = {
        navBarHidden: true,

        width: "100%",
        height: "100%",
        orientationModes: [Ti.UI.PORTRAIT],
      };

      Ti.App.isAndroid &&
        (winProps.windowSoftInputMode =
          Titanium.UI.Android.SOFT_INPUT_STATE_HIDDEN),
        (me.window = Ti.UI.createWindow(winProps)),
        me.window.addEventListener("open", windowOpened),
        me.window.addEventListener("close", windowClosed),
        (me.container = Ti.UI.createView({
          width: "100%",
          height: "100%",
          layout: "vertical",
        })),
        me.window.add(me.container),
        createSubSections();
    },
    windowOpened = function () {},
    createSubSections = function () {
      createTopBar(),
        (me.contentContainer = Ti.UI.createView({
          width: "100%",
          height: Ti.UI.FILL,
        })),
        me.container.add(me.contentContainer);

      var imgBg = Ti.UI.createImageView({
        top: 0,
        image: Ti.App.loaderBg,
        width: Ti.App.realWidth,
        height: 2.165 * Ti.App.realWidth,
        backgroundColor: Ti.App.colorImgBg,
        defaultImage: "",
      });

      me.contentContainer.add(imgBg);

      var ContentLoader = require("ui/common/ContentLoader");

      me.loader = new ContentLoader();
      var loaderElement = me.loader.getElem();
      (loaderElement.zIndex = 0),
        me.contentContainer.add(loaderElement),
        me.term
          ? (setTermInputTextFromTerm(), doTermSearch("tag"))
          : (createPopularTermList(),
            setTimeout(function () {
              me.searchBox.input.focus();
            }, 600));
    },
    setTermInputTextFromTerm = function () {
      me.searchBox.input.value = me.term;
    },
    createPopularTermList = function () {
      var textTemplate = {
          properties: {
            backgroundColor: Ti.App.colorBg,
          },

          childTemplates: [
            {
              type: "Ti.UI.Label",
              properties: {
                width: Ti.App.realWidth,
                height: Ti.UI.SIZE,
                text: "this is a test!!!!",
              },
            },
          ],
        },
        termTemplate = {
          properties: {
            backgroundColor: Ti.App.colorBg,
          },

          childTemplates: [
            {
              type: "Ti.UI.View",
              properties: {
                width: Ti.App.realWidth,
                height: Ti.UI.SIZE,
                layout: "vertical",
              },

              childTemplates: [
                {
                  type: "Ti.UI.View",
                  properties: {
                    width: "100%",
                    height: Ti.UI.SIZE,
                    top: 6,
                    bottom: 6,
                    layout: "horizontal",
                  },

                  childTemplates: [
                    {
                      type: "Ti.UI.Label",
                      properties: {
                        width: Ti.UI.SIZE,
                        height: Ti.UI.SIZE,
                        left: 12,
                        text: "\uE801",
                        color: Ti.App.colorIcon,
                        font: {
                          fontFamily: "icomoon",
                          fontSize: Ti.App.fontXL,
                        },
                      },
                    },

                    {
                      type: "Ti.UI.Label",
                      bindId: "lblTerm",
                      properties: {
                        width: Ti.UI.SIZE,
                        height: Ti.UI.SIZE,
                        left: 12,
                        text: "Sample",
                        color: Ti.App.colorTermLink,
                        font: {
                          fontSize: Ti.App.fontBody,
                          fontWeight: "bold",
                        },
                      },
                    },
                  ],
                },

                {
                  type: "Ti.UI.View",
                  properties: {
                    backgroundColor: Ti.App.colorLine,
                    width: "100%",
                    height: 1,
                  },
                },
              ],
            },
          ],
        },
        templates = {
          term: termTemplate,
          text: textTemplate,
        };

      (me.popularTermListSection = Ti.UI.createListSection()),
        (me.popularTermListContainer = Ti.UI.createListView({
          top: 0,
          width: Ti.App.realWidth,
          height: "100%",
          sections: [me.popularTermListSection],
          backgroundColor: "#00ffffff",
          templates: templates,
          defaultItemTemplate: "term",
          separatorStyle: Ti.App.isAndroid
            ? null
            : Ti.UI.TABLE_VIEW_SEPARATOR_STYLE_NONE,
          scrollIndicatorStyle: Ti.App.scrollBarStyle,
          separatorHeight: 0,
        })),
        me.contentContainer.add(me.popularTermListContainer),
        fetchPopularTerms(),
        me.popularTermListContainer.addEventListener(
          "itemclick",
          popularTermlistItemClicked
        );
    },
    openPopularTermsList = function () {
      me.popularTermListContainer
        ? (me.popularTermListContainer.visible = true)
        : createPopularTermList(),
        me.searchBox.input.focus();
    },
    popularTermlistItemClicked = function (e) {
      var item = me.popularTermListSection.getItemAt(e.itemIndex);
      (me.term = item.info.term),
        me.searchBox.input.blur(),
        setTermInputTextFromTerm(),
        doTermSearch("popular");
    },
    fetchPopularTerms = function () {
      var params = {
          ref: me.ref,
        },
        apiArgs = {
          method: "GET",
          endpoint: "devrant/search/tags",
          params: params,
          callback: getTermsComplete,
          includeAuth: true,
        };

      Ti.App.api(apiArgs);
    },
    getTermsComplete = function (result) {
      if (null != me && result && result.tags && result.tags.length) {
        for (var dataItem, addTerms = [], i = 0; i < result.tags.length; ++i)
          (dataItem = {
            template: "term",
            info: {
              term: result.tags[i],
            },

            properties: {
              height: Ti.UI.SIZE,
              selectionStyle: Ti.App.isAndroid
                ? null
                : Ti.UI.iOS.ListViewCellSelectionStyle.NONE,
            },

            lblTerm: {
              text: result.tags[i],
            },
          }),
            addTerms.push(dataItem);

        me.popularTermListSection.appendItems(addTerms);
      }
    },
    createTopBar = function () {
      var topBarOptions = {
        leftBtnType: "close",
        rightBtnType: "searchCta",
        barTitle: "",
        callbackLeftBtn: function () {
          me.closeWindow();
        },
        callbackRightBtn: function () {
          doTermSearchFromInput();
        },
      };

      (me.topBar = Ti.App.topBarGenerator.createBar(topBarOptions)),
        me.container.add(me.topBar);

      var searchBoxContainer = Ti.UI.createView({
        bottom: 10,
        width: "60%",
        height: Ti.UI.SIZE,
      });

      (me.searchBox = Ti.App.createBigInputField(
        "\uE801",
        "Term or username...",
        false,
        void 0,
        true
      )),
        (me.searchBox.input.autocorrect = false),
        (me.searchBox.input.autocapitalization = false),
        (me.searchBox.input.returnKeyType = Ti.UI.RETURNKEY_SEARCH),
        me.searchBox.input.addEventListener("return", doTermSearchFromInput),
        searchBoxContainer.add(me.searchBox),
        me.topBar.add(searchBoxContainer),
        (me.btnX = Ti.UI.createView({
          width: 30,
          height: 30,

          right: 1,
          top: Ti.App.isAndroid ? 9 : 1,
          visible: false,
        }));

      var btnX = Ti.UI.createLabel({
        width: 30,
        height: 30,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,

        text: "\uE90E",
        color: Ti.App.colorHint,
        font: {
          fontFamily: "icomoon",
          fontSize: "18sp",
        },
      });

      me.btnX.add(btnX),
        searchBoxContainer.add(me.btnX),
        me.btnX.addEventListener("click", clearCurrentSearchTerm);
    },
    clearCurrentSearchTerm = function () {
      (me.btnX.visible = false),
        (me.term = ""),
        (me.searchBox.input.value = ""),
        (me.rantListContainer.visible = false),
        Ti.App.isAndroid && me.contentContainer.remove(me.rantListContainer),
        me.rantList.clearList(),
        Ti.App.isAndroid && (me.rantList = null),
        openPopularTermsList(),
        me.loader.hideLoader();
    },
    doTermSearchFromInput = function () {
      (me.term = me.searchBox.input.value),
        me.searchBox.input.blur(),
        doTermSearch("input");
    },
    createRantList = function () {
      var RantListView = require("ui/common/RantListView5");

      (me.rantList = new RantListView()),
        me.rantList.init({
          ref: "search",
          height: "100%",
          showUsernames: true,
        }),
        (me.rantListContainer = me.rantList.getView()),
        (me.rantListContainer.zIndex = 10),
        me.contentContainer.add(me.rantListContainer);
    },
    doTermSearch = function (searchType) {
      (searchType = searchType || ""),
        me.popularTermListContainer &&
          (me.popularTermListContainer.visible = false),
        null == me.rantList
          ? createRantList()
          : (Ti.App.isAndroid &&
              me.contentContainer.remove(me.rantListContainer),
            me.rantList.clearList(),
            Ti.App.isAndroid && createRantList(),
            (me.rantListContainer.visible = true)),
        me.loader.showLoader(),
        (me.btnX.visible = true);
      var params = {
          term: me.term,
          ref: me.ref,
          type: searchType,
        },
        apiArgs = {
          method: "GET",
          endpoint: "devrant/search",
          params: params,
          callback: getSearchResultComplete,
          includeAuth: true,
        };

      Ti.App.api(apiArgs);
    },
    getSearchResultComplete = function (result) {
      null == me ||
        (me.loader.hideLoader(),
        result && result.results
          ? result.results.length
            ? me.rantList.addRantsToList(result.results)
            : (clearCurrentSearchTerm(),
              Ti.App.showDialog(
                "Whoops!",
                "Your search didn't return any results. Please try a different term!"
              ))
          : (result &&
              result.show_user &&
              Ti.App.openProfileWindow(result.show_user),
            clearCurrentSearchTerm()));
    },
    windowClosed = function () {
      me.closeWindow(false, true);
    };

  return (
    (me.closeWindow = function (animated, noClose) {
      me.window.removeEventListener("close", windowClosed),
        (noClose = noClose || false),
        null == animated && (animated = true),
        null != me.rantList && me.rantList.destroySeries(),
        Ti.App.tabBar.closedWindow("search", me),
        noClose || me.window.close({ animated: animated }),
        (me = null);
    }),
    (me.getWindow = function () {
      return me.window;
    }),
    me
  );
}

module.exports = SearchWindow;
