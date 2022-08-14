const cheerio = require('cheerio')
const got = require('got')

async function getTitle(pageUrl) {
    let title = await got(pageUrl)
        .then(response => {
            const $ = cheerio.load(response.body)
            let title = $('head > title').text()
            return title
        })
        .catch(err => {
            return "can't retrive title   " + err
        })

    return title
}

module.exports = getTitle
