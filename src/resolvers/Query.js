function feed(parent, args, context, info) { return context.prisma.link.findMany() }

function link(parent, arg, context, info) {
    const links = context.prisma.link.findMany();
    return links.find((link) => link.id === arg.id)
}

module.exports = {
    feed,
    link
}