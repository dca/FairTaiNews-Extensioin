import { useState } from 'preact/hooks'
import './Options.css'

export const Options = () => {
  const [crx, setCrx] = useState('create-chrome-ext')
  const [apiKey, setApiKey] = useState('')

  const saveApiKey = () => {
    console.log('saveApiKey', apiKey)
    chrome.storage.sync.set({ apiKey: apiKey }, () => {
      console.log('API Key saved:', apiKey)
    })
  }

  return (
    <main>
      <h3>Options Page!</h3>

      <label for="apiKey">API Key:</label>
      <input
        type="text"
        id="apiKey"
        value={apiKey} // 設定 input 的值
        onInput={(e: preact.JSX.TargetedEvent<HTMLInputElement, Event>) => {
          const input = e.target as HTMLInputElement
          setApiKey(input.value)
        }}
      />
      <button id="save" onClick={saveApiKey}>
        Save
      </button>

      <h6>v 0.0.0</h6>

      <a href="https://www.npmjs.com/package/create-chrome-ext" target="_blank">
        Power by {crx}
      </a>
    </main>
  )
}

export default Options
