const axios = require('axios').default
const cheerio = require('cheerio')

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
            console.log(err)
        })
}

module.exports = getTitle
