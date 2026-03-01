import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTarget, getTargets } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default function TargetsPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [description, setDescription] = useState("");

  const { data: targets = [] } = useQuery({
    queryKey: ["targets"],
    queryFn: getTargets,
    refetchInterval: 10000,
  });

  const registerMutation = useMutation({
    mutationFn: createTarget,
    onSuccess: () => {
      toast.success("Target registered");
      setName("");
      setBaseUrl("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["targets"] });
    },
    onError: (error) => {
      toast.error("Target registration failed", { description: String(error) });
    },
  });

  const submit = () => {
    if (!name.trim() || !baseUrl.trim()) {
      toast.error("Name and URL are required");
      return;
    }
    registerMutation.mutate({
      name: name.trim(),
      baseUrl: baseUrl.trim(),
      description: description.trim() || undefined,
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1.4fr]">
      <Card>
        <CardHeader>
          <CardDescription>Onboarding</CardDescription>
          <CardTitle className="text-2xl">Register Service Target</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-text-muted">
            Add production-like endpoints here, then bind attacks to these targets during operation execution.
          </p>

          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Service Name</p>
            <Input placeholder="Payments API" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Base URL</p>
            <Input placeholder="https://api.example.com" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
          </div>

          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.08em] text-text-muted">Description</p>
            <Input placeholder="Critical payment path" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <Button onClick={submit} disabled={registerMutation.isPending} className="w-full">
            Register Target
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Registry</CardDescription>
          <CardTitle>Known Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {targets.map((target) => (
                <TableRow key={target.id}>
                  <TableCell className="font-semibold text-text-primary">{target.name}</TableCell>
                  <TableCell className="font-mono text-xs text-warning">{target.baseUrl}</TableCell>
                  <TableCell className="text-text-muted">{target.description || "-"}</TableCell>
                  <TableCell className="text-text-muted">{formatDate(target.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
