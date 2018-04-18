function info(){
    return "This is a dev Scoreboard Server"
}

function myVotes(parent, args, context, info){
    return context.db.query.links({}, info);
}

module.exports = {
    info,
    myVotes
}