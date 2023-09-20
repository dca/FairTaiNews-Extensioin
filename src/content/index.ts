console.info('chrome-ext template-preact-ts content script')

import debug from 'debug'
import { getApiKey } from '../utils/configs'
import { Scraper } from './scraper/base-scraper'
import { LtnNewsScraper } from './scraper/ltn'

const log: debug.Debugger = debug('FairTaiNews:content')

interface ScraperMap {
  [domain: string]: typeof Scraper
}

const addListener = () => {
  log('addListener')
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    log('onMessage', request)

    if (request.action === 'getPageDetails') {
      getPageDetails().then((detail) => {
        if (detail) {
          sendResponse(detail)
        }
      })
    }

    // 返回 true，表示你將在異步操作完成後調用 sendResponse
    return true
  })
}

const getPageDetails = async () => {
  log('getPageDetails')

  const scrapers: ScraperMap = {
    'news.ltn.com.tw': LtnNewsScraper,
    'www.ltn.com.tw': LtnNewsScraper,
    // ... TODO: more scraper
  }

  const currentScraperClass = scrapers[window.location.hostname]
  if (!currentScraperClass) {
    log('No scraper defined for this domain:', window.location.hostname)
    return
  }

  const scraper = new currentScraperClass()
  const r = await scraper.scrape()
  log('scrape result:', r)

  return r
}

export const main = async () => {
  addListener()

  // try to get api key from storage
  const apiKey = await getApiKey()
  log('API Key: %s', apiKey)

  if (!apiKey) {
    log('No API Key found, try to get from user')
  }
}

main()

export {}
