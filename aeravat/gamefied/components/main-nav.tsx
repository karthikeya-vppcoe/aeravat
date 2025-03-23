
import Link from "next/link";
import { Trophy, Home, Book, Users, Lightbulb } from "lucide-react";
import { AuroraText } from "./magicui/aurora-text";


export function MainNav() {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/"
        className="flex items-center space-x-2 font-bold text-xl text-white"
      >
        <Trophy className="h-6 w-6 text-amber-400" />
        <h1 className=" font-bold tracking-tighter md:text-sm lg:text-sm text-teal-400">
          Placementprep.Ai{" "}
          <AuroraText className="text-2xl px-1" speed={2}>
            Gamefied
          </AuroraText>
        </h1>
      </Link>
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-teal-400 text-teal-400"
      ></Link>
      {/* <Link href="/courses" className="text-sm font-medium text-slate-400 transition-colors hover:text-teal-400">
        <span className="flex items-center gap-1">
          <Book className="h-4 w-4" />
          <span className="hidden md:inline">Courses</span>
        </span>
      </Link> */}
      {/* <Link href="/community" className="text-sm font-medium text-slate-400 transition-colors hover:text-teal-400">
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span className="hidden md:inline">Community</span>
        </span>
      </Link> */}
      {/* <Link href="/resources" className="text-sm font-medium text-slate-400 transition-colors hover:text-teal-400">
        <span className="flex items-center gap-1">
          <Lightbulb className="h-4 w-4" />
          <span className="hidden md:inline">Resources</span>
        </span>
      </Link> */}
    </nav>
  );
}


