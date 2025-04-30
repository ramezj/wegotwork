export default function Marquee({ items }: { items: string[] }) {
  return (
    <div className="relative bg-white flex w-full overflow-x-hidden border-b-4 border-t-4 border-border bg-secondary-background text-foreground font-base">
      <div className="animate-marquee whitespace-nowrap py-12">
        {items.map((item, index) => {
          return (
            <span key={index} className="mx-4 text-4xl text-black font-bold">
              {item}
            </span>
          )
        })}
      </div>

      <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-12">
        {items.map((item, index) => {
          return (
            <span key={index} className="mx-4 text-4xl text-black font-bold">
              {item}
            </span>
          )
        })}
      </div>
    </div>
  )
}
