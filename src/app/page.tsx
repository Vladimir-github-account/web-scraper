'use client';

import { useEffect, useState } from 'react';
import { scraper } from './services/scraper';
import { HomePageWrapper } from '@/src/app/components/HomePageWrapper';
import { useSearchContext } from '@/src/app/contexts/searchContext';
import { Flex, Heading, Skeleton, SkeletonText, Stack, Text, Link } from '@chakra-ui/react';
import { AxiosError } from 'axios';

type IDataState = {
  title: string;
  id: string;
  closeDate: string;
  summary: string;
  mainCategory: string;
  type: string;
  attachments: string[];
} | null;

export default function Home() {
  const { text, setText } = useSearchContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<IDataState>(null);

  const getData = async (text: string) => {
    if (text === '') {
      return;
    }

    setLoading(true);
    setError(null);
    setText('');

    try {
      const { data } = await scraper(text);
      setData(data);
    } catch (err: unknown) {
      setData(null);
      setError((err as AxiosError).status === 404 ? 'Solicitation not found for specified id.' : 'Oops, something went wrong...');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (text) {
      getData(text);
    }
  }, [text]);

  return (
    <HomePageWrapper>
      <Flex
        direction='column'
        pt={20}
        w='100%'
      >
        {error &&
          <Text
            fontWeight='medium'
            placeSelf='center'
            justifySelf='center'
            fontSize={{ base: 16, md: 28 }}
            mt={64}
          >
            {error}
          </Text>
        }
        {loading &&
          <Stack pl={{ base: 4, md: 80 }}>
            <Heading size='lg'>Scraper Data</Heading>
            <Flex gap={4} alignItems='center'>
              <Text fontWeight='medium'>Title:</Text>
              <Skeleton w={200} height='16px' />
            </Flex>
            <Flex gap={4} alignItems='center'>
              <Text fontWeight='medium'>Id:</Text>
              <Skeleton w={200} height='16px' />
            </Flex>
            <Flex gap={4} alignItems='center'>
              <Text fontWeight='medium'>Main Category:</Text>
              <Skeleton w={200} height='16px' />
            </Flex>
            <Flex gap={4} alignItems='center'>
              <Text fontWeight='medium'>Solicitation Type:</Text>
              <Skeleton w={200} height='16px' />
            </Flex>
            <Flex gap={4} alignItems='center'>
              <Text fontWeight='medium'>Due / Close Date (EST):</Text>
              <Skeleton w={180} height='16px' />
            </Flex>
            <Text fontWeight='medium'>Summary</Text>
            <SkeletonText w={650} mt={1} noOfLines={4} spacing='4' skeletonHeight='3' />
            <Text fontWeight='medium'>Attachments</Text>
            <SkeletonText w={650} mt={1} noOfLines={4} spacing='4' skeletonHeight='3' />
          </Stack>
        }
        {data && !loading &&
          <Stack pl={{ base: 4, md: 80 }} pr={8}>
            <Heading size='lg'>Scraper Data</Heading>
            <Text fontWeight='medium'>Title: <Text as='span' fontWeight='normal'>{data?.title}</Text></Text>
            <Text fontWeight='medium'>Id: <Text as='span' fontWeight='normal'>{data?.id}</Text></Text>
            <Text fontWeight='medium'>Main Category: <Text as='span' fontWeight='normal'>{data?.mainCategory}</Text></Text>
            <Text fontWeight='medium'>Solicitation Type: <Text as='span' fontWeight='normal'>{data?.type}</Text></Text>
            <Text fontWeight='medium'>Due / Close Date (EST): <Text as='span' fontWeight='normal'>{data?.closeDate}</Text></Text>
            <Text fontWeight='medium'>Summary</Text>
            <Text maxW={1024}>{data?.summary}</Text>
            <Text fontWeight='medium'>Attachments</Text>
            {data?.attachments.map(attachment => (
              <Link
                target='_blank'
                href={attachment}
                key={attachment}
              >
                {attachment}
              </Link>
            ))}
          </Stack>
        }
      </Flex>
    </HomePageWrapper>
  );
}
