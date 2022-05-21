function Voter() {
  var me = this;

  me.doVote = function (params) {
    if (!Ti.App.isLoggedIn())
      return void Ti.App.openSignupWindow(
        "upVote" == params.type ? "upvote" : "downvote"
      );

    if (-2 != params.content.vote_state) {
      if ("upVote" == params.type)
        params.vote = 1 == params.content.vote_state ? 0 : 1;
      else if (-1 == params.content.vote_state) params.vote = 0;
      else if (((params.vote = -1), void 0 === params.reason)) {
        var opts = {
            cancel: 3,
            options: ["Not for me", "Repost", "Offensive/spam", "Cancel"],

            title: "Reason for downvote?",
          },
          dialog = Ti.UI.createOptionDialog(opts);

        return (
          dialog.addEventListener("click", function (e) {
            3 == e.index || ((params.reason = e.index), me.doVote(params));
          }),
          void dialog.show()
        );
      }

      if (
        (saveVote(params),
        setColorsFromRantStatus(params, params.vote),
        "rant" == params.contentType)
      ) {
        var seriesId,
          rantSeries = Ti.App.savedTabs.rants.obj.rantSeries,
          useOldScore = params.oldScore,
          useOldStatus = params.oldStatus;
        for (seriesId in rantSeries)
          rantSeries[seriesId].listSection != params.listSection &&
            null != rantSeries[seriesId].rants[params.content.id] &&
            ((params.listSection = rantSeries[seriesId].listSection),
            (params.index = rantSeries[seriesId].rants[params.content.id]),
            setColorsFromRantStatus(params, params.vote));
      }

      if (
        ((params.oldScore = useOldScore),
        (params.oldStatus = useOldStatus),
        ++Ti.App.numVotes,
        "upVote" == params.type)
      )
        if (0 < Ti.App.getPromptForPushNotifs())
          Ti.App.promtForNotificationPermIfNeeded();
        else if (0 == Ti.App.Properties.getInt("stickersPromoSeen", 0)) {
          var rantWindow = Ti.App.tabBar.getTopWindowOfType("rant");

          rantWindow
            ? Ti.App.openStickersWindowIfNeeded(rantWindow.obj.getWindow())
            : Ti.App.openStickersWindowIfNeeded(
                Ti.App.isAndroid
                  ? Ti.App.mainAppWindow
                  : Ti.App.savedTabs.rants.obj.getWindow()
              );
        } else
          8 == Ti.App.numVotes &&
            0 == Ti.App.Properties.getInt("showedDoubleTapInfo", 0) &&
            (Ti.App.Properties.setInt("showedDoubleTapInfo", 1),
            Ti.App.showDialog(
              "Helpful Tip #0",
              "You can double-tap a rant or comment to ++ it. Give it a try!"
            ));
    }
  };
  var setColorsFromRantStatus = function (
      params,
      newStatus,
      replaceContentInfo
    ) {
      var itemProps = params.listSection.getItemAt(params.index),
        oldStatus = itemProps[params.contentType].vote_state;
      params.oldStatus = oldStatus;
      var score = itemProps[params.contentType].score;
      (params.oldScore = score),
        replaceContentInfo
          ? (itemProps[params.contentType] = replaceContentInfo)
          : ((itemProps[params.contentType].vote_state = newStatus),
            1 == newStatus
              ? 0 == oldStatus
                ? ++score
                : -1 == oldStatus && (score += 2)
              : -1 == newStatus
              ? 0 == oldStatus
                ? --score
                : 1 == oldStatus && (score -= 2)
              : 0 == newStatus &&
                (1 == oldStatus ? --score : -1 == oldStatus && ++score),
            (itemProps[params.contentType].score = score)),
        (itemProps.upVote.backgroundColor = Ti.App.getVoteButtonColor(
          "up",
          newStatus
        )),
        (itemProps.downVote.backgroundColor = Ti.App.getVoteButtonColor(
          "down",
          newStatus
        )),
        3 == Ti.App.theme &&
          ((itemProps.upIcon = {
            color: Ti.App.getVoteIconColor("up", newStatus),
          }),
          (itemProps.downIcon = {
            color: Ti.App.getVoteIconColor("down", newStatus),
          }));

      var scoreVal = itemProps[params.contentType].score;
      (itemProps.lblScore = {
        text: 1e3 > scoreVal ? scoreVal : Ti.App.toRoundedK(scoreVal, 1e3),
        color:
          1 == newStatus || -1 == newStatus
            ? Ti.App.btnVoteColors.selected
            : Ti.App.colorHint,
      }),
        itemProps.itemBg &&
          (0.75 == itemProps.itemBg.opacity ||
            0.9 == itemProps.itemBg.opacity) &&
          (itemProps.itemBg.opacity = 1),
        params.listSection.updateItemAt(params.index, itemProps);
    },
    saveVote = function (params) {
      (postParams = {
        vote: params.vote,
        doubleTap: !!params.fromDoubleTap,
      }),
        params.reason !== void 0 && (postParams.reason = params.reason);

      var useEndpoint;

      useEndpoint =
        "rant" == params.contentType
          ? "devrant/rants/" + params.content.id + "/vote"
          : "comments/" + params.content.id + "/vote";

      var apiArgs = {
        method: "POST",
        endpoint: useEndpoint,
        params: postParams,
        callback: function (result) {
          voteDone(result, params);
        },
        includeAuth: true,
      };

      Ti.App.api(apiArgs);
    },
    voteDone = function (result, params) {
      if (!result.success) {
        if ("comment" == params.contentType)
          return (
            (params.score = params.content.score),
            (params.vote = params.content.vote_state),
            (params.listSection = params.listSection),
            void setColorsFromRantStatus(params, params.vote)
          );
        var seriesId,
          rantSeries = Ti.App.savedTabs.rants.obj.rantSeries,
          useOldScore = params.oldScore,
          useOldStatus = params.oldStatus;

        for (seriesId in rantSeries)
          null != rantSeries[seriesId].rants[params.content.id] &&
            ((params.score = useOldScore),
            (params.vote = useOldStatus),
            (params.listSection = rantSeries[seriesId].listSection),
            (params.index = rantSeries[seriesId].rants[params.content.id]),
            setColorsFromRantStatus(params, params.vote));

        false !== result.confirmed &&
          Ti.App.showDialog(
            "Whoops!",
            "Your last vote wasn't saved because a connection error occurred. Please try again!"
          );
      }
    };

  return me;
}

module.exports = Voter;
