const { 
    GENIUS_TOKEN,
    APP_SECRET
} = require('../keys.config');

const jwt = require('jsonwebtoken');
const Lyricist = require('lyricist');


const lyricist = new Lyricist(GENIUS_TOKEN);

function getIdFromToken(token){
    const { userId } = jwt.verify(token, APP_SECRET);
}

function getUserId(context){
    const Authorization = context.request.get('Authorization');
    if(Authorization){
        const token = Authorization.replace('Bearer ', '');
        const { userId } = jwt.verify(token, APP_SECRET);
        return userId
    }

    throw new Error('Not authenticated');
}



module.exports = {
    APP_SECRET,
    GENIUS_TOKEN,
    getUserId,
    lyricist
}