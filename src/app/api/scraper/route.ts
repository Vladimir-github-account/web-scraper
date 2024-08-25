import { type NextRequest } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const id = searchParams.get('id');
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	if (!id) {
		throw Error();
	}

	await page.goto('https://emma.maryland.gov/page.aspx/en/rfp/request_browse_public');
	await page.setViewport({ width: 1080, height: 1024 });

	await page.locator('#body_x_txtBpmCodeCalculated_3').fill(id);
	await page.locator('#body_x_prxFilterBar_x_cmdSearchBtn').click();

	const solicitationPageSelector = await page.locator('td > a[tabindex="0"]').waitHandle();

	const solicitationPageHref = await solicitationPageSelector.evaluate((el: HTMLAnchorElement) => el.href);

	await page.goto(solicitationPageHref);

	const titleTextSelector = await page.locator('#body_x_tabc_rfp_ext_prxrfp_ext_x_lblLabel').waitHandle();

	const title = await titleTextSelector?.evaluate(el => el.textContent);

	const idTextSelector = await page.locator('#body_x_tabc_rfp_ext_prxrfp_ext_x_lblProcessCode').waitHandle();

	const solicitationId = await idTextSelector?.evaluate(el => el.textContent);

	const closeDateTextSelector = await page.locator('#body_x_tabc_rfp_ext_prxrfp_ext_x_txtRfpEndDateEst').waitHandle() ;

	const closeDate = await closeDateTextSelector?.evaluate((el: HTMLInputElement) => el.value);

	const summaryTextSelector = await page.locator('#body_x_tabc_rfp_ext_prxrfp_ext_x_lblSummary').waitHandle();

	const summary = await summaryTextSelector?.evaluate(el => el.textContent);

	const mainCategoryTextSelector = await page.locator('#body_x_tabc_rfp_ext_prxrfp_ext_x_txtFamLabel').waitHandle();

	const mainCategory = await mainCategoryTextSelector?.evaluate((el: HTMLInputElement) => el.value);

	const typeTextSelector = await page.locator('div[data-selector="body_x_tabc_rfp_ext_prxrfp_ext_x_selRfptypeCode"] > .text').waitHandle();

	const type = await typeTextSelector?.evaluate(el => el.textContent);

	await browser.close();

	return Response.json({
		title,
		id: solicitationId,
		closeDate,
		summary,
		mainCategory,
		type,
	});
}
