import CloudServices from "@/components/services/cloud-dev";
import { Helmet } from "react-helmet";

export default function CloudDevPage() {
  return (
    <>
      <Helmet>
        <title>Smiling Cloud & Backend Development</title>
        <meta
          name="description"
          content="From simple file storage to complex backend systems, we build cloud solutions that grow with your business. AWS expertise in storage, databases, serverless, and more."
        />
        <meta
          name="keywords"
          content="cloud development, AWS, backend development, cloud storage, database, serverless, cloud computing"
        />
      </Helmet>
      <CloudServices />
    </>
  );
}
