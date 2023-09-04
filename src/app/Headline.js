export default function Headline({ title }) {
  return (
    <div className="container mx-auto max-w-screen-sm p-4 items-center fixed top-0 z-10 bg-slate-200">
      <div className="whitespace-nowrap overflow-x-auto text-slate-900 text-2xl">
        {title}
      </div>
    </div>
  );
}
