let { links } = require('./Link')
let idCount = links.length

function post(parent, arg) {
    const link = {
        id: `link-${idCount++}`,
        url: arg.url,
        description: arg.description
    }
    links.push(link);
    return link;
}

function updateLink(parent, arg) {
    let index = links.findIndex((link) => link.id === arg.id)
    links[index] = {
        id: arg.id,
        description: arg.description,
        url: arg.url
    }
    console.log(links[index])
    return links[index];
}

function deleteLink(parent, arg) {
    let index = links.findIndex((link) => link.id === arg.id);
    links.splice(index, 1)
    return links[index];
}

module.exports = {
    post,
    deleteLink,
    updateLink
}