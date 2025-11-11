// Minimal Strapi auth helper for client-side usage
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetchData(
  token: string | null,
  endpoint: string
): Promise<any> {
  const res = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function postData(
  token: string | null,
  endpoint: string,
  data: any
): Promise<any> {
  const res = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function putData(
  token: string | null,
  endpoint: string,
  data: any
): Promise<any> {
  const res = await fetch(`${BACKEND_URL}/api/${endpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function uploadImage(
  token: string,
  ref: string,
  refId: number | undefined,
  field: string,
  file: File | null
): Promise<number | null> {
  try {
    const formData = new FormData();
    if (file) {
      formData.append("files", file);
    }
    // formData.append("ref", ref);
    // formData.append("refId", refId ? refId.toString() : "");
    // formData.append("field", field);
    // formData.append("publishedAt", new Date().toISOString());

    // console.log("Uploading image to Strapi:", formData.get("files"));
    // console.log(
    //   "other details:",
    //   formData.get("ref"),
    //   formData.get("refId"),
    //   formData.get("field")
    // );

    const res = await fetch(`${BACKEND_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    console.log("Upload done", res);

    if (!res.ok) {
      console.error("Failed to upload image:", await res.text());
      return null;
    }

    const uploadedFiles = await res.json();
    const imageId = uploadedFiles[0].id;
    console.log("Uploaded image ID:", imageId);
    if (uploadedFiles && uploadedFiles.length > 0) {
      return uploadedFiles[0].id;
    }
    return null;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}
