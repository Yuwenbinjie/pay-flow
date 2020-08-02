import web3 from './web3';
// var Web3 = require('web3');
// let web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));


const address = '0x3D89E63495161193A4aC56397f9843C317EC2148';
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
                'name': 'actualRecipientBalance',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'feesOfRrotocol',
                'type': 'uint256'
            }
        ],
        'name': 'CancelInstallmentWithDPStream',
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
                'name': 'deposit',
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
                'name': 'stopTime',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'numberOfInstallments',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'downPaymentRatio',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'feesOfRecipientPer',
                'type': 'uint256'
            }
        ],
        'name': 'CreateInstallmentWithDPStream',
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
                'internalType': 'address',
                'name': 'tokenAddress',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'name': 'TakeEarnings',
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
                'name': 'transferAmount',
                'type': 'uint256'
            }
        ],
        'name': 'TransferWithDP',
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
                'name': 'fee',
                'type': 'uint256'
            }
        ],
        'name': 'UpdateFee',
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
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'actualAmount',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'feesOfRrotocol',
                'type': 'uint256'
            }
        ],
        'name': 'WithdrawFromInstallmentWithDPStream',
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
        'constant': true,
        'inputs': [],
        'name': 'feeOfProtocolPer',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': 'mantissa',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'view',
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
        'constant': false,
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'feePer',
                'type': 'uint256'
            }
        ],
        'name': 'updateFeesOfProtocolPer',
        'outputs': [],
        'payable': false,
        'stateMutability': 'nonpayable',
        'type': 'function'
    },
    {
        'constant': true,
        'inputs': [
            {
                'internalType': 'address',
                'name': 'tokenAddress',
                'type': 'address'
            }
        ],
        'name': 'getEarnings',
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
                'internalType': 'address',
                'name': 'tokenAddress',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            }
        ],
        'name': 'takeEarnings',
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
                'name': 'amount',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'duration',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'numberOfInstallments',
                'type': 'uint256'
            }
        ],
        'name': 'calculationFeesOfProtocol',
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
        'inputs': [
            {
                'internalType': 'uint256',
                'name': 'streamId',
                'type': 'uint256'
            }
        ],
        'name': 'getInstallmentWithDPStream',
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
                'name': 'deposit',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'downPaymentRatio',
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
                'name': 'stopTime',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'numberOfInstallments',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'feesOfRecipientPer',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'ratePerSecond',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'installmentAmountWithFees',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'haveBeenNumberOfInstallment',
                'type': 'uint256'
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
                'internalType': 'uint256',
                'name': 'deposit',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'downPaymentRatio',
                'type': 'uint256'
            }
        ],
        'name': 'calculationDownPaymentAmount',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'payable': false,
        'stateMutability': 'pure',
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
                'name': 'deposit',
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
                'name': 'stopTime',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'numberOfInstallments',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'downPaymentRatio',
                'type': 'uint256'
            },
            {
                'internalType': 'uint256',
                'name': 'feesOfRecipientPer',
                'type': 'uint256'
            }
        ],
        'name': 'createInstallmentWithDPStream',
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
        'name': 'installmentDelataOf',
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
        'name': 'installmentWithDPBalanceOf',
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
            }
        ],
        'name': 'transferWithDP',
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
        'name': 'withdrawInstallmentWithDPStream',
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
        'name': 'cancelInstallmentWithDPStream',
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

const installmentWithDPInstance = new web3.eth.Contract(abi, address);

export default installmentWithDPInstance;