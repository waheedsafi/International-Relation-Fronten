import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { useEffect, useState } from "react";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { setServerError, validate } from "@/validation/validation";
import { useParams } from "react-router";
import { FileType, INgoRepresentor } from "@/lib/types";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import MultiTabInput from "@/components/custom-ui/input/mult-tab/MultiTabInput";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { Representor } from "@/database/tables";
import { getConfiguration, validateFile } from "@/lib/utils";
import CheckListChooser from "@/components/custom-ui/chooser/CheckListChooser";
import { ChecklistEnum, TaskTypeEnum } from "@/lib/constants";
import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";

export interface EditRepresentorDialogProps {
  onComplete: (representor: Representor) => void;
  representor?: Representor;
  hasEdit?: boolean;
}
export default function EditRepresentorDialog(
  props: EditRepresentorDialogProps
) {
  const { onComplete, representor, hasEdit } = props;
  const [loading, setLoading] = useState(false);
  const [storing, setStoring] = useState(false);
  const [error, setError] = useState(new Map<string, string>());
  let { id } = useParams();

  const [userData, setUserData] = useState<INgoRepresentor | undefined>(
    undefined
  );
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();

  const fetchCheckList = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        `ngo/common-checklist/${ChecklistEnum.ngo_representor_letter}`
      );
      if (response.status === 200) {
        setUserData({
          repre_name_english: "",
          repre_name_farsi: "",
          repre_name_pashto: "",
          letter_of_intro: undefined,
          is_active: true,
          checklist: response.data,
          optional_lang: "english",
        });
      }
    } catch (error: any) {
      console.log(error);
    }
    setLoading(false);
  };
  const fetch = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        `ngo/representor/${representor?.id}`
      );
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error: any) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (representor) fetch();
    else fetchCheckList();
  }, []);

  const addOrUpdate = async () => {
    const url = representor
      ? "ngo/representor/update"
      : "ngo/representor/store";
    try {
      if (storing) return;
      setStoring(true);
      // 1. Validate form
      const passed = await validate(
        [
          {
            name: "repre_name_english",
            rules: ["required", "max:60", "min:3"],
          },
          {
            name: "repre_name_farsi",
            rules: ["required", "max:60", "min:3"],
          },
          {
            name: "repre_name_pashto",
            rules: ["required", "max:60", "min:3"],
          },
          {
            name: "letter_of_intro",
            rules: ["required"],
          },
          {
            name: "is_active",
            rules: ["required"],
          },
        ],
        userData,
        setError
      );
      if (!passed) return;
      // 2. Store
      let formData = new FormData();
      if (id) formData.append("ngo_id", id.toString());
      if (representor?.id) formData.append("id", representor.id.toString());
      formData.append("content", JSON.stringify(userData));

      const response = await axiosClient.post(url, formData);
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.representor);
        modelOnRequestHide();
      }
    } catch (error: any) {
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setStoring(false);
    }
  };

  return (
    <Card className="w-full self-center [backdrop-filter:blur(20px)] bg-card dark:bg-card-secondary">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-3xl-ltr text-tertiary">
          {representor ? t("edit") : t("add")}
        </CardTitle>
      </CardHeader>
      {loading ? (
        <NastranSpinner className=" mx-auto" />
      ) : (
        <CardContent className="flex flex-col mt-10 w-full lg:w-[60%] gap-y-6 pb-12">
          {userData ? (
            <>
              <BorderContainer
                title={t("representative")}
                required={true}
                parentClassName="p-t-4 pb-0 px-0"
                className="grid grid-cols-1 gap-y-3"
              >
                <MultiTabInput
                  optionalKey={"optional_lang"}
                  onTabChanged={(key: string, tabName: string) => {
                    setUserData({
                      ...userData,
                      [key]: tabName,
                      optional_lang: tabName,
                    });
                  }}
                  onChanged={(value: string, name: string) => {
                    setUserData({
                      ...userData,
                      [name]: value,
                    });
                  }}
                  name="repre_name"
                  highlightColor="bg-tertiary"
                  userData={userData}
                  errorData={error}
                  placeholder={t("enter_your_name")}
                  className="rtl:text-xl-rtl rounded-none border-t border-x-0 border-b-0"
                  tabsClassName="gap-x-5 px-3"
                >
                  <SingleTab>english</SingleTab>
                  <SingleTab>farsi</SingleTab>
                  <SingleTab>pashto</SingleTab>
                </MultiTabInput>
              </BorderContainer>
              <BorderContainer
                title={t("letter_of_intro")}
                required={true}
                parentClassName="p-t-4 pb-0 px-0 "
                className="grid grid-cols-1 gap-y-3 px-2"
              >
                <CheckListChooser
                  number={undefined}
                  hasEdit={true}
                  url={`${
                    import.meta.env.VITE_API_BASE_URL
                  }/api/v1/checklist/file/upload`}
                  headers={{
                    "X-API-KEY": import.meta.env.VITE_BACK_END_API_TOKEN,
                    "X-SERVER-ADDR": import.meta.env.VITE_BACK_END_API_IP,
                    Authorization: "Bearer " + getConfiguration()?.token,
                  }}
                  name={t("letter_of_intro")}
                  defaultFile={userData.letter_of_intro as FileType}
                  uploadParam={{
                    checklist_id: ChecklistEnum.ngo_representor_letter,
                    task_type: TaskTypeEnum.ngo_registeration,
                    ngo_id: id,
                  }}
                  onComplete={async (record: any) => {
                    for (const element of record) {
                      const checklist = element[element.length - 1];
                      setUserData({
                        ...userData,
                        letter_of_intro: checklist,
                      });
                    }
                  }}
                  onStart={async (_file: any) => {}}
                  onFailed={async (failed: boolean, response: any) => {
                    if (failed) {
                      if (response) {
                        toast({
                          toastType: "ERROR",
                          description: response.data.message,
                        });
                        setUserData({
                          ...userData,
                          letter_of_intro: undefined,
                        });
                      }
                    }
                  }}
                  validateBeforeUpload={function (file: File): boolean {
                    const maxFileSize = userData.checklist.file_size * 1024;
                    const validTypes: string[] =
                      userData.checklist.acceptable_mimes.split(",");
                    const resultFile = validateFile(
                      file,
                      Math.round(maxFileSize),
                      validTypes,
                      t
                    );
                    return resultFile ? true : false;
                  }}
                />
                {error.get("letter_of_intro") && (
                  <h1 className="rtl:text-md-rtl ltr:text-sm-ltr px-2 capitalize text-start text-red-400">
                    {error.get("letter_of_intro")}
                  </h1>
                )}
              </BorderContainer>
              {representor && (
                <CustomCheckbox
                  checked={userData.is_active}
                  onCheckedChange={(value: boolean) =>
                    setUserData({ ...userData, is_active: value })
                  }
                  parentClassName="rounded-md py-[12px] gap-x-1 bg-card border px-[10px]"
                  text={t("active")}
                  errorMessage={error.get("is_active")}
                />
              )}
            </>
          ) : (
            <NastranSpinner />
          )}
        </CardContent>
      )}
      <CardFooter className="flex justify-between">
        <Button
          className="rtl:text-xl-rtl ltr:text-lg-ltr"
          variant="outline"
          onClick={modelOnRequestHide}
        >
          {t("cancel")}
        </Button>
        {hasEdit && (
          <PrimaryButton
            disabled={storing || loading}
            onClick={addOrUpdate}
            className={`${storing && "opacity-90"}`}
            type="submit"
          >
            <ButtonSpinner loading={storing}>{t("save")}</ButtonSpinner>
          </PrimaryButton>
        )}
      </CardFooter>
    </Card>
  );
}
