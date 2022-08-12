// const axios = require('axios').default
const cheerio = require('cheerio')
const got = require('got')
const MetaInspector = require('node-metainspector')

// TODO: Use an existing url title pakage ...faster then this 😅

async function getTitle(pageUrl) {
    await got(pageUrl)
        .then(response => {
            const $ = cheerio.load(response.body)
            let title = $('head > title').text()
            console.log(title)
            return title
        })
        .catch(err => {
            console.log(err)
        })
}

module.exports = getTitle
