export const getApiKey = (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get('apiKey', (data) => {
      console.log('API Key:', data)
      resolve(data.apiKey)
    })
  })
}
