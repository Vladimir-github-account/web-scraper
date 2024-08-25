'use client';

import { useEffect, useState } from 'react';
import { scraper } from './services/scraper';
import { HomePageWrapper } from '@/src/app/components/HomePageWrapper';


export default function Home() {
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);

    try {
      const { data } = await scraper('BPM045787');
      console.log('data', data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <HomePageWrapper>
      {loading ? <p>Loading...</p> : <p>Done</p>}
    </HomePageWrapper>
  );
}
