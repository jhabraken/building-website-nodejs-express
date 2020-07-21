const express = require("express");

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;

  /** 
 // Was added to show the jsons list with speakers 
  router.get("/", async (request, response) => {
    const speakers = await speakerService.getList();
    return response.json(speakers);
  });
*/
  router.get("/", async (request, response, next) => {
    try {
      const speakers = await speakerService.getList();
      const artwork = await speakerService.getAllArtwork();
      return response.render("layout", {
        pageTitle: "speakers",
        template: "speakers",
        speakers,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.get("/:shortname", async (request, response, next) => {
    try {
      const speaker = await speakerService.getSpeaker(request.params.shortname);
      const artwork = await speakerService.getArtworkForSpeaker(
        request.params.shortname,
      );

      // eslint-disable-next-line spaced-comment
      //console.log(artwork);

      return response.render("layout", {
        pageTitle: "speakers",
        template: "speaker-details",
        speaker,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
