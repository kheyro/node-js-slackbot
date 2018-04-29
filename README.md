# Node GIT Slack bot

Use this slack bot to retrieve Github information for a specific user through Slack "Slash Commands".

## Prerequisites

Create a Slash Commands for your channel. For "Command" use for example `/getgit`, for "URL" you can use your own server URL or a tunneling service such as [https://ngrok.com/](https://ngrok.com/) (of you wish to use it on your local server) and the URL method should be set to `POST`.

## Installation

1.  Run `npm install` to install all the packages.
2.  Edit `.env` file and add in your slack token `SLACK_TOKEN=you_token`
3.  Type `npm start` to start the server

## Available commands

If slack uses `/getgit` as slash command.

* Retrieve user `/getgit <username>`
* Retrieve user repositories `/getgit <username> repos`
* List all available command `/getgit <username help`
