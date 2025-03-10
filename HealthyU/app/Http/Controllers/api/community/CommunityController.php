<?php

namespace App\Http\Controllers\api\community;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PostLike;
use App\Models\Post;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Helpers\ValidateJwt;
use App\Helpers\ApiResponse;
use Illuminate\Support\Facades\Validator;

class CommunityController extends Controller
{
    public function likePost(Request $request) {
        $user = ValidateJwt::validateAndGetUser();

        if (!$user) {
            return ApiResponse::mapResponse(null, "E002", "Unauthorized User");
        }

        $validator = Validator::make($request->all(), [
            'post_id' => 'required|exists:posts,id',
        ]);

        if ($validator->fails()) {
            return ApiResponse::mapResponse(null, "E002", $validator->errors());
        }

        $postID = $request->post_id;
        $existLike = PostLike::where('user_id', $user->id)->where('post_id', $postID)->first();

        if ($existLike) {
            $existLike->delete();
            return ApiResponse::mapResponse(null, "S001", "Unlike post success");
        }

        $like = PostLike::create([
            'user_id' => $user->id,
            'post_id' => $postID,
        ]);

        return ApiResponse::mapResponse($like, "S001", "Like post success");
    }

    public function getPosts(Request $request) {
        $user = ValidateJwt::validateAndGetUser();
        
        if (!$user) {
            return ApiResponse::mapResponse(null, "E002", "Unauthorized User");
        }

        $posts = Post::with('user')->inRandomOrder()->take(10)->get()->map(function ($post) use ($user) {
            $post->liked = PostLike::where('user_id', $user->id)->where('post_id', $post->id)->exists();
            return $post;
        });

        return ApiResponse::mapResponse($posts, "S001");
    }
}