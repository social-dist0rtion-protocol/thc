import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AccessControl
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const accessControlAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AccessControlUpgradeable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const accessControlUpgradeableAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ContextUpgradeable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const contextUpgradeableAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DisappearRenderer
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const disappearRendererAbi = [
  { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'isDaytime',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'render',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC1155Upgradeable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc1155UpgradeableAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC165
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc165Abi = [
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC165Upgradeable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc165UpgradeableAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IAccessControl
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iAccessControlAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IAccessControlUpgradeable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iAccessControlUpgradeableAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155Abi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155MetadataURIUpgradeable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155MetadataUriUpgradeableAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155ReceiverUpgradeable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155ReceiverUpgradeableAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155Upgradeable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155UpgradeableAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC165
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc165Abi = [
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC165Upgradeable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc165UpgradeableAbi = [
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20Abi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Permit
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20PermitAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IRenderer
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iRendererAbi = [
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'render',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ITreasure
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iTreasureAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TREASURE_HUNT_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'player', internalType: 'address', type: 'address' },
      { name: 'badgeId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'thc', internalType: 'address', type: 'address' },
      { name: 'renderer', internalType: 'address', type: 'address' },
    ],
    name: 'updateRenderer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Initializable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const initializableAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Ownable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ownableAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// OwnableUpgradeable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ownableUpgradeableAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Treasure
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const treasureAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'version', internalType: 'uint8', type: 'uint8', indexed: false },
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TREASURE_HUNT_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'player', internalType: 'address', type: 'address' },
      { name: 'badgeId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'renderers',
    outputs: [
      { name: '', internalType: 'contract IRenderer', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'thc', internalType: 'address', type: 'address' },
      { name: 'renderer', internalType: 'address', type: 'address' },
    ],
    name: 'updateRenderer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TreasureHuntCreator
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const treasureHuntCreatorAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'solutions_', internalType: 'address[]', type: 'address[]' },
      { name: 'keys', internalType: 'address[]', type: 'address[]' },
      { name: 'prize_', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'completedChapter',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ChapterCompleted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'msgSender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'IncrementCounter',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'player',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'completedKey',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'KeyCompleted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'from',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'badgeId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PrizeMinted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'RoleRevoked',
  },
  { type: 'fallback', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'GAME_MASTER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'solution', internalType: 'address', type: 'address' }],
    name: 'addSolution',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint96', type: 'uint96' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'chapterToPlayers',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'contextCounter',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'currentChapter',
    outputs: [{ name: '', internalType: 'uint96', type: 'uint96' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'gameMasters',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'a', internalType: 'address', type: 'address' }],
    name: 'getAddressHash',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'page', internalType: 'uint256', type: 'uint256' }],
    name: 'getLeaderboard',
    outputs: [
      { name: 'leaderboard', internalType: 'uint256[32]', type: 'uint256[32]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getQuestsRootCID',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'keyToPos',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'playerToCurrentChapter',
    outputs: [{ name: '', internalType: 'uint96', type: 'uint96' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'playerToKeys',
    outputs: [{ name: '', internalType: 'uint80', type: 'uint80' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'players',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'prize',
    outputs: [
      { name: '', internalType: 'contract ITreasure', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'questsRootCid',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'questsRootCid_', internalType: 'bytes', type: 'bytes' }],
    name: 'setup',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'solutions',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'submit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'submitKey',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalChapters',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalKeys',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
] as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const treasureHuntCreatorAddress = {
  11155111: '0xfF016753393916E420c1E66bDF7A3512F3A42676',
} as const

/**
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const treasureHuntCreatorConfig = {
  address: treasureHuntCreatorAddress,
  abi: treasureHuntCreatorAbi,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessControlAbi}__
 */
export const useReadAccessControl = /*#__PURE__*/ createUseReadContract({
  abi: accessControlAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessControlAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 */
export const useReadAccessControlDefaultAdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: accessControlAbi,
    functionName: 'DEFAULT_ADMIN_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessControlAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadAccessControlGetRoleAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: accessControlAbi,
    functionName: 'getRoleAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessControlAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadAccessControlHasRole = /*#__PURE__*/ createUseReadContract({
  abi: accessControlAbi,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessControlAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadAccessControlSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: accessControlAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessControlAbi}__
 */
export const useWriteAccessControl = /*#__PURE__*/ createUseWriteContract({
  abi: accessControlAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessControlAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteAccessControlGrantRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessControlAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessControlAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteAccessControlRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessControlAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessControlAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteAccessControlRevokeRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessControlAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessControlAbi}__
 */
export const useSimulateAccessControl = /*#__PURE__*/ createUseSimulateContract(
  { abi: accessControlAbi },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessControlAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateAccessControlGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessControlAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessControlAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateAccessControlRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessControlAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessControlAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateAccessControlRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessControlAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessControlAbi}__
 */
export const useWatchAccessControlEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: accessControlAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessControlAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchAccessControlRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessControlAbi,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessControlAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchAccessControlRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessControlAbi,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessControlAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchAccessControlRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessControlAbi,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessControlUpgradeableAbi}__
 */
export const useReadAccessControlUpgradeable =
  /*#__PURE__*/ createUseReadContract({ abi: accessControlUpgradeableAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessControlUpgradeableAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 */
export const useReadAccessControlUpgradeableDefaultAdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: accessControlUpgradeableAbi,
    functionName: 'DEFAULT_ADMIN_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessControlUpgradeableAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadAccessControlUpgradeableGetRoleAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: accessControlUpgradeableAbi,
    functionName: 'getRoleAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessControlUpgradeableAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadAccessControlUpgradeableHasRole =
  /*#__PURE__*/ createUseReadContract({
    abi: accessControlUpgradeableAbi,
    functionName: 'hasRole',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link accessControlUpgradeableAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadAccessControlUpgradeableSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: accessControlUpgradeableAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessControlUpgradeableAbi}__
 */
export const useWriteAccessControlUpgradeable =
  /*#__PURE__*/ createUseWriteContract({ abi: accessControlUpgradeableAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessControlUpgradeableAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteAccessControlUpgradeableGrantRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessControlUpgradeableAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessControlUpgradeableAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteAccessControlUpgradeableRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessControlUpgradeableAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link accessControlUpgradeableAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteAccessControlUpgradeableRevokeRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: accessControlUpgradeableAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessControlUpgradeableAbi}__
 */
export const useSimulateAccessControlUpgradeable =
  /*#__PURE__*/ createUseSimulateContract({ abi: accessControlUpgradeableAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessControlUpgradeableAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateAccessControlUpgradeableGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessControlUpgradeableAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessControlUpgradeableAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateAccessControlUpgradeableRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessControlUpgradeableAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link accessControlUpgradeableAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateAccessControlUpgradeableRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: accessControlUpgradeableAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessControlUpgradeableAbi}__
 */
export const useWatchAccessControlUpgradeableEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessControlUpgradeableAbi,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessControlUpgradeableAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchAccessControlUpgradeableInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessControlUpgradeableAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessControlUpgradeableAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchAccessControlUpgradeableRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessControlUpgradeableAbi,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessControlUpgradeableAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchAccessControlUpgradeableRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessControlUpgradeableAbi,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link accessControlUpgradeableAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchAccessControlUpgradeableRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: accessControlUpgradeableAbi,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contextUpgradeableAbi}__
 */
export const useWatchContextUpgradeableEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: contextUpgradeableAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link contextUpgradeableAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchContextUpgradeableInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: contextUpgradeableAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link disappearRendererAbi}__
 */
export const useReadDisappearRenderer = /*#__PURE__*/ createUseReadContract({
  abi: disappearRendererAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link disappearRendererAbi}__ and `functionName` set to `"isDaytime"`
 */
export const useReadDisappearRendererIsDaytime =
  /*#__PURE__*/ createUseReadContract({
    abi: disappearRendererAbi,
    functionName: 'isDaytime',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link disappearRendererAbi}__ and `functionName` set to `"owner"`
 */
export const useReadDisappearRendererOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: disappearRendererAbi,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link disappearRendererAbi}__ and `functionName` set to `"render"`
 */
export const useReadDisappearRendererRender =
  /*#__PURE__*/ createUseReadContract({
    abi: disappearRendererAbi,
    functionName: 'render',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link disappearRendererAbi}__
 */
export const useWriteDisappearRenderer = /*#__PURE__*/ createUseWriteContract({
  abi: disappearRendererAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link disappearRendererAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteDisappearRendererRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: disappearRendererAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link disappearRendererAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteDisappearRendererTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: disappearRendererAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link disappearRendererAbi}__
 */
export const useSimulateDisappearRenderer =
  /*#__PURE__*/ createUseSimulateContract({ abi: disappearRendererAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link disappearRendererAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateDisappearRendererRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: disappearRendererAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link disappearRendererAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateDisappearRendererTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: disappearRendererAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link disappearRendererAbi}__
 */
export const useWatchDisappearRendererEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: disappearRendererAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link disappearRendererAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchDisappearRendererOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: disappearRendererAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155UpgradeableAbi}__
 */
export const useReadErc1155Upgradeable = /*#__PURE__*/ createUseReadContract({
  abi: erc1155UpgradeableAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155UpgradeableAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadErc1155UpgradeableBalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155UpgradeableAbi,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155UpgradeableAbi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadErc1155UpgradeableBalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155UpgradeableAbi,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155UpgradeableAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadErc1155UpgradeableIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155UpgradeableAbi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155UpgradeableAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadErc1155UpgradeableSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: erc1155UpgradeableAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc1155UpgradeableAbi}__ and `functionName` set to `"uri"`
 */
export const useReadErc1155UpgradeableUri = /*#__PURE__*/ createUseReadContract(
  { abi: erc1155UpgradeableAbi, functionName: 'uri' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155UpgradeableAbi}__
 */
export const useWriteErc1155Upgradeable = /*#__PURE__*/ createUseWriteContract({
  abi: erc1155UpgradeableAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155UpgradeableAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteErc1155UpgradeableSafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc1155UpgradeableAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155UpgradeableAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteErc1155UpgradeableSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc1155UpgradeableAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc1155UpgradeableAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteErc1155UpgradeableSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc1155UpgradeableAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155UpgradeableAbi}__
 */
export const useSimulateErc1155Upgradeable =
  /*#__PURE__*/ createUseSimulateContract({ abi: erc1155UpgradeableAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155UpgradeableAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateErc1155UpgradeableSafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc1155UpgradeableAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155UpgradeableAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateErc1155UpgradeableSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc1155UpgradeableAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc1155UpgradeableAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateErc1155UpgradeableSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc1155UpgradeableAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155UpgradeableAbi}__
 */
export const useWatchErc1155UpgradeableEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: erc1155UpgradeableAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155UpgradeableAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchErc1155UpgradeableApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc1155UpgradeableAbi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155UpgradeableAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchErc1155UpgradeableInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc1155UpgradeableAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155UpgradeableAbi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchErc1155UpgradeableTransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc1155UpgradeableAbi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155UpgradeableAbi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchErc1155UpgradeableTransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc1155UpgradeableAbi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc1155UpgradeableAbi}__ and `eventName` set to `"URI"`
 */
export const useWatchErc1155UpgradeableUriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc1155UpgradeableAbi,
    eventName: 'URI',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc165Abi}__
 */
export const useReadErc165 = /*#__PURE__*/ createUseReadContract({
  abi: erc165Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc165Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadErc165SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: erc165Abi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc165UpgradeableAbi}__
 */
export const useReadErc165Upgradeable = /*#__PURE__*/ createUseReadContract({
  abi: erc165UpgradeableAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc165UpgradeableAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadErc165UpgradeableSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: erc165UpgradeableAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc165UpgradeableAbi}__
 */
export const useWatchErc165UpgradeableEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: erc165UpgradeableAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc165UpgradeableAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchErc165UpgradeableInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc165UpgradeableAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iAccessControlAbi}__
 */
export const useReadIAccessControl = /*#__PURE__*/ createUseReadContract({
  abi: iAccessControlAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iAccessControlAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadIAccessControlGetRoleAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: iAccessControlAbi,
    functionName: 'getRoleAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iAccessControlAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadIAccessControlHasRole = /*#__PURE__*/ createUseReadContract(
  { abi: iAccessControlAbi, functionName: 'hasRole' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iAccessControlAbi}__
 */
export const useWriteIAccessControl = /*#__PURE__*/ createUseWriteContract({
  abi: iAccessControlAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iAccessControlAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteIAccessControlGrantRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: iAccessControlAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iAccessControlAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteIAccessControlRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: iAccessControlAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iAccessControlAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteIAccessControlRevokeRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: iAccessControlAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iAccessControlAbi}__
 */
export const useSimulateIAccessControl =
  /*#__PURE__*/ createUseSimulateContract({ abi: iAccessControlAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iAccessControlAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateIAccessControlGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iAccessControlAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iAccessControlAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateIAccessControlRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iAccessControlAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iAccessControlAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateIAccessControlRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iAccessControlAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iAccessControlAbi}__
 */
export const useWatchIAccessControlEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: iAccessControlAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iAccessControlAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchIAccessControlRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iAccessControlAbi,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iAccessControlAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchIAccessControlRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iAccessControlAbi,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iAccessControlAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchIAccessControlRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iAccessControlAbi,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iAccessControlUpgradeableAbi}__
 */
export const useReadIAccessControlUpgradeable =
  /*#__PURE__*/ createUseReadContract({ abi: iAccessControlUpgradeableAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iAccessControlUpgradeableAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadIAccessControlUpgradeableGetRoleAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: iAccessControlUpgradeableAbi,
    functionName: 'getRoleAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iAccessControlUpgradeableAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadIAccessControlUpgradeableHasRole =
  /*#__PURE__*/ createUseReadContract({
    abi: iAccessControlUpgradeableAbi,
    functionName: 'hasRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iAccessControlUpgradeableAbi}__
 */
export const useWriteIAccessControlUpgradeable =
  /*#__PURE__*/ createUseWriteContract({ abi: iAccessControlUpgradeableAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iAccessControlUpgradeableAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteIAccessControlUpgradeableGrantRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: iAccessControlUpgradeableAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iAccessControlUpgradeableAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteIAccessControlUpgradeableRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: iAccessControlUpgradeableAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iAccessControlUpgradeableAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteIAccessControlUpgradeableRevokeRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: iAccessControlUpgradeableAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iAccessControlUpgradeableAbi}__
 */
export const useSimulateIAccessControlUpgradeable =
  /*#__PURE__*/ createUseSimulateContract({ abi: iAccessControlUpgradeableAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iAccessControlUpgradeableAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateIAccessControlUpgradeableGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iAccessControlUpgradeableAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iAccessControlUpgradeableAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateIAccessControlUpgradeableRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iAccessControlUpgradeableAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iAccessControlUpgradeableAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateIAccessControlUpgradeableRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iAccessControlUpgradeableAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iAccessControlUpgradeableAbi}__
 */
export const useWatchIAccessControlUpgradeableEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iAccessControlUpgradeableAbi,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iAccessControlUpgradeableAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchIAccessControlUpgradeableRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iAccessControlUpgradeableAbi,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iAccessControlUpgradeableAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchIAccessControlUpgradeableRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iAccessControlUpgradeableAbi,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iAccessControlUpgradeableAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchIAccessControlUpgradeableRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iAccessControlUpgradeableAbi,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155Abi}__
 */
export const useReadIerc1155 = /*#__PURE__*/ createUseReadContract({
  abi: ierc1155Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadIerc1155BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: ierc1155Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadIerc1155BalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155Abi,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadIerc1155IsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155Abi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadIerc1155SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155Abi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155Abi}__
 */
export const useWriteIerc1155 = /*#__PURE__*/ createUseWriteContract({
  abi: ierc1155Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteIerc1155SafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteIerc1155SafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteIerc1155SetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155Abi}__
 */
export const useSimulateIerc1155 = /*#__PURE__*/ createUseSimulateContract({
  abi: ierc1155Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateIerc1155SafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155Abi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateIerc1155SafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155Abi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155Abi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateIerc1155SetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155Abi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__
 */
export const useWatchIerc1155Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ierc1155Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchIerc1155ApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155Abi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchIerc1155TransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155Abi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchIerc1155TransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155Abi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155Abi}__ and `eventName` set to `"URI"`
 */
export const useWatchIerc1155UriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155Abi,
    eventName: 'URI',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__
 */
export const useReadIerc1155MetadataUriUpgradeable =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155MetadataUriUpgradeableAbi,
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadIerc1155MetadataUriUpgradeableBalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155MetadataUriUpgradeableAbi,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadIerc1155MetadataUriUpgradeableBalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155MetadataUriUpgradeableAbi,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadIerc1155MetadataUriUpgradeableIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155MetadataUriUpgradeableAbi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadIerc1155MetadataUriUpgradeableSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155MetadataUriUpgradeableAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__ and `functionName` set to `"uri"`
 */
export const useReadIerc1155MetadataUriUpgradeableUri =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155MetadataUriUpgradeableAbi,
    functionName: 'uri',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__
 */
export const useWriteIerc1155MetadataUriUpgradeable =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155MetadataUriUpgradeableAbi,
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteIerc1155MetadataUriUpgradeableSafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155MetadataUriUpgradeableAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteIerc1155MetadataUriUpgradeableSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155MetadataUriUpgradeableAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteIerc1155MetadataUriUpgradeableSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155MetadataUriUpgradeableAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__
 */
export const useSimulateIerc1155MetadataUriUpgradeable =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155MetadataUriUpgradeableAbi,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateIerc1155MetadataUriUpgradeableSafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155MetadataUriUpgradeableAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateIerc1155MetadataUriUpgradeableSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155MetadataUriUpgradeableAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateIerc1155MetadataUriUpgradeableSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155MetadataUriUpgradeableAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__
 */
export const useWatchIerc1155MetadataUriUpgradeableEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155MetadataUriUpgradeableAbi,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchIerc1155MetadataUriUpgradeableApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155MetadataUriUpgradeableAbi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchIerc1155MetadataUriUpgradeableTransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155MetadataUriUpgradeableAbi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchIerc1155MetadataUriUpgradeableTransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155MetadataUriUpgradeableAbi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155MetadataUriUpgradeableAbi}__ and `eventName` set to `"URI"`
 */
export const useWatchIerc1155MetadataUriUpgradeableUriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155MetadataUriUpgradeableAbi,
    eventName: 'URI',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155ReceiverUpgradeableAbi}__
 */
export const useReadIerc1155ReceiverUpgradeable =
  /*#__PURE__*/ createUseReadContract({ abi: ierc1155ReceiverUpgradeableAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155ReceiverUpgradeableAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadIerc1155ReceiverUpgradeableSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155ReceiverUpgradeableAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155ReceiverUpgradeableAbi}__
 */
export const useWriteIerc1155ReceiverUpgradeable =
  /*#__PURE__*/ createUseWriteContract({ abi: ierc1155ReceiverUpgradeableAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155ReceiverUpgradeableAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useWriteIerc1155ReceiverUpgradeableOnErc1155BatchReceived =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155ReceiverUpgradeableAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155ReceiverUpgradeableAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useWriteIerc1155ReceiverUpgradeableOnErc1155Received =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155ReceiverUpgradeableAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155ReceiverUpgradeableAbi}__
 */
export const useSimulateIerc1155ReceiverUpgradeable =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155ReceiverUpgradeableAbi,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155ReceiverUpgradeableAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useSimulateIerc1155ReceiverUpgradeableOnErc1155BatchReceived =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155ReceiverUpgradeableAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155ReceiverUpgradeableAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useSimulateIerc1155ReceiverUpgradeableOnErc1155Received =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155ReceiverUpgradeableAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__
 */
export const useReadIerc1155Upgradeable = /*#__PURE__*/ createUseReadContract({
  abi: ierc1155UpgradeableAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadIerc1155UpgradeableBalanceOf =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155UpgradeableAbi,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadIerc1155UpgradeableBalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155UpgradeableAbi,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadIerc1155UpgradeableIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155UpgradeableAbi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadIerc1155UpgradeableSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155UpgradeableAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__
 */
export const useWriteIerc1155Upgradeable = /*#__PURE__*/ createUseWriteContract(
  { abi: ierc1155UpgradeableAbi },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteIerc1155UpgradeableSafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155UpgradeableAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteIerc1155UpgradeableSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155UpgradeableAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteIerc1155UpgradeableSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155UpgradeableAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__
 */
export const useSimulateIerc1155Upgradeable =
  /*#__PURE__*/ createUseSimulateContract({ abi: ierc1155UpgradeableAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateIerc1155UpgradeableSafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155UpgradeableAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateIerc1155UpgradeableSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155UpgradeableAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateIerc1155UpgradeableSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155UpgradeableAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__
 */
export const useWatchIerc1155UpgradeableEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: ierc1155UpgradeableAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchIerc1155UpgradeableApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155UpgradeableAbi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchIerc1155UpgradeableTransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155UpgradeableAbi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchIerc1155UpgradeableTransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155UpgradeableAbi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc1155UpgradeableAbi}__ and `eventName` set to `"URI"`
 */
export const useWatchIerc1155UpgradeableUriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc1155UpgradeableAbi,
    eventName: 'URI',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc165Abi}__
 */
export const useReadIerc165 = /*#__PURE__*/ createUseReadContract({
  abi: ierc165Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc165Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadIerc165SupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc165Abi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc165UpgradeableAbi}__
 */
export const useReadIerc165Upgradeable = /*#__PURE__*/ createUseReadContract({
  abi: ierc165UpgradeableAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc165UpgradeableAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadIerc165UpgradeableSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc165UpgradeableAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const useReadIerc20 = /*#__PURE__*/ createUseReadContract({
  abi: ierc20Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useReadIerc20Allowance = /*#__PURE__*/ createUseReadContract({
  abi: ierc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadIerc20BalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: ierc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useReadIerc20TotalSupply = /*#__PURE__*/ createUseReadContract({
  abi: ierc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const useWriteIerc20 = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"approve"`
 */
export const useWriteIerc20Approve = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useWriteIerc20Transfer = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useWriteIerc20TransferFrom = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20Abi,
  functionName: 'transferFrom',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20Abi}__
 */
export const useSimulateIerc20 = /*#__PURE__*/ createUseSimulateContract({
  abi: ierc20Abi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"approve"`
 */
export const useSimulateIerc20Approve = /*#__PURE__*/ createUseSimulateContract(
  { abi: ierc20Abi, functionName: 'approve' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useSimulateIerc20Transfer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20Abi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useSimulateIerc20TransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20Abi}__
 */
export const useWatchIerc20Event = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ierc20Abi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useWatchIerc20ApprovalEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc20Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useWatchIerc20TransferEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc20Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20PermitAbi}__
 */
export const useReadIerc20Permit = /*#__PURE__*/ createUseReadContract({
  abi: ierc20PermitAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20PermitAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useReadIerc20PermitDomainSeparator =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20PermitAbi,
    functionName: 'DOMAIN_SEPARATOR',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20PermitAbi}__ and `functionName` set to `"nonces"`
 */
export const useReadIerc20PermitNonces = /*#__PURE__*/ createUseReadContract({
  abi: ierc20PermitAbi,
  functionName: 'nonces',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20PermitAbi}__
 */
export const useWriteIerc20Permit = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20PermitAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20PermitAbi}__ and `functionName` set to `"permit"`
 */
export const useWriteIerc20PermitPermit = /*#__PURE__*/ createUseWriteContract({
  abi: ierc20PermitAbi,
  functionName: 'permit',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20PermitAbi}__
 */
export const useSimulateIerc20Permit = /*#__PURE__*/ createUseSimulateContract({
  abi: ierc20PermitAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20PermitAbi}__ and `functionName` set to `"permit"`
 */
export const useSimulateIerc20PermitPermit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20PermitAbi,
    functionName: 'permit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iRendererAbi}__
 */
export const useReadIRenderer = /*#__PURE__*/ createUseReadContract({
  abi: iRendererAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iRendererAbi}__ and `functionName` set to `"render"`
 */
export const useReadIRendererRender = /*#__PURE__*/ createUseReadContract({
  abi: iRendererAbi,
  functionName: 'render',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iTreasureAbi}__
 */
export const useReadITreasure = /*#__PURE__*/ createUseReadContract({
  abi: iTreasureAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"TREASURE_HUNT_ROLE"`
 */
export const useReadITreasureTreasureHuntRole =
  /*#__PURE__*/ createUseReadContract({
    abi: iTreasureAbi,
    functionName: 'TREASURE_HUNT_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadITreasureBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: iTreasureAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadITreasureBalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: iTreasureAbi,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadITreasureHasRole = /*#__PURE__*/ createUseReadContract({
  abi: iTreasureAbi,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadITreasureIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: iTreasureAbi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadITreasureSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: iTreasureAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"uri"`
 */
export const useReadITreasureUri = /*#__PURE__*/ createUseReadContract({
  abi: iTreasureAbi,
  functionName: 'uri',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTreasureAbi}__
 */
export const useWriteITreasure = /*#__PURE__*/ createUseWriteContract({
  abi: iTreasureAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteITreasureMint = /*#__PURE__*/ createUseWriteContract({
  abi: iTreasureAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteITreasureSafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: iTreasureAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteITreasureSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: iTreasureAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteITreasureSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: iTreasureAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"updateRenderer"`
 */
export const useWriteITreasureUpdateRenderer =
  /*#__PURE__*/ createUseWriteContract({
    abi: iTreasureAbi,
    functionName: 'updateRenderer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTreasureAbi}__
 */
export const useSimulateITreasure = /*#__PURE__*/ createUseSimulateContract({
  abi: iTreasureAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateITreasureMint = /*#__PURE__*/ createUseSimulateContract(
  { abi: iTreasureAbi, functionName: 'mint' },
)

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateITreasureSafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTreasureAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateITreasureSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTreasureAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateITreasureSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTreasureAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iTreasureAbi}__ and `functionName` set to `"updateRenderer"`
 */
export const useSimulateITreasureUpdateRenderer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iTreasureAbi,
    functionName: 'updateRenderer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTreasureAbi}__
 */
export const useWatchITreasureEvent = /*#__PURE__*/ createUseWatchContractEvent(
  { abi: iTreasureAbi },
)

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTreasureAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchITreasureApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTreasureAbi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTreasureAbi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchITreasureTransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTreasureAbi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTreasureAbi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchITreasureTransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTreasureAbi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iTreasureAbi}__ and `eventName` set to `"URI"`
 */
export const useWatchITreasureUriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iTreasureAbi,
    eventName: 'URI',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link initializableAbi}__
 */
export const useWatchInitializableEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: initializableAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link initializableAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchInitializableInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: initializableAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ownableAbi}__
 */
export const useReadOwnable = /*#__PURE__*/ createUseReadContract({
  abi: ownableAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"owner"`
 */
export const useReadOwnableOwner = /*#__PURE__*/ createUseReadContract({
  abi: ownableAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableAbi}__
 */
export const useWriteOwnable = /*#__PURE__*/ createUseWriteContract({
  abi: ownableAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteOwnableRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteOwnableTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableAbi}__
 */
export const useSimulateOwnable = /*#__PURE__*/ createUseSimulateContract({
  abi: ownableAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateOwnableRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateOwnableTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableAbi}__
 */
export const useWatchOwnableEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: ownableAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchOwnableOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ownableAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ownableUpgradeableAbi}__
 */
export const useReadOwnableUpgradeable = /*#__PURE__*/ createUseReadContract({
  abi: ownableUpgradeableAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ownableUpgradeableAbi}__ and `functionName` set to `"owner"`
 */
export const useReadOwnableUpgradeableOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: ownableUpgradeableAbi,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableUpgradeableAbi}__
 */
export const useWriteOwnableUpgradeable = /*#__PURE__*/ createUseWriteContract({
  abi: ownableUpgradeableAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableUpgradeableAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteOwnableUpgradeableRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableUpgradeableAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableUpgradeableAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteOwnableUpgradeableTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableUpgradeableAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableUpgradeableAbi}__
 */
export const useSimulateOwnableUpgradeable =
  /*#__PURE__*/ createUseSimulateContract({ abi: ownableUpgradeableAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableUpgradeableAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateOwnableUpgradeableRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableUpgradeableAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableUpgradeableAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateOwnableUpgradeableTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableUpgradeableAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableUpgradeableAbi}__
 */
export const useWatchOwnableUpgradeableEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: ownableUpgradeableAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableUpgradeableAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchOwnableUpgradeableInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ownableUpgradeableAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableUpgradeableAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchOwnableUpgradeableOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ownableUpgradeableAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureAbi}__
 */
export const useReadTreasure = /*#__PURE__*/ createUseReadContract({
  abi: treasureAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 */
export const useReadTreasureDefaultAdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureAbi,
    functionName: 'DEFAULT_ADMIN_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"TREASURE_HUNT_ROLE"`
 */
export const useReadTreasureTreasureHuntRole =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureAbi,
    functionName: 'TREASURE_HUNT_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useReadTreasureBalanceOf = /*#__PURE__*/ createUseReadContract({
  abi: treasureAbi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"balanceOfBatch"`
 */
export const useReadTreasureBalanceOfBatch =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureAbi,
    functionName: 'balanceOfBatch',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"getRoleAdmin"`
 */
export const useReadTreasureGetRoleAdmin = /*#__PURE__*/ createUseReadContract({
  abi: treasureAbi,
  functionName: 'getRoleAdmin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"hasRole"`
 */
export const useReadTreasureHasRole = /*#__PURE__*/ createUseReadContract({
  abi: treasureAbi,
  functionName: 'hasRole',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"isApprovedForAll"`
 */
export const useReadTreasureIsApprovedForAll =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureAbi,
    functionName: 'isApprovedForAll',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"owner"`
 */
export const useReadTreasureOwner = /*#__PURE__*/ createUseReadContract({
  abi: treasureAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"renderers"`
 */
export const useReadTreasureRenderers = /*#__PURE__*/ createUseReadContract({
  abi: treasureAbi,
  functionName: 'renderers',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useReadTreasureSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"uri"`
 */
export const useReadTreasureUri = /*#__PURE__*/ createUseReadContract({
  abi: treasureAbi,
  functionName: 'uri',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureAbi}__
 */
export const useWriteTreasure = /*#__PURE__*/ createUseWriteContract({
  abi: treasureAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"grantRole"`
 */
export const useWriteTreasureGrantRole = /*#__PURE__*/ createUseWriteContract({
  abi: treasureAbi,
  functionName: 'grantRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"initialize"`
 */
export const useWriteTreasureInitialize = /*#__PURE__*/ createUseWriteContract({
  abi: treasureAbi,
  functionName: 'initialize',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"mint"`
 */
export const useWriteTreasureMint = /*#__PURE__*/ createUseWriteContract({
  abi: treasureAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useWriteTreasureRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: treasureAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useWriteTreasureRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: treasureAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useWriteTreasureRevokeRole = /*#__PURE__*/ createUseWriteContract({
  abi: treasureAbi,
  functionName: 'revokeRole',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useWriteTreasureSafeBatchTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: treasureAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useWriteTreasureSafeTransferFrom =
  /*#__PURE__*/ createUseWriteContract({
    abi: treasureAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useWriteTreasureSetApprovalForAll =
  /*#__PURE__*/ createUseWriteContract({
    abi: treasureAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useWriteTreasureTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: treasureAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"updateRenderer"`
 */
export const useWriteTreasureUpdateRenderer =
  /*#__PURE__*/ createUseWriteContract({
    abi: treasureAbi,
    functionName: 'updateRenderer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureAbi}__
 */
export const useSimulateTreasure = /*#__PURE__*/ createUseSimulateContract({
  abi: treasureAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"grantRole"`
 */
export const useSimulateTreasureGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureAbi,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"initialize"`
 */
export const useSimulateTreasureInitialize =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureAbi,
    functionName: 'initialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"mint"`
 */
export const useSimulateTreasureMint = /*#__PURE__*/ createUseSimulateContract({
  abi: treasureAbi,
  functionName: 'mint',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useSimulateTreasureRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"renounceRole"`
 */
export const useSimulateTreasureRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureAbi,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"revokeRole"`
 */
export const useSimulateTreasureRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureAbi,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"safeBatchTransferFrom"`
 */
export const useSimulateTreasureSafeBatchTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureAbi,
    functionName: 'safeBatchTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"safeTransferFrom"`
 */
export const useSimulateTreasureSafeTransferFrom =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureAbi,
    functionName: 'safeTransferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"setApprovalForAll"`
 */
export const useSimulateTreasureSetApprovalForAll =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureAbi,
    functionName: 'setApprovalForAll',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useSimulateTreasureTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureAbi}__ and `functionName` set to `"updateRenderer"`
 */
export const useSimulateTreasureUpdateRenderer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureAbi,
    functionName: 'updateRenderer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureAbi}__
 */
export const useWatchTreasureEvent = /*#__PURE__*/ createUseWatchContractEvent({
  abi: treasureAbi,
})

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureAbi}__ and `eventName` set to `"ApprovalForAll"`
 */
export const useWatchTreasureApprovalForAllEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureAbi,
    eventName: 'ApprovalForAll',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureAbi}__ and `eventName` set to `"Initialized"`
 */
export const useWatchTreasureInitializedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureAbi,
    eventName: 'Initialized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useWatchTreasureOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureAbi}__ and `eventName` set to `"RoleAdminChanged"`
 */
export const useWatchTreasureRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureAbi,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureAbi}__ and `eventName` set to `"RoleGranted"`
 */
export const useWatchTreasureRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureAbi,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureAbi}__ and `eventName` set to `"RoleRevoked"`
 */
export const useWatchTreasureRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureAbi,
    eventName: 'RoleRevoked',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureAbi}__ and `eventName` set to `"TransferBatch"`
 */
export const useWatchTreasureTransferBatchEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureAbi,
    eventName: 'TransferBatch',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureAbi}__ and `eventName` set to `"TransferSingle"`
 */
export const useWatchTreasureTransferSingleEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureAbi,
    eventName: 'TransferSingle',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureAbi}__ and `eventName` set to `"URI"`
 */
export const useWatchTreasureUriEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureAbi,
    eventName: 'URI',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreator = /*#__PURE__*/ createUseReadContract({
  abi: treasureHuntCreatorAbi,
  address: treasureHuntCreatorAddress,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorDefaultAdminRole =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'DEFAULT_ADMIN_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"GAME_MASTER_ROLE"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorGameMasterRole =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'GAME_MASTER_ROLE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"chapterToPlayers"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorChapterToPlayers =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'chapterToPlayers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"contextCounter"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorContextCounter =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'contextCounter',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"currentChapter"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorCurrentChapter =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'currentChapter',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"gameMasters"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorGameMasters =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'gameMasters',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"getAddressHash"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorGetAddressHash =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'getAddressHash',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"getLeaderboard"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorGetLeaderboard =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'getLeaderboard',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"getQuestsRootCID"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorGetQuestsRootCid =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'getQuestsRootCID',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"getRoleAdmin"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorGetRoleAdmin =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'getRoleAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"hasRole"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorHasRole =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'hasRole',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"keyToPos"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorKeyToPos =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'keyToPos',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"owner"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorOwner =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"playerToCurrentChapter"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorPlayerToCurrentChapter =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'playerToCurrentChapter',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"playerToKeys"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorPlayerToKeys =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'playerToKeys',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"players"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorPlayers =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'players',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"prize"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorPrize =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'prize',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"questsRootCid"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorQuestsRootCid =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'questsRootCid',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"solutions"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorSolutions =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'solutions',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"supportsInterface"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorSupportsInterface =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"totalChapters"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorTotalChapters =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'totalChapters',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"totalKeys"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useReadTreasureHuntCreatorTotalKeys =
  /*#__PURE__*/ createUseReadContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'totalKeys',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWriteTreasureHuntCreator = /*#__PURE__*/ createUseWriteContract(
  { abi: treasureHuntCreatorAbi, address: treasureHuntCreatorAddress },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"addSolution"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWriteTreasureHuntCreatorAddSolution =
  /*#__PURE__*/ createUseWriteContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'addSolution',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"grantRole"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWriteTreasureHuntCreatorGrantRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWriteTreasureHuntCreatorRenounceOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"renounceRole"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWriteTreasureHuntCreatorRenounceRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"revokeRole"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWriteTreasureHuntCreatorRevokeRole =
  /*#__PURE__*/ createUseWriteContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"setup"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWriteTreasureHuntCreatorSetup =
  /*#__PURE__*/ createUseWriteContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'setup',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"submit"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWriteTreasureHuntCreatorSubmit =
  /*#__PURE__*/ createUseWriteContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'submit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"submitKey"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWriteTreasureHuntCreatorSubmitKey =
  /*#__PURE__*/ createUseWriteContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'submitKey',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWriteTreasureHuntCreatorTransferOwnership =
  /*#__PURE__*/ createUseWriteContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useSimulateTreasureHuntCreator =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"addSolution"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useSimulateTreasureHuntCreatorAddSolution =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'addSolution',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"grantRole"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useSimulateTreasureHuntCreatorGrantRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'grantRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"renounceOwnership"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useSimulateTreasureHuntCreatorRenounceOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"renounceRole"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useSimulateTreasureHuntCreatorRenounceRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'renounceRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"revokeRole"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useSimulateTreasureHuntCreatorRevokeRole =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'revokeRole',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"setup"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useSimulateTreasureHuntCreatorSetup =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'setup',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"submit"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useSimulateTreasureHuntCreatorSubmit =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'submit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"submitKey"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useSimulateTreasureHuntCreatorSubmitKey =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'submitKey',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `functionName` set to `"transferOwnership"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useSimulateTreasureHuntCreatorTransferOwnership =
  /*#__PURE__*/ createUseSimulateContract({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureHuntCreatorAbi}__
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWatchTreasureHuntCreatorEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `eventName` set to `"ChapterCompleted"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWatchTreasureHuntCreatorChapterCompletedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    eventName: 'ChapterCompleted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `eventName` set to `"IncrementCounter"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWatchTreasureHuntCreatorIncrementCounterEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    eventName: 'IncrementCounter',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `eventName` set to `"KeyCompleted"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWatchTreasureHuntCreatorKeyCompletedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    eventName: 'KeyCompleted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `eventName` set to `"OwnershipTransferred"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWatchTreasureHuntCreatorOwnershipTransferredEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `eventName` set to `"PrizeMinted"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWatchTreasureHuntCreatorPrizeMintedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    eventName: 'PrizeMinted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `eventName` set to `"RoleAdminChanged"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWatchTreasureHuntCreatorRoleAdminChangedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    eventName: 'RoleAdminChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `eventName` set to `"RoleGranted"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWatchTreasureHuntCreatorRoleGrantedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    eventName: 'RoleGranted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link treasureHuntCreatorAbi}__ and `eventName` set to `"RoleRevoked"`
 *
 * [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0xfF016753393916E420c1E66bDF7A3512F3A42676)
 */
export const useWatchTreasureHuntCreatorRoleRevokedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: treasureHuntCreatorAbi,
    address: treasureHuntCreatorAddress,
    eventName: 'RoleRevoked',
  })
