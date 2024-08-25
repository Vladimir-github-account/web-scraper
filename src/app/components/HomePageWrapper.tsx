import { FC, ReactNode } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Header } from '@/src/app/components/Header';

interface HomePageWrapperProps {
  children: ReactNode;
}

export const HomePageWrapper: FC<HomePageWrapperProps> = ({
  children,
}) => (
  <Box minH='100vh' width='100vw' overflow='hidden'>
    <Header />
    <Flex as='main' overflow='hidden'>
      {children}
    </Flex>
  </Box>
);
