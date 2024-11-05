function appendCSS(type, name) {
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        class: `chat_${type}`,
        href: `styles/${type}_${name}.css`
    }).appendTo("head");
}

function escapeRegExp(string) { // Thanks to coolaj86 and Darren Cook (https://stackoverflow.com/a/6969486)
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(message) {
    return message
        .replace(/&/g, "&amp;")
        .replace(/(<)(?!3)/g, "&lt;")
        .replace(/(>)(?!\()/g, "&gt;");
}

function buildLocalWebsocketUrl(path) {
    if (!path.startsWith('/')) {
        throw Error('Path must start with a slash.')
    }

    let url = ''

    if (location.protocol === 'http:') {
        url += 'ws://'
    } else {
        url += 'wss://'
    }

    url += location.host

    url += path

    return url
}

function GetJson(url, {
    timeout = 10000
} = {}) {
    let error = new Error("Response error")
    error.name = 'ResponseError'

    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            timeout
        })
            .done((data) => {
                resolve(data)
            })
            .fail((response) => {
                error.message = response.statusMessage
                error.response = response
                reject(error)
            })
    })
}

function TwitchAPI(url) {
    return GetJson(url, {
        timeout: 5000
    })
}

const platform = {
    TWITCH: 1,
    KICK: 2
}

async function webpaginationGetAll(cb) {
    let data = []
    let cursor = undefined

    for (;;) {
        let result = await cb({ cursor })

        if (!result.cursor) {
            break
        }

        data.push(result.data)
        cursor = result.cursor
    }

    return data.flat()
}

function toPigLatin(sentence) {
    // Split the sentence into an array of words
    const words = sentence.split(" ");

    // Define an array of vowels to check against
    const vowels = ["a", "e", "i", "o", "u"];

    // Define an empty array to store the Pig Latin words
    let pigLatinWords = [];

    // Loop through each word in the array
    for (let i = 0; i < words.length; i++) {
        // Get the current word and convert it to lowercase
        const word = words[i].toLowerCase();

        // Check if the first letter is a vowel
        if (vowels.includes(word[0])) {
            pigLatinWords.push(word + "way"); // Add "way" to the end of the word
        } else {
            // Find the index of the first vowel in the word
            let vowelIndex = -1;
            for (let j = 0; j < word.length; j++) {
                if (vowels.includes(word[j])) {
                    vowelIndex = j;
                    break;
                }
            }

            // Rearrange the word and add "ay" to the end
            pigLatinWords.push(word.slice(vowelIndex) + word.slice(0, vowelIndex) + "ay");
        }
    }

    // Join the Pig Latin words back into a sentence
    return pigLatinWords.join(" ");
}