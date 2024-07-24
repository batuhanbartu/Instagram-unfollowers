const express = require('express');
const app = express();
const port = 3000;

const { IgApiClient } = require('instagram-private-api');
const { sample } = require('lodash');

const ig = new IgApiClient();

// You must generate device id's before login.
// Id's generated based on seed
// So if you pass the same value as first argument - the same id's are generated every time

/**
 * Source: https://github.com/dilame/instagram-private-api/issues/969#issuecomment-551436680
 * @param feed
 * @returns All items from the feed
 */

async function getAllItemsFromFeed(feed) {
    let items = [];
    do {
        var feeeds = (await feed.items());
        items = items.concat(feeeds);
    } while (feed.isMoreAvailable());
    return items;
}


app.get('/', (req, res) => {
    ig.state.generateDevice('[kullanıcı adı]');

    (async () => {
        await ig.account.login('[kullanıcı adı]', '[kullanıcı şifre');
        const followersFeed = ig.feed.accountFollowers(ig.state.cookieUserId);
        const followingFeed = ig.feed.accountFollowing(ig.state.cookieUserId);
        const followers = await getAllItemsFromFeed(followersFeed);
        const following = await getAllItemsFromFeed(followingFeed);
        // Making a new map of users username that follow you.

        const followersUsername = new Set(followers.map(({ username }) => username));
        const notFollowingYou = following.filter(({ username }) => !followersUsername.has(username));

        for (const user of notFollowingYou) {
            console.log(user.username)
            console.log(user.profile_pic_url)
        }

    })();
    res.send('');
});

app.listen(port, () => {
    console.log('Example app listening at http://localhost:${port}');
});