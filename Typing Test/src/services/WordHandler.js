export async function fetchWords() {
    const url = "https://gist.githubusercontent.com/deekayen/4148741/raw/98d35708fa344717d8eee15d11987de6c8e26d7d/1-1000.txt"
    var wordList = []

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const text = await response.text()

        wordList = text.split("\n").map(word => word.trim())
    }
    catch (error) {
        console.error(error.message)
    }

    return wordList
}

function generateIndex() {
    return Math.floor(Math.random() * 1000)
}

export async function generateWordSet() {
    const dataList = await fetchWords()
    var wordList = []

    for (let i = 0; i < 200; i++) {
        wordList.push(dataList[generateIndex()])
    }

    return wordList
}