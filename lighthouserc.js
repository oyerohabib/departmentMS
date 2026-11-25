module.exports = {
  ci: {
    collect: {
      url: [
        "http://127.0.0.1:3000/",
        "http://127.0.0.1:3000/login",
        "http://127.0.0.1:3000/register",
      ],
      numberOfRuns: 1,
      settings: {
        onlyCategories: ["performance"],
        chromeFlags: "--no-sandbox --headless",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.5 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "./benchmarks/baseline/frontend/lhci",
    },
  },
};
