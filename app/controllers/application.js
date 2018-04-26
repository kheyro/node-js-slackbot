const fetch = require('isomorphic-fetch');

const GITHUB_API = 'https://api.github.com';
const msg = {
  username: 'SlackGitBot',
  mrkdown: true,
};

function sendMessage(res, text, attachments) {
  msg.text = text;
  if (attachments) msg.attachments = [attachments];

  return res.send(msg);
}

function formatUserInfo(data, command) {
  let text = '';
  let pretext;
  let authorName;
  let authorLink;

  if (command) {
    switch (command) {
      case 'repos':
        authorName = data.length > 0 ? data[0].owner.name : '';
        authorLink = data.length > 0 ? data[0].owner.html_url : '';
        pretext =
          data.length > 0 ? `${data[0].owner.login}'s list of repos:` : '';

        data.forEach((repo, i) => {
          text += `${i}. ${repo.html_url}\n`;
          return text;
        });
        break;
      default:
        break;
    }
  } else {
    authorName = data.name;
    authorLink = data.html_url;
    pretext = `Git info for user *${data.login}*`;
    text += `
       *bio*: ${data.bio || '-'}
      *company*: ${data.company || '-'}
      *email*: ${data.email || '-'}
      *location*: ${data.location || '-'}
      *# of repos*: ${data.public_repos}
      *# of followers*: ${data.followers}
  `;
  }

  return {
    pretext,
    author_name: authorName,
    author_link: authorLink,
    color: '#764FA5',
    text,
  };
}

function getGit(res, user, command) {
  let url = `${GITHUB_API}/users/${user}`;

  if (command) {
    switch (command) {
      case 'repos':
        url += '/repos';
        break;
      case 'help':
        sendMessage(res, 'Available commands: `repos`');
        break;
      default:
        return sendMessage(res, 'Invalid command. Type `/getgit <user> help`');
    }
  }

  fetch(url)
    .then(resp => {
      if (resp.ok) return resp.json();

      sendMessage(res, 'User not found');
      throw new Error('User not found');
    })
    .then(data => {
      sendMessage(res, '', formatUserInfo(data, command));
    })
    .catch(err => console.log(err));
}

const appController = {
  getIndex: (req, res) => {
    res.send('Git Slackbot');
  },
  postIndex: (req, res) => {
    res.set('Content-Type', 'application/json');

    const username = req.body.text.split(' ')[0];
    const command = req.body.text.split(' ')[1];

    if (req.body.text === '') {
      return sendMessage('Command invalid. Try: /getgit <username> <command>');
    }

    return getGit(res, username, command);
  },
};

module.exports = appController;
