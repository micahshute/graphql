
//prisma 1.6.2
const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

const resolvers = {
    Query: {
        info: () => `This is a test HHSB server`,
        myVotes: () => (root, args, context, info) => {
            return context.db.query.votes({}, info);  
        }
    },

    Mutation: {
        vote: (root, args, context, info) => {
            const vote = {
                type: args.type,
                songId: args.songId,
                startIndex: args.startIndex,
                endIndex: args.endIndex
            }
            return context.db.mutation.createVote({ data: vote }, info)
        },
    }
}


const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: req => ({
        ...req,
        db: new Prisma({
            typeDefs: 'src/generated/prisma.graphql',
            endpoint: 'https://us1.prisma.sh/public-coralwarlock-759/scoreboard-node/dev',
            secret: 'seal90210',
            debug: true,
        })
    })
});



server.start(() => console.log('Server is running on http://localhost:4000'));