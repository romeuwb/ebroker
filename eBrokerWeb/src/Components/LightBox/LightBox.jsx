import React from "react";
import Carousel, { Modal, ModalGateway } from "react-images";

const LightBox = ({ photos, viewerIsOpen, currentImage, onClose, title_image }) => {
    if (!photos || photos.length === 0) {
        // Handle the case when photos is undefined or empty.
        return null;
    }

    // Create an array to include title_image at index 0
    const lightboxPhotos = title_image ? [{ image_url: title_image }, ...photos] : photos;

    return (
        <div>
            <ModalGateway>
                {viewerIsOpen ? (
                    <Modal onClose={onClose}>
                        <Carousel
                            currentIndex={currentImage}
                            views={lightboxPhotos.map((photo, index) => {
                                // Check if the 'src' property exists before accessing it
                                const src = photo.image_url || ""; // Provide a default value if 'src' doesn't exist

                                return {
                                    src: src,
                                    srcset: `${src} ${index}`,
                                    
                                };
                            })}
                        />
                    </Modal>
                ) : null}
            </ModalGateway>
        </div>
    );
};

export default LightBox;