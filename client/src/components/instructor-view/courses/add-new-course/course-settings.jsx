import MediaProgressbar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService, documentUploadService } from "@/services";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const [notesUploadProgress, setNotesUploadProgress] = useState(0);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
        setMediaUploadProgress(false);
      }
    }
  }

  async function handleNotesUpload(event) {
    event.preventDefault();

    const file = event.target.files[0];
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Append the file to the FormData

    try {
      console.log("Starting upload for:", file.name);

      const response = await documentUploadService(formData, (progress) => {
        setNotesUploadProgress(progress);
      });

      console.log("Upload response:", response);
      if (response.success) {
        setCourseLandingFormData({
          ...courseLandingFormData,
          notes: response.data.url, // Store the PDF URL in the notes field
        });
        toast.success("Notes uploaded successfully!");
      } else {
        toast.error("Failed to upload notes. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to upload notes. Please try again.");
      console.error("Error uploading notes:", error);
    } finally {
      setNotesUploadProgress(0); // Reset progress after upload
    }
  }

  const previewUrl = courseLandingFormData?.notes.replace(
    "/upload/",
    "/upload/fl_attachment/"
  );

  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
    previewUrl
  )}&embedded=true`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <div className="p-4">
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
      </div>
      <CardContent>
        {/* Course Image Upload Section */}
        {courseLandingFormData?.image ? (
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold">Course Image</h4>
            <img src={courseLandingFormData.image} alt="Course" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Label htmlFor="courseImage">Upload Course Image</Label>
            <Input
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
              id="courseImage"
            />
          </div>
        )}
      </CardContent>

      <CardContent>
        {/* Notes Upload Section */}
        {courseLandingFormData?.notes ? (
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold">Notes</h4>
            <iframe
              src={googleViewerUrl}
              title="Course Notes Preview"
              width="100%"
              height="600px"
              style={{ border: "none" }}
            ></iframe>
          </div>
        ) : (
          <div className="mt-6">
            <h4 className="font-semibold">Upload Notes</h4>
            <Label htmlFor="courseNotes">Choose PDF or TXT File</Label>
            <Input
              type="file"
              accept=".pdf, .txt"
              onChange={handleNotesUpload}
              className="mb-4"
              id="courseNotes"
            />
            {notesUploadProgress > 0 && (
              <div className="w-full mt-2">
                <MediaProgressbar
                  isMediaUploading={notesUploadProgress > 0}
                  progress={notesUploadProgress}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
