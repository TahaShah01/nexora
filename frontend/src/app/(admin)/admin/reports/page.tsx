"use client";

import { useEffect, useState } from "react";
import { getReports, updateReportStatus } from "@/lib/api/admin.api";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    try {
      const data = await getReports(1, 100);
      setReports(data.reports);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, status: "resolved" | "dismissed") {
    const notes = prompt("Add admin notes (optional):");
    try {
      await updateReportStatus(id, status, notes || undefined);
      fetchReports();
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Reports Moderation</h1>
      
      <div className="overflow-x-auto rounded-card border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm text-text-secondary">
          <thead className="bg-surface text-text-primary">
            <tr>
              <th className="px-4 py-3 font-medium">Reporter</th>
              <th className="px-4 py-3 font-medium">Target</th>
              <th className="px-4 py-3 font-medium">Reason</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reports.map((report) => (
              <tr key={report._id} className="hover:bg-elevated/50 transition-colors">
                <td className="px-4 py-3 font-medium text-text-primary">{report.reporter?.name}</td>
                <td className="px-4 py-3">
                  <span className="uppercase text-xs font-semibold">{report.targetType}</span>
                  <br />
                  <span className="text-text-muted font-mono">{report.targetId}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="warning">{report.reason}</Badge>
                  <p className="mt-1 text-xs">{report.description}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={report.status === "pending" ? "warning" : report.status === "resolved" ? "success" : "default"}>
                    {report.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  {report.status === "pending" && (
                    <>
                      <Button variant="primary" size="sm" onClick={() => handleStatusChange(report._id, "resolved")}>
                        Resolve
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleStatusChange(report._id, "dismissed")}>
                        Dismiss
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
