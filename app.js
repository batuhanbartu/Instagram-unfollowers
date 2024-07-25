const express = require('express');
const app = express();
const port = 3000;

const { IgApiClient } = require('instagram-private-api');
const { sample } = require('lodash');

const ig = new IgApiClient();

async function getAllItemsFromFeed(feed) {
    let items = [];
    do {
        var feeeds = (await feed.items());
        items = items.concat(feeeds);
    } while (feed.isMoreAvailable());
    return items;
}


app.get('/', (req, res) => {
    ig.state.generateDevice('USER NAME');

    (async () => {
        await ig.account.login('USER NAME', 'PASSWORD');
        const followersFeed = ig.feed.accountFollowers(ig.state.cookieUserId);
        const followingFeed = ig.feed.accountFollowing(ig.state.cookieUserId);
        const followers = await getAllItemsFromFeed(followersFeed);
        const following = await getAllItemsFromFeed(followingFeed);

        const followersUsername = new Set(followers.map(({ username }) => username));
        const notFollowingYou = following.filter(({ username }) => !followersUsername.has(username));

        for (const user of notFollowingYou) {
            //Information where you see who does not follow you back
            console.log(user.username)
            console.log(user.profile_pic_url)
        }

    })();
    res.send('');
});

app.listen(port, () => {
    console.log('Example app listening at http://localhost:${port}');
});
