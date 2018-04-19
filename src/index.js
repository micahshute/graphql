
//prisma 1.6.2

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const AuthPayload = require('./resolvers/AuthPayload');
const Subscription = require('./resolvers/Subscription');
const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

const resolvers = {
    Query,
    Mutation,
    AuthPayload, 
    Subscription
}


const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
            typeDefs: 'src/generated/prisma.graphql',
            endpoint: 'https://us1.prisma.sh/public-coralwarlock-759/scoreboard-node/dev',
            secret: 'secretCode',
            debug: true,
        })
    })
});



server.start(() => console.log('Server is running on http://localhost:4000'));