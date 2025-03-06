import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <div className="min-h-[80px] h-[80px] flex justify-between items-center bg-white border border-white">
      <div>Logo</div>
      <SearchBar />
      <div>Profile</div>
    </div>
  );
};