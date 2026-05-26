export const getApiOrigin = () => {
  const apiBase = import.meta.env.VITE_API_URL;
  if (!apiBase || apiBase.startsWith('/')) {
    return window.location.origin;
  }

  try {
    const url = new URL(apiBase);
    return `${url.protocol}//${url.host}`;
  } 
  catch {
    return window.location.origin;
  }
};

export const getUploadedFileUrl = (relativeUrl) => {
  if (!relativeUrl) return null;
  if (/^https?:\/\//i.test(relativeUrl)) return relativeUrl;
  return `${getApiOrigin()}${relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`}`;
};

export const getCloudinaryDownloadUrl = (url, filename) => {
  if (!url) return null;
  if (!url.includes('cloudinary.com')) return url;
  
  // Replace /upload/ with /upload/fl_attachment/ and optionally set original filename
  // format: .../upload/fl_attachment:<filename_no_ext>/...
  try {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
    }
  } 
  catch (e) {
    console.error('Error parsing cloudinary URL', e);
  }
  return url;
};
