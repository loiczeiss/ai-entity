import { IntroModal } from '@/components/intro';
import {redirect} from "next/navigation";

export default async function Home() {
  // return <IntroModal />;
    redirect('/entity')
}
