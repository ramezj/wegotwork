
export default function Marquee({ items }: { items: string[] }) {
  return (
    <div className="relative bg-theme flex w-full overflow-x-hidden border-b border-t border-white/20 bg-secondary-background text-foreground font-base">
      <div className="animate-marquee whitespace-nowrap py-12">
        {items.map((item, index) => {
          return (
            <span key={index} className="mx-4 text-4xl text-white font-bold">
              {item}
            </span>
          )
        })}
      </div>

      <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-12">
        {items.map((item, index) => {
          return (
            <span key={index} className="mx-4 text-4xl text-white font-bold">
              {item}
            </span>
          )
        })}
      </div>
    </div>
  )
}
