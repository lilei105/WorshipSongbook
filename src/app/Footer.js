export default ({ title }) => {
  return (
    <div className="container mx-auto max-w-screen-sm bg-teal-300 p-4 items-center fixed bottom-0 z-10">
      <div className=" text-slate-900 text-xl">{title}</div>
    </div>
  );
};
