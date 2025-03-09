import { ErrorSchema } from "../models/ErrorSchema";

export class CommunityResponse {
    error_schema: ErrorSchema;
    output_schema: {
      posts: {
        id: string;
        name: string;
        profilePicture: string;
        postImage: string;
        caption: string;
        fullCaption: string;
        time: string;
        isLiked: boolean;
        likes: number;
        comments: number;
      }[];
    };
  
    constructor(
      error_schema: ErrorSchema,
      output_schema: {
        posts: {
          id: string;
          name: string;
          profilePicture: string;
          postImage: string;
          caption: string;
          fullCaption: string;
          time: string;
          isLiked: boolean;
          likes: number;
          comments: number;
        }[];
      }
    ) {
      this.error_schema = error_schema;
      this.output_schema = output_schema;
    }
  }