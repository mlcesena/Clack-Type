import { useState, useEffect } from 'react'
import { generateWordSet } from '../services/WordHandler.js'
import '../css/main.css'
import Header from '../components/Header.jsx'
import WordContainer from '../components/WordContainer.jsx'
import StatsTable from '../components/StatsTable.jsx'
import { TimerProvider } from '../contexts/TimerContext.jsx'
import { StatProvider } from '../contexts/StatContext.jsx'

function Home() {
    return (
        <div>
            <Header></Header>
            <TimerProvider>
                <StatProvider>
                    <WordContainer></WordContainer>
                    <StatsTable></StatsTable>
                </StatProvider>
            </TimerProvider>
        </div>
    )
}

export default Home