import axios from 'axios';

export const scraper = async (id: string) => {

	return await axios.get(`/api/scraper?id=${encodeURI(id)}`);
};
