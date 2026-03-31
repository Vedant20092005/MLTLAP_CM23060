const http = require("http");

const products = [
  { name: "Laptop i5 8GB RAM SSD", price: 45000 },
  { name: "Gaming Laptop i7 16GB RAM", price: 75000 },
  { name: "Budget Laptop 4GB RAM", price: 30000 },
  { name: "SSD Laptop i3 8GB RAM", price: 40000 },
  { name: "MacBook Air M1", price: 90000 }
];

// NLP + IR logic
function searchProducts(query) {
  query = query.toLowerCase();
  const words = query.split(" ");

  return products.map(p => {
    let score = 0;

    words.forEach(w => {
      if (p.name.toLowerCase().includes(w)) {
        score += 1;
      }
    });

    return { ...p, score };
  })
  .filter(p => p.score > 0)
  .sort((a, b) => b.score - a.score);
}

http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "POST" && req.url === "/search") {
    let body = "";

    req.on("data", chunk => body += chunk);

    req.on("end", () => {
      const { query } = JSON.parse(body);

      const results = searchProducts(query);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ results }));
    });

  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Server Running...");
  }

}).listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});