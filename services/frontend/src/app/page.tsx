export default function Home() {
  return (
    <main>
      <section>
        <div className="container min-h-screen bg-black p-8 md:p-16">
          <div className="container mx-auto mt-10 flex h-full flex-col-reverse items-center gap-6 space-y-0 px-6 md:flex-row md:space-y-0">
            <div className="mb-32 flex flex-col space-y-12 md:w-1/2">
              <h1 className="max-w-md text-center text-3xl font-bold text-white md:text-left md:text-4xl">
                The Ultimate Guide to Acing Tech Interviews
              </h1>
              <p className="max-w-sm text-center text-xl text-gray-200 md:text-left md:text-2xl">
                Prepare with confidence, perform with excellence, and land your
                ideal tech role.
              </p>
              <div className="flex justify-center md:justify-start">
                <a href="/" className=" rounded-full bg-red-600 p-3 text-white">
                  Start Now!
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <img src="peer-prep.jpg" alt="logo" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
