import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Propcorn
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const propcornAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'protocolFeeReceiver',
        internalType: 'address payable',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'error', inputs: [], name: 'FundsLocked' },
  { type: 'error', inputs: [], name: 'InvalidFee' },
  { type: 'error', inputs: [], name: 'InvalidOwner' },
  { type: 'error', inputs: [], name: 'NoFundsToReturn' },
  { type: 'error', inputs: [], name: 'NonexistentProposal' },
  { type: 'error', inputs: [], name: 'ProposalClosed' },
  { type: 'error', inputs: [], name: 'ProposalInProgress' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'to', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'FundsWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'url', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'secondsToUnlock',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'minAmountRequested',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'feeBasisPoints',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalDefunded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'fundingCompletedAt',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalFunded',
  },
  {
    type: 'function',
    inputs: [
      { name: 'url', internalType: 'string', type: 'string' },
      { name: 'secondsToUnlock', internalType: 'uint256', type: 'uint256' },
      { name: 'minAmountRequested', internalType: 'uint256', type: 'uint256' },
      { name: 'feeBasisPoints', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createProposal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'defundProposal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'fundProposal',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getProposalByAccount',
    outputs: [
      {
        name: '',
        internalType: 'struct Propcorn.Proposal',
        type: 'tuple',
        components: [
          { name: 'url', internalType: 'string', type: 'string' },
          { name: 'secondsToUnlock', internalType: 'uint256', type: 'uint256' },
          {
            name: 'minAmountRequested',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'balance', internalType: 'uint256', type: 'uint256' },
          {
            name: 'fundingCompletedAt',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'feeBasisPoints', internalType: 'uint256', type: 'uint256' },
          { name: 'closed', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'index', internalType: 'uint256', type: 'uint256' },
      { name: 'receiver', internalType: 'address', type: 'address' },
    ],
    name: 'withdrawFunds',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

/**
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const propcornAddress = {
  10: '0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6',
  1337: '0xf6018dffAc9B1C63e8f1097148664551CEaEc5A2',
} as const

/**
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const propcornConfig = {
  address: propcornAddress,
  abi: propcornAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link propcornAbi}__
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useReadPropcorn = /*#__PURE__*/ createUseReadContract({
  abi: propcornAbi,
  address: propcornAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link propcornAbi}__ and `functionName` set to `"getProposalByAccount"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useReadPropcornGetProposalByAccount =
  /*#__PURE__*/ createUseReadContract({
    abi: propcornAbi,
    address: propcornAddress,
    functionName: 'getProposalByAccount',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link propcornAbi}__
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useWritePropcorn = /*#__PURE__*/ createUseWriteContract({
  abi: propcornAbi,
  address: propcornAddress,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link propcornAbi}__ and `functionName` set to `"createProposal"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useWritePropcornCreateProposal =
  /*#__PURE__*/ createUseWriteContract({
    abi: propcornAbi,
    address: propcornAddress,
    functionName: 'createProposal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link propcornAbi}__ and `functionName` set to `"defundProposal"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useWritePropcornDefundProposal =
  /*#__PURE__*/ createUseWriteContract({
    abi: propcornAbi,
    address: propcornAddress,
    functionName: 'defundProposal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link propcornAbi}__ and `functionName` set to `"fundProposal"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useWritePropcornFundProposal =
  /*#__PURE__*/ createUseWriteContract({
    abi: propcornAbi,
    address: propcornAddress,
    functionName: 'fundProposal',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link propcornAbi}__ and `functionName` set to `"withdrawFunds"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useWritePropcornWithdrawFunds =
  /*#__PURE__*/ createUseWriteContract({
    abi: propcornAbi,
    address: propcornAddress,
    functionName: 'withdrawFunds',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link propcornAbi}__
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useSimulatePropcorn = /*#__PURE__*/ createUseSimulateContract({
  abi: propcornAbi,
  address: propcornAddress,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link propcornAbi}__ and `functionName` set to `"createProposal"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useSimulatePropcornCreateProposal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: propcornAbi,
    address: propcornAddress,
    functionName: 'createProposal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link propcornAbi}__ and `functionName` set to `"defundProposal"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useSimulatePropcornDefundProposal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: propcornAbi,
    address: propcornAddress,
    functionName: 'defundProposal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link propcornAbi}__ and `functionName` set to `"fundProposal"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useSimulatePropcornFundProposal =
  /*#__PURE__*/ createUseSimulateContract({
    abi: propcornAbi,
    address: propcornAddress,
    functionName: 'fundProposal',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link propcornAbi}__ and `functionName` set to `"withdrawFunds"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useSimulatePropcornWithdrawFunds =
  /*#__PURE__*/ createUseSimulateContract({
    abi: propcornAbi,
    address: propcornAddress,
    functionName: 'withdrawFunds',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link propcornAbi}__
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useWatchPropcornEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: propcornAbi,
  address: propcornAddress,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link propcornAbi}__ and `eventName` set to `"FundsWithdrawn"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useWatchPropcornFundsWithdrawnEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: propcornAbi,
    address: propcornAddress,
    eventName: 'FundsWithdrawn',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link propcornAbi}__ and `eventName` set to `"ProposalCreated"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useWatchPropcornProposalCreatedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: propcornAbi,
    address: propcornAddress,
    eventName: 'ProposalCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link propcornAbi}__ and `eventName` set to `"ProposalDefunded"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useWatchPropcornProposalDefundedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: propcornAbi,
    address: propcornAddress,
    eventName: 'ProposalDefunded',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link propcornAbi}__ and `eventName` set to `"ProposalFunded"`
 *
 * - [__View Contract on Op Mainnet Optimism Explorer__](https://optimistic.etherscan.io/address/0x7A84A2A73bA9ef05dFeaBB5d7A248B87102835e6)
 * -
 */
export const useWatchPropcornProposalFundedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: propcornAbi,
    address: propcornAddress,
    eventName: 'ProposalFunded',
  })
