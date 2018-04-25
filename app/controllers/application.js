const appController = {
  getIndex: (req, res) => {
    res.send('Hello world!');
  },
  postIndex: (req, res) => {
    console.log('Hello', process.env.SLACK_TOKEN);
    res.send('See you slack');
  },
};

module.exports = appController;
