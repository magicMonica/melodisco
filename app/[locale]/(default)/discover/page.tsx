"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Song } from "@/types/song";
import Search from "@/components/ui/search";
import Playlist from "../_components/playlist";
import { useTranslations } from "next-intl";
import { MdLocalFireDepartment, MdOutlineRssFeed, MdOutlineRadio } from "react-icons/md";
import Crumb from "../_components/crumb";
import { Nav } from "@/types/nav";

export default function DiscoverPage() {
  const t = useTranslations("nav");
  const searchParams = useSearchParams();
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [loading, setLoading] = useState(false);

  const crumbNavs: Nav[] = [
    {
      title: t("home"),
      url: "/",
    },
    {
      title: t("discover"),
      active: true,
    },
  ];

  const fetchSearchSongs = async (keyword: string) => {

    try {
      setLoading(true);
      const resp = await fetch("/api/search-song", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword: keyword,
          limit: 50,
        }),
      });
      const { data } = await resp.json();
      setSongs(data || []);
    } catch (e) {
      console.log("search songs failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const keyword = searchParams.get("q");
    fetchSearchSongs(keyword || "");
  }, [searchParams]);

  return (
    <div className="w-full md:max-w-6xl mx-auto">
      <Crumb navs={crumbNavs} />

      <h1 className="text-2xl font-semibold tracking-tight">{t("discover")}</h1>

      <Search value={searchParams.get("q") || ""} />

      <div className="mt-8">
        <Playlist loading={loading} songs={songs} />
      </div>
    </div>
  );
}
