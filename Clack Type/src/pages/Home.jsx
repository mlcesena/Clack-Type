import { useState, useEffect } from 'react'
import { generateWordSet } from '../services/WordHandler.js'
import '../css/main.css'
import Header from '../components/Header.jsx'
import WordContainer from '../components/WordContainer.jsx'
import ScoreTable from '../components/ScoreTable.jsx'
import StatsTable from '../components/StatsTable.jsx'

function Home() {
    return (
        <div>
            <Header></Header>
            <ScoreTable></ScoreTable>
            <WordContainer></WordContainer>
            <StatsTable></StatsTable>
        </div>
    )
}

export default Home