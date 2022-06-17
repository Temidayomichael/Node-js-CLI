import { GetExchangeRate } from './../api/cryptoCompare'
import * as path from 'path'
import fs from 'fs'
import csv from 'csv-parser'

// read data from csv
const csvFilePath = path.resolve(__dirname, '../../src/data/transactions.csv')

// Given a token, return the latest portfolio value in USD
export async function tokenPortfolioValue(token: string) {

	const TokenBalance = {
		token: token,
		amount: 0,
	}

	process.stdout.write('Calculating token balance ....')
	fs.createReadStream(csvFilePath)
		.pipe(csv())
		.on('data', (data) => {
			// find and calculate token balance
			if (data.token === token) {
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
				'The balance of ' +
					token +
					' is ' +
					TokenBalance.amount +
					' ' +
					token +
					' which is ' +
					usdEquivalent +
					' USD',
			)
		})
}
