export interface ImageUploadResponse {
  data: Data;
  status: number;
  success: boolean;
}

interface Data {
  delete_url: string;
  display_url: string;
  expiration: number;
  height: number;
  id: string;
  image: Image;
  medium: Medium;
  size: number;
  thumb: Thumb;
  time: number;
  title: string;
  url: string;
  url_viewer: string;
  width: number;
}

interface Image {
  extension: string;
  filename: string;
  mime: string;
  name: string;
  url: string;
}

interface Medium {
  extension: string;
  filename: string;
  mime: string;
  name: string;
  url: string;
}

interface Thumb {
  extension: string;
  filename: string;
  mime: string;
  name: string;
  url: string;
}
