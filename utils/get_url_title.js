const axios = require('axios').default
const cheerio = require('cheerio')

// TODO: Use an existing url title pakage ...faster then this 😅

async function getTitle(pageUrl) {
    return await axios
        .get(pageUrl)
        .then(res => {
            try {
                let $ = cheerio.load(res.data)
                let title = $('head > title').text()

                if (!title) return
                return title
            } catch (error) {
                return error
            }
        })
        .catch(err => {
            console.log('GET TITILE ERROR: ' + err)
            return
        })
}

module.exports = getTitle
