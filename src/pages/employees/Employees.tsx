import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DataTable from "../Tables/DataTable";
import Button from "../../components/ui/button/Button";

export default function Page() {
  const navigate = useNavigate();

  return (
    <>
      <PageBreadcrumb pageTitle="Gestionnaire des Employés" />
        <div className=" w-full ">
          <div className="mb-7 flex justify-end">
            <Button onClick={() => navigate("/ajouterEmployee")}>
              Ajouter employé
            </Button>
          </div>

         
        </div>
        <div className="rounded-2xl  shadow-md ">
        <DataTable />
        </div>
    </>
  );
}