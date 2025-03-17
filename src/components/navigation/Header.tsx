import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

import SearchBar from "../common/SearchBar";
import HeroImage from "./HeroImage";

export default function Header() {
  return (
    <div className="min-h-[80px] h-[80px] flex justify-between items-center bg-white border border-white">
      <div className="w-[90px] flex justify-center">
        <Link to="/">Logo</Link>
      </div>

      <SearchBar />

      <div className="w-[90px] flex justify-center">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <HeroImage />
        </SignedIn>
      </div>
    </div>
  );
}
