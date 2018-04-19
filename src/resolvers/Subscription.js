
function newVoteSubscribe (parent, args, context, info) {
    return context.db.subscription.vote(
      { where: { } },
      info,
    )
  }

function newCommentSubscribe (parent, args, context, info){
    return context.db.subscription.comment(
        { where: {} },
        info
    )
}

function newReactionSubscribe (parent, args, context, info){
    return context.db.subscription.react(
        { where: {} },
        info
    )
}

  
const newVote = {
    subscribe: newVoteSubscribe
}

const newComment = {
    subscribe: newCommentSubscribe
}

const newReaction = {
    subscribe: newReactionSubscribe
}


module.exports = {
    newVote,
    newComment,
    newReaction
}