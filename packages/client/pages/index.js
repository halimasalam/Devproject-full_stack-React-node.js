import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  router.push("/Dashboard");

  return (
    <div>
      <Head>
        <title>Calorie Tracker</title>
        <meta name="description" content="Calorie app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
