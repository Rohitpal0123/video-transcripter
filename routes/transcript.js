const router =require("express").Router();

router.post("/transcriptAudio", require("../controllers/Transcript/create").process)

module.exports = router;