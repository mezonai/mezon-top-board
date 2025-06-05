import { GetMezonAppDetailsResponse } from "@app/services/api/mezonApp/mezonApp.types";
import { useState } from "react";
import CreateAppModal from "./CreateAppModal";
import EditModal from "./EditAppModal";
import MezonApps from './MezonApps';

const MezonAppsContainer = () => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedApp, setSelectedApp] = useState<GetMezonAppDetailsResponse>();

  const handleEdit = (app: GetMezonAppDetailsResponse) => {
    setSelectedApp(app);
    setIsEditModalVisible(true);
  };

  return (
    <>
      <div className="mb-4">
        <CreateAppModal />
      </div>
      <MezonApps onEdit={handleEdit} />
      <EditModal
        isVisible={isEditModalVisible}
        selectedApp={selectedApp}
        onClose={() => setIsEditModalVisible(false)}
      />
    </>
  )
};

export default MezonAppsContainer