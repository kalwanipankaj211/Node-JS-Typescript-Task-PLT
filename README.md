# Commands to run app:-
1. npm install
2. npm run start:dev
3. Test route like in browser - http://localhost:8000/getLatestStock/?sku=HGG795032/35/91 

# Command to test the app:-
1. npm run test

# Command to make production build and generates compiled js files:-
1. npm run build

# Notes:-
1. src/index.ts - main file generate latest stock csv
2. src/stocks.ts - To  retrieve latest stocks after all transactions and calculates final stock available by subtracting made transaction quantity
Reads data from stock.json

3. src/srtransaction.ts - To retrieve transaction for each stock.
Reads data from transactions.json

4. src/test/sample-test.js  Sample test cases for specific sku

5. json files folder contains project related json files