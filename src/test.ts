import stocks from "./jsonfiles/stock.json";
import { TransactionService } from "./transaction";
import transactions from "./jsonfiles/transactions.json";
import { Stock } from "./models/Stocks";
import { Transaction } from "./models/Transaction";
import _ from "lodash";

export class TestService {
  newStocks: Array<object> = [];
  currentStocks: Array<Stock> = [];
  transactions: Array<object> = [];
  service = new TransactionService();
  constructor() {
    this.currentStocks = stocks;
    this.transactions = transactions;
  }
  //sample test case function
  verifyStocks(sku: string) {
    const results = this.transactions.filter((item: any) => item.sku === sku);
    const stock = this.currentStocks.filter((item: any) => item.sku === sku);
    if (results.length && !stock.length) {
      console.log(`stock doesn't exist for product sku: ${sku}`);
      return -1;
    } else if (!results.length && stock.length) {
      console.log(`No transaction made for product sku: ${sku}`);
      return -1;
    }
    console.log(`product sku ${sku} have some transactions available`);
    return 1;
  }

  //test case for caculating lates stock
  calculateFinalStocks(sku: string) {
    const results = this.transactions.filter((item: any) => item.sku === sku);
    const product = this.currentStocks.filter((item: any) => item.sku === sku);
    if (product.length) {
      var qty = 0;
      results.forEach((item: any) => {
        if (item.type === "refund") {
          qty = qty + item.qty;
        }
        if (item.type === "order") {
          qty = qty + -item.qty;
        }
      });
      console.log(
        `Before Transaction stock : ${sku} , Stock:`,
        product[0].stock
      );
      product[0].stock = product[0].stock + qty;
      let obj = { sku: sku, quantity: qty };
      console.log("transaction data::", obj);
      console.log(
        `final stock : ${sku} , Available Quantity:`,
        product[0].stock
      );
      return 1;
    }
    console.log(`Following product ${sku} stock is not available`);
    return -1;
  }
}
