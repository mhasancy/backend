import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import twilio from "twilio";

dotenv.config();

const port = process.env.PORT || 5000;
const allowedOrigins = "*";

const app = express();
app.use(express.json());

const options = {
  origin: allowedOrigins,
};

app.use(cors(options));

const getToken = (request, response) => {
  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  // Get the user's identity and roomSid from the query.

  const { identity, roomSid } = request.body;

  // const identity = "Mahadi";
  // const roomSid = "cool-room";
  // Create the access token.
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { identity: identity }
  );

  token.identity = identity;

  // Add a VideoGrant to the token to allow the user of this token to use Twilio Video
  const grant = new VideoGrant({ room: roomSid  });
  token.addGrant(grant);

  response.send({
    accessToken: token.toJwt(),
  });

};

app.post("/token", getToken);
app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});
