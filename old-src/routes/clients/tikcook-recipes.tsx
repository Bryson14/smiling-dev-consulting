import TikCookRecipes from "@/components/clients/tikcook-recipes";
import { Helmet } from "react-helmet";

export default function TheMassapequaTutorPage() {
  return (
    <>
      <Helmet>
        <title>The Massapequa Tutor Case Study - Smiling Tech Consulting</title>
        <meta
          name="description"
          content="Discover and share recipes on TikCook, a modern recipe platform with lightning-fast performance. Browse beautiful recipes or easily create your own using our intuitive CMS."
        />
      </Helmet>

      <TikCookRecipes />
    </>
  );
}
