import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTarget, getTargets } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      {/* Register New Target */}
      <section className="p-8 bg-card border border-white/5 rounded-lg">
        <h2 className="text-xs font-mono text-primary tracking-widest mb-2 uppercase">Add New Target</h2>
        <p className="text-text-muted text-xs mb-6">
          Register endpoints here to link them with attacks. These become available in the attack configuration.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-primary mb-2">Service Name</label>
            <Input placeholder="e.g. Payment API" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-primary mb-2">Base URL</label>
            <Input placeholder="https://api.example.com" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-primary mb-2">Description (Optional)</label>
            <Input placeholder="e.g. Critical payment processing service" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <Button onClick={submit} disabled={registerMutation.isPending} className="w-full">
            Register Target
          </Button>
        </div>
      </section>

      {/* Targets List */}
      <section className="p-8 bg-card border border-white/5 rounded-lg">
        <h2 className="text-xs font-mono text-primary tracking-widest mb-6 uppercase">Registered Targets</h2>

        {targets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-muted">No targets registered yet</p>
            <p className="text-xs text-text-muted mt-2">Add your first target above to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {targets.map((target) => (
              <div key={target.id} className="p-4 bg-bg rounded border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-lg text-text-primary">{target.name}</p>
                    <p className="font-mono text-sm text-warning mt-1">{target.baseUrl}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-text-muted pt-3 border-t border-white/5">
                  {target.description && (
                    <div>
                      <p className="text-xs text-text-muted uppercase">Description</p>
                      <p className="text-text-primary">{target.description}</p>
                    </div>
                  )}
                  <p className="text-xs">Registered {formatDate(target.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
