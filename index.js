import express from "express";
import { createCanvas, loadImage } from "canvas";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(express.json());
// Convert the current module's URL to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/vault/ticket/:epoch/:timestamp/:id", async (req, res) => {
  const { epoch, timestamp, id } = req.params;
  try {
    // Load the input image
    const inputImage = await loadImage(
      path.join(__dirname, "public", "vault.png")
    );

    // Create a canvas with the same dimensions as the input image
    const canvas = createCanvas(inputImage.width, inputImage.height);
    const ctx = canvas.getContext("2d");

    // Draw the input image on the canvas
    ctx.drawImage(inputImage, 0, 0);

    // Define text to be embedded
    const embeddedText = `EPOCH: ${epoch}`;

    // Set font properties
    ctx.font = "medium 30px montserrat";

    ctx.fillStyle = "black";

    // Position to embed text (adjust as needed)
    const x = 120;
    const y = canvas.height - 50;

    // Draw the embedded text
    ctx.fillText(embeddedText, x, y);
    ctx.fillText(`ID:${id}`, x + 600, y);
    ctx.fillText(
      `Raffle Time: ${new Date(
        parseInt(timestamp) * 1000
      ).toLocaleDateString()}`,
      canvas.width - 400,
      100
    );

    // Convert canvas to buffer
    const embeddedImageBuffer = canvas.toBuffer();

    // Set response headers for PNG format
    res.setHeader("Content-Type", "image/png");

    // Send the embedded image as the response
    res.send(embeddedImageBuffer);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
