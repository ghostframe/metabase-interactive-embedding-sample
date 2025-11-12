const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");

const port = 9090;

const app = express();

// this is the signing key that Metabase provides in settings->admin->auth->JWT, which is used to sign the JWT token
const JWT_SIGNING_KEY =
  "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

app.use(express.static(path.join(__dirname, "static")));

app.get("/api/auth", (req, res) => {
  const user = {
    email: "someone@somedomain.com",
    first_name: "Someone",
    last_name: "Somebody",
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // this is the expiration time for the token, in this case, it's 1 hour
    groups: ["viewer"], // groups property is optional, we're sending this to show how you can configure group mappings in Metabase
  };

  res.json({ jwt: jwt.sign(user, JWT_SIGNING_KEY) });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
