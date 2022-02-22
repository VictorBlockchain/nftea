// server.js
// where your node app starts
// we've started you off with Express (https://expressjs.com/) and axios (https://github.com/axios/axios)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

// MAKE SURE YOU HAVE ADDED YOUR API KEY IN THE .env file
const BASE_URL = "https://api.daily.co/v1/";
const API_AUTH = 'ea36348d46c8181aa89b355b751f5682c6bea1fdca0429ab05dfeb8834c4f017';


// create an axios instance that includes the BASE_URL and your auth token
// this may be useful to put in an external file to it can be referenced
// elsewhere once your application grows
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: { Authorization: `Bearer ${API_AUTH}` }
});

// ENDPOINTS - these match their counterparts in the daily.co API

//rooms - https://docs.daily.co/reference#list-rooms

app.get("/rooms", async (request, response) => {
  try {
    const rooms = await apiHelper("get", "/rooms");
    response.json(rooms);
  } catch (e) {
    console.log("error: ", e);
    response.status(500).json({ error: e.message });
  }
});

app.post("/rooms", async (request, response) => {
  try {
    const rooms = await apiHelper("post", "/rooms", request.body);
    response.json(rooms);
  } catch (e) {
    console.log("error: ", e);
    response.status(500).json({ error: e.message });
  }
});

// tokens - https://docs.daily.co/reference#create-meeting-token

app.post("/meeting-tokens", async (request, response) => {
  try {
    const token = await apiHelper("post", "/meeting-tokens", request.body);
    response.json(token);
  } catch (e) {
    console.log("error: ", e);
    response.status(500).json({ error: e.message });
  }
});

app.get("/meeting-tokens/:token", async (request, response) => {
  try {
    const token = await apiHelper(
      "get",
      `/meeting-tokens/${request.params.token}`
    );
    response.json(token);
  } catch (e) {
    console.log("error: ", e);
    response.status(500).json({ error: e.message });
  }
});

// listen for requests :)
const listener = app.listen('37859', () => {
  console.log("Your app is listening on port " + listener.address().port);
});


// utils and helpers, feel free to move this into its own file when that makes sense

const apiHelper = async (method, endpoint, body = {}) => {
  try {
    const response = await api.request({
      url: endpoint,
      method: method,
      data: body
    });
    return response.data;
  } catch (error) {
    console.log("Status: ", error.response.status);
    console.log("Text: ", error.response.statusText);
    // need to throw again so error is caught
    // a possible improvement here is to pass the status code back so it can be returned to the user
    throw new Error(error);
  }
};
