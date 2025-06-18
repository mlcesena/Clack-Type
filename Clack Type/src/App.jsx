import { useState } from 'react'
import './App.css'
import { WordProvider } from './contexts/WordContext.jsx'
import Home from './pages/Home.jsx'
// import Footer from './components/Footer.jsx'

function App() {
  return (
    <WordProvider>
      <main>
        <Home></Home>
      </main>
    </WordProvider>
  )
}

export default App





// @Todo 

// create a timer (various times)
// when timer is done, calculate WPM
// add option to restart the test during and after
// reset the word list and timer
// button to generate a new set of words
// add fastest wpm, average wpm, and slowest wpm

// @Done

// list of top words
// randomly generate a set of words to use
// read input as user types