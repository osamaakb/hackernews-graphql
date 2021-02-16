const { links } = require('./Link')

function feed(parent, args, context, info) { return links }

function link(parent, arg, context, info) { return links.find((link) => link.id === arg.id) }

module.exports = {
    feed,
    link
}