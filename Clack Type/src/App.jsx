import { useState } from 'react'
import './App.css'
import { WordProvider } from './contexts/WordContext.jsx'
import Home from './pages/Home.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <WordProvider>
      <main>
        <Home></Home>
      </main>
      <Footer></Footer>
    </WordProvider>
  )
}

export default App