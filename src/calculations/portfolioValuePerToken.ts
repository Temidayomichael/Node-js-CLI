import { GetExchangeRate } from './../api/cryptoCompare'
import * as path from 'path'
import fs from 'fs'
import csv from 'csv-parser'

// read data from csv
const csvFilePath = path.resolve(__dirname, '../../src/data/transactions.csv')

// Given no parameters, return the latest portfolio value per token in USD
export function portfolioValuePerToken() {
	const eachTokenBalance: any[] = [{}]

	process.stdout.write('Calculating balance for each ....')

	fs.createReadStream(csvFilePath)
		.pipe(csv())
		.on('data', (data) => {
			// find and update if token is in array
			const tokenIndex = eachTokenBalance.findIndex(
				(token) => token.token === data.token,
			)
			if (tokenIndex !== -1) {
				if (data.transaction_type.toString() === 'DEPOSIT') {
					eachTokenBalance[tokenIndex].amount =
						parseFloat(eachTokenBalance[tokenIndex].amount) +
						parseFloat(data.amount)
				} else if (data.transaction_type === 'WITHDRAWAL') {
					eachTokenBalance[tokenIndex].amount =
						parseFloat(eachTokenBalance[tokenIndex].amount) -
						parseFloat(data.amount)
				}
			} else {
				eachTokenBalance.push({
					token: data.token,
					amount: parseFloat(data.amount),
				})
			}
		})
		.on('end', async () => {
			process.stdout.write('Done')
			process.stdout.write('\nConverting to USD ...')
			//   extract token array from token balance object
			const tokens = eachTokenBalance.map((token) => token.token)
			//   get exchange rates for each token
			const portfolio = await GetExchangeRate('USD', tokens.toString()).then(
				(rate) => {
					//   iterate through each token balance
					eachTokenBalance.forEach((token) => {
						//   convert each token balance to usd
						token['USD Equivalent'] = (
							token.amount / rate[token.token]
						).toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD',
						})
					})
					return eachTokenBalance
				},
			)

			process.stdout.write('Done\n')
			console.table(portfolio)
		})
}
