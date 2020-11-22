import { first_token } from "./token";
const functions = require("firebase-functions");
const axios = require("axios").default;

let token = first_token;

exports.photos = functions.https.onRequest(async (request, response) => {
  try {
    const photosResponse = await axios.get(
      `https://graph.instagram.com/me/media?fields=media_url&access_token=${token}`
    );

    response.send(photosResponse.data);
  } catch (error) {
    console.log(error);

    response.send(error);
  }
});

exports.refreshToken = functions.pubsub
  .schedule("every 5 mins")
  //.schedule("every 480 hours")
  .onRun(async (context) => {
    try {
      const refreshResponse = await axios.get(
        `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
      );

      token = refreshResponse.data.access_token;
    } catch (error) {
      console.log(error);
    }

    return null;
  });
