import debug from 'debug'
const log: debug.Debugger = debug('FairTaiNews:scraper:')

// interface for scrape result
export interface ScrapeResult {
  title?: string
  content?: string
}

export class Scraper {
  protected log: debug.Debugger = log.extend(this.constructor.name)

  getTitle() {
    return document.querySelector("meta[property='og:title']")?.getAttribute('content')
  }

  getContent() {
    return document.querySelector("meta[property='og:description']")?.getAttribute('content')
  }

  async scrape(): Promise<ScrapeResult> {
    const title = this.getTitle() ?? undefined
    const content = this.getContent() ?? undefined

    this.log('Title: %s', title)
    this.log('Content: %s', content)

    return {
      title,
      content,
    }
  }
}
