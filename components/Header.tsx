import Image from "next/image";

export default function Header() {
  return (
    <header className="mb-14 flex justify-center">
      <a href="/" className="flex items-center gap-4">
        <Image
          src="/logo.png"
          alt="더트립가이드 로고"
          width={72}
          height={72}
          className="w-[72px] h-[72px]"
        />
        <h1 className="text-4xl font-black text-emerald-600">더트립가이드</h1>
      </a>
    </header>
  );
}
