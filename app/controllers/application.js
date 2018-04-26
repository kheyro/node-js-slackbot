const fetch = require('isomorphic-fetch');

const GITHUB_API = 'https://api.github.com';
const msg = {
  username: 'SlackGitBot',
  mrkdown: true,
};

function sendMessage(text, attachments) {
  msg.text = text;
  if (attachments) msg.attachments = [attachments];

  return msg;
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
      res.json(sendMessage('', formatUserInfo(data, command)));
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

module.exports = appController;
