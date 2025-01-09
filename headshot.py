import os
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url

# Configuration
cloudinary.config(
    cloud_name="dfqvoisnj",
    api_key="254229285989186",
    api_secret="FAeMyPjziqH8kCi08mK-fNYtb-s",  # Replace with your actual API secret
    secure=True
)

# Path to the media folder on the Desktop
media_folder = os.path.expanduser("~/Desktop/media")

# Supported image extensions
supported_extensions = ('.jpg')

# Get all image files from the media folder
image_files = [f for f in os.listdir(media_folder) if f.endswith(supported_extensions)]

# Upload images to Cloudinary
for image_file in image_files:
    file_path = os.path.join(media_folder, image_file)
    try:
        # Upload the image
        upload_result = cloudinary.uploader.upload(file_path, public_id=os.path.splitext(image_file)[0])
        print(f"Uploaded {image_file}: {upload_result['secure_url']}")
        
        # Generate optimized URL
        optimize_url, _ = cloudinary_url(
            os.path.splitext(image_file)[0], fetch_format="auto", quality="auto"
        )
        print(f"Optimized URL for {image_file}: {optimize_url}")

        # Generate auto-cropped URL
        auto_crop_url, _ = cloudinary_url(
            os.path.splitext(image_file)[0], width=500, height=500, crop="auto", gravity="auto"
        )
        print(f"Auto-cropped URL for {image_file}: {auto_crop_url}")
        
    except Exception as e:
        print(f"Failed to upload {image_file}: {e}")
