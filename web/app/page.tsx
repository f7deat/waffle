import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex gap-4 p-4">
      <Link href="/wiki">
      <div className="flex flex-col gap-1 items-center cursor-pointer hover:text-blue-500">
        <div className="h-12 w-12 flex items-center justify-center">
          <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/800px-Wikipedia-logo-v2.svg.png" alt="Wikipedia logo" width={48} height={48} className="w-full h-full" />
        </div>
        <div className="text-center text-sm font-medium">Wikipedia</div>
      </div>
      </Link>

    </main>
  );
}
