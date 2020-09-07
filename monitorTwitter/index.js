const Twitter = require("twitter");
const fundAddress = require("../erc20Functions");

const twitter = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const params = {
  q: "@XIO_Network, #Flashstaking",
  count: 100,
  result_type: "recent",
  tweet_mode: "extended",
  include_entities: true,
};

let lastChecked = Date.now();
let fundedWallets = {};
const secInADay = 86400;

const fundWallets = (walletAddresses = []) => {
  try {
    walletAddresses.map((_address) => {
      if (
        fundedWallets[_address] &&
        new Date(fundedWallets[_address]).getTime() + secInADay > lastChecked
      ) {
        console.log("Already Funded, ", _address);
        return;
      }
      fundAddress.sendEth(_address).then(() => {
        fundAddress.sendXio(_address);
      });
      fundedWallets[_address] = lastChecked;
    });
  } catch (e) {
    console.error("ERROR fundWallets -> ", e);
  }
};

const fetchAddressesFromTweetsAndFund = () => {
  try {
    twitter.get("search/tweets", params, (err, data, response) => {
      if (err) {
        console.error("ERROR fetchAddressesFromTweets -> ", err);
      }

      const extractedWalletAddresses = data.statuses
        .filter((_tweet) => new Date(_tweet.created_at).getTime() > lastChecked)
        .map((_tweet) => {
          const _extractedAddress = _tweet.full_text.match(/0x[a-fA-F0-9]{40}/);
          return _extractedAddress ? _extractedAddress[0] : false;
        })
        .filter((_id) => _id);

      lastChecked = Date.now();
      fundWallets(extractedWalletAddresses);
    });
  } catch (e) {
    console.error("ERROR fetchAddressesFromTweets -> ", e);
  }
};

module.exports = { fetchAddressesFromTweetsAndFund };
