import React from 'react';

export const CustomNode = function ({ data }: { data: { tableName?: string, columns?: [{name: string, type: string}] } }) {
  return (
    <div className="bg-secondary rounded w-[20rem] mx-10 text-secondary-foreground">
      <div className="w-full py-1 px-2 text-base flex justify-start items-center bg-primaryblue">
        <h3>{data.tableName?.toUpperCase()}</h3>
      </div>
      <div className="flex flex-col text-sm px-2">
        {data.columns?.map((column, index) => (
          <div key={index}  className="flex flex-row items-center justify-between py-1">
            <div className="text-base">{column.name}</div>
            <div className="text-xs font-light text-muted-foreground">{column.type}</div>
          </div>
          
        ))}
      </div>
    </div>
  );
}