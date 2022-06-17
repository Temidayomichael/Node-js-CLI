#!/usr/bin/env sh
import { program } from 'commander'
import { portfolioValuePerToken } from './calculations/portfolioValuePerToken'
import { tokenPortfolioValue } from './calculations/tokenPortfolioValue'
import { portfolioValuePerTokenOnDate } from './calculations/portfolioValuePerTokenOnDate'
import { tokenPortfolioValueOnDate } from './calculations/tokenPortfolioValueOnDate'


program
	.version('0.0.3')
	.description('Propine interview')
	.option('-p, --portfolio', 'portfolio value per token (in USD)')
	.option('-t, --token <token> ', 'token portfolio value (in USD)')
	.option(
		'-d, --date <YYYY-MM-DD> ',
		'portfolio value per token (in USD) on [date]',
	)
	.option(
		'-d -t, --dateToken <YYYY-MM-DD> <token>',
		'token portfolio value (in USD) on [date]',
	)
	.parse(process.argv)

const options = program.opts()

console.log('Running ....')

// Given no parameters, return the latest portfolio value per token in USD
if (options.portfolio) {
	portfolioValuePerToken()
}

// Given a date and a token, return the portfolio value of that token in USD on that date
if (options.date && options.token) {
	const dateRegex = new RegExp(/^\d{4}\-\d{2}\-\d{2}$/)
	const tokenRegex = new RegExp(/^[A-Z]{3,}$/)
	if (dateRegex.test(options.date) && tokenRegex.test(options.token)) {
		tokenPortfolioValueOnDate(options.date, options.token)
	} else {
		console.error(
			'Invalid date or token, must be YYYY-MM-DD and 3 uppercase letters',
		)
	}
} // Given a token, return the latest portfolio value in USD
else if (options.token) {
	const re = new RegExp(/^[A-Z]{3,}$/)
	if (re.test(options.token)) {
		tokenPortfolioValue(options.token)
	} else {
		console.error('Invalid token, must be 3 uppercase letters')
	}
} // Given a date, return the portfolio value per token in USD on that date
else if (options.date) {
	const re = new RegExp(/^\d{4}\-\d{2}\-\d{2}$/)
	if (re.test(options.date)) {
		portfolioValuePerTokenOnDate(options.date)
	} else {
		console.error('Invalid date, must be YYYY-MM-DD')
	}
}

if (!process.argv.slice(2).length) {
	program.outputHelp()
}
