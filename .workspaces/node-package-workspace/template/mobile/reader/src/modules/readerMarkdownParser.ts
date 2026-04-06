export type ReaderBranchOption = {
  label: string;
  targetId: string;
};

export type ReaderBranch = {
  prompt: string;
  options: ReaderBranchOption[];
  cursor: number;
};

export type ReaderHeaderAnchor = {
  id: string;
  title: string;
  cursor: number;
};

export type ParsedReaderDocument = {
  renderText: string;
  branches: ReaderBranch[];
  headers: ReaderHeaderAnchor[];
};

const HEADER_PATTERN = /^(#{1,6})\s+(.*?)(?:\s+>([A-Za-z0-9_-]+))?\s*$/;
const BRANCH_PATTERN = /^if>\s*(.+)$/;

const normalizeRenderableLine = (line: string): { text: string; headerId?: string; title?: string } => {
  const headerMatch = line.match(HEADER_PATTERN);
  if (headerMatch) {
    return {
      text: headerMatch[2].trim(),
      headerId: headerMatch[3],
      title: headerMatch[2].trim()
    };
  }

  return {
    text: line
      .replace(/^-\s+/g, '• ')
      .replace(/^\d+\.\s+/g, '')
  };
};

const parseBranchLine = (line: string): ReaderBranch | null => {
  const branchMatch = line.match(BRANCH_PATTERN);
  if (!branchMatch) {
    return null;
  }

  const parts = branchMatch[1]
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean);

  const prompt = parts[0] ?? '';
  const options = parts.slice(1).flatMap((item) => {
    const match = item.match(/^([^>]+)>([A-Za-z0-9_-]+)$/);
    if (!match) {
      return [];
    }

    return [
      {
        label: match[1].trim(),
        targetId: match[2].trim()
      }
    ];
  });

  if (!prompt || options.length === 0) {
    return null;
  }

  return {
    prompt,
    options,
    cursor: 0
  };
};

export const parseReaderMarkdown = (content: string): ParsedReaderDocument => {
  const lines = content.split('\n');
  const renderLines: string[] = [];
  const branches: ReaderBranch[] = [];
  const headers: ReaderHeaderAnchor[] = [];
  let cursor = 0;

  lines.forEach((line) => {
    const branch = parseBranchLine(line);
    if (branch) {
      branches.push({
        ...branch,
        cursor
      });
      return;
    }

    const normalized = normalizeRenderableLine(line);
    if (normalized.headerId) {
      headers.push({
        id: normalized.headerId,
        title: normalized.title ?? normalized.text,
        cursor
      });
    }

    renderLines.push(normalized.text);
    cursor += normalized.text.length + 1;
  });

  return {
    renderText: renderLines.join('\n').trimEnd(),
    branches,
    headers
  };
};

export const findBranchForCursor = (
  document: ParsedReaderDocument,
  startIndex: number,
  cursor: number
): ReaderBranch | null => {
  return (
    document.branches.find((branch) => branch.cursor >= startIndex && branch.cursor <= cursor) ?? null
  );
};

export const findHeaderCursor = (
  document: ParsedReaderDocument,
  targetId: string
): number | null => {
  return document.headers.find((header) => header.id === targetId)?.cursor ?? null;
};
