export default function getReadingTime(body){
    const averageWordPerSecond= 3.5
    const wordCount = body.trim().split(/\s+/).length;
    const readingTimeInSeconds = wordCount / averageWordPerSecond
    if (readingTimeInSeconds < 60){
        return `${readingTimeInSeconds}s`
    }
    else if (readingTimeInSeconds == 60){
        return `1m`
    }
    else {
        const remainderTimeInSeconds = Math.floor(readingTimeInSeconds % 60)
        const readingTimeInMinutes = Math.floor(readingTimeInSeconds/60)
        return `${readingTimeInMinutes}m ${remainderTimeInSeconds}s`
    }

}