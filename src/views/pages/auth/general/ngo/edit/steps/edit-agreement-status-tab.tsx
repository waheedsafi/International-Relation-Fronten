import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { RefreshCcw } from "lucide-react";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import { useParams } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { NgoStatus } from "@/database/tables";
import { toLocaleDate } from "@/lib/utils";
import { useGlobalState } from "@/context/GlobalStateContext";
import BooleanStatusButton from "@/components/custom-ui/button/BooleanStatusButton";
import { StatusEnum } from "@/lib/constants";

export default function EditAgreementStatusTab() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ngoStatuses, setNgoStatuses] = useState<NgoStatus[]>([]);
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 2. Send data
      const response = await axiosClient.get(`statuses/agreements/${id}`);
      if (response.status === 200) {
        const fetch = response.data.statuses as NgoStatus[];
        setNgoStatuses(fetch);
        if (failed) setFailed(false);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: "Error!",
        description: error.response.data.message,
      });
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    initialize();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("status")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-x-4 gap-y-6 w-full xl:w-1/">
        {failed ? (
          <h1 className="rtl:text-2xl-rtl">{t("u_are_not_authzed!")}</h1>
        ) : (
          <Table className="w-full border">
            <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-start">{t("id")}</TableHead>
                <TableHead className="text-start">{t("name")}</TableHead>
                <TableHead className="text-start">{t("status")}</TableHead>
                <TableHead className="text-start">{t("saved_by")}</TableHead>
                <TableHead className="text-start">{t("comment")}</TableHead>
                <TableHead className="text-start">{t("date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="rtl:text-xl-rtl ltr:text-lg-ltr">
              {loading ? (
                <>
                  <TableRow>
                    <TableCell>
                      <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
                    </TableCell>
                    <TableCell>
                      <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
                    </TableCell>
                    <TableCell>
                      <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
                    </TableCell>
                    <TableCell>
                      <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
                    </TableCell>
                    <TableCell>
                      <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
                    </TableCell>
                    <TableCell>
                      <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                ngoStatuses.map((ngoStatus: NgoStatus, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <BooleanStatusButton
                        getColor={function (): {
                          style: string;
                          value?: string;
                        } {
                          return StatusEnum.registered ===
                            ngoStatus.status_type_id
                            ? {
                                style: "border-green-500/90",
                                value: ngoStatus.name,
                              }
                            : StatusEnum.blocked == ngoStatus.status_type_id
                            ? {
                                style: "border-red-500",
                                value: ngoStatus.name,
                              }
                            : StatusEnum.registration_incomplete ==
                              ngoStatus.status_type_id
                            ? {
                                style: "border-blue-500/90",
                                value: ngoStatus.name,
                              }
                            : {
                                style: "border-orange-500",
                                value: ngoStatus.name,
                              };
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <BooleanStatusButton
                        getColor={function (): {
                          style: string;
                          value?: string;
                        } {
                          return ngoStatus.is_active === 1
                            ? {
                                style: "border-green-500/90",
                                value: t("currently"),
                              }
                            : {
                                style: "border-red-500",
                                value: t("formerly"),
                              };
                        }}
                      />
                    </TableCell>
                    <TableCell className="truncate max-w-44">
                      {ngoStatus.userable_type}
                    </TableCell>
                    <TableCell className="truncate max-w-44">
                      {ngoStatus.comment}
                    </TableCell>
                    <TableCell className="truncate">
                      {toLocaleDate(new Date(ngoStatus.created_at), state)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {failed && (
        <CardFooter>
          <PrimaryButton
            disabled={loading}
            onClick={async () => await initialize()}
            className={`${
              loading && "opacity-90"
            } bg-red-500 hover:bg-red-500/70`}
            type="submit"
          >
            <ButtonSpinner loading={loading}>
              {t("failed_retry")}
              <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
            </ButtonSpinner>
          </PrimaryButton>
        </CardFooter>
      )}
    </Card>
  );
}
