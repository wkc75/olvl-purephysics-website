import createMDX from "@next/mdx";

const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [["remark-math"]],
    rehypePlugins: [["rehype-katex"]],
  },
});

export default withMDX(nextConfig);
