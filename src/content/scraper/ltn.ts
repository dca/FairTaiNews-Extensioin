import { Scraper } from './base-scraper'

export class LtnNewsScraper extends Scraper {
  getTitle() {
    return document.querySelector('div[itemprop="articleBody"] h1')?.textContent
  }

  getContent() {
    const contentDiv = document.querySelector('div[data-desc="內容頁"]')
    return contentDiv
      ? Array.from(contentDiv.querySelectorAll('p'))
          .map((p) => p.textContent)
          .join('\n')
      : null
  }
}
