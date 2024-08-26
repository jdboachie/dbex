import React from 'react';
import { TableIcon } from '@/components/icons';

export const CustomNode = function ({ data }: { data: { tableName?: string, columns?: [{name: string, type: string}] } }) {
  return (
    <div className="bg-secondary rounded w-[20rem] mx-10 text-secondary-foreground">
      <div className="w-full  gap-1.5 py-1 px-2 text-base font-bold flex justify-start items-center bg-primary-foreground">
        <TableIcon className='size-4 text-primary'></TableIcon>
        <h3>{data.tableName?.toUpperCase()}</h3>
      </div>
      <div className="flex flex-col text-sm px-2">
        {data.columns?.map((column, index) => (
          <div key={index}  className="grid grid-cols-7 items-center justify-between py-1">
            <div className='col-span-6'>
            <div className="text-base ">{column.name}</div>
            </div>
            
            <div className="text-xs font-light text-muted-foreground col-span-1">
              {
                column.type==='character varying'?'varchar':column.type === 'character'?'char':column.type
              }
            </div>
          </div>
          
        ))}
      </div>
    </div>
  );
}