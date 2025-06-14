export default function getReadingTime(body){
    const averageWordPerSecond= 3.5
    const blogSize = body.lenght
    readingTimeInSeconds = blogSize / averageWordPerSecond
    if (readingTimeInSeconds < 60){
        return `${readingTimeInSeconds}s`
    }
    else if (readingTimeInSeconds == 60){
        return `1m`
    }
    else {
        const remainderTimeInSeconds = readingTimeInSeconds % 60
        const readingTimeInMinutes = Math.floor(readingTimeInSeconds/60)
        return `${readingTimeInMinutes}${remainderTimeInSeconds}`
    }

}