import { useMemo, useState, type FormEvent } from "react";
import { ArticleEditor } from "@features/editor";

const htmlToMarkdown = (html: string): string =>
  html
    .replace(/<h1>(.*?)<\/h1>/gi, "# $1\n\n")
    .replace(/<h2>(.*?)<\/h2>/gi, "## $1\n\n")
    .replace(/<h3>(.*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<p>(.*?)<\/p>/gi, "$1\n\n")
    .replace(/<li>(.*?)<\/li>/gi, "- $1\n")
    .replace(/<ol>|<\/ol>|<ul>|<\/ul>/gi, "")
    .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<em>(.*?)<\/em>/gi, "*$1*")
    .replace(/<code>(.*?)<\/code>/gi, "`$1`")
    .replace(/<[^>]+>/g, "")
    .trim();

export const WriteArticleForm = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [series, setSeries] = useState("");
  const [seriesOrder, setSeriesOrder] = useState("");
  const [editorHtml, setEditorHtml] = useState("");
  const [result, setResult] = useState("");
  const [saving, setSaving] = useState(false);

  const tags = useMemo(
    () =>
      tagsText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [tagsText],
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title || !date || !category) {
      setResult("실패: title/date/category 는 필수입니다.");
      return;
    }
    if (tags.length < 1) {
      setResult("실패: tags 는 최소 1개 필요합니다.");
      return;
    }
    if (tags.length > 5) {
      setResult("실패: tags 는 최대 5개까지 가능합니다.");
      return;
    }
    const markdown = htmlToMarkdown(editorHtml);
    if (!markdown) {
      setResult("실패: 본문을 입력하세요.");
      return;
    }

    setSaving(true);
    setResult("");
    try {
      const response = await fetch("/api/articles/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          date,
          tags,
          category,
          description,
          series: series || undefined,
          seriesOrder: seriesOrder ? Number(seriesOrder) : undefined,
          content: markdown,
        }),
      });

      const data = await response.json();
      setResult(response.ok ? `저장 완료: ${data.slug}` : `실패: ${data.error}`);
    } catch (error) {
      setResult(`실패: ${error instanceof Error ? error.message : "unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="write-form" onSubmit={onSubmit}>
      <input value={title} onChange={(event) => setTitle(event.target.value)} name="title" placeholder="title" required />
      <input value={date} onChange={(event) => setDate(event.target.value)} name="date" type="date" required />
      <input value={tagsText} onChange={(event) => setTagsText(event.target.value)} name="tags" placeholder="tag1,tag2" required />
      <input value={category} onChange={(event) => setCategory(event.target.value)} name="category" placeholder="tech" required />
      <input value={description} onChange={(event) => setDescription(event.target.value)} name="description" placeholder="description" />
      <input value={series} onChange={(event) => setSeries(event.target.value)} name="series" placeholder="series(optional)" />
      <input value={seriesOrder} onChange={(event) => setSeriesOrder(event.target.value)} name="seriesOrder" type="number" placeholder="series order(optional)" />
      <ArticleEditor value={editorHtml} onChange={setEditorHtml} placeholder="Write markdown content" />
      <button type="submit" disabled={saving}>
        {saving ? "저장 중..." : "등록"}
      </button>
      <p>{result}</p>
    </form>
  );
};
