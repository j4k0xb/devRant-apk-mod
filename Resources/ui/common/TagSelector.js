function TagSelector() {
  var me = this;
  me.selectorHeight = 42;
  var container, input, yCalcCallback, shown, parent, currentRequest;

  me.init = function (useInput, useWidth, useParent, useYCalc) {
    (shown = false),
      (input = useInput),
      (parent = useParent),
      (currentRequest = null),
      (yCalcCallback = useYCalc),
      (container = Ti.UI.createScrollView({
        width: useWidth,
        height: me.selectorHeight,
        layout: "horizontal",
        backgroundColor: Ti.App.colorField,
        borderColor: Ti.App.colorLine,
        borderWidth: 1,
        borderRadius: 12,
        horizontalWrap: false,
      })),
      container.addEventListener("click", tagClick),
      useInput.addEventListener("change", inputChanged),
      useInput.addEventListener("blur", inputBlurred);
  };
  var inputBlurred = function () {
      shown && ((shown = false), parent.remove(container));
    },
    inputChanged = function (e) {
      currentRequest && (currentRequest.abort(), (currentRequest = null));

      var currentSelection = input.getSelection();

      if (0 == currentSelection.length) {
        var firstComma,
          selectionLocation = currentSelection.location,
          fullText = input.value,
          lastComma = fullText.indexOf(",", selectionLocation);

        firstComma =
          -1 == lastComma
            ? fullText.lastIndexOf(",")
            : fullText.substring(0, lastComma).lastIndexOf(",");

        var tag = "";
        return (
          (tag =
            -1 == firstComma
              ? fullText.trim()
              : -1 == lastComma
              ? fullText.substr(firstComma + 1).trim()
              : fullText.substring(firstComma + 1, lastComma).trim()),
          "" == tag ? void inputBlurred() : void fetchResultsFromTag(tag)
        );
      }
    },
    fetchResultsFromTag = function (tag) {
      var params = {
          tag: tag,
          limit: 10,
        },
        apiArgs = {
          method: "GET",
          endpoint: "devrant/search/tags",
          params: params,
          callback: getTagsComplete,
          includeAuth: true,
        };

      currentRequest = Ti.App.api(apiArgs);
    },
    getTagsComplete = function (result) {
      if (
        ((currentRequest = null), !!result.success) &&
        (!shown && result.tags && result.tags.length && showTagSelector(),
        clearTagSelector(),
        null != result.tags)
      ) {
        if (0 == result.tags.length) return void inputBlurred();

        addItemsToTagSelector(result.tags);
      }
    },
    clearTagSelector = function () {
      for (
        var children = container.children, i = children.length - 1;
        0 <= i;
        --i
      )
        container.remove(children[i]);
    },
    addItemsToTagSelector = function (items) {
      var i,
        elem,
        lbl,
        divider,
        endAt = items.length - 1;

      for (i = 0; i < items.length; ++i)
        (elem = Ti.UI.createView({
          width: Ti.UI.SIZE,
          layout: "horizontal",
          height: "100%",
          tagName: items[i],
        })),
          (lbl = Ti.UI.createLabel({
            width: Ti.UI.SIZE,
            height: Ti.UI.SIZE,
            text: items[i],
            color: Ti.App.colorHint,
            font: {
              fontSize: Ti.App.fontS,
              fontWeight: "bold",
            },

            left: 10,
            right: 10,
            touchEnabled: false,
          })),
          elem.add(lbl),
          (divider = Ti.UI.createView({
            width: 1,
            height: "100%",
            backgroundColor: Ti.App.colorLine,
            visible: i != endAt,
          })),
          elem.add(divider),
          container.add(elem);
    },
    showTagSelector = function () {
      (shown = true), (container.top = yCalcCallback()), parent.add(container);
    },
    tagClick = function (e) {
      if (e && e.source && e.source.tagName) {
        var currentSelection = input.getSelection();

        if (0 == currentSelection.length) {
          var firstComma,
            selectionLocation = currentSelection.location,
            fullText = input.value,
            lastComma = fullText.indexOf(",", selectionLocation);

          firstComma =
            -1 == lastComma
              ? fullText.lastIndexOf(",")
              : fullText.substring(0, lastComma).lastIndexOf(",");

          var tag = "";

          (input.value =
            -1 == firstComma
              ? e.source.tagName + ", "
              : -1 == lastComma
              ? fullText.substr(0, firstComma) + ", " + e.source.tagName + ", "
              : fullText.substr(0, firstComma) +
                ", " +
                e.source.tagName +
                fullText.substr(lastComma)),
            inputBlurred(),
            Ti.App.isAndroid &&
              input.setSelection(input.value.length, input.value.length);
        }
      }
    };

  return me;
}

module.exports = TagSelector;
