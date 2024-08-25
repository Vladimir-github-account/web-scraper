import { useState } from 'react';
import { Box, Button, Flex, Heading, Hide, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { useSearchContext } from '@/src/app/contexts/searchContext';

export const Header = () => {
  const { setText } = useSearchContext();
  const [id, setId] = useState('');

  return (
    <Flex
      as="header"
      bgColor="rgb(39 39 42)"
      borderBottom="1px"
      borderColor="#3f3f46"
      pl={{ base: 4, md: 0 }}
      pr={4}
      py={2}
      position="fixed"
      top={0}
      w="full"
      zIndex={1}
      alignItems='center'
      suppressHydrationWarning
    >
      <Hide below='md'>
        <Heading fontSize={32} minW={80} textAlign='center'>
          Web Scraper
        </Heading>
      </Hide>

      <Box w="full" maxW="64rem">
        <form
          onSubmit={e => {
            e.preventDefault();
            setId('');
            setText(id);
          }}
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              setId('');
              setText(id);
            }
          }}
        >
          <InputGroup size="md">
            <Input
              bg="rgb(229 231 235)"
              color="gray.900"
              _placeholder={{ color: 'gray.500' }}
              pr="4.5rem"
              placeholder="Enter solicitation id"
              value={id}
              onChange={(event) => {
                setId(event.target.value);
              }}
            />
            <InputRightElement width="4.5rem">
              <Button
                bg="#1A202C"
                _hover={{ bg: 'gray.600' }}
                h="1.75rem"
                size="sm"
                type="submit"
              >
                <ArrowForwardIcon/>
              </Button>
            </InputRightElement>
          </InputGroup>
        </form>
      </Box>
    </Flex>
  );
};
