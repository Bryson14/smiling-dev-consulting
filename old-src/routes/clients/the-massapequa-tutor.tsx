import TheMassapequaTutor from "@/components/clients/massapequa-tutor";
import { Helmet } from "react-helmet";

export default function TheMassapequaTutorPage() {
  return (
    <>
      <Helmet>
        <title>The Massapequa Tutor Case Study - Smiling Tech Consulting</title>
        <meta
          name="description"
          content="See how we built a custom React & AWS platform managing 500+ tutor-student relationships. Full-stack educational solution with automated scheduling, payments, and real-time matching."
        />
      </Helmet>

      <TheMassapequaTutor />
    </>
  );
}
