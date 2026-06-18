import type { StreamingProvider } from "./types";

export const STREAMING_PROVIDERS: {
  id: StreamingProvider;
  label: string;
  description: string;
}[] = [
  {
    id: "vidfast",
    label: "VidFast",
    description: "Multi-domain embed player",
  },
  {
    id: "vidrock",
    label: "VidRock",
    description: "Alternative embed network",
  },
  {
    id: "vidsrc",
    label: "VidSrc",
    description: "Wide catalog embed source",
  },
];

export function getProviderLabel(id: StreamingProvider): string {
  return STREAMING_PROVIDERS.find((p) => p.id === id)?.label ?? id;
}
