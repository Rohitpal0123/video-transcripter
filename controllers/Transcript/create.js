const asyncHandler = require("../../middleware/asyncHandler");
const apiError = require("../../utils/apiError");
const fs = require("fs");
const path = require("path");
const os = require("os");
const ytdl = require("ytdl-core");
const OpenAI = require("openai");
const RESPONSE_MESSAGE = require("../../utils/responseCode");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class createTranscript {
  process = asyncHandler(async (req, res) => {
    const { url } = req.body;
    if (!url) throw new apiError(400, "url is required");

    if (!ytdl.validateURL(url)) throw new Error("Invalid YouTube URL");

    const options = {
      filter: "audioonly", // Filter for audio streams only
      quality: "highestaudio", // Choose the highest quality available
      format: "mp3", // Specify the audio format (e.g., mp3, m4a, webm)
    };

    const audioStream = ytdl(url, options);

    const audioFilePath = path.join(os.tmpdir(), "audio.mp3");
    const writeStream = fs.createWriteStream(audioFilePath);
    audioStream.pipe(writeStream);

    writeStream.on("finish", async function () {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: "whisper-1", // Adjust the model as needed
        use_case: "dictation", // Adjust the use case as needed
      });

      fs.unlinkSync(audioFilePath);

      res.status(200).send({
        type: RESPONSE_MESSAGE.SUCCESS,
        data: transcription,
      });
    });
  });
}

module.exports = new createTranscript();
