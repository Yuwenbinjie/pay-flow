import Web3 from 'web3';
// console.log(ethereum,web3)
// if (window.ethereum) {
//   window.web3 = new Web3(ethereum);
//   try {
//     // Request account access if needed
//     ethereum.enable();
//   } catch (error) {
//     // User denied account access...
//   }
// } else if (window.web3) {
//   // Legacy dapp browsers...
//   window.web3 = new Web3(web3.currentProvider);
// } else {
//   // Non-dapp browsers...
//   console.log(
//     'Non-Ethereum browser detected. You should consider trying MetaMask!'
//   );
// }
window.web3 = new Web3('HTTP://127.0.0.1:8545');
console.log(web3);
export default web3;