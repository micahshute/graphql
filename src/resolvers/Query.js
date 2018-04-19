
function info(){
    return "This is a dev Scoreboard Server"
}


function comments(parent, args, context, info){
    var where = args.filter ? 
    {
        OR: [
            { content_contains: args.filter }
        ]
    } 

    : {};

    if(args.songId){
        where.songId = args.songId;
    }

    if(args.commentId){
        where.commentId = args.commentId;
    }

    if(args.userId){
        where.author = {id: args.userId};
    }

    return context.db.query.comments({where}, info);
}

function votes(parent, args, context, info){
    var where = args.songId ? { songId: args.songId } : {}
    if(args.userId){
        where.user = {id: args.userId }
    }
    return context.db.query.votes({where}, info);
}

module.exports = {
    info,
    votes,
    comments
}