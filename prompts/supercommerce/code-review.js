
const reviewCodePrompt = {
  id: "review-code",
  metadata: {
    title: "Code Review",
    description: "Review code for best practices and potential issues",
    argsSchema: [
        { 
            name: "code",
            description: "reivew this code",
            required: true,
        }]
   },
  handler: ({ code }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Please review this code:\n\n${code}`
        }
      }
    ]
  })
};

export default reviewCodePrompt;
