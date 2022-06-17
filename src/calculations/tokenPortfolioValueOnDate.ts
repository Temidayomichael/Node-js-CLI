import { GetExchangeRate } from './../api/cryptoCompare'
import * as path from 'path'
import fs from 'fs'
import csv from 'csv-parser'
// read data from csv
const csvFilePath = path.resolve(__dirname, '../../src/data/transactions.csv')

// Given a date and a token, return the portfolio value of that token in USD on that date
export function tokenPortfolioValueOnDate(date: string, token: string) {
	// convert epoch time to date
	
	const dateInput = new Date(date)

	const TokenBalance = {
		token: token,
		amount: 0,
	}

	const datesAreOnSameDay = (first: Date, second: Date) =>
		first.getFullYear() === second.getFullYear() &&
		first.getMonth() === second.getMonth() &&
		first.getDate() === second.getDate()

	process.stdout.write('Calculating token balance ....')

	fs.createReadStream(csvFilePath)
		.pipe(csv())
		.on('data', (data) => {
			const dateObj = new Date(parseInt(data.timestamp) * 1000)
			// id date are on same day
			if (datesAreOnSameDay(dateInput, dateObj) && data.token === token) {
				if (data.transaction_type.toString() === 'DEPOSIT') {
					TokenBalance.amount = TokenBalance.amount + parseFloat(data.amount)
				} else if (data.transaction_type === 'WITHDRAWAL') {
					TokenBalance.amount = TokenBalance.amount - parseFloat(data.amount)
				}
			}
		})
		.on('end', async () => {
			process.stdout.write('Done')
			process.stdout.write('\nConverting to USD ...')
			const usdEquivalent = await GetExchangeRate('USD', token).then((rate) => {
				return (TokenBalance.amount / rate[token]).toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
				})
			})
			process.stdout.write('Done\n')
			console.log(
				'\nThe portfolio value of ' +
					token +
					' on ' +
					date +
					' is ' +
					usdEquivalent +
					'\n',
			)
		})
}
