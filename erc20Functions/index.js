const Web3 = require("web3");
const { abi: ERC20Abi } = require("./ERC20Abi.json");

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.INFURA_PROJECT_URL)
);

web3.eth.defaultAccount = process.env.WALLET_ADDRESS;
web3.eth.defaultChain = "rinkeby";

const xioContract = new web3.eth.Contract(ERC20Abi, process.env.XIO_ADDRESS);

const signAndSendTxn = async (_txnObject) => {
  try {
    const _signedTxn = await web3.eth.accounts.signTransaction(
      _txnObject,
      process.env.WALLET_PRIVATE_KEY
    );
    const _sendSigned = await web3.eth.sendSignedTransaction(
      _signedTxn.rawTransaction
    );
    return _sendSigned;
  } catch (e) {
    throw new Error("ERROR signAndSendTxn -> ", e);
  }
};

const sendXio = async (
  address = "0xB9213CA7d3d5E0F71F50560aEfCC56875a2EbF36",
  amount = "25000000000000000000"
) => {
  try {
    const _transfer = xioContract.methods.transfer(address, amount).encodeABI();
    const _txnObject = {
      gas: web3.utils.toHex("100000"),
      gasLimit: web3.utils.toHex("1000000"),
      data: _transfer,
      from: process.env.WALLET_ADDRESS,
      to: process.env.XIO_ADDRESS,
    };
    await signAndSendTxn(_txnObject);
    console.log("Sent, 25XIO --> ", address);
  } catch (e) {
    console.error("ERROR transfer -> ", e);
  }
};

const sendEth = async (
  address = "0xB9213CA7d3d5E0F71F50560aEfCC56875a2EbF36",
  amount = "50000000000000000"
) => {
  try {
    const _txnObject = {
      gas: web3.utils.toHex("100000"),
      gasLimit: web3.utils.toHex("1000000"),
      value: web3.utils.toHex(amount),
      from: process.env.WALLET_ADDRESS,
      to: address,
    };
    await signAndSendTxn(_txnObject);
    console.log("Sent, 0.05ETH --> ", address);
  } catch (e) {
    console.error("ERROR transfer -> ", e);
  }
};

module.exports = {
  sendXio,
  sendEth,
};
