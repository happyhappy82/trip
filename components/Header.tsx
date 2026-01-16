import Image from "next/image";

interface HeaderProps {
  isHome?: boolean;
}

export default function Header({ isHome = false }: HeaderProps) {
  const TitleTag = isHome ? "h1" : "span";

  return (
    <header className="mb-16 flex justify-center">
      <a href="/" className="flex items-center gap-6">
        <Image
          src="/logo.jpg"
          alt="더트립가이드 로고"
          width={140}
          height={140}
          priority
          className="w-[140px] h-[140px]"
        />
        <TitleTag className="text-6xl font-black text-emerald-600">더트립가이드</TitleTag>
      </a>
    </header>
  );
}
