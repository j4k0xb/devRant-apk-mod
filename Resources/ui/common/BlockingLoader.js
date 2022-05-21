function BlockingLoader() {
  var me = this;

  return (
    (me.container = null),
    (me.init = function () {
      me.container = Ti.UI.createView({
        width: "100%",
        height: "100%",
        visible: false,
        opacity: 0,
      });
      var shader = Ti.UI.createView({
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        opacity: 0.3,
      });
      me.container.add(shader);
      var indicator = Ti.UI.createActivityIndicator({
        font: {
          fontFamily: Ti.App.isAndroid ? "Roboto" : "Helvetica Neue",
          fontSize: 26,
          fontWeight: "bold",
        },
        style: Ti.UI.ActivityIndicatorStyle.BIG,
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE,
      });
      me.container.add(indicator), indicator.show();
    }),
    (me.getElem = function () {
      return me.container;
    }),
    (me.showLoader = function () {
      me.container.setVisible(true),
        me.container.animate({ opacity: 1, duration: 275 });
    }),
    (me.hideLoader = function () {
      me.container.animate({ opacity: 0, duration: 200 }),
        setTimeout(me.hideDone, 200);
    }),
    (me.hideDone = function () {
      me.container.setVisible(false);
    }),
    me.init(),
    me
  );
}

module.exports = BlockingLoader;
