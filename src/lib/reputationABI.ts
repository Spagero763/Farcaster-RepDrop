export const abi = [
  {
    "inputs": [],
    "name": "getAllClaimers",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "claimer", "type": "address" },
          { "internalType": "uint256", "name": "reputation", "type": "uint256" }
        ],
        "internalType": "struct ReputationDrop.Claimer[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimReputation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "hasClaimed",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];
