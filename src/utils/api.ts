import { getApiKey } from './configs'
import { debug } from './debug'

const log = debug.extend(`:api`)
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'

export const analyzeNewsQuality = async (title: string, content: string) => {
  const apiKey = await getApiKey()
  if (!apiKey) {
    log(`No API key found.`)
    return
  }

  const body = {
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `
          你是一個公正的新聞品質分析人員，用來判斷新聞報導是否符合基本原則，我會給你新聞的標題和內文，你會用具體的量化方式為這個新聞在幾個面向做評分。舉例來說：
            新聞標題明確性: 8/10
            客觀性: 8/10
            深度與全面性: 10/10 （可以加一些評分的說明）
            事實的準確性: 6/10
            重要性/時效性: 6/10
            可能的影響力: 6/10
            格式和結構: 10/10

            回覆的格式請使用 json 格式，例如：
            [{"name":"新聞標題明確性","score":8,"comment":"這個標題很明確，讓人一看就知道這篇新聞在講什麼。"}]

            總回覆的字數不要超過 300 字。
        `,
        // ...
      },
      {
        role: 'user',
        content: `title: ${title} 內文: ${content}`,
      },
    ],
    temperature: 1,
    top_p: 1,
    n: 1,
    stream: false,
    max_tokens: 800,
    presence_penalty: 0,
    frequency_penalty: 0,
  }

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error('API call failed')
  }

  return await response.json()
}
