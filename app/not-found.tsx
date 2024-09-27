'use client';
//REACT
import { useEffect } from 'react';
//NEXT
import { useRouter } from 'next/navigation';


export default function NotFound(): JSX.Element {
    const router = useRouter();

    useEffect(() => {
        router.push("/");
    }, []);

    return <></>;
}