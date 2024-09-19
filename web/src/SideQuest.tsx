import { Heading, Link, Text, VStack } from "@chakra-ui/react";
import Puzzle from "./Puzzle";
import { useSideQuest } from "./hooks/useSideQuest";
import { checkKeyMatch } from "./lib";

function SideQuest() {
  const { currentSmartContractSideQuestIndex } = useSideQuest();

  return (
    <Puzzle
      index={currentSmartContractSideQuestIndex}
      setPasswordAtIndex={() => {}}
      submitFunctionName="submitKey"
      solutionMatcher={(solution: string) => checkKeyMatch(solution)}
    >
      <VStack className="content-pane" align="flex-start">
        <Heading variant="h2">
          You solved {currentSmartContractSideQuestIndex} side quests so far.
        </Heading>
        <Text>
          Did you find a side quest? Submit the password with this form to add
          it to your score in the leaderboard. More info in the{" "}
          <Link href="/#faq">FAQs</Link>.
        </Text>
      </VStack>
    </Puzzle>
  );
}

export default SideQuest;
