const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const { APP_SECRET, getUserId } = require('../utils')

async function post(parent, args, context, info) {
    const userId = getUserId(context)
    const newLink = await context.prisma.link.create({
        data: {
            url: args.url,
            description: args.description,
            postedBy: { connect: { id: userId } }
        }
    })
    context.pubsub.publish('NEW_LINK', newLink)

    return newLink
}

async function updateLink(parent, args, context, info) {
    const userId = getUserId(context)
    const link = await context.prisma.link.findUnique({ where: { id: +args.id } })
    if (userId === link.postedById) {
        const link = await context.prisma.link.update({
            where: {
                id: +args.id
            },
            data: {
                url: args.url,
                description: args.description
            }
        })
        return link
    } else {
        throw new Error('only the user posted this can delete it, please check your login informations.')
    }
}

async function deleteLink(parent, args, context, info) {
    const userId = getUserId(context)
    const link = await context.prisma.link.findUnique({ where: { id: +args.id } })

    if (userId === link.postedById) {
        await context.prisma.link.delete({ where: { id: +args.id } })
        return 'link deleted'
    } else {
        throw new Error('only the user posted this can delete it, please check your login informations.')
    }
}

async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.user.create({ data: { ...args, password } })
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    return {
        token,
        user
    }
}

async function login(parent, args, context, info) {
    const user = await context.prisma.user.findUnique({ where: { email: args.email } })
    if (!user) {
        throw new Error('No such user found')
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error('Invalid password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    return {
        token,
        user
    }
}

module.exports = {
    post,
    deleteLink,
    updateLink,
    login,
    signup
}
