'use client'

import {
  FileCsv,
  Play as PlayIcon,
  MicrosoftExcelLogo,
  Download as DownloadIcon,
  FloppyDisk as FloppyDiskIcon,
} from '@phosphor-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow
} from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";

import Papa from 'papaparse';
import { FieldDef } from 'pg';
import Image from 'next/image';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { useTheme } from 'next-themes';
import Editor from '@monaco-editor/react';
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import React, { useRef, useState } from 'react';
import { LoadingIcon } from '@/components/icons';
import ConnectionSelector from '../ui/connection-selector';
import { useQueryToolContext } from '@/lib/hooks/querytoolsettings';
import useDatabase from '@/lib/hooks/useDatabase';


const QueryTool = () => {
  const { query } = useDatabase();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef(null);

  const [outputString, setOutputString] = useState<string>('')
  const [outputData, setOutputData] = useState<{ columns: { name: string, type: number }[]; rows: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string | undefined>('SELECT NOW()');
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

    if (code) {
      try {

        toast.info(`Running ${code?.split(' ')[0].toUpperCase() || ''} query...`)
        const result = await query(code);

        if (result.error) {
          toast.error(`${result.error}`, {
            description: result.error === 'AggregateError' ? 'Check your connection.' : 'Most likely our fault.'
          })
        } else {
          toast.success(`Query run successfully in ${result.time}ms`)
          setQueryCompletionTime(result.time || 0);
          setOutputString(result.output || '')

          const outputJson = JSON.parse(outputString)
          setOutputData(outputJson)
          console.log(outputData)
          // const columns = result!.output!.fields.map((field: FieldDef) => ({ name: field.name, type: field.dataTypeID }));
          // const outputData = {
          //   columns: columns,
          //   rows: result!.output!.rows,
          // };
          // setOutputData(outputData);
        }
      } catch (error) {
        toast.error(`${error}`, {
          description: error === 'AggregateError' ? 'Check your connection.' : 'Most likely our fault.'
        })
        setOutputData(null);
      }
    }
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
      <ResizablePanelGroup direction="horizontal" className='size-full grid'>
        <ResizablePanel defaultSize={25}>
          <form onSubmit={handleSubmit} className='flex p-1 border-b justify-between items-center w-full'>
            <div className="flex items-center">
              <div className="flex">
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
              <ConnectionSelector />
            </div>
            <div className="flex gap-1 p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={isLoading}
                    size={'icon'}
                    type='reset'
                    onClick={() => {
                      setCode('');
                      setOutputData(null);
                    }}
                    variant={'ghost'}
                  >
                    <FloppyDiskIcon  className='size-4' />
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
                        <DownloadIcon  className='size-4' />
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
                    <FileCsv className='size-4 mr-2'/>
                    <p className='text-xs'>Export to CSV</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MicrosoftExcelLogo className='size-4 mr-2' />
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
                    onClick={() => {handleSubmit}}
                  >
                    {isLoading ? (
                      <LoadingIcon className='size-5' />
                    ) : (
                      <PlayIcon  className='size-' />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <TooltipArrow />
                  Run query
                </TooltipContent>
              </Tooltip>
            </div>
          </form>
          <ResizablePanelGroup direction="vertical" className='size-full'>
            <ResizablePanel defaultSize={75} minSize={0} className='size-full'>
              <Editor
                onChange={(value) => setCode(value)}
                height="100%"
                defaultLanguage="sql"
                defaultValue="SELECT NOW()"
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
                {/* <div className='flex gap-1'>Num columns: <p className="px-px rounded bg-primary-foreground">{outputData?.columns.length || '---'}</p></div> */}
                <div className='flex gap-1'>Query completed in <p className="px-px rounded bg-primary-foreground">{queryCompletionTime ? queryCompletionTime : '---'}ms</p></div>
              </div>
              <div className={`overflow-auto h-[calc(100%-49px)]`}>
                {outputString}
                {/* {outputData ? (
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
                )} */}
                outputData:  {'{'}{outputData?.toString()}{'}'}
                hmmm....
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default QueryTool;
