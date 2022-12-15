require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
// const api = require("./routers/api");
// const ether = require("./routers/ether");
// const web3Manager = require("./web3/web3Manager");
// const { connectDb, initDb } = require("./models");
const { SERVER_PORT } = process.env;

// mongoDb and Web3 init
// (async () => {
//   const transactionManager = await web3Manager.getTransactionManager();
//   transactionManager.init();
//   web3Manager.autoContractTanscation();

//   connectDb().then(() => {
//     initDb(web3Manager);
//   });
// })();

app.use(cors({ origin: "*", credentials: false }));

app.use(express.static("public"));

app.listen(SERVER_PORT, () => console.log("SERVER RUNNING :", SERVER_PORT));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// app.use("/web3", ether);

// app.use("/api", api);
