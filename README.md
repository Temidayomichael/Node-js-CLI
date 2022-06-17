# Propine Interview
## _Node Js CLI Program_
Let us assume you are a crypto investor. You have made transactions over a period of time which is logged in a CSV file. Write a command line program that does the following

- Given no parameters, return the latest portfolio value per token in USD
- Given a token, return the latest portfolio value for that token in USD
- Given a date, return the portfolio value per token in USD on that date
- Given a date and a token, return the portfolio value of that token in USD on that date

# Solution
##### Algorithm

- Read CSV file
- Read and validate user input from console
- Make calculations based on selected option and input
- Convert currencies using crypto compare 

##### Calculation algorithm
On fetch of each data using createReadStream and parsed to json csv-paser then check if conditions are met then check,add and remove token from balance based on  if the transaction type is Deposit or Withdrawl. When all calculation are done, then the currecy is converted to USD usign crypto comapre API besforretrurning to user.



## Tech
### Plugins

| Plugin | README |
| ------ | ------ |
| Axios | [https://github.com/axios/axios] |
| Commander | [https://github.com/tj/commander.js#readme] |
| Csv-parser | https://github.com/mafintosh/csv-parser] |
| fs-extra | [https://github.com/jprichardson/node-fs-extra] |

## Installation

The solution requires Node.js and Typescript to run.

Install the dependencies 

```sh
- cd propine-interview
- download data at [https://s3-ap-southeast-1.amazonaws.com/static.propine.com/transactions.csv.zip]
- move data to src/data
- npm i
- nom run start
```
