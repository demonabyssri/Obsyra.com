const puppeteer = require('puppeteer');
const { db } = require('../config/firebase');
const productModel = require('../models/product'); 

const scrapeProduct = async (url) => {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] }); 
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); 

        let productData = {};
        if (url.includes('temu.com')) {
            productData = await page.evaluate(() => {
                const title = document.querySelector('h1.product-title')?.innerText.trim();
                const priceMatch = document.querySelector('.product-price-value')?.innerText.match(/[\d,.]+/);
                const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : null; 
                const image = document.querySelector('.product-image-container img')?.src;
                const stock = 999; 
                const category = 'General'; // Considera cómo obtener la categoría real
                return { name: title, price: price, sellingPrice: price, images: [image].filter(Boolean), stock, description: `Producto scrapeado de Temu: ${title}`, category, source: 'Temu' };
            });
        } else if (url.includes('amazon.com')) {
            productData = await page.evaluate(() => {
                const title = document.getElementById('productTitle')?.innerText.trim();
                const priceMatch = document.querySelector('.a-price .a-offscreen')?.innerText.match(/[\d,.]+/);
                const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '.')) : null;
                const image = document.getElementById('landingImage')?.src || document.getElementById('imgBlkFront')?.src;
                const stock = 999;
                const category = 'General';
                return { name: title, price: price, sellingPrice: price, images: [image].filter(Boolean), stock, description: `Producto scrapeado de Amazon: ${title}`, category, source: 'Amazon' };
            });
        } else if (url.includes('aliexpress.com')) {
            productData = await page.evaluate(() => {
                const title = document.querySelector('.Product_Name__container__110gP')?.innerText.trim();
                const priceElement = document.querySelector('.Product_Price__content__147q4');
                let price = null;
                if (priceElement) {
                    const priceText = priceElement.innerText.split('-')[0].replace(/[^0-9.,]/g, '').trim();
                    price = parseFloat(priceText.replace(',', '.')); 
                }
                const image = document.querySelector('.Product_Picture__image__1630x img')?.src;
                const stock = 999;
                const category = 'General';
                return { name: title, price: price, sellingPrice: price, images: [image].filter(Boolean), stock, description: `Producto scrapeado de AliExpress: ${title}`, category, source: 'AliExpress' };
            });
        } else {
            throw new Error('URL no soportada para scraping automático.');
        }

        if (!productData.name || !productData.price) {
            throw new Error('No se pudo extraer el nombre o precio del producto.');
        }

        return productData;

    } catch (error) {
        console.error(`Error al scrapear ${url}:`, error);
        throw error; 
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

const startScraping = async (req, res, next) => {
    const { productUrls } = req.body; 

    if (!productUrls || !Array.isArray(productUrls) || productUrls.length === 0) {
        return res.status(400).json({ message: 'Se requiere un array de URLs de productos para el scraping.' });
    }

    const scrapedResults = [];
    for (const url of productUrls) {
        try {
            const data = await scrapeProduct(url);
            
            const newProduct = await productModel.createProduct(data);

            scrapedResults.push({ url, data: newProduct, status: 'success', message: 'Producto scrapeado y guardado.' });
        } catch (error) {
            console.error(`Error al scrapear ${url}:`, error);
            scrapedResults.push({ url, status: 'error', message: error.message });
        }
    }
    res.status(200).json({ message: 'Scraping completado', results: scrapedResults });
};

module.exports = { startScraping, scrapeProduct };