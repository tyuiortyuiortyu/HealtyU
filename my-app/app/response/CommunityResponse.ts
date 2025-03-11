import { ErrorSchema } from "../models/ErrorSchema";

export class CommunityResponse {
  error_schema: ErrorSchema;
  output_schema: {
    posts: {
      id: number;
      name: string;
      profilePicture?: string;
      postImage?: string;
      caption: string;
      fullCaption: string;
      time: string;
      isCaptionExpanded: boolean;
      isLiked: boolean;
      likes: number;
      comments: {
        id: number;
        text: string;
        username: string;
        time: string;
      }[];
    }[];
  };

  constructor(
    error_schema: ErrorSchema,
    output_schema: {
      posts: {
        id: number;
        name: string;
        profilePicture?: string;
        postImage?: string;
        caption: string;
        fullCaption: string;
        time: string;
        isCaptionExpanded: boolean;
        isLiked: boolean;
        likes: number;
        comments: {
          id: number;
          text: string;
          username: string;
          time: string;
        }[];
      }[];
    }
  ) {
    this.error_schema = error_schema;
    this.output_schema = output_schema;
  }
}

export default CommunityResponse;