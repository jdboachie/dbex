'use client';

import {
  FileCsv,
  Play as PlayIcon,
  MicrosoftExcelLogo,
  Download as DownloadIcon,
  FloppyDisk as FloppyDiskIcon,
} from '@phosphor-icons/react';
import Papa from 'papaparse';
import Image from 'next/image';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import Editor from '@monaco-editor/react';
import EmojiPicker from 'emoji-picker-react';
import { Input } from '@/components/ui/input';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingIcon } from '@/components/icons';
import useDatabase from '@/lib/hooks/useDatabase';
import { getBuiltinTypeString } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import ConnectionSelector from '@/components/ui/connection-selector';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipArrow } from "@/components/ui/tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableIcon } from '@radix-ui/react-icons';


const QueryTool = () => {

  const { query } = useDatabase();

  const editorRef = useRef(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [emojiURL, setEmojiURL] = useState<string>('https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f601.png');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [outputData, setOutputData] = useState<{ columns: { name: string, type: number }[], rows: any[] } | null>(null);
  const [code, setCode] = useState<string | undefined>('select now()');
  const [queryCompletionTime, setQueryCompletionTime] = useState<number | null>(null);

  const { theme, resolvedTheme } = useTheme();
  const editorTheme = (theme === 'dark' || resolvedTheme === 'dark') ? 'vs-dark' : 'light';

  const handleSave = async () => {

  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (code) {
      try {
        toast.info(`Running ${code?.split(' ')[0].toUpperCase() || ''} query...`);
        const result = await query(code);

        if (result.error) {
          toast.error(result.error, {
            description: result.error === 'AggregateError' ? 'Check your connection.' : 'Most likely our fault.'
          });
        } else if (result.res) {
          toast.success(`Query run successfully in ${result.time}ms`);
          setQueryCompletionTime(result.time || 0);
          setOutputData(result.res);
        }
      } catch (error) {
        toast.error(error!.toString(), {
          description: error!.toString() === 'AggregateError' ? 'Check your connection.' : 'Try that again.'
        });
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
    <div className="size-full">
      <form onSubmit={handleSubmit} className='flex p-1 px-2 border-b justify-between items-center w-full'>
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
                <FloppyDiskIcon className='size-4' />
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
                    <DownloadIcon className='size-4' />
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
              >
                {isLoading ? (
                  <LoadingIcon className='size-4' />
                ) : (
                  <PlayIcon className='size-4' />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <TooltipArrow />
              <p>Run query</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </form>
      <ResizablePanelGroup direction="vertical" className='size-full'>
        <ResizablePanel defaultSize={20} minSize={0} className='size-full'>
          <Editor
            onChange={(value) => setCode(value)}
            height="100%"
            theme={editorTheme}
            defaultLanguage="sql"
            defaultValue="select now()"
          />
        </ResizablePanel>
        <ResizableHandle
          withHandle
          className='activehandle'
        />
        <ResizablePanel minSize={20} defaultSize={80}>
          <div className="border-b flex text-xs w-full p-2 gap-2">
            <div className='flex gap-1'>Num rows: <p className="px-1 rounded bg-primary-foreground">{outputData?.rows.length || '---'}</p></div>
            <div className="flex gap-1">Num cols: <p className="px-1 rounded bg-primary-foreground">{outputData?.columns.length || '---'}</p></div>
            <div className='flex gap-1'>Query completed in <p className="px-1 rounded bg-primary-foreground">{queryCompletionTime ? queryCompletionTime : '---'}ms</p></div>
          </div>
          <div className="h-[calc(100%-86px)]">
            {outputData ? (
              <ScrollArea className={`text-sm flex flex-col-reverse place-items-center font-mono tracking-normal w-[calc(100%-1px)] h-[calc(100%-1px)]`}>
                <table className='table-auto w-fit h-fit text-left border-collapse transition-all duration-300 ease-in-out'>
                  <thead className='sticky top-[-1px] bg-primary-foreground drop-shadow max-h-[1rem] min-h-[1rem]'>
                    <tr className='truncate'>
                      {outputData.columns.map((col, index) => (
                        <th key={index} className='border border-t-none p-2 min-w-[10rem] w-[10rem] max-w-[10rem]'>
                          {col.name}
                          <br />
                          <span className='text-xs text-muted-foreground'>{getBuiltinTypeString(col.type)}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {outputData.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className='max-h-[1rem] min-h-[1rem] hover:bg-secondary transition-all duration-300 ease-in-out'
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
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <div className="p-4 grow h-full">
                {/* https://vercel.com/geist/empty-state */}
                <div className='h-full text-sm border border-dashed rounded-md flex items-center justify-center'>
                  <div className="h-fit justify-center items-center flex flex-col gap-1">
                    <TableIcon className='size-16 m-2 text-muted-foreground' />
                    <p className="text-base text-center">No data to show</p>
                    <p className="text-muted-foreground">Execute a query to get started</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default QueryTool;
