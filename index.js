const express = require("express");
const bodyParser = require("body-parser");
const { MeiliSearch } = require("meilisearch");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Konfigurasi Meilisearch
const client = new MeiliSearch({
  host: "http://localhost:7700", // URL Meilisearch Anda
});

// Inisialisasi Index
const indexName = "products";
const index = client.index(indexName);

// Route: Tambah Dokumen
app.post("/add", async (req, res) => {
  try {
    const docs = req.body; // Array dokumen
    const result = await index.addDocuments(docs);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Route: Pencarian Dokumen
app.get("/search", async (req, res) => {
  try {
    const query = req.query.q || ""; // Query pencarian
    const searchResults = await index.search(query);
    res.status(200).json(searchResults);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Route: Buat Index (Opsional)
app.post("/create-index", async (req, res) => {
  try {
    const result = await client.createIndex(indexName, { primaryKey: "id" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Jalankan Server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
