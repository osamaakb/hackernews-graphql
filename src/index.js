const fs = require('fs');
const path = require('path');
const { ApolloServer } = require('apollo-server');
const { Query, Mutation } = require('./resolvers')

const resolvers = { Query, Mutation }

const typeDefs = fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
);

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );