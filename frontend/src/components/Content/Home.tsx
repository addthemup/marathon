import { HeroText } from './HeroText';
import { HeroHeader } from './HeroHeader';
import { HeroProducts } from './HeroProducts';

export default function Home() {
  return (
    <div>
      <HeroHeader />
      <HeroText />
      <HeroProducts />
    </div>
  );
}
