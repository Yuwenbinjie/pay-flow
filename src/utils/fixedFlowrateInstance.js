import web3 from './web3';
// var Web3 = require('web3');
// let web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));


const address = '0xeE9880646DB47D14bAD7ebC95205B92eD138F5F6';
const abi = [
    {
        'inputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'constructor'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'uint256',
                'name': 'streamId',
                'type': 'uint256'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'sender',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'recipient',
                'type': 'address'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'senderBalance',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'recipientBalance',
                'type': 'uint256'
            }
        ],
        'name': 'CancelFixedFlowrateStream',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'uint256',
                'name': 'streamId',
                'type': 'uint256'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'sender',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'recipient',
                'type': 'address'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'maxAmount',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'address',
                'name': 'tokenAddress',
                'type': 'address'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'startTime',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'maxStopTime',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'ratePerSecond',
                'type': 'uint256'
            }
        ],
        'name': 'CreateFixedFlowrateStream',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'previousOwner',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'newOwner',
                'type': 'address'
            }
        ],
        'name': 'OwnershipTransferred',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': false,
                'internalType': 'address',
                'name': 'account',
                'type': 'address'
            }
        ],
        'name': 'Paused',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'account',
                'type': 'address'
            }
        ],
        'name': 'PauserAdded',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'account',
                'type': 'address'
            }
        ],
        'name': 'PauserRemoved',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'uint256',
                'name': 'streamId',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'name': 'TransferWithFixedFlowrate',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': false,
                'internalType': 'address',
                'name': 'account',
                'type': 'address'
            }
        ],
        'name': 'Unpaused',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'uint256',
                'name': 'streamId',
                'type': 'uint256'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'recipient',
                'type': 'address'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'name': 'WithdrawFromFixedFlowrateStream',
        'type': 'event'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'address',
                'name': 'account',
                'type': 'address'
            }
        ],
        'name': 'addPauser',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [],
        'name': 'initialize',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'address',
                'name': 'sender',
                'type': 'address'
            }
        ],
        'name': 'initialize',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'isOwner',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [
            {
                'internalType': 'address',
                'name': 'account',
                'type': 'address'
            }
        ],
        'name': 'isPauser',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'nextStreamId',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'owner',
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [],
        'name': 'pause',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'paused',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'address',
                'name': 'newOwner',
                'type': 'address'
            }
        ],
        'name': 'transferOwnership',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [],
        'name': 'unpause',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'streamId',
                'type': 'uint256'
            }
        ],
        'name': 'getFixedFlowrateStream',
        'outputs': [
            {
                'internalType': 'address',
                'name': 'sender',
                'type': 'address'
            },
            {
                'internalType': 'address',
                'name': 'recipient',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'maxAmount',
                'type': 'uint256'
            },
            {
                'internalType': 'address',
                'name': 'tokenAddress',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'startTime',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'maxStopTime',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'ratePerSecond',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'withdrawalAmount',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'address',
                'name': 'recipient',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'maxAmount',
                'type': 'uint256'
            },
            {
                'internalType': 'address',
                'name': 'tokenAddress',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'ratePerSecond',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'startTime',
                'type': 'uint256'
            }
        ],
        'name': 'createFixedFlowrateStream',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'streamId',
                'type': 'uint256'
            }
        ],
        'name': 'fixedFlowrateDeltaOf',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'streamId',
                'type': 'uint256'
            },
            {
                'internalType': 'address',
                'name': 'who',
                'type': 'address'
            }
        ],
        'name': 'fixedFlowrateBalanceOf',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': 'balance',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'streamId',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'name': 'transferWithFixedFlowrate',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'streamId',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'name': 'withdrawFromFlowrateStream',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': false,
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'streamId',
                'type': 'uint256'
            }
        ],
        'name': 'cancelFlowrateStream',
        'outputs': [
            {
                'internalType': 'bool',
                'name': '',
                'type': 'bool'
            }
        ],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [],
        'name': 'getTime',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
        'type': 'function'
    }
]

const fixedFlowrateInstance = new web3.eth.Contract(abi, address);

export default fixedFlowrateInstance;