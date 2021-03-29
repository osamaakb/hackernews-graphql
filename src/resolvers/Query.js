async function feed(parent, args, context, info) {
  const links = await context.prisma.link.findMany({
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy
  })

  const count = await context.prisma.link.count()

  return {
    links,
    count,
  }
}

async function link(parent, args, context, info) {
  return await context.prisma.link.findUnique({ where: { id: +args.id } })
}

module.exports = {
  feed,
  link
}
