const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");

const port = 9090;

const app = express();

// this is the signing key that Metabase provides in settings->admin->auth->JWT, which is used to sign the JWT token for interactive embedding
const JWT_SIGNING_KEY_INTERACTIVE_EMBEDDING =
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

  const isSdkRequest = req.query.response === "json";

  if (isSdkRequest) {
    console.log("SDK request detected, returning JWT in JSON response");
    res.json({ jwt: jwt.sign(user, JWT_SIGNING_KEY_INTERACTIVE_EMBEDDING) });
    return;
  } else {
    console.log("Non-SDK request detected, redirecting to Metabase SSO");
    const METABASE_URL = "http://localhost:3000";
    res.redirect(
      `${METABASE_URL}/auth/sso?jwt=${jwt.sign(
        user,
        JWT_SIGNING_KEY_INTERACTIVE_EMBEDDING
      )}`
    );
    return;
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
