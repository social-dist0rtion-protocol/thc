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
import { LeaderboardEntry, processLeaderboard } from "./lib";

const EMOJIS = metadata.keys.map((k) => k.emoji);

function LeaderboardComponent() {
  const [nextPage, setNextPage] = useState(0);
  const [leaderboardEntries, setLeaderboardEntries] = useState<
    LeaderboardEntry[]
  >([]);
  const { status, data } = useReadContract({
    abi,
    address: contractAddress[CHAIN_ID as keyof typeof contractAddress],
    functionName: "getLeaderboard",
    args: [BigInt(nextPage)],
  });

  useEffect(() => {
    if (data) {
      const r = processLeaderboard(
        data as any,
        nextPage,
        leaderboardEntries,
        EMOJIS.length,
        EMOJIS
      );

      setLeaderboardEntries(r.leaderboard);
      if (r.nextPage !== null) {
        setNextPage(r.nextPage);
      }
    }
  }, [data]);

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
              <Th>Side Quests</Th>
            </Tr>
          </Thead>
          <Tbody>
            {leaderboardEntries.map((entry: LeaderboardEntry) => {
              return (
                <Tr key={entry.account}>
                  <Td>
                    <ENSName
                      customDisplay={shortenAddress}
                      address={entry.account}
                    />
                  </Td>
                  <Td isNumeric>{entry.chapter}</Td>
                  <Td>{entry.keys.map((k) => k ?? "?").join(",")}</Td>
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

export default LeaderboardComponent;
