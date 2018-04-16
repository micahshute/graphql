
const { GraphQLServer } = require('graphql-yoga');

let votes = [
    {
        id: '0',
        type: 'upvote',
        startIndex: 0,
        endIndex: 5

    }
]



const typeDefs = `
    type Query{
        info: String!
        myVotes: [Vote!]!
    }


    type Vote {
        id: ID!
        type: String!
        startIndex: Int!
        endIndex: Int!
    }
`;

const resolvers = {
    Query: {
        info: () => `This is a test HHSB server`,
        myVotes: () => votes,
    },

    Vote: {
        id: (root) => root.id,
        type: (root) => root.type,
        startIndex: (root) => root.startIndex,
        endIndex: (root) => root.endIndex
    }
}


const server = new GraphQLServer({
    typeDefs,
    resolvers,
});



server.start(() => console.log('Server is running on http://localhost:4000'));