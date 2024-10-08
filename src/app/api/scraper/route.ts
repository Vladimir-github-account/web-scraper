import { type NextRequest } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer, { TimeoutError } from 'puppeteer-core';

export const maxDuration = 60;

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const id = searchParams.get('id');

	const browser = await puppeteer.launch({
		args: chromium.args,
		defaultViewport: chromium.defaultViewport,
		executablePath: await chromium.executablePath(),
		headless: chromium.headless,
	});

	const page = await browser.newPage();

	try {
		if (!id) {
			return Response.json({ error: 'Id is required' }, { status: 400 });
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

		const closeDate = await closeDateTextSelector?.evaluate(el => (el as HTMLInputElement).value);

		const summaryTextSelector = await page.locator('#body_x_tabc_rfp_ext_prxrfp_ext_x_lblSummary').waitHandle();

		const summary = await summaryTextSelector?.evaluate(el => el.textContent);

		const mainCategoryTextSelector = await page.locator('#body_x_tabc_rfp_ext_prxrfp_ext_x_txtFamLabel').waitHandle();

		const mainCategory = await mainCategoryTextSelector?.evaluate(el => (el as HTMLInputElement).value);

		const typeTextSelector = await page.locator('div[data-selector="body_x_tabc_rfp_ext_prxrfp_ext_x_selRfptypeCode"] > .text').waitHandle();

		const type = await typeTextSelector?.evaluate(el => el.textContent);

		const attachments = await page.evaluate(() => {
			const attachmentsLinks =  Array.from(document.querySelectorAll('#body_x_tabc_rfp_ext_prxrfp_ext_x_phcDoc_content .iv-download-file'));

			return attachmentsLinks.map(el => 'https://emma.maryland.gov' + el.getAttribute('href'));
		}, { timeout: 60000 });

		await browser.close();

		return Response.json({
			title,
			id: solicitationId,
			closeDate,
			summary,
			mainCategory,
			type,
			attachments,
		});
	} catch (e) {
		if (e instanceof TimeoutError) {
			return Response.json({ error: 'Solicitation not found for specified id' }, { status: 404 });
		}

		return Response.json({ error: e }, { status: 500 });
	}
}
