"use client";

import React, { useEffect, useRef, useState } from "react";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

type BookSuggestion = {
  id: string;
  title: string;
  imageLink?: string;
  author?: string;
};

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const debounceRef = useRef<number | null>(null);
  const router = useRouter();

  const handleChange = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setShowDropdown(false);
      setLoading(false);
    } else {
      setShowDropdown(true);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    setLoading(false);
  };

  useEffect(() => {
    if (!query.trim()) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);

      try {
        const res = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=" +
            encodeURIComponent(query),
          { cache: "no-store" }
        );

        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      }

      setLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = (book: BookSuggestion) => {
    setQuery(book.title);
    setShowDropdown(false);
    router.push(`/book/${book.id}`);
  };

  const showSkeleton = loading && query.trim().length > 0;
  const showResults = !loading && results.length > 0;

  return (
    <div className="bg-white border-b border-[#e1e7ea] h-[80px] z-[50] relative">
      <div className="relative flex items-center justify-between px-8 max-w-[1070px] mx-auto h-full flex-row-reverse">
        <figure className="hidden md:invisible">
          <img src="logo.png" alt="" />
        </figure>

        <div className="flex items-center gap-6 max-w-[340px] w-full mr-3">
          <div className="flex items-center w-full">
            <div className="relative gap-2 flex flex-row w-full text-sm">
              <input
                type="text"
                placeholder="Search for Books"
                className="h-[40px] w-full pl-4 pr-10 outline-none bg-[#f1f6f4] text-[#042330] border-2 border-[#e1e7ea] rounded-lg"
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => {
                  if (query.trim()) setShowDropdown(true);
                }}
              />

              <div className="flex items-center absolute h-full right-2 border-l border-[#e1e7ea] pl-2">
                {query.trim().length > 0 ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center justify-center"
                  >
                    <FiX className="w-5 h-5 text-[#03314b]" />
                  </button>
                ) : (
                  <FiSearch className="w-6 h-6 text-[#03314b]" />
                )}
              </div>

              {showDropdown && (
                <div className="absolute top-[44px] left-0 w-full bg-white border border-[#e1e7ea] rounded-lg shadow-lg max-h-96 overflow-y-auto z-[60]">
                  {showSkeleton && (
                    <div className="p-4 space-y-5">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 animate-pulse h-[70px]">
                          <div className="w-14 h-full bg-[#e1e7ea] rounded-md" />
                          <div className="flex-1 space-y-3">
                            <div className="h-4 w-3/4 bg-[#e1e7ea] rounded-md" />
                            <div className="h-4 w-1/2 bg-[#e1e7ea] rounded-md" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showResults &&
                    results.map((book) => (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() => handleSelect(book)}
                        className="w-full flex items-center gap-4 px-4 py-4 hover:bg-[#f1f6f4] text-left h-[70px]"
                      >
                        <div className="w-14 h-full rounded-md overflow-hidden bg-[#f1f6f4]">
                          {book.imageLink ? (
                            <img
                              src={book.imageLink}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm text-[#042330] line-clamp-2">
                            {book.title}
                          </span>
                          {book.author && (
                            <span className="text-xs text-[#6b8792] line-clamp-1">
                              {book.author}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          <button className="md:hidden sm:flex items-center justify-center cursor-pointer">
            <FiMenu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
