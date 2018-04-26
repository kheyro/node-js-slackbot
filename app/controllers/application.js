const fetch = require('isomorphic-fetch');

const GITHUB_API = 'https://api.github.com';
const msg = {
  username: 'SlackGitBot',
  mrkdown: true,
};

function sendMessage(text, attachments) {
  msg.text = text;
  if (attachments) msg.attachments = [attachments];
  console.log(msg);

  return msg;
}

function formatUserInfo(user) {
  const text = `
    *bio*: ${user.bio}\n*company*: ${user.company}\n*email*: ${
    user.email
  }\n*location*: ${user.location}\n*# of repos*: ${
    user.public_repos
  }\n*# of followers*: ${user.followers}
  `;

  const attachment = {
    author_name: user.name,
    author_link: user.html_url,
    color: '#764FA5',
    text,
  };

  return attachment;
}

function getGit(res, user, command) {
  let url = `${GITHUB_API}/users/${user}`;

  if (command) {
    switch (command) {
      case 'repos':
        url += '/repos';
        break;
      case 'help':
        res.send(sendMessage('Available commands: `repos`'));
        break;
      default:
        res.send(sendMessage('Invalid command. Type `/getgit <user> help`'));
    }
  }

  fetch(url)
    .then(resp => {
      if (resp.ok) return resp.json();

      res.send('User not found');
      throw new Error('User not found');
    })
    .then(data => {
      console.log(data);
      res.json(sendMessage(`Git info for *${user}*`, formatUserInfo(data)));
    })
    .catch(err => console.log(err));
}

const appController = {
  getIndex: (req, res) => {
    res.send('Hello world!');
  },
  postIndex: (req, res) => {
    res.set('Content-Type', 'application/json');

    const username = req.body.text.split(' ')[0];
    const command = req.body.text.split(' ')[1];

    if (req.body.text === '') {
      return res.send('Command invalid. Try: /getgit <username> <command>');
    }

    return getGit(res, username, command);
  },
};

/*
req { token: 'fKKPtrFftQYvtI4q8kGSkZfL',
  team_id: 'TA5C77UKB',
  team_domain: 'denisatk',
  channel_id: 'CA5U98S3U',
  channel_name: 'general',
  user_id: 'UA6QZBLHL',
  user_name: 'denis.atkesone',
  command: '/getgit',
  text: 'user command',
  response_url: 'https://hooks.slack.com/commands/TA5C77UKB/353077653745/USFJO5e176sCPjXn9YJkXIXa' }
 */

/*
{ login: 'kheyro',
  id: 10345706,
  avatar_url: 'https://avatars2.githubusercontent.com/u/10345706?v=4',
  gravatar_id: '',
  url: 'https://api.github.com/users/kheyro',
  html_url: 'https://github.com/kheyro',
  followers_url: 'https://api.github.com/users/kheyro/followers',
  following_url: 'https://api.github.com/users/kheyro/following{/other_user}',
  gists_url: 'https://api.github.com/users/kheyro/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/kheyro/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/kheyro/subscriptions',
  organizations_url: 'https://api.github.com/users/kheyro/orgs',
  repos_url: 'https://api.github.com/users/kheyro/repos',
  events_url: 'https://api.github.com/users/kheyro/events{/privacy}',
  received_events_url: 'https://api.github.com/users/kheyro/received_events',
  type: 'User',
  site_admin: false,
  name: 'Denis A.',
  company: null,
  blog: '',
  location: null,
  email: null,
  hireable: true,
  bio: null,
  public_repos: 422,
  public_gists: 3,
  followers: 1,
  following: 1,
  created_at: '2014-12-30T04:13:41Z',
  updated_at: '2018-04-09T20:13:59Z' }
 */
module.exports = appController;
