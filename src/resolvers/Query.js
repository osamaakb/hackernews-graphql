async function feed(parent, args, context, info) {
    return await context.prisma.link.findMany()
}

async function link(parent, args, context, info) {
    return await context.prisma.link.findUnique({ where: { id: +args.id } })
}

module.exports = {
    feed,
    link
}