import Hero from "../components/Hero";
import QuickAccess from "../components/QuickAccess";
import Boletin from "../components/Boletin";
import Efemerides from "../components/Efemerides";
import Birthdays from "../components/Birthdays";
import IngredienteMes from "../components/IngredienteMes";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickAccess />
      <section className="dashboard">
        <Boletin />
        <Efemerides />
        <Birthdays />
        <IngredienteMes />
      </section>
    </>
  );
}
