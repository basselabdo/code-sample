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
**NOTE**: If you re-ran the [script](./script/init-db.js) again, the script will check first for the collections if they are already exist or not ([getCollections](./script/init-db.js#L37)), and if the collections are already in MongoDb, then it will not overwrite them and show the following output:
```
PS C:\Users\bassel\Desktop\ledn-challenge\script> node .\init-db.js
Collection accounts already exists!
Collection accounts-large already exists!
Collection transactions already exists!
Collection transactions-large already exists!
PS C:\Users\bassel\Desktop\ledn-challenge\script>
```

Also, the `_id` field (for both, [account](./src/domain/account.ts#L2) and [transaction](./src/domain/transaction.ts#L4)) is auto generated each time after running the [script](./script/init-db.js) .. so, to start testing the endpoints, you can either get some emails from the [source files](./input/accounts/) or by installing a Db IDE like https://studio3t.com/ to view the contents of the collections. 

Next, navigate back to the root folder and run the following commands sequentially:

`npm install` to install the needed dependencies

`npm run build` to build the solution

`npm run start` to start the server

After building and running the code, you can either: 
1. Use postman to test it, by making calls to this endpoint http://localhost:3000/ by loading the attached [Postman collection](./postman-collection/LednAccount-Manager.postman_collection.json) in [postman-collection](./postman-collection/):

Action   | Endpoint              | Params
-------- | ----------------------|------------
`GET`    | http://localhost:3000/accounts      | `userEmail`: string (required)
`GET`    | http://localhost:3000/accounts/{id} | `id`: string (required)
`PATCH`  | http://localhost:3000/accounts/{id} | `id`: string (required), body: `{"status": "active" or"locked"}` (required) }
`POST`   |   http://localhost:3000/accounts/{id}/transactions           | body: `{"userEmail":"string","amount": 0,"type": "send"}` (required)

2. Using any browser, open this [Url](http://localhost:3000/docs) to see the endpoints and the parameters required by each endpint, and also you can test it directly using the Url that refelcts what is defined in [swagger](swagger.json) file.

<img src="https://github.com/basselabdo/ledn-challenge/blob/main/src-files/swagger-endpoints.PNG" width="550" height="400">

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

I used Typescript as a light-weighted language to manage the Db operations. Its single threaded .. yes, but based on the usage and business needs, I see it good at the moment. When we the load grows, we can deploy more than one replica of the repository and put them behind a load-balancer to handle huge load of transactions.

I built the structure in a way where I have the [application](./src/application) layer that is separate from the [persistance](./src/persistance/) layer, where I managed all the read/write operations from the MongoDb. The [application](./src/application) layer contains the account and transaction interface, service and respository.
The implementation of the [account-repository](./src/application/account/account-repository.ts) is in [persistance](./src/persistance/account) folder. The file [mongo-account-repository-impl](./src/persistance/account/mongo-account-repository-impl.ts) implements the account respository interface.


I added a [configuration](./config) folder with [default.json](./config/default.json) in it, to make the paths to the files configurable and easier to be parsed in the [script](./script/init-db.js#L3) code:
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

Database configuration, I decided to use MongoDb, since the relation in between `account` and `transactions` is not that complex and no need to make the solution more complex. Also, I built the structure in a way where we need a minimum code change if we decided to chage the Db engine. i.e. when changing the engine from Mongo (NoSql) to Postgres as an exmaple, so the implementation of [mongo-account-repository-impl](./src/persistance/account/mongo-account-repository-impl.ts) and [mongo-transaction-repository-impl](./src/persistance/transaction/mongo-transaction-repository-impl.ts) needs to be changed only.

I hosted the Db in https://scalegrid.io/ so multiple team members may use the API concurrently, and also I added the Db configurations in [default.json](./config/default.json#L4) 
```
"mongoDb": {
    "hostname": "SG-gifted-dibble-7473-53944.servers.mongodirector.com",
    "port": 27017,
    "dbName": "ledn",
    "dbUserName": "DB_USER",
    "dbPassword": "DB_PASS",
    "accountsCollection": "accounts",
    "transactionsCollection": "transactions"
  }
```
**NOTE:** The secrets are stored in the [.env](.env) file ONLY for dev and testing reasons and also because the repo is private. Otherwise, I would create a docker file to and add them as an ENV VARS and build an image of the repository.

Another solution is downloading a [mongoDb docker image](https://hub.docker.com/_/mongo) and running it locally instead of targetting the deployed Db in https://scalegrid.io/. But, in this case the configs. needs to be chagned in [here](./config/default.json#L4) to target the local Db instead, and also each user (team member) will be having their own Db version.


# Sample Runs
* Getting an account by `userEmail`:
    * Request:
      ```
      curl -X 'GET' \
      'http://localhost:3000/accounts?userEmail=Benny93%40gmail.com' \
      -H 'accept: application/json'
      ```
    * Response: (it will contain balance field, that has been calculated in [account-service-impl.ts](./src/application/account/account-service-impl.ts#L82) as reqeusted by getting all the transactions for the account by `userEmail` field: 
      ```json
      {
      "data": {
        "_id": "632272e567a7265d517d960d",
        "userEmail": "Benny93@gmail.com",
        "status": "active",
        "createdAt": "2019-06-10T15:17:14.967Z",
        "updatedAt": "2019-06-10T15:17:14.967Z",
        "balance": 26954
        }
      }
      ```
* Getting an account by `id`:

  * Requset: 
    ```
    curl -X 'GET' \
    'http://localhost:3000/accounts/632272e567a7265d517d960d' \
    -H 'accept: application/json'
    ```
  * Response: (it will contain balance field, that has been calculated in [account-service-impl.ts](./src/application/account/account-service-impl.ts#L82) as reqeusted by getting all the transactions for the account by `id` field: 
    ```json
      {
      "data": {
        "_id": "632272e567a7265d517d960d",
        "userEmail": "Benny93@gmail.com",
        "status": "active",
        "createdAt": "2019-06-10T15:17:14.967Z",
        "updatedAt": "2019-06-10T15:17:14.967Z",
        "balance": 26954
        }
      }
    ```
* Updating the `status` field of an account:
  
  * Request:
    ```
    curl -X 'PATCH' \
      'http://localhost:3000/accounts/632272e567a7265d517d960d' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "status": "locked"
    }'
    ```
  * After Running the request:
    ```json
    {
      "data": {
        "_id": "632272e567a7265d517d960d",
        "userEmail": "Benny93@gmail.com",
        "status": "locked",
        "createdAt": "2019-06-10T15:17:14.967Z",
        "updatedAt": "2022-09-15T03:20:57.418Z"
      }
    }
    ```
* Creating a `SEND` transaction to a `locked` account by `id`:
  * Request:
    ```
    curl -X 'POST' \
      'http://localhost:3000/accounts/632272e567a7265d517d960d/transactions' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "userEmail": "Benny93@gmail.com",
      "amount": 1000,
      "type": "send"
    }'
    ```
  * Response (error message):
    ```json
      {
      "errors": [
        {
          "code": "Error",
          "message": "Failed creating transaction! Message: Error: The Account is locked!"
        }
      ]
    }
    ```
* Creating `SEND` transaction to an `active` account by `id`:
  * Request:
    ```
    curl -X 'POST' \
      'http://localhost:3000/accounts/632272e567a7265d517d960d/transactions' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "userEmail": "Benny93@gmail.com",
      "amount": 1000,
      "type": "send"
    }'
    ```
  * Response: 
    ```json
    {
      "data": {
        "userEmail": "Benny93@gmail.com",
        "amount": 1000,
        "createdAt": "2022-09-15T03:28:44.846Z",
        "type": "send",
        "_id": "63229bececb16ed2598578a8"
      }
    }
    ```
* Creating a `SEND` transaction where balance will be negative (simulated in [account-service-impl.ts](./src/application/account/account-service-impl.ts#L29)):
  * Request:
    ```
    curl -X 'POST' \
      'http://localhost:3000/accounts/632272e567a7265d517d960d/transactions' \
      -H 'accept: application/json' \
      -H 'Content-Type: application/json' \
      -d '{
      "userEmail": "Benny93@gmail.com",
      "amount": 30000,
      "type": "send"
    }'
    ```
  * Response:
    ```json
    {
      "errors": [
        {
          "code": "Error",
          "message": "Failed creating transaction! Message: Account balance can not be less than 0!"
        }
      ]
    }
    ```