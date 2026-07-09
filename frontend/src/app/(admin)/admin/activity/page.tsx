"use client";

import { useEffect, useState } from "react";
import { apiClient, getErrorMessage } from "@/lib/api/client";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/admin/activity?limit=50");
      setLogs(data.logs);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Activity Logs</h1>
      
      <div className="overflow-x-auto rounded-card border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm text-text-secondary">
          <thead className="bg-surface text-text-primary">
            <tr>
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">Actor</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Target</th>
              <th className="px-4 py-3 font-medium">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-elevated/50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-medium text-text-primary">
                  {log.actor?.name || log.actor}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="default">{log.action}</Badge>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs uppercase font-semibold">{log.targetModel}</span>
                  <br />
                  <span className="text-text-muted font-mono">{log.targetId}</span>
                </td>
                <td className="px-4 py-3 text-text-muted font-mono">
                  {log.ipAddress}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                  No activity logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
