import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import DonorHeader from "./donor-header";
import { DonorTable } from "./donor-table";
export default function DonorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleGoHome = () => navigate("/dashboard", { replace: true });
  return (
    <div className="px-2 pt-2 pb-12 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t("donor")}</BreadcrumbItem>
      </Breadcrumb>
      <DonorHeader />
      <DonorTable />
    </div>
  );
}
