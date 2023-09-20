import { useState } from 'preact/hooks'
import './Popup.css'
import { Component } from 'preact'
import { debug } from '../utils/debug'
import { analyzeNewsQuality } from '../utils/api'

interface State {
  title?: string
  content?: string
  analysis?: string
  analysisObj?: any[]
}

export class Popup extends Component {
  private log = debug.extend(`:Popup`)

  state: State = {
    title: '',
    content: '',
    analysis: '',
    analysisObj: [],
  }

  componentDidMount() {
    this.log(`componentDidMount`)

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0]
      if (currentTab.id === undefined) {
        return
      }
      chrome.tabs.sendMessage(currentTab.id, { action: 'getPageDetails' }, (response) => {
        if (response) {
          this.handlePageDetails(response)
        }
      })
    })
  }

  componentWillUnmount() {
    this.log(`componentWillUnmount`)
  }

  componentWillUpdate() {
    this.log(`componentWillUpdate`)
  }

  componentDidUpdate() {
    this.log(`componentDidUpdate`)
  }

  async handlePageDetails(response: { title: string; content: string }) {
    this.setState({
      title: response.title,
      content: response.content,
    })

    try {
      const analysisResult = await analyzeNewsQuality(response.title, response.content)
      this.log(`analysisResult`, analysisResult)
      try {
        const content = JSON.parse(analysisResult.choices[0].message.content)
        this.setState({ analysisObj: content })
      } catch (error) {}

      this.setState({ analysis: analysisResult.choices[0].message.content })
    } catch (error) {
      console.error('Error analyzing news quality:', error)
    }
  }

  render(props: any, { title, content, analysis, analysisObj }: State) {
    this.log(`render`)
    return (
      <div>
        <h2>FairTaiNews</h2>
        <p>{title}</p>

        {analysisObj?.map((item) => (
          <div key={item.name}>
            <strong>
              {item.name} ({item.score}/10):
            </strong>
            <p>{item.comment}</p>
          </div>
        ))}

        {Date.now()}
      </div>
    )
  }
}

export default Popup
