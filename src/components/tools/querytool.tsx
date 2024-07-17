'use client';

import {
  PlayIcon,
  LayoutIcon,
  LoadingIcon,
  DownloadIcon,
  FloppyDiskIcon,
} from '@/components/icons';
import Papa from 'papaparse';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  FileCsv,
  MicrosoftExcelLogo,
} from '@phosphor-icons/react';
import { useTheme } from 'next-themes';
import Editor from '@monaco-editor/react';
import { Skeleton } from '../ui/skeleton';
import { createQuery } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import EmojiPicker from 'emoji-picker-react';
import { Input } from '@/components/ui/input';
import EmptyState from '../closet/empty-state';
import { Button } from '@/components/ui/button';
import useDatabase from '@/lib/hooks/useDatabase';
import { getBuiltinTypeString } from '@/lib/utils';
import React, { useState, useEffect } from 'react';
import { useQueryToolContext } from '@/lib/hooks/querytoolsettings';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import ConnectionSelector from '@/components/ui/connection-selector';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipArrow } from "@/components/ui/tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Query, Connection } from '@prisma/client';
import StatusDot from '../ui/status-dot';

interface QueryWithConnection extends Query {
  relatedConnection: Connection;
}

const QueryTool = ({data}: {data?: QueryWithConnection}) => {

  const DEFAULT_EMOJI_URL = 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1fae5.png'

  // Hooks
  const router = useRouter();
  const { query } = useDatabase();
  const { queryToolSettings } = useQueryToolContext();

  // State
  const [shouldUpdateNotCreate, setShouldUpdateNotCreate] = useState<boolean>(false)
  const [hasFailure, setHasFailure] = useState<boolean>(false)
  const [code, setCode] = useState<string | undefined>(data?.content || '');
  const [emojiURL, setEmojiURL] = useState<string>(data?.emojiUrl || DEFAULT_EMOJI_URL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryName, setQueryName] = useState<string>(data?.name || '')
  const [outputData, setOutputData] = useState<{ columns: { name: string, type: number }[], rows: any[] } | null>(null);
  const [queryCompletionTime, setQueryCompletionTime] = useState<number | null>(null);

  // Editor Theme
  const { theme, resolvedTheme } = useTheme();
  const editorTheme = (theme === 'dark' || resolvedTheme === 'dark') ? 'vs-dark' : 'light';

  // Query Editor Functions
  const handleSave = () => {
    toast.promise(
      // shouldUpdateNotCreate ?
      //updateQuery({where {id: }, data: {content: content, title: title}})
      createQuery({
        name: queryName || 'untitled',
        content: code,
        emojiUrl: emojiURL,
        userId: queryToolSettings?.connection?.userId || '',
        connectionId: queryToolSettings?.connection?.id || '',
      }).then((res) => router.push(`/app/queries/${res.id}`)),
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
          setHasFailure(true)
          toast.error("Error", {
            description: result.error === 'AggregateError' ? 'Check your connection.' : result.error
          });
        } else if (result.res) {
          toast.success(`Query run successfully in ${result.time}ms`);
          setQueryCompletionTime(result.time || 0);
          setOutputData(result.res);
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

  // Query Editor UI
  return (
    // overlay the play icon with the loading icon (relative and absolute) while it is running (also disabled)
    <div className="size-full">
      <div className="flex p-1 border-b justify-between items-center w-full">
      <form onSubmit={handleSubmit} className='flex justify-between items-center w-full'>
        <div className="flex items-center">
          <React.Suspense fallback={<Skeleton className='h-5 w-20'/>}>
            <ConnectionSelector presetConnection={data?.relatedConnection} />
          </React.Suspense>
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
              placeholder='Untitled'
              type='text'
              className='shadow-none text-primary font-medium border-0 focus:border-0 focus:bg-input focus-visible:ring-0 focus:outline-0'
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
              <DropdownMenuItem disabled>
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
          <div className="border-b flex justify-between text-xs font-medium w-full p-2 gap-2">
            <div className="flex gap-2">
              <div className='flex gap-1'>Num rows: <p className="px-1 rounded bg-primary-foreground">{outputData?.rows.length || '---'}</p></div>
              <div className="flex gap-1">Num cols: <p className="px-1 rounded bg-primary-foreground">{outputData?.columns.length || '---'}</p></div>
              <div className='flex gap-1'>Query completed in <p className="px-1 rounded bg-primary-foreground">{queryCompletionTime ? queryCompletionTime : '---'}ms</p></div>
            </div>
            <div className="grid grid-flow-col gap-2 place-items-center">
              Last query?
              <StatusDot state={
                isLoading ? 'wait' : (outputData ? 'ok' : (hasFailure ? 'failed' : 'dormant'))
                }
              />
            </div>
          </div>
          <div className="h-[calc(100%-86px)]">
            {isLoading ?
              <Skeleton className='grow h-full' />
              :
              <>
              {outputData ? (
                <ScrollArea className={`text-xs font-medium flex flex-col-reverse place-items-center font-mono tracking-normal w-[calc(100%-0px)] h-[calc(100%-0px)]`}>
                  <table className='text-primary table-auto w-fit h-fit text-left border-collapse transition-all duration-300 ease-in-out'>
                    <thead className='sticky top-[-1px] bg-background border-b max-h-[1rem] min-h-[1rem]'>
                      <tr className='truncate'>
                        {outputData.columns.map((col, index) => (
                          <th key={index} className='p-2 min-w-[10rem] w-[10rem] max-w-[10rem]'>
                            {col.name}
                            <br />
                            <span className='text-xs font-normal text-muted-foreground'>{getBuiltinTypeString(col.type)}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className='[&>*:nth-child(even)]:bg-background hover:[&>*:nth-child(even)]:bg-secondary [&>*:nth-child(odd)]:bg-primary-foreground hover:[&>*:nth-child(odd)]:bg-secondary'>
                      {outputData.rows.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className='rounded-md max-h-[1rem] min-h-[1rem] transition-all duration-250 ease-in-out'
                        >
                          {outputData.columns.map((col, colIndex) => (
                            <td
                              key={colIndex}
                              className='min-w-[10rem] w-[10rem] max-w-[10rem] truncate whitespace-nowrap p-2'
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
                      <EmptyState
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
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default QueryTool;
