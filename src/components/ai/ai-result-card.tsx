import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AiResult = {
  content: string;
  citations?: unknown;
  created_at?: string;
};

export function AiResultCard({ result }: { result: AiResult | null }) {
  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest result</CardTitle>
          <CardDescription>Submit a request to create an audited Solco Intelligence draft.</CardDescription>
        </CardHeader>
        <p className="text-sm text-muted-foreground">Generated content will appear here for review. Nothing is published automatically.</p>
      </Card>
    );
  }

  const citations = Array.isArray(result.citations) ? result.citations : [];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest result</CardTitle>
        <CardDescription>Review before using this output in teaching, enterprise decisions, assessment, certificates, or child learning.</CardDescription>
      </CardHeader>
      <div className="whitespace-pre-wrap rounded-md border border-border bg-muted p-4 text-sm leading-6">{result.content}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>Human review required</Badge>
        {citations.length ? <Badge>{citations.length} citation references</Badge> : <Badge>No authorized context cited</Badge>}
      </div>
    </Card>
  );
}
