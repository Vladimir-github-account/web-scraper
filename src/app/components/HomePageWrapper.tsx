import { Box, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const HomePageWrapper = ({ children } : { children: ReactNode}) => {
  return (
    <Box minH='100vh' width='100vw' overflow='hidden'>
      <Flex as='main' overflow='hidden'>
        {children}
      </Flex>
    </Box>
  );
};
