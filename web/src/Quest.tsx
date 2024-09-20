import { Heading, VStack } from "@chakra-ui/react";
import { useChapter } from "./hooks/useChapter";
import Markdown from "react-markdown";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import Puzzle from "./Puzzle";
import rehypeRaw from "rehype-raw";
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
        <Markdown
          components={ChakraUIRenderer()}
          urlTransform={(value: string) => value}
          rehypePlugins={[rehypeRaw]}
        >
          {currentChapterContent}
        </Markdown>
      </VStack>
    </Puzzle>
  );
}

export default Quest;
