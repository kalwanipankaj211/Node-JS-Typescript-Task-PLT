import transactions from './jsonfiles/transactions.json';
export class TransactionService {
    transactions : Array<object> = [];
    constructor() {
        this.transactions = transactions;
    }

    // get transaction & sold products qty for specific sku product
    async getTransactions(product : any) {
        try {
            // console.log('---Getting Transactions---');
            let transaction_per_stock = this.getTransactionsPerStock(product);
            if(!transaction_per_stock.length){
                return new Error(`No Transaction made for sku ${product.sku}`);
                
            }
            let product_sold = await this.calculateSoldProductsQty(transaction_per_stock);
            return product_sold;
        }
        catch (e) {
            console.log("error in getting transaction", e);
            return e;
        }
    }
    // calculate product wise sold quanity
    calculateSoldProductsQty(transactions : any) {
        return new Promise((resolve, reject) => {
            try {
                var qty = 0;
                transactions.forEach((item : any) => {
                    if (item.type === 'refund') {
                        qty = qty + item.qty;
                    }
                    if (item.type === 'order') {
                        qty = qty + (-item.qty);
                    }
                });
                let obj = { sku: transactions[0].sku, quantity: qty };
                // console.log("obj sold products::",obj);
                resolve(obj);

            }
            catch (e) {
                console.log("error in calculation of product quantiy", e);
                reject(e);
            }
        });
    }

    // get transaction for specific product
    getTransactionsPerStock(product : any) {
        let transactions_per_stock = this.transactions.filter((item : any) => {
            return item.sku === product.sku;
        });
        return transactions_per_stock;
    }
}

