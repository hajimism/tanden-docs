import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center text-center flex-1 gap-6 px-4">
      <h1 className="text-4xl font-bold tracking-tight">
        Tanden Open Handbook
      </h1>
      <p className="text-lg text-fd-muted-foreground max-w-xl mx-auto">
        株式会社Tandenのオープンハンドブックです。
        <br />
        会社の文化・制度・働き方などを公開しています。
      </p>
      <div>
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-full bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
        >
          ハンドブックを読む →
        </Link>
      </div>
    </div>
  );
}
