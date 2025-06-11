// sitemap/sitemap.service.ts
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SitemapService {
    private readonly sitemapPath = path.join(__dirname, 'sitemap.json');

    async getSitemap(): Promise<any> {
        try {
            if (!fs.existsSync(this.sitemapPath)) {
                return { urls: [] }; // Return empty array if file doesn't exist
            }
            const data = fs.readFileSync(this.sitemapPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error('Failed to read sitemap');
        }
    }

    async addToSitemap(newUrls: any): Promise<any> {
        try {
            let currentData = { urls: [] };

            // Read existing data if file exists
            if (fs.existsSync(this.sitemapPath)) {
                const fileContent = fs.readFileSync(this.sitemapPath, 'utf8');
                currentData = JSON.parse(fileContent);
            }

            // Append new URLs
            currentData.urls = [...currentData.urls, ...newUrls.urls];

            // Write back to file
            fs.writeFileSync(this.sitemapPath, JSON.stringify(currentData, null, 2));

            return currentData;
        } catch (error) {
            throw new Error('Failed to update sitemap');
        }
    }
}