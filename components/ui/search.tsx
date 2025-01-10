"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdSearch } from "react-icons/md";
import { useTranslations } from "next-intl";

export default function Search({ value = "" }: { value?: string }) {
  const router = useRouter();
  const t = useTranslations("nav");
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (keyword.trim()) {
      router.push(`/discover?q=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-x-2 mt-4 mb-8">
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          className="w-full px-4 py-2 pl-10 bg-base-200 border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={value}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <MdSearch 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" 
          size={20}
        />
      </div>
      <button
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        onClick={handleSearch}
      >
        {t("search")}
      </button>
    </div>
  );
}