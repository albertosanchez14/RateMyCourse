import SearchBar from "../common/SearchBar";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

export default function Header() {
  return (
    <div className="min-h-[80px] h-[80px] flex justify-between items-center bg-white border border-white">
      <div>Logo</div>
      <SearchBar />
      
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
