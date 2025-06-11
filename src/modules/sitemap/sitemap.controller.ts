// sitemap/sitemap.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { SitemapService } from './sitemap.service';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';

@Controller('sitemap')
export class SitemapController {
    constructor(private readonly sitemapService: SitemapService) { }

    @Get()
    @SkipAuth() // Apply the decorator here to exclude this route
    async getSitemap() {
        return this.sitemapService.getSitemap();
    }

    @Post()
    @SkipAuth() // Apply the decorator here to exclude this route
    async addToSitemap(@Body() sitemapData: any) {
        return this.sitemapService.addToSitemap(sitemapData);
    }
}