'use client';

import {
  FileCsv,
  Play as PlayIcon,
  MicrosoftExcelLogo,
  Download as DownloadIcon,
} from '@phosphor-icons/react';
import Papa from 'papaparse';
import Image from 'next/image';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import Editor from '@monaco-editor/react';
import { Skeleton } from '../ui/skeleton';
import { createQuery } from '@/lib/actions';
import EmojiPicker from 'emoji-picker-react';
import { Input } from '@/components/ui/input';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FloppyDiskIcon, LoadingIcon } from '@/components/icons';
import { TableIcon } from '@radix-ui/react-icons';
import useDatabase from '@/lib/hooks/useDatabase';
import { getBuiltinTypeString } from '@/lib/utils';
import { useQueryToolContext } from '@/lib/hooks/querytoolsettings';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import ConnectionSelector from '@/components/ui/connection-selector';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipArrow } from "@/components/ui/tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Query } from '@prisma/client/edge';


const QueryTool = ({queryObject} : {queryObject?: Query}) => {

  // Hooks
  const { query } = useDatabase();
  const { queryToolSettings } = useQueryToolContext();

  // State
  const [code, setCode] = useState<string | undefined>(queryObject?.content || '');
  const [emojiURL, setEmojiURL] = useState<string>(queryObject?.emojiUrl || 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f601.png');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryName, setQueryName] = useState<string>(queryObject?.name || '')
  const [outputData, setOutputData] = useState<{ columns: { name: string, type: number }[], rows: any[] } | null>(null);
  const [queryCompletionTime, setQueryCompletionTime] = useState<number | null>(null);

  // Editor Theme
  const { theme, resolvedTheme } = useTheme();
  const editorTheme = (theme === 'dark' || resolvedTheme === 'dark') ? 'vs-dark' : 'light';

  // Query Editor Functions
  const handleSave = () => {
    toast.promise(
      createQuery({
        name: queryName || 'untitled',
        content: code,
        emojiUrl: emojiURL,
        userId: queryToolSettings?.connection.userId || '',
        connectionId: queryToolSettings?.connection.id || '',
      }),
    {
      loading: 'Saving query...',
      success: 'Saved',
      error: 'Error saving query'
    }
    )
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
      link.setAttribute('download', queryName || 'output');
      link.click();
    } else {
      toast.error('No data to export');
    }
  };

  // Query Editor UI
  return (
    // overlay the play icon with the loading icon (relative and absolute) while it is running (also disabled)
    <div className="size-full">
      <div className="flex p-1 border-b justify-between items-center w-full">
      <form onSubmit={handleSubmit} className='flex justify-between items-center w-full'>
        <div className="flex items-center">
          <ConnectionSelector />
          <div className="flex gap-1">
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
            <Input
              value={queryName}
              onChange={(e) => setQueryName(e.target.value)}
              placeholder='untitled.sql'
              type='text'
              className='shadow-none font-medium border-0 focus:border-0 focus:bg-input focus-visible:ring-0 focus:outline-0'
            />

          </div>
        </div>
        <div className="flex gap-1 p-1">
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
                type='submit'
                size={'icon'}
                variant={'ghost'}
                disabled={isLoading}
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
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={'icon'}
            onClick={() => {handleSave()}}
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
      </div>
      <ResizablePanelGroup direction="vertical" className='size-full'>
        <ResizablePanel defaultSize={40} minSize={0} className='size-full'>
          <Editor
            onChange={(value) => setCode(value)}
            height="100%"
            theme={editorTheme}
            defaultLanguage="sql"
            defaultValue={code}
          />
        </ResizablePanel>
        <ResizableHandle
          withHandle
          className='activehandle'
        />
        <ResizablePanel minSize={20} defaultSize={60}>
          <div className="border-b flex text-sm w-full p-2 gap-2">
            <div className='flex gap-1'>Num rows: <p className="px-1 rounded bg-primary-foreground">{outputData?.rows.length || '---'}</p></div>
            <div className="flex gap-1">Num cols: <p className="px-1 rounded bg-primary-foreground">{outputData?.columns.length || '---'}</p></div>
            <div className='flex gap-1'>Query completed in <p className="px-1 rounded bg-primary-foreground">{queryCompletionTime ? queryCompletionTime : '---'}ms</p></div>
          </div>
          <div className="h-[calc(100%-86px)]">
            {isLoading ?
              <Skeleton className='grow h-full' />
              :
              <>
              {outputData ? (
                <ScrollArea className={`text-sm flex flex-col-reverse place-items-center font-mono tracking-normal w-[calc(100%-0px)] h-[calc(100%-0px)]`}>
                  <table className='text-primary table-auto w-fit h-fit text-left border-collapse transition-all duration-300 ease-in-out'>
                    <thead className='sticky top-[-1px] bg-primary-foreground drop-shadow max-h-[1rem] min-h-[1rem]'>
                      <tr className='truncate'>
                        {outputData.columns.map((col, index) => (
                          <th key={index} className='border border-t-none p-2 min-w-[10rem] w-[10rem] max-w-[10rem]'>
                            {col.name}
                            <br />
                            <span className='text-xs font-normal text-muted-foreground'>{getBuiltinTypeString(col.type)}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {outputData.rows.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className='max-h-[1rem] min-h-[1rem] hover:bg-primary-foreground transition-all duration-250 ease-in-out'
                        >
                          {outputData.columns.map((col, colIndex) => (
                            <td
                              key={colIndex}
                              className='min-w-[10rem] w-[10rem] max-w-[10rem] truncate
                                        border hover:border-double hover:border-primary
                                        whitespace-nowrap p-2 hover:bg-primary-foreground'
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
                <>
                  {isLoading ?
                    <></>
                    :
                    (
                    <div className="p-4 grow h-full">
                      <div className='h-full border border-dashed rounded-md flex items-center justify-center'>
                        {/* https://vercel.com/geist/empty-state */}
                        <div className="h-fit justify-center items-center flex flex-col gap-0">
                          <TableIcon className='size-8 m-2 text-muted-foreground' />
                          <p className="text-base text-center">No data to show</p>
                          <p className="text-muted-foreground text-sm">Execute a query to get started</p>
                          </div>
                          </div>
                          </div>
                    )
                  }
                </>
              )}
            </>
          }
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default QueryTool;
