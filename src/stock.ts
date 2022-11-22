import stocks from "./jsonfiles/stock.json";
import { TransactionService } from "./transaction";
import transactions from "./jsonfiles/transactions.json";
import { Stock } from "./models/Stocks";
import { Transaction } from "./models/Transaction";
import _ from "lodash";

export class StockService {
  newStocks: Array<object> = [];
  currentStocks: Array<Stock> = [];
  transactions: Array<object> = [];
  service = new TransactionService();
  constructor() {
    this.currentStocks = stocks;
    this.transactions = transactions;
  }

  // get all latest stocks after overall sell of each product
  async getLatestStocks() {
    try {
      for (let product of this.currentStocks) {
        let sold_data: any = await this.service.getTransactions(product);
        if (!(sold_data instanceof Error)) {
          product.stock = product.stock + sold_data.quantity;
        }
        this.newStocks.push(product);
      }

      //let get Unique Transactions
      let arr = this.getUniqueTransactions();
      this.newStocks = [...this.newStocks, ...arr];
      return this.newStocks;
    } catch (e) {
      console.log("error in getting lates stocks", stocks);
      return e;
    }
  }

  // filter transaction not present in stocks
  getUniqueTransactions() {
    const results = this.transactions.filter(
      (item: any) =>
        !this.currentStocks.some((stockUnit: any) => stockUnit.sku === item.sku)
    );
    let uniqueTransactions: Array<object> = [];
    results.forEach((transaction: any) => {
      uniqueTransactions.push({ sku: transaction.sku, stock: 0 });
    });
    let uniqueArray = this.uniqByTransactions(uniqueTransactions);

    return uniqueArray;
  }
  uniqByTransactions<Stock>(array: Stock[]) {
    let result: Stock[] = [];
    result = _.uniqBy(array, function (item: any) {
      return item.sku;
    });

    return result;
  }
  //sample test case function
  async verifyStocks(sku: string) {
    const results = this.transactions.filter((item: any) => item.sku === sku);
    const stock = this.currentStocks.filter((item: any) => item.sku === sku);
    if (results.length && !stock.length) {
      console.log(`stock doesn't exist for product sku: ${sku}`);
      return {message : `stock doesn't exist for product sku: ${sku}`}
    } else if (!results.length && stock.length) {
      console.log(`No transaction made for product sku: ${sku}`);
      return {message : `No transaction made for product sku: ${sku}`};
    }
    console.log(`product sku ${sku} have some transactions available`);
    return 1;
  }

  //test case for caculating lates stock
  async calculateFinalStocks(skuData : any) {
    let sku:string = skuData;
    console.log('sku calculate::',sku);
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
      return {sku : sku , stock : product[0].stock}
    }
    console.log(`Following product ${sku} stock is not available`);
    return {message : `Following product ${sku} stock is not available` }
  }
}
