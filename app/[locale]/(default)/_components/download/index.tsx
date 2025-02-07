"use client";

import { MdOutlineDownload } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Song } from "@/types/song";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/app";
import { useState } from 'react';

export default function Download({ song , isPlayer = false }: { song: Song , isPlayer?: boolean }) {
    const [isDownloading, setIsDownloading] = useState(false);
    const {
        user,
        playlist,
        currentSong,
        setCurrentSong,
        currentSongIndex,
        setCurrentSongIndex,
        setIsShowSignPanel,
      } = useAppContext();
    const downloadSong = async (uuid: string) => {
    try {
      if (!user || !user.uuid) {
        setIsShowSignPanel(true);
        return;
      }

      setIsDownloading(true);
      const response = await fetch('/api/download-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uuid }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${song.title || 'song'}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success('下载成功');
    } catch (error) {
      console.error('下载出错:', error);
      toast.error('下载失败');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isPlayer) {
    return (
      <button 
        className="mx-2 relative" 
        onClick={() => downloadSong(song.uuid)}
        disabled={isDownloading}
      >
        <MdOutlineDownload className={`text-xl ${isDownloading ? 'opacity-50' : ''}`} />
        {isDownloading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}
      </button>
    );
  }

  return (
    <Button
      size="sm"
      className="hidden md:flex items-center gap-x-1 bg-base-300 text-base-content relative"
      onClick={() => downloadSong(song.uuid)}
      disabled={isDownloading}
    >
      <MdOutlineDownload className={`text-2xl ${isDownloading ? 'opacity-50' : ''}`} />
      {isDownloading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}
    </Button>
  );
}