import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#08090b] text-white">

      {/* ======================================== */}
      {/* NAVBAR */}
      {/* ======================================== */}

      <Navbar />

      {/* ======================================== */}
      {/* HERO */}
      {/* ======================================== */}

      <main>

        <section className="relative flex min-h-screen items-center px-6 pt-20 md:px-10">

          {/* Background glow */}

          <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#B7FF00]/5 blur-[120px]" />

          <div className="relative mx-auto w-full max-w-7xl">

            <div className="max-w-4xl">

              {/* Small label */}

              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2">

                <span className="h-2 w-2 rounded-full bg-[#B7FF00]" />

                <span className="text-xs font-medium tracking-[0.15em] text-zinc-400">
                  BUILDING A BETTER BANGLADESH
                </span>

              </div>

              {/* Heading */}

              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">

                আপনার এলাকার
                <br />

                <span className="text-[#B7FF00]">
                  সমস্যা জানান।
                </span>

              </h1>

              {/* Description */}

              <p className="mt-8 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
                রাস্তা, পানি, বিদ্যুৎ, ড্রেনেজ কিংবা
                অন্যান্য নাগরিক সমস্যা সহজেই রিপোর্ট
                করুন। সমস্যার সঠিক অবস্থান ও ছবি
                যোগ করুন এবং সমাধানের অগ্রগতি ট্র্যাক
                করুন।
              </p>

              {/* CTA */}

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                <Link
                  to="/report"
                  className="rounded-xl bg-[#B7FF00] px-7 py-4 text-center text-sm font-bold text-black transition hover:scale-[1.02] hover:opacity-90"
                >
                  সমস্যা রিপোর্ট করুন →
                </Link>

                <Link
                  to="/explore"
                  className="rounded-xl border border-zinc-800 bg-zinc-950 px-7 py-4 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                >
                  সমস্যাগুলো দেখুন
                </Link>

              </div>

            </div>

          </div>
        </section>

        {/* ======================================== */}
        {/* FEATURES */}
        {/* ======================================== */}

        <section className="border-t border-zinc-900 px-6 py-24 md:px-10">

          <div className="mx-auto max-w-7xl">

            <div className="grid gap-6 md:grid-cols-3">

              {/* Card 1 */}

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7 transition hover:border-zinc-700">

                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#B7FF00] text-xl text-black">
                  📍
                </div>

                <h2 className="text-xl font-semibold">
                  সঠিক অবস্থান
                </h2>

                <p className="mt-3 leading-7 text-zinc-500">
                  ম্যাপে সমস্যার সঠিক অবস্থান
                  নির্বাচন করুন এবং প্রয়োজন হলে
                  আপনার বর্তমান অবস্থান ব্যবহার করুন।
                </p>

              </div>

              {/* Card 2 */}

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7 transition hover:border-zinc-700">

                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#B7FF00] text-xl text-black">
                  📷
                </div>

                <h2 className="text-xl font-semibold">
                  প্রমাণসহ রিপোর্ট
                </h2>

                <p className="mt-3 leading-7 text-zinc-500">
                  সমস্যার ছবি ও বিস্তারিত তথ্য
                  যোগ করে একটি পরিষ্কার এবং
                  কার্যকর রিপোর্ট তৈরি করুন।
                </p>

              </div>

              {/* Card 3 */}

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7 transition hover:border-zinc-700">

                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#B7FF00] text-xl text-black">
                  ✓
                </div>

                <h2 className="text-xl font-semibold">
                  অগ্রগতি ট্র্যাক করুন
                </h2>

                <p className="mt-3 leading-7 text-zinc-500">
                  আপনার রিপোর্টের status দেখুন এবং
                  সমস্যাটি পর্যালোচনা বা সমাধান হয়েছে
                  কিনা তা জানতে পারবেন।
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ======================================== */}
        {/* HOW IT WORKS */}
        {/* ======================================== */}

        <section className="border-t border-zinc-900 px-6 py-24 md:px-10">

          <div className="mx-auto max-w-7xl">

            <div className="max-w-2xl">

              <p className="text-xs font-medium tracking-[0.25em] text-[#B7FF00]">
                HOW IT WORKS
              </p>

              <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl">
                তিনটি সহজ ধাপে
                <br />
                <span className="text-zinc-500">
                  সমস্যা জানান।
                </span>
              </h2>

            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">

              {/* Step 01 */}

              <div className="border-t border-zinc-800 pt-6">

                <span className="text-sm font-mono text-[#B7FF00]">
                  01
                </span>

                <h3 className="mt-5 text-xl font-semibold">
                  রিপোর্ট তৈরি করুন
                </h3>

                <p className="mt-3 leading-7 text-zinc-500">
                  সমস্যার ধরন, বিস্তারিত তথ্য,
                  ছবি এবং অবস্থান যোগ করুন।
                </p>

              </div>

              {/* Step 02 */}

              <div className="border-t border-zinc-800 pt-6">

                <span className="text-sm font-mono text-[#B7FF00]">
                  02
                </span>

                <h3 className="mt-5 text-xl font-semibold">
                  রিপোর্ট ট্র্যাক করুন
                </h3>

                <p className="mt-3 leading-7 text-zinc-500">
                  আপনার রিপোর্টের বর্তমান status
                  My Reports থেকে দেখুন।
                </p>

              </div>

              {/* Step 03 */}

              <div className="border-t border-zinc-800 pt-6">

                <span className="text-sm font-mono text-[#B7FF00]">
                  03
                </span>

                <h3 className="mt-5 text-xl font-semibold">
                  পরিবর্তন দেখুন
                </h3>

                <p className="mt-3 leading-7 text-zinc-500">
                  রিপোর্টের status পরিবর্তনের মাধ্যমে
                  সমস্যার অগ্রগতি সম্পর্কে জানুন।
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* ======================================== */}
        {/* CTA */}
        {/* ======================================== */}

        <section className="border-t border-zinc-900 px-6 py-24 md:px-10">

          <div className="mx-auto max-w-7xl">

            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 px-6 py-16 text-center md:px-12">

              <p className="text-xs font-medium tracking-[0.25em] text-[#B7FF00]">
                YOUR CITY. YOUR VOICE.
              </p>

              <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
                আপনার এলাকার সমস্যা
                <span className="text-[#B7FF00]">
                  {" "}চুপ করে দেখবেন না।
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-xl leading-7 text-zinc-500">
                একটি রিপোর্ট হয়তো ছোট মনে হতে পারে,
                কিন্তু অনেক মানুষের রিপোর্ট থেকেই
                বড় পরিবর্তনের শুরু হতে পারে।
              </p>

              <Link
                to="/report"
                className="mt-8 inline-block rounded-xl bg-[#B7FF00] px-7 py-4 text-sm font-bold text-black transition hover:scale-[1.02] hover:opacity-90"
              >
                এখনই রিপোর্ট করুন →
              </Link>

            </div>

          </div>

        </section>

      </main>

      {/* ======================================== */}
      {/* FOOTER */}
      {/* ======================================== */}

      <footer className="border-t border-zinc-900 px-6 py-10 md:px-10">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <Link
            to="/"
            className="text-xl font-bold text-white"
          >
            oniyom<span className="text-[#B7FF00]">.</span>
          </Link>

          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Oniyom.
            All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Home;