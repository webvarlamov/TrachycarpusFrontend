export interface VideoContentModel {
  id: string;
  sourceURL: string;
  videoContentOwnerType: string;
  title: string;
  subTitle: string;
  description: string;
  rating: number;
}

export class VideoContent implements VideoContentModel {
  id: string;
  sourceURL: string;
  videoContentOwnerType: string;
  title: string;
  subTitle: string;
  description: string;
  rating: number;

  constructor(params: VideoContentModel) {
    this.id = params.id;
    this.sourceURL = params.sourceURL;
    this.videoContentOwnerType = params.videoContentOwnerType
    this.title= params.title;
    this.subTitle= params.subTitle;
    this.description= params.description;
    this.rating= params.rating;
  }
}
