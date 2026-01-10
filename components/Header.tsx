import Image from "next/image";

export default function Header() {
  return (
    <header className="mb-14 flex flex-row place-content-between">
      <a href="/" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="더트립가이드 로고"
          width={56}
          height={56}
          className="w-14 h-14"
        />
        <h1 className="text-2xl font-black text-emerald-600">더트립가이드</h1>
      </a>
    </header>
  );
}
