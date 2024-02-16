/** @type {import('next').NextConfig} */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }
    return config
  }
}
module.exports = {
  devIndicators: {
      buildActivity: false
  }
}

// Conditionally set the output based on the environment
if (process.env.NEXT_PUBLIC_SEO === "false") {
  nextConfig.output = 'export',
  nextConfig.images.unoptimized = true
}

module.exports = nextConfig
