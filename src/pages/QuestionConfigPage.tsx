import PageBreadcrumb from "../components/common/PageBreadCrumb";
import QuestionConfig from "../components/questionsConfig/QuestionConfig";
import PageMeta from "../components/common/PageMeta";

export default function QuestionConfigPage() {
  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Configuration" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ">
        
          <QuestionConfig/>
      </div>
    </>
  );
}
