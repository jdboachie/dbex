'use client';

import {
  PlayIcon,
  LayoutIcon,
  LoadingIcon,
  DownloadIcon,
  FloppyDiskIcon,
  CrossIcon,
} from '@/components/icons';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  FileCsv,
  MicrosoftExcelLogo,
} from '@phosphor-icons/react';
import { useTheme } from 'next-themes';
import React, { useState } from 'react';
import StatusDot from '../ui/status-dot';
import Editor from '@monaco-editor/react';
import { Skeleton } from '../ui/skeleton';
import { createQuery } from '@/lib/actions';
import EmojiPicker from 'emoji-picker-react';
import { Input } from '@/components/ui/input';
import EmptyState from '../closet/empty-state';
import { Button } from '@/components/ui/button';
import { AnimatePresence } from 'framer-motion';
import useDatabase from '@/lib/hooks/useDatabase';
import { Query, Connection } from '@prisma/client';
import { getBuiltinTypeString } from '@/lib/utils';
import useCtrlEnter from '@/lib/hooks/useControlEnter';
import { useQueryToolContext } from '@/lib/hooks/querytoolsettings';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import ConnectionSelector from '@/components/ui/connection-selector';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipArrow } from "@/components/ui/tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


interface QueryWithConnection extends Query {
  relatedConnection: Connection;
}


const QueryTool = ({data}: {data?: QueryWithConnection}) => {

  const DEFAULT_EMOJI_URL = 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1fae5.png'

  // Hooks
  const { query } = useDatabase();
  const { queryToolSettings } = useQueryToolContext();

  // State
  const [code, setCode] = useState<string | undefined>(data?.content || '');
  const [isEdited, setIsEdited] = useState<boolean>(false)
  const [emojiURL, setEmojiURL] = useState<string>(data?.emojiUrl || DEFAULT_EMOJI_URL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryName, setQueryName] = useState<string>(data?.name || '')
  const [hasFailure, setHasFailure] = useState<boolean>(false)
  const [outputData, setOutputData] = useState<{ columns: { name: string, type: number }[], rows: any[] } | null>(null);
  const [viewDetailedInfo, setViewDetailedInfo] = useState<any | null>(null)
  const [showResizableHandle, setShowResizableHandle] = useState<boolean>(false);
  const [queryCompletionTime, setQueryCompletionTime] = useState<number | null>(null);


  // Editor Theme
  const { theme, resolvedTheme } = useTheme();
  const editorTheme = (theme === 'dark' || resolvedTheme === 'dark') ? 'vs-dark' : 'light';

  // Query Editor Functions
  const handleSave = () => {
    toast.promise(
      createQuery(
        data?.id || 'noquerysgonnahaveanidlikethislol',
        {
          name: queryName || 'untitled',
          content: code,
          emojiUrl: emojiURL,
          userId: queryToolSettings?.connection?.userId || '',
          connectionId: queryToolSettings?.connection?.id || '',
        }),
        {
          loading: 'Saving query...',
          success: 'Saved',
          error: 'Error saving query'
        }
      )
  }

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setIsLoading(true);
    setViewDetailedInfo(null)

    if (code) {
      try {
        toast.info(`Running ${code?.split(' ')[0].toUpperCase() || ''} query...`);
        const result = await query(code);

        if (result.error) {
          setHasFailure(true)
          toast.error("Error", {
            description: result.error === 'AggregateError' ? 'Check your connection.' : result.error
          });
        } else if (result.res) {
          toast.success(`Query run successfully in ${result.time}ms`);
          setQueryCompletionTime(result.time || 0);
          setOutputData(result.res);
          setHasFailure(false)
        }
      } catch (error) {
        setHasFailure(true)
        toast.error("Error", {
          description: error!.toString() === 'AggregateError' ? 'Check your connection.' : error!.toString()
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

  const handleExportXLSX = () => {
    if (outputData) {
      const csvData = outputData.rows.map(row => {
        const rowData: { [key: string]: any } = {};
        outputData.columns.forEach(col => {
          rowData[col.name] = row[col.name];
        });
        return rowData;
      });

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(csvData);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      // Generate a buffer
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      // Create a Blob from the buffer and trigger a download
      const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(dataBlob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${queryName || 'output'}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      toast.error('No data to export');
    }

  };

  useCtrlEnter(handleSubmit)

  // Query Editor UI
  return (
    // overlay the play icon with the loading icon (relative and absolute) while it is running (also disabled)
    <div className="size-full flex flex-col">
      <div className="flex p-1 border-b justify-between items-center w-full">
        <form onSubmit={handleSubmit} className='flex justify-between items-center w-full'>
          <div className="flex items-center">
            <ConnectionSelector presetConnection={data?.relatedConnection} />
            <div className="relative flex">
              <DropdownMenu>
                <DropdownMenuTrigger className='absolute top-0.5 left-0.5'>
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
                placeholder='Untitled'
                type='text'
                className='pl-11 shadow-none text-primary font-normal border-0'
              />

            </div>
          </div>
          <div className="flex gap-1 p-1">
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
            <DropdownMenuItem disabled={outputData === null ? true : false } onClick={handleExportCSV}>
              <FileCsv weight='fill' className='size-5 mr-2'/>
              <p className='text-xs'>Export to CSV</p>
            </DropdownMenuItem>
            <DropdownMenuItem disabled={outputData === null ? true : false } onClick={handleExportXLSX}>
              <MicrosoftExcelLogo weight='fill' className='size-5 mr-2' />
              <p className="text-xs">Export to Microsoft Excel</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={'icon'}
              onClick={() => {handleSave()}}
              variant={'ghost'}
              className='relative'
            >
              <StatusDot state='wait' className={!isEdited ? 'hidden' : 'absolute top-1 right-1'} />
              <FloppyDiskIcon className='size-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <TooltipArrow />
            <p>Save</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <ResizablePanelGroup direction="vertical" className='w-full'>
        <ResizablePanel defaultSize={40} minSize={0} className='size-full'>
          <Editor
            onChange={(value) => {setCode(value)}}
            height="100%"
            theme={editorTheme}
            defaultLanguage="sql"
            defaultValue={code}
          />
        </ResizablePanel>
        <ResizableHandle
          withHandle={false}
          className='activehandle' // implement this class
        />
        <ResizablePanel minSize={20} defaultSize={60}>

          <ResizablePanelGroup direction='horizontal' className="max-h-[calc(100%-33px)]">
            <ResizablePanel defaultSize={100}>
              {isLoading ?
                <Skeleton className='grow h-full' />
                :
                <>
                {outputData ? (
                  <ScrollArea className={`text-xs text-[13px] flex flex-col-reverse place-items-center tracking-normal w-[calc(100%-0px)] h-[calc(100%-0px)]`}>
                    <div className='grid grid-flow-row text-primary/90 w-fit h-fit text-left border-collapse animate-all'>
                      <div className='thead p-2 sticky top-0 bg-background border-b'>
                        <div className='tr grid grid-flow-col truncate'>
                          {outputData.columns.map((col, index) => (
                            <div key={index} className='flex gap-1 items-center p-2 min-w-[10rem] w-[10rem] max-w-[10rem] truncate'>
                              <p className="text-sm">{col.name}</p>
                              <span className='text-[0.6rem] truncate leading-[9px] font-normal text-muted-foreground'>{getBuiltinTypeString(col.type)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className='p-1 [&>*:nth-child(even)]:bg-background hover:[&>*:nth-child(even)]:bg-secondary [&>*:nth-child(odd)]:bg-primary-foreground hover:[&>*:nth-child(odd)]:bg-secondary'>
                        {outputData.rows.map((row, rowIndex) => (
                          <div
                            key={rowIndex}
                            data-selected={(row == viewDetailedInfo) ? true : false}
                            onClick={() => setViewDetailedInfo(row)}
                            className={'tr grid hover:text-primary grid-flow-col rounded animate-all data-[selected=true]:invert'}
                          >
                            {outputData.columns.map((col, colIndex) => (
                              <Tooltip
                                key={colIndex}
                              >
                                <TooltipTrigger>
                                  <div
                                    className='td text-start min-w-[10em] w-[10rem] max-w-[10rem] truncate whitespace-nowrap p-2'
                                  >
                                    {row[col.name] instanceof Date ? row[col.name].toString() : (row[col.name])}
                                  </div>
                                </TooltipTrigger>
                                {row[col.name] &&
                                  <>
                                  {row[col.name].length > 21 &&
                                    <TooltipContent>
                                      {row[col.name]}
                                      <TooltipArrow className='relative w-0 h-0 border-l-[7px] border-r-[7px] border-t-[7px] border-l-transparent border-r-transparent border-t-primary' />
                                    </TooltipContent>
                                  }
                                  </>
                                }
                              </Tooltip>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                ) : (
                  <>
                    {isLoading ?
                      <></>
                      :
                      (
                        <div className="p-4 grow h-full">
                        <EmptyState
                          small
                          icon={LayoutIcon}
                          title='No data to show'
                          description='Execute a query to view the output'
                          />
                      </div>
                      )
                    }
                  </>
                )}
              </>
            }
            </ResizablePanel>
            <AnimatePresence mode="popLayout" initial={false}>
              {viewDetailedInfo &&
                <>
                  <ResizableHandle withHandle={false} className='activehandle' />
                  <ResizablePanel
                    minSize={30}
                    maxSize={70}
                    defaultSize={viewDetailedInfo ? 50 : 0}
                    className='gap-2 divide-y'
                  >
                    <div className="p-2 flex items-center justify-between">
                      <p className="font-medium px-2">Details</p>
                      <Button
                        size={'icon'}
                        variant={'ghost'}
                        onClick={() => {setViewDetailedInfo(null)}}
                      >
                        <CrossIcon className='size-4' />
                      </Button>
                    </div>
                    <ScrollArea className="grid h-[calc(100%-52px)]">
                      <div className="p-4 grid">
                        {outputData?.columns.map((column, index) => (
                          <div
                          key={index}
                          className="grid grid-flow-row w-full p-2"
                          >
                            <div className='h-fit'>{column.name}</div>
                            <div className='border shadow-inner rounded-sm'>
                              <p className='p-2 text-primary'>{viewDetailedInfo[column.name] instanceof Date ? viewDetailedInfo[column.name].toString() : viewDetailedInfo[column.name]}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </ResizablePanel>
                </>
              }
            </AnimatePresence>
          </ResizablePanelGroup>
          <div className="border-t flex justify-between text-xs w-full p-2 gap-2">
            <div className="flex gap-2">
              <div className='flex gap-1'>Num rows: <p className="px-1 rounded bg-primary-foreground">{outputData?.rows.length || '---'}</p></div>
              <div className="flex gap-1">Num cols: <p className="px-1 rounded bg-primary-foreground">{outputData?.columns.length || '---'}</p></div>
              <div className='flex gap-1'>Query completed in <p className="px-1 rounded bg-primary-foreground">{queryCompletionTime ? queryCompletionTime : '---'}ms</p></div>
            </div>
            <div className="grid grid-flow-col gap-2 place-items-center">
              <span>Last query</span>
              <StatusDot state={
                isLoading ? 'wait' : (hasFailure ? 'failed' : (outputData ? 'ok' : 'dormant'))
                }
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default QueryTool;
