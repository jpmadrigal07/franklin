import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

const Table = ({
  header = [],
  isLoading = false,
  data = [],
  customColumnTextColor = [],
  hideColumn = "",
  columnSort = () => {},
  columnSortIcon = {},
}: any) => {
  const _renderData = () => {
    if (!isLoading) {
      if (data && data.length > 0) {
        return data.map((res: any, index: number) => {
          return (
            <>
              <tr
                className={`border-b ${
                  index !== data.length - 1 ? "border-accent" : "border-light"
                } ${index % 2 !== 0 ? "bg-accent" : ""}`}
              >
                {header
                  .filter((res3: any) => res3.dataName !== hideColumn)
                  .map((res2: any) => {
                    const custom = customColumnTextColor.find(
                      (a: any) => a.column === res2.dataName
                    );
                    const textColor = custom?.color
                      ? `text-${custom?.color}`
                      : "";
                    const bold = `${custom?.bold && "font-bold"}`;
                    return (
                      <td
                        className={`text-sm text-gray-900 px-6 py-2 whitespace-nowrap ${
                          res2.dataName === custom?.column
                            ? `${textColor} ${bold}`
                            : ""
                        }`}
                      >
                        {res[res2.dataName] !== "0" ? res[res2.dataName] : "0"}
                      </td>
                    );
                  })}
              </tr>
            </>
          );
        });
      } else {
        return <p className="mt-3">No data found</p>;
      }
    } else {
      return <p className="mt-3">Loading...</p>;
    }
  };
  return (
    <>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="border-b-2">
                  <tr>
                    {header.map((res: any) => {
                      if (
                        res.dataName === "endActions" &&
                        data[0] &&
                        data[0].endActions &&
                        res.dataName !== hideColumn
                      ) {
                        return (
                          <th
                            scope="col"
                            className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                          >
                            {res.header}
                          </th>
                        );
                      } else if (
                        res.dataName !== "endActions" &&
                        res.dataName !== hideColumn
                      ) {
                        return (
                          <th
                            scope="col"
                            className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                          >
                            <span
                              className="flex hover:cursor-pointer"
                              onClick={() => columnSort(res.dataName)}
                            >
                              <span className="flex flex-col justify-center">
                                {res.header}
                              </span>
                              <span className="flex flex-col ml-2">
                                {columnSortIcon?.sort &&
                                  columnSortIcon?.sort === "up" &&
                                  columnSortIcon?.data === res.dataName && (
                                    <Icon
                                      icon="bi:caret-up-fill"
                                      className="inline"
                                      height={15}
                                    />
                                  )}
                                {columnSortIcon?.sort &&
                                  columnSortIcon?.sort === "down" &&
                                  columnSortIcon?.data === res.dataName && (
                                    <Icon
                                      icon="bi:caret-down-fill"
                                      className="inline"
                                      height={15}
                                    />
                                  )}
                              </span>
                            </span>
                          </th>
                        );
                      }
                    })}
                  </tr>
                </thead>
                <tbody>{_renderData()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
