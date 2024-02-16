import Head from 'next/head'


const Meta = ({ title, description, keywords, ogImage, pathName }) => {

  return (
    <Head>
      {/* title */}
      <title>{title ? title : process.env.NEXT_PUBLIC_META_TITLE}</title>

      {/*<!-- Google / Search Engine Tags -->*/}
      <meta name='name' content={title ? title : process.env.NEXT_PUBLIC_META_TITLE} />
      <meta name='description' content={description ? description : process.env.NEXT_PUBLIC_META_DESCRIPTION} />
      <meta name='keywords' content={keywords ? keywords : process.env.NEXT_PUBLIC_META_KEYWORD} />
      <meta name='image' content={ogImage ? ogImage : null} />

      {/*<!-- Facebook Meta Tags -->*/}
      <meta property='og:title' content={title ? title : process.env.NEXT_PUBLIC_META_TITLE} />
      <meta property='og:description' content={description ? description : process.env.NEXT_PUBLIC_META_DESCRIPTION} />
      <meta property='og:image' content={ogImage ? ogImage : null} />
      <meta property='og:image:type' content='image/jpg' />
      <meta property='og:image:width' content='1080' />
      <meta property='og:image:height' content='608' />
      <meta property='og:url' content={pathName ? pathName : process.env.NEXT_PUBLIC_PATHNAME} />
      <meta property='og:type' content='website' />

      {/*<!-- Twitter Meta Tags -->*/}
      <meta name='twitter:title' content={title ? title : process.env.NEXT_PUBLIC_META_TITLE} />
      <meta name='twitter:description' content={description ? description : process.env.NEXT_PUBLIC_META_DESCRIPTION} />
      <meta name='twitter:image' content={ogImage ? ogImage : null } />
      <meta name='twitter:card' content='summary_large_image' />

      {/* robot and cononical */}
      <link rel='canonical' href={`${process.env.NEXT_PUBLIC_WEB_URL}`} />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <meta name='robots' content='index, follow,max-snippet:-1,max-video-preview:-1,max-image-preview:large' />

     
    </Head>
  )
}

export default Meta