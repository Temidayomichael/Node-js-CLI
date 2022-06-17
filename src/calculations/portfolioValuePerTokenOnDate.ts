import { GetExchangeRate } from './../api/cryptoCompare'
import * as path from 'path'
import fs from 'fs'
import csv from 'csv-parser'
// read data from csv
const csvFilePath = path.resolve(__dirname, '../../src/data/transactions.csv')

// Given a date, return the portfolio value per token in USD on that date
export function portfolioValuePerTokenOnDate(date: string) {
	const dateInput = new Date(date)

	const eachTokenBalance: any[] = [{}]

	const datesAreOnSameDay = (first: Date, second: Date) =>
		first.getFullYear() === second.getFullYear() &&
		first.getMonth() === second.getMonth() &&
		first.getDate() === second.getDate()

	process.stdout.write('Calculating balance for each ....')

	fs.createReadStream(csvFilePath)
		.pipe(csv())
        .on('data', (data) => {
					// convert epoch time to date
					const dateObj = new Date(parseInt(data.timestamp) * 1000)
					// id date are on same day
					if (datesAreOnSameDay(dateInput, dateObj)) {
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
			process.stdout.write('Done')
			process.stdout.write('\n')

			console.table(portfolio)
		})
}
