const express = require("express");

const speakerRoute = require("./speakers");

const feedbackRoute = require("./feedback");

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;

  router.get("/", async (request, response, next) => {
    try {
      const topSpeakers = await speakerService.getList();
      const artwork = await speakerService.getAllArtwork();

      // eslint-disable-next-line spaced-comment
      //console.log(topSpeakers);

      // To display number of visitcounts
      if (!request.session.visitcount) {
        request.session.visitcount = 0;
      }
      request.session.visitcount += 1;

      // eslint-disable-next-line spaced-comment
      //console.log(`Number of visits: ${request.session.visitcount}`);

      return response.render("layout", {
        pageTitle: "Welcome",
        template: "index",
        topSpeakers,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use("/speakers", speakerRoute(params));

  router.use("/feedback", feedbackRoute(params));

  return router;
};
