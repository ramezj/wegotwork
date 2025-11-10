type baseLayoutProps = {
  title: String;
  children?: React.ReactNode;
  button?: React.ReactNode;
};

export function BaseLayout(props: baseLayoutProps) {
  return (
    <>
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="font-extrabold text-3xl tracking-tight text-foreground">
            {props.title}
          </h1>
        </div>
        <div>{props.button}</div>
      </div>
      <div className="flex flex-col gap-4 h-full w-full">{props.children}</div>
    </>
  );
}
