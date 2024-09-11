import { useWindowSize } from "@uidotdev/usehooks";

export default function useIsMobile() {
  const size = useWindowSize();

  return size.width! / size.height! < 1;
}
