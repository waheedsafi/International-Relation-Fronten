import CheckListChooser from "@/components/custom-ui/chooser/CheckListChooser";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { toast } from "@/components/ui/use-toast";
import { CheckList } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { CountryEnum, TaskTypeEnum } from "@/lib/constants";
import { getConfiguration, validateFile } from "@/lib/utils";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

interface CheckListTabProps {
  onSaveClose: (
    userData: any,
    currentStep: number,
    onlySave: boolean
  ) => Promise<void>;
  type: "extend" | "register";
}

export default function ProjectCheckListTab(props: CheckListTabProps) {
  const { onSaveClose, type } = props;
  const { t } = useTranslation();
  let { id } = useParams();
  const { userData, setUserData } = useContext(StepperContext);
  const [list, setList] = useState<CheckList[] | undefined>(undefined);
  const loadInformation = async () => {
    try {
      let url = "";
      let ex = {};
      if (type == "extend") {
        url =
          userData.prev_dire.country_id == CountryEnum.afghanistan
            ? "ngo/extend/checklist"
            : "ngo/extend/abroad/director-checklist";
        ex = {
          n_dir: userData.new_director,
          n_r: userData.new_represent,
        };
      } else {
        url = "checklists/project-registeration";
      }
      const response = await axiosClient.get(url, { params: ex });
      if (response.status == 200) {
        setList(response.data.checklist);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response?.data?.message,
      });
      console.log(error);
    }
  };
  useEffect(() => {
    loadInformation();
  }, []);

  return (
    <div className="flex flex-col gap-y-6 pb-12">
      {list ? (
        list.map((checklist: CheckList, index: number) => {
          return (
            <CheckListChooser
              hasEdit={true}
              number={`${index + 1}`}
              key={checklist.id}
              url={`${
                import.meta.env.VITE_API_BASE_URL
              }/api/v1/checklist/file/upload`}
              headers={{
                "X-API-KEY": import.meta.env.VITE_BACK_END_API_TOKEN,
                "X-SERVER-ADDR": import.meta.env.VITE_BACK_END_API_IP,
                Authorization: "Bearer " + getConfiguration()?.token,
              }}
              accept={checklist.acceptable_mimes}
              name={checklist.name}
              defaultFile={userData?.checklistMap.get(checklist.id)}
              // validTypes={["image/png", "image/jpeg", "image/gif"]}
              uploadParam={{
                checklist_id: checklist.id,
                ngo_id: id,
                task_type:
                  type == "register"
                    ? TaskTypeEnum.project_registeration
                    : TaskTypeEnum.project_extend,
              }}
              onComplete={async (record: any) => {
                // 1. Update userData
                for (const element of record) {
                  const item = element[element.length - 1];
                  const checklistMap: Map<string, any> = userData.checklistMap;
                  checklistMap.set(checklist.id, item);
                  setUserData((prev: any) => ({
                    ...prev,
                    checklistMap: checklistMap,
                  }));
                }
                // 2. Save userData for any file inconsistency
                // When new file added and save is not called old file data will show
                onSaveClose(userData, 4, true);
              }}
              onFailed={async (failed: boolean, response: any) => {
                if (failed) {
                  if (response) {
                    toast({
                      toastType: "ERROR",
                      description: response.data.message,
                    });
                    const checklistMap: Map<string, any> =
                      userData.checklistMap;
                    checklistMap.delete(checklist.id);

                    setUserData((prev: any) => ({
                      ...prev,
                      checklistMap: checklistMap,
                    }));
                  }
                }
              }}
              onStart={async (_file: File) => {}}
              validateBeforeUpload={function (file: File): boolean {
                const maxFileSize = checklist.file_size * 1024; // 2MB
                const validTypes: string[] =
                  checklist.acceptable_mimes.split(",");
                const resultFile = validateFile(
                  file,
                  Math.round(maxFileSize),
                  validTypes,
                  t
                );
                return resultFile ? true : false;
              }}
            />
          );
        })
      ) : (
        <NastranSpinner />
      )}
    </div>
  );
}
