const { 
    GENIUS_TOKEN,
    lyricist,
    getUserId
    } = require('../utils');




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
    if(args.myVotes){
        const myId = getUserId(context);
        where.user= {id: myId}
    }
    return context.db.query.votes({where}, info);
}

function vote(parent, args, context, info){
    return context.db.query.vote({where : {id: args.id}}, info);
}

async function songSearch(parent, args, context, info){
    const headers = { "Authorization" : `Bearer ${GENIUS_TOKEN}`};
    const url = `https://api.genius.com/search?q=${args.searchString}&per_page=50`;
    const body = await fetch(url, {headers});
    const result = await body.json();

    if(result.error){
        throw new Error(result.error + ": " + result.error_description);
    }
    if (result.meta.status !== 200){
        throw new Error(`${result.meta.status}: ${result.meta.message}`);
    }
    const results = result.response.hits.map(hit => hit.result);
    const mappedResults = results.map(song => ({
        title: song.title,
        artist: song.primary_artist.name,
        songId: song.id,
        imageURI: song.header_image_thumbnail_url
    }));
    return mappedResults;
}

async function lyrics(parent, args, context, info){
    const song = await lyricist.song(args.songId, { fetchLyrics: true});
    return { content: song.lyrics };
}

module.exports = {
    info,
    votes,
    comments,
    songSearch,
    lyrics,
    vote
}