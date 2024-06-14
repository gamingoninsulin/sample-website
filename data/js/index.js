const fileInput = document.getElementById("file-input");
const formatSelect = document.getElementById("format-select");
const convertBtn = document.getElementById("convert-btn");
const outputDiv = document.getElementById("output");
const statusDiv = document.getElementById("status");

convertBtn.addEventListener("click", async () => {
  console.log("Convert button clicked");

  const files = fileInput.files;
  const format = formatSelect.value;

  if (!files || files.length === 0) {
    console.error("No files selected");
    statusDiv.innerHTML = "Error: No files selected";
    return;
  }

  if (!format) {
    console.error("No format selected");
    statusDiv.innerHTML = "Error: No format selected";
    return;
  }

  outputDiv.innerHTML = "";
  statusDiv.innerHTML = "Converting...";

  const zip = new JSZip(); // Create a new ZIP archive
  const conversionPromises = []; // Array to store conversion promises

  for (const file of files) {
    console.log(`Converting file: ${file.name}`);

    const reader = new FileReader();
    const conversionPromise = new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        try {
          const imageDataUrl = event.target.result;
          const image = new Image();

          image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            const convertedDataUrl = canvas.toDataURL(`image/${format}`);
            const commaIndex = convertedDataUrl.indexOf(",");
            const base64Data = convertedDataUrl.substring(commaIndex + 1); // Extract base64 data

            const filename = file.name.replace(/\.[^.]+$/, `.${format}`);

            // Add converted image to ZIP archive
            zip.file(filename, base64Data, { base64: true });
            resolve(); // Resolve the conversion promise
          };

          image.src = imageDataUrl;
        } catch (error) {
          console.error(`Error converting file: ${file.name}`, error);
          reject(error); // Reject the promise on error
        }
      };

      reader.readAsDataURL(file);
    });

    conversionPromises.push(conversionPromise);
  }

  // Wait for all conversions to finish before generating ZIP
  try {
    await Promise.all(conversionPromises);
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "compressed.zip";
    a.click();
    URL.revokeObjectURL(a.href); // Revoke object URL after download
    statusDiv.innerHTML = `Conversion complete! Downloaded compressed.zip`;
  } catch (error) {
    console.error("Error during conversion:", error);
    statusDiv.innerHTML = "Conversion failed!";
  }
});
