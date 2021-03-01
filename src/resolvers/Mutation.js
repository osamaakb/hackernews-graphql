const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function post(parent, args, context, info) {
    const { userId } = context;

    return await context.prisma.link.create({
        data: {
            url: args.url,
            description: args.description,
            postedBy: { connect: { id: userId } },
        }
    })
}

// function updateLink(parent, arg) {
//     const links = context.prisma.link.findMany();
//     let index = links.findIndex((link) => link.id === arg.id)
//     links[index] = {
//         id: arg.id,
//         description: arg.description,
//         url: arg.url
//     }
//     return links[index];
// }

// function deleteLink(parent, args, context, info) {    
//     return context.link.prisma.delete({});
// }

async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)

    const user = await context.prisma.user.create({ data: { ...args, password } })
    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
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
        user,
    }
}



module.exports = {
    post
    // ,
    // deleteLink,
    // updateLink
    , login,
    signup
}