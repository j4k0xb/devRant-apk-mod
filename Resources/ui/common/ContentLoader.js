function ContentLoader() {
  var me = this;
  (me.container = null),
    (me.loaderSymbol = null),
    (me.isHiding = null),
    (me.init = function () {
      (me.container = Ti.UI.createView({
        width: "100%",
        height: "100%",
        visible: false,
        touchEnabled: false,
      })),
        buildLoader();
    });

  var buildLoader = function () {
    (me.loaderSymbol = Ti.UI.createImageView({
      image: Ti.App.loaderImg,
      width: 0.5 * Ti.App.realWidth,
      defaultImage: "",
      touchEnabled: false,
    })),
      me.container.add(me.loaderSymbol);
  };

  (me.getElem = function () {
    return me.container;
  }),
    (me.showLoader = function () {
      me.container.setVisible(true), (me.isHiding = false), animateIn();
    });
  var animateIn = function () {
      !me.container.visible ||
        me.isHiding ||
        me.loaderSymbol.animate(
          {
            width: 0.5 * Ti.App.realWidth,
            duration: 500,
          },
          animateOut
        );
    },
    animateOut = function () {
      !me.container.visible ||
        me.isHiding ||
        me.loaderSymbol.animate(
          {
            width: 0.7 * Ti.App.realWidth,
            duration: 500,
          },
          animateIn
        );
    };

  return (
    (me.hideLoader = function () {
      (me.isHiding = true),
        me.loaderSymbol.animate({ width: 0, duration: 200 }),
        setTimeout(me.hideDone, 200);
    }),
    (me.hideDone = function () {
      (me.container.visible = false),
        (me.loaderSymbol.width = 0.5 * Ti.App.realWidth);
    }),
    me.init(),
    me
  );
}

module.exports = ContentLoader;
