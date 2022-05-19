import { useState } from "react";
import DatePicker from "react-date-picker";
import { useMutation } from "react-query";
import { generateReport } from "../utils/user";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import moment from "moment";

const Reports = () => {
  const MySwal = withReactContent(Swal);
  const [value, onChange] = useState(new Date());

  const { mutate: triggerGenerateReport, isLoading: isGenerateReportLoading } =
    useMutation(async (report: any) => generateReport(report), {
      onSuccess: async (data: any) => {
        window.open(`/uploads/${data.fileName}`, "_blank");
      },
      onError: async (err: any) => {
        MySwal.fire({
          title: "Ooops!",
          text: err,
          icon: "error",
          confirmButtonText: "Okay",
          confirmButtonColor: "#274c77",
        });
      },
    });

  return (
    <>
      <DatePicker
        onChange={onChange}
        value={value}
        disabled={isGenerateReportLoading}
      />
      <button
        className={`w-[90px] ml-7 bg-primary text-white hover:bg-primary-dark h-[28px]`}
        onClick={() => triggerGenerateReport({ date: moment(value).format() })}
        disabled={isGenerateReportLoading}
      >
        Export
      </button>
    </>
  );
};

export default Reports;
