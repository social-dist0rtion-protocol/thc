# gen scripts
## ipfs uplaod
Run:
`make ipfs_file FILE_PATH=/example/dir/file.md`
to upload the file to ipfs.
Output:
`https://ipfs.io/ipfs/QmVGhQq26u4rapjzpbqVHh2F7jzRvMHJd81MjgJ8rMBqkj`
## deploy game
It uses a config file to deploy a game to an ethereum contract. Run:
`make game CONFIG_FILE=test_config.json ETH_MIGRATIONS_DIR=../eth/migrations`
The config file should have the format
```
[
   {
      "solution": "0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413",
      "quest": "https://ipfs.io/ipfs/QmVGhQq26u4rapjzpbqVHh2F7jzRvMHJd81MjgJ8rMBqkj" 
   },
   ...
]
```

