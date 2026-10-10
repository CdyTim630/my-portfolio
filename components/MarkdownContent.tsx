import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * One rendering policy for published writing and editor previews.
 * Do not add rehype-raw or override the default URL transform: raw HTML must
 * remain escaped text and executable URL schemes must remain disallowed.
 */
export default function MarkdownContent({ children }: { children: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>;
}
