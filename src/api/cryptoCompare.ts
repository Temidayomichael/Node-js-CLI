import axios from 'axios'

export const GetExchangeRate = async (base: string, target: string) => {
	const response = await axios.get(
		`https://min-api.cryptocompare.com/data/price?fsym=${base}&tsyms=${target}&api_key=${process.env.CRYPTO_COMPARE_API_KEY}`,
	)
	return response.data
}
