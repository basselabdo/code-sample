# Running the Code

First, navigate to the [script](./script) folder and run the following command to run the code in this [file](./script/init-db.js):

`node .\init-db.js` 

The previous command is used to initialize the Db (mongoDb) with the files provided in the [input](./input/) folder, and you should have an output like this:
```
PS C:\Users\bassel\Desktop\ledn-challenge\script> node .\init-db.js
Inserted docs to accounts: 100
Inserted docs to transactions: 916
Inserted docs to accounts-large: 10000
Inserted docs to transactions-large: 96757
PS C:\Users\bassel\Desktop\ledn-challenge\script>
```
**NOTE**: If you re-ran the [script](./script/init-db.js) again, the script will check first for the collections if they are alreasdy exist or not ([getCollections](./script/init-db.js#LN37)), and if the collections are already in MongoDb, then it will not overwrite them and show the following output:
```
PS C:\Users\bassel\Desktop\ledn-challenge\script> node .\init-db.js
Collection accounts already exists!
Collection accounts-large already exists!
Collection transactions already exists!
Collection transactions-large already exists!
PS C:\Users\bassel\Desktop\ledn-challenge\script>
```

Next, navigate back to the [root](./) folder and run the following commands sequentially:

`npm install` to install the needed dependencies

`npm run build` to build the solution

`npm run start` to start the server

After building and running the code, you can either: 
1. Use postman to test it, by making calls to this endpoint http://localhost:3000/ as following:

Action   | Endpoint              | Params
-------- | ----------------------|------------
`GET`    | http://localhost:3000/accounts      | `userEmail`: string (required)
`GET`    | http://localhost:3000/accounts/{id} | `id`: string (required)
`PATCH`  | http://localhost:3000/accounts/{id} | `id`: string (required), body: `{"status": "active" or"locked"}` (required) }
`POST`   |   http://localhost:3000/accounts/{id}/transactions           | body: `{"userEmail":"string","amount": 0,"type": "send"}` (required)

2. Using any browser, open this [Url](http://localhost:3000/docs) to see the endpoints and the parameters required by each endpint, and also you can test it directly using the Url that refelcts what is defined in [swagger](swagger.json) file.

<img src="./src-files/swagger-endpoints.png" alt="alt text" width="550" height="400">

# Testing the code

Run the following command to run the unit tests:

`npm run test`

The output will look like this:

```js
  51 passing (143ms)

---------------------------------------|----------|----------|----------|----------|-------------------|
File                                   |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
---------------------------------------|----------|----------|----------|----------|-------------------|
All files                              |      100 |      100 |      100 |      100 |                   |
 application/account                   |      100 |      100 |      100 |      100 |                   |
  account-service-impl.ts              |      100 |      100 |      100 |      100 |                   |
 application/transaction               |      100 |      100 |      100 |      100 |                   |
  transaction-service-impl.ts          |      100 |      100 |      100 |      100 |                   |
 common/error                          |      100 |      100 |      100 |      100 |                   |
  app-error.ts                         |      100 |      100 |      100 |      100 |                   |
  error-to-json-object.ts              |      100 |      100 |      100 |      100 |                   |
 common/logger                         |      100 |      100 |      100 |      100 |                   |
  app-logger-locator.ts                |      100 |      100 |      100 |      100 |                   |
 common/utils                          |      100 |      100 |      100 |      100 |                   |
  utils.ts                             |      100 |      100 |      100 |      100 |                   |
 domain                                |      100 |      100 |      100 |      100 |                   |
  account.ts                           |      100 |      100 |      100 |      100 |                   |
  transaction.ts                       |      100 |      100 |      100 |      100 |                   |
 persistance/account                   |      100 |      100 |      100 |      100 |                   |
  mongo-account-repository-impl.ts     |      100 |      100 |      100 |      100 |                   |
 persistance/transaction               |      100 |      100 |      100 |      100 |                   |
  mongo-transaction-repository-impl.ts |      100 |      100 |      100 |      100 |                   |
 web                                   |      100 |      100 |      100 |      100 |                   |
  account-handler.ts                   |      100 |      100 |      100 |      100 |                   |
  error-handler.ts                     |      100 |      100 |      100 |      100 |                   |
  json-formatter.ts                    |      100 |      100 |      100 |      100 |                   |
---------------------------------------|----------|----------|----------|----------|-------------------|

=============================== Coverage summary ===============================
Statements   : 100% ( 172/172 )
Branches     : 100% ( 40/40 )
Functions    : 100% ( 43/43 )
Lines        : 100% ( 166/166 )
================================================================================
```

# Solution
I utilitzed my way of thinking in implementing the structure to make it well-structured and efficient as much as I could. I know that there could be a way better ways to do it :)

I built the structure in a way where I have the [application](./src/application) layer that is separate from the [persistance](./src/persistance/) layer, where I managed all the read/write operations from the MongoDb. The [application](./src/application) layer contains the account and transaction interface, service and respository.
The implementation of the [account-repository](./src/application/account/account-repository.ts) is in [persistance](./src/persistance/account) folder. The file [mongo-account-repository-impl](./src/persistance/account/mongo-account-repository-impl.ts) implements the account respository interface.


I added a [configuration](./config) folder with [default.json](./config/default.json) in it, to make the paths to the files configurable and easier to be parsed in the [script](./script/init-db.js#LN3) code:
```json
{
  "data": {
    "accounts": {
      "source": "../input/accounts/accounts-api.json",
      "largeSource": "../input/accounts/accounts-api-large.json"
    },
    "transactions": {
      "source": "../input/transactions/transactions-api.json",
      "largeSource": "../input/transactions/transactions-api-large.json"
    }
  }
}
```
**NOTE**: To run the solution against the big collections (accounts-large, transactions-large) -> simply go to lines [10](./config/default.json#L10) and [11](./config/default.json#L11) in [default.json](./config/default.json) and change them to: 
```json
"accountsCollection": "accounts-large",
"transactionsCollection": "transactions-large"
```

I also added an interfaces in [domain](./src/domain) folder where I added [account](./src/domain/account.ts) and [transaction](./src/domain/transaction.ts) to easily parse and create objects from or into the Db.

Database configuration, I decided to use MongoDb, since the relation in between `account` and `transactions` is not that complex and no need to make the solution more complexity. Also, I built the structure in a way where we need a minimum code change if we decided to chage the Db engine. i.e. changing the implementation of [mongo-account-repository-impl](./src/persistance/account/mongo-account-repository-impl.ts) and [mongo-transaction-repository-impl](./src/persistance/transaction/mongo-transaction-repository-impl.ts) only.

I hoted the Db in https://scalegrid.io/ and also I added the configurations to it in [default.json](./config/default.json#LN4) 
```
"mongoDb": {
    "hostname": "SG-gifted-dibble-7473-53944.servers.mongodirector.com",
    "port": 27017,
    "dbName": "ledn",
    "dbUserName": "lednuser",
    "dbPassword": "lednTestUser123!",
    "accountsCollection": "accounts",
    "transactionsCollection": "transactions"
  }
```
**NOTE:** The secrets are stored in the config file ONLY for dev and testing reasons. I would create a docker file to and add them as an ENV VARS and build an image of the repository.
Another solution is download a [mongoDb docker image](https://hub.docker.com/_/mongo) and running it locally instead of targetting the deployed Db in https://scalegrid.io/. But, in this case the configs. needs to be chagned in [here](./config/default.json#LN4) to target the local Db instead.