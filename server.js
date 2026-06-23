import express from "express";
import puppeteer from "puppeteer";

const app = express();

app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
res.send("HTML TO PDF SERVER RUNNING");
});

app.post("/generate-pdf", async (req, res) => {
try {

```
const { html } = req.body;

if (!html) {
  return res.status(400).send("Missing HTML");
}

const browser = await puppeteer.launch({
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox"
  ]
});

const page = await browser.newPage();

await page.setViewport({
  width: 1400,
  height: 2000
});

await page.setContent(html, {
  waitUntil: "networkidle0"
});

await new Promise(resolve => setTimeout(resolve, 5000));

const pdf = await page.pdf({
  format: "A4",
  printBackground: true,
  margin: {
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px"
  }
});

await browser.close();

res.setHeader(
  "Content-Type",
  "application/pdf"
);

res.send(pdf);
```

} catch (error) {

```
console.error(error);

res.status(500).send({
  error: error.message
});
```

}
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(
`Server running on port ${PORT}`
);
});
