"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Flag, MoreHorizontal, Trash2, Loader2, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteReportAction } from "@/app/actions/admin";
import { fetchReportsAction } from "@/app/actions/reports";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link"; // Import Link for navigation

export default function AdminReportsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [reports, setReports] = useState<any[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  // Initial fetch on component mount
  useEffect(() => {
    startTransition(async () => {
      const fetchedReports = await fetchReportsAction();
      setReports(fetchedReports);
    });
  }, []); // Empty dependency array means run once on mount

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING": return "secondary";
      case "RESOLVED": return "default";
      case "DISMISSED": return "destructive";
      default: return "secondary";
    }
  };

  const handleDeleteReport = async () => {
    if (!selectedReport) return;
    const result = await deleteReportAction(selectedReport.id);
    if (result.success) {
      toast({ title: "Başarılı", description: result.message });
      setOpenDeleteDialog(false);
      startTransition(async () => { // Re-fetch reports to update table
        const fetchedReports = await fetchReportsAction();
        setReports(fetchedReports);
      });
    } else {
      toast({ title: "Hata", description: result.message, variant: "destructive" });
    }
  };


  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Kullanıcı Şikayetleri Yönetimi</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Sistemdeki Şikayetler ({reports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Flag className="h-12 w-12 mb-4 opacity-20" />
              <p>Henüz sistemde kayıtlı şikayet bulunmamaktadır.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Şikayet Eden</TableHead>
                    <TableHead>Şikayet Edilen</TableHead>
                    <TableHead>İlan</TableHead>
                    <TableHead>Sebep</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Aksiyonlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => {
                    const reportedListing = report.product || report.jobPosting;
                    const listingType = report.product ? "prod" : (report.jobPosting ? "job" : "");
                    const listingId = report.productId || report.jobPostingId;

                    return (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium">
                                        {report.reporter?.name || report.reporter?.email || "Bilinmiyor"}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {report.reported?.name || report.reported?.email || "Bilinmiyor"}
                                    </TableCell>
                                    <TableCell>
                                        {reportedListing ? (
                                            <Link href={`/ilan/${listingType}-${listingId}`} className="text-blue-600 hover:underline flex items-center gap-1">
                                                <Eye className="h-4 w-4" /> {reportedListing.title}
                                            </Link>
                                        ) : (
                                            "N/A"
                                        )}
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">{report.reason}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(report.status)} className="capitalize">
                                            {report.status === "PENDING" ? "Beklemede" : report.status === "RESOLVED" ? "Çözüldü" : "Reddedildi"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{format(report.createdAt, "dd MMM yyyy HH:mm", { locale: tr })}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Aç</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {reportedListing && (
                                                    <DropdownMenuItem onClick={() => router.push(`/ilan/${listingType}-${listingId}`)}>
                                                        <ExternalLink className="mr-2 h-4 w-4" /> İlana Git
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => { setSelectedReport(report); setOpenDeleteDialog(true); }}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Sil
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Report Dialog */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Şikayeti Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu şikayeti kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReport} className="bg-red-600 hover:bg-red-700 text-white">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Şikayeti Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}