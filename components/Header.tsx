import Image from "next/image";

export default function Header() {
  return (
    <header className="mb-16 flex justify-center">
      <a href="/" className="flex items-center gap-6">
        <Image
          src="/logo.png"
          alt="더트립가이드 로고"
          width={140}
          height={140}
          className="w-[140px] h-[140px]"
        />
        <h1 className="text-6xl font-black text-emerald-600">더트립가이드</h1>
      </a>
    </header>
  );
}
