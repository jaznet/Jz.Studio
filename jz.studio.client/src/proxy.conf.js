const PROXY_CONFIG = [
  {
    context: [
      "/jazdb",
      "/weatherforecast",
    ],
    target: "https://localhost:7105",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
