export function TestSVG(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 700 700"
      width="700"
      height="700"
    >
      <defs>
        <radialGradient id="gggrain-gradient" r="1">
          <stop offset="0%" stop-color="hsl(286, 100%, 60%)"></stop>
          <stop offset="50%" stop-color="hsl(227, 100%, 50%)"></stop>
          <stop offset="100%" stop-color="hsl(194, 83%, 49%)"></stop>
        </radialGradient>
        <filter
          id="gggrain-filter"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.78"
            numOctaves="2"
            seed="2"
            stitchTiles="stitch"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="turbulence"
          ></feTurbulence>
          <feColorMatrix
            type="saturate"
            values="0"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="turbulence"
            result="colormatrix"
          ></feColorMatrix>
          <feComponentTransfer
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="colormatrix"
            result="componentTransfer"
          >
            <feFuncR type="linear" slope="3"></feFuncR>
            <feFuncG type="linear" slope="3"></feFuncG>
            <feFuncB type="linear" slope="3"></feFuncB>
          </feComponentTransfer>
          <feColorMatrix
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="componentTransfer"
            result="colormatrix2"
            type="matrix"
            values="1 0 0 0 0
          0 1 0 0 0
          0 0 1 0 0
          0 0 0 18 -10"
          ></feColorMatrix>
        </filter>
      </defs>
      <g>
        <rect width="100%" height="100%" fill="url(#gggrain-gradient)"></rect>
        <rect
          width="100%"
          height="100%"
          fill="transparent"
          filter="url(#gggrain-filter)"
          opacity="0.78"
          style={{ mixBlendMode: "soft-light" }}
        ></rect>
      </g>
    </svg>
  );
}
