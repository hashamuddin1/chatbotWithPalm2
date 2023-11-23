const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const { v1beta2 } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function generateText(question) {
  const client = new v1beta2.TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(
      process.env.PALM2_API_KEY
    ),
  });

  const request = {
    model: "models/text-bison-001",
    prompt: {
      text: question,
    },
  };

  const response = await client.generateText(request);

  const promptValue = response[0].candidates[0].output;
  console.log(promptValue);
  return promptValue;
}

app.post("/prompt", async (req, res) => {
  try {
    const getValue = await generateText(req.body.userPrompt);
    return res.status(200).send({
      message: "Your Answer",
      data: getValue,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`Our Server is running at port ${port}`);
});
