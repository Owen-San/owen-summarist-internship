import React from "react";
import { FiSearch, FiMenu } from "react-icons/fi";

const SearchBar: React.FC = () => {
  return (
    <div className="search__background bg-[#fff] border-b-[#e1e7ea] border-b-[1px] h-[80px] z-[1]">
      <div className="search__wrapper relative flex items-center justify-between px-8 max-w-[1070px] mx-auto h-full flex-row-reverse">
        <figure className="hidden md:invisible">
          <img src="logo.png" alt="" />
        </figure>
        <div className="search__content flex items-center gap-6 max-w-[340px] w-full mr-3">
          <div className="search flex items-center w-full">
            <div className="search__input--wrapper relative gap-2 flex flex-row w-full text-sm">
              <input
                type="text"
                placeholder="Search for Books"
                className="search__input h-[40px] w-full px-4 outline-none bg-[#f1f6f4] text-[#042330] border-2 border-solid border-[#e1e7ea] rounded-lg"
              />
              <div className="search__icon flex items-center absolute h-full right-2 justify-items-end border-l-2 border-solid border-[#e1e7ea] border-t-0 border-r-0 border-b-0 pl-2">
                <FiSearch width={24} height={24} className="w-6 h-6 text-[#03314b]" />
              </div>
            </div>
          </div>
          <button className="sidebar__toggle-btn md:hidden sm:flex items-center justify-center cursor-pointer">
            <FiMenu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;