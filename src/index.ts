// var stockService = require('./generate-latest-stocks.js');
// import {StockService} from "./stock";
// let fs = require('fs');
// let jsonexport = require('jsonexport');

// async function start(){
//     let service = new StockService();
//     let data = await service.getLatestStocks();
//     console.log("data::", data);
//     let csv = await jsonexport(data);
//     // console.log("csv data::", csv);
//     fs.writeFileSync('./latest-stocks-new.json', JSON.stringify(data));
//     fs.writeFileSync('./latest-stocks.csv', csv);
// }

// start();
import {StockService} from "./stock";
let service = new StockService();
import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
const router = express.Router();
import dotenv from "dotenv";
// import morgan from "morgan";
dotenv.config();
const PORT = process.env.PORT || 8000;
console.log("port is::" ,PORT);

const app: Application = express();
app.use(express.json());
app.use(router);
router.get('/getLatestStock', async (_req, res) => {
  let skuData = _req.query.sku;
  console.log("sku data" , skuData);
  let data = await service.calculateFinalStocks(skuData);
  res.send(data);
});
// app.get("/getLatestStock", async (_req, res) => {
//   res.send({message : 'hello world'});
// });

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

// let fs = require('fs');
// let jsonexport = require('jsonexport');

// async function start(){
//     let service = new StockService();
//     let data = await service.getLatestStocks();
//     console.log("data::", data);
//     let csv = await jsonexport(data);
//     // console.log("csv data::", csv);
//     fs.writeFileSync('./latest-stocks-new.json', JSON.stringify(data));
//     fs.writeFileSync('./latest-stocks.csv', csv);
// }
// start();