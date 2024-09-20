import { Heading, VStack } from "@chakra-ui/react";
import { useChapter } from "./hooks/useChapter";
import Markdown from "react-markdown";
import Puzzle from "./Puzzle";
import { checkSolutionMatch } from "./lib";

function Quest() {
  const {
    currentSmartContractChapterIndex,
    currentChapterContent,
    setChapterPassword,
  } = useChapter();

  return (
    <Puzzle
      index={currentSmartContractChapterIndex}
      setPasswordAtIndex={setChapterPassword}
      submitFunctionName="submit"
      solutionMatcher={(solution: string) =>
        checkSolutionMatch(solution, currentSmartContractChapterIndex)
      }
    >
      <VStack align="flex-start">
        <Heading variant="h2">
          Chapter {currentSmartContractChapterIndex}
        </Heading>
        <Markdown>{currentChapterContent}</Markdown>
      </VStack>
    </Puzzle>
  );
}

export default Quest;
