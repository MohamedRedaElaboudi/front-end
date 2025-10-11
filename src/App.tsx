import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Home from "./pages/Dashboard/Home";
import UserProfiles from "./pages/UserProfiles";
import Employees from "./pages/employees/Employees";
import AjouterEmployee from "./pages/employees/AjouterEmployee";
import EmployeProfile from "./pages/employees/EmployeProfile";
import EmailBuilder from "./pages/Formation/EmailEditor";
import Formation from "./pages/Formation/Formation";
import AjouterFormation from "./pages/Formation/AjouterFormation";
import FormationDetails from "./pages/Formation/FormationDetails";
import FichePresence from "./pages/Formation/Fichpresence";
import FichePresenceReadOnly from "./pages/Formation/FichePresenceReadOnly";
import AjouterService from "./pages/Service_gestion/AjouterService";
import Service from "./pages/Service_gestion/Service";
import ServiceDetails from "./pages/Service_gestion/ServiceDetails";
import Calendar from "./pages/Calendar";
import Blank from "./pages/Blank";
import FormElements from "./pages/Forms/FormElements";
import BasicTables from "./pages/Tables/BasicTables";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import PageAvecQcm from "./pages/qcm/parent";
import Example from "./components/charts/pie/chartPie";
import MonComposant from "./pages/QuestionConfigPage";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Private Routes avec Dashboard */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="profile" element={<UserProfiles />} />
          <Route path="employees" element={<Employees />} />
          <Route path="ajouterEmployee" element={<AjouterEmployee />} />
          <Route path="employeProfile/:id" element={<EmployeProfile />} />
          <Route path="emailBuilder/:id" element={<EmailBuilder />} />
          <Route path="formation" element={<Formation />} />
          <Route path="ajouterFormation" element={<AjouterFormation />} />
          <Route path="formationDetails/:id" element={<FormationDetails />} />
          <Route path="fichePresence/:id" element={<FichePresence />} />
          <Route path="listePresence/:id" element={<FichePresenceReadOnly />} />
          <Route path="ajouterService" element={<AjouterService />} />
          <Route path="services" element={<Service />} />
          <Route path="serviceDetails/:id" element={<ServiceDetails />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="blank" element={<Blank />} />
          <Route path="form-elements" element={<FormElements />} />
          <Route path="basic-tables" element={<BasicTables />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="avatars" element={<Avatars />} />
          <Route path="badge" element={<Badges />} />
          <Route path="buttons" element={<Buttons />} />
          <Route path="images" element={<Images />} />
          <Route path="videos" element={<Videos />} />
          <Route path="line-chart" element={<LineChart />} />
          <Route path="bar-chart" element={<BarChart />} />
          <Route path="/configurations" element={<MonComposant/>} />

          <Route path="statistiqueformation/:formationId" element={<Example />} />
        </Route>

        {/* Routes sans Dashboard / sidebar */}
        <Route path="/evaluationformationachaud/:formationId" element={<PageAvecQcm />} />
        <Route path="/test/:formationId" element={<PageAvecQcm />} />

        <Route path="/test" element={<MonComposant/>} />


        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
