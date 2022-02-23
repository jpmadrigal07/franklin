// import isArray from 'lodash/isArray';

const Table = ({ header = [], isLoading = false, data = [] }: any) => {
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
                {header.map((res2: any) => {
                  return (
                    <td className="text-sm text-gray-900 px-6 py-2 whitespace-nowrap">
                      {res[res2.dataName]}
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
                    {header.map((res: any) => (
                      <th
                        scope="col"
                        className="text-sm font-bold text-gray-900 px-6 py-2 text-left"
                      >
                        {res.header}
                      </th>
                    ))}
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
