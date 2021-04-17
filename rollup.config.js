
export default {
  input: "./node_modules/@inrupt/solid-common-vocab/dist/index.es.js",
  output: [
    {
      file: "solid-common-vocab.bundle.js",
      format: "iife",
      name: "SolidVocab",
      inlineDynamicImports: true,
    },
  ],
  plugins: [
  ],
};