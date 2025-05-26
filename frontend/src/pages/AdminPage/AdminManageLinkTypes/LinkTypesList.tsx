import { useState } from "react";
import MediaManagerModal from "../AdminManageMedias/components/MediaManager"
import Button from "@app/mtb-ui/Button";

function LinkTypesList() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const handleChooseImage = (imagePath: string) => {
    setSelectedImage(imagePath);
    console.log("Selected image path:", imagePath);
    setIsModalVisible(false);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button onClick={() => setIsModalVisible(true)}>Open Media Manager</Button>

      {selectedImage && <img src={selectedImage} alt="Selected" style={{ maxWidth: '200px' }} />}

      <MediaManagerModal
        isVisible={isModalVisible}
        onChoose={handleChooseImage}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default LinkTypesList
