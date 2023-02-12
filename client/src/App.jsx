import { useState } from 'react'
import './App.css'
import { Betting } from './components/Betting'
import { LiveStats } from './components/LiveStats'
import { Header } from './components/Header'
import { TableView } from './components/TableView'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Header />
      <div className='upper-dev'>
        <div className='left-div'>
          <Betting />
        </div>
        <div className='right-div'>
          <LiveStats />
        </div>
      </div>
      <div className='down-dev'>
        <TableView />
      </div>
    </div>
  )
}

export default App
