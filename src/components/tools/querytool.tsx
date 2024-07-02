'use client'

// import { FieldDef } from 'pg';
import Editor from '@monaco-editor/react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { Button } from '@/components/ui/button';
  import React, { useRef, useState } from 'react';
// import useDatabase from '@/lib/hooks';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipArrow } from "@/components/ui/tooltip";
import {
  Trash as TrashIcon,
  Play as PlayIcon,
  Download as DownloadIcon,
  Smiley,
} from '@phosphor-icons/react';
// import { LoadingIcon } from '@/components/icons';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { FileCsv, FloppyDisk as FloppyDiskIcon, MicrosoftExcelLogo } from '@phosphor-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuArrow,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '../ui/input';
import { useTheme } from 'next-themes';
import EmojiPicker from 'emoji-picker-react';
import Image from 'next/image';


const QueryTool = () => {
  // const { query } = useDatabase();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef(null);

  const [outputData, setOutputData] = useState<{ columns: { name: string, type: number }[]; rows: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const [emojiURL, setEmojiURL] = useState<string>('https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f601.png')
  const [queryCompletionTime, setQueryCompletionTime] = useState<number | null>(null);

  let editorTheme;
  const { theme, resolvedTheme } = useTheme()
  if (( theme === 'dark' ) || ( resolvedTheme === 'dark' )) {
    editorTheme = 'vs-dark'
  } else {
    editorTheme = 'light'
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    // if (inputRef.current) {
    //   const currentInput = inputRef.current.value;
    //   try {
    //     const result = await query(currentInput);
    //     setQueryCompletionTime(result!.time);
    //     const columns = result!.output!.fields.map((field: FieldDef) => ({ name: field.name, type: field.dataTypeID }));

    //     const outputData = {
    //       columns: columns,
    //       rows: result!.output!.rows,
    //     };
    //     setOutputData(outputData);

    //   } catch (error) {
    //     setOutputData(null);
    //   }
    // }
    setIsLoading(false);
  };

  const handleExportCSV = () => {
    if (outputData) {
      const csvData = outputData.rows.map(row => {
        const rowData: { [key: string]: any } = {};
        outputData.columns.forEach(col => {
          rowData[col.name] = row[col.name];
        });
        return rowData;
      });

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'query_results.csv');
      link.click();
    } else {
      toast.error('No data to export');
    }
  };


  return (
    <div className="grid size-full">
    <ResizablePanelGroup direction="horizontal" className='size-full flex flex-col'>
      <ResizablePanel defaultSize={25}>
        <form onSubmit={handleSubmit} className='flex flex-col w-full'>
          <div className="flex justify-between gap-2 p-1 px-2 border-b">
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button size={'icon'} variant={'ghost'}>
                    <Image
                      src={emojiURL}
                      alt='queryemoji'
                      width={1000}
                      height={1000}
                      className='size-5'
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='rounded-xl p-0'>
                  <EmojiPicker className='bg-primary-foreground border-0' onEmojiClick={(emojiData) => setEmojiURL(emojiData.imageUrl)} />
                </DropdownMenuContent>
              </DropdownMenu>
              <Input placeholder='untitled.sql' type='text' className='shadow-none font-medium border-0 focus:border-0 focus-visible:ring-0 focus:outline-0' />
            </div>
            <div className="flex gap-1 p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={isLoading}
                    size={'icon'}
                    // type='reset'
                    // onClick={() => {
                    //   setCode('');
                    //   setOutputData(null);
                    // }}
                    variant={'ghost'}
                  >
                    <FloppyDiskIcon className='size-5' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <TooltipArrow />
                  <p>Save</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size={'icon'} variant={'ghost'}>
                        <DownloadIcon className='size-5' />
                        <p className="sr-only">Export</p>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <TooltipArrow />
                      <p>Export output</p>
                    </TooltipContent>
                  </Tooltip>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='mx-2'>
                  {/* <DropdownMenuArrow /> */}
                  <DropdownMenuItem onClick={handleExportCSV}>
                    <FileCsv className='size-5 mr-2'/>
                    <p className='text-xs'>Export to CSV</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MicrosoftExcelLogo className='size-5 mr-2' />
                    <p className="text-xs">Export to Microsoft Excel</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    disabled={isLoading}
                    size={'icon'}
                    type='submit'
                    variant={'ghost'}
                  >
                    {isLoading ? (
                      // <LoadingIcon className='size-5' />
                      <div className="dev size-5"></div>
                    ) : (
                      <PlayIcon className='size-5' />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <TooltipArrow />
                  Run query
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </form>
        <ResizablePanelGroup direction="vertical" className='size-full'>
          <ResizablePanel defaultSize={75} minSize={0} className='size-full'>
              <Editor
                height="100vh"
                defaultLanguage="sql"
                defaultValue="-- WRITE YOUR QUERY HERE"
                theme={editorTheme}
              />
          </ResizablePanel>
          <ResizableHandle
            withHandle
            className='activehandle'
          />
          <ResizablePanel minSize={20} defaultSize={50}>
            <div className="border-b flex text-xs w-full p-2 gap-2">
              <div className='flex gap-1'>Num rows: <p className="px-px rounded bg-primary-foreground">{outputData?.rows.length || '---'}</p> </div>
              <div className='flex gap-1'>Num columns: <p className="px-px rounded bg-primary-foreground">{outputData?.columns.length || '---'}</p></div>
              <div className='flex gap-1'>Query completed in <p className="px-px rounded bg-primary-foreground">{queryCompletionTime ? queryCompletionTime : '---'}ms</p></div>
            </div>
            <div className={`overflow-auto h-[calc(100%-49px)]`}>
              {outputData ? (
                <table className='table-auto w-fit h-fit text-left border-collapse transition-all duration-300 ease-in-out'>
                  <thead className='sticky top-[-1px] bg-primary-foreground drop-shadow max-h-[1rem] min-h-[1rem]'>
                    <tr className='truncate'>
                      {outputData.columns.map((col, index) => (
                        <th key={index} className='border border-t-none p-2 min-w-[10rem] w-[10rem] max-w-[10rem]'>
                          {col.name}
                          <br />
                          <span className='text-xs text-foreground/70'>({col.type})</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {outputData.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className='max-h-[1rem] min-h-[1rem] transition-all duration-300 ease-in-out'
                      >
                        {outputData.columns.map((col, colIndex) => (
                          <td
                            key={colIndex}
                            className='min-w-[10rem] w-[10rem] max-w-[10rem] truncate
                                      border hover:border-double hover:border-primary
                                      whitespace-nowrap p-2 hover:bg-secondary'
                          >
                            {row[col.name] instanceof Date ? row[col.name].toString() : row[col.name]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className='p-2 size-full flex text-foreground/70 items-center justify-center'>No data to display</p>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
    </div>
  );
};

export default QueryTool;
