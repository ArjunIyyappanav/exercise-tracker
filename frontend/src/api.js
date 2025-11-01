import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API = axios.create({
  baseURL: process.env.FRONT_URL, // your backend
});

export default API;
