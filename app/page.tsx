export default function Home() {
  return (
    <main className="bg-gray-100 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-purple-100 h-screen flex items-center justify-center p-5">
      <div className="bg-white w-full shadow-lg p-5 rounded-3xl max-w-screen-sm flex flex-col gap-3">
        {["Nico", "Me", "You", "Yourself"].map((person, index) => (
          <div
            key={index}
            className="flex items-center gap-5 odd:bg-gray-100 even:bg-cyan-100 p-2.5 rounded-xl border-b-2 pb-5 last:border-green-300 first:border-red-300 "
          >
            <div className="size-10 bg-blue-400 rounded-full" />
            <div className="w-20 rounded-full bg-gray-400 animate-pulse">
              {person}
            </div>
            <div className="size-6 bg-red-500 text-white flex items-center justify-center rounded-full animate-bounce relative">
              <span className="z-10">{index}</span>
              <div className="size-6 bg-red-500 rounded-full absolute animate-ping" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
