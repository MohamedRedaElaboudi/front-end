import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import DataTable from "../Tables/DataTable";
import Button from "../../components/ui/button/Button";
import ServiceTable from "../Tables/ServiceTable";

export default function Service() {
  const navigate = useNavigate();

  return (
    <>
      <PageBreadcrumb pageTitle="Gestionnaire des Services" />
        <div className=" w-full ">
          <div className="mb-4 flex justify-end">
            <Button onClick={() => navigate("/ajouterService")}>
              Ajouter Service
            </Button>
          </div>

         
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-md ">

        <ServiceTable />
        </div>
    </>
  );
}