## Running Locally
running `yarn dev` will run the server with nodemon which allows you to make changes without having to stop/start the server
running `yarn start` will run the server normally - to see changes made to the code while the server is running, you'll need to stop and start the server.

### Database
## User Ids
one-based indexing
## users TABLE
 id | user_name |        user_email         |                        user_password                         |          created_at           |          updated_at
----+-----------+---------------------------+--------------------------------------------------------------+-------------------------------+-------------------------------
  1 | Sample    | sampleuser@sampleuser.com | $2a$10$yW58PsBssDSS6oTHMpQRKenJWDA./CTnXwZ2r3AKl.OLn2c1.VfCW | 2023-07-01 18:43:36.975319-07 | 2023-07-01 18:43:36.975319-07


## user_coins TABLE
 id |     coins     | user_id |          created_at           |          updated_at
----+---------------+---------+-------------------------------+-------------------------------
  ...
  4 | {AEGIS,BTC}   |       4 | 2023-07-01 16:32:00.497787-07 | 2023-07-01 16:32:00.497787-07


Add Proxy endpoints

fetchCoins() --------> cc.coinList()
fetchPrices() -------> cc.priceFull(symbol, 'USD')
fetchHistorical() ---> cc.priceHistorical(symbol, ['USD], <<< DATE >>>)

// TODOS
user can see all user's coin lists