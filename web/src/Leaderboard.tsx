import {
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { ENSName } from "ethereum-ens-name";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import {
  treasureHuntCreatorAbi as abi,
  treasureHuntCreatorAddress as contractAddress,
} from "./generated";
import metadata from "./metadata.json";
import { CHAIN_ID } from "./env";

type LeaderBoardEntry = {
  address: `0x${string}`;
  keys: boolean[];
  chapter: number;
};

function Leaderboard() {
  const [page, setPage] = useState(BigInt(0));
  const [pages, setPages] = useState<LeaderBoardEntry[][]>([]);
  const keys = metadata.keys;

  const { status, data } = useReadContract({
    abi,
    address: contractAddress[CHAIN_ID as keyof typeof contractAddress],
    functionName: "getLeaderboard",
    args: [page],
  });

  function b(n: number) {
    return BigInt(2) ** BigInt(n) - BigInt(1);
  }

  useEffect(() => {
    console.log(data);
    console.log(status);
    if (data) {
      const bitmaps = data as unknown as bigint[];
      const pageContent: LeaderBoardEntry[] = [];
      for (let i = 0; i < bitmaps.length; i++) {
        const bitmap = bitmaps[i];
        const chapter = Number(bitmap & b(8));
        const keysString = ((bitmap >> BigInt(8)) & b(80))
          .toString(2)
          .padEnd(keys.length, "0")
          .split("")
          .map((k) => Number(k) === 1);
        const addressInt = bitmap >> BigInt(96);

        if (addressInt === BigInt(0)) {
          break;
        }

        const address = ("0x" +
          addressInt.toString(16).padStart(40, "0")) as `0x${string}`;

        pageContent.push({ chapter, keys: keysString, address });
      }

      if (pageContent.length > 0) {
        if (pages.length > page) {
          pages[Number(page)] = pageContent;
          setPages(pages);
        } else {
          setPages(pages.concat([pageContent]));
        }

        if (pageContent.length === 32) {
          setPage(page + BigInt(1));
        }
      }
    }
  }, [data]);

  function sortedLeaderboard() {
    return pages.flat().sort((x, y) => y.chapter - x.chapter);
  }

  function shortenAddress(address: string | undefined) {
    return `${address?.slice(0, 6)}..${address?.slice(address?.length - 3, address?.length)}`;
  }

  return (
    <VStack alignItems="flex-start">
      <Heading>Leaderboard</Heading>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Address</Th>
              <Th>Chapter</Th>
              <Th>Keys</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedLeaderboard().map((entry: LeaderBoardEntry) => {
              return (
                <Tr>
                  <Td>
                    <ENSName
                      customDisplay={shortenAddress}
                      address={entry.address}
                    />
                  </Td>
                  <Td isNumeric>{entry.chapter}</Td>
                  <Td>
                    {entry.keys
                      .map((k, i) => (k ? keys[i].emoji : "?"))
                      .join(",")}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      {status === "pending" && <Spinner />}
    </VStack>
  );
}

export default Leaderboard;
