import Link from 'next/link';

const FooterNavigation = ({ title }) => {
  let linkUrl;

  if (title === '回到首页') {
    linkUrl = '/';
  } else if (title === '回到日历') {
    linkUrl = '/calendar';
  } else if (title === '回到歌曲列表') {
    linkUrl = '/list';
  } else {
    linkUrl = '/'; // 如果传入的title没有匹配的路由，可以设置一个默认的路由
  }

  return (
    <Link href={linkUrl}>
      <div className="container mx-auto max-w-screen-sm p-4 items-center fixed bottom-0 z-10 bg-sky-300">
        <div className=" text-slate-900 text-2xl text-center ">{title}</div>
      </div>
    </Link>
  );
};

export default FooterNavigation;
