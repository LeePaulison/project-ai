import { useState } from 'react';
import { Box, Center, FormControl, Input, Text, Button, Code, ListItem, UnorderedList, OrderedList, Heading } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import OpenAI from 'openai';
import rehypeRaw from 'rehype-raw'; // To allow raw HTML rendering

function App() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const submitQuery = async (e) => {
    e.preventDefault();

    if (!query) {
      setError('Query cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await openai.chat.completions.create({
        model: import.meta.env.VITE_OPENAI_MODEL,
        messages: [{ role: 'user', content: query }],
        max_tokens: 1000,
        temperature: 0.3,
      });

      setResponse(result.choices[0].message.content);
    } catch (err) {
      setError(`Error: ${err.response ? err.response.data.error.message : err.message}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }

    setQuery('');
  };

  return (
    <Center h="100vh">
      <Box>
        <form onSubmit={submitQuery}>
          <FormControl>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} isInvalid={error} />
            <Button type="submit" mt={2} colorScheme="teal" isLoading={loading}>Submit</Button>
            {error && <Text color="red.500">{error}</Text>}
          </FormControl>
        </form>
        {response && (
          <Box mt={6} p={4} border="1px" borderColor="grey.300" borderRadius="md">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]} // This allows raw HTML in Markdown content
              components={{
                // Map Markdown elements to Chakra UI components
                h1: ({ children }) => <Heading as="h1" size="2xl" my={4}>{children}</Heading>,
                h2: ({ children }) => <Heading as="h2" size="xl" my={4}>{children}</Heading>,
                h3: ({ children }) => <Heading as="h3" size="lg" my={4}>{children}</Heading>,
                p: ({ children }) => <Text mb={2}>{children}</Text>,
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter style={dracula} language={match[1]} PreTag="div" {...props}>
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <Code {...props} fontSize="inherit">
                      {children}
                    </Code>
                  );
                },
                ul: ({ children }) => <UnorderedList spacing={2}>{children}</UnorderedList>,
                ol: ({ children }) => <OrderedList spacing={2}>{children}</OrderedList>,
                li: ({ children }) => <ListItem>{children}</ListItem>,
                // Add more mappings as needed
              }}
            >
              {response}
            </ReactMarkdown>
          </Box>
        )}
      </Box>
    </Center>
  );
}

export default App;
