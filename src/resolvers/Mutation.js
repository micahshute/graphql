const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');



async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10);
    const user = await context.db.mutation.createUser({
        data: { ...args, password}
    }, '{ id }');

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token,
        user
    }
}


async function login(parent, args, context, info){
    const user = await context.db.query.user( { where: { email: args.email}}, ` { id password }`);

    if (!user){
        throw new Error('Invalid login credentials');
    }

    const valid = await bcrypt.compare(args.password, user.password);

    if(!valid){
        throw new Error('Invalid login credentials');
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token, 
        user
    }
}


async function vote(parent, args, context, info){
    const userId = getUserId(context);

  

    return context.db.mutation.createVote({
        data: {
            isUpvote: args.isUpvote,
            startIndex: args.startIndex,
            endIndex: args.endIndex,
            songId: args.songId,
            commentId: args.commentId,
            user: { connect: { id: userId } }
        }
    }, info);
}


function deleteVote(parent, args, context, info){
    return context.db.mutation.deleteVote({
        where: {
            id: args.id
        }
    }, info);
}


async function comment(parent, args, context, info){
    const userId = getUserId(context);
    // const commentExsists = await context.db.exists.Comment({
    //     user: { id: userId },
    //     vote: { id: args.voteId},
    // });

    // if(commentExists){
    //     throw new Error(`Already commented vote: ${args.voteId}`);
    // }

    return context.db.mutation.createComment(
        {
            data: {
                author: { connect: { id: userId } },
                startIndex: args.startIndex,
                endIndex: args.endIndex,
                content: args.content,
                songId: args.songId,
                commentId: args.commentId,
                reactions: []
            }
        },
        info
    )
}



async function react(parent, args, context, info){
    const userId = getUserId(context);
    const reactionExists = await context.db.exists.Reaction({
        user: { id: userId },
        comment: { id: args.commentId }
    });

    if(reactionExists) {
        throw new Error(`Already reacted to comment: ${args.commentId}`);
    }

    return context.db.mutation.createReaction(
        {
            data: {
                user: { connect: { id: userId }},
                comment: { connect: { id: args.commentId }},
                category: { connect: { type : args.categoryType}}

            }
        }, 
        info
    );
}

module.exports = {
    signup, 
    login,
    vote,
    deleteVote,
    comment,
    react
}


  // const voteExists = await context.db.exists.Vote({
    //     user: { id: userId },
    //     songId: args.songId,
    //     startIndex: args.startIndex,
    //     endIndex: args.endIndex,
    //     commentId: args.commentId
    // });
    // if(voteExists){
    //     throw new Error('Already voted')
    // }