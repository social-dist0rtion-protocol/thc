import { Box, Heading, VStack } from "@chakra-ui/react";
import { useChapter } from "./hooks/useChapter";
import Markdown from "react-markdown";
import Puzzle from "./Puzzle";
import rehypeRaw from "rehype-raw";
import { checkSolutionMatch } from "./lib";
import CenteredSpinner from "./CenteredSpinner";
import "./markdown.css";

function Quest() {
  const {
    currentSmartContractChapterIndex,
    currentChapterContent,
    setChapterPassword,
    isLast,
  } = useChapter();

  const isLoading =
    currentSmartContractChapterIndex === undefined ||
    currentChapterContent.length === 0;

  return (
    <Puzzle
      isLast={isLast}
      index={currentSmartContractChapterIndex}
      setPasswordAtIndex={setChapterPassword}
      submitFunctionName="submit"
      solutionMatcher={(solution: string) =>
        checkSolutionMatch(solution, currentSmartContractChapterIndex)
      }
    >
      {isLoading ? (
        <CenteredSpinner />
      ) : (
        <VStack align="flex-start">
          <Heading variant="h3">
            Chapter {currentSmartContractChapterIndex}
          </Heading>
          <Box as="article" fontSize="md" lineHeight="tall" color="gray.700">
            <div className="markdown">
              <Markdown
                urlTransform={(value: string) => value}
                rehypePlugins={[rehypeRaw]}
              >
                {currentChapterContent}
              </Markdown>
            </div>
          </Box>
        </VStack>
      )}
    </Puzzle>
  );
}

export default Quest;
