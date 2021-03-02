const { PrismaClient } = require('@prisma/client')
const fs = require('fs');
const path = require('path');
const { getUserId } = require('./utils');
const { ApolloServer } = require('apollo-server');
const { PubSub } = require('apollo-server')
const { Query, Mutation, User, Link, Subscription } = require('./resolvers')

const prisma = new PrismaClient()
const pubsub = new PubSub()

const resolvers = { Query, Mutation, Subscription, User, Link }
const typeDefs = fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prisma,
            pubsub,
            userId:
                req && req.headers.authorization
                    ? getUserId(req)
                    : null
        };
    }
})

server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );