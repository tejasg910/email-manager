import dynamic from 'next/dynamic';

const ClientSideComponent = dynamic(
  () => import('./Client'),
  { ssr: false }
);


export default function EmailManagement() {

  return (
    < ClientSideComponent />
  )
}


